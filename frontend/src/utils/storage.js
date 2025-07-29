// Утилиты для работы с localStorage

export const storage = {
  // Сохранение данных
  set: (key, value) => {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      console.log(`💾 Saved to localStorage: ${key}`, value);
      return true;
    } catch (err) {
      console.error(`❌ Error saving to localStorage (${key}):`, err);
      return false;
    }
  },

  // Получение данных
  get: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        console.log(`📭 No data found in localStorage: ${key}`);
        return defaultValue;
      }
      
      // Пытаемся распарсить JSON
      try {
        const parsed = JSON.parse(value);
        console.log(`📦 Retrieved from localStorage: ${key}`, parsed);
        return parsed;
      } catch {
        // Если не JSON, возвращаем как строку
        console.log(`📦 Retrieved from localStorage: ${key}`, value);
        return value;
      }
    } catch (err) {
      console.error(`❌ Error reading from localStorage (${key}):`, err);
      return defaultValue;
    }
  },

  // Удаление данных
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed from localStorage: ${key}`);
      return true;
    } catch (err) {
      console.error(`❌ Error removing from localStorage (${key}):`, err);
      return false;
    }
  },

  // Очистка всех данных
  clear: () => {
    try {
      localStorage.clear();
      console.log('🗑️ Cleared all localStorage data');
      return true;
    } catch (err) {
      console.error('❌ Error clearing localStorage:', err);
      return false;
    }
  },

  // Проверка доступности localStorage
  isAvailable: () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  // Получение размера localStorage
  getSize: () => {
    try {
      let size = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
      return size;
    } catch (err) {
      console.error('❌ Error calculating localStorage size:', err);
      return 0;
    }
  },

  // Отладочная информация
  debug: () => {
    try {
      const info = {
        available: storage.isAvailable(),
        size: storage.getSize(),
        keys: Object.keys(localStorage),
        authToken: storage.get('auth_token') ? 'Present' : 'Missing',
        userData: storage.get('user_data') ? 'Present' : 'Missing'
      };
      console.log('🔍 localStorage debug info:', info);
      return info;
    } catch (err) {
      console.error('❌ Error getting localStorage debug info:', err);
      return null;
    }
  }
};

export default storage; 