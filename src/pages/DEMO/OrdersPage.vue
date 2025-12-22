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
                  to="/order/"
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
export default {
  name: "OrdersPage",
  data() {
    return {
      currentTab: 'current',
      currentOrders: [
        {
          id: '123456',
          date: '15 декабря 2024',
          status: 'shipping',
          total: 4300,
          items: [
            { image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
            { image: 'https://cdn.quasar.dev/img/parallax1.jpg' },
            { image: 'https://cdn.quasar.dev/img/mountains.jpg' },
            { image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
            { image: 'https://cdn.quasar.dev/img/parallax1.jpg' }
          ]
        },
        {
          id: '123455',
          date: '10 декабря 2024',
          status: 'packing',
          total: 2800,
          items: [
            { image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
            { image: 'https://cdn.quasar.dev/img/mountains.jpg' }
          ]
        }
      ],
      completedOrders: [
        {
          id: '123454',
          date: '1 декабря 2024',
          deliveredDate: '5 декабря 2024',
          total: 5200,
          items: [
            { image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
            { image: 'https://cdn.quasar.dev/img/parallax1.jpg' },
            { image: 'https://cdn.quasar.dev/img/mountains.jpg' }
          ]
        },
        {
          id: '123453',
          date: '20 ноября 2024',
          deliveredDate: '25 ноября 2024',
          total: 3100,
          items: [
            { image: 'https://cdn.quasar.dev/img/parallax2.jpg' },
            { image: 'https://cdn.quasar.dev/img/parallax1.jpg' }
          ]
        }
      ]
    }
  },
  methods: {
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
      const texts = {
        packing: 'Упаковывается',
        shipping: 'В пути',
        waiting: 'Ожидает в ПВЗ',
        done: 'Доставлен',
        canceled: 'Отменен'
      }
      return texts[status] || 'Неизвестно'
    },
    logout() {
      localStorage.removeItem('token');
      this.$store.dispatch('setUserId', 0);
      this.$router.push('/login');
    }
  }
}
</script>
