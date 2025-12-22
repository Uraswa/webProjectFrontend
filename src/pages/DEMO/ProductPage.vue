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
          />
        </div>
      </div>

      <!-- Характеристики -->
      <ProductCharacteristics
        v-if="parsedCharacteristics && Object.keys(parsedCharacteristics).length > 0"
        :characteristics="parsedCharacteristics"
        class="q-mt-xl"
      />

      <!-- Отзывы -->
      <ProductReviewsWidget
        :product-id="productId"
        :initial-feedback="feedback"
        :initial-rating="rating"
        class="q-mt-xl"
      />
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
import ProductGallery from 'src/widgets/ProductGallery/ui/ProductGallery.vue'
import ProductInfoPanel from 'src/widgets/ProductInfoPanel/ui/ProductInfoPanel.vue'
import ProductCharacteristics from 'src/widgets/ProductCharacteristics/ui/ProductCharacteristics.vue'
import ProductReviewsWidget from 'src/widgets/ProductReviewsWidget/ui/ProductReviewsWidget.vue'

// API
import { productDetailsApi } from 'src/features/productDetails/api/productDetailsApi'

// Types
import type { Product } from 'src/entities/Product/models/Product'
import type { ProductReview, ProductRating } from 'src/features/productDetails/api/productDetailsApi'

export default defineComponent({
  name: 'ProductPage',

  components: {
    ProductGallery,
    ProductInfoPanel,
    ProductCharacteristics,
    ProductReviewsWidget
  },

  data() {
    return {
      product: null as Product | null,
      feedback: [] as ProductReview[],
      rating: { total_reviews: '0', average_rating: '0' } as ProductRating,
      loading: true,
      error: null as string | null,
      productId: 0
    }
  },

  computed: {
    parsedPhotos(): string[] {
      if (!this.product?.photos) return []

      const photos = this.product.photos
      if (Array.isArray(photos)) return photos

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

      if (typeof chars === 'object' && chars !== null) {
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
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed
          }
        } catch {
          return {}
        }
      }

      return {}
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

        // Загружаем данные товара
        const response = await productDetailsApi.getProductDetails(this.productId)
        this.product = response.product
        this.feedback = response.feedback
        this.rating = response.rating

      } catch (err: any) {
        this.error = err.message || 'Ошибка загрузки товара'
        console.error('Ошибка загрузки товара:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
