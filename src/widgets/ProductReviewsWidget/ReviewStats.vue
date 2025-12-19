<!-- widgets/ProductReviewsWidget/ReviewStats.vue -->
<template>
  <q-card bordered class="text-center q-pa-lg q-mb-md">
    <div class="text-h2 text-weight-bold text-primary">{{ parseFloat(rating.average_rating).toFixed(2) }}</div>
    <q-rating
      :model-value="parseFloat(rating.average_rating)"
      size="2em"
      color="orange"
      readonly
      class="q-mb-sm"
    />
    <div class="text-caption text-grey-7">{{ rating.total_reviews }} отзывов</div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ReviewStats',
  props: {
    rating: {
      type: Object as PropType<{ total_reviews: string; average_rating: string }>,
      required: true
    }
  }
})
</script>