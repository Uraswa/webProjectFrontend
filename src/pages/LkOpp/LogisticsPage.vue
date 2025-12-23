<script>
import { oppLogisticsApi } from 'src/features/oppLogistics/api/oppLogisticsApi'
import { useOppId } from 'src/features/oppSelection/lib/useOppId'
import { getDirectionColor, getDirectionText } from 'src/entities/OppOrder/lib/statusHelpers'

export default {
  name: 'LogisticsPage',
  data() {
    return {
      oppId: null,
      directionFilter: null,
      loading: false,
      logisticsOrders: [],
      directionOptions: [
        { label: 'Все', value: 'all' },
        { label: 'Входящие', value: 'incoming' },
        { label: 'Исходящие', value: 'outgoing' }
      ],
      columns: [
        {
          name: 'logistics_order_id',
          label: 'ID отправления',
          field: 'logistics_order_id',
          align: 'left',
          sortable: true
        },
        {
          name: 'direction',
          label: 'Направление',
          field: 'direction',
          align: 'center',
          sortable: true
        },
        {
          name: 'products',
          label: 'Товары',
          field: 'products',
          align: 'left',
          sortable: false
        },
        {
          name: 'total_quantity',
          label: 'Количество',
          field: 'total_quantity',
          align: 'center',
          sortable: true
        },
        {
          name: 'status',
          label: 'Статус',
          field: 'status',
          align: 'center',
          sortable: true
        },
        {
          name: 'created_at',
          label: 'Дата создания',
          field: 'created_at',
          align: 'center',
          sortable: true
        }
      ]
    }
  },
  async created() {
    const { getOppId } = useOppId()
    this.oppId = getOppId()

    if (!this.oppId) {
      this.$router.push('/pvz-owner/select')
      return
    }

    await this.loadLogisticsOrders()
  },
  methods: {
    async loadLogisticsOrders() {
      this.loading = true
      try {
        const params = {}
        if (this.directionFilter) {
          params.direction = this.directionFilter.value
        }

        this.logisticsOrders = await oppLogisticsApi.getLogisticsOrders(this.oppId, params)
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при загрузке логистических отправлений'
        })
      } finally {
        this.loading = false
      }
    },
    async applyFilters() {
      await this.loadLogisticsOrders()
    },
    getDirectionColor,
    getDirectionText,
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    }
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <h4 class="text-h4 text-weight-bold q-mb-xs">Логистические отправления</h4>
      <p class="text-caption text-grey-7 q-mb-lg">
        Управление входящими и исходящими логистическими заказами
      </p>

      <!-- Фильтры -->
      <q-card flat bordered class="q-mb-lg">
        <q-card-section>
          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4">
              <q-select
                v-model="directionFilter"
                :options="directionOptions"
                label="Направление"
                dense
                outlined
                clearable
                emit-value
                map-options
              />
            </div>

            <div class="col-12 col-sm-6 col-md-4">
              <q-btn
                label="Применить фильтры"
                color="primary"
                class="full-width"
                unelevated
                @click="applyFilters"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Таблица логистических отправлений -->
      <q-card flat bordered>
        <q-table
          :rows="logisticsOrders"
          :columns="columns"
          row-key="logistics_order_id"
          :loading="loading"
          flat
          bordered
        >
          <!-- Колонка с направлением -->
          <template v-slot:body-cell-direction="props">
            <q-td :props="props">
              <q-badge
                :color="getDirectionColor(props.row.direction)"
                :label="getDirectionText(props.row.direction)"
              />
            </q-td>
          </template>

          <!-- Колонка с товарами -->
          <template v-slot:body-cell-products="props">
            <q-td :props="props">
              <div class="row q-gutter-xs">
                <q-img
                  v-for="(product, index) in props.row.products.slice(0, 3)"
                  :key="index"
                  :src="product.photo"
                  width="40px"
                  height="40px"
                  class="rounded-borders"
                />
                <div
                  v-if="props.row.products.length > 3"
                  class="flex flex-center bg-grey-3 rounded-borders"
                  style="width: 40px; height: 40px"
                >
                  <span class="text-caption text-grey-7">
                    +{{ props.row.products.length - 3 }}
                  </span>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Колонка с датой -->
          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              {{ formatDate(props.row.created_at) }}
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>

</style>
