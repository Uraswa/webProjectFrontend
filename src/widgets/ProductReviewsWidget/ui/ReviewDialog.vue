<!-- widgets/ProductReviewsWidget/ui/ReviewDialog.vue -->
<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Оставить отзыв</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <!-- Оценка -->
        <div class="q-mb-md text-center">
          <div class="text-subtitle1 q-mb-sm">Ваша оценка</div>
          <q-rating
            v-model="rating"
            size="2em"
            color="orange"
            icon="star_border"
            icon-selected="star"
          />
        </div>

        <!-- Достоинства -->
        <q-input
          v-model="goodText"
          label="Достоинства"
          type="textarea"
          outlined
          class="q-mb-md"
          placeholder="Что понравилось в товаре?"
          autogrow
        />

        <!-- Недостатки -->
        <q-input
          v-model="badText"
          label="Недостатки"
          type="textarea"
          outlined
          class="q-mb-md"
          placeholder="Что можно улучшить?"
          autogrow
        />

        <!-- Комментарий -->
        <q-input
          v-model="comment"
          label="Комментарий"
          type="textarea"
          outlined
          class="q-mb-md"
          placeholder="Дополнительные комментарии"
          rows="3"
          autogrow
          :rules="[val => !!val.trim() || 'Поле обязательно']"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" @click="closeDialog" />
        <q-btn 
          label="Отправить" 
          color="primary" 
          @click="submitReview" 
          :disabled="!comment.trim()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface ReviewData {
  rating: number
  good_text: string
  bad_text: string
  comment: string
}

export default defineComponent({
  name: 'ReviewDialog',
  
  emits: ['submit', 'cancel'],
  
  data() {
    return {
      showDialog: false,
      rating: 5,
      goodText: '',
      badText: '',
      comment: ''
    }
  },
  
  methods: {
    open() {
      this.showDialog = true
      this.resetForm()
    },
    
    closeDialog() {
      this.showDialog = false
      this.$emit('cancel')
    },
    
    resetForm() {
      this.rating = 5
      this.goodText = ''
      this.badText = ''
      this.comment = ''
    },
    
    submitReview() {
      if (!this.comment.trim()) {
        return
      }
      
      const reviewData: ReviewData = {
        rate: this.rating,
        good_text: this.goodText.trim(),
        bad_text: this.badText.trim(),
        comment: this.comment.trim()
      }

      console.log(reviewData)
      
      this.$emit('submit', reviewData)
      this.closeDialog()
    }
  }
})
</script>