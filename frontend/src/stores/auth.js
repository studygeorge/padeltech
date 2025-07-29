import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI } from '@/services/api';
import { storage } from '@/utils/storage';

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const user = ref(null);
  const token = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const isInitialized = ref(false);

  // Геттеры
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userFullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim();
  });

  // Функция для сохранения данных в localStorage
  const saveToStorage = (newToken, userData) => {
    storage.set('auth_token', newToken);
    storage.set('user_data', userData);
  };

  // Функция для очистки данных из localStorage
  const clearFromStorage = () => {
    storage.remove('auth_token');
    storage.remove('user_data');
  };

  // Действия
  const loginWithTelegram = async (telegramData) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      console.log('🔐 Attempting Telegram login...');
      const response = await authAPI.telegramAuth(telegramData);
      const { token: newToken, user: userData } = response.data;
      
      console.log('✅ Login successful, saving data...');
      
      // Сохраняем данные в store и localStorage
      token.value = newToken;
      user.value = userData;
      saveToStorage(newToken, userData);
      
      console.log('✅ Auth data saved successfully');
      return { success: true };
    } catch (err) {
      console.error('❌ Login failed:', err);
      error.value = err.response?.data?.message || 'Ошибка авторизации';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Завершение регистрации
  const completeRegistration = async (data) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      console.log('🔧 Completing registration...');
      const response = await authAPI.completeRegistration(data);
      const { user: userData } = response.data;
      
      console.log('✅ Registration completed successfully');
      
      // Обновляем данные пользователя
      user.value = userData;
      saveToStorage(token.value, userData);
      
      return { success: true };
    } catch (err) {
      console.error('❌ Registration completion failed:', err);
      error.value = err.response?.data?.error || 'Ошибка при завершении регистрации';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Logging out...');
      
      // Очищаем данные сразу
      const currentToken = token.value;
      token.value = null;
      user.value = null;
      clearFromStorage();
      
      // Пытаемся отправить запрос на сервер (но не ждем результата)
      if (currentToken) {
        authAPI.logout().catch(err => {
          console.error('Ошибка при выходе на сервере:', err);
        });
      }
      
      console.log('✅ Logout completed');
    } catch (err) {
      console.error('❌ Error during logout:', err);
    }
  };

  const verifyToken = async () => {
    if (!token.value) {
      console.log('❌ No token to verify');
      return false;
    }
    
    try {
      console.log('🔍 Verifying token...');
      const response = await authAPI.verifyToken();
      user.value = response.data.user;
      console.log('✅ Token verified successfully');
      return true;
    } catch (err) {
      console.log('❌ Token verification failed:', err.response?.status);
      // Токен недействителен
      logout();
      return false;
    }
  };

  const initializeAuth = async () => {
    if (isInitialized.value) {
      console.log('🔄 Auth already initialized');
      return;
    }

    console.log('🔄 Initializing auth...');
    
    // Проверяем доступность localStorage
    if (!storage.isAvailable()) {
      console.error('❌ localStorage is not available');
      isInitialized.value = true;
      return;
    }
    
    try {
      const savedUser = storage.get('user_data');
      const savedToken = storage.get('auth_token');
      
      console.log('📦 Saved token exists:', !!savedToken);
      console.log('📦 Saved user exists:', !!savedUser);
      
      if (savedUser && savedToken) {
        console.log('📦 Found saved auth data, restoring...');
        
        // Восстанавливаем данные в store
        user.value = savedUser;
        token.value = savedToken;
        
        console.log('📦 Data restored to store, verifying token...');
        
        // Проверяем валидность токена
        const isValid = await verifyToken();
        if (isValid) {
          console.log('✅ Auth restored successfully');
        } else {
          console.log('❌ Token invalid, clearing auth data');
        }
      } else {
        console.log('ℹ️  No saved auth data found');
      }
    } catch (err) {
      console.error('❌ Error during auth initialization:', err);
      clearFromStorage();
    }
    
    isInitialized.value = true;
    console.log('✅ Auth initialization completed');
  };

  return {
    // Состояние
    user,
    token,
    isLoading,
    error,
    isInitialized,
    
    // Геттеры
    isAuthenticated,
    userFullName,
    
    // Действия
    loginWithTelegram,
    logout,
    verifyToken,
    initializeAuth,
    completeRegistration
  };
});