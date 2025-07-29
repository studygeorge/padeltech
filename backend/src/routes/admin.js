const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Все роуты защищены авторизацией
router.use(auth);

// Обновление уровня игрока
router.put('/users/:userId/level', adminController.updatePlayerLevel);

// Создание турнира
router.post('/tournaments', adminController.createTournament);

// Получение списка турниров
router.get('/tournaments', adminController.getTournaments);

module.exports = router;