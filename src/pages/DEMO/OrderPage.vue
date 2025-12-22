<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="flex flex-center" style="min-height: 400px">
      <q-spinner color="primary" size="50px" />
    </div>

    <div v-else-if="error" class="flex flex-center" style="min-height: 400px">
      <div class="text-center">
        <q-icon name="error" size="64px" color="negative" />
        <div class="text-h6 q-mt-md">{{ error }}</div>
        <q-btn
          label="Вернуться к заказам"
          color="primary"
          flat
          to="/orders/"
          class="q-mt-md"
        />
      </div>
    </div>

    <div v-else-if="orderData">
      <!-- Хлебные крошки -->
      <q-breadcrumbs class="q-mb-xl">
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Мои заказы" to="/orders/" />
        <q-breadcrumbs-el :label="`Заказ #${orderData.order_id}`" />
      </q-breadcrumbs>

      <div class="row items-center justify-between q-mb-lg">
        <div class="col">
          <h4 class="q-my-none text-weight-bold">Заказ #{{ orderData.order_id }}</h4>
          <div class="text-caption text-grey-7">от {{ formatDate(orderData.created_date) }}</div>
        </div>
        <div class="col-auto">
          <q-badge
            :color="currentStatusColor"
            :label="currentStatusLabel"
            size="lg"
          />
        </div>
      </div>

      <div class="row q-col-gutter-xl">
        <!-- Левая колонка - информация о заказе -->
        <div class="col-md-8 col-12">
          <!-- Товары в заказе -->
          <q-card flat bordered class="q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Товары в заказе</div>

              <div class="column q-gutter-y-md">
                <q-item
                  v-for="item in orderData.products"
                  :key="item.product_id"
                  class="q-pa-none"
                >
                  <q-item-section avatar>
                    <q-img
                      :src="getProductImage(item.photos)"
                      width="80px"
                      height="80px"
                      class="rounded-borders"
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ item.name }}</q-item-label>
                    <q-item-label caption>Количество: {{ item.ordered_count }} шт.</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="column items-end">
                      <div class="text-h6 text-weight-bold text-primary">
                        {{ formatPrice(parseFloat(item.price) * item.ordered_count) }}₽
                      </div>
                      <div class="text-caption text-grey-7">{{ item.ordered_count }} × {{ formatPrice(parseFloat(item.price)) }}₽</div>
                    </div>
                  </q-item-section>
                </q-item>
              </div>
            </q-card-section>
          </q-card>

          <!-- Информация о доставке -->
          <q-card flat bordered class="q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Информация о доставке</div>

              <q-list bordered separator>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Получатель</q-item-label>
                    <q-item-label>{{ orderData.first_name }} {{ orderData.last_name }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Адрес доставки</q-item-label>
                    <q-item-label>{{ orderData.address }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="orderData.received_date">
                  <q-item-section>
                    <q-item-label caption>Дата получения</q-item-label>
                    <q-item-label>{{ formatDate(orderData.received_date) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="orderData.current_status">
                  <q-item-section>
                    <q-item-label caption>Текущий статус</q-item-label>
                    <q-item-label>{{ orderData.current_status }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <!-- История статусов -->
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">История заказа</div>

              <q-timeline color="primary">
                <q-timeline-entry
                  v-for="(status, index) in orderData.status_history"
                  :key="index"
                  :title="status.name"
                  :subtitle="formatDate(status.time)"
                  :icon="getStatusIcon(status.name)"
                  :color="index === orderData.status_history.length - 1 ? 'blue' : 'primary'"
                />
              </q-timeline>
            </q-card-section>
          </q-card>
        </div>

        <!-- Правая колонка - итоги -->
        <div class="col-md-4 col-12" :class="$q.screen.lt.md ? 'order-first' : ''">
          <q-card flat bordered class="sticky">
            <q-card-section>
              <div class="column q-gutter-y-md">
                <!-- Информация о стоимости -->
                <div class="column q-gutter-y-sm">
                  <div class="row items-center justify-between">
                    <div class="text-caption text-grey-7">Товары ({{ orderData.products.length }})</div>
                    <div class="text-caption">{{ formatPrice(parseFloat(orderData.total)) }}₽</div>
                  </div>

                  <div class="row items-center justify-between">
                    <div class="text-caption text-grey-7">Доставка</div>
                    <div class="text-caption text-green">Бесплатно</div>
                  </div>

                  <q-separator />

                  <div class="row items-center justify-between">
                    <div class="text-h6 text-weight-bold">Итого</div>
                    <div class="text-h5 text-weight-bold text-primary">{{ formatPrice(parseFloat(orderData.total)) }}₽</div>
                  </div>
                </div>

                <!-- Кнопки действий -->
                <div class="column q-gutter-y-sm">
                  <q-btn
                    label="Вернуться к заказам"
                    color="primary"
                    outline
                    to="/orders/"
                    class="full-width"
                  />
                  <q-btn
                    label="Связаться с поддержкой"
                    color="grey"
                    flat
                    class="full-width"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { orderApi } from 'src/entities/order/api/orderApi.ts'

export default {
  name: "OrderPage",
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderData: null,
      loading: true,
      error: null
    }
  },
  computed: {
    currentStatusLabel() {
      if (!this.orderData?.status_history?.length) return 'Неизвестно'
      return this.orderData.status_history[this.orderData.status_history.length - 1].name
    },
    currentStatusColor() {
      const status = this.currentStatusLabel.toLowerCase()
      if (status.includes('упаковывается') || status.includes('сборк')) return 'orange'
      if (status.includes('доставк') || status.includes('пути')) return 'blue'
      if (status.includes('получен') || status.includes('выдан')) return 'green'
      if (status.includes('отменен')) return 'red'
      return 'grey'
    }
  },
  async mounted() {
    await this.fetchOrder()
  },
  methods: {
    async fetchOrder() {
      try {
        this.loading = true
        this.error = null
        this.orderData = await orderApi.getOrder(this.orderId)
      } catch (err) {
        console.error('Error loading order:', err)
        this.error = 'Не удалось загрузить данные заказа'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatPrice(price) {
      return price.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    getProductImage(photos) {
      if (!photos || !photos.length) return '/placeholder.png'
      const photo = Array.isArray(photos) ? photos[0] : photos
      return photo.startsWith('http') ? photo : `http://localhost:8000/uploads/${photo}`
    },
    getStatusIcon(statusName) {
      const status = statusName.toLowerCase()
      if (status.includes('создан')) return 'create'
      if (status.includes('оплачен')) return 'payment'
      if (status.includes('упаковывается') || status.includes('сборк')) return 'inventory_2'
      if (status.includes('доставк') || status.includes('пути')) return 'local_shipping'
      if (status.includes('получен') || status.includes('выдан') || status.includes('пвз')) return 'store'
      if (status.includes('отменен')) return 'cancel'
      return 'info'
    }
  }
}
</script>