const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

// Получение рейтинга (публичный доступ)
router.get('/', ratingController.getRating);

// Сброс месячных изменений (только для админов)
router.post('/reset-monthly', auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Только администраторы могут сбрасывать месячные изменения' });
  }
  next();
}, ratingController.resetMonthlyChanges);

module.exports = router; 