<!-- widgets/ProductReviewsWidget/ui/ProductReviewsWidget.vue -->
<template>
  <q-card flat class="q-mb-xl">
    <q-card-section>
      <div class="text-h5 text-weight-bold q-mb-md">Отзывы</div>
      
      <div class="row q-col-gutter-xl">
        <!-- Левая колонка - статистика -->
        <div class="col-4">
          <ReviewStats :rating="computedRating" />
          
          <!-- Кнопка написания отзыва -->
          <q-btn
            label="Написать отзыв"
            color="primary"
            icon="rate_review"
            class="full-width q-mt-lg"
            unelevated
            @click="openReviewDialog"
          />
          
          <!-- Распределение оценок -->
          <RatingDistribution 
            :distribution="ratingDistribution"
            :count="distributionCount"
            class="q-mt-lg"
          />
        </div>
        
        <!-- Правая колонка - фильтры и отзывы -->
        <div class="col-8">
          <!-- Фильтры отзывов -->
          <ReviewFilters
            @search="handleSearch"
            @rating-filter="handleRatingFilter"
            class="q-mb-lg"
          />

          <!-- Список отзывов -->
          <ReviewList
            :reviews="filteredFeedback"
            :visible-reviews-count="visibleReviewsCount"
            :show-all-reviews="showAllReviews"
            @load-more="loadMoreReviews"
            @collapse="collapseReviews"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
  
  <!-- Диалог написания отзыва -->
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
      searchText: '',
      selectedRating: null as number | null,
      visibleReviewsCount: 5,
      showAllReviews: false,
      reviewsToLoadPerClick: 5
    }
  },
  
  computed: {
    computedRating(): ProductRating {
      return this.initialRating || {
        average_rating: '0',
        total_reviews: '0',
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    },
    
    feedbackByRating(): Record<number, ProductReview[]> {
      const groups: Record<number, ProductReview[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] }
      
      this.initialFeedback.forEach(review => {
        if (groups[review.rate]) {
          groups[review.rate].push(review)
        }
      })
      
      return groups
    },
    
    ratingDistribution(): Record<number, number> {
      const total = this.initialFeedback.length
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
      return this.initialFeedback.filter(review => {
        // Фильтр по оценке
        if (this.selectedRating !== null && review.rate !== this.selectedRating) {
          return false
        }
        
        // Поиск по тексту
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
        // 1. Преобразуем данные для API (rating → rate)
        const apiData = {
          rate: reviewData.rate,
          good_text: reviewData.good_text || null,
          bad_text: reviewData.bad_text || null,
          comment: reviewData.comment
        };
      

        const response = await Api.post(`api/products/${this.productId}/feedback`, apiData);

        if (response.data.success) {
          // 3. Показываем уведомление
          alert('✅ Отзыв успешно отправлен!');
          
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          
        } else {
          // 6. Обработка ошибок от сервера
          let errorMessage = 'Ошибка при отправке отзыва';
          
          if (result.error === 'unvalid_rate') {
            errorMessage = 'Некорректная оценка. Оценка должна быть от 1 до 5';
          } else if (result.error === 'product_not_found') {
            errorMessage = 'Товар не найден';
          } else if (result.error) {
            errorMessage = result.error;
          }
          
          this.$q.notify({
            message: errorMessage,
            color: 'negative',
            icon: 'error'
          });
        }

      } catch (error) {
        console.error('❌ Ошибка при отправке отзыва:', error);
        
        // 7. Обработка ошибок сети/сервера
        let userMessage = 'Произошла ошибка при отправке отзыва. Проверьте соединение с интернетом.';
        
        if (error.response) {
          // Ошибка от сервера (4xx, 5xx)
          console.error('Статус ошибки:', error.response.status);
          console.error('Данные ошибки:', error.response.data);
          
          if (error.response.status === 401) {
            userMessage = 'Требуется авторизация. Пожалуйста, войдите в систему.';
          } else if (error.response.status === 403) {
            userMessage = 'Доступ запрещен';
          } else if (error.response.status === 404) {
            userMessage = 'Страница не найдена';
          }
        } else if (error.request) {
          // Ошибка сети (нет ответа от сервера)
          console.error('Нет ответа от сервера');
          userMessage = 'Нет соединения с сервером. Проверьте интернет-соединение.';
        }
        
        this.$q.notify({
          message: userMessage,
          color: 'negative',
          icon: 'error'
        });
      }
    }
  }
})
</script>