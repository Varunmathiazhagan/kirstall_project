import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, CubeIcon, ChartBarIcon, TruckIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

function Dashboard({ token, user }) {
  const statsRef = useRef(null);
  const cardsRef = useRef([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    base_id: user?.role === 'admin' ? '' : user?.base_id || '',
    category: '',
    start_date: '',
    end_date: ''
  });
  const [showNetMovementDetail, setShowNetMovementDetail] = useState(false);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate mock metrics based on user role and base
        const baseData = {
          1: { // Fort Alpha
            total_assets: 850,
            active_assets: 795,
            maintenance_assets: 35,
            decommissioned_assets: 20,
            total_value: 5650000,
            recent_purchases: 28,
            pending_transfers: 8,
            low_stock_items: 15,
            categories: {
              'Weapons': { count: 285, value: 1425000 },
              'Vehicles': { count: 145, value: 2100000 },
              'Communication': { count: 220, value: 880000 },
              'Medical': { count: 125, value: 625000 },
              'Equipment': { count: 75, value: 620000 }
            },
            recent_activity: [
              { type: 'purchase', item: 'M4A1 Carbines', quantity: 25, date: '2025-08-20', user: 'Alpha Logistics' },
              { type: 'purchase', item: 'Body Armor Vests', quantity: 50, date: '2025-08-19', user: 'Alpha Quartermaster' },
              { type: 'transfer', item: 'Night Vision Goggles', quantity: 12, date: '2025-08-19', user: 'Alpha Commander' },
              { type: 'maintenance', item: 'Humvee #H789', quantity: 1, date: '2025-08-18', user: 'Alpha Maintenance' },
              { type: 'purchase', item: 'Field Radios', quantity: 15, date: '2025-08-18', user: 'Alpha Communications' },
              { type: 'transfer', item: 'Medical Supplies', quantity: 30, date: '2025-08-17', user: 'Alpha Medic' },
              { type: 'purchase', item: 'Ammunition Crates', quantity: 100, date: '2025-08-17', user: 'Alpha Logistics' },
              { type: 'maintenance', item: 'Generator #G445', quantity: 1, date: '2025-08-16', user: 'Alpha Engineering' }
            ]
          },
          2: { // Base Beta
            total_assets: 620,
            active_assets: 580,
            maintenance_assets: 25,
            decommissioned_assets: 15,
            total_value: 3950000,
            recent_purchases: 18,
            pending_transfers: 5,
            low_stock_items: 10,
            categories: {
              'Weapons': { count: 185, value: 925000 },
              'Vehicles': { count: 95, value: 1140000 },
              'Communication': { count: 155, value: 620000 },
              'Medical': { count: 115, value: 575000 },
              'Equipment': { count: 70, value: 690000 }
            },
            recent_activity: [
              { type: 'purchase', item: 'Medical Kits', quantity: 40, date: '2025-08-20', user: 'Beta Logistics' },
              { type: 'transfer', item: 'Radio Equipment', quantity: 8, date: '2025-08-19', user: 'Beta Commander' },
              { type: 'purchase', item: 'Tactical Gear', quantity: 35, date: '2025-08-18', user: 'Beta Quartermaster' },
              { type: 'maintenance', item: 'LAV #L234', quantity: 1, date: '2025-08-17', user: 'Beta Maintenance' },
              { type: 'purchase', item: 'Field Computers', quantity: 10, date: '2025-08-16', user: 'Beta IT' }
            ]
          },
          3: { // Station Gamma
            total_assets: 480,
            active_assets: 445,
            maintenance_assets: 20,
            decommissioned_assets: 15,
            total_value: 2850000,
            recent_purchases: 12,
            pending_transfers: 3,
            low_stock_items: 8,
            categories: {
              'Weapons': { count: 125, value: 625000 },
              'Vehicles': { count: 85, value: 850000 },
              'Communication': { count: 135, value: 540000 },
              'Medical': { count: 85, value: 425000 },
              'Equipment': { count: 50, value: 410000 }
            },
            recent_activity: [
              { type: 'purchase', item: 'Drone Equipment', quantity: 5, date: '2025-08-19', user: 'Gamma Tech' },
              { type: 'transfer', item: 'Weapons Cache', quantity: 20, date: '2025-08-18', user: 'Gamma Security' },
              { type: 'maintenance', item: 'Radar System', quantity: 1, date: '2025-08-17', user: 'Gamma Electronics' }
            ]
          },
          4: { // Camp Delta
            total_assets: 380,
            active_assets: 355,
            maintenance_assets: 15,
            decommissioned_assets: 10,
            total_value: 2280000,
            recent_purchases: 8,
            pending_transfers: 2,
            low_stock_items: 6,
            categories: {
              'Weapons': { count: 105, value: 525000 },
              'Vehicles': { count: 65, value: 650000 },
              'Communication': { count: 95, value: 380000 },
              'Medical': { count: 75, value: 375000 },
              'Equipment': { count: 40, value: 350000 }
            },
            recent_activity: [
              { type: 'purchase', item: 'Training Equipment', quantity: 15, date: '2025-08-18', user: 'Delta Training' },
              { type: 'transfer', item: 'Supply Boxes', quantity: 25, date: '2025-08-16', user: 'Delta Supply' }
            ]
          },
          5: { // Naval Base Echo
            total_assets: 720,
            active_assets: 685,
            maintenance_assets: 25,
            decommissioned_assets: 10,
            total_value: 4250000,
            recent_purchases: 22,
            pending_transfers: 6,
            low_stock_items: 12,
            categories: {
              'Weapons': { count: 165, value: 825000 },
              'Vehicles': { count: 125, value: 1375000 },
              'Communication': { count: 185, value: 740000 },
              'Medical': { count: 145, value: 725000 },
              'Equipment': { count: 100, value: 585000 }
            },
            recent_activity: [
              { type: 'purchase', item: 'Naval Equipment', quantity: 30, date: '2025-08-20', user: 'Echo Naval Ops' },
              { type: 'transfer', item: 'Sonar Devices', quantity: 6, date: '2025-08-19', user: 'Echo Tech' },
              { type: 'purchase', item: 'Marine Gear', quantity: 45, date: '2025-08-18', user: 'Echo Marines' },
              { type: 'maintenance', item: 'Ship Systems', quantity: 3, date: '2025-08-17', user: 'Echo Engineering' }
            ]
          }
        };

        let mockData;
        if (user?.role === 'admin') {
          // Combined metrics for admin
          mockData = {
            total_assets: 3050,
            active_assets: 2860,
            maintenance_assets: 120,
            decommissioned_assets: 70,
            total_value: 18980000,
            recent_purchases: 88,
            pending_transfers: 24,
            low_stock_items: 51,
            categories: {
              'Weapons': { count: 865, value: 4325000 },
              'Vehicles': { count: 515, value: 6115000 },
              'Communication': { count: 790, value: 3160000 },
              'Medical': { count: 545, value: 2725000 },
              'Equipment': { count: 335, value: 2655000 }
            },
            recent_activity: [
              { type: 'purchase', item: 'Naval Equipment', quantity: 30, date: '2025-08-20', user: 'Echo Naval Ops' },
              { type: 'purchase', item: 'M4A1 Carbines', quantity: 25, date: '2025-08-20', user: 'Alpha Logistics' },
              { type: 'purchase', item: 'Medical Kits', quantity: 40, date: '2025-08-20', user: 'Beta Logistics' },
              { type: 'purchase', item: 'Body Armor Vests', quantity: 50, date: '2025-08-19', user: 'Alpha Quartermaster' },
              { type: 'transfer', item: 'Night Vision Goggles', quantity: 12, date: '2025-08-19', user: 'Alpha Commander' },
              { type: 'transfer', item: 'Sonar Devices', quantity: 6, date: '2025-08-19', user: 'Echo Tech' },
              { type: 'transfer', item: 'Radio Equipment', quantity: 8, date: '2025-08-19', user: 'Beta Commander' },
              { type: 'purchase', item: 'Drone Equipment', quantity: 5, date: '2025-08-19', user: 'Gamma Tech' },
              { type: 'maintenance', item: 'Humvee #H789', quantity: 1, date: '2025-08-18', user: 'Alpha Maintenance' },
              { type: 'purchase', item: 'Field Radios', quantity: 15, date: '2025-08-18', user: 'Alpha Communications' },
              { type: 'purchase', item: 'Tactical Gear', quantity: 35, date: '2025-08-18', user: 'Beta Quartermaster' },
              { type: 'purchase', item: 'Marine Gear', quantity: 45, date: '2025-08-18', user: 'Echo Marines' },
              { type: 'purchase', item: 'Training Equipment', quantity: 15, date: '2025-08-18', user: 'Delta Training' },
              { type: 'transfer', item: 'Weapons Cache', quantity: 20, date: '2025-08-18', user: 'Gamma Security' }
            ]
          };
        } else {
          // Base-specific metrics
          mockData = baseData[user?.base_id] || baseData[1];
        }
        
        setMetrics(mockData);
        setError(null);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.base_id) queryParams.append('base_id', filters.base_id);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.start_date) queryParams.append('start_date', filters.start_date);
      if (filters.end_date) queryParams.append('end_date', filters.end_date);

      const response = await fetch(`http://localhost:5000/api/assets/dashboard?${queryParams}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCardColor = (value, isPositive = true) => {
    if (value > 0) {
      return isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-red-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Connection Error</h3>
              <p className="text-sm text-gray-600">Unable to load dashboard data</p>
            </div>
          </div>
          <p className="text-red-700 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Asset Management Dashboard
              </h1>
              <p className="text-slate-600 text-lg">
                {user?.role === 'admin' ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.895-4.21-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0014 12a3.987 3.987 0 00-.172-1.415 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    System-wide Operations Center
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    {user?.base_name} Operations Center
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Welcome back,</p>
                <p className="font-semibold text-slate-900 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div 
          className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters & Search
            </h2>
            <button
              onClick={() => setFilters({ base_id: user?.role === 'admin' ? '' : user?.base_id || '', category: '', start_date: '', end_date: '' })}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {user?.role === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Base</label>
                <select
                  value={filters.base_id}
                  onChange={(e) => handleFilterChange('base_id', e.target.value)}
                  className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white px-3 py-2 transition-colors duration-200"
                >
                  <option value="">All Bases</option>
                  <option value="1">Fort Alpha</option>
                  <option value="2">Camp Beta</option>
                  <option value="3">Base Gamma</option>
                  <option value="4">Training Delta</option>
                  <option value="5">Naval Base Echo</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Equipment Type</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white px-3 py-2 transition-colors duration-200"
              >
                <option value="">All Types</option>
                <option value="Weapons">Weapons</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Ammunition">Ammunition</option>
                <option value="Communication">Communication</option>
                <option value="Medical">Medical</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white px-3 py-2 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white px-3 py-2 transition-colors duration-200"
              />
            </div>
          </div>
        </motion.div>

        {/* Enhanced Key Metrics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Total Assets */}
          <motion.div 
            className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Assets</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.total_assets?.toLocaleString() || 0}</p>
                <p className="text-sm text-emerald-600 mt-1">
                  ${(metrics.total_value / 1000000)?.toFixed(1) || 0}M value
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <CubeIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Active Assets */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Active Assets</p>
                <p className="text-3xl font-bold text-emerald-600">{metrics.active_assets?.toLocaleString() || 0}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {((metrics.active_assets / metrics.total_assets) * 100)?.toFixed(1) || 0}% operational
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">In Maintenance</p>
                <p className="text-3xl font-bold text-amber-600">{metrics.maintenance_assets?.toLocaleString() || 0}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {((metrics.maintenance_assets / metrics.total_assets) * 100)?.toFixed(1) || 0}% in service
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Recent Purchases</p>
                <p className="text-3xl font-bold text-indigo-600">{metrics.recent_purchases?.toLocaleString() || 0}</p>
                <p className="text-sm text-slate-500 mt-1">Last 30 days</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Categories */}
        {metrics.categories && (
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 7 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Asset Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(metrics.categories).map(([category, data]) => (
                <div key={category} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <h4 className="font-semibold text-slate-900 mb-2">{category}</h4>
                  <p className="text-2xl font-bold text-blue-600 mb-1">{data.count?.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">${(data.value / 1000)?.toFixed(0)}K value</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {metrics.recent_activity && (
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {metrics.recent_activity.slice(0, 6).map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    activity.type === 'purchase' ? 'bg-green-100 text-green-600' :
                    activity.type === 'transfer' ? 'bg-blue-100 text-blue-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {activity.type === 'purchase' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    )}
                    {activity.type === 'transfer' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    )}
                    {activity.type === 'maintenance' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{activity.item}</p>
                    <p className="text-sm text-slate-600">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} • 
                      Qty: {activity.quantity} • {activity.date} • {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Dashboard;
