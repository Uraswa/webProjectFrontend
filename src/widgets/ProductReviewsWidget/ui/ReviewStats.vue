<!-- widgets/ProductReviewsWidget/ui/ReviewStats.vue -->
<template>
  <div>
    <!-- Статистика отзывов -->
    <q-card bordered class="text-center q-pa-lg q-mb-lg">
      <div class="text-h2 text-weight-bold text-primary">{{ averageRatingFormatted }}</div>
      <q-rating
        :model-value="averageRatingNumber"
        size="2em"
        color="orange"
        readonly
        class="q-mb-sm"
      />
      <div class="text-caption text-grey-7">{{ feedbackCountText }}</div>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'

export default defineComponent({
  name: 'ReviewStats',
  
  props: {
    rating: {
      type: Object as PropType<{
        total_reviews: string
        average_rating: string
        rating_distribution?: Record<number, number>
      }>,
      default: () => ({})
    }
  },
  
  computed: {
    averageRatingNumber(): number {
      const rating = this.rating.average_rating
      if (typeof rating === 'string') {
        return parseFloat(rating) || 0
      }
      return rating || 0
    },
    
    averageRatingFormatted(): string {
      return this.averageRatingNumber.toFixed(1)
    },
    
    totalReviews(): number {
      const total = this.rating.total_reviews
      if (typeof total === 'string') {
        return parseInt(total) || 0
      }
      return total || 0
    },
    
    feedbackCountText(): string {
      return this.getReviewCountText(this.totalReviews)
    }
  },
  
  methods: {
    getReviewCountText(count: number): string {
      const lastDigit = count % 10
      const lastTwoDigits = count % 100
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return `${count} отзывов`
      }
      
      switch (lastDigit) {
        case 1:
          return `${count} отзыв`
        case 2:
        case 3:
        case 4:
          return `${count} отзыва`
        default:
          return `${count} отзывов`
      }
    }
  }
})
</script>