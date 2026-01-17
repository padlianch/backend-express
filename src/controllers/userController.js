const User = require('../models/User');
const { sendErrorResponse } = require('../utils/errorHandler');

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const { name, email, role, isActive } = req.body;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use.'
        });
      }
    }

    await user.update({
      name: name ?? user.name,
      email: email ?? user.email,
      role: role ?? user.role,
      isActive: isActive ?? user.isActive
    });

    res.json({
      success: true,
      message: 'User updated successfully.',
      data: { user }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};
