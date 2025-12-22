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
            @click="showReviewDialog = true"
          />
          
          <!-- Распределение оценок -->
          <q-card bordered class="q-pa-md q-mt-lg">
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
                  :value="ratingDistribution[stars] || 0"
                  color="orange"
                  size="10px"
                />
              </div>
              <div class="col-2 text-right">
                <span class="text-caption text-grey">{{ distributionCount[stars] || 0 }}</span>
              </div>
            </div>
          </q-card>
        </div>
        
        <!-- Правая колонка - фильтры и отзывы -->
        <div class="col-8">
          <!-- Фильтры отзывов -->
          <q-card bordered class="q-pa-md q-mb-lg">
            <div class="row items-center q-col-gutter-md">
              <!-- Поиск по отзывам -->
              <div class="col-8">
                <q-input
                  v-model="searchReview"
                  placeholder="Поиск по отзывам..."
                  dense
                  outlined
                  clearable
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

          <!-- Список отзывов -->
          <ReviewList
            :reviews="filteredFeedback"
            :visible-reviews-count="visibleReviewsCount"
            :show-all-reviews="showAllReviewsFlag"
            @load-more="loadMoreReviews"
            @collapse="collapseReviews"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
  
  <!-- Диалог написания отзыва -->
  <q-dialog v-model="showReviewDialog">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Оставить отзыв</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-mb-md text-center">
          <div class="text-subtitle1 q-mb-sm">Ваша оценка</div>
          <q-rating
            v-model="newReview.rating"
            size="2em"
            color="orange"
            icon="star_border"
            icon-selected="star"
          />
        </div>

        <q-input
          v-model="newReview.good_text"
          label="Достоинства"
          type="textarea"
          outlined
          class="q-mb-md"
          placeholder="Что понравилось в товаре?"
        />

        <q-input
          v-model="newReview.bad_text"
          label="Недостатки"
          type="textarea"
          outlined
          class="q-mb-md"
          placeholder="Что можно улучшить?"
        />

        <q-input
          v-model="newReview.comment"
          label="Комментарий"
          type="textarea"
          outlined
          class="q-mb-md"
          placeholder="Дополнительные комментарии"
          rows="3"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup />
        <q-btn label="Отправить" color="primary" @click="submitReview" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import ReviewStats from './ReviewStats.vue'
import ReviewList from './ReviewList.vue'

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

interface NewReview {
  rating: number
  good_text: string
  bad_text: string
  comment: string
}

export default defineComponent({
  name: 'ProductReviewsWidget',
  
  components: {
    ReviewStats,
    ReviewList
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
  
  setup(props) {
    // Состояние
    const searchReview = ref('')
    const selectedRating = ref<number | null>(null)
    const showReviewDialog = ref(false)
    
    // Показ отзывов
    const visibleReviewsCount = ref(5)
    const showAllReviewsFlag = ref(false)
    const reviewsToLoadPerClick = 5
    
    // Новый отзыв
    const newReview = ref<NewReview>({
      rating: 5,
      good_text: '',
      bad_text: '',
      comment: ''
    })
    
    // Опции для фильтра по оценке
    const ratingOptions = [
      { label: 'Все оценки', value: null },
      { label: '5 звезд', value: 5 },
      { label: '4 звезды', value: 4 },
      { label: '3 звезды', value: 3 },
      { label: '2 звезды', value: 2 },
      { label: '1 звезда', value: 1 }
    ]
    
    // Вычисляемые свойства
    const computedRating = computed(() => {
      return props.initialRating || {
        average_rating: '0',
        total_reviews: '0',
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    })
    
    // Группировка отзывов по оценке
    const feedbackByRating = computed(() => {
      const groups: Record<number, ProductReview[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] }
      
      props.initialFeedback.forEach(review => {
        if (groups[review.rate]) {
          groups[review.rate].push(review)
        }
      })
      
      return groups
    })
    
    // Распределение оценок в процентах
    const ratingDistribution = computed(() => {
      const total = props.initialFeedback.length
      if (total === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      
      return {
        5: (feedbackByRating.value[5].length / total),
        4: (feedbackByRating.value[4].length / total),
        3: (feedbackByRating.value[3].length / total),
        2: (feedbackByRating.value[2].length / total),
        1: (feedbackByRating.value[1].length / total)
      }
    })
    
    // Количество отзывов по оценкам
    const distributionCount = computed(() => {
      return {
        5: feedbackByRating.value[5].length,
        4: feedbackByRating.value[4].length,
        3: feedbackByRating.value[3].length,
        2: feedbackByRating.value[2].length,
        1: feedbackByRating.value[1].length
      }
    })
    
    // Отфильтрованные отзывы
    const filteredFeedback = computed(() => {
      return props.initialFeedback.filter(review => {
        // Фильтр по оценке
        if (selectedRating.value !== null && review.rate !== selectedRating.value) {
          return false
        }
        
        // Поиск по тексту
        if (searchReview.value) {
          const searchLower = searchReview.value.toLowerCase()
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
    })
    
    // Показывать ли кнопку "Показать еще"
    const showLoadMoreButton = computed(() => {
      return !showAllReviewsFlag.value && 
             filteredFeedback.value.length > visibleReviewsCount.value
    })
    
    // Текст на кнопке "Показать еще"
    const loadMoreButtonText = computed(() => {
      const remaining = filteredFeedback.value.length - visibleReviewsCount.value
      const toLoad = Math.min(reviewsToLoadPerClick, remaining)
      
      if (remaining <= reviewsToLoadPerClick) {
        return `Показать оставшиеся ${remaining} ${getReviewCountText(remaining).split(' ')[1]}`
      }
      
      return `Показать еще ${toLoad} ${getReviewCountText(toLoad).split(' ')[1]}`
    })
    
    // Показывать ли кнопку "Свернуть"
    const showCollapseButton = computed(() => {
      return showAllReviewsFlag.value && filteredFeedback.value.length > reviewsToLoadPerClick
    })
    
    // Методы
    const toggleRatingFilter = (rating: number) => {
      selectedRating.value = selectedRating.value === rating ? null : rating
    }
    
    const getStarText = (count: number): string => {
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
    
    const getReviewCountText = (count: number): string => {
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
    
    // Показать еще отзывов
    const loadMoreReviews = () => {
      visibleReviewsCount.value += reviewsToLoadPerClick
      
      if (visibleReviewsCount.value >= filteredFeedback.value.length) {
        showAllReviewsFlag.value = true
        visibleReviewsCount.value = filteredFeedback.value.length
      }
    }
    
    // Свернуть отзывы
    const collapseReviews = () => {
      showAllReviewsFlag.value = false
      visibleReviewsCount.value = 5
    }
    
    // Написание отзыва
    const submitReview = async () => {
      try {
        console.log('Отправка отзыва:', newReview.value)
        
        // TODO: API call для отправки отзыва
        
        showReviewDialog.value = false
        newReview.value = {
          rating: 5,
          good_text: '',
          bad_text: '',
          comment: ''
        }
        
        // TODO: Перезагрузить отзывы
        
      } catch (error) {
        console.error('Ошибка при отправке отзыва:', error)
      }
    }
    
    // Сброс вида отзывов при фильтрации
    const resetReviewsView = () => {
      visibleReviewsCount.value = 5
      showAllReviewsFlag.value = false
    }
    
    // Следим за изменениями фильтров
    watch(selectedRating, resetReviewsView)
    watch(searchReview, resetReviewsView)
    
    return {
      // Состояние
      searchReview,
      selectedRating,
      showReviewDialog,
      visibleReviewsCount,
      showAllReviewsFlag,
      newReview,
      
      // Опции
      ratingOptions,
      
      // Вычисляемые свойства
      computedRating,
      ratingDistribution,
      distributionCount,
      filteredFeedback,
      showLoadMoreButton,
      loadMoreButtonText,
      showCollapseButton,
      
      // Методы
      toggleRatingFilter,
      getStarText,
      getReviewCountText,
      loadMoreReviews,
      collapseReviews,
      submitReview
    }
  }
})
</script>