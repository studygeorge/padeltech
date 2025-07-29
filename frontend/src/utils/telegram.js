// Утилиты для работы с Telegram авторизацией

// Инициализация Telegram виджета
export const initTelegramWidget = (botUsername, onAuth) => {
  return new Promise((resolve, reject) => {
    // Проверяем, что Telegram виджет загружен
    if (typeof window.Telegram !== 'undefined' && window.Telegram.Login) {
      resolve(window.Telegram.Login);
      return;
    }

    // Загружаем Telegram виджет если его нет
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-auth-url', window.location.origin + '/auth-callback');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-lang', 'ru');
    
    script.onload = () => {
      if (typeof window.Telegram !== 'undefined' && window.Telegram.Login) {
        resolve(window.Telegram.Login);
      } else {
        reject(new Error('Telegram виджет не загрузился'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Ошибка загрузки Telegram виджета'));
    };
    
    document.head.appendChild(script);
  });
};

// Создание кнопки авторизации через Telegram
export const createTelegramLoginButton = (containerId, botUsername, onAuth) => {
  return new Promise((resolve, reject) => {
    // Добавляем небольшую задержку для гарантии создания контейнера
    setTimeout(() => {
      try {
        const container = document.getElementById(containerId);
        if (!container) {
          throw new Error(`Контейнер ${containerId} не найден. Убедитесь, что элемент существует в DOM.`);
        }

        // Удаляем старый скрипт если есть
        const oldScript = document.querySelector(`script[data-telegram-login="${botUsername}"]`);
        if (oldScript) {
          oldScript.remove();
        }

        // Очищаем контейнер
        container.innerHTML = '';

        // Создаём скрипт для Telegram виджета
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botUsername);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '8');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-userpic', 'false');
        script.async = true;

        // Добавляем коллбэк для авторизации
        if (onAuth) {
          window.onTelegramAuth = (user) => {
            console.log('Telegram auth callback received:', user);
            onAuth(user);
          };
          script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        }

        // Добавляем обработчики загрузки
        script.onload = () => {
          console.log('Telegram widget script loaded successfully');
          resolve(script);
        };
        script.onerror = (error) => {
          console.error('Failed to load Telegram widget script:', error);
          reject(error);
        };

        // Вставляем скрипт
        container.appendChild(script);
      } catch (error) {
        console.error('Error initializing Telegram widget:', error);
        reject(error);
      }
    }, 100); // 100ms задержка
  });
};

// Валидация данных от Telegram
export const validateTelegramData = (data) => {
  const requiredFields = ['id', 'first_name', 'auth_date', 'hash'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      return { valid: false, error: `Отсутствует обязательное поле: ${field}` };
    }
  }
  
  // Проверяем, что данные не устарели (не старше 24 часов)
  const authDate = parseInt(data.auth_date);
  const currentTime = Math.floor(Date.now() / 1000);
  const maxAge = 24 * 60 * 60; // 24 часа
  
  if (currentTime - authDate > maxAge) {
    return { valid: false, error: 'Данные авторизации устарели' };
  }
  
  return { valid: true };
};

// Получение данных из URL (для обработки callback)
export const getTelegramDataFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const hash = urlParams.get('hash');
  
  if (!hash) return null;
  
  // Парсим данные из hash
  const params = new URLSearchParams(hash);
  
  return {
    id: params.get('id'),
    first_name: params.get('first_name'),
    last_name: params.get('last_name'),
    username: params.get('username'),
    photo_url: params.get('photo_url'),
    auth_date: params.get('auth_date'),
    hash: params.get('hash'),
  };
}; 