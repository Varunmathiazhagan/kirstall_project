import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from './common/AnimatedCard';
import AnimatedButton from './common/AnimatedButton';
import AnimatedTable from './common/AnimatedTable';
import AnimatedModal from './common/AnimatedModal';

const Purchases = ({ token, user, onNavigate }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reportLoading, setReportLoading] = useState(false);
  
  // Modal and form state
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    item: '',
    category: 'Weapons',
    quantity: '',
    cost: '',
    vendor: '',
    priority: 'Medium',
    description: ''
  });

  useEffect(() => {
    const mockPurchases = [
      { 
        id: 1, 
        item: 'M4A1 Carbine', 
        category: 'Weapons',
        quantity: 50, 
        cost: 125000, 
        date: '2024-01-15', 
        vendor: 'Defense Contractor A',
        status: 'Delivered',
        priority: 'High',
        description: 'Standard issue combat rifle for infantry units'
      },
      { 
        id: 2, 
        item: 'Communication Radio', 
        category: 'Communications',
        quantity: 25, 
        cost: 75000, 
        date: '2024-01-14', 
        vendor: 'Tech Solutions Inc',
        status: 'Processing',
        priority: 'Medium',
        description: 'Long-range tactical communication equipment'
      },
      { 
        id: 3, 
        item: 'Medical Kit', 
        category: 'Medical',
        quantity: 100, 
        cost: 25000, 
        date: '2024-01-13', 
        vendor: 'Medical Supply Co',
        status: 'Delivered',
        priority: 'High',
        description: 'Emergency field medical supplies and equipment'
      },
      { 
        id: 4, 
        item: 'Body Armor', 
        category: 'Protection',
        quantity: 75, 
        cost: 187500, 
        date: '2024-01-12', 
        vendor: 'Armor Tech Ltd',
        status: 'Pending',
        priority: 'Critical',
        description: 'Level IIIA ballistic protection vests'
      },
      { 
        id: 5, 
        item: 'Night Vision Goggles', 
        category: 'Electronics',
        quantity: 30, 
        cost: 450000, 
        date: '2024-01-11', 
        vendor: 'Optics International',
        status: 'Delivered',
        priority: 'High',
        description: 'Advanced night vision equipment for special operations'
      }
    ];

    const timer = setTimeout(() => {
      setLoading(false);
      setPurchases(mockPurchases);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Report generation functions
  const generateCSVReport = () => {
    const headers = ['Item', 'Category', 'Quantity', 'Cost', 'Date', 'Vendor', 'Status', 'Priority', 'Description'];
    const csvContent = [
      headers.join(','),
      ...filteredPurchases.map(purchase => [
        `"${purchase.item}"`,
        `"${purchase.category}"`,
        purchase.quantity,
        purchase.cost,
        `"${purchase.date}"`,
        `"${purchase.vendor}"`,
        `"${purchase.status}"`,
        `"${purchase.priority}"`,
        `"${purchase.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `purchases_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDFReport = () => {
    // Create a detailed HTML report for PDF printing
    const reportWindow = window.open('', '_blank');
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Military Asset Purchases Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333; 
            padding-bottom: 20px;
          }
          .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; 
            margin-bottom: 30px;
          }
          .stat-card { 
            background: #f5f5f5; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #007bff;
          }
          .stat-title { 
            font-size: 12px; 
            color: #666; 
            margin-bottom: 5px;
          }
          .stat-value { 
            font-size: 24px; 
            font-weight: bold; 
            color: #333;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: bold;
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9;
          }
          .status-delivered { 
            color: green; 
            font-weight: bold;
          }
          .status-pending { 
            color: orange; 
            font-weight: bold;
          }
          .status-processing { 
            color: blue; 
            font-weight: bold;
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Military Asset Purchases Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Report compiled by: ${user?.name || 'System Administrator'}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <div class="stat-title">Total Purchases</div>
            <div class="stat-value">${stats.totalPurchases}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Value</div>
            <div class="stat-value">$${stats.totalValue.toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Items</div>
            <div class="stat-value">${stats.totalItems}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Average Cost/Item</div>
            <div class="stat-value">$${Math.round(stats.avgCostPerItem).toLocaleString()}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Delivered</div>
            <div class="stat-value">${stats.deliveredCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Pending</div>
            <div class="stat-value">${stats.pendingCount}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Cost</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPurchases.map(purchase => `
              <tr>
                <td>${purchase.item}</td>
                <td>${purchase.category}</td>
                <td>${purchase.quantity}</td>
                <td>$${purchase.cost.toLocaleString()}</td>
                <td>${purchase.date}</td>
                <td>${purchase.vendor}</td>
                <td class="status-${purchase.status.toLowerCase()}">${purchase.status}</td>
                <td>${purchase.priority}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>This report contains ${filteredPurchases.length} purchase records</p>
          <p>Military Asset Management System - Confidential Document</p>
        </div>

        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Report</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
        </div>
      </body>
      </html>
    `;
    
    reportWindow.document.write(reportHTML);
    reportWindow.document.close();
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    
    try {
      // Show options to user
      const reportType = await new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        `;
        
        modal.innerHTML = `
          <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 400px;">
            <h3 style="margin-bottom: 20px; color: #333;">Generate Report</h3>
            <p style="margin-bottom: 25px; color: #666;">Choose your preferred report format:</p>
            <div style="display: flex; gap: 15px; justify-content: center;">
              <button id="csv-btn" style="padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                📊 CSV Report
              </button>
              <button id="pdf-btn" style="padding: 12px 24px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                📄 PDF Report
              </button>
            </div>
            <button id="cancel-btn" style="margin-top: 15px; padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Cancel
            </button>
          </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('csv-btn').onclick = () => {
          document.body.removeChild(modal);
          resolve('csv');
        };
        
        document.getElementById('pdf-btn').onclick = () => {
          document.body.removeChild(modal);
          resolve('pdf');
        };
        
        document.getElementById('cancel-btn').onclick = () => {
          document.body.removeChild(modal);
          resolve(null);
        };
      });
      
      if (reportType === 'csv') {
        generateCSVReport();
      } else if (reportType === 'pdf') {
        generatePDFReport();
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setReportLoading(false);
    }
  };

  // Handle new purchase form submission
  const handleAddNewPurchase = () => {
    if (!newPurchase.item || !newPurchase.quantity || !newPurchase.cost || !newPurchase.vendor) {
      alert('Please fill in all required fields');
      return;
    }

    const purchase = {
      id: purchases.length + 1,
      item: newPurchase.item,
      category: newPurchase.category,
      quantity: parseInt(newPurchase.quantity),
      cost: parseFloat(newPurchase.cost),
      date: new Date().toISOString().split('T')[0],
      vendor: newPurchase.vendor,
      status: 'Pending',
      priority: newPurchase.priority,
      description: newPurchase.description || `${newPurchase.item} purchase from ${newPurchase.vendor}`
    };

    setPurchases([...purchases, purchase]);
    setNewPurchase({
      item: '',
      category: 'Weapons',
      quantity: '',
      cost: '',
      vendor: '',
      priority: 'Medium',
      description: ''
    });
    setShowNewPurchaseModal(false);
    alert('New purchase added successfully!');
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewPurchase(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle export functionality
  const handleExportData = (format) => {
    if (format === 'csv') {
      generateCSVReport();
    } else if (format === 'pdf') {
      generatePDFReport();
    }
    setShowExportModal(false);
  };

  // Filter functions
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || purchase.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(purchases.map(p => p.category))];

  // Table columns configuration
  const tableColumns = [
    {
      key: 'item',
      header: 'Item',
      render: (value, item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-white">{value}</span>
          <span className="text-sm text-white/60">{item.description}</span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (value) => (
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-sm font-medium">
          {value}
        </span>
      )
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (value) => (
        <span className="text-white font-medium">{value}</span>
      )
    },
    {
      key: 'cost',
      header: 'Cost',
      render: (value) => (
        <span className="text-green-400 font-bold">${value.toLocaleString()}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const statusColors = {
          'Delivered': 'bg-green-500/20 text-green-300 border-green-400/30',
          'Processing': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
          'Pending': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
          'Critical': 'bg-red-500/20 text-red-300 border-red-400/30'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[value] || 'bg-gray-500/20 text-gray-300'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'vendor',
      header: 'Vendor',
      render: (value) => (
        <span className="text-white/80">{value}</span>
      )
    }
  ];

  // Statistics calculations
  const stats = {
    totalPurchases: purchases.length,
    totalValue: purchases.reduce((sum, p) => sum + p.cost, 0),
    totalItems: purchases.reduce((sum, p) => sum + p.quantity, 0),
    avgCostPerItem: purchases.length > 0 ? purchases.reduce((sum, p) => sum + p.cost, 0) / purchases.reduce((sum, p) => sum + p.quantity, 0) : 0,
    deliveredCount: purchases.filter(p => p.status === 'Delivered').length,
    pendingCount: purchases.filter(p => p.status === 'Pending' || p.status === 'Processing').length
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading Purchases...</div>
          <div className="text-white/60 mt-2">Fetching military asset procurement data</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Purchases Management
          </h1>
          <p className="text-gray-300 text-lg">
            Comprehensive military asset procurement tracking and management system
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div 
          className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search purchases, vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800 text-white">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <AnimatedButton
              variant="primary"
              size="md"
              onClick={() => setShowNewPurchaseModal(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Purchase
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              size="md"
              onClick={() => setShowExportModal(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <AnimatedCard 
            delay={100}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Purchases</p>
                <p className="text-white text-3xl font-bold">{stats.totalPurchases}</p>
              </div>
              <div className="bg-blue-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard 
            delay={200}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Total Value</p>
                <p className="text-white text-3xl font-bold">${(stats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="bg-green-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard 
            delay={300}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Items</p>
                <p className="text-white text-3xl font-bold">{stats.totalItems}</p>
              </div>
              <div className="bg-purple-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard 
            delay={400}
            className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Avg Cost/Item</p>
                <p className="text-white text-3xl font-bold">${(stats.avgCostPerItem / 1000).toFixed(1)}K</p>
              </div>
              <div className="bg-orange-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard 
            animationType="framer" 
            delay={500}
            className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Delivered</p>
                <p className="text-white text-3xl font-bold">{stats.deliveredCount}</p>
              </div>
              <div className="bg-emerald-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard 
            animationType="framer" 
            delay={600}
            className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Pending</p>
                <p className="text-white text-3xl font-bold">{stats.pendingCount}</p>
              </div>
              <div className="bg-yellow-500/30 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Main Content Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <AnimatedTable
            data={filteredPurchases}
            columns={tableColumns}
            loading={false}
            onRowClick={(item) => console.log('Selected item:', item)}
            emptyMessage="No purchases found matching your criteria"
            className="shadow-2xl"
          />
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div 
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="text-white/60 text-sm">
            Showing {filteredPurchases.length} of {purchases.length} purchases
          </div>
          
          <div className="flex gap-3">
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => onNavigate && onNavigate('dashboard')}
            >
              Back to Dashboard
            </AnimatedButton>
            
            <AnimatedButton
              variant="success"
              size="sm"
              onClick={handleGenerateReport}
              loading={reportLoading}
            >
              Generate Report
            </AnimatedButton>
          </div>
        </motion.div>
      </div>

      {/* New Purchase Modal */}
      <AnimatedModal
        isOpen={showNewPurchaseModal}
        onClose={() => setShowNewPurchaseModal(false)}
        title="Add New Purchase"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={newPurchase.item}
                onChange={(e) => handleInputChange('item', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Category *
              </label>
              <select
                value={newPurchase.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Weapons" className="bg-slate-800">Weapons</option>
                <option value="Communications" className="bg-slate-800">Communications</option>
                <option value="Medical" className="bg-slate-800">Medical</option>
                <option value="Protection" className="bg-slate-800">Protection</option>
                <option value="Electronics" className="bg-slate-800">Electronics</option>
                <option value="Vehicles" className="bg-slate-800">Vehicles</option>
                <option value="Supplies" className="bg-slate-800">Supplies</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={newPurchase.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Cost (USD) *
              </label>
              <input
                type="number"
                value={newPurchase.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter cost in USD"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Vendor *
              </label>
              <input
                type="text"
                value={newPurchase.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter vendor name"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Priority
              </label>
              <select
                value={newPurchase.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low" className="bg-slate-800">Low</option>
                <option value="Medium" className="bg-slate-800">Medium</option>
                <option value="High" className="bg-slate-800">High</option>
                <option value="Critical" className="bg-slate-800">Critical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              value={newPurchase.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter description (optional)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-white/20">
            <AnimatedButton
              variant="secondary"
              onClick={() => setShowNewPurchaseModal(false)}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              variant="success"
              onClick={handleAddNewPurchase}
            >
              Add Purchase
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>

      {/* Export Modal */}
      <AnimatedModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Purchase Data"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-white/80 text-center">
            Choose your preferred export format for the purchase data.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              className="p-6 bg-white/5 rounded-xl border border-white/20 hover:border-green-400/50 cursor-pointer transition-all group"
              onClick={() => handleExportData('csv')}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">CSV Export</h3>
                <p className="text-sm text-white/60">
                  Download as CSV file for spreadsheet applications
                </p>
              </div>
            </div>

            <div 
              className="p-6 bg-white/5 rounded-xl border border-white/20 hover:border-red-400/50 cursor-pointer transition-all group"
              onClick={() => handleExportData('pdf')}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center group-hover:bg-red-500/30">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">PDF Report</h3>
                <p className="text-sm text-white/60">
                  Generate a formatted PDF report
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4 border-t border-white/20">
            <AnimatedButton
              variant="secondary"
              onClick={() => setShowExportModal(false)}
            >
              Cancel
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>
    </motion.div>
  );
};

export default Purchases;
