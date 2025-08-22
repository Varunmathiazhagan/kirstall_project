const pool = require('../config/db');

class Asset {
  static async create(assetData) {
    const { name, category, serial_number, base_id, quantity, status } = assetData;
    
    const query = `
      INSERT INTO assets (name, category, serial_number, base_id, quantity, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, category, serial_number, base_id, quantity, status]);
    return result.rows[0];
  }

  static async findByBase(baseId, filters = {}) {
    let query = `
      SELECT a.*, b.name as base_name, b.location as base_location
      FROM assets a
      LEFT JOIN bases b ON a.base_id = b.id
      WHERE a.base_id = $1
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    query += ' ORDER BY a.created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT a.*, b.name as base_name, b.location as base_location
      FROM assets a
      LEFT JOIN bases b ON a.base_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    if (filters.base_id) {
      query += ` AND a.base_id = $${paramIndex}`;
      params.push(filters.base_id);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND a.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    query += ' ORDER BY a.created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async updateQuantity(id, newQuantity) {
    const query = `
      UPDATE assets 
      SET quantity = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, newQuantity]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT a.*, b.name as base_name, b.location as base_location
      FROM assets a
      LEFT JOIN bases b ON a.base_id = b.id
      WHERE a.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Asset;
