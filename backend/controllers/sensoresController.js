// backend/controllers/sensoresController.js
import pool from '../config/db.js';

export async function createSensor(req, res) {
  try {
    const {
        id,
        tipo_sensor,
        estado,
        nombre,
        unidad_medida,
        tiempo_muestreo,
        imagen,
        descripcion
    } = req.body;

    await pool.query(
      `INSERT INTO sensores (id, tipo_sensor, estado, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tipo_sensor, estado, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion]
    );

    res.status(201).json({ message: 'Sensor creado exitosamente', id });
  } catch (error) {
    console.error('Error al insertar sensor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
