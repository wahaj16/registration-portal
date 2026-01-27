const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.adminId) {
      return res.status(403).json({ message: 'Access denied. Admin token required.' });
    }

    // Verify admin exists and is active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(403).json({ message: 'Access denied. Admin account not found or inactive.' });
    }

    req.adminId = decoded.adminId;
    req.role = decoded.role;
    req.permissions = decoded.permissions;
    req.admin = admin;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = adminAuth;