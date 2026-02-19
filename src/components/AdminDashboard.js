import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaUsers, FaBuilding, FaWarehouse, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import VisitorsList from './VisitorsList';
import ExhibitorsList from './ExhibitorsList';
import AdminStats from './AdminStats';

const AdminDashboard = ({ onBack, admin }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHall, setSelectedHall] = useState(1);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartBar, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'visitors', label: 'Visitors', icon: FaUsers, gradient: 'from-green-500 to-emerald-500' },
    { id: 'exhibitors', label: 'Exhibitors', icon: FaBuilding, gradient: 'from-purple-500 to-pink-500' },
    { id: 'halls', label: 'Halls', icon: FaWarehouse, gradient: 'from-orange-500 to-red-500' }
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
          <div className="space-y-6">
            <div className="glass-effect rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Select Hall to View Exhibitors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(hallNum => (
                  <motion.button
                    key={hallNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedHall(hallNum)}
                    className={`p-6 rounded-xl font-semibold text-lg transition-all ${
                      selectedHall === hallNum
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                        : 'bg-white text-gray-700 hover:shadow-lg border border-gray-200'
                    }`}
                  >
                    <FaWarehouse className="text-3xl mx-auto mb-2" />
                    Hall {hallNum}
                  </motion.button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-effect border-b border-white/30 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-lg"
              >
                <FaSignOutAlt /> Logout
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {admin?.name || 'Administrator'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/30">
              <div className="text-right">
                <p className="font-semibold text-gray-800">{admin?.name}</p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  admin?.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                  admin?.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {admin?.role?.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {admin?.name?.charAt(0).toUpperCase() || <FaUserCircle />}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`p-6 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl`
                    : 'glass-effect text-gray-700 hover:shadow-xl'
                }`}
              >
                <Icon className="text-3xl mx-auto mb-2" />
                <span className="block">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
