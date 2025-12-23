<!-- widgets/ProductReviewsWidget/ui/ReviewList.vue -->
<template>
  <div>
    <!-- Список отзывов -->
    <div v-if="visibleReviews.length > 0">
      <div 
        v-for="review in visibleReviews" 
        :key="review.user_id + '-' + review.created_at"
        class="q-mb-lg"
      >
        <!-- Карточка отзыва -->
        <q-card bordered>
          <q-card-section>
            <!-- Заголовок отзыва -->
            <div class="row items-center q-mb-sm">
              <div class="col">
                <div class="text-subtitle1 text-weight-bold">
                  {{ review.first_name }} {{ review.last_name }}
                </div>
                <div class="text-caption text-grey">
                  {{ formatDate(review.created_at) }}
                </div>
              </div>
              
              <div class="col-auto">
                <q-rating
                  :model-value="review.rate"
                  size="1.2em"
                  color="orange"
                  readonly
                />
              </div>
            </div>

            <!-- Достоинства -->
            <div v-if="review.good_text" class="q-mb-sm">
              <div class="text-caption text-weight-medium text-positive">
                <q-icon name="thumb_up" size="xs" class="q-mr-xs"/>
                Достоинства:
              </div>
              <div class="text-body2">{{ review.good_text }}</div>
            </div>

            <!-- Недостатки -->
            <div v-if="review.bad_text" class="q-mb-sm">
              <div class="text-caption text-weight-medium text-negative">
                <q-icon name="thumb_down" size="xs" class="q-mr-xs"/>
                Недостатки:
              </div>
              <div class="text-body2">{{ review.bad_text }}</div>
            </div>

            <!-- Комментарий -->
            <div v-if="review.comment">
              <div class="text-body2">{{ review.comment }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Кнопка "Показать еще" -->
      <div 
        v-if="showLoadMoreButton && !showAllReviews"
        class="text-center q-mt-lg"
      >
        <q-btn
          label="Показать еще"
          color="primary"
          outline
          @click="$emit('load-more')"
        />
      </div>

      <!-- Кнопка "Свернуть" -->
      <div 
        v-if="showCollapseButton"
        class="text-center q-mt-lg"
      >
        <q-btn
          label="Свернуть отзывы"
          color="grey"
          flat
          @click="$emit('collapse')"
        />
      </div>
    </div>

    <!-- Нет отзывов -->
    <div v-else class="text-center q-py-xl">
      <q-icon name="reviews" size="4em" color="grey-4" class="q-mb-md" />
      <div class="text-h6 text-weight-medium q-mb-sm">Нет отзывов</div>
      <div class="text-grey-7">
        {{ searchText || selectedRating ? 
          'Попробуйте изменить критерии поиска' : 
          'Будьте первым, кто оставит отзыв!' 
        }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface ProductReview {
  user_id: number
  product_id: number
  rate: number
  good_text: string | null
  bad_text: string | null
  comment: string | null
  created_at: string
  first_name: string
  last_name: string
}

export default defineComponent({
  name: 'ReviewList',
  
  props: {
    reviews: {
      type: Array as () => ProductReview[],
      required: true,
      default: () => []
    },
    visibleReviewsCount: {
      type: Number,
      default: 5
    },
    showAllReviews: {
      type: Boolean,
      default: false
    },
    searchText: {
      type: String,
      default: ''
    },
    selectedRating: {
      type: Number as () => number | null,
      default: null
    }
  },
  
  emits: ['load-more', 'collapse'],
  
  computed: {
    visibleReviews(): ProductReview[] {
      if (this.showAllReviews) {
        return this.reviews
      }
      return this.reviews.slice(0, this.visibleReviewsCount)
    },
    
    showLoadMoreButton(): boolean {
      return !this.showAllReviews && this.reviews.length > this.visibleReviewsCount
    },
    
    showCollapseButton(): boolean {
      return this.showAllReviews && this.reviews.length > 5
    }
  },
  
  methods: {
    formatDate(dateString: string): string {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } catch {
        return dateString
      }
    }
  }
})
</script>