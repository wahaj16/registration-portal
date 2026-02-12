import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarcodeGenerator from './BarcodeGenerator';
import { API_ENDPOINTS } from '../config/api';

const ExhibitorsList = ({ hallNumber = null }) => {
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [filterHall, setFilterHall] = useState(hallNumber || 'all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchExhibitors();
  }, []);

  useEffect(() => {
    if (hallNumber) {
      setFilterHall(hallNumber);
    }
  }, [hallNumber]);

  const fetchExhibitors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.EXHIBITORS_LIST);
      setExhibitors(response.data.exhibitors);
    } catch (error) {
      console.error('Error fetching exhibitors:', error);
      setError('Failed to load exhibitors');
    } finally {
      setLoading(false);
    }
  };

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesSearch = 
      exhibitor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibitor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibitor.exhibitorNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibitor.industry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHall = filterHall === 'all' || exhibitor.hallNumber === parseInt(filterHall);
    const matchesStatus = filterStatus === 'all' || exhibitor.status === filterStatus;

    return matchesSearch && matchesHall && matchesStatus;
  });

  const handleViewDetails = (exhibitor) => {
    setSelectedExhibitor(exhibitor);
  };

  const closeModal = () => {
    setSelectedExhibitor(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'pending': return '#ffc107';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading exhibitors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchExhibitors} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="exhibitors-list">
      <div className="list-header">
        <h2>
          {hallNumber ? `Hall ${hallNumber} Exhibitors` : 'All Exhibitors'} 
          ({filteredExhibitors.length})
        </h2>
        <div className="filters-container">
          <input
            type="text"
            placeholder="Search exhibitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {!hallNumber && (
            <select
              value={filterHall}
              onChange={(e) => setFilterHall(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Halls</option>
              <option value="1">Hall 1</option>
              <option value="2">Hall 2</option>
              <option value="3">Hall 3</option>
            </select>
          )}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="exhibitors-grid">
        {filteredExhibitors.map(exhibitor => (
          <div key={exhibitor._id} className="exhibitor-card">
            <div className="exhibitor-header">
              <h3>{exhibitor.companyName}</h3>
              <div className="exhibitor-badges">
                <span className="exhibitor-number">{exhibitor.exhibitorNumber}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(exhibitor.status) }}
                >
                  {exhibitor.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="exhibitor-info">
              <p><strong>Contact:</strong> {exhibitor.contactPerson}</p>
              <p><strong>Industry:</strong> {exhibitor.industry}</p>
              <p><strong>Hall:</strong> {exhibitor.hallNumber}</p>
              <p><strong>Booth Size:</strong> {exhibitor.boothSize.charAt(0).toUpperCase() + exhibitor.boothSize.slice(1)}</p>
              <p><strong>Amount:</strong> ${exhibitor.totalAmount}</p>
              <p><strong>Employees:</strong> {exhibitor.employees?.length || 0}</p>
            </div>
            <div className="exhibitor-actions">
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(exhibitor)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExhibitors.length === 0 && (
        <div className="no-results">
          <p>No exhibitors found matching your criteria.</p>
        </div>
      )}

      {/* Exhibitor Details Modal */}
      {selectedExhibitor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Exhibitor Details</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="exhibitor-details">
                <div className="detail-section">
                  <h3>Company Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Company Name:</label>
                      <span>{selectedExhibitor.companyName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Exhibitor Number:</label>
                      <span>{selectedExhibitor.exhibitorNumber}</span>
                    </div>
                    <div className="detail-item">
                      <label>Contact Person:</label>
                      <span>{selectedExhibitor.contactPerson}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedExhibitor.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedExhibitor.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Industry:</label>
                      <span>{selectedExhibitor.industry}</span>
                    </div>
                    {selectedExhibitor.website && (
                      <div className="detail-item">
                        <label>Website:</label>
                        <span>
                          <a href={selectedExhibitor.website} target="_blank" rel="noopener noreferrer">
                            {selectedExhibitor.website}
                          </a>
                        </span>
                      </div>
                    )}
                    <div className="detail-item">
                      <label>Status:</label>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(selectedExhibitor.status) }}
                      >
                        {selectedExhibitor.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Booth Information</h3>
                  <div className="booth-info-grid">
                    <div className="booth-info-item">
                      <label>Hall Number:</label>
                      <span>Hall {selectedExhibitor.hallNumber}</span>
                    </div>
                    <div className="booth-info-item">
                      <label>Booth Size:</label>
                      <span>{selectedExhibitor.boothSize.charAt(0).toUpperCase() + selectedExhibitor.boothSize.slice(1)}</span>
                    </div>
                    <div className="booth-info-item">
                      <label>Total Amount:</label>
                      <span className="amount">${selectedExhibitor.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{selectedExhibitor.description}</p>
                </div>

                {selectedExhibitor.specialRequirements && (
                  <div className="detail-section">
                    <h3>Special Requirements</h3>
                    <p>{selectedExhibitor.specialRequirements}</p>
                  </div>
                )}

                {selectedExhibitor.employees && selectedExhibitor.employees.length > 0 && (
                  <div className="detail-section">
                    <h3>Employees ({selectedExhibitor.employees.length})</h3>
                    <div className="employees-grid">
                      {selectedExhibitor.employees.map((employee, index) => (
                        <div key={index} className="employee-card">
                          <h4>{employee.name}</h4>
                          <p><strong>Position:</strong> {employee.position}</p>
                          <p><strong>Email:</strong> {employee.email}</p>
                          <p><strong>Phone:</strong> {employee.phone}</p>
                          <p><strong>Employee ID:</strong> {employee.employeeNumber}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Exhibitor Barcode</h3>
                  <div className="barcode-container">
                    <BarcodeGenerator 
                      value={selectedExhibitor.exhibitorNumber} 
                      width={2} 
                      height={60} 
                      displayValue={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitorsList;