<script>
import { oppOperationsApi } from '../api/oppOperationsApi'

export default {
  name: 'ReceiveFromSellerForm',
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
      formData: {
        order_id: null,
        product_id: null,
        count: 1
      },
      submitting: false
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
  methods: {
    async submit() {
      if (!this.formData.order_id || !this.formData.product_id || !this.formData.count) {
        this.$q.notify({
          type: 'warning',
          message: 'Заполните все обязательные поля'
        })
        return
      }

      this.submitting = true
      try {
        const result = await oppOperationsApi.receiveFromSeller(this.oppId, this.formData)

        if (result.success) {
          const logisticsInfo = result?.data?.logistics_info
          const logisticsOrders =
            logisticsInfo?.logistics_orders ||
            logisticsInfo?.logistics_info?.logistics_orders ||
            []

          if (Array.isArray(logisticsOrders) && logisticsOrders.length > 0) {
            const ids = logisticsOrders
              .map((o) => o?.logistics_order_id)
              .filter(Boolean)
              .join(', ')

            this.$q.notify({
              type: 'positive',
              message: `Товар принят. Созданы логистические отправления: ${ids}`
            })
          } else {
          this.$q.notify({
            type: 'positive',
            message: 'Товар успешно принят от продавца'
          })
          }
          this.$emit('success')
          this.show = false
          this.resetForm()
        } else {
          this.$q.notify({
            type: 'negative',
            message: result.error || 'Ошибка при приёме товара'
          })
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Ошибка при приёме товара от продавца'
        })
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      this.formData = {
        order_id: null,
        product_id: null,
        count: 1
      }
    }
  }
}
</script>

<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Приём товара от продавца</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="submit">
          <q-input
            v-model.number="formData.order_id"
            label="Номер заказа *"
            type="number"
            outlined
            class="q-mb-md"
            :disable="submitting"
            :rules="[val => !!val || 'Обязательное поле']"
          />

          <q-input
            v-model.number="formData.product_id"
            label="Номер товара *"
            type="number"
            outlined
            class="q-mb-md"
            :disable="submitting"
            :rules="[val => !!val || 'Обязательное поле']"
          />

          <q-input
            v-model.number="formData.count"
            label="Количество *"
            type="number"
            outlined
            class="q-mb-md"
            :disable="submitting"
            :rules="[
              val => !!val || 'Обязательное поле',
              val => val > 0 || 'Количество должно быть больше 0'
            ]"
          />

          <q-banner class="bg-info text-white" rounded>
            <template v-slot:avatar>
              <q-icon name="info" />
            </template>
            Номера заказа/товара бери из страницы "Заказы" (кнопка с глазом) → список товаров в заказе.
          </q-banner>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn label="Отмена" flat v-close-popup :disable="submitting" />
        <q-btn
          label="Подтвердить приём"
          color="primary"
          unelevated
          :loading="submitting"
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
