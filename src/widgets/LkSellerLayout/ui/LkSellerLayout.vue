<script>
import { jwtDecode } from "jwt-decode";

const getLoginRedirect = (to) => ({
  path: "/login",
  query: { redirect: to.fullPath },
});

const getSellerGuardRedirect = (to) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return getLoginRedirect(to);

  try {
    const decoded = jwtDecode(token);
    const expMs = decoded?.exp ? decoded.exp * 1000 : null;

    if (!decoded?.user_id) return getLoginRedirect(to);
    if (expMs && expMs <= Date.now()) {
      localStorage.removeItem("token");
      return getLoginRedirect(to);
    }
  } catch {
    localStorage.removeItem("token");
    return getLoginRedirect(to);
  }

  return null;
};

export default {
  name: "LkSellerLayout",
  data() {
    return {
      leftDrawerOpen: true,
    };
  },
  beforeRouteEnter(to, from, next) {
    const redirect = getSellerGuardRedirect(to);
    if (redirect) return next(redirect);
    return next();
  },
  beforeRouteUpdate(to, from, next) {
    const redirect = getSellerGuardRedirect(to);
    if (redirect) return next(redirect);
    return next();
  },
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

          <q-item clickable v-ripple to="/seller/shops">
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Магазины</q-item-label>
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
