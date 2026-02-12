import React, { useState } from 'react';
import axios from 'axios';
import ExhibitorSuccess from './ExhibitorSuccess';
import { API_ENDPOINTS } from '../config/api';
import './RegistrationForm.css';

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
  const [error, setError] = useState('');

  const boothPrices = {
    small: 500,
    medium: 800,
    large: 1200,
    premium: 1800
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleEmployeeChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;
    setEmployees(updatedEmployees);
  };

  const addEmployee = () => {
    setEmployees([...employees, { name: '', email: '', phone: '', position: '' }]);
  };

  const removeEmployee = (index) => {
    if (employees.length > 1) {
      const updatedEmployees = employees.filter((_, i) => i !== index);
      setEmployees(updatedEmployees);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Filter out empty employees
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

  // Show success page if registration is successful
  if (registrationSuccess && exhibitorData) {
    return (
      <ExhibitorSuccess 
        exhibitorData={exhibitorData} 
        onBack={handleBackToForm}
      />
    );
  }

  return (
    <div className="registration-form-container">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Exhibitor Registration</h2>
        <p>Showcase your business and connect with potential customers</p>
      </div>

      <form className="registration-form exhibitor-form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-section">
          <h3>Company Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Enter company name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Contact Person *</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                placeholder="Enter contact person name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
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
                placeholder="Enter phone number"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Industry *</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                placeholder="Enter your industry"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Booth Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Booth Size *</label>
              <select
                name="boothSize"
                value={formData.boothSize}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="small">Small (3x3m) - ${boothPrices.small}</option>
                <option value="medium">Medium (6x3m) - ${boothPrices.medium}</option>
                <option value="large">Large (6x6m) - ${boothPrices.large}</option>
                <option value="premium">Premium (9x6m) - ${boothPrices.premium}</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hall Number *</label>
              <select
                name="hallNumber"
                value={formData.hallNumber}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value={1}>Hall 1</option>
                <option value={2}>Hall 2</option>
                <option value={3}>Hall 3</option>
              </select>
            </div>
          </div>

          <div className="pricing-info">
            <p>Selected Booth: <strong>{formData.boothSize.charAt(0).toUpperCase() + formData.boothSize.slice(1)}</strong></p>
            <p>Total Amount: <strong>${boothPrices[formData.boothSize]}</strong></p>
          </div>
        </div>

        <div className="form-section">
          <h3>Company Description</h3>
          
          <div className="form-group">
            <label>Company Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your company and what you'll be showcasing"
              rows="4"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Special Requirements</label>
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              placeholder="Any special requirements for your booth (power, internet, etc.)"
              rows="3"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Employee Information</h3>
            <button 
              type="button" 
              className="add-employee-btn"
              onClick={addEmployee}
              disabled={isLoading}
            >
              + Add Employee
            </button>
          </div>
          
          {employees.map((employee, index) => (
            <div key={index} className="employee-card">
              <div className="employee-header">
                <h4>Employee {index + 1}</h4>
                {employees.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-employee-btn"
                    onClick={() => removeEmployee(index)}
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={employee.name}
                    onChange={(e) => handleEmployeeChange(index, 'name', e.target.value)}
                    placeholder="Enter employee name"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    value={employee.position}
                    onChange={(e) => handleEmployeeChange(index, 'position', e.target.value)}
                    placeholder="Enter position/title"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={employee.email}
                    onChange={(e) => handleEmployeeChange(index, 'email', e.target.value)}
                    placeholder="Enter email address"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={employee.phone}
                    onChange={(e) => handleEmployeeChange(index, 'phone', e.target.value)}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          className="submit-button exhibitor-submit"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
};

export default ExhibitorRegistration;