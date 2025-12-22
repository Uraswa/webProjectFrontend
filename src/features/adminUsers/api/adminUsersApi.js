import Api from "src/shared/api/Api.js";

export const adminUsersApi = {
  async listActiveUsers(search = "") {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return await Api.get(`/api/admin/users/active${query}`);
  }
};
