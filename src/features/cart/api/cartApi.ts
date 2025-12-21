import Api from 'src/shared/api/Api';
import { Cart, CartInfo } from '../types';

export const cartApi = {
  async getCart(): Promise<Cart> {
    const response = await Api.get('/api/cart');
    return response.data.data;
  },

  async getCartInfo(): Promise<CartInfo> {
    const response = await Api.get('/api/cart/info');
    return response.data.data;
  },

  async updateCartItem(productId: number, quantity: number): Promise<Cart> {
    const response = await Api.put(`/api/cart/update/${productId}`, { quantity });
    return response.data.data;
  },

  async clearCart(): Promise<any> {
    const response = await Api.delete('/api/cart/clear');
    return response.data.data;
  },
};