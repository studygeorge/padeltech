// Утилиты для работы с прогрессом уровней
export const TOTAL_LEVELS = 7
export const TASKS_PER_LEVEL = 3
export const TOTAL_TASKS = TOTAL_LEVELS * TASKS_PER_LEVEL // 21

export const getLevelFromTaskCount = (completedTasks) => {
  if (completedTasks === 0) return 1
  return Math.min(Math.ceil(completedTasks / TASKS_PER_LEVEL), TOTAL_LEVELS)
}

export const getTasksCompletedInLevel = (completedTasks, currentLevel) => {
  const tasksBeforeCurrentLevel = (currentLevel - 1) * TASKS_PER_LEVEL
  return completedTasks - tasksBeforeCurrentLevel
}

export const getProgressPercentage = (completedTasks) => {
  return Math.min((completedTasks / TOTAL_TASKS) * 100, 100)
}

export const isLevelCompleted = (level, completedTasks) => {
  return completedTasks >= level * TASKS_PER_LEVEL
}

export const getRemainingTasksInLevel = (currentLevel, completedTasks) => {
  const tasksInCurrentLevel = getTasksCompletedInLevel(completedTasks, currentLevel)
  return TASKS_PER_LEVEL - tasksInCurrentLevel
}
