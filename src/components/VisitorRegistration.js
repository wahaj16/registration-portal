import React, { useState } from 'react';
import axios from 'axios';
import VisitorSuccess from './VisitorSuccess';
import { API_ENDPOINTS } from '../config/api';
import './RegistrationForm.css';

const VisitorRegistration = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interests: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [visitorData, setVisitorData] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(API_ENDPOINTS.VISITORS_REGISTER, formData);
      
      if (response.data.visitor) {
        setVisitorData(response.data.visitor);
        setRegistrationSuccess(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
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
      interests: ''
    });
  };

  // Show success page if registration is successful
  if (registrationSuccess && visitorData) {
    return (
      <VisitorSuccess 
        visitorData={visitorData} 
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <div className="registration-form-container">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Visitor Registration</h2>
        <p>Join us as a visitor and explore amazing exhibitions</p>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Company/Organization</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter your company name (optional)"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Areas of Interest</label>
          <textarea
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Tell us about your interests and what you'd like to see"
            rows="4"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button visitor-submit"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
};

export default VisitorRegistration;