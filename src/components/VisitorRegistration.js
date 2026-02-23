import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBuilding, FaHeart, FaBriefcase } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import VisitorSuccess from './VisitorSuccess';
import { API_ENDPOINTS } from '../config/api';

const VisitorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    interests: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [visitorData, setVisitorData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number validation - only allow digits and limit to 11
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 11) {
        setFormData({
          ...formData,
          [name]: digitsOnly
        });
      }
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate phone number length
    if (formData.phone.length !== 11) {
      toast.error('Phone number must be exactly 11 digits');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.VISITORS_REGISTER, formData);
      
      if (response.data.visitor) {
        setVisitorData(response.data.visitor);
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
    setVisitorData(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      designation: '',
      interests: ''
    });
  };

  if (registrationSuccess && visitorData) {
    return (
      <VisitorSuccess 
        visitorData={visitorData} 
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Visitor Registration</h2>
            <p className="text-gray-600">Join us as a visitor and explore amazing exhibitions</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
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
                placeholder="Enter your email"
                disabled={isLoading}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaPhone className="inline mr-2" />
                Phone Number (11 digits) *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter 11 digit phone number"
                disabled={isLoading}
                pattern="\d{11}"
                maxLength="11"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.phone.length}/11 digits
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaBuilding className="inline mr-2" />
                Company/Organization
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter your company name (optional)"
                disabled={isLoading}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaBriefcase className="inline mr-2" />
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                placeholder="Enter your designation/job title"
                disabled={isLoading}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FaHeart className="inline mr-2" />
                Areas of Interest
              </label>
              <textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Tell us about your interests and what you'd like to see"
                rows="4"
                disabled={isLoading}
                className="input-field resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
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

export default VisitorRegistration;
