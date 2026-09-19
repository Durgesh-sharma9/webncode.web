const Project = require('../models/Project');
const imagekit = require('../config/imagekit');

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
 * Create a new Project with ImageKit upload
 * POST /api/projects
 * Protected (Admin only)
 */
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      category,
      features,
      demoUrl,
      color,
      accentColor,
      isFeatured
    } = req.body;

    if (!title || !shortDescription || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, short summary, and full description are required'
      });
    }

    // Process features (can be array, JSON string, or newline-separated)
    let parsedFeatures = [];
    if (Array.isArray(features)) {
      parsedFeatures = features.filter((f) => f && f.trim().length > 0);
    } else if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) {
          parsedFeatures = parsed;
        } else {
          parsedFeatures = features.split('\n').map((f) => f.trim()).filter(Boolean);
        }
      } catch {
        parsedFeatures = features.split('\n').map((f) => f.trim()).filter(Boolean);
      }
    }

    // Upload images to ImageKit
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const uploadRes = await imagekit.upload({
            file: file.buffer,
            fileName: `wnc-${Date.now()}-${sanitizedName}`,
            folder: '/webncode/projects/'
          });
          if (uploadRes && uploadRes.url) {
            imageUrls.push(uploadRes.url);
          }
        } catch (uploadErr) {
          console.error('ImageKit single upload error:', uploadErr);
        }
      }
    }

    // Generate unique slug
    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Project.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Save project in MongoDB
    const project = await Project.create({
      title: title.trim(),
      slug,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      category: category ? category.trim() : 'Services',
      features: parsedFeatures,
      demoUrl: demoUrl ? demoUrl.trim() : '',
      images: imageUrls,
      color: color || '#7dd3fc',
      accentColor: accentColor || '#38bdf8',
      isFeatured: isFeatured === 'true' || isFeatured === true
    });

    res.status(201).json({
      success: true,
      message: 'Project created and images uploaded to ImageKit successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

/**
 * Get all Projects
 * GET /api/projects
 * Public
 */
exports.getAllProjects = async (req, res) => {
  try {
    // Ensure default homepage showcase item (Syllabus Tracker) is seeded for SuperAdmin management
    const syllabusTracker = await Project.findOne({ slug: 'timetable-pro' });
    if (!syllabusTracker) {
      await Project.create({
        title: 'Syllabus Tracker',
        slug: 'timetable-pro',
        shortDescription:
          'Smart timetable and academic management platform for schools and educational institutions.',
        description:
          'Timetable Pro helps schools manage faculty schedules, class timetables, homework assignments, and teaching activities. Teachers can view schedules, submit daily reports, assign homework, track completed topics, and stay organized through a centralized dashboard.',
        category: 'Education',
        features: [
          'Faculty timetable management',
          'Class timetable scheduling',
          'Teacher dashboard',
          'Homework assignment',
          'Daily teaching reports'
        ],
        demoUrl: 'https://timetablepro.webncode.in/',
        images: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
        ],
        isFeatured: true,
        color: '#2563EB',
        accentColor: '#DBEAFE'
      });
    }

    const projects = await Project.find().sort({ isFeatured: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

/**
 * Get single Project by slug
 * GET /api/projects/:slug
 * Public
 */
exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

/**
 * Update a Project
 * PUT /api/projects/:id
 * Protected (Admin only)
 */
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const {
      title,
      shortDescription,
      description,
      category,
      features,
      demoUrl,
      isFeatured,
      existingImages
    } = req.body;

    if (title) project.title = title.trim();
    if (shortDescription) project.shortDescription = shortDescription.trim();
    if (description) project.description = description.trim();
    if (category) project.category = category.trim();
    if (demoUrl !== undefined) project.demoUrl = demoUrl.trim();
    if (isFeatured !== undefined) {
      project.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    if (features !== undefined) {
      let parsedFeatures = [];
      if (Array.isArray(features)) {
        parsedFeatures = features;
      } else if (typeof features === 'string') {
        try {
          const parsed = JSON.parse(features);
          parsedFeatures = Array.isArray(parsed) ? parsed : features.split('\n');
        } catch {
          parsedFeatures = features.split('\n');
        }
      }
      project.features = parsedFeatures.map((f) => f.trim()).filter(Boolean);
    }

    // Keep existing images that were retained
    let updatedImages = [];
    if (existingImages !== undefined) {
      if (Array.isArray(existingImages)) {
        updatedImages = existingImages;
      } else if (typeof existingImages === 'string') {
        try {
          const parsed = JSON.parse(existingImages);
          updatedImages = Array.isArray(parsed) ? parsed : [existingImages];
        } catch {
          updatedImages = [existingImages];
        }
      }
    } else {
      updatedImages = project.images || [];
    }

    // Upload any newly selected files to ImageKit
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const uploadRes = await imagekit.upload({
            file: file.buffer,
            fileName: `wnc-${Date.now()}-${sanitizedName}`,
            folder: '/webncode/projects/'
          });
          if (uploadRes && uploadRes.url) {
            updatedImages.push(uploadRes.url);
          }
        } catch (uploadErr) {
          console.error('ImageKit edit upload error:', uploadErr);
        }
      }
    }

    project.images = updatedImages;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

/**
 * Delete a Project
 * DELETE /api/projects/:id
 * Protected (Admin only)
 */
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

