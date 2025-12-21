import { Product } from 'src/entities/Product/models/Product';
/** Параметры поиска товаров */
export interface ProductSearchParams {
  search?: string;
  category_id?: number;
  shop_id?: number;
  min_price?: number;
  max_price?: number;
  order_by?: 'name' | 'price' | 'created_at';
  order_direction?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/** Пагинация */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/** Ответ поиска */
export interface ProductSearchResponse {
  products: Product[]; // используем единый Product
  pagination: Pagination;
}
