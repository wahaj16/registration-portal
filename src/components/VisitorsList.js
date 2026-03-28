import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaTimes, FaBarcode, FaCheckCircle, FaPrint, FaBriefcase, FaFilePdf, FaSync } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import BarcodeGenerator from './BarcodeGenerator';
import { API_ENDPOINTS } from '../config/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

const VisitorsList = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // debounced input
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [lastProcessedBarcode, setLastProcessedBarcode] = useState('');
  const [checkInSearch, setCheckInSearch] = useState('');
  const [lastCheckedInBarcode, setLastCheckedInBarcode] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const isFetchingRef = React.useRef(false);
  const searchDebounceRef = React.useRef(null);

  useEffect(() => {
    fetchVisitors(1, searchTerm, false);
    const interval = setInterval(() => {
      fetchVisitors(pagination.page, searchTerm, true);
    }, 3000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search input - wait 400ms before firing server request
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    
    // Check if it's a barcode scan (instant, no debounce)
    const trimmed = searchInput.trim().toUpperCase();
    const visitorNumberPattern = /^VIS\d{6}$/;
    
    if (visitorNumberPattern.test(trimmed)) {
      setSearchTerm(trimmed);
      fetchVisitors(1, trimmed, false);
      return;
    }
    
    searchDebounceRef.current = setTimeout(() => {
      setSearchTerm(searchInput);
      fetchVisitors(1, searchInput, false);
    }, 400);
    
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-download card when barcode is scanned
  useEffect(() => {
    const trimmedSearch = searchTerm.trim().toUpperCase();
    const visitorNumberPattern = /^VIS\d{6}$/;
    
    if (visitorNumberPattern.test(trimmedSearch) && trimmedSearch !== lastProcessedBarcode) {
      const visitor = visitors.find(v => v.visitorNumber.toUpperCase() === trimmedSearch);
      
      if (visitor) {
        setLastProcessedBarcode(trimmedSearch);
        handlePrintCard(visitor);
        toast.success(`Card downloaded for ${visitor.name}`);
      } else {
        // Visitor not in current page - fetch by exact number
        fetchVisitors(1, trimmedSearch, false);
      }
    }
  }, [searchTerm, visitors, lastProcessedBarcode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCheckIn = useCallback(async (visitorNumber) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.VISITORS_CHECKIN}/${visitorNumber}`);
      
      if (response.data.visitor) {
        const visitor = response.data.visitor;
        const checkInTime = new Date(visitor.checkInTime).toLocaleString();
        
        toast.success(
          <div>
            <div className="font-bold">{visitor.name} checked in!</div>
            <div className="text-sm">{checkInTime}</div>
          </div>,
          { duration: 5000 }
        );
        
        fetchVisitors(pagination.page, searchTerm, true);
        
        setTimeout(() => {
          setCheckInSearch('');
        }, 2000);
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast.error(error.response?.data?.message || 'Failed to check in visitor');
    }
  }, [pagination.page, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto check-in when QR code is scanned
  useEffect(() => {
    const trimmedCheckIn = checkInSearch.trim().toUpperCase();
    const visitorNumberPattern = /^VIS\d{6}$/;
    
    if (visitorNumberPattern.test(trimmedCheckIn) && trimmedCheckIn !== lastCheckedInBarcode) {
      setLastCheckedInBarcode(trimmedCheckIn);
      handleCheckIn(trimmedCheckIn);
    }
  }, [checkInSearch, lastCheckedInBarcode, handleCheckIn]);

  const fetchVisitors = async (page = 1, search = '', silent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      if (!silent) setLoading(true);
      const response = await axios.get(API_ENDPOINTS.VISITORS_LIST, {
        params: { page, limit: 50, search }
      });
      setVisitors(response.data.visitors);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      if (!silent) toast.error('Failed to load visitors');
    } finally {
      if (!silent) setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const filteredVisitors = visitors; // filtering is now server-side

  const handlePrintCard = async (visitor) => {
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size (340px x 207px = 90mm x 55mm at 96 DPI)
      canvas.width = 340 * 3; // 3x for high resolution
      canvas.height = 207 * 3;
      
      // Scale context for high resolution
      ctx.scale(3, 3);
      
      // Fill background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 340, 207);
      
      // Load and draw logos
      const eventLogo = new Image();
      const pfmaLogo = new Image();
      
      eventLogo.src = `${window.location.origin}/pfmmslogo.PNG`;
      pfmaLogo.src = `${window.location.origin}/pfmalogo.jfif`;
      
      await Promise.all([
        new Promise((resolve) => {
          eventLogo.onload = resolve;
          eventLogo.onerror = resolve;
        }),
        new Promise((resolve) => {
          pfmaLogo.onload = resolve;
          pfmaLogo.onerror = resolve;
        })
      ]);
      
      // Draw event logo (left)
      if (eventLogo.complete && eventLogo.naturalWidth > 0) {
        ctx.drawImage(eventLogo, 19, 19, 106, 38);
      }
      
      // Draw PFMA logo (right)
      if (pfmaLogo.complete && pfmaLogo.naturalWidth > 0) {
        ctx.drawImage(pfmaLogo, 340 - 19 - 57, 19, 57, 38);
      }
      
      // Draw visitor info
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(visitor.name, 19, 80);
      
      let yPos = 95;
      if (visitor.company) {
        ctx.fillStyle = '#333333';
        ctx.font = '500 13px Arial';
        ctx.fillText(visitor.company, 19, yPos);
        yPos += 18;
      }
      
      if (visitor.designation) {
        ctx.fillStyle = '#666666';
        ctx.font = 'italic 10px Arial';
        ctx.fillText(visitor.designation, 19, yPos);
      }
      
      // Generate QR code
      const qrCodeDataUrl = await QRCode.toDataURL(visitor.visitorNumber, {
        width: 80,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      // Load QR code image
      const qrImg = new Image();
      qrImg.src = qrCodeDataUrl;
      
      await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.onerror = resolve;
      });
      
      // Draw QR code on right side
      ctx.drawImage(qrImg, 340 - 19 - 80, 70, 80, 80);
      
      // Draw footer gradient
      const gradient = ctx.createLinearGradient(0, 207 - 11 - 33, 340, 207 - 11 - 33);
      gradient.addColorStop(0, '#8B4789');
      gradient.addColorStop(1, '#6B3E6A');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 207 - 11 - 33, 340, 33);
      
      // Draw footer text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.letterSpacing = '8px';
      ctx.textAlign = 'center';
      ctx.fillText('VISITOR', 170, 207 - 11 - 33 + 24);
      
      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to generate card image');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `visitor-card-${visitor.visitorNumber}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        
        toast.success(`Card downloaded: ${visitor.name}`);
      }, 'image/png');
      
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error(`Failed to generate card: ${error.message}`);
    }
  }

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text('Visitors Report', 14, 15);
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
      doc.text(`Total Visitors: ${visitors.length}`, 14, 27);
      
      // Prepare table data
      const tableData = visitors.map(visitor => [
        visitor.visitorNumber,
        visitor.name,
        visitor.designation || 'N/A',
        visitor.email,
        visitor.phone,
        visitor.company || 'N/A',
        new Date(visitor.registrationDate).toLocaleDateString(),
        visitor.status?.toUpperCase() || 'ACTIVE'
      ]);
      
      // Add table
      autoTable(doc, {
        startY: 32,
        head: [['Visitor ID', 'Name', 'Designation', 'Email', 'Phone', 'Company', 'Registration Date', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [102, 126, 234],
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
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 30 },
          3: { cellWidth: 45 },
          4: { cellWidth: 25 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
          7: { cellWidth: 20 }
        }
      });
      
      // Save the PDF
      doc.save(`visitors-report-${new Date().toISOString().split('T')[0]}.pdf`);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visitors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="glass-effect rounded-xl p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaUser className="inline mr-2" />
            Visitors List
          </button>
          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'checkin'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCheckCircle className="inline mr-2" />
            Check-In
          </button>
        </div>
      </div>

      {/* Check-In Tab Content */}
      {activeTab === 'checkin' && (
        <>
          {/* Check-In Section */}
          <div className="glass-effect rounded-xl p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Visitor Check-In
                </h3>
                <p className="text-gray-600 text-sm">Scan QR code to record check-in time</p>
              </div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
                <input
                  type="text"
                  placeholder="Scan QR code here..."
                  value={checkInSearch}
                  onChange={(e) => setCheckInSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border-2 border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none bg-white w-full sm:w-80 font-mono"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Checked-In Visitors Table */}
          {visitors.filter(v => v.checkInTime).length > 0 ? (
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Checked-In Visitors ({visitors.filter(v => v.checkInTime).length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Visitor ID</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Company</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Designation</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Check-In Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors
                      .filter(v => v.checkInTime)
                      .sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime))
                      .map((visitor, index) => (
                        <tr 
                          key={visitor._id}
                          className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-4 py-3 text-sm font-mono text-gray-800">{visitor.visitorNumber}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">{visitor.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{visitor.company || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{visitor.designation || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{visitor.phone}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-700">
                            {new Date(visitor.checkInTime).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-effect rounded-xl p-12 text-center">
              <FaCheckCircle className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No visitors have checked in yet.</p>
              <p className="text-gray-500 text-sm mt-2">Scan a visitor QR code above to record check-in.</p>
            </div>
          )}
        </>
      )}

      {/* Visitors List Tab Content */}
      {activeTab === 'list' && (
        <>
          {/* Header */}
          <div className="glass-effect rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Registered Visitors</h2>
                <p className="text-gray-600">Total: {pagination.total} visitors</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={fetchVisitors}                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <FaSync className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <FaFilePdf /> Export PDF Report
                </button>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search visitors..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white w-full sm:w-80"
                  />
                </div>
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="glass-effect rounded-xl p-4 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages} &nbsp;·&nbsp; {pagination.total} total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchVisitors(pagination.page - 1, searchTerm, false)}
                  disabled={pagination.page <= 1 || loading}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold disabled:opacity-40 hover:bg-blue-600 transition-all"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => fetchVisitors(pagination.page + 1, searchTerm, false)}
                  disabled={pagination.page >= pagination.totalPages || loading}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold disabled:opacity-40 hover:bg-blue-600 transition-all"
                >
                  Next →
                </button>
              </div>
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
        </>
      )}
    </div>
  );
};

export default VisitorsList;
