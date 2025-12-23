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
        :disabled="product.count == 0"
      />
      <div class="row items-center q-mb-sm">
        <div
          class="text-caption row items-center"
          :class="product.count > 0 ? 'text-positive' : 'text-negative'"
        >
          <q-icon
            :name="product.count > 0 ? 'check_circle' : 'cancel'"
            size="16px"
            class="q-mr-xs"
          />
          <span v-if="product.count == 0">Товар закончился!</span>
          <span v-else>В наличии: {{ product.count }} шт.</span>
        </div>
      </div>

      <div v-if="product.count > 0" class="row items-center qty-control">
        <q-btn
          round
          dense
          flat
          icon="remove"
          color="primary"
          :disable="loading || addToCartCount <= 1"
          @click="decreaseQty"
        />
        <q-input
          v-model.number="addToCartCount"
          type="number"
          dense
          outlined
          hide-bottom-space
          class="qty-input"
          input-class="text-center text-weight-medium"
          :min="1"
          :max="product.count"
          :disable="loading"
        />
        <q-btn
          round
          dense
          flat
          icon="add"
          color="primary"
          :disable="loading || addToCartCount >= product.count"
          @click="increaseQty"
        />
      </div>

    </div>
  </div>
</template>

<script>
import {cartApi} from "src/features/cart/api/cartApi.js";
import { Notify } from "quasar";

export default {
  name: "ProductInfoPanel",
  props: ["product", "rating"],
  data() {
    return {
      loading: false,
      addToCartCount: 1,
    }
  },
  methods: {
    normalizeQty(value) {
      const max = Number(this.product?.count ?? 0);
      let qty = Number(value);

      if (!Number.isFinite(qty)) qty = 1;
      qty = Math.floor(qty);
      if (qty < 1) qty = 1;
      if (max > 0 && qty > max) qty = max;

      return qty;
    },
    increaseQty() {
      this.addToCartCount = this.normalizeQty(Number(this.addToCartCount) + 1);
    },
    decreaseQty() {
      this.addToCartCount = this.normalizeQty(Number(this.addToCartCount) - 1);
    },
    async addToCart() {
      this.loading = true;

      try {
        const qty = this.normalizeQty(this.addToCartCount);
        this.addToCartCount = qty;
        await cartApi.updateCartItem(this.product.product_id, qty, true);

        Notify.create({
          type: "positive",
          message: "Добавлено в корзину",
          caption: `${qty} шт.`,
          icon: "check_circle",
          position: "top-right",
          timeout: 1500,
        });
      } catch (err) {
        const backendMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message;

        console.error("Ошибка добавления в корзину:", err);
        Notify.create({
          type: "negative",
          message: "Не удалось добавить в корзину",
          caption: backendMessage ? String(backendMessage) : "Попробуйте ещё раз",
          icon: "error",
          position: "top-right",
          timeout: 3000,
        });
      } finally {
        this.loading = false;
      }
    }
  },
  watch: {
    addToCartCount(newValue) {
      const normalized = this.normalizeQty(newValue);
      if (Number(newValue) !== normalized) {
        this.addToCartCount = normalized;
      }
    },
    product: {
      deep: true,
      handler() {
        this.addToCartCount = this.normalizeQty(this.addToCartCount);
      }
    }
  }
}
</script>

<style scoped>
.qty-control {
  gap: 10px;
}

.qty-input {
  width: 96px;
}

.qty-input :deep(.q-field__control) {
  border-radius: 12px;
}

/* Hide native number spinners; quantity changes via +/- buttons */
.qty-input :deep(input[type='number']::-webkit-outer-spin-button),
.qty-input :deep(input[type='number']::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input :deep(input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>

