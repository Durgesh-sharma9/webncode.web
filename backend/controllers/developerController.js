const Developer = require('../models/Developer');
const imagekit = require('../config/imagekit');

/**
 * Default team members if DB is unseeded
 */
const DEFAULT_DEVELOPERS = [
  {
    name: 'ARYAN KUMAR SWAIN',
    role: 'FULL STACK DEVELOPER',
    bio: 'Develops robust frontend interfaces and scalable backend systems. Specialized in React, Node.js, and compiler logic.',
    image: '',
    hoverImage: '',
    location: 'JAIPUR, INDIA',
    flag: '🇮🇳',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/aryan-ks/',
    github: 'https://github.com/AryanKumarSwain',
    twitter: 'https://x.com/Aryannn_KS',
    instagram: 'https://www.instagram.com/aaryankumarswain',
    order: 1
  },
  {
    name: 'PRANAV KUMAR SWAIN',
    role: 'FULL STACK DEVELOPER',
    bio: 'Crafts responsive UI modules with fine-tuned interactive designs. Focused on app speeds and modular architecture.',
    image: '',
    hoverImage: '',
    location: 'JAIPUR, INDIA',
    flag: '🇮🇳',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/pranav-kumar-swain',
    github: 'https://github.com',
    twitter: 'https://x.com/PrnvSwain',
    instagram: 'https://www.instagram.com/pranavkumarswain',
    order: 2
  },
  {
    name: 'DURGESH SHARMA',
    role: 'FULL STACK DEVELOPER',
    bio: 'Architects database schemas, secure RESTful API nodes, and optimized real-time synchronization hooks.',
    image: '',
    hoverImage: '',
    location: 'JAIPUR, INDIA',
    flag: '🇮🇳',
    team: 'WnC TEAM',
    linkedin: 'https://www.linkedin.com/in/durgesh-sharma-508762339/',
    github: 'https://github.com/Durgesh-sharma9',
    twitter: 'https://x.com/Dev_sharma_ai',
    instagram: 'https://www.instagram.com/dev998889',
    order: 3
  }
];

/**
 * GET /api/developers
 * Public: Fetch all developers
 */
exports.getAllDevelopers = async (req, res) => {
  try {
    let developers = await Developer.find().sort({ order: 1, createdAt: -1 });

    // Seed defaults if empty
    if (developers.length === 0) {
      try {
        developers = await Developer.insertMany(DEFAULT_DEVELOPERS);
      } catch (seedErr) {
        console.warn('Note: could not auto-seed developers:', seedErr.message);
        return res.json({ success: true, count: DEFAULT_DEVELOPERS.length, data: DEFAULT_DEVELOPERS });
      }
    }

    res.json({
      success: true,
      count: developers.length,
      data: developers
    });
  } catch (error) {
    console.error('Error fetching developers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch developers',
      error: error.message
    });
  }
};

/**
 * POST /api/developers
 * Protected: Add new developer & upload photo to ImageKit
 */
exports.createDeveloper = async (req, res) => {
  try {
    const {
      name,
      role,
      bio,
      location,
      team,
      linkedin,
      github,
      twitter,
      instagram,
      email,
      order,
      imageUrl,
      hoverImageUrl
    } = req.body;

    if (!name || !role || !bio) {
      return res.status(400).json({
        success: false,
        message: 'Name, role, and bio are required'
      });
    }

    let finalImageUrl = imageUrl || '';
    let finalHoverImageUrl = hoverImageUrl || '';

    // Handle primary image upload
    const primaryFile = req.files?.['photo']?.[0] || req.file;
    if (primaryFile) {
      try {
        const sanitizedName = primaryFile.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uploadRes = await imagekit.upload({
          file: primaryFile.buffer,
          fileName: `dev-${Date.now()}-${sanitizedName}`,
          folder: '/webncode/team/'
        });
        if (uploadRes && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.error('ImageKit upload error for developer photo:', uploadErr);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload photo to ImageKit'
        });
      }
    }

    // Handle hover image upload
    const hoverFile = req.files?.['hoverPhoto']?.[0];
    if (hoverFile) {
      try {
        const sanitizedName = hoverFile.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uploadRes = await imagekit.upload({
          file: hoverFile.buffer,
          fileName: `dev-hover-${Date.now()}-${sanitizedName}`,
          folder: '/webncode/team/'
        });
        if (uploadRes && uploadRes.url) {
          finalHoverImageUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.error('ImageKit upload error for developer hover photo:', uploadErr);
      }
    }

    if (!finalHoverImageUrl) {
      finalHoverImageUrl = finalImageUrl;
    }

    const newDev = await Developer.create({
      name: name.trim(),
      role: role.trim().toUpperCase(),
      bio: bio.trim(),
      image: finalImageUrl,
      hoverImage: finalHoverImageUrl,
      location: location ? location.trim() : 'JAIPUR, INDIA',
      flag: '🇮🇳',
      team: team ? team.trim() : 'WnC TEAM',
      linkedin: linkedin ? linkedin.trim() : '',
      github: github ? github.trim() : '',
      twitter: twitter ? twitter.trim() : '',
      instagram: instagram ? instagram.trim() : '',
      email: email ? email.trim() : '',
      order: order ? Number(order) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Developer added successfully',
      data: newDev
    });
  } catch (error) {
    console.error('Error creating developer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create developer',
      error: error.message
    });
  }
};

/**
 * PUT /api/developers/:id
 * Protected: Update existing developer
 */
exports.updateDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Developer.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    const {
      name,
      role,
      bio,
      location,
      team,
      linkedin,
      github,
      twitter,
      instagram,
      email,
      order,
      imageUrl,
      hoverImageUrl
    } = req.body;

    let finalImageUrl = existing.image;
    let finalHoverImageUrl = existing.hoverImage;

    // Handle new primary photo upload
    const primaryFile = req.files?.['photo']?.[0] || req.file;
    if (primaryFile) {
      try {
        const sanitizedName = primaryFile.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uploadRes = await imagekit.upload({
          file: primaryFile.buffer,
          fileName: `dev-${Date.now()}-${sanitizedName}`,
          folder: '/webncode/team/'
        });
        if (uploadRes && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.error('ImageKit update photo upload error:', uploadErr);
      }
    } else if (imageUrl !== undefined) {
      finalImageUrl = imageUrl;
    }

    // Handle new hover photo upload
    const hoverFile = req.files?.['hoverPhoto']?.[0];
    if (hoverFile) {
      try {
        const sanitizedName = hoverFile.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uploadRes = await imagekit.upload({
          file: hoverFile.buffer,
          fileName: `dev-hover-${Date.now()}-${sanitizedName}`,
          folder: '/webncode/team/'
        });
        if (uploadRes && uploadRes.url) {
          finalHoverImageUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.error('ImageKit update hover photo upload error:', uploadErr);
      }
    } else if (hoverImageUrl !== undefined) {
      finalHoverImageUrl = hoverImageUrl;
    }

    existing.name = name !== undefined ? name.trim() : existing.name;
    existing.role = role !== undefined ? role.trim().toUpperCase() : existing.role;
    existing.bio = bio !== undefined ? bio.trim() : existing.bio;
    existing.image = finalImageUrl;
    existing.hoverImage = finalHoverImageUrl || finalImageUrl;
    existing.location = location !== undefined ? location.trim() : existing.location;
    existing.team = team !== undefined ? team.trim() : existing.team;
    existing.linkedin = linkedin !== undefined ? linkedin.trim() : existing.linkedin;
    existing.github = github !== undefined ? github.trim() : existing.github;
    existing.twitter = twitter !== undefined ? twitter.trim() : existing.twitter;
    existing.instagram = instagram !== undefined ? instagram.trim() : existing.instagram;
    existing.email = email !== undefined ? email.trim() : existing.email;
    existing.order = order !== undefined ? Number(order) : existing.order;

    const updated = await existing.save();

    res.json({
      success: true,
      message: 'Developer updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating developer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update developer',
      error: error.message
    });
  }
};

/**
 * DELETE /api/developers/:id
 * Protected: Delete a developer
 */
exports.deleteDeveloper = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Developer.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found'
      });
    }

    res.json({
      success: true,
      message: 'Developer deleted successfully',
      data: deleted
    });
  } catch (error) {
    console.error('Error deleting developer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete developer',
      error: error.message
    });
  }
};
