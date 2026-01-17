const express = require('express');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  updateUserValidator,
  changePasswordValidator
} = require('../utils/validators');

const router = express.Router();

// Public routes with rate limiting
router.post('/register', authLimiter, registerValidator, authController.register);
router.post('/login', authLimiter, loginValidator, authController.login);
router.post('/refresh-token', authLimiter, refreshTokenValidator, authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, updateUserValidator, authController.updateProfile);
router.put('/change-password', auth, changePasswordValidator, authController.changePassword);
router.post('/logout-all', auth, authController.logoutAll);

module.exports = router;
