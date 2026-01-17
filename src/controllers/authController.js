const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { validatePassword } = require('../utils/passwordValidator');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements.',
        errors: passwordValidation.errors
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.'
      });
    }

    const user = await User.create({ name, email, password });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await RefreshToken.generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user,
        accessToken,
        refreshToken: refreshToken.token,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await RefreshToken.generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user,
        accessToken,
        refreshToken: refreshToken.token,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const tokenRecord = await RefreshToken.verifyToken(refreshToken);
    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.'
      });
    }

    // Get user
    const user = await User.findByPk(tokenRecord.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive.'
      });
    }

    // Revoke old refresh token
    await tokenRecord.revoke();

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = await RefreshToken.generateToken(user.id);

    res.json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken.token,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const tokenRecord = await RefreshToken.verifyToken(refreshToken);
      if (tokenRecord) {
        await tokenRecord.revoke();
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.logoutAll = async (req, res) => {
  try {
    // Revoke all refresh tokens for the user
    await RefreshToken.revokeAllUserTokens(req.user.id);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = req.user;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use.'
        });
      }
    }

    await user.update({ name: name || user.name, email: email || user.email });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet requirements.',
        errors: passwordValidation.errors
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens after password change
    await RefreshToken.revokeAllUserTokens(user.id);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
