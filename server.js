import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// rutas
import authRoutes from './routes/auth.routes.js';
import historyRoutes from './routes/history.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());  // Necesario para leer JSON

// ===========================
// 1. RUTAS API (PRIMERO)
// ===========================
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

// ===========================
// 2. RUTA PROXY (PlantNet)
// ===========================
app.post('/proxy/identify', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('images', blob, 'image.jpg');
    formData.append('organs', req.body.organ || 'leaf');

    const apiKey = process.env.PLANTNET_API_KEY || 'REEMPLAZA_TU_APIKEY';
    const response = await fetch(`https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      const errorText = await response.text();
      res.status(response.status).json({ error: `PlantNet error: ${response.status}`, details: errorText });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===========================
// 3. ARCHIVOS ESTÁTICOS 
// ===========================
app.use(express.static(join(__dirname, 'public')));

// ===========================
// 4. RUTA FINAL SPA (CATCH-ALL)
// ===========================
app.get('/*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'Nenufarv3.html'));
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});