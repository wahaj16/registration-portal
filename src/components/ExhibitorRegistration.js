import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaIndustry, FaWarehouse, FaUsers, FaPlus, FaTrash, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import ExhibitorSuccess from './ExhibitorSuccess';
import { API_ENDPOINTS } from '../config/api';

const ExhibitorRegistration = ({ onBack }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    boothSize: 'small',
    hallNumber: 1,
    description: '',
    specialRequirements: ''
  });

  const [employees, setEmployees] = useState([
    { name: '', email: '', phone: '', position: '' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [exhibitorData, setExhibitorData] = useState(null);

  const boothPrices = {
    small: 500,
    medium: 800,
    large: 1200,
    premium: 1800
  };

  const boothDetails = {
    small: { size: '3x3m', desc: 'Perfect for startups' },
    medium: { size: '6x3m', desc: 'Ideal for growing businesses' },
    large: { size: '6x6m', desc: 'Great for established companies' },
    premium: { size: '9x6m', desc: 'Premium showcase space' }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmployeeChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;
    setEmployees(updatedEmployees);
  };

  const addEmployee = () => {
    setEmployees([...employees, { name: '', email: '', phone: '', position: '' }]);
    toast.success('Employee slot added');
  };

  const removeEmployee = (index) => {
    if (employees.length > 1) {
      const updatedEmployees = employees.filter((_, i) => i !== index);
      setEmployees(updatedEmployees);
      toast.success('Employee removed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validEmployees = employees.filter(emp => 
        emp.name.trim() && emp.email.trim() && emp.phone.trim() && emp.position.trim()
      );

      const submissionData = {
        ...formData,
        employees: validEmployees
      };

      const response = await axios.post(API_ENDPOINTS.EXHIBITORS_REGISTER, submissionData);
      
      if (response.data.exhibitor) {
        setExhibitorData(response.data.exhibitor);
        setRegistrationSuccess(true);
        toast.success('Registration successful!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setRegistrationSuccess(false);
    setExhibitorData(null);
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      industry: '',
      boothSize: 'small',
      hallNumber: 1,
      description: '',
      specialRequirements: ''
    });
    setEmployees([{ name: '', email: '', phone: '', position: '' }]);
  };

  if (registrationSuccess && exhibitorData) {
    return (
      <ExhibitorSuccess 
        exhibitorData={exhibitorData} 
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        <motion.button
          whileHover={{ x: -5 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <FaArrowLeft /> Back to Home
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaBuilding className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Exhibitor Registration</h2>
            <p className="text-gray-600">Showcase your business and connect with potential customers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaBuilding className="text-purple-600" />
                Company Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    placeholder="Enter company name"
                    disabled={isLoading}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    placeholder="Enter contact person"
                    disabled={isLoading}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="company@example.com"
                    disabled={isLoading}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    disabled={isLoading}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaGlobe className="inline mr-2" />
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    disabled={isLoading}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaIndustry className="inline mr-2" />
                    Industry *
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Technology, Healthcare"
                    disabled={isLoading}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Booth Information */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaWarehouse className="text-blue-600" />
                Booth Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Booth Size *
                  </label>
                  <select
                    name="boothSize"
                    value={formData.boothSize}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="input-field"
                  >
                    {Object.entries(boothDetails).map(([key, value]) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)} ({value.size}) - ${boothPrices[key]}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">{boothDetails[formData.boothSize].desc}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hall Number *
                  </label>
                  <select
                    name="hallNumber"
                    value={formData.hallNumber}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="input-field"
                  >
                    <option value={1}>Hall 1</option>
                    <option value={2}>Hall 2</option>
                    <option value={3}>Hall 3</option>
                  </select>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Selected Booth</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formData.boothSize.charAt(0).toUpperCase() + formData.boothSize.slice(1)} - {boothDetails[formData.boothSize].size}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                      <FaDollarSign className="text-xl" />
                      {boothPrices[formData.boothSize]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe your company and what you'll be showcasing..."
                  rows="4"
                  disabled={isLoading}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  placeholder="Any special requirements (power, internet, equipment, etc.)"
                  rows="3"
                  disabled={isLoading}
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* Employees */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUsers className="text-green-600" />
                  Employee Information
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addEmployee}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <FaPlus /> Add Employee
                </motion.button>
              </div>

              <AnimatePresence>
                {employees.map((employee, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 border border-green-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-700">Employee {index + 1}</h4>
                      {employees.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => removeEmployee(index)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <FaTrash />
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={employee.name}
                        onChange={(e) => handleEmployeeChange(index, 'name', e.target.value)}
                        placeholder="Full Name"
                        disabled={isLoading}
                        className="input-field"
                      />
                      <input
                        type="text"
                        value={employee.position}
                        onChange={(e) => handleEmployeeChange(index, 'position', e.target.value)}
                        placeholder="Position/Title"
                        disabled={isLoading}
                        className="input-field"
                      />
                      <input
                        type="email"
                        value={employee.email}
                        onChange={(e) => handleEmployeeChange(index, 'email', e.target.value)}
                        placeholder="Email Address"
                        disabled={isLoading}
                        className="input-field"
                      />
                      <input
                        type="tel"
                        value={employee.phone}
                        onChange={(e) => handleEmployeeChange(index, 'phone', e.target.value)}
                        placeholder="Phone Number"
                        disabled={isLoading}
                        className="input-field"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Registration...
                </span>
              ) : (
                'Complete Registration'
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ExhibitorRegistration;
