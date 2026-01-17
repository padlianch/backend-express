const { Tag, Post } = require('../models');
const { sendErrorResponse } = require('../utils/errorHandler');

exports.getAll = async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { tags }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.getById = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{
        model: Post,
        as: 'posts',
        where: { status: 'published' },
        required: false
      }]
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found.'
      });
    }

    res.json({
      success: true,
      data: { tag }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existing = await Tag.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Tag with this name already exists.'
      });
    }

    const tag = await Tag.create({ name, slug });

    res.status(201).json({
      success: true,
      message: 'Tag created successfully.',
      data: { tag }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.update = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found.'
      });
    }

    const { name } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (slug !== tag.slug) {
      const existing = await Tag.findOne({ where: { slug } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Tag with this name already exists.'
        });
      }
    }

    await tag.update({ name, slug });

    res.json({
      success: true,
      message: 'Tag updated successfully.',
      data: { tag }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.delete = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found.'
      });
    }

    await tag.destroy();

    res.json({
      success: true,
      message: 'Tag deleted successfully.'
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};
