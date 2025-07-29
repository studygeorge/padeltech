const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const auth = require('../middleware/auth');

// Все роуты защищены авторизацией
router.use(auth);

// Создание матча
router.post('/', matchController.createMatch);

// Получение списка матчей
router.get('/', matchController.getMatches);

// Обновление счета матча
router.put('/:matchId/score', matchController.updateMatchScore);

// Отмена матча
router.put('/:matchId/cancel', matchController.cancelMatch);

module.exports = router; 