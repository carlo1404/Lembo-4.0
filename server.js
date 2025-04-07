import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Necesario para __dirname con ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde frontend/public
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

app.get("/views/home.html", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "views", "home.html"));
});

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lembo',
    port: 3307
});

// Verificar conexión
db.connect(err => {
    if (err) {
        console.error("❌ Error de conexión a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a la base de datos MySQL");
});

// RUTA PRINCIPAL: Servir home.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "views", "home.html"));
});

/////////////////////// RUTAS DE API ///////////////////////

// Ruta para agregar insumos
app.post("/api/insumos", (req, res) => {
    const { nombre, valor_unitario, cantidad, unidad, descripcion } = req.body;

    if (!nombre || !valor_unitario || !cantidad || !unidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

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

// Ruta para agregar usuarios
app.post('/api/usuarios', (req, res) => {
    const { id, nombre, apellido, numero_telefonico, rol } = req.body;
    if (!id || !nombre || !apellido || !numero_telefonico || !rol) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = 'INSERT INTO usuarios (id, nombre, apellido, numero_telefonico, rol) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [id, nombre, apellido, numero_telefonico, rol], (err, results) => {
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
    if (!nombre || !tipo || !ubicacion || !descripcion || !usuario_id) {
        return res.status(400).json({ message: "Todos los campos obligatorios deben estar llenos." });
    }

    const sql = "INSERT INTO cultivos (nombre, tipo, ubicacion, descripcion, usuario_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [nombre, tipo, ubicacion, descripcion, usuario_id], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar en la base de datos:", err);
            return res.status(500).json({ message: "Error al agregar cultivo" });
        }
        res.status(201).json({ message: "Cultivo agregado correctamente", id: result.insertId });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});
