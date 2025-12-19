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
          <!-- Фото есть -->
          <div v-if="photos.length > 0">
            <!-- Главное фото с каруселью -->
            <q-card flat bordered class="q-mb-sm">
              <q-carousel
                v-model="currentSlide"
                animated
                infinite
                arrows
                height="400px"
                class="rounded-borders"
                :control-type="'regular'"
                control-color="primary"
                control-text-color="white"
              >
                <q-carousel-slide
                  v-for="(photo, index) in photos"
                  :key="index"
                  :name="index"
                  class="flex flex-center"
                >
                  <!-- Используем q-img вместо фона для контроля размера -->
                  <q-img
                    :src="photo"
                    :ratio="1"
                    width="100%"
                    height="100%"
                    class="fit"
                    fit="contain"
                    :alt="`Фото товара ${index + 1}`"
                    loading="lazy"
                  />
                </q-carousel-slide>
              </q-carousel>
            </q-card>

            <!-- Миниатюры -->
            <div class="row q-col-gutter-xs justify-center">
              <div
                v-for="(photo, index) in photos"
                :key="index"
                class="col-auto"
              >
                <q-card
                  flat
                  bordered
                  class="cursor-pointer thumb-card"
                  :class="{ 'thumb-active': currentSlide === index }"
                  @click="currentSlide = index"
                  style="width: 80px; height: 80px;"
                >
                  <q-img
                    :src="photo"
                    ratio="1"
                    width="100%"
                    height="100%"
                    class="rounded-borders"
                    fit="cover"
                  />
                </q-card>
              </div>
            </div>
          </div>
          
          <!-- Нет фото -->
          <div v-else class="text-center q-pa-xl">
            <q-icon name="photo" size="4em" color="grey-4" class="q-mb-md" />
            <div class="text-grey-7">Нет фотографий товара</div>
          </div>
        </div>

        <!-- Правая колонка - информация -->
        <div class="col-md-5 col-12">
          <div class="column justify-between" style="height: 100%">
            <div>
              <h4 class="q-mt-none q-mb-md text-weight-bold">{{ product.name }}</h4>
              <p class="text-grey-7 q-mb-lg" style="white-space: pre-line">{{ product.description }}</p>

              <q-list bordered class="rounded-borders q-mb-lg">
                <q-item v-if="product.category_name">
                  <q-item-section>
                    <q-item-label caption>Категория</q-item-label>
                    <q-item-label>{{ product.category_name }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="product.shop_name">
                  <q-item-section>
                    <q-item-label caption>Магазин</q-item-label>
                    <q-item-label>{{ product.shop_name }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>Рейтинг</q-item-label>
                    <div class="row items-center">
                      <q-rating
                        :model-value="parseFloat(rating.average_rating)"
                        size="1.5em"
                        color="orange"
                        readonly
                        class="q-mr-sm"
                      />
                      <span class="text-caption text-grey-7">
                        {{ rating.total_reviews }} отзывов
                      </span>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div>
              <div class="row items-center q-mb-sm">
                <span class="text-h4 text-weight-bold text-primary q-mr-md">{{ product.price }}₽</span>
              </div>

              <q-btn
                label="Добавить в корзину"
                color="primary"
                size="lg"
                icon="shopping_cart"
                class="full-width q-mb-md"
                @click="addToCart"
                unelevated
              />

              <q-btn
                label="Купить в 1 клик"
                color="deep-orange"
                outline
                class="full-width"
                @click="buyNow"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Характеристики -->
      <div class="q-mt-xl">
        <h5 class="text-h5 text-weight-bold q-mb-md">Характеристики</h5>
        
        <!-- Если характеристик нет -->
        <div v-if="!product.characteristics || Object.keys(product.characteristics).length === 0" 
             class="text-center q-pa-xl bg-grey-2 rounded-borders">
          <q-icon name="info" size="4em" color="grey-4" class="q-mb-md" />
          <div class="text-grey-7">Нет характеристик для этого товара</div>
        </div>
        
        <!-- Если характеристики есть -->
        <q-card v-else flat bordered>
          <q-list separator>
            <q-item 
              v-for="(value, key) in product.characteristics" 
              :key="key"
              class="q-py-md"
            >
              <q-item-section>
                <q-item-label caption class="text-weight-medium">
                  {{ formatCharacteristicKey(key) }}
                </q-item-label>
                <q-item-label class="text-body1">
                  {{ value }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Отзывы -->
      <div v-if="feedback.length > 0" class="q-mt-xl">
        <h5 class="text-h5 text-weight-bold q-mb-md">Отзывы</h5>
        
        <div class="row q-col-gutter-xl">
          <!-- Статистика -->
          <div class="col-md-4 col-12">
            <q-card bordered class="text-center q-pa-lg q-mb-md">
              <div class="text-h2 text-weight-bold text-primary">{{ rating.average_rating }}</div>
              <q-rating
                :model-value="parseFloat(rating.average_rating)"
                size="2em"
                color="orange"
                readonly
                class="q-mb-sm"
              />
              <div class="text-caption text-grey-7">{{ rating.total_reviews }} отзывов</div>
            </q-card>
          </div>

          <!-- Список отзывов -->
          <div class="col-md-8 col-12">
            <div class="column q-gutter-y-md">
              <q-card 
                v-for="review in feedback" 
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
      
      <!-- Нет отзывов -->
      <div v-else class="q-mt-xl text-center q-pa-xl">
        <q-icon name="reviews" size="4em" color="grey-4" class="q-mb-md" />
        <div class="text-h6 text-weight-medium q-mb-sm">Пока нет отзывов</div>
        <div class="text-grey-7">Будьте первым, кто оставит отзыв об этом товаре!</div>
      </div>
    </div>

    <!-- Товар не найден -->
    <div v-else class="text-center q-py-xl">
      <q-icon name="search_off" size="4em" color="grey-4" class="q-mb-md" />
      <div class="text-h6 text-weight-medium q-mb-sm">Товар не найден</div>
      <div class="text-grey-7 q-mb-lg">Товар с ID {{ $route.params.id }} не существует</div>
      <q-btn label="Вернуться на главную" color="primary" to="/" />
    </div>

  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { productDetailsApi } from 'src/features/productDetails/api/productDetailsApi'

export default defineComponent({
  name: 'ProductPage',

  setup() {
    const route = useRoute()
    const productId = Number(route.params.id)
    
    const product = ref<any>(null)
    const feedback = ref<any[]>([])
    const rating = ref({ total_reviews: '0', average_rating: '0' })
    const loading = ref(true)
    const error = ref<string | null>(null)
    const currentSlide = ref(0)

    const photos = computed(() => {
      if (!product.value?.photos) return []
      return Array.isArray(product.value.photos) 
        ? product.value.photos 
        : [product.value.photos]
    })

    const loadProductData = async () => {
      try {
        loading.value = true
        error.value = null
        
        console.log('🔄 Загружаем товар ID:', productId)
        const response = await productDetailsApi.getProductDetails(productId)
        
        console.log('✅ Данные получены:', response.product.name)
        console.log('🔍 Характеристики:', response.product.characteristics)
        console.log('📸 Фото:', response.product.photos)
        
        product.value = response.product
        feedback.value = response.feedback
        rating.value = response.rating
        
      } catch (err: any) {
        console.error('❌ Ошибка загрузки товара:', err)
        error.value = err.message || 'Произошла ошибка при загрузке товара'
      } finally {
        loading.value = false
      }
    }

    const formatCharacteristicKey = (key: string) => {
      if (key.startsWith('custom_char_')) {
        return key.replace('custom_char_', '')
      }
      return `Характеристика ${key}`
    }

    const getInitials = (firstName: string, lastName: string) => {
      return (firstName?.[0] || '') + (lastName?.[0] || '')
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const addToCart = () => {
      console.log('🛒 Добавить в корзину:', product.value?.product_id)
      // TODO: Реализовать добавление в корзину
    }

    const buyNow = () => {
      console.log('⚡ Купить в 1 клик:', product.value?.product_id)
      // TODO: Реализовать быструю покупку
    }

    onMounted(() => {
      if (!productId || isNaN(productId)) {
        error.value = 'Неверный ID товара'
        loading.value = false
        return
      }
      loadProductData()
    })

    return {
      product,
      feedback,
      rating,
      loading,
      error,
      currentSlide,
      photos,
      formatCharacteristicKey,
      getInitials,
      formatDate,
      addToCart,
      buyNow
    }
  }
})
</script>

<style scoped>
.thumb-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumb-card:hover {
  border-color: #1976d2;
}

.thumb-active {
  border-color: #1976d2 !important;
}

/* Переопределяем стили карусели для правильного отображения фото */
:deep(.q-carousel__slide) {
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-color: #fafafa !important;
}

:deep(.q-carousel__slide .q-img) {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain !important;
}

:deep(.q-carousel__slide .q-img__image) {
  object-fit: contain !important;
}
</style>