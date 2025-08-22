import React, { useState, useEffect } from 'react';

const Purchases = ({ token, user }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    start_date: '',
    end_date: ''
  });
  
  const [formData, setFormData] = useState({
    asset_id: '',
    quantity: '',
    unit_price: '',
    purchase_date: new Date().toISOString().split('T')[0],
    vendor: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock purchases data
        const mockPurchases = [
          {
            id: 1,
            asset_name: 'M4A1 Carbine',
            category: 'Weapons',
            quantity: 25,
            unit_price: 1200.00,
            total_price: 30000.00,
            purchase_date: '2025-08-20',
            vendor: 'Defense Systems Inc.',
            notes: 'Standard issue rifles for Alpha Company',
            purchased_by: 'Alpha Logistics',
            base_name: 'Fort Alpha'
          },
          {
            id: 2,
            asset_name: 'Body Armor Vests',
            category: 'Equipment',
            quantity: 50,
            unit_price: 350.00,
            total_price: 17500.00,
            purchase_date: '2025-08-19',
            vendor: 'Tactical Protection Corp',
            notes: 'Level IIIA body armor for field operations',
            purchased_by: 'Alpha Quartermaster',
            base_name: 'Fort Alpha'
          },
          {
            id: 3,
            asset_name: 'Medical Kit Advanced',
            category: 'Medical',
            quantity: 40,
            unit_price: 185.00,
            total_price: 7400.00,
            purchase_date: '2025-08-20',
            vendor: 'MedSupply Corp',
            notes: 'Advanced trauma kits for combat medics',
            purchased_by: 'Beta Logistics',
            base_name: 'Base Beta'
          },
          {
            id: 4,
            asset_name: 'Field Radio AN/PRC-152',
            category: 'Communication',
            quantity: 15,
            unit_price: 920.00,
            total_price: 13800.00,
            purchase_date: '2025-08-18',
            vendor: 'CommTech Solutions',
            notes: 'Secure tactical radio systems',
            purchased_by: 'Alpha Communications',
            base_name: 'Fort Alpha'
          },
          {
            id: 5,
            asset_name: 'Night Vision Goggles AN/PVS-14',
            category: 'Equipment',
            quantity: 20,
            unit_price: 3200.00,
            total_price: 64000.00,
            purchase_date: '2025-08-17',
            vendor: 'OpticsMax Ltd',
            notes: 'Gen 3 night vision for special operations',
            purchased_by: 'Alpha Logistics',
            base_name: 'Fort Alpha'
          },
          {
            id: 6,
            asset_name: 'Humvee M1151A1',
            category: 'Vehicles',
            quantity: 3,
            unit_price: 85000.00,
            total_price: 255000.00,
            purchase_date: '2025-08-16',
            vendor: 'Defense Mobility Solutions',
            notes: 'Up-armored tactical vehicles',
            purchased_by: 'Gamma Operations',
            base_name: 'Base Gamma'
          },
          {
            id: 7,
            asset_name: 'Combat Helmets ACH',
            category: 'Equipment',
            quantity: 75,
            unit_price: 285.00,
            total_price: 21375.00,
            purchase_date: '2025-08-15',
            vendor: 'Tactical Protection Corp',
            notes: 'Advanced Combat Helmets with mount systems',
            purchased_by: 'Beta Quartermaster',
            base_name: 'Base Beta'
          },
          {
            id: 8,
            asset_name: 'Satellite Communication System',
            category: 'Communication',
            quantity: 2,
            unit_price: 45000.00,
            total_price: 90000.00,
            purchase_date: '2025-08-14',
            vendor: 'SatComm Technologies',
            notes: 'Portable satellite communication units',
            purchased_by: 'Delta Communications',
            base_name: 'Training Delta'
          },
          {
            id: 9,
            asset_name: 'Emergency Medical Supplies',
            category: 'Medical',
            quantity: 100,
            unit_price: 125.00,
            total_price: 12500.00,
            purchase_date: '2025-08-13',
            vendor: 'MedSupply Corp',
            notes: 'Emergency response medical kits',
            purchased_by: 'Echo Medical',
            base_name: 'Naval Base Echo'
          },
          {
            id: 10,
            asset_name: 'Tactical Drones DJI Matrice',
            category: 'Equipment',
            quantity: 5,
            unit_price: 8500.00,
            total_price: 42500.00,
            purchase_date: '2025-08-12',
            vendor: 'Aerial Systems Inc',
            notes: 'Surveillance and reconnaissance drones',
            purchased_by: 'Alpha Intel',
            base_name: 'Fort Alpha'
          },
          {
            id: 11,
            asset_name: 'MRE Combat Rations',
            category: 'Food',
            quantity: 500,
            unit_price: 12.50,
            total_price: 6250.00,
            purchase_date: '2025-08-11',
            vendor: 'Military Food Service',
            notes: 'Meals Ready-to-Eat for field operations',
            purchased_by: 'Gamma Supply',
            base_name: 'Base Gamma'
          },
          {
            id: 12,
            asset_name: 'Portable Generators',
            category: 'Equipment',
            quantity: 8,
            unit_price: 2800.00,
            total_price: 22400.00,
            purchase_date: '2025-08-10',
            vendor: 'Power Solutions Military',
            notes: 'Tactical quiet generators for field ops',
            purchased_by: 'Delta Engineering',
            base_name: 'Training Delta'
          },
          {
            id: 13,
            asset_name: 'Ammunition 5.56mm NATO',
            category: 'Ammunition',
            quantity: 10000,
            unit_price: 0.85,
            total_price: 8500.00,
            purchase_date: '2025-08-09',
            vendor: 'Defense Ammunition Corp',
            notes: 'Standard NATO rounds for training and operations',
            purchased_by: 'Beta Armory',
            base_name: 'Base Beta'
          },
          {
            id: 14,
            asset_name: 'Tactical Backpacks MOLLE',
            category: 'Equipment',
            quantity: 60,
            unit_price: 145.00,
            total_price: 8700.00,
            purchase_date: '2025-08-08',
            vendor: 'Tactical Gear Solutions',
            notes: 'Modular tactical backpacks with MOLLE system',
            purchased_by: 'Echo Supply',
            base_name: 'Naval Base Echo'
          },
          {
            id: 15,
            asset_name: 'Water Purification Systems',
            category: 'Equipment',
            quantity: 12,
            unit_price: 1850.00,
            total_price: 22200.00,
            purchase_date: '2025-08-07',
            vendor: 'Field Water Solutions',
            notes: 'Portable water purification for field deployment',
            purchased_by: 'Gamma Logistics',
            base_name: 'Base Gamma'
          },
          {
            id: 16,
            asset_name: 'Thermal Imaging Scopes',
            category: 'Equipment',
            quantity: 18,
            unit_price: 4200.00,
            total_price: 75600.00,
            purchase_date: '2025-08-06',
            vendor: 'OpticsMax Ltd',
            notes: 'Advanced thermal imaging for night operations',
            purchased_by: 'Alpha Special Ops',
            base_name: 'Fort Alpha'
          },
          {
            id: 17,
            asset_name: 'Field Surgery Kits',
            category: 'Medical',
            quantity: 25,
            unit_price: 680.00,
            total_price: 17000.00,
            purchase_date: '2025-08-05',
            vendor: 'Medical Tactical Supply',
            notes: 'Complete surgical kits for field hospitals',
            purchased_by: 'Delta Medical',
            base_name: 'Training Delta'
          },
          {
            id: 18,
            asset_name: 'Encrypted Laptop Computers',
            category: 'Communication',
            quantity: 30,
            unit_price: 2800.00,
            total_price: 84000.00,
            purchase_date: '2025-08-04',
            vendor: 'SecureComm Technologies',
            notes: 'Military-grade encrypted laptops',
            purchased_by: 'Echo IT',
            base_name: 'Naval Base Echo'
          },
          {
            id: 19,
            asset_name: 'Kevlar Ballistic Panels',
            category: 'Equipment',
            quantity: 200,
            unit_price: 95.00,
            total_price: 19000.00,
            purchase_date: '2025-08-03',
            vendor: 'Armor Solutions Inc',
            notes: 'Replacement ballistic panels for body armor',
            purchased_by: 'Beta Maintenance',
            base_name: 'Base Beta'
          },
          {
            id: 20,
            asset_name: 'Military Grade GPS Units',
            category: 'Communication',
            quantity: 45,
            unit_price: 750.00,
            total_price: 33750.00,
            purchase_date: '2025-08-02',
            vendor: 'Navigation Systems Military',
            notes: 'Ruggedized GPS units for field navigation',
            purchased_by: 'Gamma Navigation',
            base_name: 'Base Gamma'
          }
        ];

        // Mock assets data for the form
        const mockAssets = [
          { id: 1, name: 'M4A1 Carbine' },
          { id: 2, name: 'Body Armor Vest' },
          { id: 3, name: 'Medical Kit' },
          { id: 4, name: 'Field Radio' },
          { id: 5, name: 'Night Vision Goggles' },
          { id: 6, name: 'Humvee' },
          { id: 7, name: 'Combat Helmet' },
          { id: 8, name: 'Satellite Communication System' },
          { id: 9, name: 'Emergency Medical Supplies' },
          { id: 10, name: 'Tactical Drone' },
          { id: 11, name: 'MRE Combat Rations' },
          { id: 12, name: 'Portable Generator' },
          { id: 13, name: 'Ammunition 5.56mm' },
          { id: 14, name: 'Tactical Backpack' },
          { id: 15, name: 'Water Purification System' },
          { id: 16, name: 'Thermal Imaging Scope' },
          { id: 17, name: 'Field Surgery Kit' },
          { id: 18, name: 'Encrypted Laptop' },
          { id: 19, name: 'Kevlar Ballistic Panel' },
          { id: 20, name: 'Military GPS Unit' },
          { id: 21, name: 'Tactical Vest' },
          { id: 22, name: 'Binoculars' },
          { id: 23, name: 'First Aid Kit' },
          { id: 24, name: 'Flashlight' },
          { id: 25, name: 'Multi-tool' }
        ];

        setPurchases(mockPurchases);
        setAssets(mockAssets);
        setError(null);
      } catch (error) {
        console.error('Purchases fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (filters.category && purchase.category !== filters.category) {
      return false;
    }
    if (filters.start_date && purchase.purchase_date < filters.start_date) {
      return false;
    }
    if (filters.end_date && purchase.purchase_date > filters.end_date) {
      return false;
    }
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Calculate total price
      const totalPrice = parseFloat(formData.unit_price) * parseInt(formData.quantity);
      
      // Mock API call - in real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPurchase = {
        id: purchases.length + 1,
        asset_name: assets.find(a => a.id === parseInt(formData.asset_id))?.name || 'Unknown Asset',
        category: 'Equipment', // This would come from the selected asset
        quantity: parseInt(formData.quantity),
        unit_price: parseFloat(formData.unit_price),
        total_price: totalPrice,
        purchase_date: formData.purchase_date,
        vendor: formData.vendor,
        notes: formData.notes,
        purchased_by: `${user?.base_name} ${user?.role}`,
        base_name: user?.base_name || 'Unknown Base'
      };

      setPurchases(prev => [newPurchase, ...prev]);
      setShowAddForm(false);
      setFormData({
        asset_id: '',
        quantity: '',
        unit_price: '',
        purchase_date: new Date().toISOString().split('T')[0],
        vendor: '',
        notes: ''
      });
    } catch (error) {
      console.error('Purchase submit error:', error);
      setError('Failed to record purchase');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Purchases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                Purchase Management
              </h1>
              <p className="text-slate-600 text-lg flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Record and manage asset purchases
              </p>
            </div>
            {(user?.role === 'admin' || user?.role === 'base_commander' || user?.role === 'logistics_officer') && (
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Record Purchase
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters & Search
            </h2>
            <button
              onClick={() => setFilters({ category: '', start_date: '', end_date: '' })}
              className="text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Equipment Type</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white px-3 py-2 transition-colors duration-200"
              >
                <option value="">All Types</option>
                <option value="Weapons">Weapons</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Ammunition">Ammunition</option>
                <option value="Communication">Communication</option>
                <option value="Medical">Medical</option>
                <option value="Equipment">Equipment</option>
                <option value="Food">Food</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white px-3 py-2 transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white px-3 py-2 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Purchase Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Purchases</p>
                <p className="text-3xl font-bold text-emerald-600">{filteredPurchases.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Value</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${filteredPurchases.reduce((sum, p) => sum + p.total_price, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Quantity</p>
                <p className="text-3xl font-bold text-purple-600">
                  {filteredPurchases.reduce((sum, p) => sum + p.quantity, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Avg Order Value</p>
                <p className="text-3xl font-bold text-amber-600">
                  ${filteredPurchases.length > 0 ? 
                    (filteredPurchases.reduce((sum, p) => sum + p.total_price, 0) / filteredPurchases.length).toLocaleString(undefined, {maximumFractionDigits: 0}) : 
                    0
                  }
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Purchase List */}
        <div className="bg-white shadow-xl rounded-2xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 flex items-center">
              <svg className="w-6 h-6 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Purchase Records ({filteredPurchases.length})
            </h3>
          </div>

          {filteredPurchases.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Purchases Found</h3>
              <p className="text-slate-600">Try adjusting your filters or add a new purchase record.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Purchased By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{purchase.asset_name}</div>
                        {purchase.notes && (
                          <div className="text-sm text-slate-500 truncate max-w-xs">{purchase.notes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          purchase.category === 'Weapons' ? 'bg-red-100 text-red-800' :
                          purchase.category === 'Vehicles' ? 'bg-blue-100 text-blue-800' :
                          purchase.category === 'Medical' ? 'bg-green-100 text-green-800' :
                          purchase.category === 'Communication' ? 'bg-purple-100 text-purple-800' :
                          purchase.category === 'Ammunition' ? 'bg-orange-100 text-orange-800' :
                          purchase.category === 'Food' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {purchase.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {purchase.quantity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        ${purchase.unit_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                        ${purchase.total_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatDate(purchase.purchase_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {purchase.vendor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {purchase.purchased_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Purchase Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">Record New Purchase</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Asset</label>
                    <select
                      value={formData.asset_id}
                      onChange={(e) => setFormData({...formData, asset_id: e.target.value})}
                      className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
                      required
                    >
                      <option value="">Select Asset</option>
                      {assets.map(asset => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.unit_price}
                      onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                      className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Purchase Date</label>
                    <input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
                      className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Vendor</label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                      className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
                      placeholder="Enter vendor name"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="block w-full border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 px-3 py-2"
                      placeholder="Enter any additional notes..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Recording...' : 'Record Purchase'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
