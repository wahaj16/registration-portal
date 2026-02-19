import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBuilding, FaWarehouse, FaChartBar, FaDownload, FaSync, FaCog, FaTrophy, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

const AdminStats = () => {
  const [visitorStats, setVisitorStats] = useState(null);
  const [exhibitorStats, setExhibitorStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [visitorsResponse, exhibitorsResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.VISITORS_STATS),
        axios.get(API_ENDPOINTS.EXHIBITORS_STATS)
      ]);

      setVisitorStats(visitorsResponse.data.stats);
      setExhibitorStats(exhibitorsResponse.data.stats);
      toast.success('Statistics loaded successfully');
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Statistics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FaUsers className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Visitor Statistics</h3>
              <p className="text-sm text-gray-600">Overview of registered visitors</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {visitorStats?.total || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Visitors</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {visitorStats?.active || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Active</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {visitorStats?.recentRegistrations || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Last 7 Days</div>
            </div>
          </div>

          {visitorStats?.topCompanies && visitorStats.topCompanies.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                Top Companies
              </h4>
              <div className="space-y-2">
                {visitorStats.topCompanies.slice(0, 5).map((company, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-800">{company._id}</span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                      {company.count} visitors
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Exhibitor Statistics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <FaBuilding className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Exhibitor Statistics</h3>
              <p className="text-sm text-gray-600">Overview of exhibitor registrations</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {exhibitorStats?.total || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {exhibitorStats?.pending || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Pending</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {exhibitorStats?.approved || 0}
              </div>
              <div className="text-sm text-gray-600 font-medium">Approved</div>
            </div>
          </div>

          {/* Hall Distribution */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 mb-4">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaWarehouse className="text-blue-600" />
              Hall Distribution
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {exhibitorStats?.byHall?.hall1 || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Hall 1</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {exhibitorStats?.byHall?.hall2 || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Hall 2</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {exhibitorStats?.byHall?.hall3 || 0}
                </div>
                <div className="text-xs text-gray-600 font-medium">Hall 3</div>
              </div>
            </div>
          </div>

          {/* Booth Size Distribution */}
          {exhibitorStats?.byBoothSize && exhibitorStats.byBoothSize.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaChartBar className="text-green-600" />
                Booth Size Distribution
              </h4>
              <div className="space-y-2">
                {exhibitorStats.byBoothSize.map((booth, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800 capitalize">
                        {booth._id}
                      </span>
                      <span className="text-sm text-gray-600">
                        {booth.count} booths
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="text-green-600 text-sm" />
                      <span className="text-lg font-bold text-green-600">
                        ${booth.totalRevenue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Revenue Summary */}
      {exhibitorStats?.byBoothSize && exhibitorStats.byBoothSize.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <FaDollarSign className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Revenue Summary</h3>
              <p className="text-sm text-gray-600">Total revenue from exhibitor registrations</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium mb-2">Total Revenue</div>
              <div className="text-5xl font-bold text-green-600 mb-2">
                ${exhibitorStats.byBoothSize.reduce((sum, booth) => sum + booth.totalRevenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">
                From {exhibitorStats.total} exhibitors across all halls
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaCog className="text-gray-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => toast.success('Export feature coming soon!')}
          >
            <FaDownload className="text-xl" />
            Export Reports
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={fetchStats}
          >
            <FaSync className="text-xl" />
            Refresh Data
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => toast.success('Settings feature coming soon!')}
          >
            <FaCog className="text-xl" />
            Settings
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminStats;
