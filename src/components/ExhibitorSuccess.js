import React from 'react';
import BarcodeGenerator from './BarcodeGenerator';
import './ExhibitorSuccess.css';

const ExhibitorSuccess = ({ exhibitorData, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleNewRegistration = () => {
    onBack();
  };

  return (
    <div className="exhibitor-success-container">
      <div className="success-card">
        <div className="success-header">
          <div className="success-icon">🏢</div>
          <h2>Exhibitor Registration Successful!</h2>
          <p>Your exhibitor registration has been submitted and is pending approval.</p>
        </div>

        <div className="exhibitor-card">
          <div className="card-header">
            <h3>Exhibitor Registration Details</h3>
            <div className="status-badges">
              <span className="exhibitor-number">{exhibitorData.exhibitorNumber}</span>
              <span className={`status-badge ${exhibitorData.status}`}>
                {exhibitorData.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="card-body">
            <div className="company-info">
              <h4>Company Information</h4>
              <div className="info-grid">
                <div className="info-row">
                  <span className="label">Company:</span>
                  <span className="value">{exhibitorData.companyName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Contact Person:</span>
                  <span className="value">{exhibitorData.contactPerson}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{exhibitorData.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{exhibitorData.phone}</span>
                </div>
                <div className="info-row">
                  <span className="label">Industry:</span>
                  <span className="value">{exhibitorData.industry}</span>
                </div>
                {exhibitorData.website && (
                  <div className="info-row">
                    <span className="label">Website:</span>
                    <span className="value">
                      <a href={exhibitorData.website} target="_blank" rel="noopener noreferrer">
                        {exhibitorData.website}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="booth-info">
              <h4>Booth Information</h4>
              <div className="booth-details">
                <div className="booth-item">
                  <span className="booth-label">Size:</span>
                  <span className="booth-value">{exhibitorData.boothSize.charAt(0).toUpperCase() + exhibitorData.boothSize.slice(1)}</span>
                </div>
                <div className="booth-item">
                  <span className="booth-label">Hall:</span>
                  <span className="booth-value">Hall {exhibitorData.hallNumber}</span>
                </div>
                <div className="booth-item">
                  <span className="booth-label">Amount:</span>
                  <span className="booth-value total-amount">${exhibitorData.totalAmount}</span>
                </div>
              </div>
            </div>

            {exhibitorData.employees && exhibitorData.employees.length > 0 && (
              <div className="employees-info">
                <h4>Registered Employees ({exhibitorData.employees.length})</h4>
                <div className="employees-list">
                  {exhibitorData.employees.map((employee, index) => (
                    <div key={index} className="employee-item">
                      <div className="employee-header">
                        <span className="employee-name">{employee.name}</span>
                        <span className="employee-number">{employee.employeeNumber}</span>
                      </div>
                      <div className="employee-details">
                        <span>{employee.position}</span>
                        <span>{employee.email}</span>
                        <span>{employee.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="barcode-section">
              <h4>Exhibitor Barcode</h4>
              <BarcodeGenerator 
                value={exhibitorData.exhibitorNumber} 
                width={2} 
                height={80} 
                displayValue={true}
              />
              <p className="barcode-note">
                Present this barcode for booth setup and event access
              </p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="print-button" onClick={handlePrint}>
            🖨️ Print Details
          </button>
          <button className="new-registration-button" onClick={handleNewRegistration}>
            ← New Registration
          </button>
        </div>

        <div className="instructions">
          <h4>Next Steps:</h4>
          <ul>
            <li>Your registration is currently <strong>pending approval</strong></li>
            <li>You will receive an email confirmation within 24 hours</li>
            <li>Payment instructions will be sent upon approval</li>
            <li>Booth setup details will be provided closer to the event</li>
            <li>Keep your exhibitor number for all future communications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorSuccess;