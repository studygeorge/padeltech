import { createStore } from 'vuex'

// ИСПРАВЛЕНО: Константы для системы 6 заданий (НЕ уровней!)
const TOTAL_TASKS = 6 // Всего 6 заданий подряд

// Утилитарные функции для работы с заданиями
const getProgressPercentage = (completedTasks) => {
  return Math.min((completedTasks / TOTAL_TASKS) * 100, 100)
}

const getCurrentTaskNumber = (completedTasks) => {
  return Math.min(completedTasks + 1, TOTAL_TASKS)
}

const isGameCompleted = (completedTasks) => {
  return completedTasks >= TOTAL_TASKS
}

export default createStore({
  state: {
    playerName: '',
    currentTask: 1, // ИСПРАВЛЕНО: Текущее задание (1-6)
    points: 0,
    completedTasks: 0, // ИСПРАВЛЕНО: Выполненные задания (0-6)
    taskResults: {}, // НОВОЕ: Результаты каждого задания {taskNumber: success}
    // Дополнительные поля для расширенной статистики
    gameStartTime: null,
    totalPlayTime: 0,
    bestStreaks: [],
    taskCompletionTimes: {} // ИСПРАВЛЕНО: Время выполнения заданий
  },
  
  mutations: {
    SET_PLAYER_NAME(state, name) {
      state.playerName = name
    },
    
    SET_CURRENT_TASK(state, taskNumber) {
      // ИСПРАВЛЕНО: Ограничиваем номер задания от 1 до TOTAL_TASKS (6)
      state.currentTask = Math.min(Math.max(taskNumber, 1), TOTAL_TASKS)
      console.log('Store: Установлено задание', state.currentTask)
    },
    
    ADD_POINTS(state, points) {
      state.points += points
      console.log('Store: Добавлено очков:', points, 'Всего:', state.points)
    },
    
    INCREMENT_COMPLETED_TASKS(state) {
      if (state.completedTasks < TOTAL_TASKS) {
        state.completedTasks++
        console.log('Store: Выполнено заданий:', state.completedTasks, '/', TOTAL_TASKS)
        
        // ИСПРАВЛЕНО: Автоматически переходим к следующему заданию
        if (state.completedTasks < TOTAL_TASKS) {
          state.currentTask = state.completedTasks + 1
          console.log('Store: Переход к заданию', state.currentTask)
        } else {
          console.log('Store: Все задания выполнены!')
        }
      }
    },
    
    SET_COMPLETED_TASKS(state, count) {
      // ИСПРАВЛЕНО: Устанавливаем количество выполненных заданий с ограничением
      state.completedTasks = Math.min(Math.max(count, 0), TOTAL_TASKS)
      console.log('Store: Установлено выполненных заданий:', state.completedTasks)
      
      // ИСПРАВЛЕНО: Автоматически обновляем текущее задание
      const newTask = getCurrentTaskNumber(state.completedTasks)
      if (newTask !== state.currentTask) {
        console.log('Store: Автоматическое обновление текущего задания до', newTask)
        state.currentTask = newTask
      }
    },
    
    // НОВОЕ: Сохранение результата задания
    SET_TASK_RESULT(state, { taskNumber, success }) {
      state.taskResults[taskNumber] = success
      console.log('Store: Результат задания', taskNumber, ':', success ? 'Успех' : 'Ошибка')
    },
    
    RESET_PROGRESS(state) {
      console.log('Store: Сброс прогресса')
      state.currentTask = 1 // ИСПРАВЛЕНО
      state.points = 0
      state.completedTasks = 0
      state.taskResults = {} // НОВОЕ: Сброс результатов
      state.gameStartTime = null
      state.totalPlayTime = 0
      state.bestStreaks = []
      state.taskCompletionTimes = {} // ИСПРАВЛЕНО
    },
    
    // Дополнительные мутации для расширенной функциональности
    START_GAME_SESSION(state) {
      state.gameStartTime = Date.now()
      console.log('Store: Начата игровая сессия')
    },
    
    END_GAME_SESSION(state) {
      if (state.gameStartTime) {
        const sessionTime = Date.now() - state.gameStartTime
        state.totalPlayTime += sessionTime
        state.gameStartTime = null
        console.log('Store: Завершена игровая сессия, время:', sessionTime)
      }
    },
    
    RECORD_TASK_COMPLETION_TIME(state, { taskNumber, time }) {
      // ИСПРАВЛЕНО: Записываем время выполнения задания
      state.taskCompletionTimes[taskNumber] = time
      console.log('Store: Записано время выполнения задания', taskNumber, ':', time)
    },
    
    ADD_STREAK(state, streakCount) {
      state.bestStreaks.push(streakCount)
      // Сохраняем только топ-10 лучших серий
      state.bestStreaks.sort((a, b) => b - a)
      if (state.bestStreaks.length > 10) {
        state.bestStreaks = state.bestStreaks.slice(0, 10)
      }
      console.log('Store: Добавлена серия:', streakCount)
    }
  },
  
  actions: {
    setPlayerName({ commit }, name) {
      commit('SET_PLAYER_NAME', name)
    },
    
    setCurrentTask({ commit }, taskNumber) {
      // ИСПРАВЛЕНО
      commit('SET_CURRENT_TASK', taskNumber)
    },
    
    addPoints({ commit }, points) {
      commit('ADD_POINTS', points)
    },
    
    completeTask({ commit, state }) {
      // ИСПРАВЛЕНО: Завершаем текущее задание
      commit('INCREMENT_COMPLETED_TASKS')
      
      if (isGameCompleted(state.completedTasks)) {
        console.log('Store: Игра завершена! Все 6 заданий выполнены!')
      }
    },
    
    setCompletedTasks({ commit }, count) {
      commit('SET_COMPLETED_TASKS', count)
    },
    
    // НОВОЕ: Сохранение результата задания
    setTaskResult({ commit }, { taskNumber, success }) {
      commit('SET_TASK_RESULT', { taskNumber, success })
    },
    
    resetProgress({ commit }) {
      commit('RESET_PROGRESS')
    },
    
    // Дополнительные действия
    startGameSession({ commit }) {
      commit('START_GAME_SESSION')
    },
    
    endGameSession({ commit }) {
      commit('END_GAME_SESSION')
    },
    
    recordTaskCompletion({ commit }, { taskNumber, time }) {
      // ИСПРАВЛЕНО
      commit('RECORD_TASK_COMPLETION_TIME', { taskNumber, time })
    },
    
    addStreak({ commit }, streakCount) {
      commit('ADD_STREAK', streakCount)
    },
    
    // ИСПРАВЛЕНО: Переход к следующему заданию
    async advanceToNextTask({ commit, state, dispatch }) {
      const currentTask = state.currentTask
      const nextTask = Math.min(currentTask + 1, TOTAL_TASKS)
      
      if (nextTask > currentTask) {
        console.log('Store: Переход с задания', currentTask, 'к заданию', nextTask)
        commit('SET_CURRENT_TASK', nextTask)
        
        // Добавляем бонусные очки за выполнение задания
        const bonusPoints = nextTask * 10
        dispatch('addPoints', bonusPoints)
        
        return nextTask
      }
      
      return currentTask
    }
  },
  
  getters: {
    // Основные геттеры
    playerName: state => state.playerName,
    currentTask: state => state.currentTask, // ИСПРАВЛЕНО
    currentTaskNumber: state => state.currentTask, // ИСПРАВЛЕНО: Для совместимости
    points: state => state.points,
    completedTasks: state => state.completedTasks,
    taskResults: state => state.taskResults, // НОВОЕ: Результаты заданий
    
    // ИСПРАВЛЕНО: Расширенные геттеры для аналитики
    isGameCompleted: state => isGameCompleted(state.completedTasks),
    
    progressPercentage: state => getProgressPercentage(state.completedTasks),
    
    // ИСПРАВЛЕНО: Прогресс в формате "X/6"
    progressText: state => `${state.completedTasks}/${TOTAL_TASKS}`,
    
    // ИСПРАВЛЕНО: Проверка завершения игры
    isLastTask: state => state.currentTask === TOTAL_TASKS,
    
    totalPlayTime: state => {
      let totalTime = state.totalPlayTime
      if (state.gameStartTime) {
        totalTime += Date.now() - state.gameStartTime
      }
      return totalTime
    },
    
    averageTimePerTask: (state, getters) => {
      // ИСПРАВЛЕНО: Среднее время на задание
      return state.completedTasks > 0 ? getters.totalPlayTime / state.completedTasks : 0
    },
    
    bestStreak: state => {
      return state.bestStreaks.length > 0 ? Math.max(...state.bestStreaks) : 0
    },
    
    taskStats: state => {
      // ИСПРАВЛЕНО: Статистика заданий
      return Object.keys(state.taskCompletionTimes).map(taskNumber => ({
        taskNumber: parseInt(taskNumber),
        completionTime: state.taskCompletionTimes[taskNumber],
        isCompleted: parseInt(taskNumber) <= state.completedTasks
      }))
    },
    
    // ИСПРАВЛЕНО: Геттеры для проверки достижений
    hasCompletedTask: state => taskNumber => {
      return taskNumber <= state.completedTasks
    },
    
    getPointsForTask: state => taskNumber => {
      // ИСПРАВЛЕНО: Подсчитываем очки за конкретное задание
      return taskNumber * 10 // Примерная формула
    },
    
    // ИСПРАВЛЕНО: Статистика игры
    gameStats: (state, getters) => ({
      totalTasks: TOTAL_TASKS,
      completedTasks: state.completedTasks,
      currentTask: state.currentTask,
      progressPercentage: getters.progressPercentage,
      progressText: getters.progressText,
      isGameCompleted: getters.isGameCompleted,
      isLastTask: getters.isLastTask,
      totalPlayTime: getters.totalPlayTime,
      bestStreak: getters.bestStreak
    })
  }
})