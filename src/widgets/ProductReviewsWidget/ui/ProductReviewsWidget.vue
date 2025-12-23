<template>
  <q-card flat class="q-mb-xl">
    <q-card-section>
      <div class="text-h5 text-weight-bold q-mb-md">Отзывы</div>
      
      <!-- Первая строка: оценка и распределение -->
      <div class="row q-col-gutter-lg q-mb-lg">
        <div class="col-md-6 col-12">
          <ReviewStats :rating="computedRating" />
        </div>
        
        <div class="col-md-6 col-12">
          <RatingDistribution 
            :distribution="ratingDistribution"
            :count="distributionCount"
          />
        </div>
      </div>
      
      <!-- Вторая строка: кнопка добавить отзыв (30% ширины) -->
      <div class="row justify-center q-mb-lg">
        <div class="col-12 col-md-4">
          <q-btn
            label="Написать отзыв"
            color="primary"
            icon="rate_review"
            class="full-width"
            unelevated
            @click="openReviewDialog"
          />
        </div>
      </div>
      
      <!-- Третья строка: фильтры и список отзывов -->
      <div>
        <ReviewFilters
          @search="handleSearch"
          @rating-filter="handleRatingFilter"
          class="q-mb-lg"
        />

        <ReviewList
          :reviews="filteredFeedback"
          :visible-reviews-count="visibleReviewsCount"
          :show-all-reviews="showAllReviews"
          @load-more="loadMoreReviews"
          @collapse="collapseReviews"
        />
      </div>
    </q-card-section>
  </q-card>
  
  <ReviewDialog
    ref="reviewDialog"
    @submit="submitReview"
    @cancel="handleDialogCancel"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReviewStats from './ReviewStats.vue'
import ReviewList from './ReviewList.vue'
import ReviewFilters from './ReviewFilters.vue'
import RatingDistribution from './RatingDistribution.vue'
import ReviewDialog from './ReviewDialog.vue'
import Api from "src/shared/api/Api.js";
import { Notify } from 'quasar'

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

interface ProductRating {
  total_reviews: string
  average_rating: string
  rating_distribution?: Record<number, number>
}

export default defineComponent({
  name: 'ProductReviewsWidget',
  
  components: {
    ReviewStats,
    ReviewList,
    ReviewFilters,
    RatingDistribution,
    ReviewDialog
  },
  
  props: {
    productId: {
      type: Number,
      required: true
    },
    initialFeedback: {
      type: Array as () => ProductReview[],
      default: () => []
    },
    initialRating: {
      type: Object as () => ProductRating,
      default: null
    }
  },
  
  data() {
    return {
      feedback: [] as ProductReview[],
      rating: null as ProductRating | null,
      searchText: '',
      selectedRating: null as number | null,
      visibleReviewsCount: 5,
      showAllReviews: false,
      reviewsToLoadPerClick: 5
    }
  },

  watch: {
    initialFeedback: {
      immediate: true,
      handler(feedback: ProductReview[]) {
        this.feedback = Array.isArray(feedback) ? feedback : []
      }
    },
    initialRating: {
      immediate: true,
      handler(rating: ProductRating | null) {
        this.rating = rating
      }
    }
  },
  
  computed: {
    computedRating(): ProductRating {
      return this.rating || {
        average_rating: '0',
        total_reviews: '0',
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    },
    
    feedbackByRating(): Record<number, ProductReview[]> {
      const groups: Record<number, ProductReview[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] }
      
      this.feedback.forEach(review => {
        if (groups[review.rate]) {
          groups[review.rate].push(review)
        }
      })
      
      return groups
    },
    
    ratingDistribution(): Record<number, number> {
      const total = this.feedback.length
      if (total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      
      return {
        5: (this.feedbackByRating[5].length / total),
        4: (this.feedbackByRating[4].length / total),
        3: (this.feedbackByRating[3].length / total),
        2: (this.feedbackByRating[2].length / total),
        1: (this.feedbackByRating[1].length / total)
      }
    },
    
    distributionCount(): Record<number, number> {
      return {
        5: this.feedbackByRating[5].length,
        4: this.feedbackByRating[4].length,
        3: this.feedbackByRating[3].length,
        2: this.feedbackByRating[2].length,
        1: this.feedbackByRating[1].length
      }
    },
    
    filteredFeedback(): ProductReview[] {
      return this.feedback.filter(review => {
        if (this.selectedRating !== null && review.rate !== this.selectedRating) {
          return false
        }
        
        if (this.searchText) {
          const searchLower = this.searchText.toLowerCase()
          const textToSearch = [
            review.good_text,
            review.bad_text,
            review.comment,
            review.first_name,
            review.last_name
          ].filter(Boolean).join(' ').toLowerCase()
          
          if (!textToSearch.includes(searchLower)) {
            return false
          }
        }
        
        return true
      })
    }
  },
  
  methods: {
    async refreshReviews() {
      const response = await Api.get(`/api/products/${this.productId}`)
      if (!response.data?.success) return

      const { feedback, rating } = response.data.data || {}
      this.feedback = Array.isArray(feedback) ? feedback : []
      this.rating = rating || { total_reviews: '0', average_rating: '0' }
      this.resetReviewsView()
    },

    handleSearch(text: string) {
      this.searchText = text
      this.resetReviewsView()
    },
    
    handleRatingFilter(rating: number | null) {
      this.selectedRating = rating
      this.resetReviewsView()
    },
    
    resetReviewsView() {
      this.visibleReviewsCount = 5
      this.showAllReviews = false
    },
    
    loadMoreReviews() {
      this.visibleReviewsCount += this.reviewsToLoadPerClick
      
      if (this.visibleReviewsCount >= this.filteredFeedback.length) {
        this.showAllReviews = true
        this.visibleReviewsCount = this.filteredFeedback.length
      }
    },
    
    collapseReviews() {
      this.showAllReviews = false
      this.visibleReviewsCount = 5
    },
    
    openReviewDialog() {
      ;(this.$refs.reviewDialog as any).open()
    },
    
    handleDialogCancel() {
      console.log('Диалог отзыва отменен')
    },
    
    async submitReview(reviewData) {
      try {
        const apiData = {
          rate: reviewData.rate,
          good_text: reviewData.good_text || null,
          bad_text: reviewData.bad_text || null,
          comment: reviewData.comment
        };

        const response = await Api.post(`/api/products/${this.productId}/feedback`, apiData);
        const result = response.data;

        if (result?.success) {
          Notify.create({
            type: "positive",
            message: "Отзыв отправлен",
            icon: "check_circle",
            position: "top-right",
            timeout: 1500,
          });

          await this.refreshReviews()
        } else {
          let errorMessage = 'Ошибка при отправке отзыва';
          
          if (result.error === 'unvalid_rate') {
            errorMessage = 'Некорректная оценка. Оценка должна быть от 1 до 5';
          } else if (result.error === 'product_not_found') {
            errorMessage = 'Товар не найден';
          } else if (result.error) {
            errorMessage = result.error;
          }
          
          Notify.create({
            type: "negative",
            message: "Не удалось отправить отзыв",
            caption: errorMessage,
            icon: "error",
            position: "top-right",
            timeout: 3000,
          })
        }

      } catch (error) {
        console.error('❌ Ошибка при отправке отзыва:', error);
        
        let userMessage = 'Произошла ошибка при отправке отзыва. Проверьте соединение с интернетом.';
        
        if (error.response) {
          if (error.response.status === 401) {
            userMessage = 'Требуется авторизация. Пожалуйста, войдите в систему.';
          } else if (error.response.status === 403) {
            userMessage = 'Доступ запрещен';
          } else if (error.response.status === 404) {
            userMessage = 'Страница не найдена';
          }
        } else if (error.request) {
          userMessage = 'Нет соединения с сервером. Проверьте интернет-соединение.';
        }
        
        Notify.create({
          type: "negative",
          message: "Не удалось отправить отзыв",
          caption: userMessage,
          icon: "error",
          position: "top-right",
          timeout: 3000,
        })
      }
    }
  }
})
</script>
