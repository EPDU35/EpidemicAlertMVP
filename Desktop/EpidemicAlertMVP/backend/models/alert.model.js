const db = require('../config/db');

const Alert = {
  create: async ({ title, message, level, location, disease, created_by }) => {
    const [result] = await db.query(
      `INSERT INTO alerts (title, message, level, location, disease, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, message, level, location, disease || null, created_by]
    );
    return result.insertId;
  },

  findAll: async ({ location, level } = {}) => {
    let query = `SELECT a.*, u.name as author FROM alerts a JOIN users u ON a.created_by = u.id WHERE 1=1`;
    const params = [];
    if (location) { query += ' AND a.location LIKE ?'; params.push(`%${location}%`); }
    if (level) { query += ' AND a.level = ?'; params.push(level); }
    query += ' ORDER BY a.created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT a.*, u.name as author FROM alerts a JOIN users u ON a.created_by = u.id WHERE a.id = ?',
      [id]
    );
    return rows[0] || null;
  },

  delete: async (id) => {
    await db.query('DELETE FROM alerts WHERE id = ?', [id]);
  },
};

module.exports = Alert;
