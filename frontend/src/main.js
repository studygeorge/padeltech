import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Обработка динамической высоты viewport для мобильных устройств
function updateViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Инициализация и обновление при изменении размеров
updateViewportHeight();
window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', () => {
  setTimeout(updateViewportHeight, 100);
});

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')