import express from 'express';
import { createProduccion, getProducciones } from '../controllers/produccionControllers.js';
const router = express.Router();
router.post('/api/producciones', createProduccion);
router.get('/api/producciones', getProducciones);
export default router;