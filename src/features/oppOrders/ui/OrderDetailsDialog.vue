<script>
import { oppOrdersApi } from '../api/oppOrdersApi'
import { getStatusColor, getStatusText } from 'src/entities/OppOrder/lib/statusHelpers'

export default {
  name: 'OrderDetailsDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    orderId: {
      type: Number,
      required: true
    },
    oppId: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      loading: true,
      orderDetails: null
    }
  },
  computed: {
    show: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal && this.orderId) {
        this.loadOrderDetails()
      }
    }
  },
  methods: {
    async loadOrderDetails() {
      this.loading = true
      try {
        this.orderDetails = await oppOrdersApi.getOrderDetails(this.oppId, this.orderId)
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при загрузке деталей заказа'
        })
      } finally {
        this.loading = false
      }
    },
    getStatusColor,
    getStatusText,
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('ru-RU')
    },
    calculateTotal() {
      if (!this.orderDetails?.products) return '0'
      return this.orderDetails.products
        .reduce((sum, product) => sum + (parseFloat(product.price) * product.quantity), 0)
        .toFixed(2)
    }
  }
}
</script>

<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 700px; max-width: 90vw">
      <!-- Заголовок -->
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Детали заказа #{{ orderId }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <!-- Контент -->
      <q-card-section style="max-height: 70vh" class="scroll">
        <div v-if="loading" class="row justify-center q-py-xl">
          <q-spinner color="primary" size="3em" />
        </div>

        <div v-else-if="!orderDetails" class="text-center q-py-xl">
          <q-icon name="error_outline" size="4em" color="grey-5" class="q-mb-md" />
          <p class="text-h6 text-grey-7">Не удалось загрузить детали заказа</p>
        </div>

        <div v-else>
          <!-- Основная информация -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7 q-mb-sm">Статус заказа</div>
                  <q-badge
                    :color="getStatusColor(orderDetails.status)"
                    :label="getStatusText(orderDetails.status)"
                    class="text-body1"
                  />
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7 q-mb-sm">Общая сумма</div>
                  <div class="text-h6 text-primary">{{ orderDetails.total_sum }}₽</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7 q-mb-sm">Дата создания</div>
                  <div class="text-body1">{{ formatDate(orderDetails.created_at) }}</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 text-grey-7 q-mb-sm">Пункт выдачи</div>
                  <div class="text-body1">{{ orderDetails.pickup_address }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Информация о покупателе -->
          <div v-if="orderDetails.buyer_name || orderDetails.buyer_phone" class="q-mb-lg">
            <div class="text-h6 q-mb-md">Покупатель</div>
            <q-card flat bordered>
              <q-card-section>
                <div v-if="orderDetails.buyer_name" class="q-mb-sm">
                  <span class="text-weight-medium">Имя:</span> {{ orderDetails.buyer_name }}
                </div>
                <div v-if="orderDetails.buyer_phone">
                  <span class="text-weight-medium">Телефон:</span> {{ orderDetails.buyer_phone }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Товары -->
          <div class="q-mb-lg">
            <div class="text-h6 q-mb-md">Товары в заказе</div>
            <q-list bordered separator>
              <q-item v-for="product in orderDetails.products" :key="product.product_id">
                <q-item-section avatar>
                  <q-img
                    :src="product.photo"
                    width="60px"
                    height="60px"
                    class="rounded-borders"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ product.name }}</q-item-label>
                  <q-item-label caption>
                    Количество: {{ product.quantity }} шт.
                  </q-item-label>
                  <q-item-label caption>
                    Номер товара: {{ product.product_id }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label class="text-weight-bold text-primary">
                    {{ (parseFloat(product.price) * product.quantity).toFixed(2) }}₽
                  </q-item-label>
                  <q-item-label caption>
                    {{ product.price }}₽ / шт.
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- История статусов -->
          <div v-if="orderDetails.status_history && orderDetails.status_history.length > 0">
            <div class="text-h6 q-mb-md">История статусов</div>
            <q-timeline color="primary">
              <q-timeline-entry
                v-for="(history, index) in orderDetails.status_history"
                :key="index"
                :title="getStatusText(history.status)"
                :subtitle="formatDate(history.timestamp)"
              >
                <div v-if="history.comment" class="text-grey-7">
                  {{ history.comment }}
                </div>
              </q-timeline-entry>
            </q-timeline>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Действия -->
      <q-card-actions align="right">
        <q-btn label="Закрыть" color="primary" flat v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
