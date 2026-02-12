import React from 'react';
import BarcodeGenerator from './BarcodeGenerator';
import './VisitorSuccess.css';

const VisitorSuccess = ({ visitorData, onBack, onPrint }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleNewRegistration = () => {
    onBack();
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h2>Registration Successful!</h2>
          <p>Your visitor registration has been completed successfully.</p>
        </div>

        <div className="visitor-card">
          <div className="card-header">
            <h3>Visitor ID Card</h3>
            <span className="visitor-number">{visitorData.visitorNumber}</span>
          </div>

          <div className="card-body">
            <div className="visitor-info">
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{visitorData.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{visitorData.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{visitorData.phone}</span>
              </div>
              {visitorData.company && (
                <div className="info-row">
                  <span className="label">Company:</span>
                  <span className="value">{visitorData.company}</span>
                </div>
              )}
              <div className="info-row">
                <span className="label">Registration Date:</span>
                <span className="value">
                  {new Date(visitorData.registrationDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="barcode-section">
              <h4>Visitor Barcode</h4>
              <BarcodeGenerator 
                value={visitorData.visitorNumber} 
                width={2} 
                height={80} 
                displayValue={true}
              />
              <p className="barcode-note">
                Present this barcode at the entrance for quick check-in
              </p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="print-button" onClick={handlePrint}>
            🖨️ Print Card
          </button>
          <button className="new-registration-button" onClick={handleNewRegistration}>
            ← New Registration
          </button>
        </div>

        <div className="instructions">
          <h4>Next Steps:</h4>
          <ul>
            <li>Save or print this card for your records</li>
            <li>Present the barcode at the event entrance</li>
            <li>Keep your visitor number for future reference</li>
            <li>Check your email for confirmation details</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisitorSuccess;