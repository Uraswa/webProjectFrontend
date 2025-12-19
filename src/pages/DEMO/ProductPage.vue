<!-- pages/ProductPage/ProductPage.vue -->
<template>
  <q-page class="q-pa-lg">
    <!-- Загрузка -->
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-gears color="primary" size="3em" />
      <div class="q-mt-md text-grey-7">Загружаем информацию о товаре...</div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="text-center q-py-xl">
      <q-icon name="error" size="4em" color="negative" class="q-mb-md" />
      <div class="text-h6 text-weight-medium q-mb-sm">Ошибка загрузки</div>
      <div class="text-grey-7 q-mb-lg">{{ error }}</div>
      <q-btn label="Вернуться на главную" color="primary" to="/" />
    </div>

    <!-- Товар найден -->
    <div v-else-if="product">
      <!-- Хлебные крошки -->
      <q-breadcrumbs class="q-mb-xl">
        <q-breadcrumbs-el label="Главная" icon="home" to="/"/>
        <q-breadcrumbs-el 
          v-if="product.category_name"
          :label="product.category_name" 
          :to="`/category/${product.category_id}`"
        />
        <q-breadcrumbs-el :label="product.name"/>
      </q-breadcrumbs>

      <!-- Основная информация -->
      <div class="row q-col-gutter-xl">
        <!-- Левая колонка - фото -->
        <div class="col-md-7 col-12">
          <ProductGallery :images="parsedPhotos" />
        </div>

        <!-- Правая колонка - информация -->
        <div class="col-md-5 col-12">
          <ProductInfoPanel 
            :product="product"
            :rating="rating"
            @add-to-cart="addToCart"
            @buy-now="buyNow"
          />
        </div>
      </div>

      <!-- Характеристики -->
      <ProductCharacteristics 
        v-if="parsedCharacteristics && Object.keys(parsedCharacteristics).length > 0"
        :characteristics="parsedCharacteristics"
        class="q-mt-xl"
      />

      <!-- Отзывы с фильтрацией -->
      <q-card flat class="q-mt-xl q-mb-xl">
        <q-card-section>
          <div class="text-h5 text-weight-bold q-mb-md">Отзывы</div>

          <div class="row q-col-gutter-xl">
            <!-- Левая колонка - статистика -->
            <div class="col-4">
              <!-- Статистика отзывов -->
              <q-card bordered class="text-center q-pa-lg">
                <div class="text-h2 text-weight-bold text-primary">{{ averageRatingFormatted }}</div>
                <q-rating
                  :model-value="averageRatingNumber"
                  size="2em"
                  color="orange"
                  readonly
                  class="q-mb-sm"
                />
                <div class="text-caption text-grey-7">{{ feedbackCountText }}</div>
              </q-card>

              <!-- Кнопка написания отзыва -->
              <q-btn
                label="Написать отзыв"
                color="primary"
                icon="rate_review"
                class="full-width q-mt-lg q-mb-lg"
                unelevated
                @click="showReviewDialog = true"
              />

              <!-- Распределение оценок -->
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
                      :value="ratingDistribution[stars] || 0"
                      color="orange"
                      size="10px"
                    />
                  </div>
                  <div class="col-2 text-right">
                    <span class="text-caption text-grey">
                      {{ feedbackByRating[stars]?.length || 0 }}
                    </span>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- Правая колонка - отзывы и фильтры -->
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
              <div class="column q-gutter-y-md">
                <!-- Сообщение если отзывов нет -->
                <div 
                  v-if="filteredFeedback.length === 0" 
                  class="text-center q-py-xl"
                >
                  <q-icon name="reviews" size="4em" color="grey-4" class="q-mb-md" />
                  <div class="text-h6 text-weight-medium q-mb-sm">Нет отзывов</div>
                  <div class="text-grey-7 q-mb-lg">Будьте первым, кто оставит отзыв об этом товаре</div>
                  <q-btn
                    label="Написать отзыв"
                    color="primary"
                    @click="showReviewDialog = true"
                  />
                </div>

                <!-- Отзывы -->
                <div 
                  v-for="review in displayedFeedback" 
                  :key="`${review.user_id}_${review.created_at}`"
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
                            v-if="!review.avatar_url"
                          />
                          <q-avatar 
                            v-else
                            size="lg" 
                            class="q-mr-sm"
                          >
                            <img :src="review.avatar_url" :alt="review.first_name">
                          </q-avatar>
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

                      <!-- Фотографии отзыва -->
                      <div 
                        v-if="review.photos && review.photos.length > 0" 
                        class="row q-gutter-xs q-mb-md"
                      >
                        <q-img
                          v-for="(photo, index) in parseReviewPhotos(review.photos)"
                          :key="index"
                          :src="photo"
                          width="80px"
                          height="80px"
                          class="rounded-borders cursor-pointer"
                          @click="openPhotoViewer(parseReviewPhotos(review.photos), index)"
                        />
                      </div>

                      <!-- Ответ продавца -->
                      <q-card 
                        v-if="review.seller_reply" 
                        flat 
                        class="bg-grey-2"
                      >
                        <q-card-section>
                          <div class="row items-start">
                            <q-avatar 
                              size="sm" 
                              class="q-mr-sm"
                              color="primary"
                              text-color="white"
                              icon="store"
                            />
                            <div>
                              <div class="text-weight-bold">Представитель магазина</div>
                              <p class="q-my-xs">{{ review.seller_reply.text }}</p>
                              <div class="text-caption text-grey-6">
                                {{ formatDate(review.seller_reply.created_at) }}
                              </div>
                            </div>
                          </div>
                        </q-card-section>
                      </q-card>

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
                        <q-space/>
                        <q-btn 
                          flat 
                          icon="reply" 
                          label="Ответить" 
                          size="sm" 
                          color="primary"
                          @click="replyToReview(review)"
                          v-if="userIsSeller"
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
                  :label="loadMoreButtonText"
                  color="primary"
                  outline
                  icon="expand_more"
                  @click="loadMoreReviews"
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
                  @click="collapseReviews"
                />
              </div>
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

      <!-- Диалог просмотра фото -->
      <q-dialog v-model="photoViewerVisible" full-width>
        <q-carousel
          v-model="currentPhotoIndex"
          animated
          infinite
          arrows
          height="500px"
          class="bg-dark"
        >
          <q-carousel-slide
            v-for="(photo, index) in currentPhotoList"
            :key="index"
            :name="index"
            :img-src="photo"
          />
        </q-carousel>
      </q-dialog>
    </div>

    <!-- Товар не найден -->
    <div v-else class="text-center q-py-xl">
      <q-icon name="search_off" size="4em" color="grey-4" class="q-mb-md" />
      <div class="text-h6 text-weight-medium q-mb-sm">Товар не найден</div>
      <div class="text-grey-7 q-mb-lg">Товар с ID {{ productId }} не существует</div>
      <q-btn label="Вернуться на главную" color="primary" to="/" />
    </div>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

// Widgets
import ProductGallery from 'src/widgets/ProductGallery/ProductGallery.vue'
import ProductInfoPanel from 'src/widgets/ProductInfoPanel/ProductInfoPanel.vue'
import ProductCharacteristics from 'src/widgets/ProductCharacteristics/ProductCharacteristics.vue'

// Feature
import { productDetailsApi } from 'src/features/productDetails/api/productDetailsApi'

// Types
import type { Product } from 'src/entities/Product/models/Product'
import type { ProductReview, ProductRating } from 'src/features/productDetails/api/productDetailsApi'

interface NewReview {
  rating: number
  good_text: string
  bad_text: string
  comment: string
}

export default defineComponent({
  name: 'ProductPage',
  
  components: {
    ProductGallery,
    ProductInfoPanel,
    ProductCharacteristics
  },
  
  data() {
    return {
      product: null as Product | null,
      feedback: [] as ProductReview[],
      rating: { total_reviews: '0', average_rating: '0' } as ProductRating,
      loading: true,
      error: null as string | null,
      productId: 0,
      
      // Фильтрация отзывов
      searchReview: '',
      selectedRating: null as number | null,
      ratingOptions: [
        { label: 'Все оценки', value: null },
        { label: '5 звезд', value: 5 },
        { label: '4 звезды', value: 4 },
        { label: '3 звезды', value: 3 },
        { label: '2 звезды', value: 2 },
        { label: '1 звезда', value: 1 }
      ],
      
      // Показ отзывов (вместо пагинации)
      visibleReviewsCount: 5,           // Сколько отзывов показывать сначала
      showAllReviewsFlag: false,        // Показаны ли все отзывы
      reviewsToLoadPerClick: 5,         // Сколько отзывов подгружать за клик
      
      // Диалоги
      showReviewDialog: false,
      photoViewerVisible: false,
      currentPhotoList: [] as string[],
      currentPhotoIndex: 0,
      
      // Новый отзыв
      newReview: {
        rating: 5,
        good_text: '',
        bad_text: '',
        comment: ''
      } as NewReview,
      
      // Пользователь (заглушка)
      userIsSeller: false,
      currentUser: null as any
    }
  },
  
  computed: {
    parsedPhotos(): string[] {
      if (!this.product?.photos) return []
      
      const photos = this.product.photos
      
      if (Array.isArray(photos)) {
        return photos
      }
      
      if (typeof photos === 'string') {
        try {
          let cleanStr = photos.trim()
          if (cleanStr.startsWith("'") && cleanStr.endsWith("'")) {
            cleanStr = cleanStr.slice(1, -1)
          }
          const parsed = JSON.parse(cleanStr)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      }
      
      return []
    },
    
    parsedCharacteristics(): Record<string, any> {
      if (!this.product?.characteristics) return {}
      
      const chars = this.product.characteristics
      
      if (typeof chars === 'object' && chars !== null && !Array.isArray(chars)) {
        return chars
      }
      
      if (typeof chars === 'string') {
        try {
          let cleanStr = chars.trim()
          if (
            (cleanStr.startsWith('"') && cleanStr.endsWith('"')) ||
            (cleanStr.startsWith("'") && cleanStr.endsWith("'"))
          ) {
            cleanStr = cleanStr.slice(1, -1)
          }
          const parsed = JSON.parse(cleanStr)
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            return parsed
          }
        } catch {
          console.warn('Не удалось распарсить характеристики')
        }
      }
      
      return {}
    },
    
    // Статистика по отзывам
    averageRatingNumber(): number {
      return parseFloat(this.rating.average_rating) || 0
    },
    
    averageRatingFormatted(): string {
      return this.averageRatingNumber.toFixed(1)
    },
    
    // Грамматически правильное окончание для слова "отзывов"
    feedbackCountText(): string {
      const count = this.feedback.length
      return this.getReviewCountText(count)
    },
    
    // Группировка отзывов по оценке (из реальных данных)
    feedbackByRating(): Record<number, ProductReview[]> {
      const groups: Record<number, ProductReview[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] }
      
      this.feedback.forEach(review => {
        if (groups[review.rate]) {
          groups[review.rate].push(review)
        }
      })
      
      return groups
    },
    
    // Распределение оценок в процентах (из реальных данных)
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
    
    // Отфильтрованные отзывы
    filteredFeedback(): ProductReview[] {
      return this.feedback.filter(review => {
        // Фильтр по оценке
        if (this.selectedRating !== null && review.rate !== this.selectedRating) {
          return false
        }
        
        // Поиск по тексту
        if (this.searchReview) {
          const searchLower = this.searchReview.toLowerCase()
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
    },
    
    // Отзывы для показа (с ограничением)
    displayedFeedback(): ProductReview[] {
      if (this.showAllReviewsFlag) {
        return this.filteredFeedback
      }
      return this.filteredFeedback.slice(0, this.visibleReviewsCount)
    },
    
    // Показывать ли кнопку "Показать еще"
    showLoadMoreButton(): boolean {
      return !this.showAllReviewsFlag && 
             this.filteredFeedback.length > this.visibleReviewsCount
    },
    
    // Текст на кнопке "Показать еще"
    loadMoreButtonText(): string {
      const remaining = this.filteredFeedback.length - this.visibleReviewsCount
      const toLoad = Math.min(this.reviewsToLoadPerClick, remaining)
      
      if (remaining <= this.reviewsToLoadPerClick) {
        return `Показать оставшиеся ${remaining} ${this.getReviewCountText(remaining).split(' ')[1]}`
      }
      
      return `Показать еще ${toLoad} ${this.getReviewCountText(toLoad).split(' ')[1]}`
    },
    
    // Показывать ли кнопку "Свернуть"
    showCollapseButton(): boolean {
      return this.showAllReviewsFlag && this.filteredFeedback.length > this.reviewsToLoadPerClick
    }
  },
  
  watch: {
    selectedRating() {
      this.resetReviewsView()
    },
    searchReview() {
      this.resetReviewsView()
    }
  },
  
  mounted() {
    this.loadProduct()
  },
  
  methods: {
    async loadProduct() {
      try {
        this.loading = true
        this.error = null
        
        const route = useRoute()
        this.productId = Number(route.params.id)
        
        if (!this.productId || isNaN(this.productId)) {
          throw new Error('Неверный ID товара')
        }
        
        const response = await productDetailsApi.getProductDetails(this.productId)
        this.product = response.product
        this.feedback = response.feedback
        this.rating = response.rating
        
      } catch (err: any) {
        this.error = err.message || 'Ошибка загрузки товара'
        console.error('❌ Ошибка загрузки товара:', err)
      } finally {
        this.loading = false
      }
    },
    
    // Сброс вида отзывов при фильтрации
    resetReviewsView() {
      this.visibleReviewsCount = 5
      this.showAllReviewsFlag = false
    },
    
    // Грамматические функции
    getReviewCountText(count: number): string {
      // Правильные окончания для слова "отзыв"
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
    },
    
    getStarText(count: number): string {
      // Правильные окончания для слова "звезда"
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
    },
    
    // Генерация аватаров без хардкода
    getAvatarColor(userId: number): string {
      // Генерируем цвет на основе ID пользователя
      const colors = [
        'primary', 'secondary', 'accent', 'positive', 
        'negative', 'info', 'warning', 'teal', 'indigo'
      ]
      return colors[userId % colors.length]
    },
    
    getAvatarIcon(userId: number): string {
      // Генерируем иконку на основе ID пользователя
      const icons = [
        'person', 'account_circle', 'face', 'supervisor_account',
        'people', 'group', 'person_outline', 'person_pin'
      ]
      return icons[userId % icons.length]
    },
    
    // Фильтрация
    toggleRatingFilter(rating: number) {
      this.selectedRating = this.selectedRating === rating ? null : rating
    },
    
    // Вспомогательные методы
    formatDate(dateString: string): string {
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
    },
    
    parseReviewPhotos(photos: any): string[] {
      if (!photos) return []
      
      if (Array.isArray(photos)) {
        return photos
      }
      
      if (typeof photos === 'string') {
        try {
          let cleanStr = photos.trim()
          if (cleanStr.startsWith("'") && cleanStr.endsWith("'")) {
            cleanStr = cleanStr.slice(1, -1)
          }
          const parsed = JSON.parse(cleanStr)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      }
      
      return []
    },
    
    // Просмотр фото
    openPhotoViewer(photos: string[], index: number) {
      this.currentPhotoList = photos
      this.currentPhotoIndex = index
      this.photoViewerVisible = true
    },
    
    // Действия с отзывами
    likeReview(review: ProductReview) {
      console.log('Лайк отзыва:', review)
      // TODO: API call для лайков
    },
    
    dislikeReview(review: ProductReview) {
      console.log('Дизлайк отзыва:', review)
      // TODO: API call для дизлайков
    },
    
    replyToReview(review: ProductReview) {
      console.log('Ответ на отзыв:', review)
      // TODO: Открыть диалог ответа продавца
    },
    
    // Показать еще отзывов
    loadMoreReviews() {
      this.visibleReviewsCount += this.reviewsToLoadPerClick
      
      // Если показываем все или почти все отзывы
      if (this.visibleReviewsCount >= this.filteredFeedback.length) {
        this.showAllReviewsFlag = true
        this.visibleReviewsCount = this.filteredFeedback.length
      }
    },
    
    // Свернуть отзывы
    collapseReviews() {
      this.showAllReviewsFlag = false
      this.visibleReviewsCount = 5
    },
    
    // Написание отзыва
    async submitReview() {
      try {
        // TODO: API call для отправки отзыва
        console.log('Отправка отзыва:', this.newReview)
        
        // Закрыть диалог и сбросить форму
        this.showReviewDialog = false
        this.newReview = {
          rating: 5,
          good_text: '',
          bad_text: '',
          comment: ''
        }
        
        // Перезагрузить отзывы
        await this.loadProduct()
        
      } catch (error) {
        console.error('Ошибка при отправке отзыва:', error)
      }
    },
    
    // Основные действия
    addToCart() {
      if (!this.product) return
      console.log('🛒 Добавить в корзину:', this.product.product_id)
      // TODO: Реализовать добавление в корзину
    },
    
    buyNow() {
      if (!this.product) return
      console.log('⚡ Купить в 1 клик:', this.product.product_id)
      // TODO: Реализовать быструю покупку
    }
  }
})
</script>

<style scoped>
/* Стили для отзывов */
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