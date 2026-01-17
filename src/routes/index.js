const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const tagRoutes = require('./tags');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
