const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  employeeNumber: {
    type: String,
    unique: true
  }
});

const ExhibitorSchema = new mongoose.Schema({
  exhibitorNumber: {
    type: String,
    unique: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  boothSize: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large', 'premium']
  },
  hallNumber: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  specialRequirements: {
    type: String,
    trim: true
  },
  employees: [EmployeeSchema],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exhibitor', ExhibitorSchema);