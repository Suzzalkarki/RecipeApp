const express = require('express');
const router = express.Router();
const {
  getAllChefs,
  getChefById,
  updateChefProfile,
  getMyProfile,
} = require('../controllers/chefController');
const { protect, chefOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllChefs);
router.get('/me/profile', protect, getMyProfile);
router.get('/:id', getChefById);

// Chef only — only chefs can update their own profile
router.put('/:id', protect, chefOnly, updateChefProfile);

module.exports = router;