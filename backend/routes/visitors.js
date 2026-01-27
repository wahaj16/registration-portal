const express = require('express');
const Visitor = require('../models/Visitor');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Register a new visitor
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, company, interests } = req.body;

    // Check if visitor with this email already exists
    const existingVisitor = await Visitor.findOne({ email });
    if (existingVisitor) {
      return res.status(400).json({ 
        message: 'A visitor with this email is already registered',
        visitorNumber: existingVisitor.visitorNumber
      });
    }

    // Generate visitor number
    const count = await Visitor.countDocuments();
    const visitorNumber = `VIS${String(count + 1).padStart(6, '0')}`;

    // Create new visitor
    const visitor = new Visitor({
      visitorNumber,
      name,
      email,
      phone,
      company,
      interests
    });

    await visitor.save();

    res.status(201).json({
      message: 'Visitor registered successfully',
      visitor: {
        id: visitor._id,
        visitorNumber: visitor.visitorNumber,
        name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        company: visitor.company,
        interests: visitor.interests,
        registrationDate: visitor.registrationDate
      }
    });
  } catch (error) {
    console.error('Visitor registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
});

// Get all visitors (for admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json({
      message: 'Visitors retrieved successfully',
      count: visitors.length,
      visitors
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get visitor by visitor number
router.get('/:visitorNumber', async (req, res) => {
  try {
    const visitor = await Visitor.findOne({ visitorNumber: req.params.visitorNumber });
    
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json({
      message: 'Visitor found',
      visitor
    });
  } catch (error) {
    console.error('Error fetching visitor:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
// Get visitor statistics
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const activeVisitors = await Visitor.countDocuments({ status: 'active' });
    const inactiveVisitors = await Visitor.countDocuments({ status: 'inactive' });
    
    // Get registration trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = await Visitor.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get visitors by company (top 10)
    const companyStats = await Visitor.aggregate([
      {
        $match: { company: { $ne: null, $ne: '' } }
      },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      message: 'Visitor statistics retrieved successfully',
      stats: {
        total: totalVisitors,
        active: activeVisitors,
        inactive: inactiveVisitors,
        recentRegistrations,
        topCompanies: companyStats
      }
    });
  } catch (error) {
    console.error('Error fetching visitor statistics:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});