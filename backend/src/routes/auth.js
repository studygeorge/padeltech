const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/telegram', authController.telegramAuth);
router.get('/verify', authController.verifyToken);
router.post('/logout', authController.logout);
router.post('/complete-registration', auth, authController.completeRegistration);

module.exports = router;