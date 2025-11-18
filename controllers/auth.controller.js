import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, findUserById } from '../models/users.model.js';
dotenv.config();

const SALT_ROUNDS = 10;

export async function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y password obligatorios' });

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ message: 'Usuario ya existe' });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = await createUser({ email, hashedPassword: hashed, name });
  const user = await findUserById(userId);

  const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y password obligatorios' });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}

export async function profile(req, res) {
  const user = await findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.json({ user });
}

