<!-- widgets/ProductReviewsWidget/ProductReviewsWidget.vue -->
<template>
  <div v-if="reviews.length > 0">
    <h5 class="text-h5 text-weight-bold q-mb-md">Отзывы</h5>
    
    <div class="row q-col-gutter-xl">
      <div class="col-md-4 col-12">
        <ReviewStats :rating="rating" />
      </div>

      <div class="col-md-8 col-12">
        <div class="column q-gutter-y-md">
          <q-card 
            v-for="review in reviews" 
            :key="`${review.user_id}-${review.created_at}`"
            bordered
            class="q-pa-md"
          >
            <div class="row items-center justify-between q-mb-md">
              <div class="row items-center">
                <q-avatar size="lg" class="q-mr-sm" color="primary" text-color="white">
                  {{ getInitials(review.first_name, review.last_name) }}
                </q-avatar>
                <div>
                  <div class="text-weight-bold">{{ review.first_name }} {{ review.last_name }}</div>
                  <div class="text-caption text-grey-6">
                    {{ formatDate(review.created_at) }}
                  </div>
                </div>
              </div>
              <q-rating :model-value="review.rate" size="1.5em" color="orange" readonly/>
            </div>

            <div v-if="review.good_text" class="q-mb-sm">
              <q-badge color="green" class="q-mr-xs">Достоинства</q-badge>
              <span class="text-caption">{{ review.good_text }}</span>
            </div>

            <div v-if="review.bad_text" class="q-mb-sm">
              <q-badge color="red" class="q-mr-xs">Недостатки</q-badge>
              <span class="text-caption">{{ review.bad_text }}</span>
            </div>

            <p v-if="review.comment" class="q-mb-md">{{ review.comment }}</p>
          </q-card>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center q-pa-xl">
    <q-icon name="reviews" size="4em" color="grey-4" class="q-mb-md" />
    <div class="text-h6 text-weight-medium q-mb-sm">Пока нет отзывов</div>
    <div class="text-grey-7">Будьте первым, кто оставит отзыв об этом товаре!</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import ReviewStats from './ReviewStats.vue'

export default defineComponent({
  name: 'ProductReviewsWidget',
  components: { ReviewStats },
  props: {
    reviews: {
      type: Array as PropType<any[]>,
      required: true
    },
    rating: {
      type: Object as PropType<{ total_reviews: string; average_rating: string }>,
      required: true
    }
  },
  methods: {
    getInitials(firstName: string, lastName: string) {
      return (firstName?.[0] || '') + (lastName?.[0] || '')
    },
    formatDate(dateString: string) {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }
})
</script>