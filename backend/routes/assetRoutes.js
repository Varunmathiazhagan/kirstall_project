const express = require('express');
const Asset = require('../models/Asset');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const { Assignment, Expenditure } = require('../models/Assignment');
const Base = require('../models/Base');
const { authenticateToken, authorizeRole, authorizeBase, logActivity } = require('../middleware/authMiddleware');

const router = express.Router();

// Dashboard metrics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const { base_id, category, start_date, end_date } = req.query;
    
    // Determine which base to query
    let targetBaseId;
    if (req.user.role === 'admin') {
      targetBaseId = base_id; // Admin can query any base
    } else {
      targetBaseId = req.user.base_id; // Others can only query their own base
    }

    const filters = { category, start_date, end_date };

    // Get all metrics in parallel
    const [purchaseStats, transferStats, assignmentStats, expenditureStats, assets] = await Promise.all([
      targetBaseId ? Purchase.getTotalByBase(targetBaseId, filters) : { total_quantity: 0 },
      targetBaseId ? Transfer.getTransferStats(targetBaseId, filters) : { transfers_in: 0, transfers_out: 0 },
      targetBaseId ? Assignment.getAssignmentStats(targetBaseId, filters) : { assigned: 0 },
      targetBaseId ? Expenditure.getExpenditureStats(targetBaseId, filters) : { expended: 0 },
      targetBaseId ? Asset.findByBase(targetBaseId, filters) : []
    ]);

    // Calculate opening balance (sum of all current assets)
    const opening_balance = assets.reduce((sum, asset) => sum + asset.quantity, 0);
    
    // Calculate net movement
    const net_movement = purchaseStats.total_quantity + transferStats.transfers_in - transferStats.transfers_out;
    
    // Calculate closing balance
    const closing_balance = opening_balance + net_movement - assignmentStats.assigned - expenditureStats.expended;

    res.json({
      opening_balance,
      purchases: purchaseStats.total_quantity || 0,
      transfers_in: transferStats.transfers_in || 0,
      transfers_out: transferStats.transfers_out || 0,
      net_movement,
      assigned: assignmentStats.assigned || 0,
      expended: expenditureStats.expended || 0,
      closing_balance,
      base_id: targetBaseId,
      filters_applied: filters
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// Get all assets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { base_id, category, status } = req.query;
    
    let targetBaseId;
    if (req.user.role === 'admin') {
      targetBaseId = base_id;
    } else {
      targetBaseId = req.user.base_id;
    }

    const filters = { category, status };
    
    let assets;
    if (targetBaseId) {
      assets = await Asset.findByBase(targetBaseId, filters);
    } else {
      assets = await Asset.findAll(filters);
    }

    res.json({ assets });
  } catch (error) {
    console.error('Assets fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Create new asset
router.post('/', authenticateToken, authorizeRole(['admin', 'base_commander']), logActivity('asset_create'), async (req, res) => {
  try {
    const { name, category, serial_number, quantity, status } = req.body;
    
    let base_id;
    if (req.user.role === 'admin') {
      base_id = req.body.base_id;
    } else {
      base_id = req.user.base_id;
    }

    const asset = await Asset.create({
      name,
      category,
      serial_number,
      base_id,
      quantity,
      status: status || 'available'
    });

    res.status(201).json({
      message: 'Asset created successfully',
      asset
    });
  } catch (error) {
    console.error('Asset creation error:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

// Get asset by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && asset.base_id !== req.user.base_id) {
      return res.status(403).json({ error: 'Access denied to this asset' });
    }

    res.json({ asset });
  } catch (error) {
    console.error('Asset fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

// Update asset quantity
router.patch('/:id/quantity', authenticateToken, authorizeRole(['admin', 'base_commander']), logActivity('asset_quantity_update'), async (req, res) => {
  try {
    const { quantity } = req.body;
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && asset.base_id !== req.user.base_id) {
      return res.status(403).json({ error: 'Access denied to this asset' });
    }

    const updatedAsset = await Asset.updateQuantity(req.params.id, quantity);

    res.json({
      message: 'Asset quantity updated successfully',
      asset: updatedAsset
    });
  } catch (error) {
    console.error('Asset quantity update error:', error);
    res.status(500).json({ error: 'Failed to update asset quantity' });
  }
});

// Get all bases (for dropdown selections)
router.get('/bases/all', authenticateToken, async (req, res) => {
  try {
    let bases;
    
    if (req.user.role === 'admin') {
      bases = await Base.findAll();
    } else {
      // Non-admin users can only see their own base
      bases = [await Base.findById(req.user.base_id)].filter(Boolean);
    }

    res.json({ bases });
  } catch (error) {
    console.error('Bases fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch bases' });
  }
});

module.exports = router;