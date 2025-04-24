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
app.use(express.urlencoded({ extended: true }));
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

// Ruta corregida para listar usuarios
app.get("/views/listar-usuarios.html", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "public", "views", "listar-usuarios.html"));
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
            console.error('❌ Error al insertar usuario:', err.sqlMessage);
            return res.status(500).json({ error: err.sqlMessage });
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
// =================== SENSORES ===================
// Ruta para agregar sensores
app.post("/api/sensores", upload.single("imagen"), (req, res) => {
    const { tipo_sensor, estado, nombre, unidad_medida, tiempo_muestreo, descripcion } = req.body;
    const imagen = req.file ? req.file.filename : null;

    console.log("📥 Datos recibidos:", req.body);
    
    if (!tipo_sensor || !nombre || !unidad_medida) {
        return res.status(400).json({ 
            error: "Campos requeridos incompletos",
            details: "tipo_sensor, nombre y unidad_medida son obligatorios"
        });
    }

    const sql = `INSERT INTO sensores (tipo_sensor, estado, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [tipo_sensor, estado, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar sensor:", err);
            return res.status(500).json({ error: "Error al agregar el sensor" });
        }
        res.status(201).json({ message: "Sensor agregado correctamente", id: result.insertId });
    });
});

// Ruta para obtener sensores
app.get('/api/sensores', (req, res) => {
    db.query('SELECT * FROM sensores', (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener sensores' });
      }
      res.json(results);
    });
});

// Ruta para obtener insumos
app.get('/api/insumos', (req, res) => {
    db.query('SELECT * FROM insumos', (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener insumos' });
      }
      res.json(results);
    });
});
app.get('/api/producciones', (req, res) => {
    db.query('SELECT * FROM producciones', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener producciones' });
        }
        res.json(results);
    });
});


app.get('/api/generar-id', (req, res) => {
    const nuevoId = Date.now();  // Genera un ID único
    res.json({ id: nuevoId });
});


const express = require('express');

// Ruta para obtener todas las producciones
app.get('/api/producciones', (req, res) => {
    // Lógica para obtener producciones desde la base de datos
    res.json(producciones); // respuesta con las producciones en formato JSON
  });
  
  // Ruta para generar un ID
  app.get('/api/generar-id', (req, res) => {
    const id = generarId(); // Generar ID desde la base de datos o lógica personalizada
    res.json({ id });
  });
  
  // Ruta para verificar si el nombre de producción ya existe
  app.get('/api/verificar-nombre', (req, res) => {
    const { nombre } = req.query;
    const existe = verificarNombre(nombre); // Lógica para verificar si el nombre ya existe
    res.json({ existe });
  });
  


// Iniciar servidor
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});
