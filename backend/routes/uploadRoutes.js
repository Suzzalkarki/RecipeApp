const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// POST /api/upload
// Protected — only logged in chefs can upload images
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    // multer + cloudinary automatically uploads the file
    // req.file contains the result from Cloudinary
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Send back the Cloudinary URL
    res.status(200).json({
      url: req.file.path,  // this is the full Cloudinary URL
      public_id: req.file.filename,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;