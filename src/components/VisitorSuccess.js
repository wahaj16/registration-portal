import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBuilding, FaCalendar, FaBarcode, FaBriefcase } from 'react-icons/fa';
import BarcodeGenerator from './BarcodeGenerator';

const VisitorSuccess = ({ visitorData, onBack }) => {
  const handleNewRegistration = () => {
    onBack();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* Success Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <FaCheckCircle className="text-4xl text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 text-lg">Your visitor registration has been completed successfully.</p>
        </motion.div>

        {/* Visitor Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card mb-6"
        >
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 md:p-6 rounded-t-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-xl md:text-2xl font-bold">Visitor ID Card</h3>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm md:text-base font-semibold inline-block">
                {visitorData.visitorNumber}
              </span>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {/* Visitor Information */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 md:p-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">Personal Information</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaUser className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Name</span>
                    <span className="font-semibold text-gray-800 break-words">{visitorData.name}</span>
                  </div>
                </div>
                {visitorData.designation && (
                  <div className="flex items-start gap-3">
                    <FaBriefcase className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-600 block">Designation</span>
                      <span className="font-semibold text-gray-800 break-words">{visitorData.designation}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Email</span>
                    <span className="font-semibold text-gray-800 break-all">{visitorData.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Phone</span>
                    <span className="font-semibold text-gray-800">{visitorData.phone}</span>
                  </div>
                </div>
                {visitorData.company && (
                  <div className="flex items-start gap-3">
                    <FaBuilding className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-600 block">Company</span>
                      <span className="font-semibold text-gray-800 break-words">{visitorData.company}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <FaCalendar className="text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Registration Date</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(visitorData.registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barcode Section */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 md:p-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <FaBarcode className="text-gray-600" />
                Visitor Barcode
              </h4>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                <BarcodeGenerator 
                  value={visitorData.visitorNumber} 
                  width={2} 
                  height={80} 
                  displayValue={true}
                />
                <p className="text-sm text-gray-600 text-center mt-3">
                  Present this barcode at the entrance for quick check-in
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <button
            onClick={handleNewRegistration}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <FaArrowLeft />
            New Registration
          </button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-xl p-4 md:p-6"
        >
          <h4 className="font-bold text-gray-800 mb-4 text-lg">Next Steps:</h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">1.</span>
              <span>Save or print this card for your records</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">2.</span>
              <span>Present the barcode at the event entrance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">3.</span>
              <span>Keep your visitor number for future reference</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold flex-shrink-0">4.</span>
              <span>Check your email for confirmation details</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VisitorSuccess;
