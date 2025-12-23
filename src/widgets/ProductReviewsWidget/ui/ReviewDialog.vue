<template>
  <q-dialog v-model="showDialog" class="review-dialog">
    <q-card class="dialog-card">
      <q-card-section class="dialog-header">
        <div class="dialog-title">Оставить отзыв</div>
      </q-card-section>

      <q-card-section class="dialog-body">
        <!-- Оценка -->
        <div class="rating-section">
          <div class="rating-label">Ваша оценка</div>
          <q-rating
            v-model="rating"
            size="2em"
            color="orange"
            icon="star_border"
            icon-selected="star"
            class="rating-stars"
          />
        </div>

        <!-- Достоинства -->
        <q-input
          v-model="goodText"
          label="Достоинства"
          type="textarea"
          outlined
          class="dialog-input"
          placeholder="Что понравилось в товаре?"
          autogrow
        />

        <!-- Недостатки -->
        <q-input
          v-model="badText"
          label="Недостатки"
          type="textarea"
          outlined
          class="dialog-input"
          placeholder="Что можно улучшить?"
          autogrow
        />

        <!-- Комментарий -->
        <q-input
          v-model="comment"
          label="Комментарий"
          type="textarea"
          outlined
          class="dialog-input"
          placeholder="Дополнительные комментарии"
          rows="3"
          autogrow
          :rules="[val => !!val.trim() || 'Поле обязательно']"
        />
      </q-card-section>

      <q-card-actions class="dialog-actions">
        <q-btn type="button" flat label="Отмена" color="grey" @click="closeDialog" class="cancel-btn" />
        <q-btn 
          type="button"
          label="Отправить" 
          color="primary" 
          @click="submitReview" 
          :disabled="!comment.trim()"
          class="submit-btn"
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

<style scoped>
/* Базовые стили диалога */
.review-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.dialog-card {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  padding: 20px;
}

.dialog-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  text-align: center;
}

.dialog-body {
  padding: 24px;
}

.rating-section {
  text-align: center;
  margin-bottom: 24px;
}

.rating-label {
  font-size: 1.1rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 16px;
}

.rating-stars {
  justify-content: center;
}

.dialog-input {
  margin-bottom: 16px;
}

.dialog-input:deep(.q-field__control) {
  border-radius: 8px;
}

.dialog-input:deep(.q-field__label) {
  font-weight: 500;
}

.dialog-input:deep(textarea) {
  font-size: 1rem;
  line-height: 1.5;
}

.dialog-actions {
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  min-height: 44px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
}

.submit-btn {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== АДАПТИВНОСТЬ ===== */

/* Мобильные (<768px) */
@media (max-width: 767px) {
  .review-dialog {
    padding: 12px;
    align-items: flex-end; /* Диалог снизу на мобильных */
  }
  
  .dialog-card {
    max-width: 100%;
    margin: 0;
    border-radius: 16px 16px 0 0;
    min-height: 60vh;
  }
  
  .dialog-header {
    padding: 16px;
  }
  
  .dialog-title {
    font-size: 1.2rem;
  }
  
  .dialog-body {
    padding: 20px 16px;
  }
  
  .rating-section {
    margin-bottom: 20px;
  }
  
  .rating-label {
    font-size: 1rem;
    margin-bottom: 12px;
  }
  
  .rating-stars {
    font-size: 1.8em;
  }
  
  .dialog-input {
    margin-bottom: 12px;
  }
  
  .dialog-actions {
    padding: 16px;
    flex-direction: column;
    gap: 10px;
  }
  
  .cancel-btn,
  .submit-btn {
    min-height: 44px;
    font-size: 0.95rem;
  }
}

/* Планшеты (768px-991px) */
@media (min-width: 768px) and (max-width: 991px) {
  .dialog-card {
    max-width: 600px;
  }
  
  .dialog-body {
    padding: 20px;
  }
  
  .dialog-actions {
    padding: 20px;
  }
}

/* Десктоп (≥992px) */
@media (min-width: 992px) {
  .dialog-card {
    max-width: 600px;
  }
  
  .dialog-body {
    padding: 24px;
  }
  
  .dialog-actions {
    padding: 24px;
  }
}

/* Очень маленькие экраны (<480px) */
@media (max-width: 480px) {
  .review-dialog {
    padding: 8px;
  }
  
  .dialog-card {
    min-height: 70vh;
  }
  
  .dialog-header {
    padding: 14px;
  }
  
  .dialog-title {
    font-size: 1.1rem;
  }
  
  .dialog-body {
    padding: 16px 12px;
  }
  
  .rating-section {
    margin-bottom: 16px;
  }
  
  .rating-label {
    font-size: 0.95rem;
  }
  
  .dialog-input {
    margin-bottom: 10px;
  }
  
  .dialog-input:deep(textarea) {
    font-size: 0.95rem;
  }
  
  .dialog-actions {
    padding: 12px;
  }
  
  .cancel-btn,
  .submit-btn {
    min-height: 40px;
    font-size: 0.9rem;
  }
}

/* Горизонтальные телефоны (высота ≤600px) */
@media (max-height: 600px) and (orientation: landscape) {
  .review-dialog {
    align-items: flex-start;
  }
  
  .dialog-card {
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 12px;
  }
  
  .dialog-body {
    padding: 16px;
  }
  
  .rating-section {
    margin-bottom: 16px;
  }
  
  .dialog-input {
    margin-bottom: 12px;
  }
}
</style>
