import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarcodeGenerator from './BarcodeGenerator';
import { API_ENDPOINTS } from '../config/api';

const VisitorsList = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.VISITORS_LIST);
      setVisitors(response.data.visitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      setError('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  const filteredVisitors = visitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.visitorNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visitor.company && visitor.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (visitor) => {
    setSelectedVisitor(visitor);
  };

  const closeModal = () => {
    setSelectedVisitor(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading visitors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchVisitors} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="visitors-list">
      <div className="list-header">
        <h2>Registered Visitors ({visitors.length})</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="visitors-grid">
        {filteredVisitors.map(visitor => (
          <div key={visitor._id} className="visitor-card">
            <div className="visitor-header">
              <h3>{visitor.name}</h3>
              <span className="visitor-number">{visitor.visitorNumber}</span>
            </div>
            <div className="visitor-info">
              <p><strong>Email:</strong> {visitor.email}</p>
              <p><strong>Phone:</strong> {visitor.phone}</p>
              {visitor.company && <p><strong>Company:</strong> {visitor.company}</p>}
              <p><strong>Registered:</strong> {new Date(visitor.registrationDate).toLocaleDateString()}</p>
            </div>
            <div className="visitor-actions">
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(visitor)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVisitors.length === 0 && (
        <div className="no-results">
          <p>No visitors found matching your search.</p>
        </div>
      )}

      {/* Visitor Details Modal */}
      {selectedVisitor && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Visitor Details</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="visitor-details">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>{selectedVisitor.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Visitor Number:</label>
                      <span>{selectedVisitor.visitorNumber}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedVisitor.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Phone:</label>
                      <span>{selectedVisitor.phone}</span>
                    </div>
                    {selectedVisitor.company && (
                      <div className="detail-item">
                        <label>Company:</label>
                        <span>{selectedVisitor.company}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <label>Registration Date:</label>
                      <span>{new Date(selectedVisitor.registrationDate).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className={`status ${selectedVisitor.status}`}>
                        {selectedVisitor.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedVisitor.interests && (
                  <div className="detail-section">
                    <h3>Interests</h3>
                    <p>{selectedVisitor.interests}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Visitor Barcode</h3>
                  <div className="barcode-container">
                    <BarcodeGenerator 
                      value={selectedVisitor.visitorNumber} 
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

export default VisitorsList;