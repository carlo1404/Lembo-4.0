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
    port: 4400
});

// Verificar conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error("❌ Error de conexión a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a la base de datos MySQL");
});

// Ruta única para agregar insumos
app.post("/api/insumos", (req, res) => {
    console.log("📩 Datos recibidos:", req.body);

    const { id, nombre, valor_unitario, cantidad, unidad, descripcion } = req.body;

    // Validación de campos
    if (!id || !nombre || !valor_unitario || !cantidad || !unidad ) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Consulta SQL
    db.query(
        'INSERT INTO insumos (id, nombre, valor_unitario, cantidad, unidad, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        [id, nombre, valor_unitario, cantidad, unidad, descripcion],
        (err, results) => {
            if (err) {
                console.error('❌ Error al insertar en la base de datos:', err);
                return res.status(500).json({ error: "Error al agregar el insumo" });
            }
            res.status(201).json({ insertId: results.insertId, id, nombre, valor_unitario, cantidad, unidad, descripcion });
        }
    );
});

// Iniciar servidor
app.listen(5500, () => {
    console.log("✅ Server running on http://localhost:5500");
});
