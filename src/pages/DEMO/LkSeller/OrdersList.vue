<template>
  <!-- Основная область -->
  <div>
    <!-- Шапка страницы -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Заказы</div>
        <div class="text-caption text-grey-7">Управление заказами вашего магазина</div>
      </div>
    </div>

    <!-- Фильтры и поиск -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-3">
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
          <div class="col-3">
            <q-select
              v-model="statusFilter"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Статус заказа"
              dense
              outlined
              clearable
            />
          </div>
          <div class="col-3">
            <q-select
              v-model="pvzFilter"
              :options="pvzOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="ПВЗ"
              dense
              outlined
              clearable
            />
          </div>
          <div class="col-3">
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
        row-key="id"
        :loading="loading"
        flat
        bordered
      >
        <!-- Колонка с товарами -->
        <template v-slot:body-cell-products="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-img
                v-for="(product, index) in props.row.products"
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
                <div class="text-caption text-grey-7">+{{ props.row.products.length - 3 }}</div>
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
        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            <div class="text-weight-bold text-primary">{{ props.row.total }}₽</div>
          </q-td>
        </template>

        <!-- Колонка с ПВЗ -->
        <template v-slot:body-cell-pvz="props">
          <q-td :props="props">
            <div class="text-caption">{{ props.row.pvz.address }}</div>
            <div class="text-caption text-grey-7">{{ props.row.pvz.workingHours }}</div>
          </q-td>
        </template>

        <!-- Колонка с действиями -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-btn
                icon="visibility"
                size="sm"
                color="blue"
                dense
                flat
                :to="`/seller/orders/${props.row.id}`"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script>
import Api from "src/shared/api/Api.js";
import { Notify } from "quasar";

const STATUS_LABELS = {
  packing: "Упаковывается",
  shipping: "В пути",
  waiting: "Ожидает в ПВЗ",
  done: "Доставлен",
  canceled: "Отменён",
};

export default {
  name: "SellerOrdersPage",
  data() {
    return {
      searchQuery: '',
      statusFilter: null,
      pvzFilter: null,
      appliedSearchQuery: '',
      appliedStatus: null,
      appliedPvz: null,
      loading: false,
      shopId: null,
      statusOptions: [
        { label: STATUS_LABELS.packing, value: 'packing' },
        { label: STATUS_LABELS.shipping, value: 'shipping' },
        { label: STATUS_LABELS.waiting, value: 'waiting' },
        { label: STATUS_LABELS.done, value: 'done' },
        { label: STATUS_LABELS.canceled, value: 'canceled' }
      ],
      pvzOptions: [],
      columns: [
        {
          name: 'id',
          label: 'Номер заказа',
          field: 'id',
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
          name: 'total',
          label: 'Сумма',
          field: 'total',
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
          name: 'pvz',
          label: 'Пункт выдачи',
          field: 'pvz',
          align: 'left',
          sortable: true
        },
        {
          name: 'createdDate',
          label: 'Дата создания',
          field: 'createdDate',
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
      ],
      orders: []
    }
  },
  mounted() {
    this.fetchOpps();
    this.fetchOrders();
    this.applyFilters();
  },
  computed: {
    filteredOrders() {
      const search = String(this.appliedSearchQuery || '').trim().toLowerCase();
      const status = this.appliedStatus;
      const pvz = this.appliedPvz;

      return (this.orders || []).filter((order) => {
        if (search && !String(order.id || '').toLowerCase().includes(search)) return false;
        if (status && order.status !== status) return false;
        if (pvz && Number(order.opp_id) !== Number(pvz)) return false;
        return true;
      });
    }
  },
  methods: {
    applyFilters() {
      this.appliedSearchQuery = this.searchQuery;
      this.appliedStatus = this.statusFilter;
      this.appliedPvz = this.pvzFilter;
    },
    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}.${mm}.${yyyy}`;
    },
    extractFirstPhoto(productPhotos) {
      if (!productPhotos) return null;
      if (Array.isArray(productPhotos)) return productPhotos[0] || null;
      if (typeof productPhotos === 'string') {
        try {
          const parsed = JSON.parse(productPhotos);
          if (Array.isArray(parsed)) return parsed[0] || null;
        } catch {
          return null;
        }
      }
      return null;
    },
    async fetchOpps() {
      try {
        const { data } = await Api.get('/api/opp');
        const oppList = data?.success ? (data.data || []) : [];
        this.pvzOptions = oppList.map((opp) => ({
          label: opp.address,
          value: opp.opp_id,
        }));
      } catch (error) {
        console.error('Ошибка получения ПВЗ:', error);
        Notify.create({ type: 'negative', message: 'Не удалось загрузить список ПВЗ' });
      }
    },
    async fetchOrders() {
      try {
        this.loading = true;

        const shopsResponse = await Api.get('/api/shops');
        const shops = Array.isArray(shopsResponse.data)
          ? shopsResponse.data
          : (shopsResponse.data?.shops || []);

        if (!shops.length) {
          this.orders = [];
          return;
        }

        this.shopId = shops[0].shop_id;
        const { data } = await Api.get(`/api/orders/shop/${this.shopId}`);
        const rows = Array.isArray(data) ? data : [];

        const grouped = new Map();
        for (const row of rows) {
          const orderId = String(row.order_id);
          const existing = grouped.get(orderId);
          const photo = this.extractFirstPhoto(row.product_photos) || 'https://cdn.quasar.dev/img/parallax2.jpg';
          const itemSubtotal = Number(row.ordered_count) * Number(row.price);

          if (!existing) {
            grouped.set(orderId, {
              id: orderId,
              opp_id: row.opp_id,
              total: Number.isFinite(itemSubtotal) ? itemSubtotal : 0,
              status: row.current_status,
              createdDate: this.formatDate(row.created_date),
              pvz: {
                address: row.opp_address,
                workingHours: row.opp_work_time ? JSON.stringify(row.opp_work_time) : ''
              },
              products: [{ photo }]
            });
          } else {
            existing.total += Number.isFinite(itemSubtotal) ? itemSubtotal : 0;
            if (existing.products.length < 3) {
              existing.products.push({ photo });
            }
          }
        }

        this.orders = Array.from(grouped.values()).map((o) => ({
          ...o,
          total: Number(o.total).toFixed(2),
        }));
      } catch (error) {
        console.error('Ошибка получения заказов:', error);
        Notify.create({ type: 'negative', message: 'Не удалось загрузить заказы' });
      } finally {
        this.loading = false;
      }
    },
    getStatusColor(status) {
      const colors = {
        packing: 'orange',
        shipping: 'blue',
        waiting: 'yellow',
        done: 'green',
        canceled: 'red'
      }
      return colors[status] || 'grey'
    },
    getStatusText(status) {
      return STATUS_LABELS[status] || 'Неизвестно'
    },
    updateStatus(order, newStatus) {
      // Логика обновления статуса заказа
      order.status = newStatus
    }
  }
}
</script>
