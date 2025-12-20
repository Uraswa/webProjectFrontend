// features/productDetails/model/useProductDetails.ts
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { productDetailsApi } from '../api/productDetailsApi'
import type { Product } from 'src/entities/Product/models/Product'
import type { ProductReview, ProductRating } from '../api/productDetailsApi'

export function useProductDetails() {
  const route = useRoute()
  const productId = computed(() => Number(route.params.id))
  
  const product = ref<Product | null>(null)
  const feedback = ref<ProductReview[]>([])
  const rating = ref<ProductRating>({ total_reviews: '0', average_rating: '0' })
  const loading = ref(true)
  const error = ref<string | null>(null)
  
  const loadProduct = async () => {
    try {
      loading.value = true
      error.value = null
      
      if (!productId.value || isNaN(productId.value)) {
        throw new Error('Неверный ID товара')
      }
      
      const response = await productDetailsApi.getProductDetails(productId.value)
      product.value = response.product
      feedback.value = response.feedback
      rating.value = response.rating
      
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки товара'
      console.error('❌ Ошибка загрузки товара:', err)
    } finally {
      loading.value = false
    }
  }
  
  return {
    product,
    feedback,
    rating,
    loading,
    error,
    loadProduct,
    productId
  }
}