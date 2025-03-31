import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lembo',
    port: 3307
});

// Verificar conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error("❌ Error de conexión a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a la base de datos MySQL");
});

// Ruta para agregar insumos (omitiendo el id)
app.post("/api/insumos", (req, res) => {
    console.log("📩 Datos recibidos:", req.body);

    // Extraemos sin el id
    const { nombre, valor_unitario, cantidad, unidad, descripcion } = req.body;

    // Validación de campos
    if (!nombre || !valor_unitario || !cantidad || !unidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Consulta SQL sin el campo id
    db.query(
        'INSERT INTO insumos (nombre, valor_unitario, cantidad, unidad, descripcion) VALUES (?, ?, ?, ?, ?)',
        [nombre, valor_unitario, cantidad, unidad, descripcion],
        (err, results) => {
            if (err) {
                console.error('❌ Error al insertar en la base de datos:', err);
                return res.status(500).json({ error: "Error al agregar el insumo" });
            }
            res.status(201).json({ insertId: results.insertId, nombre, valor_unitario, cantidad, unidad, descripcion });
        }
    );
});
// CONECCION DE USUARIOS 
// Ruta para agregar un nuevo usuario
// Ruta para agregar un nuevo usuario
app.post('/api/usuarios', (req, res) => {
    const { id, nombre, apellido, numero_telefonico, rol } = req.body;
    // Validar los campos
    if  (!id || !nombre || !apellido || !numero_telefonico || !rol) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Insertar el nuevo usuario en la base de datos (no es necesario el 'id' ya que es auto_incremental)
    const query = 'INSERT INTO usuarios (id, nombre, apellido, numero_telefonico, rol) VALUES (?, ?, ?, ?, ?)';
db.query(query, [id, nombre, apellido, numero_telefonico, rol], (err, results) => {
    // mostramos en la terminal los datos recibidos 
    console.log('Datos recibidos:', { id, nombre, apellido, numero_telefonico, rol });


        if (err) {
            console.error('❌ Error al insertar usuario:', err);
            return res.status(500).json({ error: "Error al agregar el usuario" });
        }
        res.status(201).json({ message: "Usuario agregado exitosamente", id: results.insertId });
    });
});

// Ruta para agregar cultivos
app.post("/api/cultivos", (req, res) => {
    const { nombre, tipo, ubicacion, descripcion, usuario_id } = req.body;

    // Validación de los campos obligatorios
    if (!nombre || !tipo || !ubicacion || !descripcion || !usuario_id) {
        return res.status(400).json({ message: "Todos los campos obligatorios deben estar llenos." });
    }

    // mostramos en la terminal los datos recibidos
    console.log('Datos recibidos:', { nombre, tipo, ubicacion, descripcion, usuario_id });
    
    // Insertar el cultivo con el usuario_id
    const sql = "INSERT INTO cultivos (nombre, tipo, ubicacion, descripcion, usuario_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nombre, tipo, ubicacion, descripcion, usuario_id], (err, result) => {
        if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).json({ message: "Error al agregar cultivo" });
        }
        res.status(201).json({ message: "Cultivo agregado correctamente", id: result.insertId });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});
