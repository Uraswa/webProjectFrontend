export interface CartItemProduct {
    product_id: number;
    name: string;
    price: string;
    photos: string[] | string;
    description: string;
    shop_name: string;
    category_name: string;
  }
  
  export interface CartItem {
    product_id: number;
    quantity: number;
    added_at: string;
    product: CartItemProduct;
    total: string;
  }
  
  export interface Cart {
    items: CartItem[];
    total: string;
    item_count: number;
  }
  
  export interface CartInfo {
    item_count: number;
    total_items: number;
    exists: boolean;
    updated_at: string;
  }