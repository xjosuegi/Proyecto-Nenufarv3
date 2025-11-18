import { addHistory, getHistoryByUser, deleteHistoryItem } from '../models/plantHistory.model.js';

// POST /api/history
export async function createHistory(req, res) {
  const userId = req.user.id;
  const { plant_name, plant_scientific, confidence, details } = req.body;
  // si envías imagen base64 en body.imageData -> úsala; por simplicidad, permitimos imageData
  const imageData = req.body.imageData || null;
  const id = await addHistory({
    userId,
    plantName: plant_name,
    plantScientific: plant_scientific,
    imageData,
    confidence,
    details
  });
  res.json({ id, message: 'Guardado' });
}

// GET /api/history
export async function listHistory(req, res) {
  const userId = req.user.id;
  const rows = await getHistoryByUser(userId);
  res.json({ history: rows });
}

// DELETE /api/history/:id
export async function removeHistory(req, res) {
  const userId = req.user.id;
  const id = req.params.id;
  const affected = await deleteHistoryItem(userId, id);
  if (!affected) return res.status(404).json({ message: 'No encontrado / no autorizado' });
  res.json({ message: 'Eliminado' });
}