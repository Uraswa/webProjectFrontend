<!-- widgets/ProductReviewsWidget/ui/RatingDistribution.vue -->
<template>
  <q-card bordered class="q-pa-md">
    <div class="text-subtitle1 text-weight-bold q-mb-md">Распределение оценок</div>
    
    <div 
      v-for="stars in [5,4,3,2,1]" 
      :key="stars" 
      class="row items-center q-mb-xs"
    >
      <div class="col-3">
        <span class="text-caption">{{ stars }} {{ getStarText(stars) }}</span>
      </div>
      
      <div class="col-7">
        <q-linear-progress
          :value="distribution[stars] || 0"
          color="orange"
          size="10px"
          rounded
        />
      </div>
      
      <div class="col-2 text-right">
        <span class="text-caption text-grey">{{ count[stars] || 0 }}</span>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RatingDistribution',
  
  props: {
    distribution: {
      type: Object,
      required: true,
      default: () => ({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
    },
    count: {
      type: Object,
      required: true,
      default: () => ({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
    }
  },
  
  methods: {
    getStarText(count: number): string {
      const lastDigit = count % 10
      const lastTwoDigits = count % 100
      
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'звезд'
      }
      
      switch (lastDigit) {
        case 1:
          return 'звезда'
        case 2:
        case 3:
        case 4:
          return 'звезды'
        default:
          return 'звезд'
      }
    }
  }
})
</script>