<script>
import { useOppId } from 'src/features/oppSelection/lib/useOppId'

export default {
  name: "LkOppLayout",
  data() {
    return {
      leftDrawerOpen: true
    }
  },
  methods: {
    changePvz() {
      const { clearOppId } = useOppId()
      clearOppId()
      this.$router.push('/pvz-owner/select')
    }
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="280"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold">
            Панель владельца ПВЗ
          </q-item-label>

          <q-item clickable v-ripple to="/pvz-owner/dashboard">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Главная</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/pvz-owner/orders">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Заказы</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/pvz-owner/logistics">
            <q-item-section avatar>
              <q-icon name="local_shipping" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Логистические отправления</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/pvz-owner/receive-goods">
            <q-item-section avatar>
              <q-icon name="inventory" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Приём товара</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/pvz-owner/operations">
            <q-item-section avatar>
              <q-icon name="swap_horiz" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Операции</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable v-ripple @click="changePvz">
            <q-item-section avatar>
              <q-icon name="swap_horizontal_circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Сменить ПВЗ</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style scoped>

</style>
