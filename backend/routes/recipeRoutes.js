const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { protect, chefOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

// Chef only routes — must be logged in AND be a chef
router.post('/', protect, chefOnly, createRecipe);
router.put('/:id', protect, chefOnly, updateRecipe);
router.delete('/:id', protect, chefOnly, deleteRecipe);

module.exports = router;