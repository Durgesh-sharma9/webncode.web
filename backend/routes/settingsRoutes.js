const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Setting = require('../models/Setting');
const { protect } = require('../middleware/authMiddleware');

const FALLBACK_FILE = path.join(__dirname, '../config/settings_store.json');

// Helper to read fallback file
const readFallback = () => {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      return JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading settings fallback:', err.message);
  }
  return {};
};

// Helper to write fallback file
const writeFallback = (key, val) => {
  try {
    const data = readFallback();
    data[key] = val;
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing settings fallback:', err.message);
  }
};

/**
 * GET /api/settings/:key
 * Public endpoint to fetch any site setting (e.g. floating-logos)
 */
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  try {
    let setting = null;
    try {
      setting = await Setting.findOne({ key });
    } catch (dbErr) {
      console.warn('DB read note for setting, falling back to local store:', dbErr.message);
    }

    if (setting && setting.value !== undefined) {
      const isEnabled = setting.value === true || setting.value === 'true';
      return res.json({ success: true, key, value: setting.value, enabled: isEnabled });
    }

    // Check file fallback
    const fallback = readFallback();
    if (fallback[key] !== undefined) {
      const isEnabled = fallback[key] === true || fallback[key] === 'true';
      return res.json({ success: true, key, value: fallback[key], enabled: isEnabled });
    }

    // Default values if never set
    // floating-logos defaults to true
    return res.json({ success: true, key, value: true, enabled: true });
  } catch (error) {
    console.error('Error fetching setting:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch setting', enabled: true });
  }
});

/**
 * POST /api/settings/:key
 * Protected endpoint for Admin / Super Admin to update site settings
 */
router.post('/:key', protect, async (req, res) => {
  const { key } = req.params;
  const { value, enabled } = req.body;
  const targetValue = value !== undefined ? value : (enabled !== undefined ? enabled : true);

  try {
    // Write to fallback file first for instant persistence
    writeFallback(key, targetValue);

    // Save/update in MongoDB
    try {
      await Setting.findOneAndUpdate(
        { key },
        { value: targetValue },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (dbErr) {
      console.warn('DB write note for setting (file saved):', dbErr.message);
    }

    const isEnabled = targetValue === true || targetValue === 'true';
    return res.json({
      success: true,
      message: `Setting '${key}' updated successfully`,
      key,
      value: targetValue,
      enabled: isEnabled
    });
  } catch (error) {
    console.error('Error saving setting:', error);
    return res.status(500).json({ success: false, message: 'Failed to save setting' });
  }
});

module.exports = router;
