const express = require('express');
const router = express.Router();
const {
  getAllChefs,
  getChefById,
  updateChefProfile,
  getMyProfile,
} = require('../controllers/chefController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllChefs);
router.get('/:id', getChefById);

// Protected routes
router.get('/me/profile', protect, getMyProfile);
router.put('/:id', protect, updateChefProfile);

module.exports = router;