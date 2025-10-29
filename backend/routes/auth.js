const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('role').optional().isIn(['owner', 'client']).withMessage('Role must be either owner or client')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, authController.registerUser);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, authController.loginUser);

// @route   GET /api/auth/profile
// @desc    Get logged-in user profile
// @access  Private
router.get('/profile', auth, authController.getUserProfile);

// @route   PUT /api/auth/profile
// @desc    Update logged-in user profile
// @access  Private
router.put('/profile', auth, authController.updateUser);

// @route   GET /api/auth/me
// @desc    Get current user profile (for frontend compatibility)
// @access  Private
router.get('/me', auth, authController.getUserProfile);

module.exports = router;
