const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Post = require('./Post');
const Comment = require('./Comment');
const Tag = require('./Tag');
const PostTag = require('./PostTag');
const RefreshToken = require('./RefreshToken');

// =====================
// ASSOCIATIONS / RELASI
// =====================

// User -> Posts (One-to-Many)
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Category -> Posts (One-to-Many)
Category.hasMany(Post, { foreignKey: 'categoryId', as: 'posts' });
Post.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Post -> Comments (One-to-Many)
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User -> Comments (One-to-Many)
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Comment -> Replies (Self-referencing One-to-Many)
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

// Post <-> Tags (Many-to-Many through PostTag)
Post.belongsToMany(Tag, { through: PostTag, foreignKey: 'postId', as: 'tags' });
Tag.belongsToMany(Post, { through: PostTag, foreignKey: 'tagId', as: 'posts' });

// User -> RefreshTokens (One-to-Many)
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const db = {
  sequelize,
  User,
  Category,
  Post,
  Comment,
  Tag,
  PostTag,
  RefreshToken
};

module.exports = db;
