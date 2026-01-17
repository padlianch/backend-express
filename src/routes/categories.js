const express = require('express');
const categoryController = require('../controllers/categoryController');
const { auth, isAdmin } = require('../middleware/auth');
const {
  categoryValidator,
  idParamValidator
} = require('../utils/validators');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', idParamValidator, categoryController.getById);

// Admin only routes
router.post('/', auth, isAdmin, categoryValidator, categoryController.create);
router.put('/:id', auth, isAdmin, idParamValidator, categoryValidator, categoryController.update);
router.delete('/:id', auth, isAdmin, idParamValidator, categoryController.delete);

module.exports = router;
