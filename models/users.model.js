import { pool } from './db.js';

export async function createUser({ email, hashedPassword, name }) {
  const [result] = await pool.execute(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, hashedPassword, name]
  );
  return result.insertId;
}

export async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

export async function findUserById(id) {
  const [rows] = await pool.execute(
    'SELECT id, email, name, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}