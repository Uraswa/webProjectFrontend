<script>
import { oppOrdersApi } from 'src/features/oppOrders/api/oppOrdersApi'
import { useOppId } from 'src/features/oppSelection/lib/useOppId'
import { getStatusColor, getStatusText } from 'src/entities/OppOrder/lib/statusHelpers'
import OrderDetailsDialog from 'src/features/oppOrders/ui/OrderDetailsDialog.vue'

const STATUS_ENUM = ['packing', 'shipping', 'waiting', 'done', 'canceled']

export default {
  name: 'OrdersPage',
  components: {
    OrderDetailsDialog
  },
  data() {
    return {
      oppId: null,
      searchQuery: '',
      statusFilter: null,
      sortBy: 'created_at',
      sortDirection: 'desc',
      loading: false,
      orders: [],
      selectedOrder: null,
      showDetailsDialog: false,
      statusOptions: STATUS_ENUM.map((status) => ({
        label: getStatusText(status),
        value: status
      })),
      sortOptions: [
        { label: 'По дате (новые)', value: 'created_at:desc' },
        { label: 'По дате (старые)', value: 'created_at:asc' },
        { label: 'По сумме (больше)', value: 'total_sum:desc' },
        { label: 'По сумме (меньше)', value: 'total_sum:asc' }
      ],
      columns: [
        {
          name: 'order_id',
          label: 'Номер заказа',
          field: 'order_id',
          align: 'left',
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
          name: 'total_sum',
          label: 'Сумма',
          field: 'total_sum',
          align: 'right',
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
          name: 'pickup_address',
          label: 'Пункт выдачи',
          field: 'pickup_address',
          align: 'left',
          sortable: false
        },
        {
          name: 'created_at',
          label: 'Дата создания',
          field: 'created_at',
          align: 'center',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Действия',
          field: 'actions',
          align: 'center',
          sortable: false
        }
      ]
    }
  },
  computed: {
    sortModel: {
      get() {
        return `${this.sortBy}:${this.sortDirection}`
      },
      set(value) {
        const [field, direction] = value.split(':')
        this.sortBy = field
        this.sortDirection = direction
      }
    },
    filteredOrders() {
      let filtered = this.orders

      // Фильтр по поиску
      if (this.searchQuery) {
        filtered = filtered.filter(order =>
          order.order_id.toString().includes(this.searchQuery)
        )
      }

      return filtered
    }
  },
  async created() {
    const { getOppId } = useOppId()
    this.oppId = getOppId()

    if (!this.oppId) {
      this.$router.push('/pvz-owner/select')
      return
    }

    await this.loadOrders()
  },
  methods: {
    async loadOrders() {
      this.loading = true
      try {
        const params = {}
        if (this.statusFilter) {
          params.status = this.statusFilter
        }

        this.orders = await oppOrdersApi.getOrders(this.oppId, params)
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при загрузке заказов'
        })
      } finally {
        this.loading = false
      }
    },
    async applyFilters() {
      await this.loadOrders()
    },
    getStatusColor,
    getStatusText,
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    },
    viewOrderDetails(order) {
      this.selectedOrder = order
      this.showDetailsDialog = true
    }
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Шапка страницы -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h4 class="text-h4 text-weight-bold q-mb-xs">Заказы</h4>
          <p class="text-caption text-grey-7">Управление заказами вашего пункта выдачи</p>
        </div>
      </div>

      <!-- Фильтры и поиск -->
      <q-card flat bordered class="q-mb-lg">
        <q-card-section>
          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                v-model="searchQuery"
                placeholder="Поиск по номеру заказа..."
                dense
                outlined
                clearable
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <q-select
                v-model="statusFilter"
                :options="statusOptions"
                label="Статус заказа"
                dense
                outlined
                clearable
                emit-value
                map-options
              />
            </div>

            <div class="col-12 col-sm-6 col-md-3">
              <q-select
                v-model="sortModel"
                :options="sortOptions"
                label="Сортировка"
                dense
                outlined
                emit-value
                map-options
              />
            </div>

            <div class="col-12 col-sm-6 col-md-3">
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

      <!-- Таблица заказов -->
      <q-card flat bordered>
        <q-table
          :rows="filteredOrders"
          :columns="columns"
          row-key="order_id"
          :loading="loading"
          flat
          bordered
        >
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

          <!-- Колонка со статусом -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="getStatusColor(props.row.status)"
                :label="getStatusText(props.row.status)"
              />
            </q-td>
          </template>

          <!-- Колонка с суммой -->
          <template v-slot:body-cell-total_sum="props">
            <q-td :props="props">
              <div class="text-weight-bold text-primary">
                {{ props.row.total_sum }}₽
              </div>
            </q-td>
          </template>

          <!-- Колонка с датой -->
          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              {{ formatDate(props.row.created_at) }}
            </q-td>
          </template>

          <!-- Колонка с действиями -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="visibility"
                size="sm"
                color="blue"
                dense
                flat
                round
                @click="viewOrderDetails(props.row)"
              >
                <q-tooltip>Просмотр</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Диалог деталей заказа -->
    <OrderDetailsDialog
      v-model="showDetailsDialog"
      :order-id="selectedOrder?.order_id"
      :opp-id="oppId"
    />
  </q-page>
</template>

<style scoped>

</style>
