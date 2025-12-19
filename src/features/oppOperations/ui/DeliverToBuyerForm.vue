<script>
import { oppOperationsApi } from '../api/oppOperationsApi'
import { oppOrdersApi } from 'src/features/oppOrders/api/oppOrdersApi'

export default {
  name: 'DeliverToBuyerForm',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    oppId: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue', 'success'],
  data() {
    return {
      orderId: null,
      orderDetails: null,
      loadingOrder: false,
      submitting: false,
      selectedProducts: {},
      rejectionReasons: {}
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
    },
    hasSelectedProducts() {
      return Object.values(this.selectedProducts).some(selected => selected)
    }
  },
  methods: {
    async loadOrder() {
      if (!this.orderId) return

      this.loadingOrder = true
      try {
        this.orderDetails = await oppOrdersApi.getOrderDetails(this.oppId, this.orderId)

        if (this.orderDetails?.products) {
          // Инициализируем все товары как выбранные
          this.selectedProducts = {}
          this.rejectionReasons = {}
          this.orderDetails.products.forEach(product => {
            this.selectedProducts[product.product_id] = true
          })
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при загрузке заказа'
        })
      } finally {
        this.loadingOrder = false
      }
    },
    async submitDelivery() {
      if (!this.hasSelectedProducts) {
        this.$q.notify({
          type: 'warning',
          message: 'Необходимо выбрать хотя бы один товар для выдачи'
        })
        return
      }

      // Проверяем, что для всех отклонённых товаров указана причина
      const rejectedProducts = this.orderDetails.products.filter(
        product => !this.selectedProducts[product.product_id]
      )

      for (const product of rejectedProducts) {
        if (!this.rejectionReasons[product.product_id]?.trim()) {
          this.$q.notify({
            type: 'warning',
            message: `Укажите причину отклонения для товара "${product.name}"`
          })
          return
        }
      }

      this.submitting = true
      try {
        const payload = {
          order_id: this.orderId,
          rejected_products: rejectedProducts.map(product => ({
            product_id: product.product_id,
            count: product.quantity,
            reason: this.rejectionReasons[product.product_id]
          }))
        }

        const result = await oppOperationsApi.deliver(this.oppId, payload)

        if (result.success) {
          this.$q.notify({
            type: 'positive',
            message: 'Заказ успешно выдан покупателю'
          })
          this.$emit('success')
          this.show = false
          this.resetForm()
        } else {
          this.$q.notify({
            type: 'negative',
            message: result.error || 'Ошибка при выдаче заказа'
          })
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при выдаче заказа'
        })
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      this.orderId = null
      this.orderDetails = null
      this.selectedProducts = {}
      this.rejectionReasons = {}
    }
  }
}
</script>

<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 700px; max-width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Выдача заказа покупателю</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- Ввод номера заказа -->
        <div class="q-mb-md">
          <q-input
            v-model.number="orderId"
            label="Номер заказа"
            type="number"
            outlined
            dense
            :disable="loadingOrder || submitting"
          >
            <template v-slot:append>
              <q-btn
                label="Загрузить"
                color="primary"
                flat
                dense
                :loading="loadingOrder"
                @click="loadOrder"
              />
            </template>
          </q-input>
        </div>

        <!-- Товары заказа -->
        <div v-if="orderDetails" style="max-height: 50vh; overflow-y: auto">
          <div class="text-subtitle1 q-mb-md">Выберите товары для выдачи:</div>

          <q-list bordered separator>
            <q-item v-for="product in orderDetails.products" :key="product.product_id">
              <q-item-section side top>
                <q-checkbox
                  v-model="selectedProducts[product.product_id]"
                  :disable="submitting"
                />
              </q-item-section>

              <q-item-section avatar>
                <q-img
                  :src="product.photo"
                  width="50px"
                  height="50px"
                  class="rounded-borders"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium">{{ product.name }}</q-item-label>
                <q-item-label caption>
                  Количество: {{ product.quantity }} шт. × {{ product.price }}₽
                </q-item-label>

                <!-- Поле причины отклонения -->
                <q-input
                  v-if="!selectedProducts[product.product_id]"
                  v-model="rejectionReasons[product.product_id]"
                  label="Причина отклонения"
                  outlined
                  dense
                  class="q-mt-sm"
                  :disable="submitting"
                  :rules="[val => !!val || 'Укажите причину отклонения']"
                />
              </q-item-section>

              <q-item-section side>
                <q-item-label class="text-weight-bold text-primary">
                  {{ (parseFloat(product.price) * product.quantity).toFixed(2) }}₽
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-banner v-if="!hasSelectedProducts" class="bg-warning text-white q-mt-md" rounded>
            <template v-slot:avatar>
              <q-icon name="warning" />
            </template>
            Необходимо выбрать хотя бы один товар для выдачи
          </q-banner>
        </div>

        <div v-else-if="!loadingOrder" class="text-center q-py-md text-grey-7">
          Введите номер заказа и нажмите "Загрузить"
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn label="Отмена" flat v-close-popup :disable="submitting" />
        <q-btn
          label="Выдать заказ"
          color="primary"
          unelevated
          :loading="submitting"
          :disable="!orderDetails || !hasSelectedProducts"
          @click="submitDelivery"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
