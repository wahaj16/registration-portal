import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaTimes, FaBarcode, FaCheckCircle, FaPrint, FaBriefcase } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import BarcodeGenerator from './BarcodeGenerator';
import { API_ENDPOINTS } from '../config/api';

const VisitorsList = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.error('Failed to load visitors');
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

  const handlePrintCard = (visitor) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Visitor Card - ${visitor.name}</title>
          <meta charset="UTF-8">
          <style>
            @page {
              size: 3.5in 5in;
              margin: 0;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            
            html, body {
              width: 3.5in;
              height: 5in;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            .card {
              width: 3.2in;
              height: 4.7in;
              background: white;
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
              text-align: center;
            }
            
            .header {
              width: 100%;
              padding: 15px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              margin-bottom: 20px;
            }
            
            .header h1 {
              color: white;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            
            .header p {
              color: rgba(255,255,255,0.9);
              font-size: 11px;
            }
            
            .avatar {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 36px;
              font-weight: bold;
              margin-bottom: 15px;
              border: 4px solid #f0f0f0;
            }
            
            .name {
              font-size: 22px;
              font-weight: bold;
              color: #333;
              margin-bottom: 8px;
              line-height: 1.2;
            }
            
            .company {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
              font-weight: 500;
            }
            
            .designation {
              font-size: 12px;
              color: #888;
              margin-bottom: 15px;
              font-style: italic;
            }
            
            .visitor-number {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            
            .barcode-section {
              margin-top: auto;
              padding-top: 15px;
              border-top: 2px dashed #e0e0e0;
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .barcode-section svg {
              max-width: 100%;
              height: auto;
            }
            
            .footer {
              margin-top: 10px;
              font-size: 9px;
              color: #999;
            }
            
            @media print {
              html, body {
                width: 3.5in;
                height: 5in;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
              
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>VISITOR PASS</h1>
              <p>Registration Portal</p>
            </div>
            
            <div class="avatar">
              ${visitor.name.charAt(0).toUpperCase()}
            </div>
            
            <div class="name">${visitor.name}</div>
            
            ${visitor.company ? `<div class="company"><strong>${visitor.company}</strong></div>` : ''}
            
            ${visitor.designation ? `<div class="designation">${visitor.designation}</div>` : '<div class="designation">Visitor</div>'}
            
            <div class="visitor-number">${visitor.visitorNumber}</div>
            
            <div class="barcode-section">
              <div id="barcode"></div>
              <div class="footer">Scan for verification</div>
            </div>
          </div>
          
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            window.onload = function() {
              JsBarcode("#barcode", "${visitor.visitorNumber}", {
                format: "CODE128",
                width: 1.5,
                height: 50,
                displayValue: true,
                fontSize: 12,
                margin: 5
              });
              
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visitors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registered Visitors</h2>
            <p className="text-gray-600">Total: {visitors.length} visitors</p>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search visitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Visitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisitors.map((visitor, index) => (
          <motion.div
            key={visitor._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-effect rounded-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedVisitor(visitor)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {visitor.name.charAt(0).toUpperCase()}
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {visitor.visitorNumber}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
              {visitor.name}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                <span className="truncate">{visitor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-gray-400" />
                <span>{visitor.phone}</span>
              </div>
              {visitor.company && (
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-gray-400" />
                  <span className="truncate">{visitor.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaCalendar className="text-gray-400" />
                <span>{new Date(visitor.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>

            <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all group-hover:scale-105">
              View Details
            </button>
          </motion.div>
        ))}
      </div>

      {filteredVisitors.length === 0 && (
        <div className="glass-effect rounded-xl p-12 text-center">
          <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No visitors found matching your search.</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedVisitor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVisitor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
                      {selectedVisitor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Visitor Details</h2>
                      <p className="text-blue-100">{selectedVisitor.visitorNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVisitor(null)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Full Name</label>
                      <p className="text-gray-800 font-medium">{selectedVisitor.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Visitor Number</label>
                      <p className="text-gray-800 font-medium">{selectedVisitor.visitorNumber}</p>
                    </div>
                    {selectedVisitor.designation && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                          <FaBriefcase className="text-xs" /> Designation
                        </label>
                        <p className="text-gray-800 font-medium">{selectedVisitor.designation}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                        <FaEnvelope className="text-xs" /> Email
                      </label>
                      <p className="text-gray-800 font-medium break-all">{selectedVisitor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                        <FaPhone className="text-xs" /> Phone
                      </label>
                      <p className="text-gray-800 font-medium">{selectedVisitor.phone}</p>
                    </div>
                    {selectedVisitor.company && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                          <FaBuilding className="text-xs" /> Company
                        </label>
                        <p className="text-gray-800 font-medium">{selectedVisitor.company}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                        <FaCalendar className="text-xs" /> Registration Date
                      </label>
                      <p className="text-gray-800 font-medium">
                        {new Date(selectedVisitor.registrationDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        <FaCheckCircle className="text-green-500" />
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {selectedVisitor.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                {selectedVisitor.interests && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Areas of Interest</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedVisitor.interests}</p>
                  </div>
                )}

                {/* Barcode */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBarcode className="text-gray-600" />
                    Visitor Barcode
                  </h3>
                  <div className="bg-white rounded-lg p-6 flex justify-center border-2 border-dashed border-gray-300">
                    <BarcodeGenerator 
                      value={selectedVisitor.visitorNumber} 
                      width={2} 
                      height={80} 
                      displayValue={true}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePrintCard(selectedVisitor)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaPrint /> Print Visitor Card
                  </button>
                  <button
                    onClick={() => setSelectedVisitor(null)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisitorsList;
