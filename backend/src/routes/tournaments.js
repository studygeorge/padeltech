const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const auth = require('../middleware/auth');

// Получение ближайших турниров (публичный доступ)
router.get('/upcoming', tournamentController.getUpcomingTournaments);

// Получение турнира по ID (публичный доступ)
router.get('/:id', tournamentController.getTournamentById);

// Регистрация на турнир (требует авторизации)
router.post('/:id/register', auth, tournamentController.registerForTournament);

// Отмена регистрации на турнир (требует авторизации)
router.delete('/:id/register', auth, tournamentController.unregisterFromTournament);

module.exports = router;