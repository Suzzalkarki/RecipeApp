const Chef = require('../models/chef');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ─── Helper: generate a JWT token ───────────────────────────────
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // payload — what we store inside the token
    process.env.JWT_SECRET,          // secret key to sign it
    { expiresIn: '7d' }             // token expires in 7 days
  );
};

// ─── REGISTER ───────────────────────────────────────────────────
const registerChef = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // 2. Check if email already exists
    const existingChef = await Chef.findOne({ email });
    if (existingChef) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 3. Hash the password (10 = salt rounds — higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new chef in database
    const chef = await Chef.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Send back token + chef info (never send password back!)
    res.status(201).json({
      _id: chef._id,
      name: chef.name,
      email: chef.email,
      token: generateToken(chef._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── LOGIN ──────────────────────────────────────────────────────
const loginChef = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find chef by email
    const chef = await Chef.findOne({ email });
    if (!chef) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare the plain password with the hashed one in DB
    const isMatch = await bcrypt.compare(password, chef.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Send back token + chef info
    res.status(200).json({
      _id: chef._id,
      name: chef.name,
      email: chef.email,
      token: generateToken(chef._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerChef, loginChef };