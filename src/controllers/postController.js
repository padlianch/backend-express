const { Post, User, Category, Tag, Comment } = require('../models');
const { Op } = require('sequelize');
const { sendErrorResponse } = require('../utils/errorHandler');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, categoryId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const { count, rows: posts } = await Post.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        posts,
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

exports.getBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name', 'slug'] },
        {
          model: Comment,
          as: 'comments',
          where: { isApproved: true, parentId: null },
          required: false,
          include: [
            { model: User, as: 'author', attributes: ['id', 'name'] },
            {
              model: Comment,
              as: 'replies',
              include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    // Increment view count
    await post.increment('viewCount');

    res.json({
      success: true,
      data: { post }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, excerpt, categoryId, featuredImage, status, tags } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const post = await Post.create({
      userId: req.user.id,
      categoryId,
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null
    });

    // Attach tags if provided
    if (tags && tags.length > 0) {
      const tagRecords = await Tag.findAll({ where: { id: tags } });
      await post.setTags(tagRecords);
    }

    const result = await Post.findByPk(post.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      data: { post: result }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.update = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    // Check ownership (unless admin)
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post.'
      });
    }

    const { title, content, excerpt, categoryId, featuredImage, status, tags } = req.body;

    await post.update({
      title: title ?? post.title,
      content: content ?? post.content,
      excerpt: excerpt ?? post.excerpt,
      categoryId: categoryId ?? post.categoryId,
      featuredImage: featuredImage ?? post.featuredImage,
      status: status ?? post.status,
      publishedAt: status === 'published' && !post.publishedAt ? new Date() : post.publishedAt
    });

    if (tags) {
      const tagRecords = await Tag.findAll({ where: { id: tags } });
      await post.setTags(tagRecords);
    }

    const result = await Post.findByPk(post.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'category' },
        { model: Tag, as: 'tags' }
      ]
    });

    res.json({
      success: true,
      message: 'Post updated successfully.',
      data: { post: result }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.delete = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post.'
      });
    }

    await post.destroy();

    res.json({
      success: true,
      message: 'Post deleted successfully.'
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};
