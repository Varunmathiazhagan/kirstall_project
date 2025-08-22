const express = require('express');
const { Assignment, Expenditure } = require('../models/Assignment');
const Asset = require('../models/Asset');
const { authenticateToken, authorizeRole, logActivity } = require('../middleware/authMiddleware');

const router = express.Router();

// === ASSIGNMENTS ===

// Get all assignments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { base_id, status, category, start_date, end_date } = req.query;
    
    let targetBaseId;
    if (req.user.role === 'admin') {
      targetBaseId = base_id;
    } else {
      targetBaseId = req.user.base_id;
    }

    if (!targetBaseId) {
      return res.status(400).json({ error: 'Base ID required' });
    }

    const filters = { status, category, start_date, end_date };
    const assignments = await Assignment.findByBase(targetBaseId, filters);

    res.json({ assignments });
  } catch (error) {
    console.error('Assignments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Create new assignment
router.post('/', authenticateToken, authorizeRole(['admin', 'base_commander']), logActivity('assignment_create'), async (req, res) => {
  try {
    const { asset_id, assigned_to_user_id, quantity, assignment_date, return_date, notes } = req.body;

    // Verify the asset exists and user has access
    const asset = await Asset.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check if user can assign assets from this base
    if (req.user.role !== 'admin' && asset.base_id !== req.user.base_id) {
      return res.status(403).json({ error: 'Cannot assign assets from other bases' });
    }

    // Check if asset has sufficient quantity
    if (asset.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient asset quantity for assignment' });
    }

    const assignment = await Assignment.create({
      asset_id,
      assigned_to_user_id,
      assigned_by: req.user.id,
      quantity,
      assignment_date: assignment_date || new Date(),
      return_date,
      status: 'active',
      notes
    });

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('Assignment creation error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Update assignment status (return/complete)
router.patch('/:id/status', authenticateToken, authorizeRole(['admin', 'base_commander']), logActivity('assignment_status_update'), async (req, res) => {
  try {
    const { status } = req.body; // 'returned', 'completed'
    const assignmentId = req.params.id;

    const updatedAssignment = await Assignment.updateStatus(assignmentId, status);

    if (!updatedAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({
      message: `Assignment ${status} successfully`,
      assignment: updatedAssignment
    });
  } catch (error) {
    console.error('Assignment status update error:', error);
    res.status(500).json({ error: 'Failed to update assignment status' });
  }
});

// === EXPENDITURES ===

// Get all expenditures
router.get('/expenditures', authenticateToken, async (req, res) => {
  try {
    const { base_id, category, start_date, end_date } = req.query;
    
    let targetBaseId;
    if (req.user.role === 'admin') {
      targetBaseId = base_id;
    } else {
      targetBaseId = req.user.base_id;
    }

    if (!targetBaseId) {
      return res.status(400).json({ error: 'Base ID required' });
    }

    const filters = { category, start_date, end_date };
    const expenditures = await Expenditure.findByBase(targetBaseId, filters);

    res.json({ expenditures });
  } catch (error) {
    console.error('Expenditures fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch expenditures' });
  }
});

// Record new expenditure
router.post('/expenditures', authenticateToken, authorizeRole(['admin', 'base_commander']), logActivity('expenditure_create'), async (req, res) => {
  try {
    const { asset_id, quantity, expenditure_date, reason, notes } = req.body;

    // Verify the asset exists and user has access
    const asset = await Asset.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Check if user can record expenditures for this base
    if (req.user.role !== 'admin' && asset.base_id !== req.user.base_id) {
      return res.status(403).json({ error: 'Cannot record expenditures for other bases' });
    }

    // Check if asset has sufficient quantity
    if (asset.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient asset quantity for expenditure' });
    }

    const expenditure = await Expenditure.create({
      asset_id,
      quantity,
      expenditure_date: expenditure_date || new Date(),
      reason,
      recorded_by: req.user.id,
      notes
    });

    // Update asset quantity
    const newQuantity = asset.quantity - quantity;
    await Asset.updateQuantity(asset_id, newQuantity);

    res.status(201).json({
      message: 'Expenditure recorded successfully',
      expenditure
    });
  } catch (error) {
    console.error('Expenditure creation error:', error);
    res.status(500).json({ error: 'Failed to record expenditure' });
  }
});

// Get assignment and expenditure statistics
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
    
    const [assignmentStats, expenditureStats] = await Promise.all([
      Assignment.getAssignmentStats(targetBaseId, filters),
      Expenditure.getExpenditureStats(targetBaseId, filters)
    ]);

    res.json({
      base_id: targetBaseId,
      assigned: assignmentStats.assigned || 0,
      expended: expenditureStats.expended || 0,
      filters_applied: filters
    });
  } catch (error) {
    console.error('Assignment/Expenditure stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
