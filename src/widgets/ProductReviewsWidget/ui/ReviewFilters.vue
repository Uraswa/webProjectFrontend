<!-- widgets/ProductReviewsWidget/ui/ReviewFilters.vue -->
<template>
  <q-card bordered class="q-pa-md q-mb-lg">
    <!-- Поиск по отзывам -->
    <div class="row items-center q-col-gutter-md">
      <div class="col-8">
        <q-input
          v-model="searchText"
          placeholder="Поиск по отзывам..."
          dense
          outlined
          clearable
          @update:model-value="handleSearch"
        >
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </div>
      
      <!-- Фильтр по оценке -->
      <div class="col-4">
        <q-select
          v-model="selectedRating"
          :options="ratingOptions"
          label="Фильтр по оценке"
          dense
          outlined
          emit-value
          map-options
          clearable
          @update:model-value="handleRatingFilter"
        />
      </div>
    </div>

    <!-- Быстрый выбор оценки -->
    <div class="q-mt-md">
      <div class="text-caption text-weight-medium q-mb-sm">Быстрый выбор оценки:</div>
      <div class="row q-col-gutter-xs">
        <div 
          class="col-auto" 
          v-for="star in [5,4,3,2,1]" 
          :key="star"
        >
          <q-btn
            :label="`${star}`"
            :color="selectedRating === star ? 'primary' : 'grey-5'"
            :text-color="selectedRating === star ? 'white' : 'dark'"
            size="sm"
            padding="xs sm"
            @click="toggleRatingFilter(star)"
          >
            <q-icon name="star" size="xs" class="q-mr-xs"/>
          </q-btn>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ReviewFilters',
  
  emits: ['search', 'rating-filter'],
  
  data() {
    return {
      searchText: '',
      selectedRating: null as number | null,
      ratingOptions: [
        { label: 'Все оценки', value: null },
        { label: '5 звезд', value: 5 },
        { label: '4 звезды', value: 4 },
        { label: '3 звезды', value: 3 },
        { label: '2 звезды', value: 2 },
        { label: '1 звезда', value: 1 }
      ]
    }
  },
  
  methods: {
    handleSearch(value: string) {
      this.searchText = value
      this.$emit('search', value)
    },
    
    handleRatingFilter(rating: number | null) {
      this.selectedRating = rating
      this.$emit('rating-filter', rating)
    },
    
    toggleRatingFilter(rating: number) {
      const newRating = this.selectedRating === rating ? null : rating
      this.selectedRating = newRating
      this.$emit('rating-filter', newRating)
    },
    
    resetFilters() {
      this.searchText = ''
      this.selectedRating = null
      this.$emit('search', '')
      this.$emit('rating-filter', null)
    }
  }
})
</script>