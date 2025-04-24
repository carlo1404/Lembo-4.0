// backend/routes/insumos.js
const express = require('express');
const router = express.Router();
const db = require('../server.js'); // tu archivo de conexión

router.get('/nombres-unicos', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT DISTINCT nombre FROM insumos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener insumos únicos' });
  }
});

module.exports = router;
