<script>
import { oppLogisticsApi } from 'src/features/oppLogistics/api/oppLogisticsApi'
import { useOppId } from 'src/features/oppSelection/lib/useOppId'
import { getDirectionColor, getDirectionText, getStatusColor, getStatusText } from 'src/entities/OppOrder/lib/statusHelpers'
import ReceiveFromSellerForm from 'src/features/oppOperations/ui/ReceiveFromSellerForm.vue'
import GiveToLogisticsForm from 'src/features/oppOperations/ui/GiveToLogisticsForm.vue'
import ReceiveFromLogisticsForm from 'src/features/oppOperations/ui/ReceiveFromLogisticsForm.vue'

export default {
  name: 'LogisticsPage',
  components: {
    ReceiveFromSellerForm,
    GiveToLogisticsForm,
    ReceiveFromLogisticsForm
  },
  data() {
    return {
      oppId: null,
      directionFilter: null,
      loading: false,
      logisticsOrders: [],
      showReceiveFromSeller: false,
      showGiveToLogistics: false,
      showReceiveFromLogistics: false,
      directionOptions: [
        { label: 'Все', value: 'all' },
        { label: 'Входящие', value: 'incoming' },
        { label: 'Исходящие', value: 'outgoing' }
      ],
      columns: [
        {
          name: 'logistics_order_id',
          label: 'Номер отправления',
          field: 'logistics_order_id',
          align: 'left',
          sortable: true
        },
        {
          name: 'route',
          label: 'Маршрут',
          field: 'route',
          align: 'left',
          sortable: false
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
          label: 'Кол-во',
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
    handleOperationSuccess() {
      this.loadLogisticsOrders()
    },
    async loadLogisticsOrders() {
      this.loading = true
      try {
        const params = {}
        if (this.directionFilter) {
          params.direction = this.directionFilter
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
    getStatusColor,
    getStatusText,
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

      <!-- Операции -->
      <q-card flat bordered class="q-mb-lg">
        <q-card-section>
          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-btn
                label="Приём от продавца"
                color="blue"
                class="full-width"
                unelevated
                @click="showReceiveFromSeller = true"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-btn
                label="Передать логистике"
                color="orange"
                class="full-width"
                unelevated
                @click="showGiveToLogistics = true"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-btn
                label="Приём от логистики"
                color="teal"
                class="full-width"
                unelevated
                @click="showReceiveFromLogistics = true"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

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
                <template v-for="(product, index) in props.row.products.slice(0, 3)" :key="index">
                  <q-img
                    v-if="product.photo"
                    :src="product.photo"
                    width="40px"
                    height="40px"
                    class="rounded-borders"
                  />
                  <div
                    v-else
                    class="flex flex-center bg-grey-3 rounded-borders"
                    style="width: 40px; height: 40px"
                  >
                    <q-icon name="inventory_2" size="18px" color="grey-7" />
                  </div>
                </template>
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

          <template v-slot:body-cell-route="props">
            <q-td :props="props">
              <div class="text-body2">
                <div>{{ props.row.from_opp }}</div>
                <div class="text-grey-7">→ {{ props.row.to_opp }}</div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="getStatusColor(props.row.status)"
                :label="getStatusText(props.row.status)"
              />
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

    <ReceiveFromSellerForm
      v-model="showReceiveFromSeller"
      :opp-id="oppId"
      @success="handleOperationSuccess"
    />

    <GiveToLogisticsForm
      v-model="showGiveToLogistics"
      :opp-id="oppId"
      @success="handleOperationSuccess"
    />

    <ReceiveFromLogisticsForm
      v-model="showReceiveFromLogistics"
      :opp-id="oppId"
      @success="handleOperationSuccess"
    />
  </q-page>
</template>

<style scoped>

</style>
