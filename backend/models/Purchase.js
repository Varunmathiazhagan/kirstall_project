const pool = require('../config/db');

class Purchase {
  static async create(purchaseData) {
    const { asset_id, base_id, quantity, unit_price, total_price, purchase_date, vendor, notes, created_by } = purchaseData;
    
    const query = `
      INSERT INTO purchases (asset_id, base_id, quantity, unit_price, total_price, purchase_date, vendor, notes, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [asset_id, base_id, quantity, unit_price, total_price, purchase_date, vendor, notes, created_by]);
    return result.rows[0];
  }

  static async findByBase(baseId, filters = {}) {
    let query = `
      SELECT p.*, a.name as asset_name, a.category as asset_category,
             b.name as base_name, u.username as created_by_name
      FROM purchases p
      LEFT JOIN assets a ON p.asset_id = a.id
      LEFT JOIN bases b ON p.base_id = b.id
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.base_id = $1
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.start_date) {
      query += ` AND p.purchase_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND p.purchase_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ' ORDER BY p.purchase_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, a.name as asset_name, a.category as asset_category,
             b.name as base_name, u.username as created_by_name
      FROM purchases p
      LEFT JOIN assets a ON p.asset_id = a.id
      LEFT JOIN bases b ON p.base_id = b.id
      LEFT JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    if (filters.base_id) {
      query += ` AND p.base_id = $${paramIndex}`;
      params.push(filters.base_id);
      paramIndex++;
    }

    if (filters.start_date) {
      query += ` AND p.purchase_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND p.purchase_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ' ORDER BY p.purchase_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getTotalByBase(baseId, filters = {}) {
    let query = `
      SELECT 
        COALESCE(SUM(p.quantity), 0) as total_quantity,
        COALESCE(SUM(p.total_price), 0) as total_value
      FROM purchases p
      LEFT JOIN assets a ON p.asset_id = a.id
      WHERE p.base_id = $1
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.start_date) {
      query += ` AND p.purchase_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND p.purchase_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }
    
    const result = await pool.query(query, params);
    return result.rows[0];
  }
}

module.exports = Purchase;
