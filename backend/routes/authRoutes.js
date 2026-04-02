const express = require('express');
const router = express.Router();
const { registerChef, loginChef } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', registerChef);

// POST /api/auth/login
router.post('/login', loginChef);

module.exports = router;