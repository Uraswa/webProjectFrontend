// import axios from "axios";
// import {jwtDecode} from "jwt-decode";

// let baseUrl = "http://localhost:8000/";

// const $api = axios.create({
//   withCredentials: true,
//   baseURL: baseUrl
// })

// $api.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

//   if (config.port) {
//     config.baseURL = `${baseUrl}:${config.port}`;
//     delete config.port; // Удаляем, чтобы не мешал
//   }

//   return config;
// })



// $api.interceptors.response.use((config) => {
//   return config;
// },async (error) => {
//   const originalRequest = error.config;
//   if (error.response.status === 401 && error.config && !error.config._isRetry) {
//     originalRequest._isRetry = true;
//     try {
//       await Api.refreshToken();
//       return $api.request(originalRequest);
//     } catch (e) {
//       console.log(e);
//       window.em.send('NOT_AUTHORIZED')
//     }
//   }
//   throw error;
// })

// export default class Api {

//   static refreshInterval;
//   static isTokenRefreshing;

//   static startAutoTokenProlong(){
//     if (Api.isTokenRefreshing) return;
//     if (Api.refreshInterval) {
//       clearTimeout(Api.refreshInterval);
//     }

//     let token = localStorage.getItem('token');
//     if (!token) {
//       console.log("Nothing to prolong.")
//       Api.refreshInterval = undefined;
//       Api.isTokenRefreshing = false;
//       return;
//     }


//     const decoded = jwtDecode(token);
//     const expirationTime = decoded.exp * 1000;
//     const currentTime = Date.now();
//     const timeUntilExpiration = expirationTime - currentTime;
//     const refreshThreshold = 60000; // 1 минута (в мс)

//     if (timeUntilExpiration <= refreshThreshold) {
//       // Токен скоро истечёт — обновляем сразу
//       this.refreshToken();
//     } else {
//       // Ставим таймер на обновление за 1 минуту до истечения
//       Api.refreshInterval = setTimeout(this.refreshToken, timeUntilExpiration - refreshThreshold);
//     }
//   }

//   static async refreshToken(){
//     Api.isTokenRefreshing = true;
//     const response = await axios.post(`${baseUrl}/api/users/refreshToken`, {}, {withCredentials: true})
//     this.setToken(response.data.data.accessToken);
//     Api.isTokenRefreshing = false;
//     return response.data.data.accessToken;
//   }

//   static setToken(token){
//     localStorage.setItem('token', token);
//     Api.startAutoTokenProlong();
//   }

//   static async get(endPoint){
//     return await $api.get(endPoint);

//   }

//   static async post(endPoint, data){
//     return await $api.post(endPoint, data);

//   }
// }


import axios from "axios";

let baseUrl = "http://localhost:8000/";

// ХАРДКОД: тестовый токен
const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOSwiaWF0IjoxNzY2MzQ3Mjc0LCJleHAiOjE3NjYzNTA4NzR9.lUpdvSR8s1DNopno-lzLsbVVSNAmDb2mC41aiu69K9s';

// Инициализация токена при первом запуске
if (typeof localStorage !== 'undefined' && !localStorage.getItem('token')) {
  localStorage.setItem('token', DEV_TOKEN);
  console.log('✅ [DEV] Токен для тестового пользователя установлен');
}

const $api = axios.create({
  withCredentials: true,
  baseURL: baseUrl
})

$api.interceptors.request.use((config) => {
  // Всегда используем хардкодный токен
  config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  
  if (config.port) {
    config.baseURL = `${baseUrl}:${config.port}`;
    delete config.port;
  }

  return config;
})

$api.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  
  // Для 401 ошибки сразу возвращаем хардкодный токен
  if (error.response && error.response.status === 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    
    // Просто добавляем токен и повторяем запрос
    originalRequest.headers.Authorization = `Bearer ${DEV_TOKEN}`;
    return $api.request(originalRequest);
  }
  
  throw error;
})

export default class Api {
  static async get(endPoint) {
    return await $api.get(endPoint);
  }

  static async post(endPoint, data) {
    return await $api.post(endPoint, data);
  }

  static async put(endPoint, data) {
    return await $api.put(endPoint, data);
  }

  static async delete(endPoint) {
    return await $api.delete(endPoint);
  }

  static async patch(endPoint, data) {
    return await $api.patch(endPoint, data);
  }

  // Простой метод для проверки авторизации
  static isAuthenticated() {
    return true; // Всегда авторизован в режиме разработки
  }
}