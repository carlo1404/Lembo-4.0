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
    console.log("🖼️ Imagen:", req.file);

    if (!tipo_sensor || !estado || !nombre) {
        return res.status(400).json({ error: "Los campos obligatorios no fueron completados" });
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


// ————— RUTAS PARA PRODUCCIONES —————

// 1) Listar producciones con sus relaciones
app.get('/api/producciones', (req, res) => {
    db.query('SELECT * FROM produccion ORDER BY creado_en DESC', (err, prods) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al leer producciones' });
      }
      Promise.all(prods.map(p => new Promise((resolve, reject) => {
        db.query(
          'SELECT sensor_id FROM produccion_sensor WHERE produccion_id = ?',
          [p.id],
          (e1, sensRows) => {
            if (e1) return reject(e1);
            db.query(
              'SELECT insumo_id FROM produccion_insumo WHERE produccion_id = ?',
              [p.id],
              (e2, insuRows) => {
                if (e2) return reject(e2);
                resolve({
                  ...p,
                  sensores: sensRows.map(r => r.sensor_id),
                  insumos:  insuRows.map(r => r.insumo_id)
                });
              }
            );
          }
        );
      })))
      .then(results => res.json(results))
      .catch(err2 => {
        console.error(err2);
        res.status(500).json({ error: 'Error al cargar relaciones' });
      });
    });
  });
  
  // 2) Crear nueva producción
  app.post('/api/producciones', (req, res) => {
    const {
      nombre, responsable, cultivo, ciclo,
      sensores, insumos,
      fecha_inicio, fecha_fin,
      inversion, meta, estado
    } = req.body;
  
    // Generar ID con contador anual
    const now = new Date();
    const year = now.getFullYear();
    db.query(
      'SELECT COUNT(*) AS c FROM produccion WHERE YEAR(creado_en)=?',
      [year],
      (err1, rows) => {
        if (err1) {
          console.error(err1);
          return res.status(500).json({ error: 'Error al generar ID' });
        }
        const nextNo = String(rows[0].c + 1).padStart(4,'0');
        const dd = String(now.getDate()).padStart(2,'0');
        const mm = String(now.getMonth()+1).padStart(2,'0');
        const yy = String(now.getFullYear()).slice(-2);
        const id  = `PROD-${dd}${mm}${yy}-${nextNo}`;
  
        // Insertar producción
        const sqlP = `
          INSERT INTO produccion
            (id,nombre,responsable_id,cultivo_id,ciclo_id,
             fecha_inicio,fecha_fin,inversion,meta,estado)
          VALUES (?,?,?,?,?,?,?,?,?,?)
        `;
        db.query(
          sqlP,
          [id,nombre,responsable,cultivo,ciclo,
           fecha_inicio,fecha_fin,inversion,meta,estado],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ error: 'Error al insertar producción' });
            }
  
            // Insertar sensores
            const promSens = sensores.map(sid => new Promise((y,n) => {
              db.query(
                'INSERT INTO produccion_sensor (produccion_id, sensor_id) VALUES (?, ?)',
                [id, sid],
                err3 => err3 ? n(err3) : y()
              );
            }));
            // Insertar insumos
            const promInsu = insumos.map(iid => new Promise((y,n) => {
              db.query(
                'INSERT INTO produccion_insumo (produccion_id, insumo_id) VALUES (?, ?)',
                [id, iid],
                err4 => err4 ? n(err4) : y()
              );
            }));
  
            Promise.all([...promSens, ...promInsu])
              .then(() => {
                res.status(201).json({
                  success: true,
                  data: { id, nombre, responsable, cultivo, ciclo,
                          sensores, insumos, fecha_inicio, fecha_fin,
                          inversion, meta, estado }
                });
              })
              .catch(err5 => {
                console.error(err5);
                res.status(500).json({ error: 'Error al insertar relaciones' });
              });
          }
        );
      }
    );
  });
  
  // 3) Actualizar producción existente
  app.put('/api/producciones/:id', (req, res) => {
    const { id } = req.params;
    const {
      nombre, responsable, cultivo, ciclo,
      sensores, insumos,
      fecha_inicio, fecha_fin,
      inversion, meta, estado
    } = req.body;
  
    // 1) Actualizar datos principales
    const sqlUpdate = `
        UPDATE produccion
            SET nombre        = ?,
                responsable_id= ?,
                cultivo_id    = ?,
                ciclo_id      = ?,
                fecha_inicio  = ?,
                fecha_fin     = ?,
                inversion     = ?,
                meta          = ?,
                estado        = ?
        WHERE id = ?
    `;
    db.query(
      sqlUpdate,
      [nombre, responsable, cultivo, ciclo,
       fecha_inicio, fecha_fin, inversion, meta, estado,
       id],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al actualizar producción' });
        }
  
        // 2) Reemplazar sensores
        db.query('DELETE FROM produccion_sensor WHERE produccion_id = ?', [id], (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ error: 'Error al borrar sensores antiguos' });
          }
          const promSens = sensores.map(sid => new Promise((y,n) => {
            db.query(
              'INSERT INTO produccion_sensor (produccion_id, sensor_id) VALUES (?, ?)',
              [id, sid],
              err3 => err3 ? n(err3) : y()
            );
          }));
  
          // 3) Reemplazar insumos
          db.query('DELETE FROM produccion_insumo WHERE produccion_id = ?', [id], (err4) => {
            if (err4) {
              console.error(err4);
              return res.status(500).json({ error: 'Error al borrar insumos antiguos' });
            }
            const promInsu = insumos.map(iid => new Promise((y,n) => {
              db.query(
                'INSERT INTO produccion_insumo (produccion_id, insumo_id) VALUES (?, ?)',
                [id, iid],
                err5 => err5 ? n(err5) : y()
              );
            }));
  
            Promise.all([...promSens, ...promInsu])
              .then(() => res.json({ success: true }))
              .catch(err6 => {
                console.error(err6);
                res.status(500).json({ error: 'Error al insertar relaciones nuevas' });
              });
          });
        });
      }
    );
  });
// Iniciar servidor
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});
