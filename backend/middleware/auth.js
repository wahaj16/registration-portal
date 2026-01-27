const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle both user and admin tokens
    if (decoded.userId) {
      req.userId = decoded.userId;
      req.userType = 'user';
    } else if (decoded.adminId) {
      req.userId = decoded.adminId;
      req.adminId = decoded.adminId;
      req.userType = 'admin';
      req.role = decoded.role;
      req.permissions = decoded.permissions;
    } else {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;