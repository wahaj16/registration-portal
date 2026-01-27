const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if default admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@admin.com' });
    
    if (existingAdmin) {
      console.log('Default admin already exists');
      process.exit(0);
    }

    // Create default admin
    const defaultAdmin = new Admin({
      name: 'Default Admin',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'super_admin',
      permissions: {
        canViewVisitors: true,
        canViewExhibitors: true,
        canManageUsers: true,
        canViewStats: true
      }
    });

    await defaultAdmin.save();
    console.log('Default admin created successfully');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating default admin:', error);
    process.exit(1);
  }
};

createDefaultAdmin();