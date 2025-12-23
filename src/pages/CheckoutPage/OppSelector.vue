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
      mapCentered: false,
      markers: {},
      mapInitRetries: 0,
      mapInitToken: 0
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
      this.$nextTick(() => {
        if (this.map?.container) {
          this.map.container.fitToViewport();
          this.renderMarkers();
        } else {
          this.initMap();
        }
      });
    },
    onDialogHide() {
      this.destroyMap();
    },
    formatWorkTime(workTime) {
      if (!workTime || typeof workTime !== 'object') {
        return 'Время работы не указано';
      }

      const daysMap = {
        mon: 'Пн',
        tue: 'Вт',
        wed: 'Ср',
        thu: 'Чт',
        fri: 'Пт',
        sat: 'Сб',
        sun: 'Вс'
      };

      const entries = Object.entries(workTime);

      if (entries.length === 0) {
        return 'Время работы не указано';
      }

      // Группируем дни с одинаковым временем работы
      const timeGroups = {};
      entries.forEach(([day, time]) => {
        if (!timeGroups[time]) {
          timeGroups[time] = [];
        }
        timeGroups[time].push(day);
      });

      // Форматируем в читаемый вид
      const formatted = Object.entries(timeGroups).map(([time, days]) => {
        if (days.length === 7) {
          return `Ежедневно ${time}`;
        } else if (days.length === 1) {
          return `${daysMap[days[0]]} ${time}`;
        } else {
          const dayNames = days.map(d => daysMap[d]).join(', ');
          return `${dayNames}: ${time}`;
        }
      });

      return formatted.join('; ');
    },
    calculateDistanceKm(fromLatitude, fromLongitude, toLatitude, toLongitude) {
      if (
        !Number.isFinite(fromLatitude) ||
        !Number.isFinite(fromLongitude) ||
        !Number.isFinite(toLatitude) ||
        !Number.isFinite(toLongitude)
      ) {
        return null;
      }

      const earthRadiusKm = 6371;
      const toRad = (deg) => (deg * Math.PI) / 180;
      const dLat = toRad(toLatitude - fromLatitude);
      const dLon = toRad(toLongitude - fromLongitude);
      const lat1 = toRad(fromLatitude);
      const lat2 = toRad(toLatitude);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return earthRadiusKm * c;
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
          const mappedOpps = opps.map((opp) => {
            const latitude = Number(opp.latitude);
            const longitude = Number(opp.longitude);
            const backendDistanceKm = Number(opp.distance);
            const distanceKm = Number.isFinite(backendDistanceKm)
              ? backendDistanceKm
              : this.calculateDistanceKm(this.latitude, this.longitude, latitude, longitude);

            return {
              ...opp,
              latitude: Number.isFinite(latitude) ? latitude : null,
              longitude: Number.isFinite(longitude) ? longitude : null,
              distanceKm: Number.isFinite(distanceKm) ? distanceKm : null,
              formattedWorkTime: this.formatWorkTime(opp.work_time),
              formattedDistance: Number.isFinite(distanceKm) ? `${distanceKm.toFixed(2)} км` : ''
            };
          });

          mappedOpps.sort((a, b) => {
            const aDistance = a?.distanceKm;
            const bDistance = b?.distanceKm;
            const aHasDistance = Number.isFinite(aDistance);
            const bHasDistance = Number.isFinite(bDistance);
            if (aHasDistance && bHasDistance) return aDistance - bDistance;
            if (aHasDistance) return -1;
            if (bHasDistance) return 1;
            return 0;
          });

          this.oppList = mappedOpps;
          this.renderMarkers();
        } else {
          this.oppList = [];
          this.$q.notify({
            type: 'warning',
            message: 'Не удалось загрузить список пунктов выдачи'
          });
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
      this.$nextTick(() => {
        this.scrollToOpp(opp?.opp_id);
      });
    },
    scrollToOpp(oppId) {
      if (!oppId) return;
      const refValue = this.$refs[`oppCard-${oppId}`];
      const refTarget = Array.isArray(refValue) ? refValue[0] : refValue;
      const element = refTarget?.$el || refTarget;
      if (element?.scrollIntoView) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    async focusOnOpp(opp) {
      if (!opp) return;
      this.selectedOpp = opp;
      await this.initMap();
      if (!this.mapReady || !this.map) return;

      if (Number.isFinite(opp.latitude) && Number.isFinite(opp.longitude)) {
        this.map.setCenter([opp.latitude, opp.longitude], 14, { duration: 300 });
      }

      const marker = this.markers?.[opp.opp_id];
      if (marker?.balloon?.open) {
        marker.balloon.open();
      }

      this.$nextTick(() => {
        this.scrollToOpp(opp.opp_id);
      });
    },
    async initMap() {
      if (this.map || this.mapLoading) return;
      if (!this.$refs.mapContainer) return;

      const initToken = ++this.mapInitToken;
      this.mapLoading = true;
      this.mapError = "";
      try {
        await loadYandexMaps();
        if (initToken !== this.mapInitToken) return;
        if (!this.showPvzModal) return;
        if (!this.$refs.mapContainer) return;

        this.map = new window.ymaps.Map(this.$refs.mapContainer, {
          center: [this.latitude, this.longitude],
          zoom: 12,
          controls: ["zoomControl"]
        }, {
          suppressMapOpenBlock: true
        });
        if (initToken !== this.mapInitToken) return;
        this.mapReady = true;
        this.mapCentered = false;
        this.$nextTick(() => {
          if (this.map?.container) {
            this.map.container.fitToViewport();
          }
        });
        this.renderMarkers();
      } catch (error) {
        console.error("Yandex map init failed:", error);
        this.mapError = "Не удалось загрузить карту.";
      } finally {
        if (initToken === this.mapInitToken) {
          this.mapLoading = false;
        }
      }
    },
    destroyMap() {
      this.mapInitToken += 1;
      const map = this.map;
      this.map = null;
      this.mapReady = false;
      this.mapLoading = false;
      this.mapError = "";
      this.mapCentered = false;

      try {
        if (map?.geoObjects && this.markers) {
          Object.values(this.markers).forEach((marker) => {
            try {
              map.geoObjects.remove(marker);
            } catch {
              // ignore: map/marker might be already disposed
            }
          });
        }
      } finally {
        this.markers = {};
      }

      try {
        map?.destroy?.();
      } catch {
        // ignore
      }
    },
    renderMarkers() {
      if (!this.mapReady || !this.map) return;

      Object.values(this.markers).forEach((marker) => {
        try {
          this.map.geoObjects.remove(marker);
        } catch {
          // ignore: map/marker might be already disposed
        }
      });
      this.markers = {};

      this.oppList.forEach((opp) => {
        if (!Number.isFinite(opp.latitude) || !Number.isFinite(opp.longitude)) return;
        const marker = new window.ymaps.Placemark(
          [opp.latitude, opp.longitude],
          { balloonContent: opp.address },
          { preset: "islands#blueIcon" }
        );
        marker.events.add("click", () => this.selectOppFromMap(opp));
        try {
          this.map.geoObjects.add(marker);
        } catch {
          return;
        }
        this.markers[opp.opp_id] = marker;
      });

      if (!this.mapCentered) {
        const points = this.oppList
          .filter((opp) => Number.isFinite(opp.latitude) && Number.isFinite(opp.longitude))
          .map((opp) => [opp.latitude, opp.longitude]);

        if (points.length === 1) {
          this.map.setCenter(points[0], 12, { duration: 300 });
          this.mapCentered = true;
        } else if (points.length > 1) {
          const latitudes = points.map((p) => p[0]);
          const longitudes = points.map((p) => p[1]);
          const bounds = [
            [Math.min(...latitudes), Math.min(...longitudes)],
            [Math.max(...latitudes), Math.max(...longitudes)]
          ];
          this.map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 });
          this.mapCentered = true;
        }
      }
    }
  }
}
</script>

<template>
  <!-- Модалка выбора ПВЗ -->
  <q-dialog v-model="showPvzModal" full-width full-height @show="onDialogShow" @before-hide="onDialogHide">
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
