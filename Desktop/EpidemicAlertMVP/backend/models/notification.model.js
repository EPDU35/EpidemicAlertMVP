const db = require('../config/db');

const Notification = {
  create: async ({ user_id, type, message, reference_id, reference_type }) => {
    const [result] = await db.query(
      `INSERT INTO notifications (user_id, type, message, reference_id, reference_type)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, type, message, reference_id || null, reference_type || null]
    );
    return result.insertId;
  },

  findByUser: async (user_id) => {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [user_id]
    );
    return rows;
  },

  markRead: async (id, user_id) => {
    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
  },

  markAllRead: async (user_id) => {
    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
      [user_id]
    );
  },
};

module.exports = Notification;
