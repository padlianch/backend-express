const { Comment, Post, User } = require('../models');
const { sendErrorResponse } = require('../utils/errorHandler');

exports.getByPost = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId, parentId: null },
      include: [
        { model: User, as: 'author', attributes: ['id', 'name'] },
        {
          model: Comment,
          as: 'replies',
          include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { comments }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.create = async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment || parentComment.postId !== parseInt(postId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent comment.'
        });
      }
    }

    const comment = await Comment.create({
      postId,
      userId: req.user.id,
      parentId: parentId || null,
      content,
      isApproved: req.user.role === 'admin'
    });

    const result = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Comment created successfully.',
      data: { comment: result }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.approve = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.'
      });
    }

    await comment.update({ isApproved: true });

    res.json({
      success: true,
      message: 'Comment approved successfully.',
      data: { comment }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.delete = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.'
      });
    }

    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment.'
      });
    }

    await comment.destroy();

    res.json({
      success: true,
      message: 'Comment deleted successfully.'
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};
