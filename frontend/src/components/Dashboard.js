import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, CubeIcon, ChartBarIcon, TruckIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

function Dashboard({ token, user, onNavigate }) {
  console.log('Dashboard component rendered with props:', { 
    hasToken: !!token, 
    hasUser: !!user, 
    hasOnNavigate: !!onNavigate,
    onNavigateType: typeof onNavigate 
  });
  
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
    // Animate cards on mount
    gsap.fromTo(cardsRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, [metrics]);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockData = {
          total_assets: 2847,
          total_value: 85420000,
          operational_assets: 2654,
          maintenance_assets: 193,
          avg_age: 3.2,
          pending_transfers: 24,
          recent_transfers: [
            { id: 1, asset: "M4A1 Carbine", from: "Base Alpha", to: "Base Bravo", status: "In Transit", date: "2024-01-15" },
            { id: 2, asset: "Communication Radio", from: "Base Charlie", to: "Base Delta", status: "Completed", date: "2024-01-14" },
            { id: 3, asset: "Medical Kit", from: "Base Echo", to: "Base Alpha", status: "Pending", date: "2024-01-13" }
          ],
          low_stock_items: [
            { id: 1, item: "9mm Ammunition", current: 850, minimum: 1000, critical: true },
            { id: 2, item: "First Aid Kits", current: 45, minimum: 50, critical: false },
            { id: 3, item: "Fuel Canisters", current: 22, minimum: 30, critical: false }
          ],
          asset_distribution: [
            { base: "Base Alpha", count: 842, percentage: 29.6 },
            { base: "Base Bravo", count: 721, percentage: 25.3 },
            { base: "Base Charlie", count: 589, percentage: 20.7 },
            { base: "Base Delta", count: 695, percentage: 24.4 }
          ],
          monthly_acquisitions: 156,
          monthly_disposals: 43,
          net_movement: 113
        };

        setMetrics(mockData);
        toast.success('Dashboard data loaded successfully!');
      } catch (err) {
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.h2 
            className="text-2xl font-bold text-slate-800"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading Dashboard...
          </motion.h2>
          <motion.p 
            className="text-slate-600"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Fetching latest military asset data
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">Error Loading Dashboard</h2>
          <p className="text-slate-600">{error}</p>
          <motion.button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            Retry
          </motion.button>
        </motion.div>
      </motion.div>
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
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 bg-clip-text text-transparent mb-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Military Asset Dashboard
              </motion.h1>
              <motion.p 
                className="text-slate-600 text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Real-time overview of military assets and operations
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-right">
                <p className="text-sm text-slate-600">Welcome back,</p>
                <p className="font-semibold text-slate-900">{user?.name || 'Officer'}</p>
                <p className="text-xs text-slate-500">{user?.role || 'User'}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </motion.div>
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
              <ChartBarIcon className="w-6 h-6 mr-2 text-blue-600" />
              Filters & Analytics
            </h2>
          </div>
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
                  <option value="1">Base Alpha</option>
                  <option value="2">Base Bravo</option>
                  <option value="3">Base Charlie</option>
                  <option value="4">Base Delta</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Asset Type</label>
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
            ref={el => cardsRef.current[0] = el}
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
          </motion.div>

          {/* Operational Status */}
          <motion.div 
            className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300"
            ref={el => cardsRef.current[1] = el}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Operational</p>
                <p className="text-3xl font-bold text-emerald-600">{metrics.operational_assets?.toLocaleString() || 0}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {((metrics.operational_assets / metrics.total_assets) * 100)?.toFixed(1) || 0}% ready
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Maintenance Required */}
          <motion.div 
            className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300"
            ref={el => cardsRef.current[2] = el}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">In Maintenance</p>
                <p className="text-3xl font-bold text-amber-600">{metrics.maintenance_assets?.toLocaleString() || 0}</p>
                <p className="text-sm text-slate-600 mt-1">
                  Avg age: {metrics.avg_age || 0} years
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Pending Transfers */}
          <motion.div 
            className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300"
            ref={el => cardsRef.current[3] = el}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Pending Transfers</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.pending_transfers?.toLocaleString() || 0}</p>
                <p className="text-sm text-slate-600 mt-1">
                  Awaiting approval
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transfers */}
          <motion.div 
            className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-blue-600" />
                Recent Transfers
              </h3>
              <motion.button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md border border-blue-200 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('View All button clicked!', { onNavigate: !!onNavigate });
                  if (onNavigate) {
                    onNavigate('transfers');
                    toast.success('Navigating to Transfers page...');
                  } else {
                    console.error('onNavigate prop not available');
                    toast.error('Navigation not available');
                  }
                }}
              >
                View All
              </motion.button>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {metrics.recent_transfers?.map((transfer, index) => (
                  <motion.div
                    key={transfer.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{transfer.asset}</p>
                        <p className="text-sm text-slate-600">
                          {transfer.from} → {transfer.to}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transfer.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          transfer.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {transfer.status}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">{transfer.date}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Low Stock Alerts */}
          <motion.div 
            className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-amber-600" />
                Low Stock Alerts
              </h3>
              <motion.button
                className="text-amber-600 hover:text-amber-800 text-sm font-medium bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-md border border-amber-200 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  console.log('Manage Stock button clicked!', { onNavigate: !!onNavigate });
                  if (onNavigate) {
                    onNavigate('purchases');
                    toast.success('Navigating to Purchases page...');
                  } else {
                    console.error('onNavigate prop not available');
                    toast.error('Navigation not available');
                  }
                }}
              >
                Manage Stock
              </motion.button>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {metrics.low_stock_items?.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`p-4 rounded-xl border-2 transition-colors duration-200 ${
                      item.critical 
                        ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                        : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{item.item}</p>
                        <p className="text-sm text-slate-600">
                          Current: {item.current} | Min: {item.minimum}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.critical ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.critical ? 'Critical' : 'Low'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${item.critical ? 'bg-red-500' : 'bg-amber-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.current / item.minimum) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Asset Distribution & Monthly Movement */}
        <motion.div 
          className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Asset Distribution & Movement</h3>
            <motion.button
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              onClick={() => setShowNetMovementDetail(!showNetMovementDetail)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showNetMovementDetail ? 'Hide Details' : 'Show Details'}
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Asset Distribution */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium text-slate-700 mb-4">Distribution by Base</h4>
              <div className="space-y-3">
                {metrics.asset_distribution?.map((base, index) => (
                  <motion.div 
                    key={base.base} 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-700">{base.base}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-600">{base.count} assets</span>
                      <span className="text-sm font-medium text-slate-900">{base.percentage}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Monthly Movement Summary */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-4">Monthly Movement</h4>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-sm text-emerald-700">Acquisitions</span>
                  <span className="font-bold text-emerald-800">+{metrics.monthly_acquisitions}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <span className="text-sm text-red-700">Disposals</span>
                  <span className="font-bold text-red-800">-{metrics.monthly_disposals}</span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <span className="text-sm text-blue-700 font-medium">Net Movement</span>
                  <span className="font-bold text-blue-800">+{metrics.net_movement}</span>
                </motion.div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showNetMovementDetail && (
              <motion.div
                className="mt-6 pt-6 border-t border-slate-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h5 className="text-sm font-medium text-slate-700 mb-3">Detailed Breakdown</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "New Procurements", value: 89, color: "emerald" },
                    { label: "Transfers In", value: 67, color: "blue" },
                    { label: "Equipment Upgrades", value: 43, color: "purple" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className={`p-4 bg-${item.color}-50 rounded-lg border border-${item.color}-200`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <p className={`text-${item.color}-700 text-sm font-medium`}>{item.label}</p>
                      <p className={`text-${item.color}-900 text-2xl font-bold`}>{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
