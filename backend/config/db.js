// import mysql from 'mysql2/promise';

// // Crear pool de conexiones
// export const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'lembo',
//   port: 3307,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // controllers/produccionController.js
// import { db } from '../config/db.js';

// // Crear producción
// export const createProduccion = async (req, res) => {
//   const { id, nombre, responsable_id, cultivo_id, ciclo, fecha_inicio, fecha_fin, inversion } = req.body;
//   if (!id || !nombre || !responsable_id || !cultivo_id || !ciclo || !fecha_inicio || !fecha_fin || !inversion) {
//     return res.status(400).json({ error: 'Todos los campos son obligatorios' });
//   }
//   try {
//     const [result] = await db.execute(
//       `INSERT INTO produccion (id, nombre, responsable_id, cultivo_id, ciclo, fecha_inicio, fecha_fin, inversion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [id, nombre, responsable_id, cultivo_id, ciclo, fecha_inicio, fecha_fin, inversion]
//     );
//     return res.status(201).json({ message: 'Producción creada', insertId: result.insertId });
//   } catch (error) {
//     console.error('Error creando producción:', error);
//     return res.status(500).json({ error: 'Error interno al crear producción' });
//   }
// };

// // Obtener todas las producciones
// export const getProducciones = async (_req, res) => {
//   try {
//     const [rows] = await db.execute('SELECT * FROM produccion');
//     return res.json(rows);
//   } catch (error) {
//     console.error('Error obteniendo producciones:', error);
//     return res.status(500).json({ error: 'Error interno al obtener producciones' });
//   }
// };