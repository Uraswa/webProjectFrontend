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
          <ProductGallery :images="photos" />
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
        :characteristics="product.characteristics"
        class="q-mt-xl"
      />

      <!-- Отзывы -->
      <ProductReviewsWidget
        :reviews="feedback"
        :rating="rating"
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
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Widgets
import ProductGallery from 'src/widgets/ProductGallery/ProductGallery.vue'
import ProductInfoPanel from 'src/widgets/ProductInfoPanel/ProductInfoPanel.vue'
import ProductCharacteristics from 'src/widgets/ProductCharacteristics/ProductCharacteristics.vue'
import ProductReviewsWidget from 'src/widgets/ProductReviewsWidget/ProductReviewsWidget.vue'

// Feature
import { useProductDetails } from 'src/features/productDetails/model/useProductDetails'

export default defineComponent({
  name: 'ProductPage',
  
  components: {
    ProductGallery,
    ProductInfoPanel,
    ProductCharacteristics,
    ProductReviewsWidget
  },
  
  setup() {
    const route = useRoute()
    const { product, feedback, rating, loading, error, loadProduct, productId } = useProductDetails()
    
    const photos = computed(() => {
      if (!product.value?.photos) return []
      return Array.isArray(product.value.photos) 
        ? product.value.photos 
        : [product.value.photos]
    })
    
    // Загрузка данных
    onMounted(() => {
      loadProduct()
    })
    
    // Действия
    const addToCart = () => {
      console.log('🛒 Добавить в корзину:', product.value?.product_id)
      // TODO: Реализовать добавление в корзину
    }
    
    const buyNow = () => {
      console.log('⚡ Купить в 1 клик:', product.value?.product_id)
      // TODO: Реализовать быструю покупку
    }
    
    return {
      product,
      feedback,
      rating,
      loading,
      error,
      photos,
      productId,
      addToCart,
      buyNow
    }
  }
})
</script>