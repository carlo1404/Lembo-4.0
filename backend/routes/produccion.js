const express = require('express');
const router = express.Router();

// Mock de responsables (esto normalmente lo sacarías de la base de datos)
const usuarios = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', rol: 'responsable' },
  { id: 2, nombre: 'Ana', apellido: 'Gómez', rol: 'responsable' },
  { id: 3, nombre: 'Pedro', apellido: 'Martínez', rol: 'trabajador' }
];

// Ruta para traer responsables
router.get('/responsables', (req, res) => {
  const responsables = usuarios.filter(user => user.rol === 'responsable');
  res.json(responsables);
});

// Ruta para guardar nueva producción
router.post('/produccion', (req, res) => {
  const nuevaProduccion = req.body;
  console.log('Producción recibida:', nuevaProduccion);
  res.json({ message: 'Producción guardada correctamente' });
});

module.exports = router;
