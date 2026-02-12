import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const AdminStats = () => {
  const [visitorStats, setVisitorStats] = useState(null);
  const [exhibitorStats, setExhibitorStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchStats} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-stats">
      <div className="stats-grid">
        {/* Visitor Statistics */}
        <div className="stats-section">
          <h3>👥 Visitor Statistics</h3>
          <div className="stats-cards">
            <div className="stat-card primary">
              <div className="stat-number">{visitorStats?.total || 0}</div>
              <div className="stat-label">Total Visitors</div>
            </div>
            <div className="stat-card success">
              <div className="stat-number">{visitorStats?.active || 0}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-number">{visitorStats?.recentRegistrations || 0}</div>
              <div className="stat-label">Last 7 Days</div>
            </div>
          </div>
          
          {visitorStats?.topCompanies && visitorStats.topCompanies.length > 0 && (
            <div className="top-companies">
              <h4>Top Companies</h4>
              <div className="companies-list">
                {visitorStats.topCompanies.slice(0, 5).map((company, index) => (
                  <div key={index} className="company-item">
                    <span className="company-name">{company._id}</span>
                    <span className="company-count">{company.count} visitors</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exhibitor Statistics */}
        <div className="stats-section">
          <h3>🏢 Exhibitor Statistics</h3>
          <div className="stats-cards">
            <div className="stat-card primary">
              <div className="stat-number">{exhibitorStats?.total || 0}</div>
              <div className="stat-label">Total Exhibitors</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-number">{exhibitorStats?.pending || 0}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card success">
              <div className="stat-number">{exhibitorStats?.approved || 0}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>

          {/* Hall Distribution */}
          <div className="hall-distribution">
            <h4>Hall Distribution</h4>
            <div className="hall-stats">
              <div className="hall-stat">
                <span className="hall-label">Hall 1</span>
                <span className="hall-count">{exhibitorStats?.byHall?.hall1 || 0}</span>
              </div>
              <div className="hall-stat">
                <span className="hall-label">Hall 2</span>
                <span className="hall-count">{exhibitorStats?.byHall?.hall2 || 0}</span>
              </div>
              <div className="hall-stat">
                <span className="hall-label">Hall 3</span>
                <span className="hall-count">{exhibitorStats?.byHall?.hall3 || 0}</span>
              </div>
            </div>
          </div>

          {/* Booth Size Distribution */}
          {exhibitorStats?.byBoothSize && exhibitorStats.byBoothSize.length > 0 && (
            <div className="booth-distribution">
              <h4>Booth Size Distribution</h4>
              <div className="booth-stats">
                {exhibitorStats.byBoothSize.map((booth, index) => (
                  <div key={index} className="booth-stat">
                    <span className="booth-size">{booth._id.charAt(0).toUpperCase() + booth._id.slice(1)}</span>
                    <span className="booth-count">{booth.count} booths</span>
                    <span className="booth-revenue">${booth.totalRevenue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn export">📊 Export Reports</button>
          <button className="action-btn refresh" onClick={fetchStats}>🔄 Refresh Data</button>
          <button className="action-btn settings">⚙️ Settings</button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;