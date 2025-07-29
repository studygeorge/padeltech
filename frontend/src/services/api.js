import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Убираем дублирование /api
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🔗 API Base URL:', import.meta.env.VITE_API_URL || '/api');

// Функция для получения токена
const getToken = () => {
  try {
    return localStorage.getItem('auth_token');
  } catch (err) {
    console.error('❌ Error getting token from localStorage:', err);
    return null;
  }
};

// Функция для очистки токена
const clearToken = () => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    console.log('🗑️ Token cleared from localStorage');
  } catch (err) {
    console.error('❌ Error clearing token from localStorage:', err);
  }
};

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️  No token found for request');
    }
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized, clearing token...');
      // Если токен истек, удаляем его
      clearToken();
      // Не перенаправляем, просто очищаем токен
    }
    
    return Promise.reject(error);
  }
);

// API методы для авторизации
export const authAPI = {
  // Авторизация через Telegram
  telegramAuth: (telegramData) => {
    console.log('🔐 Sending Telegram auth request:', telegramData);
    return api.post('/auth/telegram', telegramData); // Убираем /api из пути
  },
  
  // Проверка токена
  verifyToken: () => {
    console.log('🔍 Verifying token...');
    return api.get('/auth/verify');
  },
  
  // Выход
  logout: () => {
    console.log('👋 Sending logout request...');
    return api.post('/auth/logout');
  },

  // Завершение регистрации
  completeRegistration: (data) => {
    console.log('🔧 Sending registration completion request:', data);
    return api.post('/auth/complete-registration', data);
  },
};

// API методы для пользователей
export const userAPI = {
  // Получить профиль пользователя
  getProfile: () => api.get('/user/profile'),
  
  // Обновить профиль
  updateProfile: (data) => api.put('/user/profile', data),
};

export default api;