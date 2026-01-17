const { Category, Post } = require('../models');
const { Op } = require('sequelize');
const { sendErrorResponse } = require('../utils/errorHandler');

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Post,
        as: 'posts',
        where: { status: 'published' },
        required: false
      }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists.'
      });
    }

    const category = await Category.create({ name, slug, description });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: { category }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    const { name, description } = req.body;
    const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : category.slug;

    if (slug !== category.slug) {
      const existing = await Category.findOne({ where: { slug } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists.'
        });
      }
    }

    await category.update({
      name: name ?? category.name,
      slug,
      description: description ?? category.description
    });

    res.json({
      success: true,
      message: 'Category updated successfully.',
      data: { category }
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};

exports.delete = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    sendErrorResponse(res, 500, 'Server error.', error);
  }
};
