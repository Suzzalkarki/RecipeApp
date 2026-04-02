const jwt = require('jsonwebtoken');
const Chef = require('../models/chef');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in request headers
    // Frontend sends: Authorization: Bearer eyJhbGci...
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // 2. Extract just the token part (remove "Bearer ")
      token = req.headers.authorization.split(' ')[1];
    }

    // 3. If no token found, block the request
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // 4. Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: "64f3abc...", iat: 1234, exp: 5678 }

    // 5. Find the chef and attach to request (excluding password)
    req.chef = await Chef.findById(decoded.id).select('-password');

    // 6. Move to the next function (the actual route handler)
    next();

  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };