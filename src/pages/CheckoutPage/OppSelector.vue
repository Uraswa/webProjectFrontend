<script>
import Api from "src/shared/api/Api.js";

const YANDEX_MAPS_API_KEY = "f37d617f-0b15-46c4-accb-cd4bb04f1a44";
let yandexMapsPromise;

function loadYandexMaps() {
  if (typeof window !== "undefined" && window.ymaps) {
    return new Promise((resolve) => {
      window.ymaps.ready(() => resolve(window.ymaps));
    });
  }
  if (yandexMapsPromise) {
    return yandexMapsPromise;
  }

  yandexMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${YANDEX_MAPS_API_KEY}`;
    script.async = true;
    const timeoutId = setTimeout(() => {
      reject(new Error("Yandex Maps load timeout"));
    }, 10000);
    script.onload = () => {
      clearTimeout(timeoutId);
      if (window.ymaps) {
        window.ymaps.ready(() => resolve(window.ymaps));
      } else {
        reject(new Error("Yandex Maps API not available"));
      }
    };
    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error("Failed to load Yandex Maps API"));
    };
    document.head.appendChild(script);
  });

  return yandexMapsPromise;
}

export default {
  name: "OppSelector",
  props: {
    latitude: {
      type: Number,
      default: 58.008757
    },
    longitude: {
      type: Number,
      default: 56.245150
    },
    radius: {
      type: Number,
      default: 999999999999999
    }
  },
  data() {
    return {
      selectedOpp: null,
      oppList: [],
      showPvzModal: false,
      loading: false,
      map: null,
      mapReady: false,
      mapLoading: false,
      mapError: "",
      resizeObserver: null,
      markers: {},
      mapInitToken: 0,
    }
  },
  beforeUnmount() {
    this.destroyMap();
  },
  methods: {
    open() {
      this.showPvzModal = true;
      this.getOpps();
    },
    onDialogShow() {
      // Запускаем процесс инициализации
      this.initMap();
    },
    onDialogBeforeHide() {
      this.detachResizeObserver();
    },
    onDialogHide() {
      this.destroyMap();
    },
    attachResizeObserver() {
      if (this.resizeObserver) return;
      if (typeof ResizeObserver === "undefined") return;
      const container = this.$refs.mapContainer;
      if (!container) return;

      this.resizeObserver = new ResizeObserver(() => {
        if (!this.showPvzModal || !this.map) return;
        // Используем requestAnimationFrame для плавности и предотвращения ошибок
        requestAnimationFrame(() => {
           this.refreshMapLayout();
        });
      });
      this.resizeObserver.observe(container);
    },
    detachResizeObserver() {
      if (this.resizeObserver) {
        try { this.resizeObserver.disconnect(); } catch (e) {}
        this.resizeObserver = null;
      }
    },
    refreshMapLayout() {
      if (!this.map || !this.map.container) return;

      const size = this.getMapContainerSize();
      if (!size || size.width === 0 || size.height === 0) return;

      try {
        this.map.container.fitToViewport();
      } catch (e) {}
    },
    formatWorkTime(workTime) {
      if (!workTime || typeof workTime !== 'object') return 'Время работы не указано';

      const daysMap = {
        mon: 'Пн', tue: 'Вт', wed: 'Ср', thu: 'Чт', fri: 'Пт', sat: 'Сб', sun: 'Вс'
      };
      const entries = Object.entries(workTime);
      if (entries.length === 0) return 'Время работы не указано';

      const timeGroups = {};
      entries.forEach(([day, time]) => {
        if (!timeGroups[time]) timeGroups[time] = [];
        timeGroups[time].push(day);
      });

      return Object.entries(timeGroups).map(([time, days]) => {
        if (days.length === 7) return `Ежедневно ${time}`;
        if (days.length === 1) return `${daysMap[days[0]]} ${time}`;
        const dayNames = days.map(d => daysMap[d]).join(', ');
        return `${dayNames}: ${time}`;
      }).join('; ');
    },
    calculateDistanceKm(fromLat, fromLon, toLat, toLon) {
      if (!Number.isFinite(fromLat) || !Number.isFinite(fromLon) ||
          !Number.isFinite(toLat) || !Number.isFinite(toLon)) return null;
      const R = 6371;
      const dLat = (toLat - fromLat) * Math.PI / 180;
      const dLon = (toLon - fromLon) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(fromLat * Math.PI / 180) * Math.cos(toLat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    },
    async getOpps() {
      this.loading = true;
      try {
        const response = await Api.get('/api/opp');
        const rawData = response.data;
        const opps = Array.isArray(rawData)
          ? rawData
          : (rawData?.success
            ? (Array.isArray(rawData?.data?.opps)
              ? rawData.data.opps
              : (Array.isArray(rawData?.data) ? rawData.data : []))
            : []);

        if (Array.isArray(opps) && opps.length > 0) {
          this.oppList = opps.map((opp) => {
            const latitude = Number(opp.latitude);
            const longitude = Number(opp.longitude);
            const backendDistance = Number(opp.distance);
            const distanceKm = Number.isFinite(backendDistance)
              ? backendDistance
              : this.calculateDistanceKm(this.latitude, this.longitude, latitude, longitude);

            return {
              ...opp,
              latitude: Number.isFinite(latitude) ? latitude : null,
              longitude: Number.isFinite(longitude) ? longitude : null,
              distanceKm: Number.isFinite(distanceKm) ? distanceKm : null,
              formattedWorkTime: this.formatWorkTime(opp.work_time),
              formattedDistance: Number.isFinite(distanceKm) ? `${distanceKm.toFixed(2)} км` : ''
            };
          }).sort((a, b) => (a.distanceKm || 99999) - (b.distanceKm || 99999));

          // Рендерим маркеры только если карта УЖЕ готова.
          // Если нет - они отрендерятся сами в initMap.
          if (this.mapReady && this.map) {
             this.$nextTick(() => this.renderMarkers());
          }
        } else {
          this.oppList = [];
        }
      } catch (error) {
        console.error('Error fetching OPPs:', error);
        this.oppList = [];
      } finally {
        this.loading = false;
      }
    },
    selectOpp(opp) {
      this.selectedOpp = opp;
      this.$emit('opp_selected', opp);
      this.showPvzModal = false;
    },
    selectOppFromMap(opp) {
      this.selectedOpp = opp;
      this.$nextTick(() => this.scrollToOpp(opp?.opp_id));
    },
    scrollToOpp(oppId) {
      if (!oppId) return;
      const ref = this.$refs[`oppCard-${oppId}`];
      const el = Array.isArray(ref) ? ref[0]?.$el : ref?.$el;
      if (el?.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    async focusOnOpp(opp) {
      if (!opp) return;
      this.selectedOpp = opp;

      if (!this.map) await this.initMap();
      if (!this.map) return;

      if (Number.isFinite(opp.latitude) && Number.isFinite(opp.longitude)) {
        // Убеждаемся, что карта знает свой размер перед центрированием
        try { this.map.container.fitToViewport(); } catch(e) {}

        const size = this.getMapContainerSize();
        if (size && size.width > 0 && size.height > 0) {
          try {
            this.map.setCenter([opp.latitude, opp.longitude], 15, {
                duration: 300,
                checkZoomRange: true
            });
          } catch(e) { console.warn(e); }
        }
      }

      const marker = this.markers?.[opp.opp_id];
      if (marker && marker.balloon) {
        try { marker.balloon.open(); } catch(e) {}
      }
      this.scrollToOpp(opp.opp_id);
    },
    getMapContainerSize() {
      const container = this.$refs.mapContainer;
      if (!container || !container.getBoundingClientRect) return null;
      return container.getBoundingClientRect();
    },
    // Вспомогательная функция ожидания размеров контейнера
    waitContainerSize() {
      return new Promise((resolve) => {
        const check = () => {
           // Если диалог закрыли в процессе ожидания - прерываем
           if (!this.showPvzModal) return;

           const size = this.getMapContainerSize();
           if (size && size.width > 0 && size.height > 0) {
             resolve(true);
           } else {
             // Пробуем снова через 50мс
             setTimeout(check, 50);
           }
        };
        check();
      });
    },
    async initMap() {
      if (this.map || this.mapLoading) return;

      this.mapLoading = true;
      this.mapError = "";

      const currentToken = ++this.mapInitToken;

      try {
        // 1. Сначала ждем загрузку API скрипта
        const ymaps = await loadYandexMaps();

        // Если пока грузили скрипт, пользователь закрыл окно - выход
        if (currentToken !== this.mapInitToken || !this.showPvzModal) {
            this.mapLoading = false;
            return;
        }

        // 2. ТЕПЕРЬ ЖДЕМ, ПОКА КОНТЕЙНЕР СТАНЕТ ВИДИМЫМ (> 0px)
        // Это самая важная часть фикса ошибки "reading '0'"
        await this.waitContainerSize();

        // Проверяем снова, не закрыли ли окно
        if (currentToken !== this.mapInitToken || !this.showPvzModal || !this.$refs.mapContainer) {
            this.mapLoading = false;
            return;
        }

        // Очищаем контейнер
        this.$refs.mapContainer.innerHTML = '';

        // 3. Создаем карту
        this.map = new ymaps.Map(this.$refs.mapContainer, {
          center: [this.latitude, this.longitude],
          zoom: 10,
          // Убрали 'fullscreenControl' из списка контролов
          controls: ["zoomControl"]
        }, {
          suppressMapOpenBlock: true,
          autoFitToViewport: 'always'
        });

        this.mapReady = true;
        this.attachResizeObserver();

        // 4. Сразу обновляем layout и рендерим маркеры
        this.map.container.fitToViewport();
        this.renderMarkers();

      } catch (error) {
        console.error("Map Init Error:", error);
        this.mapError = "Не удалось загрузить карту.";
      } finally {
        if (currentToken === this.mapInitToken) {
          this.mapLoading = false;
        }
      }
    },
    destroyMap() {
      this.mapInitToken++; // Отмена всех ожидающих процессов инициализации
      this.detachResizeObserver();

      const mapInstance = this.map;
      this.map = null;
      this.mapReady = false;
      this.mapLoading = false;
      this.markers = {};

      if (mapInstance) {
        // Просто уничтожаем карту без ручной чистки geoObjects,
        // чтобы избежать ошибки "setting 'removed'"
        try {
          mapInstance.destroy();
        } catch (e) {
          // Игнорируем ошибки при уничтожении, так как карта все равно удаляется
        }
      }
    },
    renderMarkers() {
      // Базовые проверки
      if (!this.mapReady || !this.map || !window.ymaps) return;
      if (this.oppList.length === 0) return;

      // Повторная защита от 0 размера (на случай ресайза окна в 0)
      const size = this.getMapContainerSize();
      if (!size || size.width === 0 || size.height === 0) return;

      try {
        // Важно: сообщаем карте, что размер контейнера мог измениться
        this.map.container.fitToViewport();

        // Чистим старые маркеры через removeAll (это безопасно на живой карте)
        this.map.geoObjects.removeAll();
        this.markers = {};

        const clusterer = new window.ymaps.Clusterer({
          preset: 'islands#invertedBlueClusterIcons',
          groupByCoordinates: false,
          clusterDisableClickZoom: false,
          clusterHideIconOnBalloonOpen: false,
          geoObjectHideIconOnBalloonOpen: false
        });

        const geoObjects = [];

        this.oppList.forEach(opp => {
          if (!Number.isFinite(opp.latitude) || !Number.isFinite(opp.longitude)) return;

          const placemark = new window.ymaps.Placemark(
            [opp.latitude, opp.longitude],
            {
              balloonContentHeader: opp.address,
              balloonContentBody: opp.formattedWorkTime,
              balloonContentFooter: opp.formattedDistance
            },
            { preset: "islands#blueIcon" }
          );

          placemark.events.add("click", () => this.selectOppFromMap(opp));
          geoObjects.push(placemark);
          this.markers[opp.opp_id] = placemark;
        });

        if (geoObjects.length > 0) {
          clusterer.add(geoObjects);
          this.map.geoObjects.add(clusterer);

          // Позиционирование
          if (geoObjects.length === 1) {
            const coords = geoObjects[0].geometry.getCoordinates();
            this.map.setCenter(coords, 14, { duration: 0 });
          } else {
            const bounds = clusterer.getBounds();
            if (bounds && Array.isArray(bounds)) {
              this.map.setBounds(bounds, {
                checkZoomRange: true,
                zoomMargin: 40,
                duration: 0
              });
            }
          }
        }
      } catch (e) {
         console.warn("Render markers warning:", e);
      }
    }
  }
}
</script>


<template>
  <!-- Модалка выбора ПВЗ -->
  <q-dialog v-model="showPvzModal" full-width full-height @show="onDialogShow" @before-hide="onDialogBeforeHide" @hide="onDialogHide">
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Выбор пункта выдачи заказов</div>
        <q-space/>
        <q-btn flat round dense icon="close" v-close-popup/>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-if="loading" class="flex flex-center q-py-xl">
          <q-spinner color="primary" size="50px" />
        </div>

        <div v-else-if="oppList.length === 0" class="flex flex-center q-py-xl">
          <div class="text-center">
            <q-icon name="location_off" size="64px" color="grey-5" />
            <div class="text-h6 text-grey-6 q-mt-md">Пункты выдачи не найдены</div>
            <div class="text-caption text-grey-6">Попробуйте изменить параметры поиска</div>
          </div>
        </div>

        <div v-else class="row opp-selector-body">
          <!-- Левая колонка - список ПВЗ -->
          <div class="col-4 full-height">
            <q-scroll-area style="height: 100%">
              <div class="column q-gutter-y-md">
                <q-card
                  v-for="opp in oppList"
                  :key="opp.opp_id"
                  :ref="`oppCard-${opp.opp_id}`"
                  bordered
                  :class="{ 'border-primary': selectedOpp?.opp_id === opp.opp_id }"
                  class="opp-card"
                >
                  <q-card-section>
                    <div class="text-weight-medium q-mb-xs">{{ opp.address }}</div>

                    <div v-if="opp.formattedDistance" class="text-caption text-grey-7 q-mb-xs">
                      <q-icon name="place" size="xs" />
                      {{ opp.formattedDistance }}
                    </div>

                    <div class="text-caption text-grey-7 q-mb-sm">
                      <q-icon name="schedule" size="xs" />
                      {{ opp.formattedWorkTime }}
                    </div>
                    <div class="row q-col-gutter-sm">
                      <div class="col-6">
                        <q-btn
                          label="Показать на карте"
                          color="primary"
                          size="sm"
                          outline
                          class="full-width"
                          @click="focusOnOpp(opp)"
                        />
                      </div>
                      <div class="col-6">
                        <q-btn
                          label="Выбрать"
                          color="primary"
                          size="sm"
                          :outline="selectedOpp?.opp_id !== opp.opp_id"
                          :unelevated="selectedOpp?.opp_id === opp.opp_id"
                          class="full-width"
                          @click="selectOpp(opp)"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </q-scroll-area>
          </div>

          <!-- Правая колонка - карта -->
          <div class="col-8 full-height">
            <q-card bordered class="full-height">
              <q-card-section class="column full-height">
                <div class="text-weight-medium q-mb-md">Выберите пункт выдачи на карте</div>

                <div v-if="mapError" class="opp-map-shell flex flex-center bg-grey-3 rounded-borders">
                  <div class="text-center text-grey-7">{{ mapError }}</div>
                </div>
                <div v-else class="opp-map-shell bg-grey-3 rounded-borders">
                  <div ref="mapContainer" class="opp-map"></div>
                  <div v-if="mapLoading || !mapReady" class="opp-map-overlay flex flex-center">
                    <q-spinner color="primary" size="40px" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.border-primary {
  border: 2px solid #1976d2 !important;
}

.opp-card {
  transition: all 0.2s;
}

.opp-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.opp-selector-body {
  height: 70vh;
}

.opp-map {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.opp-map-shell {
  position: relative;
  flex: 1;
  min-height: 320px;
  overflow: hidden;
}

.opp-map-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
}
</style>
