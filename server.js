import express from "express";
import mysql from "mysql2";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";

// Necesario para __dirname con ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'frontend', 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Rutas de vistas
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "views", "home.html"));
});

app.get("/views/home.html", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "views", "home.html"));
});

// Configuración de multer para imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

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

// Ruta para agregar cultivos con imagen
app.post("/api/cultivos", upload.single("imagen"), (req, res) => {
    let { nombre, tipo, ubicacion, descripcion, usuario_id } = req.body;
    const imagen = req.file ? req.file.filename : null;

    console.log("📥 BODY:", req.body);
    console.log("🖼️ FILE:", req.file);

    // Corregir posible array duplicado en usuario_id
    usuario_id = Array.isArray(usuario_id) ? usuario_id[0] : usuario_id;

    if (!nombre || !tipo || !ubicacion || !descripcion || !usuario_id) {
        return res.status(400).json({ message: "Todos los campos obligatorios deben estar llenos." });
    }

    if (!imagen) {
        return res.status(400).json({ message: "No se ha recibido la imagen correctamente." });
    }

    const sql = "INSERT INTO cultivos (nombre, tipo, ubicacion, descripcion, usuario_id, imagen) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [nombre, tipo, ubicacion, descripcion, usuario_id, imagen], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar en la base de datos:", err);
            return res.status(500).json({ message: "Error al agregar cultivo" });
        }
        res.status(201).json({
            message: "Cultivo agregado correctamente",
            id: result.insertId,
            imagen: `/uploads/${imagen}`
        });
    });
});

app.post("/api/sensores", (req, res) => {
    const { id, tipo_sensor, esatdo, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion } = req.body;

    // Validación de los campos obligatorios
    if (!id || !tipo_sensor || !esatdo || !nombre) {
        return res.status(400).json({ message: "Los campos ID, tipo de sensor, estado y nombre son obligatorios." });
    }

    // Mostramos en la terminal los datos recibidos
    console.log('Datos recibidos:', { id, tipo_sensor, esatdo, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion });
    
    // Insertar el sensor
    const sql = "INSERT INTO sensores (id, tipo_sensor, esatdo, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [id, tipo_sensor, esatdo, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion], (err, result) => {
        if (err) {
            console.error("Error al insertar en la base de datos:", err);
            return res.status(500).json({ message: "Error al agregar sensor" });
        }
        res.status(201).json({ message: "Sensor agregado correctamente", id: result.insertId });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});
