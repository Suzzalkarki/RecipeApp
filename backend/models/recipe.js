const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 500,
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required'],
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    cookingTime: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Other'],
      default: 'Other',
    },
    image: {
      type: String,
      default: '',
    },
    chefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chef',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;