import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBuilding, FaEnvelope, FaPhone, FaGlobe, FaIndustry, FaWarehouse, FaDollarSign, FaTimes, FaBarcode, FaUsers, FaCheckCircle, FaClock, FaTimesCircle, FaFilter, FaPrint, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import BarcodeGenerator from './BarcodeGenerator';
import { API_ENDPOINTS } from '../config/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExhibitorsList = ({ hallNumber = null }) => {
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.error('Failed to load exhibitors');
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

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return { icon: FaCheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Approved' };
      case 'pending':
        return { icon: FaClock, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' };
      case 'rejected':
        return { icon: FaTimesCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Rejected' };
      default:
        return { icon: FaClock, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  const handlePrintCard = (exhibitor) => {
      const printWindow = window.open('', '_blank');
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Exhibitor Card - ${exhibitor.companyName}</title>
            <meta charset="UTF-8">
            <style>
              @page {
                size: 90mm 55mm;
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

              html {
                width: 90mm;
                height: 55mm;
              }

              body {
                width: 90mm;
                height: 55mm;
                margin: 0;
                padding: 0;
                font-family: 'Arial', sans-serif;
                background: white;
                overflow: hidden;
              }

              .card {
                width: 90mm;
                height: 55mm;
                background: white;
                position: relative;
                padding: 5mm;
                display: flex;
                flex-direction: column;
              }

              .header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 4mm;
              }

              .event-logo {
                width: 28mm;
                height: auto;
                max-height: 10mm;
                object-fit: contain;
              }

              .pfma-logo {
                width: 15mm;
                height: auto;
                max-height: 10mm;
                object-fit: contain;
              }

              .content {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                flex: 1;
                gap: 3mm;
              }

              .exhibitor-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
              }

              .exhibitor-name {
                font-size: 16px;
                font-weight: bold;
                color: #000;
                margin-bottom: 2mm;
                line-height: 1.1;
              }

              .exhibitor-contact {
                font-size: 13px;
                color: #333;
                font-weight: 500;
                margin-bottom: 1mm;
                line-height: 1.2;
              }

              .exhibitor-hall {
                font-size: 10px;
                color: #666;
                font-style: italic;
                line-height: 1.2;
              }

              .barcode-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                min-width: 22mm;
              }

              #barcode {
                display: block;
                width: 22mm;
                height: auto;
              }

              .barcode-section svg {
                width: 22mm !important;
                height: auto !important;
                display: block !important;
              }

              .barcode-section canvas {
                width: 22mm !important;
                height: auto !important;
                display: block !important;
              }

              .footer {
                position: absolute;
                bottom: 3mm;
                left: 0;
                right: 0;
                text-align: center;
                background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%);
                padding: 3mm 0;
              }

              .footer-text {
                font-size: 24px;
                font-weight: bold;
                color: white;
                letter-spacing: 8px;
                text-transform: uppercase;
              }

              @media print {
                @page {
                  size: 90mm 55mm;
                  margin: 0;
                }

                html {
                  width: 90mm;
                  height: 55mm;
                  margin: 0;
                  padding: 0;
                }

                body {
                  width: 90mm;
                  height: 55mm;
                  margin: 0 !important;
                  padding: 0 !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }

                * {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }

                .card {
                  page-break-inside: avoid;
                  page-break-after: avoid;
                  page-break-before: avoid;
                }
              }

              @media screen {
                body {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  background: #f0f0f0;
                }

                .card {
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <img src="${window.location.origin}/pfmmslogo.png" alt="Event Logo" class="event-logo" onerror="this.style.display='none'">
                <img src="${window.location.origin}/pfmalogo.jfif" alt="PFMA Logo" class="pfma-logo" onerror="this.style.display='none'">
              </div>

              <div class="content">
                <div class="exhibitor-info">
                  <div class="exhibitor-name">${exhibitor.companyName}</div>
                  <div class="exhibitor-contact">${exhibitor.contactPerson}</div>
                  <div class="exhibitor-hall">Hall ${exhibitor.hallNumber}</div>
                </div>

                <div class="barcode-section">
                  <svg id="barcode"></svg>
                </div>
              </div>

              <div class="footer">
                <div class="footer-text">EXHIBITOR</div>
              </div>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
            <script>
              window.onload = function() {
                try {
                  var barcodeElement = document.getElementById('barcode');
                  if (barcodeElement && typeof JsBarcode !== 'undefined') {
                    JsBarcode(barcodeElement, "${exhibitor.exhibitorNumber}", {
                      format: "CODE128",
                      width: 1.5,
                      height: 40,
                      displayValue: true,
                      fontSize: 10,
                      margin: 2,
                      marginTop: 5,
                      marginBottom: 5
                    });
                    console.log('Barcode generated successfully');
                  } else {
                    console.error('Barcode element or JsBarcode library not found');
                  }
                } catch(e) {
                  console.error('Barcode generation error:', e);
                  var barcodeElement = document.getElementById('barcode');
                  if (barcodeElement) {
                    barcodeElement.innerHTML = '<text style="font-size:10px;font-family:monospace;">${exhibitor.exhibitorNumber}</text>';
                  }
                }

                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 1000);
              };
            </script>
          </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();
    }

  const handlePrintEmployeeCard = (employee, exhibitor) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee Card - ${employee.name}</title>
          <meta charset="UTF-8">
          <style>
            @page {
              size: 90mm 55mm;
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
            
            html {
              width: 90mm;
              height: 55mm;
            }
            
            body {
              width: 90mm;
              height: 55mm;
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              background: white;
              overflow: hidden;
            }
            
            .card {
              width: 90mm;
              height: 55mm;
              background: white;
              position: relative;
              padding: 5mm;
              display: flex;
              flex-direction: column;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 4mm;
            }
            
            .event-logo {
              width: 28mm;
              height: auto;
              max-height: 10mm;
              object-fit: contain;
            }
            
            .pfma-logo {
              width: 15mm;
              height: auto;
              max-height: 10mm;
              object-fit: contain;
            }
            
            .content {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              flex: 1;
              gap: 3mm;
            }
            
            .employee-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
            }
            
            .employee-name {
              font-size: 16px;
              font-weight: bold;
              color: #000;
              margin-bottom: 2mm;
              line-height: 1.1;
            }
            
            .employee-company {
              font-size: 13px;
              color: #333;
              font-weight: 500;
              margin-bottom: 1mm;
              line-height: 1.2;
            }
            
            .employee-position {
              font-size: 10px;
              color: #666;
              font-style: italic;
              line-height: 1.2;
            }
            
            .barcode-section {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-start;
              min-width: 22mm;
            }
            
            #barcode {
              display: block;
              width: 22mm;
              height: auto;
            }
            
            .barcode-section svg {
              width: 22mm !important;
              height: auto !important;
              display: block !important;
            }
            
            .barcode-section canvas {
              width: 22mm !important;
              height: auto !important;
              display: block !important;
            }
            
            .footer {
              position: absolute;
              bottom: 3mm;
              left: 0;
              right: 0;
              text-align: center;
              background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%);
              padding: 3mm 0;
            }
            
            .footer-text {
              font-size: 24px;
              font-weight: bold;
              color: white;
              letter-spacing: 8px;
              text-transform: uppercase;
            }
            
            @media print {
              @page {
                size: 90mm 55mm;
                margin: 0;
              }
              
              html {
                width: 90mm;
                height: 55mm;
                margin: 0;
                padding: 0;
              }
              
              body {
                width: 90mm;
                height: 55mm;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .card {
                page-break-inside: avoid;
                page-break-after: avoid;
                page-break-before: avoid;
              }
            }
            
            @media screen {
              body {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: #f0f0f0;
              }
              
              .card {
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <img src="${window.location.origin}/pfmmslogo.png" alt="Event Logo" class="event-logo" onerror="this.style.display='none'">
              <img src="${window.location.origin}/pfmalogo.jfif" alt="PFMA Logo" class="pfma-logo" onerror="this.style.display='none'">
            </div>
            
            <div class="content">
              <div class="employee-info">
                <div class="employee-name">${employee.name}</div>
                <div class="employee-company">${exhibitor.companyName}</div>
                <div class="employee-position">${employee.position}</div>
              </div>
              
              <div class="barcode-section">
                <svg id="barcode"></svg>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-text">EXHIBITOR</div>
            </div>
          </div>
          
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            window.onload = function() {
              try {
                var barcodeElement = document.getElementById('barcode');
                if (barcodeElement && typeof JsBarcode !== 'undefined') {
                  JsBarcode(barcodeElement, "${employee.employeeNumber}", {
                    format: "CODE128",
                    width: 1.5,
                    height: 40,
                    displayValue: true,
                    fontSize: 10,
                    margin: 2,
                    marginTop: 5,
                    marginBottom: 5
                  });
                  console.log('Barcode generated successfully');
                } else {
                  console.error('Barcode element or JsBarcode library not found');
                }
              } catch(e) {
                console.error('Barcode generation error:', e);
                var barcodeElement = document.getElementById('barcode');
                if (barcodeElement) {
                  barcodeElement.innerHTML = '<text style="font-size:10px;font-family:monospace;">${employee.employeeNumber}</text>';
                }
              }
              
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 1000);
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text('Exhibitors Report', 14, 15);
      
      // Add date and filters
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
      doc.text(`Total Exhibitors: ${exhibitors.length}`, 14, 27);
      if (hallNumber) {
        doc.text(`Filtered by: Hall ${hallNumber}`, 14, 32);
      }
      
      // Prepare table data
      const tableData = exhibitors.map(exhibitor => [
        exhibitor.exhibitorNumber,
        exhibitor.companyName,
        exhibitor.contactPerson,
        exhibitor.email,
        exhibitor.phone,
        exhibitor.industry || 'N/A',
        `Hall ${exhibitor.hallNumber}`,
        exhibitor.employees?.length || 0,
        new Date(exhibitor.registrationDate).toLocaleDateString()
      ]);
      
      // Add table
      autoTable(doc, {
        startY: hallNumber ? 37 : 32,
        head: [['Exhibitor ID', 'Company', 'Contact Person', 'Email', 'Phone', 'Industry', 'Hall', 'Employees', 'Registration Date']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [147, 51, 234],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8,
          textColor: 50
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        margin: { top: 32, left: 14, right: 14 },
        styles: {
          cellPadding: 3,
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        columnStyles: {
          0: { cellWidth: 28 },
          1: { cellWidth: 40 },
          2: { cellWidth: 35 },
          3: { cellWidth: 45 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
          6: { cellWidth: 18 },
          7: { cellWidth: 20 },
          8: { cellWidth: 30 }
        }
      });
      
      // Save the PDF
      const filename = hallNumber 
        ? `exhibitors-hall${hallNumber}-report-${new Date().toISOString().split('T')[0]}.pdf`
        : `exhibitors-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      toast.success('PDF exported successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exhibitors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {hallNumber ? `Hall ${hallNumber} Exhibitors` : 'All Exhibitors'}
              </h2>
              <p className="text-gray-600">Total: {filteredExhibitors.length} exhibitors</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <FaFilePdf /> Export PDF Report
              </button>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exhibitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none bg-white w-full sm:w-80"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-600">Filters:</span>
            </div>
            {!hallNumber && (
              <select
                value={filterHall}
                onChange={(e) => setFilterHall(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none bg-white text-sm"
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
              className="px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none bg-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exhibitors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitors.map((exhibitor, index) => {
          const statusConfig = getStatusConfig(exhibitor.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <motion.div
              key={exhibitor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-effect rounded-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedExhibitor(exhibitor)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {exhibitor.companyName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {exhibitor.exhibitorNumber}
                  </span>
                  <span className={`px-3 py-1 ${statusConfig.bg} ${statusConfig.color} rounded-full text-xs font-semibold flex items-center gap-1`}>
                    <StatusIcon className="text-xs" />
                    {statusConfig.label}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                {exhibitor.companyName}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-gray-400" />
                  <span className="truncate">{exhibitor.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaIndustry className="text-gray-400" />
                  <span className="truncate">{exhibitor.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWarehouse className="text-gray-400" />
                  <span>Hall {exhibitor.hallNumber} • {exhibitor.boothSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-gray-400" />
                  <span className="font-semibold text-purple-600">${exhibitor.totalAmount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-gray-400" />
                  <span>{exhibitor.employees?.length || 0} employees</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all group-hover:scale-105">
                View Details
              </button>
            </motion.div>
          );
        })}
      </div>

      {filteredExhibitors.length === 0 && (
        <div className="glass-effect rounded-xl p-12 text-center">
          <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No exhibitors found matching your criteria.</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedExhibitor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedExhibitor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
                      {selectedExhibitor.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedExhibitor.companyName}</h2>
                      <p className="text-purple-100">{selectedExhibitor.exhibitorNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedExhibitor(null)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Company Information */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBuilding className="text-purple-600" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Company Name</label>
                      <p className="text-gray-800 font-medium">{selectedExhibitor.companyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Exhibitor Number</label>
                      <p className="text-gray-800 font-medium">{selectedExhibitor.exhibitorNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Contact Person</label>
                      <p className="text-gray-800 font-medium">{selectedExhibitor.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                        <FaEnvelope className="text-xs" /> Email
                      </label>
                      <p className="text-gray-800 font-medium break-all">{selectedExhibitor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                        <FaPhone className="text-xs" /> Phone
                      </label>
                      <p className="text-gray-800 font-medium">{selectedExhibitor.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                        <FaIndustry className="text-xs" /> Industry
                      </label>
                      <p className="text-gray-800 font-medium">{selectedExhibitor.industry}</p>
                    </div>
                    {selectedExhibitor.website && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                          <FaGlobe className="text-xs" /> Website
                        </label>
                        <a 
                          href={selectedExhibitor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 font-medium underline"
                        >
                          {selectedExhibitor.website}
                        </a>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {(() => {
                          const statusConfig = getStatusConfig(selectedExhibitor.status);
                          const StatusIcon = statusConfig.icon;
                          return (
                            <>
                              <StatusIcon className={statusConfig.color} />
                              <span className={`px-3 py-1 ${statusConfig.bg} ${statusConfig.color} rounded-full text-sm font-semibold`}>
                                {statusConfig.label}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booth Information */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaWarehouse className="text-blue-600" />
                    Booth Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                      <label className="text-sm font-semibold text-gray-600">Hall Number</label>
                      <p className="text-2xl font-bold text-blue-600">Hall {selectedExhibitor.hallNumber}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                      <label className="text-sm font-semibold text-gray-600">Booth Size</label>
                      <p className="text-2xl font-bold text-blue-600 capitalize">{selectedExhibitor.boothSize}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                      <label className="text-sm font-semibold text-gray-600">Total Amount</label>
                      <p className="text-2xl font-bold text-green-600">${selectedExhibitor.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Company Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedExhibitor.description}</p>
                </div>

                {/* Special Requirements */}
                {selectedExhibitor.specialRequirements && (
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Special Requirements</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedExhibitor.specialRequirements}</p>
                  </div>
                )}

                {/* Employees */}
                {selectedExhibitor.employees && selectedExhibitor.employees.length > 0 && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaUsers className="text-indigo-600" />
                      Employees ({selectedExhibitor.employees.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedExhibitor.employees.map((employee, index) => (
                        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-indigo-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {employee.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800">{employee.name}</h4>
                                <p className="text-sm text-gray-600">{employee.position}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePrintEmployeeCard(employee, selectedExhibitor)}
                              className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all"
                              title="Print Employee Card"
                            >
                              <FaPrint />
                            </button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <FaEnvelope className="text-xs" />
                              {employee.email}
                            </p>
                            <p className="flex items-center gap-2">
                              <FaPhone className="text-xs" />
                              {employee.phone}
                            </p>
                            <p className="text-xs text-gray-500">ID: {employee.employeeNumber}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Barcode */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBarcode className="text-gray-600" />
                    Exhibitor Barcode
                  </h3>
                  <div className="bg-white rounded-lg p-6 flex justify-center border-2 border-dashed border-gray-300">
                    <BarcodeGenerator 
                      value={selectedExhibitor.exhibitorNumber} 
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
                    onClick={() => handlePrintCard(selectedExhibitor)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaPrint /> Print Exhibitor Card
                  </button>
                  <button
                    onClick={() => setSelectedExhibitor(null)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
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

export default ExhibitorsList;
