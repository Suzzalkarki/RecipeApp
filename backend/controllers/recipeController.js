const Recipe = require('../models/Recipe');

// ─── CREATE a recipe (Protected) ────────────────────────────────
const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, category, image } = req.body;

    // Basic validation
    if (!title || !description || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // req.chef._id comes from our JWT middleware — we know WHO is logged in
    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      category,
      image,
      chefId: req.chef._id,   // automatically link recipe to logged-in chef
    });

    res.status(201).json(recipe);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL recipes (Public) ────────────────────────────────────
const getAllRecipes = async (req, res) => {
  try {
    // populate('chefId') fetches the full chef object instead of just the ID
    // select('name email profileImage') — only get these fields from Chef
    const recipes = await Recipe.find()
      .populate('chefId', 'name email profileImage')
      .sort({ createdAt: -1 });  // newest first

    res.status(200).json(recipes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ONE recipe (Public) ─────────────────────────────────────
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('chefId', 'name email profileImage');

    // If no recipe found with that ID
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(recipe);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE a recipe (Protected) ─────────────────────────────────
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.chefId.toString() !== req.chef._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    // ✅ FIXED — only allow safe fields to be updated
    // We manually pick which fields can change — chefId is NOT in this list
    const { title, description, ingredients, instructions, cookingTime, category, image } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, description, ingredients, instructions, cookingTime, category, image },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedRecipe);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ─── DELETE a recipe (Protected) ─────────────────────────────────
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Security check: only the owner can delete
    if (recipe.chefId.toString() !== req.chef._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Recipe deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};