<template>
  <q-item class="q-pa-none cart-item">
    <q-item-section avatar>
      <q-checkbox 
        :model-value="selected" 
        @update:model-value="$emit('toggle-select')" 
      />
    </q-item-section>

    <q-item-section avatar>
      <router-link :to="`/product/${item.product_id}`" style="text-decoration: none;">
        <q-img
          :src="item.image"
          width="80px"
          height="80px"
          class="rounded-borders"
          :ratio="1"
        />
      </router-link>
    </q-item-section>

    <q-item-section>
      <router-link :to="`/product/${item.product_id}`" style="text-decoration: none; color: inherit;">
        <q-item-label class="text-weight-medium cursor-pointer">
          {{ item.name }}
        </q-item-label>
      </router-link>
      <q-item-label caption lines="2">{{ item.description }}</q-item-label>
      <q-item-label caption class="text-grey-6">
        Магазин: {{ item.product.shop_name }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="column items-end q-gutter-y-xs">
        <div class="text-h6 text-weight-bold text-primary">
          {{ (item.price * item.quantity).toFixed(2) }}₽
        </div>
        <div class="text-caption text-grey-7">
          {{ item.price.toFixed(2) }}₽ × {{ item.quantity }} шт.
        </div>
      </div>
    </q-item-section>

    <q-item-section side>
      <div class="column items-center q-gutter-y-xs">
        <q-btn
          round
          dense
          flat
          icon="remove"
          size="sm"
          :disable="item.quantity <= 1 || loading"
          @click="$emit('decrease')"
        />
        <div class="text-weight-medium">{{ item.quantity }} шт.</div>
        <q-btn
          round
          dense
          flat
          icon="add"
          size="sm"
          :disable="loading"
          @click="$emit('increase')"
        />
      </div>
    </q-item-section>

    <q-item-section side>
      <q-btn
        flat
        round
        dense
        color="grey"
        icon="delete"
        :disable="loading"
        @click="$emit('remove')"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    id: number;
    product_id: number;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    product: any;
  };
  selected: boolean;
  loading: boolean;
}>();

defineEmits<{
  'toggle-select': [];
  'increase': [];
  'decrease': [];
  'remove': [];
}>();
</script>

<style scoped>
.cart-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  text-decoration: underline;
}
</style>