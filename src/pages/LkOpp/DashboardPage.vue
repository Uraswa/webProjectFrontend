<script>
import { oppStatisticsApi } from 'src/features/oppStatistics/api/oppStatisticsApi'
import { useOppId } from 'src/features/oppSelection/lib/useOppId'

export default {
  name: 'DashboardPage',
  data() {
    return {
      oppId: null,
      statistics: null,
      loading: true
    }
  },
  async created() {
    const { getOppId } = useOppId()
    this.oppId = getOppId()

    if (!this.oppId) {
      this.$router.push('/pvz-owner/select')
      return
    }

    await this.loadStatistics()
  },
  methods: {
    async loadStatistics() {
      this.loading = true
      try {
        this.statistics = await oppStatisticsApi.getStatistics(this.oppId)
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при загрузке статистики'
        })
      } finally {
        this.loading = false
      }
    },
    getStatValue(key, defaultValue = 0) {
      return this.statistics && this.statistics[key] !== undefined
        ? this.statistics[key]
        : defaultValue
    }
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <h4 class="text-h4 q-mb-md">Статистика</h4>
      <p class="text-subtitle1 text-grey-7 q-mb-lg">
        Общая информация о вашем пункте выдачи
      </p>

      <div v-if="loading" class="row justify-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else-if="!statistics" class="text-center q-py-xl">
        <q-icon name="error_outline" size="4em" color="grey-5" class="q-mb-md" />
        <p class="text-h6 text-grey-7">Не удалось загрузить статистику</p>
        <q-btn
          label="Повторить"
          color="primary"
          outline
          @click="loadStatistics"
          class="q-mt-md"
        />
      </div>

      <div v-else>
        <!-- Statistics Cards -->
        <div class="row q-col-gutter-md q-mb-xl">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-grey-7 text-subtitle2">Всего заказов</div>
                    <div class="text-h4 text-weight-bold text-primary q-mt-sm">
                      {{ getStatValue('total_orders') }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="shopping_bag" size="3em" color="primary" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-grey-7 text-subtitle2">Активных заказов</div>
                    <div class="text-h4 text-weight-bold text-orange q-mt-sm">
                      {{ getStatValue('active_orders') }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="pending_actions" size="3em" color="orange" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-grey-7 text-subtitle2">Выполнено</div>
                    <div class="text-h4 text-weight-bold text-green q-mt-sm">
                      {{ getStatValue('completed_orders', 0) }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="check_circle" size="3em" color="green" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-card class="stat-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-grey-7 text-subtitle2">Отменено</div>
                    <div class="text-h4 text-weight-bold text-red q-mt-sm">
                      {{ getStatValue('canceled_orders', 0) }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-icon name="cancel" size="3em" color="red" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">Быстрые действия</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-btn
                      label="Заказы"
                      icon="shopping_cart"
                      color="primary"
                      unelevated
                      class="full-width"
                      to="/pvz-owner/orders"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-btn
                      label="Логистика"
                      icon="local_shipping"
                      color="blue"
                      unelevated
                      class="full-width"
                      to="/pvz-owner/logistics"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-btn
                      label="Операции"
                      icon="swap_horiz"
                      color="teal"
                      unelevated
                      class="full-width"
                      to="/pvz-owner/operations"
                    />
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-btn
                      label="Приём товара"
                      icon="inventory"
                      color="orange"
                      unelevated
                      class="full-width"
                      to="/pvz-owner/receive-goods"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.stat-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
