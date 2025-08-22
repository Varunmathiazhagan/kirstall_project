import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowPathIcon,
  TruckIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

const Transfers = ({ token, user, onNavigate }) => {
  const tableRef = useRef(null);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    asset_id: '',
    from_base_id: user?.base_id || '',
    to_base_id: '',
    reason: '',
    requested_by: user?.id || ''
  });
  const [filters, setFilters] = useState({
    status: '',
    from_base: '',
    to_base: '',
    start_date: '',
    end_date: ''
  });

  // Animation effects
  useEffect(() => {
    if (transfers.length > 0 && tableRef.current) {
      gsap.fromTo(tableRef.current.querySelectorAll('tbody tr'), 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [transfers]);

  useEffect(() => {
    if (timelineRef.current) {
      gsap.fromTo(timelineRef.current.querySelectorAll('.timeline-item'), 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [transfers]);

  // Mock data for demonstration
  const mockBases = [
    { id: 1, name: 'Fort Alpha', location: 'Washington, DC' },
    { id: 2, name: 'Base Beta', location: 'San Diego, CA' },
    { id: 3, name: 'Station Gamma', location: 'Norfolk, VA' },
    { id: 4, name: 'Camp Delta', location: 'Fort Bragg, NC' },
    { id: 5, name: 'Naval Base Echo', location: 'Pearl Harbor, HI' },
    { id: 6, name: 'Air Force Base Foxtrot', location: 'Colorado Springs, CO' },
    { id: 7, name: 'Marine Base Golf', location: 'Camp Pendleton, CA' }
  ];

  const mockAssets = [
    { id: 1, name: 'M4A1 Carbine', serial_number: 'SN123456', base_id: 1 },
    { id: 2, name: 'Night Vision Goggles AN/PVS-14', serial_number: 'NV345678', base_id: 1 },
    { id: 3, name: 'Medical Kit Advanced', serial_number: 'MD789012', base_id: 2 },
    { id: 4, name: 'Drone DJI Matrice 300', serial_number: 'DR456789', base_id: 3 },
    { id: 5, name: 'Field Radio AN/PRC-152', serial_number: 'RD123789', base_id: 1 },
    { id: 6, name: 'Humvee M1151', serial_number: 'VH789012', base_id: 2 },
    { id: 7, name: 'Satellite Communication System', serial_number: 'SC987654', base_id: 3 },
    { id: 8, name: 'Body Armor Vests', serial_number: 'BA456123', base_id: 1 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock transfers data with enhanced details
        const mockTransfers = [
          {
            id: 1,
            asset_name: 'M4A1 Carbine',
            asset_serial: 'SN123456',
            from_base: 'Fort Alpha',
            to_base: 'Base Beta',
            status: 'In Transit',
            requested_date: '2025-01-20',
            approved_date: '2025-01-21',
            estimated_arrival: '2025-01-25',
            reason: 'Tactical operations requirement',
            requested_by: 'Colonel Smith',
            approved_by: 'General Johnson',
            tracking_number: 'TRK001234',
            priority: 'High'
          },
          {
            id: 2,
            asset_name: 'Night Vision Goggles',
            asset_serial: 'NV345678',
            from_base: 'Station Gamma',
            to_base: 'Camp Delta',
            status: 'Pending Approval',
            requested_date: '2025-01-19',
            approved_date: null,
            estimated_arrival: null,
            reason: 'Night mission support',
            requested_by: 'Major Williams',
            approved_by: null,
            tracking_number: null,
            priority: 'Medium'
          },
          {
            id: 3,
            asset_name: 'Medical Kit Advanced',
            asset_serial: 'MD789012',
            from_base: 'Naval Base Echo',
            to_base: 'Fort Alpha',
            status: 'Completed',
            requested_date: '2025-01-15',
            approved_date: '2025-01-16',
            estimated_arrival: '2025-01-18',
            reason: 'Medical emergency response',
            requested_by: 'Captain Davis',
            approved_by: 'Admiral Brown',
            tracking_number: 'TRK001235',
            priority: 'Critical'
          },
          {
            id: 4,
            asset_name: 'Drone Systems',
            asset_serial: 'DR456789',
            from_base: 'Air Force Base Foxtrot',
            to_base: 'Marine Base Golf',
            status: 'In Transit',
            requested_date: '2025-01-18',
            approved_date: '2025-01-19',
            estimated_arrival: '2025-01-22',
            reason: 'Reconnaissance mission',
            requested_by: 'Lieutenant Colonel Lee',
            approved_by: 'Brigadier General Clark',
            tracking_number: 'TRK001236',
            priority: 'High'
          },
          {
            id: 5,
            asset_name: 'Field Radio Equipment',
            asset_serial: 'RD123789',
            from_base: 'Camp Delta',
            to_base: 'Station Gamma',
            status: 'Rejected',
            requested_date: '2025-01-17',
            approved_date: null,
            estimated_arrival: null,
            reason: 'Communication upgrade',
            requested_by: 'Sergeant Major Taylor',
            approved_by: null,
            tracking_number: null,
            priority: 'Low',
            rejection_reason: 'Asset required for current operations'
          },
          {
            id: 6,
            asset_name: 'Armored Vehicle',
            asset_serial: 'VH789012',
            from_base: 'Fort Alpha',
            to_base: 'Base Beta',
            status: 'Completed',
            requested_date: '2025-01-10',
            approved_date: '2025-01-12',
            estimated_arrival: '2025-01-15',
            reason: 'Convoy operations',
            requested_by: 'Major Anderson',
            approved_by: 'Colonel Thompson',
            tracking_number: 'TRK001237',
            priority: 'Medium'
          }
        ];

        setTransfers(mockTransfers);
        toast.success('Transfer data loaded successfully!');
      } catch (err) {
        setError('Failed to load transfer data');
        toast.error('Failed to load transfer data');
        console.error('Transfer error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Filter transfers based on search and filters
  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.from_base.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.to_base.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || transfer.status === filters.status;
    const matchesFromBase = !filters.from_base || transfer.from_base === filters.from_base;
    const matchesToBase = !filters.to_base || transfer.to_base === filters.to_base;
    const matchesStartDate = !filters.start_date || transfer.requested_date >= filters.start_date;
    const matchesEndDate = !filters.end_date || transfer.requested_date <= filters.end_date;
    
    return matchesSearch && matchesStatus && matchesFromBase && matchesToBase && matchesStartDate && matchesEndDate;
  });

  // Calculate summary statistics
  const summaryStats = {
    totalTransfers: filteredTransfers.length,
    inTransit: filteredTransfers.filter(t => t.status === 'In Transit').length,
    pending: filteredTransfers.filter(t => t.status === 'Pending Approval').length,
    completed: filteredTransfers.filter(t => t.status === 'Completed').length
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const selectedAsset = mockAssets.find(a => a.id === parseInt(formData.asset_id));
      const fromBase = mockBases.find(b => b.id === parseInt(formData.from_base_id));
      const toBase = mockBases.find(b => b.id === parseInt(formData.to_base_id));
      
      const newTransfer = {
        id: transfers.length + 1,
        asset_name: selectedAsset?.name || 'Unknown Asset',
        asset_serial: selectedAsset?.serial_number || 'N/A',
        from_base: fromBase?.name || 'Unknown Base',
        to_base: toBase?.name || 'Unknown Base',
        status: 'Pending Approval',
        requested_date: new Date().toISOString().split('T')[0],
        approved_date: null,
        estimated_arrival: null,
        reason: formData.reason,
        requested_by: user?.name || 'Current User',
        approved_by: null,
        tracking_number: null,
        priority: 'Medium'
      };
      
      setTransfers(prev => [newTransfer, ...prev]);
      setShowForm(false);
      setFormData({
        asset_id: '',
        from_base_id: user?.base_id || '',
        to_base_id: '',
        reason: '',
        requested_by: user?.id || ''
      });
      toast.success('Transfer request submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit transfer request');
      console.error('Submit error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending Approval':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center"
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
            Loading Transfers...
          </motion.h2>
          <motion.p 
            className="text-slate-600"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Fetching asset movement records
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center"
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
          <h2 className="text-2xl font-bold text-slate-800">Error Loading Transfers</h2>
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="bg-white shadow-xl rounded-2xl p-6 border border-blue-200"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-700 bg-clip-text text-transparent"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Asset Transfers
              </motion.h1>
              <motion.p 
                className="text-slate-600 mt-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Manage inter-base asset movements and logistics
              </motion.p>
            </div>
            <motion.button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <PlusIcon className="w-5 h-5" />
              <span>Request Transfer</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              title: 'Total Transfers',
              value: summaryStats.totalTransfers,
              icon: TruckIcon,
              gradient: 'from-blue-500 to-indigo-500'
            },
            {
              title: 'In Transit',
              value: summaryStats.inTransit,
              icon: ArrowPathIcon,
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Pending Approval',
              value: summaryStats.pending,
              icon: ClockIcon,
              gradient: 'from-amber-500 to-orange-500'
            },
            {
              title: 'Completed',
              value: summaryStats.completed,
              icon: CheckCircleIcon,
              gradient: 'from-emerald-500 to-green-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300"
              ref={el => cardsRef.current[index] = el}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="bg-white shadow-xl rounded-2xl p-6 border border-blue-200"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search transfers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="w-5 h-5 text-slate-500" />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All Status</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="In Transit">In Transit</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value }))}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters(prev => ({ ...prev, end_date: e.target.value }))}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Transfers Table */}
        <motion.div 
          className="bg-white shadow-xl rounded-2xl border border-blue-200 overflow-hidden"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="overflow-x-auto" ref={tableRef}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Asset</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Route</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tracking</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Requested</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ETA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <AnimatePresence>
                  {filteredTransfers.map((transfer, index) => (
                    <motion.tr
                      key={transfer.id}
                      className="hover:bg-blue-50 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{transfer.asset_name}</p>
                          <p className="text-sm text-slate-600">S/N: {transfer.asset_serial}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 text-slate-500 mr-1" />
                            <span className="text-sm text-slate-700">{transfer.from_base}</span>
                          </div>
                          <ArrowRightIcon className="w-4 h-4 text-slate-400" />
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 text-slate-500 mr-1" />
                            <span className="text-sm text-slate-700">{transfer.to_base}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transfer.status)}`}>
                          {transfer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(transfer.priority)}`}></div>
                          <span className="text-sm text-slate-700">{transfer.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {transfer.tracking_number ? (
                          <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                            {transfer.tracking_number}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-700">{transfer.requested_date}</p>
                          <p className="text-xs text-slate-500">by {transfer.requested_by}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {transfer.estimated_arrival ? (
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 text-slate-500 mr-1" />
                            <span className="text-sm text-slate-700">{transfer.estimated_arrival}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">TBD</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700 max-w-xs truncate">{transfer.reason}</p>
                        {transfer.rejection_reason && (
                          <p className="text-xs text-red-600 mt-1">Rejected: {transfer.rejection_reason}</p>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredTransfers.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <DocumentTextIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No transfers found</h3>
                <p className="text-slate-600">Try adjusting your search criteria or request a new transfer.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Transfer Request Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <TruckIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Request Asset Transfer
                </h2>
                <motion.button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Asset</label>
                    <select
                      name="asset_id"
                      value={formData.asset_id}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Asset</option>
                      {mockAssets.map(asset => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} ({asset.serial_number})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">From Base</label>
                    <select
                      name="from_base_id"
                      value={formData.from_base_id}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Origin Base</option>
                      {mockBases.map(base => (
                        <option key={base.id} value={base.id}>
                          {base.name} - {base.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">To Base</label>
                    <select
                      name="to_base_id"
                      value={formData.to_base_id}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Destination Base</option>
                      {mockBases.map(base => (
                        <option key={base.id} value={base.id}>
                          {base.name} - {base.location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Transfer Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Explain the reason for this transfer request..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Transfer Request
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Transfers;
