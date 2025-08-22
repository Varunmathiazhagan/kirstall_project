const pool = require('../config/db');

class Transfer {
  static async create(transferData) {
    const { asset_id, from_base_id, to_base_id, quantity, transfer_date, notes, initiated_by, approved_by, status } = transferData;
    
    const query = `
      INSERT INTO transfers (asset_id, from_base_id, to_base_id, quantity, transfer_date, notes, initiated_by, approved_by, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [asset_id, from_base_id, to_base_id, quantity, transfer_date, notes, initiated_by, approved_by, status]);
    return result.rows[0];
  }

  static async findByBase(baseId, filters = {}) {
    let query = `
      SELECT t.*, a.name as asset_name, a.category as asset_category,
             fb.name as from_base_name, tb.name as to_base_name,
             ui.username as initiated_by_name, ua.username as approved_by_name
      FROM transfers t
      LEFT JOIN assets a ON t.asset_id = a.id
      LEFT JOIN bases fb ON t.from_base_id = fb.id
      LEFT JOIN bases tb ON t.to_base_id = tb.id
      LEFT JOIN users ui ON t.initiated_by = ui.id
      LEFT JOIN users ua ON t.approved_by = ua.id
      WHERE (t.from_base_id = $1 OR t.to_base_id = $1)
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.start_date) {
      query += ` AND t.transfer_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND t.transfer_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ' ORDER BY t.transfer_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT t.*, a.name as asset_name, a.category as asset_category,
             fb.name as from_base_name, tb.name as to_base_name,
             ui.username as initiated_by_name, ua.username as approved_by_name
      FROM transfers t
      LEFT JOIN assets a ON t.asset_id = a.id
      LEFT JOIN bases fb ON t.from_base_id = fb.id
      LEFT JOIN bases tb ON t.to_base_id = tb.id
      LEFT JOIN users ui ON t.initiated_by = ui.id
      LEFT JOIN users ua ON t.approved_by = ua.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    if (filters.base_id) {
      query += ` AND (t.from_base_id = $${paramIndex} OR t.to_base_id = $${paramIndex})`;
      params.push(filters.base_id);
      paramIndex++;
    }

    if (filters.start_date) {
      query += ` AND t.transfer_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND t.transfer_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ' ORDER BY t.transfer_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async updateStatus(id, status, approvedBy = null) {
    const query = `
      UPDATE transfers 
      SET status = $2, approved_by = $3, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, status, approvedBy]);
    return result.rows[0];
  }

  static async getTransferStats(baseId, filters = {}) {
    let transferInQuery = `
      SELECT COALESCE(SUM(quantity), 0) as transfers_in
      FROM transfers t
      LEFT JOIN assets a ON t.asset_id = a.id
      WHERE t.to_base_id = $1 AND t.status = 'completed'
    `;

    let transferOutQuery = `
      SELECT COALESCE(SUM(quantity), 0) as transfers_out
      FROM transfers t
      LEFT JOIN assets a ON t.asset_id = a.id
      WHERE t.from_base_id = $1 AND t.status = 'completed'
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.start_date) {
      transferInQuery += ` AND t.transfer_date >= $${paramIndex}`;
      transferOutQuery += ` AND t.transfer_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      transferInQuery += ` AND t.transfer_date <= $${paramIndex}`;
      transferOutQuery += ` AND t.transfer_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.category) {
      transferInQuery += ` AND a.category = $${paramIndex}`;
      transferOutQuery += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }
    
    const transferInResult = await pool.query(transferInQuery, params);
    const transferOutResult = await pool.query(transferOutQuery, params);
    
    return {
      transfers_in: parseInt(transferInResult.rows[0].transfers_in),
      transfers_out: parseInt(transferOutResult.rows[0].transfers_out)
    };
  }
}

module.exports = Transfer;
