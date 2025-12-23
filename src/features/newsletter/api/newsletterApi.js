import Api from "src/shared/api/Api.js";

export const newsletterApi = {
  async subscribe(email) {
    return await Api.post("/api/newsletter/subscribe", { email });
  },

  async unsubscribe(email) {
    return await Api.post("/api/newsletter/unsubscribe", { email });
  }
};
