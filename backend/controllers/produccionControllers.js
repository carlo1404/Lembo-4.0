import { db } from '../config/db.js';

// Crea una nueva producción
export const createProduccion = async (req, res) => {
  const { id, nombre, responsable_id, cultivo_id, ciclo, fecha_inicio, fecha_fin, inversion } = req.body;
  if (!id || !nombre || !responsable_id || !cultivo_id || !ciclo || !fecha_inicio || !fecha_fin || !inversion) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  try {
    const [result] = await db.execute(
      `INSERT INTO produccion (id, nombre, responsable_id, cultivo_id, ciclo, fecha_inicio, fecha_fin, inversion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
      [id, nombre, responsable_id, cultivo_id, ciclo, fecha_inicio, fecha_fin, inversion]
    );
    res.status(201).json({ message: 'Producción creada', insertId: result.insertId });
  } catch (error) {
    console.error('Error en createProduccion:', error);
    res.status(500).json({ error: 'Error interno al crear producción' });
  }
};

// Obtiene todas las producciones
export const getProducciones = async (_req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM produccion');
    res.json(rows);
  } catch (error) {
    console.error('Error en getProducciones:', error);
    res.status(500).json({ error: 'Error interno al obtener producciones' });
  }
};
