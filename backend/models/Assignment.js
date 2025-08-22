const pool = require('../config/db');

class Assignment {
  static async create(assignmentData) {
    const { asset_id, assigned_to_user_id, assigned_by, quantity, assignment_date, return_date, status, notes } = assignmentData;
    
    const query = `
      INSERT INTO assignments (asset_id, assigned_to_user_id, assigned_by, quantity, assignment_date, return_date, status, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [asset_id, assigned_to_user_id, assigned_by, quantity, assignment_date, return_date, status, notes]);
    return result.rows[0];
  }

  static async findByBase(baseId, filters = {}) {
    let query = `
      SELECT ass.*, a.name as asset_name, a.category as asset_category,
             ut.username as assigned_to_name, ub.username as assigned_by_name,
             b.name as base_name
      FROM assignments ass
      LEFT JOIN assets a ON ass.asset_id = a.id
      LEFT JOIN users ut ON ass.assigned_to_user_id = ut.id
      LEFT JOIN users ub ON ass.assigned_by = ub.id
      LEFT JOIN bases b ON a.base_id = b.id
      WHERE a.base_id = $1
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.start_date) {
      query += ` AND ass.assignment_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND ass.assignment_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND ass.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ' ORDER BY ass.assignment_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE assignments 
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, status]);
    return result.rows[0];
  }

  static async getAssignmentStats(baseId, filters = {}) {
    let query = `
      SELECT 
        COALESCE(SUM(CASE WHEN ass.status = 'active' THEN ass.quantity ELSE 0 END), 0) as assigned_quantity
      FROM assignments ass
      LEFT JOIN assets a ON ass.asset_id = a.id
      WHERE a.base_id = $1
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.start_date) {
      query += ` AND ass.assignment_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND ass.assignment_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }
    
    const result = await pool.query(query, params);
    return {
      assigned: parseInt(result.rows[0].assigned_quantity)
    };
  }
}

class Expenditure {
  static async create(expenditureData) {
    const { asset_id, quantity, expenditure_date, reason, recorded_by, notes } = expenditureData;
    
    const query = `
      INSERT INTO expenditures (asset_id, quantity, expenditure_date, reason, recorded_by, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [asset_id, quantity, expenditure_date, reason, recorded_by, notes]);
    return result.rows[0];
  }

  static async findByBase(baseId, filters = {}) {
    let query = `
      SELECT e.*, a.name as asset_name, a.category as asset_category,
             u.username as recorded_by_name, b.name as base_name
      FROM expenditures e
      LEFT JOIN assets a ON e.asset_id = a.id
      LEFT JOIN users u ON e.recorded_by = u.id
      LEFT JOIN bases b ON a.base_id = b.id
      WHERE a.base_id = $1
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.start_date) {
      query += ` AND e.expenditure_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND e.expenditure_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    query += ' ORDER BY e.expenditure_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getExpenditureStats(baseId, filters = {}) {
    let query = `
      SELECT 
        COALESCE(SUM(e.quantity), 0) as expended_quantity
      FROM expenditures e
      LEFT JOIN assets a ON e.asset_id = a.id
      WHERE a.base_id = $1
    `;
    
    const params = [baseId];
    let paramIndex = 2;

    if (filters.start_date) {
      query += ` AND e.expenditure_date >= $${paramIndex}`;
      params.push(filters.start_date);
      paramIndex++;
    }

    if (filters.end_date) {
      query += ` AND e.expenditure_date <= $${paramIndex}`;
      params.push(filters.end_date);
      paramIndex++;
    }

    if (filters.category) {
      query += ` AND a.category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }
    
    const result = await pool.query(query, params);
    return {
      expended: parseInt(result.rows[0].expended_quantity)
    };
  }
}

module.exports = { Assignment, Expenditure };
