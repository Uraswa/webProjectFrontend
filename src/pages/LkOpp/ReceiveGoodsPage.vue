<script>
import { useOppId } from 'src/features/oppSelection/lib/useOppId'

export default {
  name: 'ReceiveGoodsPage',
  data() {
    return {
      oppId: null
    }
  },
  created() {
    const { getOppId } = useOppId()
    this.oppId = getOppId()

    if (!this.oppId) {
      this.$router.push('/pvz-owner/select')
    }
  }
}
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <h4 class="text-h4 text-weight-bold q-mb-xs">Приём товара</h4>
      <p class="text-caption text-grey-7 q-mb-lg">
        Товары, ожидающие приёма на складе ПВЗ
      </p>

      <q-card flat bordered>
        <q-card-section class="text-center q-py-xl">
          <q-icon name="inventory_2" size="4em" color="grey-5" class="q-mb-md" />
          <div class="text-h6 text-grey-7">Страница в разработке</div>
          <p class="text-body2 text-grey-6 q-mt-sm">
            Здесь будет отображаться список товаров, ожидающих приёма
          </p>
          <q-btn
            label="Перейти к операциям"
            color="primary"
            outline
            to="/pvz-owner/operations"
            class="q-mt-md"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>

</style>
