const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isRevoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'refresh_tokens',
  timestamps: true
});

// Generate a new refresh token
RefreshToken.generateToken = async function(userId, expiresInDays = 30) {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const refreshToken = await this.create({
    token,
    userId,
    expiresAt
  });

  return refreshToken;
};

// Verify and get refresh token
RefreshToken.verifyToken = async function(token) {
  const refreshToken = await this.findOne({
    where: { token, isRevoked: false }
  });

  if (!refreshToken) {
    return null;
  }

  if (new Date() > refreshToken.expiresAt) {
    await refreshToken.update({ isRevoked: true });
    return null;
  }

  return refreshToken;
};

// Revoke all tokens for a user
RefreshToken.revokeAllUserTokens = async function(userId) {
  await this.update(
    { isRevoked: true },
    { where: { userId, isRevoked: false } }
  );
};

// Revoke a specific token
RefreshToken.prototype.revoke = async function() {
  await this.update({ isRevoked: true });
};

module.exports = RefreshToken;
