const express = require('express');
const Purchase = require('../models/Purchase');
const Asset = require('../models/Asset');
const { authenticateToken, authorizeRole, logActivity } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all purchases
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { base_id, category, start_date, end_date } = req.query;
    
    let targetBaseId;
    if (req.user.role === 'admin') {
      targetBaseId = base_id;
    } else {
      targetBaseId = req.user.base_id;
    }

    const filters = { category, start_date, end_date };
    
    let purchases;
    if (targetBaseId) {
      purchases = await Purchase.findByBase(targetBaseId, filters);
    } else {
      purchases = await Purchase.findAll(filters);
    }

    res.json({ purchases });
  } catch (error) {
    console.error('Purchases fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Create new purchase
router.post('/', authenticateToken, authorizeRole(['admin', 'base_commander', 'logistics_officer']), logActivity('purchase_create'), async (req, res) => {
  try {
    const { asset_id, quantity, unit_price, purchase_date, vendor, notes } = req.body;

    // Verify the asset exists and user has access
    const asset = await Asset.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    let base_id;
    if (req.user.role === 'admin') {
      base_id = req.body.base_id || asset.base_id;
    } else {
      base_id = req.user.base_id;
      
      // Check if user can make purchases for this base
      if (asset.base_id !== req.user.base_id) {
        return res.status(403).json({ error: 'Cannot make purchases for other bases' });
      }
    }

    const total_price = quantity * unit_price;

    const purchase = await Purchase.create({
      asset_id,
      base_id,
      quantity,
      unit_price,
      total_price,
      purchase_date: purchase_date || new Date(),
      vendor,
      notes,
      created_by: req.user.id
    });

    // Update asset quantity
    const newQuantity = asset.quantity + quantity;
    await Asset.updateQuantity(asset_id, newQuantity);

    res.status(201).json({
      message: 'Purchase recorded successfully',
      purchase
    });
  } catch (error) {
    console.error('Purchase creation error:', error);
    res.status(500).json({ error: 'Failed to record purchase' });
  }
});

// Get purchase details by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    const purchase = purchases.find(p => p.id == req.params.id);
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    // Check access permissions
    if (req.user.role !== 'admin' && purchase.base_id !== req.user.base_id) {
      return res.status(403).json({ error: 'Access denied to this purchase' });
    }

    res.json({ purchase });
  } catch (error) {
    console.error('Purchase fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
});

// Get purchase statistics
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
    const stats = await Purchase.getTotalByBase(targetBaseId, filters);

    res.json({
      base_id: targetBaseId,
      total_purchases: stats.total_quantity || 0,
      total_value: stats.total_value || 0,
      filters_applied: filters
    });
  } catch (error) {
    console.error('Purchase stats error:', error);
    res.status(500).json({ error: 'Failed to fetch purchase statistics' });
  }
});

module.exports = router;
