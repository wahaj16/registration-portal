import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import './AdminAuth.css';

const AdminAuth = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup, admin, loading, logout } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setError(result.message);
        }
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }

        const result = await signup(formData.name, formData.email, formData.password);
        if (!result.success) {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
  };

  const handleLogout = () => {
    logout();
    onBack();
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Show admin dashboard if authenticated
  if (admin) {
    return <AdminDashboard onBack={handleLogout} admin={admin} />;
  }

  // Show login/signup form
  return (
    <div className="admin-auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button className="back-button" onClick={onBack}>← Back</button>
          <h2>{isLogin ? 'Admin Login' : 'Admin Signup'}</h2>
          <p>{isLogin ? 'Access the administrative dashboard' : 'Create a new admin account'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-icon">
            {isLogin ? '🔐' : '👤'}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter admin email"
              autoComplete="username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button admin-submit"
            disabled={isLoading}
          >
            {isLoading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Login to Dashboard' : 'Create Admin Account')}
          </button>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an admin account? " : "Already have an admin account? "}
              <button 
                type="button" 
                className="toggle-button"
                onClick={toggleMode}
                disabled={isLoading}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="demo-credentials">
              <p><strong>Demo Credentials:</strong></p>
              <p>Email: admin@admin.com</p>
              <p>Password: admin123</p>
              <p><em>Note: You can also create a new admin account</em></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;