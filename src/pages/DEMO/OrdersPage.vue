<template>
  <q-page class="q-pa-lg">
    <!-- Хлебные крошки -->
    <q-breadcrumbs class="q-mb-xl">
      <q-breadcrumbs-el label="Главная" icon="home"/>
      <q-breadcrumbs-el label="Мои заказы" />
    </q-breadcrumbs>

    <div class="row q-col-gutter-lg">
      <!-- Основная колонка с заказами -->
      <div class="col-12 col-md-9">
        <div class="text-h4 text-weight-bold q-mb-lg">Мои заказы</div>

    <!-- Вкладки -->
    <q-tabs
      v-model="currentTab"
      dense
      class="text-grey-7"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="current" label="Текущие" />
      <q-tab name="completed" label="Завершенные" />
    </q-tabs>

    <q-separator class="q-mb-lg" />

    <!-- Контент вкладок -->
    <q-tab-panels v-model="currentTab" animated>
      <!-- Текущие заказы -->
      <q-tab-panel name="current">
        <div class="column q-gutter-y-md">
          <q-card
            v-for="order in currentOrders"
            :key="order.id"
            flat
            bordered
          >
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <div class="text-h6 text-weight-bold">Заказ #{{ order.id }}</div>
                  <div class="text-caption text-grey-7">от {{ order.date }}</div>
                </div>
                <q-badge
                  :color="getStatusColor(order.status)"
                  :label="getStatusText(order.status)"
                />
              </div>

              <!-- Фотографии товаров -->
              <div class="row q-gutter-xs q-mb-md">
                <q-img
                  v-for="(item, index) in order.items"
                  :key="index"
                  :src="item.image"
                  width="60px"
                  height="60px"
                  class="rounded-borders"
                />
                <div
                  v-if="order.items.length > 4"
                  class="flex flex-center bg-grey-3 rounded-borders"
                  style="width: 60px; height: 60px"
                >
                  <div class="text-caption text-grey-7">+{{ order.items.length - 4 }}</div>
                </div>
              </div>

              <div class="row items-center justify-between">
                <div class="text-h6 text-primary">{{ order.total }}₽</div>
                <q-btn
                  label="Подробнее"
                  color="primary"
                  outline
                  :to="`/order/${order.id}`"
                  size="sm"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>

      <!-- Завершенные заказы -->
      <q-tab-panel name="completed">
        <div class="column q-gutter-y-md">
          <q-card
            v-for="order in completedOrders"
            :key="order.id"
            flat
            bordered
          >
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <div class="text-h6 text-weight-bold">Заказ #{{ order.id }}</div>
                  <div class="text-caption text-grey-7">от {{ order.date }}</div>
                </div>
                <div class="text-caption text-green">
                  Доставлен {{ order.deliveredDate }}
                </div>
              </div>

              <!-- Фотографии товаров -->
              <div class="row q-gutter-xs q-mb-md">
                <q-img
                  v-for="(item, index) in order.items"
                  :key="index"
                  :src="item.image"
                  width="60px"
                  height="60px"
                  class="rounded-borders"
                />
                <div
                  v-if="order.items.length > 4"
                  class="flex flex-center bg-grey-3 rounded-borders"
                  style="width: 60px; height: 60px"
                >
                  <div class="text-caption text-grey-7">+{{ order.items.length - 4 }}</div>
                </div>
              </div>

              <div class="row items-center justify-between">
                <div class="text-h6 text-primary">{{ order.total }}₽</div>
                <q-btn
                  label="Оценить товары"
                  to="/product/"
                  color="primary"
                  unelevated
                  size="sm"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>
    </q-tab-panels>
      </div>

      <!-- Боковая колонка с кнопкой выхода -->
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6 q-mb-md">Профиль</div>
            <q-btn
              label="Выйти"
              color="negative"
              outline
              icon="logout"
              class="full-width"
              @click="logout"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import Api from "src/shared/api/Api.js";

export default {
  name: "OrdersPage",
  data() {
    return {
      currentTab: 'current',
      currentOrders: [],
      completedOrders: [],
      isLoading: false
    }
  },
  async mounted() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.isLoading = true;
      try {
        const response = await Api.get("/api/orders");

        if (response.status === 200 && response.data.success) {
          const orders = response.data.data;

          // Разделяем заказы на текущие и завершенные
          this.currentOrders = [];
          this.completedOrders = [];

          orders.forEach(order => {
            const formattedOrder = this.formatOrder(order);

            if (order.current_status === 'done') {
              this.completedOrders.push(formattedOrder);
            } else {
              this.currentOrders.push(formattedOrder);
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        this.isLoading = false;
      }
    },
    formatOrder(order) {
      return {
        id: order.order_id,
        date: this.formatDate(order.created_date),
        deliveredDate: order.received_date ? this.formatDate(order.received_date) : null,
        status: order.current_status || 'packing',
        total: parseFloat(order.total),
        items: order.products.map(product => ({
          image: this.getProductImage(product.photos),
          name: product.name
        }))
      };
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('ru-RU', options);
    },
    getProductImage(photosString) {
      try {
        const photos = JSON.parse(photosString);
        return photos && photos.length > 0 ? photos[0] : 'https://cdn.quasar.dev/img/image-placeholder.png';
      } catch (e) {
        return 'https://cdn.quasar.dev/img/image-placeholder.png';
      }
    },
    getStatusColor(status) {
      const colors = {
        "Упаковывается": 'orange',
        "Передан в доставку": 'blue',
        "Ожидает в ПВЗ": 'yellow',
        "Завершен": 'green',
        "Отменен": 'red'
      }
      return colors[status] || 'grey'
    },
    getStatusText(status) {

      return (status)
    },
    logout() {
      localStorage.removeItem('token');
      this.$store.dispatch('setUserId', 0);
      this.$router.push('/login');
    }
  }
}
</script>
