<!-- widgets/ProductReviewsWidget/ui/ReviewList.vue -->
<template>
  <div>
    <!-- Сообщение если отзывов нет -->
    <div 
      v-if="reviews.length === 0" 
      class="text-center q-py-xl"
    >
      <q-icon name="reviews" size="4em" color="grey-4" class="q-mb-md" />
      <div class="text-h6 text-weight-medium q-mb-sm">Нет отзывов</div>
      <div class="text-grey-7 q-mb-lg">Будьте первым, кто оставит отзыв об этом товаре</div>
    </div>

    <!-- Отзывы -->
    <div class="column q-gutter-y-md">
      <div 
        v-for="(review, index) in displayedReviews" 
        :key="`${review.user_id}_${review.created_at}_${index}`"
        class="review-item"
      >
        <q-card bordered>
          <q-card-section>
            <!-- Заголовок отзыва -->
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center">
                <q-avatar 
                  size="lg" 
                  class="q-mr-sm"
                  :color="getAvatarColor(review.user_id)"
                  text-color="white"
                  :icon="getAvatarIcon(review.user_id)"
                />
                <div>
                  <div class="text-weight-bold">
                    {{ review.first_name }} {{ review.last_name }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ formatDate(review.created_at) }}
                  </div>
                </div>
              </div>
              <q-rating 
                :model-value="review.rate" 
                size="1.5em" 
                color="orange" 
                readonly
              />
            </div>

            <!-- Достоинства -->
            <div 
              v-if="review.good_text" 
              class="q-mb-sm"
            >
              <q-badge color="green" class="q-mr-xs">Достоинства</q-badge>
              <span class="text-caption">{{ review.good_text }}</span>
            </div>

            <!-- Недостатки -->
            <div 
              v-if="review.bad_text" 
              class="q-mb-sm"
            >
              <q-badge color="red" class="q-mr-xs">Недостатки</q-badge>
              <span class="text-caption">{{ review.bad_text }}</span>
            </div>

            <!-- Комментарий -->
            <p 
              v-if="review.comment" 
              class="q-mb-md"
            >
              {{ review.comment }}
            </p>

            <!-- Действия с отзывом -->
            <div class="row items-center q-mt-md">
              <q-btn 
                flat 
                icon="thumb_up" 
                :label="review.likes || 0" 
                size="sm" 
                color="primary"
                @click="likeReview(review)"
              />
              <q-btn 
                flat 
                icon="thumb_down" 
                :label="review.dislikes || 0" 
                size="sm" 
                color="primary" 
                class="q-ml-sm"
                @click="dislikeReview(review)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Кнопка показать еще -->
    <div 
      v-if="showLoadMoreButton" 
      class="text-center q-mt-lg"
    >
      <q-btn
        label="Показать еще отзывы"
        color="primary"
        outline
        icon="expand_more"
        @click="$emit('load-more')"
      />
    </div>

    <!-- Кнопка свернуть -->
    <div 
      v-if="showCollapseButton" 
      class="text-center q-mt-lg"
    >
      <q-btn
        label="Свернуть отзывы"
        color="primary"
        outline
        icon="expand_less"
        @click="$emit('collapse')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'

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
  likes?: number
  dislikes?: number
}

export default defineComponent({
  name: 'ReviewList',
  
  props: {
    reviews: {
      type: Array as PropType<ProductReview[]>,
      required: true
    },
    visibleReviewsCount: {
      type: Number,
      default: 5
    },
    showAllReviews: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['load-more', 'collapse'],
  
  setup(props) {
    // Отзывы для показа
    const displayedReviews = computed(() => {
      if (props.showAllReviews) {
        return props.reviews
      }
      return props.reviews.slice(0, props.visibleReviewsCount)
    })
    
    // Показывать ли кнопку "Показать еще"
    const showLoadMoreButton = computed(() => {
      return !props.showAllReviews && 
             props.reviews.length > props.visibleReviewsCount
    })
    
    // Показывать ли кнопку "Свернуть"
    const showCollapseButton = computed(() => {
      return props.showAllReviews && props.reviews.length > 5
    })
    
    // Методы
    const formatDate = (dateString: string): string => {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      } catch {
        return dateString
      }
    }
    
    const getAvatarColor = (userId: number): string => {
      const colors = [
        'primary', 'secondary', 'accent', 'positive', 
        'negative', 'info', 'warning', 'teal', 'indigo'
      ]
      return colors[userId % colors.length]
    }
    
    const getAvatarIcon = (userId: number): string => {
      const icons = [
        'person', 'account_circle', 'face', 'supervisor_account',
        'people', 'group', 'person_outline', 'person_pin'
      ]
      return icons[userId % icons.length]
    }
    
    const likeReview = (review: ProductReview) => {
      console.log('Лайк отзыва:', review)
      // TODO: API call для лайков
    }
    
    const dislikeReview = (review: ProductReview) => {
      console.log('Дизлайк отзыва:', review)
      // TODO: API call для дизлайков
    }
    
    return {
      displayedReviews,
      showLoadMoreButton,
      showCollapseButton,
      formatDate,
      getAvatarColor,
      getAvatarIcon,
      likeReview,
      dislikeReview
    }
  }
})
</script>

<style scoped>
.review-item {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>