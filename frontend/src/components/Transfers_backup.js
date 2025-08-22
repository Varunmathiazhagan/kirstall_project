import React, { useState, useEffect } from 'react';

const Transfers = ({ token, user }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
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

  // Mock data for demonstration since we don't have database
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
    { id: 8, name: 'Body Armor Vests', serial_number: 'BA456123', base_id: 1 },
    { id: 9, name: 'Portable Generators', serial_number: 'PG789456', base_id: 1 },
    { id: 10, name: 'Biometric Scanner Systems', serial_number: 'BS321654', base_id: 4 },
    { id: 11, name: 'Naval Sonar Equipment', serial_number: 'NS654987', base_id: 5 },
    { id: 12, name: 'Training Simulators', serial_number: 'TS159753', base_id: 4 },
    { id: 13, name: 'LAV-25 Light Armored Vehicle', serial_number: 'LV852963', base_id: 2 },
    { id: 14, name: 'Surgical Equipment Set', serial_number: 'SE741852', base_id: 5 },
    { id: 15, name: 'Radar Detection System', serial_number: 'RD963741', base_id: 3 },
    { id: 16, name: 'Field Computer Toughbook', serial_number: 'FC852741', base_id: 2 },
    { id: 17, name: 'Tactical Gear Set', serial_number: 'TG963852', base_id: 1 },
    { id: 18, name: 'Ammunition 5.56mm', serial_number: 'AM741963', base_id: 1 },
    { id: 19, name: 'Combat Helmets', serial_number: 'CH159357', base_id: 2 },
    { id: 20, name: 'Grenade Launchers M203', serial_number: 'GL357159', base_id: 1 }
  ];

  useEffect(() => {
    // Simulate API call with mock data
    setTimeout(() => {
      const mockTransfers = [
        {
          id: 1,
          asset_name: 'M4A1 Carbine',
          asset_serial: 'SN123456',
          from_base: 'Fort Alpha',
          to_base: 'Base Beta',
          status: 'pending',
          reason: 'Unit deployment to Beta sector',
          requested_by: 'Alpha Logistics',
          requested_date: '2025-08-20',
          approved_by: null,
          completed_date: null
        },
        {
          id: 2,
          asset_name: 'Night Vision Goggles AN/PVS-14',
          asset_serial: 'NV345678',
          from_base: 'Fort Alpha',
          to_base: 'Station Gamma',
          status: 'approved',
          reason: 'Special operations mission requirements',
          requested_by: 'Alpha Commander',
          requested_date: '2025-08-19',
          approved_by: 'Administrator',
          completed_date: null
        },
        {
          id: 3,
          asset_name: 'Medical Kit Advanced',
          asset_serial: 'MD789012',
          from_base: 'Base Beta',
          to_base: 'Camp Delta',
          status: 'completed',
          reason: 'Emergency medical supply redistribution',
          requested_by: 'Beta Medical',
          requested_date: '2025-08-18',
          approved_by: 'Beta Commander',
          completed_date: '2025-08-19'
        },
        {
          id: 4,
          asset_name: 'Drone DJI Matrice 300',
          asset_serial: 'DR456789',
          from_base: 'Station Gamma',
          to_base: 'Naval Base Echo',
          status: 'pending',
          reason: 'Naval reconnaissance operations',
          requested_by: 'Gamma Tech',
          requested_date: '2025-08-20',
          approved_by: null,
          completed_date: null
        },
        {
          id: 5,
          asset_name: 'Field Radio AN/PRC-152',
          asset_serial: 'RD123789',
          from_base: 'Fort Alpha',
          to_base: 'Camp Delta',
          status: 'approved',
          reason: 'Training exercise communication needs',
          requested_by: 'Alpha Communications',
          requested_date: '2025-08-19',
          approved_by: 'Administrator',
          completed_date: null
        },
        {
          id: 6,
          asset_name: 'Humvee M1151',
          asset_serial: 'VH789012',
          from_base: 'Base Beta',
          to_base: 'Fort Alpha',
          status: 'completed',
          reason: 'Vehicle rotation for maintenance',
          requested_by: 'Beta Maintenance',
          requested_date: '2025-08-17',
          approved_by: 'Administrator',
          completed_date: '2025-08-18'
        },
        {
          id: 7,
          asset_name: 'Satellite Communication System',
          asset_serial: 'SC987654',
          from_base: 'Station Gamma',
          to_base: 'Naval Base Echo',
          status: 'approved',
          reason: 'Maritime operations communication upgrade',
          requested_by: 'Gamma Communications',
          requested_date: '2025-08-18',
          approved_by: 'Gamma Commander',
          completed_date: null
        },
        {
          id: 8,
          asset_name: 'Body Armor Vests',
          asset_serial: 'BA456123',
          from_base: 'Fort Alpha',
          to_base: 'Base Beta',
          status: 'pending',
          reason: 'Armor upgrade for patrol units',
          requested_by: 'Alpha Quartermaster',
          requested_date: '2025-08-20',
          approved_by: null,
          completed_date: null
        },
        {
          id: 9,
          asset_name: 'Portable Generators',
          asset_serial: 'PG789456',
          from_base: 'Fort Alpha',
          to_base: 'Station Gamma',
          status: 'completed',
          reason: 'Power supply for remote operations',
          requested_by: 'Alpha Engineering',
          requested_date: '2025-08-16',
          approved_by: 'Administrator',
          completed_date: '2025-08-17'
        },
        {
          id: 10,
          asset_name: 'Biometric Scanner Systems',
          asset_serial: 'BS321654',
          from_base: 'Camp Delta',
          to_base: 'Naval Base Echo',
          status: 'approved',
          reason: 'Security checkpoint upgrade',
          requested_by: 'Delta Security',
          requested_date: '2025-08-19',
          approved_by: 'Delta Commander',
          completed_date: null
        },
        {
          id: 11,
          asset_name: 'Naval Sonar Equipment',
          asset_serial: 'NS654987',
          from_base: 'Naval Base Echo',
          to_base: 'Station Gamma',
          status: 'pending',
          reason: 'Coastal surveillance enhancement',
          requested_by: 'Echo Naval Ops',
          requested_date: '2025-08-20',
          approved_by: null,
          completed_date: null
        },
        {
          id: 12,
          asset_name: 'Training Simulators',
          asset_serial: 'TS159753',
          from_base: 'Camp Delta',
          to_base: 'Fort Alpha',
          status: 'completed',
          reason: 'Advanced training program deployment',
          requested_by: 'Delta Training',
          requested_date: '2025-08-15',
          approved_by: 'Administrator',
          completed_date: '2025-08-16'
        },
        {
          id: 13,
          asset_name: 'LAV-25 Light Armored Vehicle',
          asset_serial: 'LV852963',
          from_base: 'Base Beta',
          to_base: 'Naval Base Echo',
          status: 'approved',
          reason: 'Amphibious operations support',
          requested_by: 'Beta Commander',
          requested_date: '2025-08-18',
          approved_by: 'Administrator',
          completed_date: null
        },
        {
          id: 14,
          asset_name: 'Surgical Equipment Set',
          asset_serial: 'SE741852',
          from_base: 'Naval Base Echo',
          to_base: 'Camp Delta',
          status: 'completed',
          reason: 'Medical facility enhancement',
          requested_by: 'Echo Medical',
          requested_date: '2025-08-14',
          approved_by: 'Echo Commander',
          completed_date: '2025-08-15'
        },
        {
          id: 15,
          asset_name: 'Radar Detection System',
          asset_serial: 'RD963741',
          from_base: 'Station Gamma',
          to_base: 'Fort Alpha',
          status: 'pending',
          reason: 'Perimeter security upgrade',
          requested_by: 'Gamma Electronics',
          requested_date: '2025-08-19',
          approved_by: null,
          completed_date: null
        }
      ];
      setTransfers(mockTransfers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      const newTransfer = {
        id: transfers.length + 1,
        asset_name: mockAssets.find(a => a.id === parseInt(formData.asset_id))?.name || 'Unknown Asset',
        asset_serial: mockAssets.find(a => a.id === parseInt(formData.asset_id))?.serial_number || 'Unknown',
        from_base: mockBases.find(b => b.id === parseInt(formData.from_base_id))?.name || 'Unknown Base',
        to_base: mockBases.find(b => b.id === parseInt(formData.to_base_id))?.name || 'Unknown Base',
        status: 'pending',
        reason: formData.reason,
        requested_by: user?.username || 'Unknown User',
        requested_date: new Date().toISOString().split('T')[0],
        approved_by: null,
        completed_date: null
      };

      setTransfers([newTransfer, ...transfers]);
      setShowForm(false);
      setFormData({
        asset_id: '',
        from_base_id: user?.base_id || '',
        to_base_id: '',
        reason: '',
        requested_by: user?.id || ''
      });
    } catch (error) {
      setError('Failed to submit transfer request');
    }
    setLoading(false);
  };

  const handleApprove = async (transferId) => {
    if (user?.role !== 'admin' && user?.role !== 'base_commander') {
      setError('You do not have permission to approve transfers');
      return;
    }

    try {
      setTransfers(transfers.map(transfer => 
        transfer.id === transferId 
          ? { ...transfer, status: 'approved', approved_by: user.username }
          : transfer
      ));
    } catch (error) {
      setError('Failed to approve transfer');
    }
  };

  const handleComplete = async (transferId) => {
    if (user?.role !== 'admin' && user?.role !== 'base_commander') {
      setError('You do not have permission to complete transfers');
      return;
    }

    try {
      setTransfers(transfers.map(transfer => 
        transfer.id === transferId 
          ? { ...transfer, status: 'completed', completed_date: new Date().toISOString().split('T')[0] }
          : transfer
      ));
    } catch (error) {
      setError('Failed to complete transfer');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransfers = transfers.filter(transfer => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'base_commander') {
      return transfer.from_base === mockBases.find(b => b.id === user.base_id)?.name ||
             transfer.to_base === mockBases.find(b => b.id === user.base_id)?.name;
    }
    return transfer.requested_by === user?.username;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Asset Transfers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <span>Request Transfer</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Request Asset Transfer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                <select
                  value={formData.asset_id}
                  onChange={(e) => setFormData({...formData, asset_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Asset</option>
                  {mockAssets
                    .filter(asset => user?.role === 'admin' || asset.base_id === user?.base_id)
                    .map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} - {asset.serial_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Base</label>
                <select
                  value={formData.from_base_id}
                  onChange={(e) => setFormData({...formData, from_base_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Base</option>
                  {mockBases.map(base => (
                    <option key={base.id} value={base.id}>
                      {base.name} - {base.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Base</label>
                <select
                  value={formData.to_base_id}
                  onChange={(e) => setFormData({...formData, to_base_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Base</option>
                  {mockBases
                    .filter(base => base.id !== parseInt(formData.from_base_id))
                    .map(base => (
                    <option key={base.id} value={base.id}>
                      {base.name} - {base.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                  placeholder="Enter reason for transfer..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTransfers.length === 0 ? (
            <li className="p-6 text-center text-gray-500">
              No transfers found. {user?.role === 'logistics_officer' ? 'Request your first transfer above.' : 'No transfers to display.'}
            </li>
          ) : (
            filteredTransfers.map(transfer => (
              <li key={transfer.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {transfer.asset_name} ({transfer.asset_serial})
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transfer.status)}`}>
                        {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">From:</span> {transfer.from_base}
                      </div>
                      <div>
                        <span className="font-medium">To:</span> {transfer.to_base}
                      </div>
                      <div>
                        <span className="font-medium">Requested by:</span> {transfer.requested_by}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {transfer.requested_date}
                      </div>
                      {transfer.approved_by && (
                        <div>
                          <span className="font-medium">Approved by:</span> {transfer.approved_by}
                        </div>
                      )}
                      {transfer.completed_date && (
                        <div>
                          <span className="font-medium">Completed:</span> {transfer.completed_date}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {transfer.reason}
                    </div>
                  </div>

                  {(user?.role === 'admin' || user?.role === 'base_commander') && (
                    <div className="ml-4 flex space-x-2">
                      {transfer.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(transfer.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                      )}
                      {transfer.status === 'approved' && (
                        <button
                          onClick={() => handleComplete(transfer.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Transfers;