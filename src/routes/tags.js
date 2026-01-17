const express = require('express');
const tagController = require('../controllers/tagController');
const { auth, isAdmin } = require('../middleware/auth');
const {
  tagValidator,
  idParamValidator
} = require('../utils/validators');

const router = express.Router();

// Public routes
router.get('/', tagController.getAll);
router.get('/:id', idParamValidator, tagController.getById);

// Admin only routes
router.post('/', auth, isAdmin, tagValidator, tagController.create);
router.put('/:id', auth, isAdmin, idParamValidator, tagValidator, tagController.update);
router.delete('/:id', auth, isAdmin, idParamValidator, tagController.delete);

module.exports = router;
