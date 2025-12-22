import Api from "src/shared/api/Api.js";

export const adminOppsApi = {
  async listOpps(search = "") {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return await Api.get(`/api/admin/opps${query}`);
  },

  async createOpp(payload) {
    return await Api.post("/api/admin/opps", payload);
  },

  async updateOpp(oppId, payload) {
    return await Api.put(`/api/admin/opps/${oppId}`, payload);
  },

  async deleteOpp(oppId) {
    return await Api.delete(`/api/admin/opps/${oppId}`);
  }
};
