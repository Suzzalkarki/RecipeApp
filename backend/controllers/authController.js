const Chef = require('../models/chef');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ─── REGISTER ────────────────────────────────────────────────────
const registerChef = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Validate role — only accept these two values
    const allowedRoles = ['chef', 'foodlover'];
    const userRole = allowedRoles.includes(role) ? role : 'foodlover';

    const existingChef = await Chef.findOne({ email });
    if (existingChef) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const chef = await Chef.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,    // ✅ save the role
    });

    res.status(201).json({
      _id: chef._id,
      name: chef.name,
      email: chef.email,
      role: chef.role,   // ✅ send role back to frontend
      token: generateToken(chef._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────
const loginChef = async (req, res) => {
  try {
    const { email, password } = req.body;

    const chef = await Chef.findOne({ email });
    if (!chef) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, chef.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      _id: chef._id,
      name: chef.name,
      email: chef.email,
      role: chef.role,   // ✅ send role back to frontend
      token: generateToken(chef._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerChef, loginChef };