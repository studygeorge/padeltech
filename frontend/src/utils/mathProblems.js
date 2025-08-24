// mathProblems.js - ОБНОВЛЕННЫЕ ЗАДАНИЯ
export const mathProblems = {
  1: {
    type: 'shopping',
    title: 'Задание 1: Покупки в магазине',
    description: 'Fluffy хочет купить корм и расческу. Помоги посчитать!',
    problem: 'Fluffy хочет купить корм и расческу. Сколько монет ему нужно?',
    answer: 5,
    explanation: 'Корм стоит 3 монеты + расческа стоит 2 монеты = 5 монет',
    video: 'shopping'
  },
  
  2: {
    type: 'subtraction',
    title: 'Задание 2: Кодовый замок',
    description: 'Помоги Fluffy открыть дверь с кодовым замком!',
    problem: 'Помоги Fluffy открыть дверь. Код: 10 - 6 = ?',
    answer: 4,
    explanation: '10 - 6 = 4',
    video: 'door'
  },
  
  3: {
    type: 'shapes_matching',
    title: 'Задание 3: Сортировка корма',
    description: 'Помоги Fluffy разложить корм по правильным мискам!',
    problem: 'Перетащи каждую фигурку корма в миску с такой же формой',
    answer: 'match_shapes', // Специальный тип ответа для drag&drop
    explanation: 'Круглый корм в круглую миску, квадратный в квадратную, треугольный в треугольную!',
    video: 'playing',
    isInteractive: true,
    interactiveType: 'drag_and_drop'
  },
  
  4: {
    type: 'equal_distribution',
    title: 'Задание 4: Равные порции',
    description: 'Fluffy хочет поесть аккуратно - по 2 штучки каждого корма!',
    problem: 'Положи в каждую миску по 2 штучки корма одинаковой формы',
    answer: 'distribute_equally', // Специальный тип ответа
    explanation: 'По 2 круга, 2 квадрата и 2 треугольника - так Fluffy будет есть разнообразно!',
    video: 'eating',
    isInteractive: true,
    interactiveType: 'distribution'
  },
  
  5: {
    type: 'fractions_slider',
    title: 'Задание 5: Половинка десерта',
    description: 'Fluffy наелся и хочет только половинку вкусняшки!',
    problem: 'Передвинь полоску точно на середину треугольника-десерта',
    answer: 0.5, // Точное значение половины
    explanation: 'Половина - это ровно посередине! Теперь Fluffy не переест.',
    video: 'cooking',
    isInteractive: true,
    interactiveType: 'slider'
  },
  
  6: {
    type: 'multiplication',
    title: 'Задание 6: Печенье для друзей',
    description: 'К Fluffy придут друзья! Нужно приготовить печенье для всех.',
    problem: 'Придут 3 друга, каждому нужно 2 печенья. 3 × 2 = ?',
    answer: 6,
    explanation: '3 друга × 2 печенья = 6 печений. Какой щедрый Fluffy!',
    video: 'cooking',
    isLastTask: true
  }
}