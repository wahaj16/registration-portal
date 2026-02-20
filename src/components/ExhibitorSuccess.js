import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPrint, FaArrowLeft, FaBuilding, FaUser, FaEnvelope, FaPhone, FaIndustry, FaGlobe, FaWarehouse, FaBarcode, FaUsers } from 'react-icons/fa';
import BarcodeGenerator from './BarcodeGenerator';

const ExhibitorSuccess = ({ exhibitorData, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleNewRegistration = () => {
    onBack();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
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
            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <FaCheckCircle className="text-4xl text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Exhibitor Registration Successful!</h2>
          <p className="text-gray-600 text-lg">Your exhibitor registration has been submitted and is pending approval.</p>
        </motion.div>

        {/* Exhibitor Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card mb-6"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 md:p-6 rounded-t-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-xl md:text-2xl font-bold">Exhibitor Registration Details</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm md:text-base font-semibold inline-block">
                  {exhibitorData.exhibitorNumber}
                </span>
                <span className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm md:text-base font-semibold inline-block">
                  {exhibitorData.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {/* Company Information */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 md:p-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <FaBuilding className="text-purple-600" />
                Company Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <FaBuilding className="text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Company Name</span>
                    <span className="font-semibold text-gray-800 break-words">{exhibitorData.companyName}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaUser className="text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Contact Person</span>
                    <span className="font-semibold text-gray-800 break-words">{exhibitorData.contactPerson}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Email</span>
                    <span className="font-semibold text-gray-800 break-all">{exhibitorData.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Phone</span>
                    <span className="font-semibold text-gray-800">{exhibitorData.phone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaIndustry className="text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-600 block">Industry</span>
                    <span className="font-semibold text-gray-800 break-words">{exhibitorData.industry}</span>
                  </div>
                </div>
                {exhibitorData.website && (
                  <div className="flex items-start gap-3">
                    <FaGlobe className="text-purple-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-gray-600 block">Website</span>
                      <a 
                        href={exhibitorData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-600 hover:text-purple-700 break-all underline"
                      >
                        {exhibitorData.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booth Information */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 md:p-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <FaWarehouse className="text-blue-600" />
                Booth Information
              </h4>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Hall Number</div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  Hall {exhibitorData.hallNumber}
                </div>
              </div>
            </div>

            {/* Employees */}
            {exhibitorData.employees && exhibitorData.employees.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 md:p-6">
                <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                  <FaUsers className="text-indigo-600" />
                  Registered Employees ({exhibitorData.employees.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exhibitorData.employees.map((employee, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-indigo-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-800 truncate">{employee.name}</div>
                            <div className="text-sm text-gray-600 truncate">{employee.position}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-xs flex-shrink-0" />
                          <span className="truncate">{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-xs flex-shrink-0" />
                          <span>{employee.phone}</span>
                        </div>
                        <div className="text-xs text-gray-500">ID: {employee.employeeNumber}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barcode Section */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 md:p-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <FaBarcode className="text-gray-600" />
                Exhibitor Barcode
              </h4>
              <div className="bg-white rounded-lg p-4 md:p-6 flex flex-col items-center border-2 border-dashed border-gray-300">
                <div className="overflow-x-auto w-full flex justify-center">
                  <BarcodeGenerator 
                    value={exhibitorData.exhibitorNumber} 
                    width={2} 
                    height={80} 
                    displayValue={true}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mt-4">
                  Present this barcode for booth setup and event access
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
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <FaPrint className="text-xl" />
            Print Details
          </button>
          <button
            onClick={handleNewRegistration}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
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
              <span className="text-purple-600 font-bold flex-shrink-0">1.</span>
              <span>Your registration is currently <strong>pending approval</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold flex-shrink-0">2.</span>
              <span>You will receive an email confirmation within 24 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold flex-shrink-0">3.</span>
              <span>Payment instructions will be sent upon approval</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold flex-shrink-0">4.</span>
              <span>Booth setup details will be provided closer to the event</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 font-bold flex-shrink-0">5.</span>
              <span>Keep your exhibitor number for all future communications</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ExhibitorSuccess;
