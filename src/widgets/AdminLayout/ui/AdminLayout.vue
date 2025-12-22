<script>
export default {
  name: "AdminLayout",
  data() {
    return {
      leftDrawerOpen: true
    };
  }
};
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
            Панель админа
          </q-item-label>

          <q-item clickable v-ripple to="/admin/shops" exact active-class="text-primary">
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Магазины</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/opps" exact active-class="text-primary">
            <q-item-section avatar>
              <q-icon name="local_shipping" />
            </q-item-section>
            <q-item-section>
              <q-item-label>ПВЗ</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
