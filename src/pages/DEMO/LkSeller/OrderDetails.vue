<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">Заказ #{{ id }}</div>
        <div class="text-caption text-grey-7">Детали заказа</div>
      </div>
      <q-btn flat color="primary" icon="arrow_back" label="Назад" @click="$router.back()" />
    </div>

    <q-card v-if="error" flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-negative">{{ error }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div v-if="loading">Загрузка...</div>
        <div v-else-if="order">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-medium">Статус</div>
              <div class="text-body1">{{ order.current_status || '—' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-medium">Сумма (ваши товары)</div>
              <div class="text-body1">{{ total }}₽</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-medium">ПВЗ</div>
              <div class="text-body1">{{ order.opp_address || '—' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-medium">Получатель</div>
              <div class="text-body1">
                {{ [order.receiver_first_name, order.receiver_last_name].filter(Boolean).join(' ') || '—' }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-table
        :rows="items"
        :columns="columns"
        row-key="product_id"
        :loading="loading"
        flat
        bordered
        rows-per-page-label="Записей на странице"
        :rows-per-page-options="[5, 10, 20, 50]"
        :pagination-label="paginationLabel"
        no-data-label="Товары не найдены"
      >
        <template v-slot:body-cell-subtotal="props">
          <q-td :props="props">
            {{ (Number(props.row.price) * Number(props.row.ordered_count)).toFixed(2) }}₽
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
  name: "SellerOrderDetailsPage",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      error: "",
      order: null,
      items: [],
      total: "0.00",
      columns: [
        { name: "shop_name", label: "Магазин", field: "shop_name", align: "left" },
        { name: "product_name", label: "Товар", field: "product_name", align: "left" },
        { name: "ordered_count", label: "Кол-во", field: "ordered_count", align: "right" },
        { name: "price", label: "Цена", field: "price", align: "right" },
        { name: "subtotal", label: "Сумма", field: "subtotal", align: "right" },
      ],
    };
  },
  mounted() {
    this.fetchOrderDetails();
  },
  methods: {
    paginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return `${firstRowIndex}-${endRowIndex} из ${totalRowsNumber}`;
    },
    async fetchOrderDetails() {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await Api.get(`/api/seller/orders/${this.id}`);
        if (!data?.success) {
          this.error = data?.error || "Не удалось загрузить заказ";
          return;
        }
        this.order = data.data.order;
        this.items = data.data.items || [];
        this.total = data.data.total || "0.00";
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Ошибка загрузки заказа";
        this.error = message;
        Notify.create({ type: "negative", message });

        if (error?.response?.status === 401) {
          this.$router.push({ path: "/login", query: { redirect: this.$route.fullPath } });
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
