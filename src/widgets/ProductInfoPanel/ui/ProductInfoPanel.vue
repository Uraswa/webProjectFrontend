<template>
  <div class="column justify-between" style="height: 100%">
    <div>
      <h4 class="q-mt-none q-mb-md text-weight-bold">{{ product.name }}</h4>
      <p class="text-grey-7 q-mb-lg" style="white-space: pre-line">{{ product.description }}</p>

      <q-list bordered class="rounded-borders q-mb-lg">
        <q-item v-if="product.category_name">
          <q-item-section>
            <q-item-label caption>Категория</q-item-label>
            <q-item-label>{{ product.category_name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="product.shop_name">
          <q-item-section>
            <q-item-label caption>Магазин</q-item-label>
            <q-item-label>{{ product.shop_name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Рейтинг</q-item-label>
            <div class="row items-center">
              <q-rating
                :model-value="parseFloat(rating.average_rating)"
                size="1.5em"
                color="orange"
                readonly
                class="q-mr-sm"
              />

            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div>
      <div class="row items-center q-mb-sm">
        <span class="text-h4 text-weight-bold text-primary q-mr-md">{{ product.price }}₽</span>
      </div>

      <!-- Кнопка добавления в корзину -->
      <q-btn
        label="Добавить в корзину"
        color="primary"
        size="lg"
        icon="shopping_cart"
        class="full-width q-mb-md"
        @click="addToCart"
        :loading="loading"
        unelevated
      />
      <div style="display: flex">
        <q-btn @click="addToCartCount = addToCartCount > 1 ? addToCartCount - 1 : 1">-</q-btn>
        <q-input v-model="addToCartCount"/>
        <q-btn @click="addToCartCount++">+</q-btn>
      </div>

      <!-- Простое уведомление -->
      <div v-if="showNotification" class="q-pa-sm q-mb-md text-center"
           style="background-color: #4caf50; color: white; border-radius: 4px;">
        <q-icon name="check_circle" class="q-mr-sm"/>
        Товар добавлен в корзину!
      </div>

    </div>
  </div>
</template>

<script>
import {cartApi} from "src/features/cart/api/cartApi.js";

export default {
  name: "ProductInfoPanel",
  props: ["product", "rating"],
  data() {
    return {
      loading: false,
      addToCartCount: 1
    }
  },
  methods: {
    async addToCart() {
      this.loading = true;

      await cartApi.updateCartItem(this.product.product_id, this.addToCartCount, true);

      alert("Добавил в корзину")

      this.loading = false;
    }
  }
}
</script>

