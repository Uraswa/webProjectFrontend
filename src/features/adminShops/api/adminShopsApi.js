import Api from "src/shared/api/Api.js";

export const adminShopsApi = {
  async listShops(search = "") {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return await Api.get(`/api/admin/shops${query}`);
  },

  async createShop(payload) {
    return await Api.post("/api/admin/shops", payload);
  },

  async updateShop(shopId, payload) {
    return await Api.put(`/api/admin/shops/${shopId}`, payload);
  },

  async deleteShop(shopId) {
    return await Api.delete(`/api/admin/shops/${shopId}`);
  }
};
