const express = require('express');
const commentController = require('../controllers/commentController');
const { auth, isAdmin } = require('../middleware/auth');
const {
  createCommentValidator,
  idParamValidator,
  postIdParamValidator
} = require('../utils/validators');

const router = express.Router();

// Public routes
router.get('/post/:postId', postIdParamValidator, commentController.getByPost);

// Authenticated routes
router.post('/', auth, createCommentValidator, commentController.create);
router.delete('/:id', auth, idParamValidator, commentController.delete);

// Admin only routes
router.put('/:id/approve', auth, isAdmin, idParamValidator, commentController.approve);

module.exports = router;
