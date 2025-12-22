<script>
export default {
  name: "LkSellerLayout",
  data(){
    return {
      leftDrawerOpen: true
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
            Панель продавца
          </q-item-label>

          <q-item clickable v-ripple to="/seller/products">
            <q-item-section avatar>
              <q-icon name="inventory_2" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Товары</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/seller/orders">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Заказы</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/seller/shop">
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Магазин</q-item-label>
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