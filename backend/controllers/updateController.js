const mongoose = require('mongoose');
const Update = require('../models/Update');

/**
 * Helper to generate slug from title
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * 6 Default Seed Updates from existing static data
 */
const defaultUpdates = [
  {
    slug: 'web-builder-pro-launched',
    title: 'Web Builder Pro Launched',
    excerpt:
      'Schools can now create and manage professional websites using customizable templates without coding knowledge.',
    content:
      'Web Builder Pro allows schools to build, customize, and publish modern websites using ready-made templates. Schools can manage pages, galleries, notices, admissions, and announcements without depending on developers.',
    date: '2026-05-15',
    category: 'Product',
    featured: true,
  },
  {
    slug: 'start-sports-booking-system-live',
    title: 'Start Sports Booking System Live',
    excerpt:
      'Ground owners can manage bookings, view occupied slots, and accept online payments seamlessly.',
    content:
      'Start Sports simplifies sports facility management with real-time slot booking, booking history, payment tracking, customer management, and automated scheduling.',
    date: '2026-04-22',
    category: 'Product',
    featured: true,
  },
  {
    slug: 'internship-program-open',
    title: 'Internship Program Open',
    excerpt:
      'Join our internship program and work on real SaaS products used by schools and organizations.',
    content:
      'Selected interns will work alongside our development team on live projects including School ERP, Web Builder Pro, HireHub, and Sports Academy Pro. Positions are available for Frontend, Backend, and Full Stack Development.',
    date: '2026-04-01',
    category: 'Careers',
    featured: true,
  },
  {
    slug: 'sports-academy-pro-released',
    title: 'Sports Academy Pro Released',
    excerpt:
      'Manage coaches, students, fees, attendance, and performance tracking from one platform.',
    content:
      'Sports Academy Pro helps academies digitize operations with coach management, player records, fee collection, attendance monitoring, performance tracking, and reporting dashboards.',
    date: '2026-03-10',
    category: 'Product',
    featured: false,
  },
  {
    slug: 'web-n-code-ecosystem-growth',
    title: 'Web n Code Product Ecosystem Expands',
    excerpt:
      'Our software ecosystem now supports schools, academies, sports facilities, and organizations.',
    content:
      'Web n Code Technologies continues expanding its SaaS ecosystem with products focused on education management, recruitment, sports operations, website building, and business automation.',
    date: '2026-02-14',
    category: 'Company',
    featured: false,
  },
  {
    slug: 'hirehub-platform-update',
    title: 'HireHub Recruitment Platform Updated',
    excerpt:
      'Advanced candidate search, talent pool access, and recruiter productivity tools are now available.',
    content:
      'HireHub now includes enhanced candidate filtering, shared talent pool access, profile management improvements, and streamlined recruitment workflows for schools and organizations.',
    date: '2026-01-28',
    category: 'Product',
    featured: false,
  },
];

/**
 * Ensure initial updates are seeded in database
 */
const ensureSeeded = async () => {
  try {
    for (const item of defaultUpdates) {
      const exists = await Update.findOne({ slug: item.slug });
      if (!exists) {
        await Update.create(item);
      }
    }
  } catch (err) {
    console.error('Error ensuring updates seeded:', err.message);
  }
};

/**
 * GET /api/updates
 * Public: Fetch all updates with optional filters
 */
exports.getAllUpdates = async (req, res) => {
  try {
    // Auto seed on access if not present
    await ensureSeeded();

    const { category, featured, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true' || featured === true;
    }

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }];
    }

    const updates = await Update.find(filter).sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: updates.length,
      data: updates
    });
  } catch (error) {
    console.error('Get all updates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch updates',
      error: error.message
    });
  }
};

/**
 * GET /api/updates/:slugOrId
 * Public: Fetch single update
 */
exports.getUpdateBySlugOrId = async (req, res) => {
  try {
    const { slug } = req.params;
    let update = null;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      update = await Update.findById(slug);
    }
    if (!update) {
      update = await Update.findOne({ slug });
    }

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    res.status(200).json({
      success: true,
      data: update
    });
  } catch (error) {
    console.error('Get update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch update details',
      error: error.message
    });
  }
};

/**
 * POST /api/updates
 * Protected (Admin only): Create new update
 */
exports.createUpdate = async (req, res) => {
  try {
    const { title, excerpt, content, date, category, featured } = req.body;

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, excerpt, and content are required'
      });
    }

    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Update.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newUpdate = await Update.create({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      date: date ? date.trim() : new Date().toISOString().split('T')[0],
      category: category ? category.trim() : 'Product',
      featured: featured === true || featured === 'true'
    });

    res.status(201).json({
      success: true,
      message: 'Update created successfully',
      data: newUpdate
    });
  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create update',
      error: error.message
    });
  }
};

/**
 * PUT /api/updates/:id
 * Protected (Admin only): Update existing update
 */
exports.updateUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Update.findById(id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    const { title, excerpt, content, date, category, featured } = req.body;

    if (title && title.trim() !== update.title) {
      update.title = title.trim();
    }
    if (excerpt !== undefined) update.excerpt = excerpt.trim();
    if (content !== undefined) update.content = content.trim();
    if (date !== undefined) update.date = date.trim();
    if (category !== undefined) update.category = category.trim();
    if (featured !== undefined) {
      update.featured = featured === true || featured === 'true';
    }

    await update.save();

    res.status(200).json({
      success: true,
      message: 'Update modified successfully',
      data: update
    });
  } catch (error) {
    console.error('Update update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to modify update',
      error: error.message
    });
  }
};

/**
 * DELETE /api/updates/:id
 * Protected (Admin only): Delete an update
 */
exports.deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Update.findByIdAndDelete(id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Update deleted successfully'
    });
  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete update',
      error: error.message
    });
  }
};

/**
 * PATCH /api/updates/:id/feature
 * PUT /api/updates/:id/feature
 * Protected (Admin only): Toggle featured status
 */
exports.toggleFeaturedUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Update.findById(id);

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Update not found'
      });
    }

    if (typeof req.body.featured === 'boolean') {
      update.featured = req.body.featured;
    } else {
      update.featured = !update.featured;
    }

    await update.save();

    res.status(200).json({
      success: true,
      message: `Update ${update.featured ? 'marked as featured' : 'unfeatured'} successfully`,
      data: update
    });
  } catch (error) {
    console.error('Toggle featured update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status',
      error: error.message
    });
  }
};
