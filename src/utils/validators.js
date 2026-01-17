const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
  handleValidationErrors,
];

// User validators
const updateUserValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  handleValidationErrors,
];

// Post validators
const createPostValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters')
    .escape(),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
  body('categoryId')
    .notEmpty().withMessage('Category is required')
    .isInt({ min: 1 }).withMessage('Invalid category ID'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  handleValidationErrors,
];

const updatePostValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters')
    .escape(),
  body('content')
    .optional()
    .trim(),
  body('categoryId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid category ID'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  handleValidationErrors,
];

// Comment validators
const createCommentValidator = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('postId')
    .notEmpty().withMessage('Post ID is required')
    .isInt({ min: 1 }).withMessage('Invalid post ID'),
  body('parentId')
    .optional()
    .isInt({ min: 1 }).withMessage('Invalid parent comment ID'),
  handleValidationErrors,
];

// Category validators
const categoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Category name must be between 2 and 100 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  handleValidationErrors,
];

// Tag validators
const tagValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tag name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Tag name must be between 2 and 50 characters')
    .escape(),
  handleValidationErrors,
];

// ID param validator
const idParamValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid ID'),
  handleValidationErrors,
];

// PostId param validator
const postIdParamValidator = [
  param('postId')
    .isInt({ min: 1 }).withMessage('Invalid post ID'),
  handleValidationErrors,
];

// Password change validator
const changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required'),
  handleValidationErrors,
];

// Pagination validator middleware
const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Page must be between 1 and 1000'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  updateUserValidator,
  createPostValidator,
  updatePostValidator,
  createCommentValidator,
  categoryValidator,
  tagValidator,
  idParamValidator,
  postIdParamValidator,
  changePasswordValidator,
  paginationValidator,
};
