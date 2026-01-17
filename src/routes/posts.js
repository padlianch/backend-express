const express = require('express');
const postController = require('../controllers/postController');
const { auth } = require('../middleware/auth');
const {
  createPostValidator,
  updatePostValidator,
  idParamValidator,
  paginationValidator
} = require('../utils/validators');

const router = express.Router();

// Public routes
router.get('/', paginationValidator, postController.getAll);
router.get('/:slug', postController.getBySlug);

// Authenticated routes
router.post('/', auth, createPostValidator, postController.create);
router.put('/:id', auth, idParamValidator, updatePostValidator, postController.update);
router.delete('/:id', auth, idParamValidator, postController.delete);

module.exports = router;
