const jwt = require('jsonwebtoken');
const Chef = require('../models/chef');

// ─── Protect — any logged in user (chef OR foodlover) ────────────
const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.chef = await Chef.findById(decoded.id).select('-password');
    next();

  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// ─── Chef Only — blocks food lovers from chef-only routes ─────────
const chefOnly = (req, res, next) => {
  if (req.chef && req.chef.role === 'chef') {
    next();  // is a chef — allow through
  } else {
    res.status(403).json({
      message: 'Access denied. Only chefs can perform this action.',
    });
  }
};

module.exports = { protect, chefOnly };