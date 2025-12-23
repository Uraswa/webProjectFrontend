import axios from "axios";
import {jwtDecode} from "jwt-decode";

let baseUrl = "http://localhost:8000/";

const $api = axios.create({
  withCredentials: true,
  baseURL: baseUrl
})

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.port) {
    const baseOrigin = new URL(baseUrl);
    config.baseURL = `${baseOrigin.protocol}//${baseOrigin.hostname}:${config.port}/`;
    delete config.port; // Удаляем, чтобы не мешал
  }

  return config;
})



$api.interceptors.response.use((config) => {
  return config;
},async (error) => {
  const status = error?.response?.status;
  const originalRequest = error?.config;
  if (status === 401 && originalRequest && !originalRequest._isRetry) {
    originalRequest._isRetry = true;
    try {
      await Api.refreshToken();
      return $api.request(originalRequest);
    } catch (e) {
      console.log(e);
      if (typeof window !== 'undefined' && window?.em?.send) {
        window.em.send('NOT_AUTHORIZED')
      }
    }
  }
  throw error;
})

export default class Api {

  static refreshInterval;
  static isTokenRefreshing;

  static startAutoTokenProlong(){
    if (Api.isTokenRefreshing) return;
    if (Api.refreshInterval) {
      clearTimeout(Api.refreshInterval);
    }

    let token = localStorage.getItem('token');
    if (!token) {
      console.log("Nothing to prolong.")
      Api.refreshInterval = undefined;
      Api.isTokenRefreshing = false;
      return;
    }


    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    const refreshThreshold = 60000; // 1 минута (в мс)

    if (timeUntilExpiration <= refreshThreshold) {
      // Токен скоро истечёт — обновляем сразу
      this.refreshToken();
    } else {
      // Ставим таймер на обновление за 1 минуту до истечения
      Api.refreshInterval = setTimeout(this.refreshToken, timeUntilExpiration - refreshThreshold);
    }
  }

  static async refreshToken(){
    Api.isTokenRefreshing = true;
    const response = await axios.post(`${baseUrl}api/refreshToken`, {}, {withCredentials: true})
    this.setToken(response.data.data.accessToken);
    Api.isTokenRefreshing = false;
    return response.data.data.accessToken;
  }

  static setToken(token){
    localStorage.setItem('token', token);
    Api.startAutoTokenProlong();
  }

  static async get(endPoint){
    return await $api.get(endPoint);

  }

  static async post(endPoint, data){
    return await $api.post(endPoint, data);
  }

  static async put(endPoint, data) {
    return await $api.put(endPoint, data);
  }

  static async patch(endPoint, data) {
    return await $api.patch(endPoint, data);
  }

  static async delete(endPoint){
    return await $api.delete(endPoint);
  }
}
