<template>
  <q-card flat bordered class="cart-summary-card">
    <q-card-section>
      <div class="column q-gutter-y-md">
        <!-- Кнопка оформления -->
        <q-btn
          label="Перейти к оформлению"
          color="primary"
          size="lg"
          icon="shopping_cart"
          class="full-width"
          unelevated
          :to="disabled ? '#' : '/checkout/'"
          :disable="disabled"
        />

        <!-- Информация о стоимости -->
        <div class="column q-gutter-y-sm">
          <div class="row items-center justify-between">
            <div class="text-caption text-grey-7">Товары ({{ selectedItemsCount }})</div>
            <div class="text-caption">{{ totalPrice.toFixed(2) }}₽</div>
          </div>

          <div class="row items-center justify-between">
            <div class="text-caption text-grey-7">Доставка</div>
            <div class="text-caption">
              <span v-if="deliveryPrice === 0" class="text-green">Бесплатно</span>
              <span v-else>{{ deliveryPrice.toFixed(2) }}₽</span>
            </div>
          </div>

          <q-separator />

          <div class="row items-center justify-between">
            <div class="text-h6 text-weight-bold">Итого</div>
            <div class="text-h5 text-weight-bold text-primary">{{ totalWithDelivery.toFixed(2) }}₽</div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  selectedItemsCount: number;
  totalPrice: number;
  deliveryPrice: number;
  totalWithDelivery: number;
  cartItemCount: number;
  cartTotal: string;
  disabled?: boolean;
}>();

function getRussianPlural(number: number, one: string, two: string, five: string): string {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;
  
  if (n > 10 && n < 20) return five;
  if (n1 > 1 && n1 < 5) return two;
  if (n1 === 1) return one;
  return five;
}
</script>

<style scoped>
.cart-summary-card {
  position: sticky;
  top: 20px;
}
</style>