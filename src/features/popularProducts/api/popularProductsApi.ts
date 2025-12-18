// features/popularProducts/api/popularProductsApi.ts
import Api from "src/shared/api/Api.js";
import { Product } from "src/entities/Product/models/Product";

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

      // Мапим в интерфейс Product
      const products: Product[] = response.data.data.map((item: any) => ({
        product_id: item.product_id,
        category_id: item.category_id,
        shop_id: item.shop_id,
        name: item.name,
        description: item.description,
        photos: item.photos,
        price: item.price,
        created_at: item.created_at,
        category_name: item.category_name,
        shop_name: item.shop_name,
        order_count: item.order_count,
      }));

      return products;
    } catch (error) {
      console.error("Failed to fetch popular products:", error);
      return [];
    }
  }
};