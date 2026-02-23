import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaBuilding, FaUserShield } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleRegistration = (type) => {
    if (type === 'visitor') {
      navigate('/visitor');
    } else if (type === 'exhibitor') {
      navigate('/exhibitor');
    } else if (type === 'administrator') {
      navigate('/admin');
    }
  };

  const cards = [
    {
      id: 'visitor',
      icon: FaUsers,
      title: 'Visitor Registration',
      description: 'Register as a visitor to explore exhibitions, attend events, and network with industry professionals.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      id: 'exhibitor',
      icon: FaBuilding,
      title: 'Exhibitor Registration',
      description: 'Register as an exhibitor to showcase your products and services with booth space and promotional opportunities.',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      id: 'administrator',
      icon: FaUserShield,
      title: 'Administrator',
      description: 'Administrative access for managing registrations, monitoring activities, and overseeing event operations.',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            Registration Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Welcome to our comprehensive registration system. Choose your registration type below to get started.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleRegistration(card.id)}
                className="cursor-pointer group"
              >
                <div className={`h-full glass-effect rounded-2xl p-8 bg-gradient-to-br ${card.bgGradient} hover:shadow-2xl transition-all duration-300`}>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-3xl text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {card.description}
                  </p>
                  
                  <button className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r ${card.gradient} text-white font-semibold shadow-lg hover:shadow-xl transform group-hover:scale-105 transition-all duration-200`}>
                    Get Started →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
