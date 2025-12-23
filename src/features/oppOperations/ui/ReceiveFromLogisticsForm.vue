<script>
import { oppOperationsApi } from '../api/oppOperationsApi'

export default {
  name: 'ReceiveFromLogisticsForm',
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
      logisticsOrderId: null,
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
      if (!this.logisticsOrderId) {
        this.$q.notify({
          type: 'warning',
          message: 'Укажите номер логистического заказа'
        })
        return
      }

      this.submitting = true
      try {
        const result = await oppOperationsApi.receiveFromLogistics(this.oppId, {
          logistics_order_id: this.logisticsOrderId
        })

        if (result.success) {
          this.$q.notify({
            type: 'positive',
            message: 'Товар успешно принят от логистики'
          })
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
          message: 'Ошибка при приёме товара от логистики'
        })
      } finally {
        this.submitting = false
      }
    },
    resetForm() {
      this.logisticsOrderId = null
    }
  }
}
</script>

<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Приём товара от логистики</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="submit">
          <q-input
            v-model.number="logisticsOrderId"
            label="Номер логистического заказа *"
            type="number"
            outlined
            class="q-mb-md"
            :disable="submitting"
            :rules="[val => !!val || 'Обязательное поле']"
          />

          <q-banner class="bg-info text-white" rounded>
            <template v-slot:avatar>
              <q-icon name="info" />
            </template>
            Подтверждение получения товара от курьерской службы
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
