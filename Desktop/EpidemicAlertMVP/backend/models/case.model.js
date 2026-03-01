const db = require('../config/db');

const Case = {
  create: async ({ user_id, symptoms, location, disease_suspected, description }) => {
    const [result] = await db.query(
      `INSERT INTO cases (user_id, symptoms, location, disease_suspected, description, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [user_id, symptoms, location, disease_suspected || null, description || null]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM cases WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByUser: async (user_id) => {
    const [rows] = await db.query(
      'SELECT * FROM cases WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  },

  findPending: async () => {
    const [rows] = await db.query(
      `SELECT c.*, u.name as citizen_name, u.phone 
       FROM cases c JOIN users u ON c.user_id = u.id 
       WHERE c.status = 'pending' ORDER BY c.created_at DESC`
    );
    return rows;
  },

  findAll: async ({ status, location } = {}) => {
    let query = 'SELECT c.*, u.name as citizen_name FROM cases c JOIN users u ON c.user_id = u.id WHERE 1=1';
    const params = [];
    if (status) { query += ' AND c.status = ?'; params.push(status); }
    if (location) { query += ' AND c.location LIKE ?'; params.push(`%${location}%`); }
    query += ' ORDER BY c.created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  updateStatus: async (id, status, center_id, notes) => {
    await db.query(
      'UPDATE cases SET status = ?, validated_by = ?, validation_notes = ?, validated_at = NOW() WHERE id = ?',
      [status, center_id, notes || null, id]
    );
  },

  countByStatusAndLocation: async (location, days = 7) => {
    const [rows] = await db.query(
      `SELECT status, COUNT(*) as count FROM cases 
       WHERE location LIKE ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY status`,
      [`%${location}%`, days]
    );
    return rows;
  },
};

module.exports = Case;
