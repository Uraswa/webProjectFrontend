<template>
  <q-page class="q-pa-lg">
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
          <div class="col-12 col-md-3">
            <q-input
              v-model="searchQuery"
              @update:model-value="appliedSearchQuery = searchQuery"
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
        rows-per-page-label="Записей на странице"
        :rows-per-page-options="[5, 10, 20, 50]"
        :pagination-label="paginationLabel"
        no-data-label="Заказы не найдены"
      >
        <!-- Колонка с товарами -->
        <template v-slot:body-cell-products="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-img
                v-for="(product, index) in getProductPhotos(props.row.products).slice(0, 3)"
                :key="index"
                :src="product"
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

        <!-- Колонка с количеством товаров -->
        <template v-slot:body-cell-productsCount="props">
          <q-td :props="props">
            <div class="text-center">{{ getTotalProductsCount(props.row.products) }}</div>
          </q-td>
        </template>

        <!-- Колонка с суммой -->
        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            <div class="text-weight-bold text-primary">{{ formatPrice(props.row.total) }}</div>
          </q-td>
        </template>

        <!-- Колонка с действиями -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs justify-end">
              <q-btn
                icon="visibility"
                size="sm"
                color="primary"
                dense
                flat
                :to="`/seller/orders/${props.row.order_id}`"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import Api from "src/shared/api/Api.js";
import { Notify } from "quasar";

export default {
  name: "SellerOrdersPage",
  data() {
    return {
      searchQuery: '',
      appliedSearchQuery: '',
      loading: false,
      shopId: null,
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
          name: 'productsCount',
          label: 'Количество',
          field: 'productsCount',
          align: 'center',
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
          name: 'created_date',
          label: 'Дата создания',
          field: 'created_date',
          align: 'center',
          sortable: true,
          format: (val) => this.formatDate(val)
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
    this.fetchOrders();
  },
  computed: {
    filteredOrders() {
      const search = String(this.appliedSearchQuery || '').trim().toLowerCase();

      return (this.orders || []).filter((order) => {
        if (search && !String(order.order_id || '').toLowerCase().includes(search)) return false;
        return true;
      });
    }
  },
  methods: {
    paginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return `${firstRowIndex}-${endRowIndex} из ${totalRowsNumber}`;
    },
    formatDate(value) {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
    },
    formatPrice(value) {
      return `${Number(value).toFixed(2)}₽`;
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
    getProductPhotos(products) {
      if (!Array.isArray(products)) return [];
      return products.map(product => this.extractFirstPhoto(product.photos)).filter(Boolean);
    },
    getTotalProductsCount(products) {
      if (!Array.isArray(products)) return 0;
      return products.reduce((sum, product) => sum + (Number(product.ordered_count) || 0), 0);
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

        this.orders = rows;
      } catch (error) {
        console.error('Ошибка получения заказов:', error);
        Notify.create({ type: 'negative', message: 'Не удалось загрузить заказы' });
      } finally {
        this.loading = false;
      }
    },
  }
}
</script>
