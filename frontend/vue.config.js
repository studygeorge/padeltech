const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/styles/variables.scss";
          @import "@/styles/typography.scss";
        `
      }
    }
  },
  // Отключаем линтинг при сборке
  lintOnSave: false,
  
  // Используем относительные пути для публичных ресурсов
  publicPath: ''
})
