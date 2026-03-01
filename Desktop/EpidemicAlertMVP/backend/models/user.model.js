const db = require('../config/db');

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT id, name, email, role, phone, location, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  create: async ({ name, email, password, role, phone, location }) => {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password, role, phone || null, location || null]
    );
    return result.insertId;
  },
};

module.exports = User;
