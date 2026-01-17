const express = require('express');
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');
const {
  updateUserValidator,
  idParamValidator,
  paginationValidator
} = require('../utils/validators');

const router = express.Router();

router.use(auth);
router.use(isAdmin);

router.get('/', paginationValidator, userController.getAllUsers);
router.get('/:id', idParamValidator, userController.getUserById);
router.put('/:id', idParamValidator, updateUserValidator, userController.updateUser);
router.delete('/:id', idParamValidator, userController.deleteUser);

module.exports = router;
