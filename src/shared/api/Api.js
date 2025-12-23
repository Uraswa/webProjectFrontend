import axios from "axios";
import {jwtDecode} from "jwt-decode";

let baseUrl = "http://localhost:8000/";

function getStoredToken() {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') return null;
  const trimmed = token.trim();
  return trimmed ? trimmed : null;
}

const $api = axios.create({
  withCredentials: true,
  baseURL: baseUrl
})

$api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;

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
  const originalRequest = error.config;
  if (error?.response?.status === 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    try {
      await Api.refreshTokenSingleFlight();
      return $api.request(originalRequest);
    } catch (e) {
      console.log(e);
      localStorage.removeItem('token');
      window?.em?.send?.('NOT_AUTHORIZED')
    }
  }
  throw error;
})

export default class Api {

  static refreshInterval;
  static isTokenRefreshing;
  static refreshPromise;

  static startAutoTokenProlong(){
    if (Api.isTokenRefreshing) return;
    if (Api.refreshInterval) {
      clearTimeout(Api.refreshInterval);
    }

    let token = getStoredToken();
    if (!token) {
      console.log("Nothing to prolong.")
      Api.refreshInterval = undefined;
      Api.isTokenRefreshing = false;
      return;
    }


    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (e) {
      localStorage.removeItem('token');
      Api.refreshInterval = undefined;
      Api.isTokenRefreshing = false;
      return;
    }
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;
    const refreshThreshold = 60000; // 1 минута (в мс)

    if (timeUntilExpiration <= refreshThreshold) {
      // Токен скоро истечёт — обновляем сразу
      this.refreshTokenSingleFlight().catch(() => {});
    } else {
      // Ставим таймер на обновление за 1 минуту до истечения
      Api.refreshInterval = setTimeout(() => {
        this.refreshTokenSingleFlight().catch(() => {});
      }, timeUntilExpiration - refreshThreshold);
    }
  }

  static async refreshTokenSingleFlight() {
    if (Api.refreshPromise) return Api.refreshPromise;
    Api.refreshPromise = Api.refreshToken().finally(() => {
      Api.refreshPromise = undefined;
    });
    return Api.refreshPromise;
  }

  static async refreshToken(){
    Api.isTokenRefreshing = true;
    try {
      const response = await axios.post(`${baseUrl}api/refreshToken`, {}, {withCredentials: true})
      const accessToken = response?.data?.data?.accessToken;

      if (!response?.data?.success || !accessToken) {
        throw new Error(response?.data?.error || 'refresh_failed');
      }

      this.setToken(accessToken);
      return accessToken;
    } finally {
      Api.isTokenRefreshing = false;
    }
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
