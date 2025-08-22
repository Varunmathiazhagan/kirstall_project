import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const AssignmentsExpenditures = ({ token, user, onNavigate }) => {
  console.log('AssignmentsExpenditures user data:', user);
  
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showExpenditureForm, setShowExpenditureForm] = useState(false);
  const [assets, setAssets] = useState([]);
  
  // New state for enhanced functionality
  const [showAssignmentDetails, setShowAssignmentDetails] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  
  const [assignmentFormData, setAssignmentFormData] = useState({
    asset_id: '',
    personnel_name: '',
    personnel_rank: '',
    assignment_date: new Date().toISOString().split('T')[0],
    return_date: '',
    purpose: '',
    notes: ''
  });

  const [expenditureFormData, setExpenditureFormData] = useState({
    asset_id: '',
    quantity_used: '',
    expenditure_date: new Date().toISOString().split('T')[0],
    purpose: '',
    cost_per_unit: '',
    notes: ''
  });

  const [filters, setFilters] = useState({
    category: '',
    start_date: '',
    end_date: '',
    status: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock assignments data
        const mockAssignments = [
          {
            id: 1,
            asset_name: 'M4A1 Carbine',
            asset_serial: 'SN123456',
            personnel_name: 'Sergeant Johnson',
            personnel_rank: 'E-5',
            assignment_date: '2025-08-18',
            return_date: '2025-09-15',
            purpose: 'Training Exercise Alpha',
            status: 'active',
            notes: 'Standard issue for combat training',
            assigned_by: 'Alpha Logistics',
            base_name: 'Fort Alpha'
          },
          {
            id: 2,
            asset_name: 'Night Vision Goggles AN/PVS-14',
            asset_serial: 'NV345678',
            personnel_name: 'Corporal Martinez',
            personnel_rank: 'E-4',
            assignment_date: '2025-08-19',
            return_date: '2025-08-25',
            purpose: 'Night Operations Mission',
            status: 'active',
            notes: 'Special operations deployment',
            assigned_by: 'Alpha Commander',
            base_name: 'Fort Alpha'
          },
          {
            id: 3,
            asset_name: 'Field Radio AN/PRC-152',
            asset_serial: 'RD123789',
            personnel_name: 'Staff Sergeant Wilson',
            personnel_rank: 'E-6',
            assignment_date: '2025-08-15',
            return_date: '2025-08-22',
            purpose: 'Communications Training',
            status: 'returned',
            notes: 'Successfully completed training program',
            assigned_by: 'Alpha Communications',
            base_name: 'Fort Alpha'
          },
          {
            id: 4,
            asset_name: 'Body Armor Vests',
            asset_serial: 'BA456123',
            personnel_name: 'Private Thompson',
            personnel_rank: 'E-2',
            assignment_date: '2025-08-20',
            return_date: '2025-09-20',
            purpose: 'Basic Combat Training',
            status: 'active',
            notes: 'New recruit equipment assignment',
            assigned_by: 'Beta Quartermaster',
            base_name: 'Base Beta'
          },
          {
            id: 5,
            asset_name: 'Drone DJI Matrice 300',
            asset_serial: 'DR456789',
            personnel_name: 'Lieutenant Garcia',
            personnel_rank: 'O-2',
            assignment_date: '2025-08-17',
            return_date: '2025-08-30',
            purpose: 'Reconnaissance Mission',
            status: 'active',
            notes: 'Aerial surveillance operations',
            assigned_by: 'Gamma Tech',
            base_name: 'Station Gamma'
          },
          {
            id: 6,
            asset_name: 'Biometric Scanner Systems',
            asset_serial: 'BS321654',
            personnel_name: 'Sergeant Davis',
            personnel_rank: 'E-5',
            assignment_date: '2025-08-16',
            return_date: '2025-08-23',
            purpose: 'Security Checkpoint Operations',
            status: 'returned',
            notes: 'Security enhancement project completed',
            assigned_by: 'Delta Security',
            base_name: 'Camp Delta'
          }
        ];

        // Mock expenditures data
        const mockExpenditures = [
          {
            id: 1,
            asset_name: 'Ammunition 5.56mm',
            category: 'Weapons',
            quantity_used: 500,
            cost_per_unit: 0.75,
            total_cost: 375.00,
            expenditure_date: '2025-08-20',
            purpose: 'Live Fire Training Exercise',
            notes: 'Marksmanship qualification training',
            expended_by: 'Alpha Training',
            base_name: 'Fort Alpha'
          },
          {
            id: 2,
            asset_name: 'Medical Supplies',
            category: 'Medical',
            quantity_used: 25,
            cost_per_unit: 15.00,
            total_cost: 375.00,
            expenditure_date: '2025-08-19',
            purpose: 'First Aid Training',
            notes: 'Combat lifesaver course supplies',
            expended_by: 'Alpha Medical',
            base_name: 'Fort Alpha'
          },
          {
            id: 3,
            asset_name: 'Fuel - Diesel',
            category: 'Vehicles',
            quantity_used: 200,
            cost_per_unit: 3.25,
            total_cost: 650.00,
            expenditure_date: '2025-08-18',
            purpose: 'Vehicle Operations',
            notes: 'Monthly fuel consumption for fleet',
            expended_by: 'Beta Motor Pool',
            base_name: 'Base Beta'
          },
          {
            id: 4,
            asset_name: 'Communication Batteries',
            category: 'Communication',
            quantity_used: 150,
            cost_per_unit: 8.50,
            total_cost: 1275.00,
            expenditure_date: '2025-08-17',
            purpose: 'Field Operations',
            notes: 'Radio equipment power supply',
            expended_by: 'Gamma Communications',
            base_name: 'Station Gamma'
          },
          {
            id: 5,
            asset_name: 'Training Ammunition - Blank',
            category: 'Weapons',
            quantity_used: 1000,
            cost_per_unit: 0.45,
            total_cost: 450.00,
            expenditure_date: '2025-08-16',
            purpose: 'Combat Training Exercise',
            notes: 'Simulated combat scenarios',
            expended_by: 'Delta Training',
            base_name: 'Camp Delta'
          },
          {
            id: 6,
            asset_name: 'Emergency Flares',
            category: 'Equipment',
            quantity_used: 30,
            cost_per_unit: 12.00,
            total_cost: 360.00,
            expenditure_date: '2025-08-15',
            purpose: 'Naval Operations',
            notes: 'Search and rescue training',
            expended_by: 'Echo Naval Ops',
            base_name: 'Naval Base Echo'
          },
          {
            id: 7,
            asset_name: 'MRE (Meals Ready to Eat)',
            category: 'Equipment',
            quantity_used: 200,
            cost_per_unit: 9.50,
            total_cost: 1900.00,
            expenditure_date: '2025-08-14',
            purpose: 'Field Training Exercise',
            notes: 'Extended field operations rations',
            expended_by: 'Alpha Logistics',
            base_name: 'Fort Alpha'
          },
          {
            id: 8,
            asset_name: 'Maintenance Parts',
            category: 'Vehicles',
            quantity_used: 45,
            cost_per_unit: 25.00,
            total_cost: 1125.00,
            expenditure_date: '2025-08-13',
            purpose: 'Vehicle Maintenance',
            notes: 'Routine maintenance and repairs',
            expended_by: 'Beta Maintenance',
            base_name: 'Base Beta'
          }
        ];

        // Mock assets data - adding comprehensive asset list
        const mockAssets = [
          { id: 1, name: 'M4A1 Carbine', category: 'Weapons', base_id: 'base1', quantity: 25 },
          { id: 2, name: 'Night Vision Goggles AN/PVS-14', category: 'Equipment', base_id: 'base1', quantity: 15 },
          { id: 3, name: 'Field Radio AN/PRC-152', category: 'Communication', base_id: 'base1', quantity: 30 },
          { id: 4, name: 'Body Armor Vests', category: 'Equipment', base_id: 'base1', quantity: 40 },
          { id: 5, name: 'Drone DJI Matrice 300', category: 'Equipment', base_id: 'base1', quantity: 5 },
          { id: 6, name: 'Biometric Scanner Systems', category: 'Equipment', base_id: 'base1', quantity: 8 },
          { id: 7, name: 'Ammunition 5.56mm', category: 'Weapons', base_id: 'base1', quantity: 1000 },
          { id: 8, name: 'Medical Supplies', category: 'Medical', base_id: 'base1', quantity: 50 },
          { id: 9, name: 'Fuel - Diesel', category: 'Vehicles', base_id: 'base1', quantity: 200 },
          { id: 10, name: 'Communication Batteries', category: 'Communication', base_id: 'base1', quantity: 75 },
          { id: 11, name: 'Training Ammunition - Blank', category: 'Weapons', base_id: 'base1', quantity: 500 },
          { id: 12, name: 'Emergency Flares', category: 'Equipment', base_id: 'base1', quantity: 20 },
          { id: 13, name: 'MRE (Meals Ready to Eat)', category: 'Equipment', base_id: 'base1', quantity: 300 },
          { id: 14, name: 'Maintenance Parts', category: 'Vehicles', base_id: 'base1', quantity: 100 },
          // Additional assets for testing
          { id: 15, name: 'AK47 Rifle', category: 'Weapons', base_id: 'base1', quantity: 35 },
          { id: 16, name: 'Tactical Helmet', category: 'Equipment', base_id: 'base1', quantity: 45 },
          { id: 17, name: 'GPS Device', category: 'Communication', base_id: 'base1', quantity: 20 },
          { id: 18, name: 'First Aid Kit', category: 'Medical', base_id: 'base1', quantity: 60 }
        ];

        // Filter data based on user role
        let filteredAssignments = mockAssignments;
        let filteredExpenditures = mockExpenditures;
        
        if (user?.role !== 'admin') {
          filteredAssignments = mockAssignments.filter(assignment => 
            assignment.base_name === (user?.base_name || 'Fort Alpha')
          );
          filteredExpenditures = mockExpenditures.filter(expenditure => 
            expenditure.base_name === (user?.base_name || 'Fort Alpha')
          );
        }

        // Apply additional filters
        if (filters.category) {
          filteredAssignments = filteredAssignments.filter(assignment => 
            assignment.asset_name.toLowerCase().includes(filters.category.toLowerCase())
          );
          filteredExpenditures = filteredExpenditures.filter(expenditure => 
            expenditure.category.toLowerCase().includes(filters.category.toLowerCase())
          );
        }
        
        if (filters.status) {
          filteredAssignments = filteredAssignments.filter(assignment => 
            assignment.status === filters.status
          );
        }
        
        if (filters.start_date) {
          filteredAssignments = filteredAssignments.filter(assignment => 
            assignment.assignment_date >= filters.start_date
          );
          filteredExpenditures = filteredExpenditures.filter(expenditure => 
            expenditure.expenditure_date >= filters.start_date
          );
        }
        
        if (filters.end_date) {
          filteredAssignments = filteredAssignments.filter(assignment => 
            assignment.assignment_date <= filters.end_date
          );
          filteredExpenditures = filteredExpenditures.filter(expenditure => 
            expenditure.expenditure_date <= filters.end_date
          );
        }

        setAssignments(filteredAssignments);
        setExpenditures(filteredExpenditures);
        setAssets(mockAssets);
        setError(null);
      } catch (error) {
        console.error('Data fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, filters, activeTab]);

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    
    const isEditing = editingAssignment !== null;
    console.log(`Assignment form submission started - ${isEditing ? 'Editing' : 'Creating'}`);
    console.log('Form data:', assignmentFormData);
    console.log('Editing assignment:', editingAssignment);
    
    if (!assignmentFormData.asset_id || !assignmentFormData.personnel_name) {
      const errorMsg = 'Please fill in all required fields';
      console.log('Validation failed:', errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setLoading(true);
      
      // Find the selected asset
      console.log('Looking for asset with ID:', assignmentFormData.asset_id, typeof assignmentFormData.asset_id);
      const selectedAsset = assets.find(asset => {
        console.log('Comparing asset:', asset.id, typeof asset.id, 'with form ID:', assignmentFormData.asset_id, typeof assignmentFormData.asset_id);
        return asset.id === parseInt(assignmentFormData.asset_id);
      });
      
      console.log('Selected asset:', selectedAsset);

      if (!selectedAsset) {
        throw new Error('Selected asset not found');
      }
      
      if (isEditing) {
        // Update existing assignment
        const updatedAssignment = {
          ...editingAssignment,
          asset_id: parseInt(assignmentFormData.asset_id),
          asset_name: selectedAsset.name,
          asset_category: selectedAsset.category,
          personnel_name: assignmentFormData.personnel_name,
          personnel_rank: assignmentFormData.personnel_rank,
          assignment_date: assignmentFormData.assignment_date,
          expected_return_date: assignmentFormData.return_date || null,
          return_date: assignmentFormData.return_date || 'Not specified',
          purpose: assignmentFormData.purpose || 'Not specified',
          notes: assignmentFormData.notes || '',
          // Keep existing status and other fields
        };
        
        console.log('Updated assignment:', updatedAssignment);
        
        // Update in the assignments list
        setAssignments(prev => prev.map(assignment => 
          assignment.id === editingAssignment.id ? updatedAssignment : assignment
        ));
        
        toast.success('Assignment updated successfully!');
      } else {
        // Create new assignment
        if (!selectedAsset) {
          throw new Error(`Selected asset not found. Asset ID: ${assignmentFormData.asset_id}, Available assets: ${assets.length}`);
        }
        
        // Create a new assignment with mock data
        const newAssignment = {
          id: Date.now(), // Simple ID generation
          asset_id: assignmentFormData.asset_id,
          asset_name: selectedAsset.name,
          asset_category: selectedAsset.category,
          personnel_name: assignmentFormData.personnel_name,
          personnel_rank: assignmentFormData.personnel_rank || 'Not specified',
          assignment_date: assignmentFormData.assignment_date,
          return_date: assignmentFormData.return_date || 'Not specified',
          purpose: assignmentFormData.purpose || 'Not specified',
          notes: assignmentFormData.notes || '',
          status: 'Active',
          base_name: user?.base_name || 'Base Alpha',
          assigned_by: user?.username || 'System'
        };
        
        console.log('New assignment created:', newAssignment);
        
        // Add to current assignments list
        setAssignments(prev => {
          console.log('Previous assignments:', prev);
          const updated = [newAssignment, ...prev];
          console.log('Updated assignments:', updated);
          return updated;
        });
        
        toast.success('Assignment created successfully!');
      }
      
      // Reset form and close modal
      setAssignmentFormData({
        asset_id: '',
        personnel_name: '',
        personnel_rank: '',
        assignment_date: new Date().toISOString().split('T')[0],
        return_date: '',
        purpose: '',
        notes: ''
      });
      setEditingAssignment(null);
      setShowAssignmentForm(false);
      setError(null);
      
    } catch (error) {
      console.error('Assignment creation error:', error);
      setError(error.message);
      toast.error(`Failed to create assignment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Assignment action handlers
  const handleViewAssignment = (assignment) => {
    const selectedAsset = assets.find(asset => asset.id === parseInt(assignment.asset_id));
    
    const details = {
      id: assignment.id,
      asset: {
        name: assignment.asset_name,
        category: assignment.asset_category,
        serial_number: selectedAsset?.serial_number || 'N/A'
      },
      personnel: {
        name: assignment.personnel_name,
        rank: assignment.personnel_rank,
        id: assignment.personnel_id || 'N/A'
      },
      dates: {
        assignment: assignment.assignment_date,
        expected_return: assignment.expected_return_date,
        actual_return: assignment.actual_return_date
      },
      purpose: assignment.purpose,
      notes: assignment.notes,
      status: assignment.status,
      assigned_by: assignment.assigned_by,
      base: assignment.base_name
    };
    
    setSelectedAssignment(details);
    setShowAssignmentDetails(true);
  };

  const handleEditAssignment = (assignment) => {
    setAssignmentFormData({
      asset_id: assignment.asset_id.toString(),
      personnel_name: assignment.personnel_name,
      personnel_rank: assignment.personnel_rank,
      assignment_date: assignment.assignment_date,
      return_date: assignment.expected_return_date || '',
      purpose: assignment.purpose,
      notes: assignment.notes || ''
    });
    setEditingAssignment(assignment);
    setShowAssignmentForm(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      return;
    }

    try {
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
      toast.success('Assignment deleted successfully!');
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  const handleReturnAsset = async (assignmentId) => {
    try {
      const returnDate = new Date().toISOString().split('T')[0];
      
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { 
              ...assignment, 
              status: 'Returned', 
              actual_return_date: returnDate 
            }
          : assignment
      ));
      
      toast.success('Asset marked as returned successfully!');
    } catch (error) {
      console.error('Error returning asset:', error);
      toast.error('Failed to mark asset as returned');
    }
  };

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: newStatus }
          : assignment
      ));
      
      toast.success(`Assignment status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update assignment status');
    }
  };

  const handleExpenditureSubmit = async (e) => {
    e.preventDefault();
    
    if (!expenditureFormData.asset_id || !expenditureFormData.quantity_used) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Since backend expenditure routes are not properly set up for MongoDB,
      // we'll simulate the expenditure creation with mock data
      
      // Find the selected asset
      const selectedAsset = assets.find(asset => asset.id === parseInt(expenditureFormData.asset_id));
      
      if (!selectedAsset) {
        throw new Error('Selected asset not found');
      }
      
      // Create a new expenditure with mock data
      const newExpenditure = {
        id: Date.now(), // Simple ID generation
        asset_id: expenditureFormData.asset_id,
        asset_name: selectedAsset.name,
        category: selectedAsset.category,
        quantity_used: parseInt(expenditureFormData.quantity_used),
        expenditure_date: expenditureFormData.expenditure_date,
        purpose: expenditureFormData.purpose || 'Not specified',
        cost_per_unit: parseFloat(expenditureFormData.cost_per_unit) || 0,
        total_cost: (parseFloat(expenditureFormData.cost_per_unit) || 0) * parseInt(expenditureFormData.quantity_used),
        notes: expenditureFormData.notes || '',
        base_name: user?.base_name || 'Base Alpha',
        recorded_by: user?.username || 'System'
      };
      
      // Add to current expenditures list
      setExpenditures(prev => [newExpenditure, ...prev]);
      
      // Reset form and close modal
      setExpenditureFormData({
        asset_id: '',
        quantity_used: '',
        expenditure_date: new Date().toISOString().split('T')[0],
        purpose: '',
        cost_per_unit: '',
        notes: ''
      });
      setShowExpenditureForm(false);
      setError(null);
      
      // Show success message
      console.log('Expenditure recorded successfully:', newExpenditure);
      toast.success('Expenditure recorded successfully!');
      
    } catch (error) {
      console.error('Expenditure creation error:', error);
      setError(error.message);
      toast.error(`Failed to record expenditure: ${error.message}`);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'assigned': 'bg-blue-100 text-blue-800',
      'returned': 'bg-green-100 text-green-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canManageAssignments = user?.role === 'admin' || user?.role === 'base_commander' || user?.role === 'logistics_officer';

  if (loading && assignments.length === 0 && expenditures.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments & Expenditures</h1>
            <p className="text-gray-600">Manage personnel assignments and asset expenditures</p>
          </div>
          <div className="flex space-x-3">
            {canManageAssignments && (
              <>
                <button
                  onClick={() => {
                    setEditingAssignment(null);
                    setAssignmentFormData({
                      asset_id: '',
                      personnel_name: '',
                      personnel_rank: '',
                      assignment_date: new Date().toISOString().split('T')[0],
                      return_date: '',
                      purpose: '',
                      notes: ''
                    });
                    setShowAssignmentForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
                </button>
                <button
                  onClick={() => setShowExpenditureForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Record Expenditure
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Personnel Assignments
            </button>
            <button
              onClick={() => setActiveTab('expenditures')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'expenditures'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Asset Expenditures
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Types</option>
                <option value="Weapons">Weapons</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Ammunition">Ammunition</option>
                <option value="Communication">Communication</option>
                <option value="Medical">Medical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {activeTab === 'assignments' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="assigned">Assigned</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Assignment Form Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Personnel Assignment</h3>
              <button
                onClick={() => setShowAssignmentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                <select
                  name="asset_id"
                  value={assignmentFormData.asset_id}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, asset_id: e.target.value }))}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Asset</option>
                  {assets.filter(asset => {
                    console.log('Asset filter debug:', { 
                      assetBaseId: asset.base_id, 
                      userBaseId: user?.base_id, 
                      quantity: asset.quantity,
                      assetName: asset.name,
                      userRole: user?.role
                    });
                    // Temporarily show all assets with quantity > 0 for debugging
                    return asset.quantity > 0;
                  }).map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.category}) - Available: {asset.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personnel Name</label>
                  <input
                    type="text"
                    name="personnel_name"
                    value={assignmentFormData.personnel_name}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, personnel_name: e.target.value }))}
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                  <input
                    type="text"
                    name="personnel_rank"
                    value={assignmentFormData.personnel_rank}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, personnel_rank: e.target.value }))}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Sergeant, Lieutenant"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Date</label>
                  <input
                    type="date"
                    name="assignment_date"
                    value={assignmentFormData.assignment_date}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, assignment_date: e.target.value }))}
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return Date</label>
                  <input
                    type="date"
                    name="return_date"
                    value={assignmentFormData.return_date}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, return_date: e.target.value }))}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={assignmentFormData.purpose}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Training Exercise, Field Operation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={assignmentFormData.notes}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Additional notes or instructions..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignmentForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (editingAssignment ? 'Updating...' : 'Creating...') : (editingAssignment ? 'Update Assignment' : 'Create Assignment')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expenditure Form Modal */}
      {showExpenditureForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Record Asset Expenditure</h3>
              <button
                onClick={() => setShowExpenditureForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleExpenditureSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                <select
                  name="asset_id"
                  value={expenditureFormData.asset_id}
                  onChange={(e) => setExpenditureFormData(prev => ({ ...prev, asset_id: e.target.value }))}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Asset</option>
                  {assets.filter(asset => {
                    // Temporarily show all assets with quantity > 0 for debugging
                    return asset.quantity > 0;
                  }).map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.category}) - Available: {asset.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Used</label>
                  <input
                    type="number"
                    name="quantity_used"
                    value={expenditureFormData.quantity_used}
                    onChange={(e) => setExpenditureFormData(prev => ({ ...prev, quantity_used: e.target.value }))}
                    min="1"
                    required
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit</label>
                  <input
                    type="number"
                    name="cost_per_unit"
                    value={expenditureFormData.cost_per_unit}
                    onChange={(e) => setExpenditureFormData(prev => ({ ...prev, cost_per_unit: e.target.value }))}
                    step="0.01"
                    min="0"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expenditure Date</label>
                <input
                  type="date"
                  name="expenditure_date"
                  value={expenditureFormData.expenditure_date}
                  onChange={(e) => setExpenditureFormData(prev => ({ ...prev, expenditure_date: e.target.value }))}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={expenditureFormData.purpose}
                  onChange={(e) => setExpenditureFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Training, Operation, Maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={expenditureFormData.notes}
                  onChange={(e) => setExpenditureFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows="3"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Additional details about the expenditure..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowExpenditureForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Recording...' : 'Record Expenditure'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {activeTab === 'assignments' ? (
            <>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Personnel Assignments</h3>
              
              {assignments.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first assignment.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assignments.map((assignment) => (
                        <tr key={assignment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{assignment.asset_name}</div>
                              <div className="text-sm text-gray-500">{assignment.asset_category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{assignment.personnel_name}</div>
                              <div className="text-sm text-gray-500">{assignment.personnel_rank}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(assignment.assignment_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {assignment.expected_return_date ? formatDate(assignment.expected_return_date) : 'Not specified'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {assignment.purpose}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {/* View Details Button */}
                              <button
                                onClick={() => handleViewAssignment(assignment)}
                                className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                                title="View Details"
                              >
                                View
                              </button>
                              
                              {/* Edit Button - only for active assignments */}
                              {assignment.status === 'Active' && canManageAssignments && (
                                <button
                                  onClick={() => handleEditAssignment(assignment)}
                                  className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-50"
                                  title="Edit Assignment"
                                >
                                  Edit
                                </button>
                              )}
                              
                              {/* Return Asset Button - only for active assignments */}
                              {assignment.status === 'Active' && canManageAssignments && (
                                <button
                                  onClick={() => handleReturnAsset(assignment.id)}
                                  className="text-green-600 hover:text-green-900 font-medium px-2 py-1 rounded border border-green-200 hover:bg-green-50"
                                  title="Mark as Returned"
                                >
                                  Return
                                </button>
                              )}
                              
                              {/* Status Update Dropdown - for managers */}
                              {canManageAssignments && assignment.status !== 'Returned' && (
                                <select
                                  value={assignment.status}
                                  onChange={(e) => handleStatusUpdate(assignment.id, e.target.value)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  title="Update Status"
                                >
                                  <option value="Active">Active</option>
                                  <option value="On Hold">On Hold</option>
                                  <option value="Extended">Extended</option>
                                  <option value="Overdue">Overdue</option>
                                </select>
                              )}
                              
                              {/* Delete Button - with proper authorization */}
                              {canManageAssignments && (
                                <button
                                  onClick={() => handleDeleteAssignment(assignment.id)}
                                  className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                                  title="Delete Assignment"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Asset Expenditures</h3>
              
              {expenditures.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No expenditures found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by recording your first expenditure.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Used</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost per Unit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expenditures.map((expenditure) => (
                        <tr key={expenditure.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{expenditure.asset_name}</div>
                              <div className="text-sm text-gray-500">{expenditure.asset_category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expenditure.quantity_used}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expenditure.cost_per_unit ? formatCurrency(expenditure.cost_per_unit) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expenditure.total_cost ? formatCurrency(expenditure.total_cost) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(expenditure.expenditure_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expenditure.purpose}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {expenditure.recorded_by_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {/* Handle view expenditure */}}
                                className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                                title="View Details"
                              >
                                View
                              </button>
                              {canManageAssignments && (
                                <>
                                  <button
                                    onClick={() => {/* Handle edit expenditure */}}
                                    className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1 rounded border border-indigo-200 hover:bg-indigo-50"
                                    title="Edit Expenditure"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {/* Handle delete expenditure */}}
                                    className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                                    title="Delete Expenditure"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Assignment Details Modal */}
      {showAssignmentDetails && selectedAssignment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Assignment Details
                </h3>
                <button
                  onClick={() => setShowAssignmentDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Asset Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Asset Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Name:</span>
                      <p className="text-gray-900">{selectedAssignment.asset?.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Category:</span>
                      <p className="text-gray-900">{selectedAssignment.asset?.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Serial Number:</span>
                      <p className="text-gray-900">{selectedAssignment.asset?.serial_number}</p>
                    </div>
                  </div>
                </div>

                {/* Personnel Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Personnel Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Name:</span>
                      <p className="text-gray-900">{selectedAssignment.personnel?.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Rank:</span>
                      <p className="text-gray-900">{selectedAssignment.personnel?.rank}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Personnel ID:</span>
                      <p className="text-gray-900">{selectedAssignment.personnel?.id}</p>
                    </div>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Assignment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Assignment Date:</span>
                      <p className="text-gray-900">{formatDate(selectedAssignment.dates?.assignment)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Expected Return:</span>
                      <p className="text-gray-900">
                        {selectedAssignment.dates?.expected_return ? formatDate(selectedAssignment.dates.expected_return) : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Actual Return:</span>
                      <p className="text-gray-900">
                        {selectedAssignment.dates?.actual_return ? formatDate(selectedAssignment.dates.actual_return) : 'Not returned yet'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAssignment.status)}`}>
                        {selectedAssignment.status?.charAt(0).toUpperCase() + selectedAssignment.status?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Purpose and Notes */}
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-500">Purpose:</span>
                    <p className="text-gray-900 mt-1">{selectedAssignment.purpose}</p>
                  </div>
                  {selectedAssignment.notes && (
                    <div>
                      <span className="font-medium text-gray-500">Notes:</span>
                      <p className="text-gray-900 mt-1">{selectedAssignment.notes}</p>
                    </div>
                  )}
                </div>

                {/* Administrative Information */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Administrative Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Assigned By:</span>
                      <p className="text-gray-900">{selectedAssignment.assigned_by}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Base:</span>
                      <p className="text-gray-900">{selectedAssignment.base}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Assignment ID:</span>
                      <p className="text-gray-900">#{selectedAssignment.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                {selectedAssignment.status === 'Active' && canManageAssignments && (
                  <>
                    <button
                      onClick={() => {
                        setShowAssignmentDetails(false);
                        handleEditAssignment(selectedAssignment);
                      }}
                      className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit Assignment
                    </button>
                    <button
                      onClick={() => {
                        setShowAssignmentDetails(false);
                        handleReturnAsset(selectedAssignment.id);
                      }}
                      className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Mark as Returned
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowAssignmentDetails(false)}
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default AssignmentsExpenditures;
