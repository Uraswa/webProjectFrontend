<script>
import Api from "src/shared/api/Api.js";

export default {
  name: "OppSelector",
  props: {
    latitude: {
      type: Number,
      default: 56.245150
    },
    longitude: {
      type: Number,
      default: 58.008757
    },
    radius: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      selectedOpp: null,
      oppList: [],
      showPvzModal: false,
      loading: false
    }
  },
  methods: {
    open() {
      this.showPvzModal = true;
      this.getOpps();
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
    async getOpps() {
      this.loading = true;
      try {
        const response = await Api.get(
          `/api/opp/by-radius?latitude=${this.latitude}&longitude=${this.longitude}&radius=${this.radius}`
        );

        if (response.data?.success && response.data?.data?.opps) {
          this.oppList = response.data.data.opps.map(opp => ({
            ...opp,
            formattedWorkTime: this.formatWorkTime(opp.work_time),
            formattedDistance: opp.distance ? `${opp.distance.toFixed(2)} км` : ''
          }));
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

    }
  }
}
</script>

<template>
  <!-- Модалка выбора ПВЗ -->
  <q-dialog v-model="showPvzModal" full-width full-height>
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

        <div v-else class="row" style="height: 70vh">
          <!-- Левая колонка - список ПВЗ -->
          <div class="col-4">
            <q-scroll-area style="height: 70vh">
              <div class="column q-gutter-y-md">
                <q-card
                  v-for="opp in oppList"
                  :key="opp.opp_id"
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

                    <q-btn
                      label="Выбрать"
                      color="primary"
                      size="sm"
                      :outline="selectedOpp?.opp_id !== opp.opp_id"
                      :unelevated="selectedOpp?.opp_id === opp.opp_id"
                      class="full-width"
                      @click="selectOpp(opp)"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </q-scroll-area>
          </div>

          <!-- Правая колонка - карта -->
          <div class="col-8">
            <q-card bordered class="full-height">
              <q-card-section>
                <div class="text-weight-medium q-mb-md">Выберите пункт выдачи на карте</div>

                <!-- Заглушка для карты -->
                <div class="full-height flex flex-center bg-grey-3 rounded-borders">
                  <div class="text-center">
                    <q-icon name="map" size="xl" color="grey-6" class="q-mb-sm"/>
                    <div class="text-h6 text-grey-6">Карта</div>
                    <div class="text-caption text-grey-6">Здесь будет виджет карты</div>
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
</style>
