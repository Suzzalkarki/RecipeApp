const Chef = require('../models/chef');
const Recipe = require('../models/Recipe');

// ─── GET ALL chefs (Public) ──────────────────────────────────────
const getAllChefs = async (req, res) => {
  try {
    // ✅ Only fetch users who are chefs — not food lovers
    const chefs = await Chef.find({ role: 'chef' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(chefs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ─── GET ONE chef + their recipes (Public) ───────────────────────
const getChefById = async (req, res) => {
  try {
    // ✅ Only find users who are actually chefs
    const chef = await Chef.findOne({
      _id: req.params.id,
      role: 'chef'
    }).select('-password');

    if (!chef) return res.status(404).json({ message: 'Chef not found' });

    const recipes = await Recipe.find({ chefId: req.params.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ chef, recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE chef profile (Protected) ─────────────────────────────
const updateChefProfile = async (req, res) => {
  try {
    // A chef can only update THEIR OWN profile
    // req.chef._id comes from JWT middleware
    // req.params.id comes from the URL
    if (req.chef._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Whitelist — only allow safe fields
    // Notice: password is NOT here — password change needs its own secure route
    const { name, bio, profileImage } = req.body;

    const updatedChef = await Chef.findByIdAndUpdate(
      req.params.id,
      { name, bio, profileImage },
      { new: true, runValidators: true }
    ).select('-password');  // never return password

    res.status(200).json(updatedChef);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET logged-in chef's own profile (Protected) ─────────────────
const getMyProfile = async (req, res) => {
  try {
    // req.chef is already set by middleware — no need to query again
    const chef = await Chef.findById(req.chef._id).select('-password');

    // Also get their recipes count
    const recipeCount = await Recipe.countDocuments({ chefId: req.chef._id });

    res.status(200).json({ chef, recipeCount });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllChefs, getChefById, updateChefProfile, getMyProfile };