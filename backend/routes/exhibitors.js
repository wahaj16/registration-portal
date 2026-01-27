const express = require('express');
const Exhibitor = require('../models/Exhibitor');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Booth pricing
const BOOTH_PRICES = {
  small: 500,
  medium: 800,
  large: 1200,
  premium: 1800
};

// Generate employee numbers for each employee
const generateEmployeeNumbers = async (employees, exhibitorNumber) => {
  return employees.map((employee, index) => ({
    ...employee,
    employeeNumber: `${exhibitorNumber}-EMP${String(index + 1).padStart(2, '0')}`
  }));
};

// Register a new exhibitor
router.post('/register', async (req, res) => {
  try {
    const { 
      companyName, 
      contactPerson, 
      email, 
      phone, 
      website, 
      industry, 
      boothSize, 
      hallNumber,
      description, 
      specialRequirements,
      employees 
    } = req.body;

    // Check if exhibitor with this email already exists
    const existingExhibitor = await Exhibitor.findOne({ email });
    if (existingExhibitor) {
      return res.status(400).json({ 
        message: 'An exhibitor with this email is already registered',
        exhibitorNumber: existingExhibitor.exhibitorNumber
      });
    }

    // Validate hall number
    if (![1, 2, 3].includes(parseInt(hallNumber))) {
      return res.status(400).json({ 
        message: 'Invalid hall number. Please select hall 1, 2, or 3.'
      });
    }

    // Validate booth size
    if (!BOOTH_PRICES[boothSize]) {
      return res.status(400).json({ 
        message: 'Invalid booth size selected.'
      });
    }

    // Generate exhibitor number
    const count = await Exhibitor.countDocuments();
    const exhibitorNumber = `EXH${String(count + 1).padStart(6, '0')}`;

    // Calculate total amount
    const totalAmount = BOOTH_PRICES[boothSize];

    // Generate employee numbers
    const employeesWithNumbers = await generateEmployeeNumbers(employees || [], exhibitorNumber);

    // Create new exhibitor
    const exhibitor = new Exhibitor({
      exhibitorNumber,
      companyName,
      contactPerson,
      email,
      phone,
      website,
      industry,
      boothSize,
      hallNumber: parseInt(hallNumber),
      description,
      specialRequirements,
      employees: employeesWithNumbers,
      totalAmount
    });

    await exhibitor.save();

    res.status(201).json({
      message: 'Exhibitor registered successfully',
      exhibitor: {
        id: exhibitor._id,
        exhibitorNumber: exhibitor.exhibitorNumber,
        companyName: exhibitor.companyName,
        contactPerson: exhibitor.contactPerson,
        email: exhibitor.email,
        phone: exhibitor.phone,
        website: exhibitor.website,
        industry: exhibitor.industry,
        boothSize: exhibitor.boothSize,
        hallNumber: exhibitor.hallNumber,
        description: exhibitor.description,
        specialRequirements: exhibitor.specialRequirements,
        employees: exhibitor.employees,
        totalAmount: exhibitor.totalAmount,
        registrationDate: exhibitor.registrationDate,
        status: exhibitor.status
      }
    });
  } catch (error) {
    console.error('Exhibitor registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
});

// Get all exhibitors (for admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const exhibitors = await Exhibitor.find().sort({ createdAt: -1 });
    res.json({
      message: 'Exhibitors retrieved successfully',
      count: exhibitors.length,
      exhibitors
    });
  } catch (error) {
    console.error('Error fetching exhibitors:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get exhibitor by exhibitor number
router.get('/:exhibitorNumber', async (req, res) => {
  try {
    const exhibitor = await Exhibitor.findOne({ exhibitorNumber: req.params.exhibitorNumber });
    
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    res.json({
      message: 'Exhibitor found',
      exhibitor
    });
  } catch (error) {
    console.error('Error fetching exhibitor:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get exhibitors by hall
router.get('/hall/:hallNumber', adminAuth, async (req, res) => {
  try {
    const hallNumber = parseInt(req.params.hallNumber);
    
    if (![1, 2, 3].includes(hallNumber)) {
      return res.status(400).json({ message: 'Invalid hall number. Must be 1, 2, or 3.' });
    }

    const exhibitors = await Exhibitor.find({ hallNumber }).sort({ createdAt: -1 });
    
    res.json({
      message: `Exhibitors in Hall ${hallNumber} retrieved successfully`,
      hallNumber,
      count: exhibitors.length,
      exhibitors
    });
  } catch (error) {
    console.error('Error fetching exhibitors by hall:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get exhibitor statistics
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalExhibitors = await Exhibitor.countDocuments();
    const pendingExhibitors = await Exhibitor.countDocuments({ status: 'pending' });
    const approvedExhibitors = await Exhibitor.countDocuments({ status: 'approved' });
    const rejectedExhibitors = await Exhibitor.countDocuments({ status: 'rejected' });
    
    const hallStats = await Promise.all([
      Exhibitor.countDocuments({ hallNumber: 1 }),
      Exhibitor.countDocuments({ hallNumber: 2 }),
      Exhibitor.countDocuments({ hallNumber: 3 })
    ]);

    const boothStats = await Exhibitor.aggregate([
      {
        $group: {
          _id: '$boothSize',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      message: 'Exhibitor statistics retrieved successfully',
      stats: {
        total: totalExhibitors,
        pending: pendingExhibitors,
        approved: approvedExhibitors,
        rejected: rejectedExhibitors,
        byHall: {
          hall1: hallStats[0],
          hall2: hallStats[1],
          hall3: hallStats[2]
        },
        byBoothSize: boothStats
      }
    });
  } catch (error) {
    console.error('Error fetching exhibitor statistics:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;