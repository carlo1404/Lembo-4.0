import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

// Configurar middleware
app.use(express.json()); // Permitir el uso de JSON en las peticiones
app.use(cors()); // Evitar problemas con CORS

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lembo',
    port: 4400
});

// Manejo de errores en la conexión
db.connect(err => {
    if (err) {
        console.error("❌ Error de conexión a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a la base de datos MySQL");
});

// Ruta para agregar cultivos
// app.post("/api/cultivos", (req, res) => {
//    const { nombre, tipo, ubicacion, descripcion } = req.body;

 //   if (!nombre || !tipo || !ubicacion) {
 //       return res.status(400).json({ message: "Todos los campos obligatorios deben estar llenos." });
 //   }

 //   const sql = "INSERT INTO cultivos (nombre, tipo, ubicacion, descripcion) VALUES (?, ?, ?, ?)";
 //   db.query(sql, [nombre, tipo, ubicacion, descripcion], (err, result) => {
 //       if (err) {
 //           console.error("Error al insertar en la base de datos:", err);
 //           return res.status(500).json({ message: "Error al agregar cultivo" });
 //       }
 //       res.status(201).json({ message: "Cultivo agregado correctamente", id: result.insertId });
 //   });
// });

// Ruta para agregar insumos
app.post("/api/insumos", (req, res) => {
    console.log("📩 Datos recibidos:", req.body);

app.post('/insumo', (req, res) => {
    const {name, id, valor, cantidad, unidad, descripcion} = req.body;
    db.query(
        'INSERT INTO insumos (name, id, valor, cantidad, unidad, descripcion) VALUES (?, ?, ?, ?, ?, ?)',
        [name, id, valor, cantidad, unidad, descripcion],
        (err, results) => {
            if(err){
                console.log('Error inserting user: ', err);
                res.status(500).json({error: 'Error inserting user'});
            }else{
                res.status(201).json({id: results.insertId, name, id, valor, cantidad, unidad, descripcion});
            }
        }
    );
});
app.listen(5500, () => {
    console.log('Server is running on puerto htt://localhost:5500');
    });
});