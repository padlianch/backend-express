const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostTag = sequelize.define('PostTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    }
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id'
    }
  }
}, {
  tableName: 'post_tags',
  timestamps: true
});

module.exports = PostTag;
