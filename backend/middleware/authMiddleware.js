const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
  const decoded = jwt.verify(token, '4953546c308be3088b28807c767bd35e99818434d130a588e5e6d90b6d1d326e');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const authorizeBase = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Admin can access all bases
  if (req.user.role === 'admin') {
    return next();
  }

  // Base commander can only access their base
  if (req.user.role === 'base_commander') {
    const requestedBaseId = req.params.baseId || req.body.base_id || req.query.base_id;
    
    if (requestedBaseId && parseInt(requestedBaseId) !== req.user.base_id) {
      return res.status(403).json({ error: 'Access denied to this base' });
    }
  }

  next();
};

const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const logData = {
        user_id: req.user?.id,
        action,
        resource: req.path,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        timestamp: new Date()
      };

      // Log to database (you can implement this based on your audit requirements)
      console.log('Activity Log:', logData);
      
      next();
    } catch (error) {
      console.error('Logging error:', error);
      next(); // Continue even if logging fails
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeBase,
  logActivity
};