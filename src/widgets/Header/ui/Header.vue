<template>
  <div class="header">
    <!-- Десктопная версия -->
    <div class="row items-center desktop-header">
      <div class="col-12 col-md-2">
        <RouterLink to="/">
          <p class="logo">Sellzy</p>
        </RouterLink>
      </div>

      <div class="col-12 col-md-2">
        <q-btn
          icon="menu"
          label="Каталог"
          :to="{ name: 'catalog' }"
          class="full-width-mobile"
        />
      </div>

      <div class="col-12 col-md-5">
        <ProductSearchInput />
      </div>

      <div class="col-12 col-md-3 text-right">
        <q-btn round flat icon="shopping_basket" @click="handleCartClick" />
        <q-btn round flat icon="account_circle" @click="handleAccountClick" />
      </div>
    </div>
  </div>
</template>

<script>
import ProductSearchInput from 'src/features/productSearch/ui/productSearchInput.vue'

export default {
  name: 'Header',
  components: {
    ProductSearchInput
  },
  methods: {
    handleAccountClick() {
      const userId = this.$store.state.user_id;

      if (userId) {
        this.$router.push('/orders/');
      } else {
        this.$router.push({ path: '/login', query: { redirect: '/orders/' } });
      }
    },
    handleCartClick() {
      const userId = this.$store.state.user_id;

      if (userId) {
        this.$router.push('/cart/');
      } else {
        this.$router.push({ path: '/login', query: { redirect: '/cart/' } });
      }
    }
  }
}
</script>

<style scoped>
.header {
  padding: 10px 0;
  background-color: white;
}

.logo {
  margin: 0;
  font-size: 2em;
  line-height: 1;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .desktop-header {
    gap: 15px;
  }
  
  .logo {
    font-size: 1.8em;
    text-align: center;
    margin-bottom: 5px;
  }
  
  .full-width-mobile {
    width: 100%;
    justify-content: center;
  }
  
  /* Делаем элементы блочными на мобильных */
  .desktop-header > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .text-right {
    justify-content: center !important;
  }
}

@media (max-width: 576px) {
  .logo {
    font-size: 1.6em;
  }
  
  .header {
    padding: 8px 0;
  }
}
</style>