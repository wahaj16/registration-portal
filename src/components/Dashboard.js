import React, { useState } from 'react';
import VisitorRegistration from './VisitorRegistration';
import ExhibitorRegistration from './ExhibitorRegistration';
import AdminAuth from './AdminAuth';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleRegistration = (type) => {
    setCurrentView(type.toLowerCase());
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'visitor') {
    return <VisitorRegistration onBack={handleBack} />;
  }

  if (currentView === 'exhibitor') {
    return <ExhibitorRegistration onBack={handleBack} />;
  }

  if (currentView === 'administrator') {
    return <AdminAuth onBack={handleBack} />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Registration Portal</h1>
        <p className="dashboard-subtitle">
          Welcome to our comprehensive registration system. Choose your registration type below to get started.
        </p>
      </div>

      <div className="registration-options">
        {/* Visitor Registration */}
        <div 
          className="registration-card visitor-card"
          onClick={() => handleRegistration('Visitor')}
        >
          <div className="card-icon">
            👥
          </div>
          <h3 className="card-title">Visitor Registration</h3>
          <p className="card-description">
            Register as a visitor to explore exhibitions, attend events, and network with industry professionals. 
            Get access to all public areas and activities.
          </p>
          <button className="card-button">
            Register as Visitor
          </button>
        </div>

        {/* Exhibitor Registration */}
        <div 
          className="registration-card exhibitor-card"
          onClick={() => handleRegistration('Exhibitor')}
        >
          <div className="card-icon">
            🏢
          </div>
          <h3 className="card-title">Exhibitor Registration</h3>
          <p className="card-description">
            Register as an exhibitor to showcase your products and services. 
            Get booth space, promotional opportunities, and direct access to potential customers.
          </p>
          <button className="card-button">
            Register as Exhibitor
          </button>
        </div>

        {/* Administrator Access */}
        <div 
          className="registration-card admin-card"
          onClick={() => handleRegistration('Administrator')}
        >
          <div className="card-icon">
            ⚙️
          </div>
          <h3 className="card-title">Administrator</h3>
          <p className="card-description">
            Administrative access for managing registrations, monitoring activities, 
            and overseeing the entire registration system and event operations.
          </p>
          <button className="card-button">
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;