import { pool } from './db.js';

export async function addHistory({ userId, plantName, plantScientific, imageData, confidence, details }) {
  const [result] = await pool.execute(
    `INSERT INTO plant_history 
     (user_id, plant_name, plant_scientific, image_data, confidence, details)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, plantName, plantScientific, imageData, confidence, details]
  );
  return result.insertId;
}

export async function getHistoryByUser(userId) {
  const [rows] = await pool.execute(
    `SELECT id, plant_name, plant_scientific,
            image_data, confidence, details, detection_date
     FROM plant_history
     WHERE user_id = ?
     ORDER BY detection_date DESC`,
    [userId]
  );
  return rows;
}

export async function deleteHistoryItem(userId, id) {
  const [result] = await pool.execute(
    'DELETE FROM plant_history WHERE user_id = ? AND id = ?',
    [userId, id]
  );
  return result.affectedRows;
}