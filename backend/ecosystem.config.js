module.exports = {
    apps: [{
      name: 'padeltech-backend',
      script: './src/server.js',
      cwd: '/home/padeltech.ru/backend',
      instances: 1, // или 'max' для использования всех ядер CPU
      exec_mode: 'fork', // или 'cluster' для кластерного режима
      
      // Переменные окружения
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Настройки перезапуска
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      
      // Автоперезапуск при изменении файлов (отключен для продакшена)
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      
      // Логи
      log_file: '/home/padeltech.ru/logs/combined.log',
      out_file: '/home/padeltech.ru/logs/out.log',
      error_file: '/home/padeltech.ru/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Дополнительные настройки
      kill_timeout: 1600,
      listen_timeout: 3000,
      
      // Настройки для кластерного режима
      merge_logs: true,
      
      // Автозапуск после сбоя
      autorestart: true,
      
      // Время ожидания graceful reload
      kill_timeout: 1600
    }]
  };