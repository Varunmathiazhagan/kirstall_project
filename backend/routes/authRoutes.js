const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Base = require('../models/Base');
const { authenticateToken, logActivity } = require('../middleware/authMiddleware');

const router = express.Router();

// Signup/Register new user
router.post('/signup', logActivity('user_signup'), async (req, res) => {
  try {
    const { username, email, password, confirmPassword, role, base_id } = req.body;

    console.log('Signup attempt:', { username, email, role, base_id });

    // Validate required fields
    if (!username || !email || !password || !role || !base_id) {
      return res.status(400).json({ 
        error: 'All fields are required',
        message: 'Please fill in all required fields' 
      });
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        error: 'Passwords do not match',
        message: 'Password and confirm password must match' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'A user with this email or username already exists' 
      });
    }

    // Get base information
    const base = await Base.findById(base_id);
    const baseInfo = base || { name: 'Fort Knox', location: 'Kentucky, USA' };

    // Create new user
    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role,
      base_id,
      base_name: baseInfo.name,
      base_location: baseInfo.location
    });

    await user.save();

    console.log('User created successfully:', { 
      id: user._id, 
      username: user.username, 
      email: user.email 
    });

    res.status(201).json({
      message: 'Account created successfully! You can now log in.',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        message: errors.join(', ')
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: 'Duplicate field',
        message: `${field} already exists`
      });
    }

    res.status(500).json({ 
      error: 'Internal server error during signup',
      message: 'Please try again later'
    });
  }
});

// Register alias for backward compatibility
router.post('/register', (req, res) => {
  req.url = '/signup';
  router.handle(req, res);
});

// Login
router.post('/login', logActivity('user_login'), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Login attempt:', { username, email });

    // Validate required fields
    if (!password || (!username && !email)) {
      return res.status(400).json({ 
        error: 'Invalid input',
        message: 'Username/email and password are required' 
      });
    }

    // Find user by username or email
    const identifier = email || username;
    const user = await User.findByUsernameOrEmail(identifier.toLowerCase());
    
    if (!user) {
      console.log('User not found for:', identifier);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username/email or password is incorrect'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Account deactivated',
        message: 'Your account has been deactivated. Contact administrator.'
      });
    }

    // Validate password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', user.username);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username/email or password is incorrect'
      });
    }

    console.log('Login successful for user:', user.username);

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role, 
        username: user.username,
        base_id: user.base_id
      },
  '4953546c308be3088b28807c767bd35e99818434d130a588e5e6d90b6d1d326e',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: 'An error occurred during login. Please try again.'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User profile not found'
      });
    }
    
    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      message: 'An error occurred while fetching your profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, role, base_id } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    // Update allowed fields
    if (username) user.username = username.toLowerCase();
    if (email) user.email = email.toLowerCase();
    if (role) user.role = role;
    if (base_id) {
      user.base_id = base_id;
      const base = await Base.findById(base_id);
      if (base) {
        user.base_name = base.name;
        user.base_location = base.location;
      }
    }

    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: 'Duplicate field',
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: 'An error occurred while updating your profile'
    });
  }
});

// Logout (in a real app, you might want to blacklist the token)
router.post('/logout', authenticateToken, logActivity('user_logout'), (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Get all bases for signup (public endpoint)
router.get('/bases', async (req, res) => {
  try {
    const bases = await Base.find({ isActive: true }).sort({ name: 1 });
    
    // If no bases in database, return default bases
    if (bases.length === 0) {
      const defaultBases = [
        { id: '1', name: 'Fort Knox', location: 'Kentucky, USA', state: 'KY' },
        { id: '2', name: 'Fort Bragg', location: 'North Carolina, USA', state: 'NC' },
        { id: '3', name: 'Camp Pendleton', location: 'California, USA', state: 'CA' },
        { id: '4', name: 'Naval Station Norfolk', location: 'Virginia, USA', state: 'VA' },
        { id: '5', name: 'Wright-Patterson AFB', location: 'Ohio, USA', state: 'OH' }
      ];
      return res.json({ bases: defaultBases });
    }
    
    res.json({ bases });
  } catch (error) {
    console.error('Bases fetch error:', error);
    
    // Return default bases on error
    const defaultBases = [
      { id: '1', name: 'Fort Knox', location: 'Kentucky, USA', state: 'KY' },
      { id: '2', name: 'Fort Bragg', location: 'North Carolina, USA', state: 'NC' },
      { id: '3', name: 'Camp Pendleton', location: 'California, USA', state: 'CA' },
      { id: '4', name: 'Naval Station Norfolk', location: 'Virginia, USA', state: 'VA' },
      { id: '5', name: 'Wright-Patterson AFB', location: 'Ohio, USA', state: 'OH' }
    ];
    
    res.json({ bases: defaultBases });
  }
});

module.exports = router;