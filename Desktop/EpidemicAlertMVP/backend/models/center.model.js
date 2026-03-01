const db = require('../config/db');

const Center = {
  findAll: async () => {
    const [rows] = await db.query(
      `SELECT c.*, u.name, u.email, u.phone, u.location 
       FROM centers c JOIN users u ON c.user_id = u.id`
    );
    return rows;
  },

  findByUserId: async (user_id) => {
    const [rows] = await db.query('SELECT * FROM centers WHERE user_id = ?', [user_id]);
    return rows[0] || null;
  },

  create: async ({ user_id, center_name, capacity }) => {
    const [result] = await db.query(
      'INSERT INTO centers (user_id, center_name, capacity) VALUES (?, ?, ?)',
      [user_id, center_name, capacity || null]
    );
    return result.insertId;
  },
};

module.exports = Center;
