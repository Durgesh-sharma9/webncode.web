const mongoose = require('mongoose');
const Category = require('../models/Category');
const Project = require('../models/Project');

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const defaultCategories = [
  { name: 'Education', color: '#60a5fa' },
  { name: 'Sports', color: '#fb923c' },
  { name: 'HR', color: '#c084fc' },
  { name: 'Services', color: '#34d399' },
  { name: 'Operations', color: '#f59e0b' },
  { name: 'Analytics', color: '#f472b6' },
  { name: 'SaaS', color: '#38bdf8' },
  { name: 'Healthcare', color: '#4ade80' },
  { name: 'Custom', color: '#94a3b8' }
];

/**
 * Ensure default categories and any category currently in Project are seeded
 */
const ensureCategoriesSeeded = async () => {
  try {
    // 1. Seed defaults
    for (let i = 0; i < defaultCategories.length; i++) {
      const item = defaultCategories[i];
      const slug = generateSlug(item.name);
      const exists = await Category.findOne({
        $or: [{ slug }, { name: new RegExp(`^${item.name}$`, 'i') }]
      });
      if (!exists) {
        await Category.create({
          name: item.name,
          slug,
          color: item.color,
          order: i
        });
      }
    }

    // 2. Also check if any existing projects have categories not yet in Category
    const projectCategories = await Project.distinct('category');
    for (const catName of projectCategories) {
      if (catName && catName.trim()) {
        const trimmed = catName.trim();
        const slug = generateSlug(trimmed);
        const exists = await Category.findOne({
          $or: [{ slug }, { name: new RegExp(`^${trimmed}$`, 'i') }]
        });
        if (!exists) {
          await Category.create({
            name: trimmed,
            slug,
            color: '#7dd3fc',
            order: 50
          });
        }
      }
    }
  } catch (err) {
    console.error('Error auto-seeding categories:', err.message);
  }
};

/**
 * GET /api/categories
 * Public: Fetch all categories with dynamic project counts
 */
exports.getAllCategories = async (req, res) => {
  try {
    await ensureCategoriesSeeded();

    const categories = await Category.find().sort({ order: 1, name: 1 });

    // Count projects for each category
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Project.countDocuments({ category: cat.name });
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          color: cat.color,
          projectCount: count,
          createdAt: cat.createdAt
        };
      })
    );

    res.status(200).json({
      success: true,
      count: withCounts.length,
      data: withCounts
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

/**
 * POST /api/categories
 * Protected (Admin only): Create new category
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, color, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const trimmed = name.trim();
    const slug = generateSlug(trimmed);

    // Check if duplicate
    const existing = await Category.findOne({
      $or: [{ slug }, { name: new RegExp(`^${trimmed}$`, 'i') }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category "${existing.name}" already exists`
      });
    }

    const newCat = await Category.create({
      name: trimmed,
      slug,
      color: color || '#7dd3fc',
      description: description ? description.trim() : '',
      order: (await Category.countDocuments()) + 1
    });

    res.status(201).json({
      success: true,
      message: `Category "${newCat.name}" created successfully`,
      data: {
        ...newCat.toObject(),
        projectCount: 0
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

/**
 * PUT /api/categories/:id
 * Protected (Admin only): Edit category name/color
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const { name, color, description } = req.body;
    const oldName = category.name;

    if (name && name.trim() && name.trim() !== oldName) {
      const trimmed = name.trim();
      const slug = generateSlug(trimmed);

      const duplicate = await Category.findOne({
        _id: { $ne: id },
        $or: [{ slug }, { name: new RegExp(`^${trimmed}$`, 'i') }]
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Another category named "${duplicate.name}" already exists`
        });
      }

      category.name = trimmed;
      category.slug = slug;

      // Automatically update all projects assigned to oldName to the newName!
      await Project.updateMany({ category: oldName }, { category: trimmed });
    }

    if (color) category.color = color;
    if (description !== undefined) category.description = description.trim();

    await category.save();

    const projectCount = await Project.countDocuments({ category: category.name });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        ...category.toObject(),
        projectCount
      }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

/**
 * DELETE /api/categories/:id
 * Protected (Admin only): Delete a category
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Reassign any projects with this category to 'Services'
    await Project.updateMany(
      { category: category.name },
      { category: 'Services' }
    );

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted. Any assigned projects were reassigned to "Services".`
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};
