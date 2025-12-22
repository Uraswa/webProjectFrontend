// features/popularProducts/api/popularProductsApi.ts
import Api from "src/shared/api/Api.js";
import { Product } from "src/entities/Product/models/Product";
import { parseProductPhotos } from "src/shared/utils/parsePhotos";  

export const popularProductsApi = {
  /**
   * Получение популярных товаров
   * @param limit - количество товаров (по умолчанию 20)
   * @returns массив Product
   */
  async fetchPopularProducts(limit: number = 20): Promise<Product[]> {
    try {
      const response = await Api.get(`/api/products/popular?limit=${limit}`);
      
      // Проверяем, что есть data
      if (!response.data?.data) {
        console.warn("Popular products API returned no data, returning empty array");
        return [];
      }

      // Мапим в интерфейс Product с парсингом photos
      const products: Product[] = response.data.data.map((item: any) => ({
        product_id: item.product_id,
        category_id: item.category_id,
        shop_id: item.shop_id,
        name: item.name,
        description: item.description,
        photos: parseProductPhotos(item.photos),  
        price: item.price,
        created_at: item.created_at,
        category_name: item.category_name || '',  // Добавляем fallback значения
        shop_name: item.shop_name || '',
        order_count: item.order_count || 0,
      }));

      console.log('✅ Popular products parsed:', products.length, 'items');
      if (products.length > 0) {
        console.log('📸 First product photos:', products[0].photos);
      }

      return products;
    } catch (error) {
      console.error("Failed to fetch popular products:", error);
      return [];
    }
  }
};