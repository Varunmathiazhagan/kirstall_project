const express = require('express');
const Transfer = require('../models/Transfer');
const Asset = require('../models/Asset');
const { authenticateToken, authorizeRole, logActivity } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all transfers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { base_id, status, category, start_date, end_date } = req.query;
    
    let targetBaseId;
    if (req.user.role === 'admin') {
      targetBaseId = base_id;
    } else {
      targetBaseId = req.user.base_id;
    }

    const filters = { status, category, start_date, end_date };
    
    let transfers;
    if (targetBaseId) {
      transfers = await Transfer.findByBase(targetBaseId, filters);
    } else {
      transfers = await Transfer.findAll(filters);
    }

    res.json({ transfers });
  } catch (error) {
    console.error('Transfers fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transfers' });
  }
});

// Create new transfer
router.post('/', authenticateToken, authorizeRole(['admin', 'base_commander', 'logistics_officer']), logActivity('transfer_create'), async (req, res) => {
  try {
    const { asset_id, from_base_id, to_base_id, quantity, transfer_date, notes } = req.body;

    // Verify the asset exists and user has access
    const asset = await Asset.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check if user can initiate transfer from this base
    if (req.user.role !== 'admin') {
      if (req.user.role === 'base_commander' && from_base_id !== req.user.base_id) {
        return res.status(403).json({ error: 'Cannot initiate transfer from other bases' });
      }
    }

    // Check if asset has sufficient quantity
    if (asset.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient asset quantity for transfer' });
    }

    const transfer = await Transfer.create({
      asset_id,
      from_base_id,
      to_base_id,
      quantity,
      transfer_date: transfer_date || new Date(),
      notes,
      initiated_by: req.user.id,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Transfer initiated successfully',
      transfer
    });
  } catch (error) {
    console.error('Transfer creation error:', error);
    res.status(500).json({ error: 'Failed to create transfer' });
  }
});

// Update transfer status (approve/reject/complete)
router.patch('/:id/status', authenticateToken, authorizeRole(['admin', 'base_commander']), logActivity('transfer_status_update'), async (req, res) => {
  try {
    const { status } = req.body; // 'approved', 'rejected', 'completed'
    const transferId = req.params.id;

    // Get the transfer details
    const transfers = await Transfer.findAll({ id: transferId });
    const transfer = transfers.find(t => t.id == transferId);
    
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    // Check permissions - only admin or commander of receiving base can approve
    if (req.user.role !== 'admin' && transfer.to_base_id !== req.user.base_id) {
      return res.status(403).json({ error: 'Only receiving base commander can approve transfers' });
    }

    const updatedTransfer = await Transfer.updateStatus(transferId, status, req.user.id);

    // If completed, update asset quantities
    if (status === 'completed') {
      // This would typically be done in a transaction
      // Decrease quantity at source base and increase at destination base
      // For simplicity, we're not implementing the full asset movement here
      // In a production system, you'd want to handle this atomically
    }

    res.json({
      message: `Transfer ${status} successfully`,
      transfer: updatedTransfer
    });
  } catch (error) {
    console.error('Transfer status update error:', error);
    res.status(500).json({ error: 'Failed to update transfer status' });
  }
});

// Get transfer details by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const transfers = await Transfer.findAll();
    const transfer = transfers.find(t => t.id == req.params.id);
    
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && 
        transfer.from_base_id !== req.user.base_id && 
        transfer.to_base_id !== req.user.base_id) {
      return res.status(403).json({ error: 'Access denied to this transfer' });
    }

    res.json({ transfer });
  } catch (error) {
    console.error('Transfer fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transfer' });
  }
});

// Get transfer statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { base_id, start_date, end_date, category } = req.query;
    
    let targetBaseId;
    if (req.user.role === 'admin') {
      targetBaseId = base_id;
    } else {
      targetBaseId = req.user.base_id;
    }

    if (!targetBaseId) {
      return res.status(400).json({ error: 'Base ID required' });
    }

    const filters = { start_date, end_date, category };
    const stats = await Transfer.getTransferStats(targetBaseId, filters);

    res.json({
      base_id: targetBaseId,
      ...stats,
      net_transfer: stats.transfers_in - stats.transfers_out,
      filters_applied: filters
    });
  } catch (error) {
    console.error('Transfer stats error:', error);
    res.status(500).json({ error: 'Failed to fetch transfer statistics' });
  }
});

module.exports = router;