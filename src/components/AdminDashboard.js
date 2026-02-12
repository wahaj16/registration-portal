import React, { useState } from 'react';
import VisitorsList from './VisitorsList';
import ExhibitorsList from './ExhibitorsList';
import AdminStats from './AdminStats';
import './AdminDashboard.css';

const AdminDashboard = ({ onBack, admin }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHall, setSelectedHall] = useState(1);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'visitors', label: 'Visitors', icon: '👥' },
    { id: 'exhibitors', label: 'Exhibitors', icon: '🏢' },
    { id: 'halls', label: 'Halls', icon: '🏛️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminStats />;
      case 'visitors':
        return <VisitorsList />;
      case 'exhibitors':
        return <ExhibitorsList />;
      case 'halls':
        return (
          <div className="halls-view">
            <div className="hall-selector">
              <h3>Select Hall to View Exhibitors</h3>
              <div className="hall-buttons">
                {[1, 2, 3].map(hallNum => (
                  <button
                    key={hallNum}
                    className={`hall-button ${selectedHall === hallNum ? 'active' : ''}`}
                    onClick={() => setSelectedHall(hallNum)}
                  >
                    Hall {hallNum}
                  </button>
                ))}
              </div>
            </div>
            <ExhibitorsList hallNumber={selectedHall} />
          </div>
        );
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>← Logout</button>
          <div className="admin-title">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {admin?.name || 'Administrator'}</p>
          </div>
        </div>
        <div className="admin-info">
          <div className="admin-details">
            <span className="admin-name">{admin?.name}</span>
            <span className="admin-email">{admin?.email}</span>
            <span className={`admin-role ${admin?.role}`}>{admin?.role?.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="admin-avatar">
            {admin?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </div>

      <div className="dashboard-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;