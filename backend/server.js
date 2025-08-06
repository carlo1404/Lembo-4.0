import mysql from "mysql2";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from "multer";
import express from "express"


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
    port: 4400
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
// =================== USUARIOS ===================
// Ruta para obtener usuarios
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.status(200).json(results);
    });
});

// Ruta para obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el usuario' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(results[0]);
    });
});
app.put('/usuarios/:id/estado', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || (estado !== 'activo' && estado !== 'inactivo')) {
        return res.status(400).json({ error: "El campo 'estado' es obligatorio y debe ser 'activo' o 'inactivo'." });
    }

    const query = 'UPDATE usuarios SET estado = ? WHERE id = ?';
    db.query(query, [estado, id], (err, results) => {
        if (err) {
            console.error('❌ Error al actualizar el estado del usuario:', err);
            return res.status(500).json({ error: 'Error al actualizar el estado del usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Estado del usuario actualizado correctamente', userId: id, nuevoEstado: estado });
    });
});
app.post('/usuarios', (req, res) => {
    const { nombre, apellido, numero_telefonico, rol } = req.body;

    if (!nombre || !apellido || !rol) {
        return res.status(400).json({ error: "Los campos nombre, apellido y rol son obligatorios" });
    }

    const query = 'INSERT INTO usuarios (nombre, apellido, numero_telefonico, rol) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, apellido, numero_telefonico, rol], (err, results) => {
        if (err) {
            console.error('❌ Error al crear usuario:', err);
            return res.status(500).json({ error: 'Error al crear el usuario' });
        }
        res.status(201).json({ message: 'Usuario creado correctamente', userId: results.insertId });
    });
});
// Ruta para actualizar un usuario
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, numero_telefonico, rol } = req.body;

    if (!nombre || !apellido || !rol) {
        return res.status(400).json({ error: "Los campos nombre, apellido y rol son obligatorios" });
    }

    const query = 'UPDATE usuarios SET nombre = ?, apellido = ?, numero_telefonico = ?, rol = ? WHERE id = ?';
    db.query(query, [nombre, apellido, numero_telefonico, rol, id], (err, results) => {
        if (err) {
            console.error('❌ Error al actualizar usuario:', err);
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    });
});

// Ruta para eliminar un usuario
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar usuario:', err);
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    });
});

// =================== CULTIVOS ===================
// Ruta para obtener cultivos
app.get('/cultivos', (req, res) => {
    db.query('SELECT * FROM cultivos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener cultivos' });
        }
        res.status(200).json(results);
    });
});

// Ruta para obtener un cultivo por ID
app.get('/cultivos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM cultivos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el cultivo' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }
        res.status(200).json(results[0]);
    });
});
app.post('/cultivos', (req, res) => {
    console.log(req.body);
    const { nombre, tipo, ubicacion, descripcion } = req.body;

    if (!nombre || !tipo || !ubicacion) {
        return res.status(400).json({ error: "Los campos nombre, tipo, ubicacion y usuario_id son obligatorios" });
    }
    const usuario_id = 1
    const validUbicaciones = ['Parcela 3', 'Parcela 5', 'Invernadero Norte', 'Invernadero Central'];
    if (!validUbicaciones.includes(ubicacion)) {
        return res.status(400).json({ error: `El campo ubicacion debe ser uno de los siguientes: ${validUbicaciones.join(', ')}` });
    }

    const query = 'INSERT INTO cultivos (nombre, tipo, ubicacion, descripcion, usuario_id) VALUES (?, ?, ?, ?, ?)';
    const params = [nombre, tipo, ubicacion, descripcion, usuario_id];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('❌ Error al crear cultivo:', err);
            return res.status(500).json({ error: 'Error al crear el cultivo' });
        }
        res.status(201).json({ message: 'Cultivo creado correctamente', cultivoId: results.insertId });
    });
});
// Ruta para actualizar un cultivo
app.put('/cultivos/:id', upload.single("imagen"), (req, res) => {
    const { id } = req.params;
    const { nombre, tipo, ubicacion, descripcion} = req.body;
    const imagen = req.file ? req.file.filename : null;
    let usuario_id = 1
    let query = 'UPDATE cultivos SET nombre = ?, tipo = ?, ubicacion = ?, descripcion = ?, usuario_id = ?';
    let params = [nombre, tipo, ubicacion, descripcion, usuario_id];

    if (imagen) {
        query += ', imagen = ?';
        params.push(imagen);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('❌ Error al actualizar cultivo:', err);
            return res.status(500).json({ error: 'Error al actualizar el cultivo' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }
        res.status(200).json({ message: 'Cultivo actualizado correctamente' });
    });
});

// Ruta para eliminar un cultivo
app.delete('/cultivos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM cultivos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar cultivo:', err);
            return res.status(500).json({ error: 'Error al eliminar el cultivo' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Cultivo no encontrado' });
        }
        res.status(200).json({ message: 'Cultivo eliminado correctamente' });
    });
});

// =================== INSUMOS ===================
// Ruta para obtener un insumo por ID
app.get('/insumos', (req, res) => {
    db.query('SELECT * FROM insumos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los insumo' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Insumos no encontrados' });
        }
        res.status(200).json(results);
    });
});
app.get('/insumos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM insumos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el insumo' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

// Ruta para actualizar un insumo
app.put('/insumos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, valor_unitario, cantidad, unidad, descripcion } = req.body;

    if (!nombre || !valor_unitario || !cantidad || !unidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    db.query(
        'UPDATE insumos SET nombre = ?, valor_unitario = ?, cantidad = ?, unidad = ?, descripcion = ? WHERE id = ?',
        [nombre, valor_unitario, cantidad, unidad, descripcion, id],
        (err, results) => {
            if (err) {
                console.error('❌ Error al actualizar insumo:', err);
                return res.status(500).json({ error: 'Error al actualizar el insumo' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Insumo no encontrado' });
            }
            res.status(200).json({ message: 'Insumo actualizado correctamente' });
        }
    );
});

// Ruta para eliminar un insumo
app.delete('/insumos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM insumos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar insumo:', err);
            return res.status(500).json({ error: 'Error al eliminar el insumo' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Insumo no encontrado' });
        }
        res.status(200).json({ message: 'Insumo eliminado correctamente' });
    });
});
app.post('/insumos', (req, res) => {
    const { nombre, valor_unitario, cantidad, unidad, descripcion } = req.body;

    if (!nombre || !valor_unitario || !cantidad || !unidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const validUnidades = ['kilo', 'gramos', 'pascal', 'metros'];
    if (!validUnidades.includes(unidad)) {
        return res.status(400).json({ error: `El campo 'unidad' debe ser uno de los siguientes: ${validUnidades.join(', ')}` });
    }

    db.query(
        'INSERT INTO insumos (nombre, valor_unitario, cantidad, unidad, descripcion) VALUES (?, ?, ?, ?, ?)',
        [nombre, valor_unitario, cantidad, unidad, descripcion],
        (err, results) => {
            if (err) {
                console.error('❌ Error al crear insumo:', err);
                return res.status(500).json({ error: 'Error al crear el insumo' });
            }
            res.status(201).json({ message: 'Insumo creado correctamente', insumoId: results.insertId });
        }
    );
});
// =================== SENSORES ===================
// Ruta para obtener un sensor por ID
app.get('/sensores', (req, res) => {
    db.query('SELECT * FROM sensores', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los sensores' });
        }
        res.status(200).json(results);
    });
});
app.get('/sensores/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM sensores WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el sensor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

app.post('/sensores', (req, res) => {
    console.log(req.body)
    const {
        tipo_sensor,
        estado,
        nombre,
        unidad_medida,
        tiempo_muestreo,
        imagen,
        descripcion
    } = req.body;

    // Validaciones básicas
    if (!tipo_sensor || typeof tipo_sensor !== 'string') {
        return res.status(400).json({ error: 'El tipo de sensor es requerido y debe ser texto.' });
    }

    if (!estado || typeof estado !== 'string') {
        return res.status(400).json({ error: 'El estado es requerido y debe ser texto.' });
    }

    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ error: 'El nombre es requerido y debe ser texto.' });
    }

    if (!unidad_medida || typeof unidad_medida !== 'string') {
        return res.status(400).json({ error: 'La unidad de medida es requerida y debe ser texto.' });
    }

    if (!tiempo_muestreo || isNaN(tiempo_muestreo)) {
        return res.status(400).json({ error: 'El tiempo de muestreo es requerido y debe ser numérico.' });
    }
    try {
        const sql = `
        INSERT INTO sensores (tipo_sensor, estado, nombre, unidad_medida, tiempo_muestreo, imagen, descripcion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

        const values = [
            tipo_sensor.trim(),
            estado.trim(),
            nombre.trim(),
            unidad_medida.trim(),
            parseFloat(tiempo_muestreo),
            'default',
            descripcion || null
        ];
        db.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Error al crear el sensor' });
            }
            res.status(201).json(results);
        });
    } catch (error) {
        console.error('Error al crear el sensor:', error);
        res.status(500).json({ error: 'Error del servidor al insertar el sensor.' });
    }
});

// Ruta para actualizar un sensor
app.put('/sensores/:id', upload.single("imagen"), (req, res) => {
    const { id } = req.params;
    const { tipo_sensor, estado, nombre, unidad_medida, tiempo_muestreo, descripcion } = req.body;
    const imagen = req.file ? req.file.filename : null;

    let query = 'UPDATE sensores SET tipo_sensor = ?, estado = ?, nombre = ?, unidad_medida = ?, tiempo_muestreo = ?, descripcion = ?';
    let params = [tipo_sensor, estado, nombre, unidad_medida, tiempo_muestreo, descripcion];

    if (imagen) {
        query += ', imagen = ?';
        params.push(imagen);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('❌ Error al actualizar sensor:', err);
            return res.status(500).json({ error: 'Error al actualizar el sensor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado' });
        }
        res.status(200).json({ message: 'Sensor actualizado correctamente' });
    });
});

// Ruta para eliminar un sensor
app.delete('/sensores/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM sensores WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar sensor:', err);
            return res.status(500).json({ error: 'Error al eliminar el sensor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado' });
        }
        res.status(200).json({ message: 'Sensor eliminado correctamente' });
    });
});

// =================== CICLOS ===================
// Ruta para obtener ciclos
app.get('/ciclos', (req, res) => {
    db.query('SELECT * FROM ciclos', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener ciclos' });
        }
        res.status(200).json(results);
    });
});

// Ruta para obtener un ciclo por ID
app.get('/ciclos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM ciclos WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el ciclo' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Ciclo no encontrado' });
        }
        res.status(200).json(results[0]);
    });
});

// Ruta para agregar un ciclo
app.post('/ciclos', (req, res) => {
    const { nombre, duracion } = req.body;

    if (!nombre || !duracion) {
        return res.status(400).json({ error: "Nombre y duración son obligatorios" });
    }

    db.query(
        'INSERT INTO ciclos (nombre, duracion) VALUES (?, ?)',
        [nombre, duracion],
        (err, results) => {
            if (err) {
                console.error('❌ Error al insertar ciclo:', err);
                return res.status(500).json({ error: 'Error al agregar el ciclo' });
            }
            res.status(201).json({
                id: results.insertId,
                nombre,
                duracion,
                fecha_registro: new Date().toISOString()
            });
        }
    );
});

// Ruta para actualizar un ciclo
app.put('/ciclos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, duracion } = req.body;

    if (!nombre || !duracion) {
        return res.status(400).json({ error: "Nombre y duración son obligatorios" });
    }

    db.query(
        'UPDATE ciclos SET nombre = ?, duracion = ? WHERE id = ?',
        [nombre, duracion, id],
        (err, results) => {
            if (err) {
                console.error('❌ Error al actualizar ciclo:', err);
                return res.status(500).json({ error: 'Error al actualizar el ciclo' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Ciclo no encontrado' });
            }
            res.status(200).json({ message: 'Ciclo actualizado correctamente' });
        }
    );
});

// Ruta para eliminar un ciclo
app.delete('/ciclos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM ciclos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar ciclo:', err);
            return res.status(500).json({ error: 'Error al eliminar el ciclo' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Ciclo no encontrado' });
        }
        res.status(200).json({ message: 'Ciclo eliminado correctamente' });
    });
});

// =================== PRODUCCIONES ===================
// Ruta para agregar una producción
app.get('/producciones', (req, res) => {
    const produccionesQuery = 'SELECT * FROM producciones';

    db.query(produccionesQuery, (err, producciones) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener producciones', details: err.message });
        }

        const promises = producciones.map(produccion => {
            return new Promise((resolve, reject) => {
                const { id } = produccion;

                db.query('SELECT s.* FROM sensores s JOIN produccion_sensores ps ON s.id = ps.sensor_id WHERE ps.produccion_id = ?', [id], (err, sensores) => {
                    if (err) return reject(err);

                    db.query('SELECT i.* FROM insumos i JOIN produccion_insumos pi ON i.id = pi.insumo_id WHERE pi.produccion_id = ?', [id], (err, insumos) => {
                        if (err) return reject(err);

                        resolve({
                            ...produccion,
                            sensores,
                            insumos
                        });
                    });
                });
            });
        });

        Promise.all(promises)
            .then(result => res.json(result))
            .catch(err => res.status(500).json({ error: 'Error al obtener datos relacionados', details: err.message }));
    });
});

app.post('/producciones', (req, res) => {
    const {
        id, nombre, responsable_id, cultivo_id, ciclo_id,
        fecha_inicio, fecha_fin, inversion, meta, estado,
        insumos = [], sensores = []
    } = req.body;

    if (!id || !nombre || !responsable_id || !cultivo_id || !ciclo_id || !fecha_inicio) {
        return res.status(400).json({
            error: "Campos incompletos",
            details: "id, nombre, responsable_id, cultivo_id, ciclo_id y fecha_inicio son obligatorios"
        });
    }

    // Paso 1: Validar stock de todos los insumos
    const checkInsumos = (index = 0) => {
        if (index >= insumos.length) return insertProduccion(); // todos validados

        const insumoId = insumos[index];
        db.query('SELECT cantidad FROM insumos WHERE id = ?', [insumoId], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al consultar insumos', details: err.message });
            }
            if (results.length === 0 || results[0].cantidad <= 0) {
                return res.status(400).json({ error: `El insumo con ID ${insumoId} no tiene stock suficiente.` });
            }
            checkInsumos(index + 1); // siguiente insumo
        });
    };

    const insertProduccion = () => {
        const query = `
            INSERT INTO producciones 
            (id, nombre, responsable_id, cultivo_id, ciclo_id, fecha_inicio, fecha_fin, inversion, meta, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [
            id, nombre, responsable_id, cultivo_id, ciclo_id,
            fecha_inicio, fecha_fin || null,
            inversion || 0, meta || 0,
            estado || 'activo'
        ], (err) => {
            if (err) {
                console.error('❌ Error al insertar producción:', err);
                return res.status(500).json({ error: 'Error al agregar la producción', details: err.message });
            }

            insertSensores(0); // luego sensores
        });
    };

    const insertSensores = (index) => {
        if (index >= sensores.length) return insertInsumos(0); // siguiente paso

        const sensorId = sensores[index];
        db.query('INSERT INTO produccion_sensores (produccion_id, sensor_id) VALUES (?, ?)', [id, sensorId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al insertar sensor', details: err.message });
            }
            insertSensores(index + 1);
        });
    };

    const insertInsumos = (index) => {
        if (index >= insumos.length) {
            return res.status(201).json({ message: "Producción agregada exitosamente", id: id });
        }

        const insumoId = insumos[index];

        db.query('INSERT INTO produccion_insumos (produccion_id, insumo_id) VALUES (?, ?)', [id, insumoId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al insertar insumo', details: err.message });
            }

            db.query('UPDATE insumos SET cantidad = cantidad - 1 WHERE id = ?', [insumoId], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al descontar insumo', details: err.message });
                }
                insertInsumos(index + 1);
            });
        });
    };

    // Inicia el flujo
    checkInsumos();
});


// Ruta para obtener una producción por ID
app.get('/producciones/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM producciones WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener producción', details: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Producción no encontrada' });
        }

        const produccion = results[0];

        db.query('SELECT s.* FROM sensores s JOIN produccion_sensores ps ON s.id = ps.sensor_id WHERE ps.produccion_id = ?', [id], (err, sensores) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener sensores', details: err.message });
            }

            db.query('SELECT i.* FROM insumos i JOIN produccion_insumos pi ON i.id = pi.insumo_id WHERE pi.produccion_id = ?', [id], (err, insumos) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al obtener insumos', details: err.message });
                }

                res.json({
                    ...produccion,
                    sensores,
                    insumos
                });
            });
        });
    });
});


// Ruta para actualizar una producción
app.put('/producciones/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre, responsable_id, cultivo_id, ciclo_id,
        fecha_inicio, fecha_fin, inversion, meta, estado
    } = req.body;

    if (!nombre || !responsable_id || !cultivo_id || !ciclo_id || !fecha_inicio) {
        return res.status(400).json({
            error: "Campos incompletos",
            details: "nombre, responsable_id, cultivo_id, ciclo_id y fecha_inicio son obligatorios"
        });
    }

    const query = `
        UPDATE producciones 
        SET nombre = ?, responsable_id = ?, cultivo_id = ?, ciclo_id = ?, 
            fecha_inicio = ?, fecha_fin = ?, inversion = ?, meta = ?, estado = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.query(
        query,
        [
            nombre, responsable_id, cultivo_id, ciclo_id,
            fecha_inicio, fecha_fin || null,
            inversion || 0, meta || 0,
            estado || 'activo',
            id
        ],
        (err, results) => {
            if (err) {
                console.error('❌ Error al actualizar producción:', err);
                return res.status(500).json({ error: 'Error al actualizar la producción' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Producción no encontrada' });
            }
            res.status(200).json({ message: 'Producción actualizada correctamente' });
        }
    );
});

// Ruta para eliminar una producción
app.delete('/producciones/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM producciones WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar producción:', err);
            return res.status(500).json({ error: 'Error al eliminar la producción' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Producción no encontrada' });
        }
        res.status(200).json({ message: 'Producción eliminada correctamente' });
    });
});

// =================== RELACIONES PRODUCCIÓN-INSUMOS ===================
// Ruta para obtener insumos de una producción
app.get('/produccion_insumos/:produccion_id', (req, res) => {
    const { produccion_id } = req.params;
    db.query('SELECT * FROM produccion_insumos WHERE produccion_id = ?', [produccion_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener insumos de la producción' });
        }
        res.status(200).json(results);
    });
});

// Ruta para agregar un insumo a una producción
app.post('/produccion_insumos', (req, res) => {
    const { produccion_id, insumo_id } = req.body;

    if (!produccion_id || !insumo_id) {
        return res.status(400).json({ error: "produccion_id e insumo_id son obligatorios" });
    }

    db.query(
        'INSERT INTO produccion_insumos (produccion_id, insumo_id) VALUES (?, ?)',
        [produccion_id, insumo_id],
        (err, results) => {
            if (err) {
                console.error('❌ Error al insertar relación producción-insumo:', err);
                return res.status(500).json({ error: 'Error al agregar el insumo a la producción' });
            }
            res.status(201).json({ message: "Insumo agregado a la producción exitosamente" });
        }
    );
});

// Ruta para eliminar un insumo de una producción
app.delete('/produccion_insumos/:produccion_id/:insumo_id', (req, res) => {
    const { produccion_id, insumo_id } = req.params;
    db.query(
        'DELETE FROM produccion_insumos WHERE produccion_id = ? AND insumo_id = ?',
        [produccion_id, insumo_id],
        (err, results) => {
            if (err) {
                console.error('❌ Error al eliminar relación producción-insumo:', err);
                return res.status(500).json({ error: 'Error al eliminar el insumo de la producción' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Relación no encontrada' });
            }
            res.status(200).json({ message: 'Insumo eliminado de la producción correctamente' });
        }
    );
});

// =================== RELACIONES PRODUCCIÓN-SENSORES ===================
// Ruta para obtener sensores de una producción
app.get('/produccion_sensores/:produccion_id', (req, res) => {
    const { produccion_id } = req.params;
    db.query('SELECT * FROM produccion_sensores WHERE produccion_id = ?', [produccion_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener sensores de la producción' });
        }
        res.status(200).json(results);
    });
});

// Ruta para agregar un sensor a una producción
app.post('/produccion_sensores', (req, res) => {
    const { produccion_id, sensor_id } = req.body;

    if (!produccion_id || !sensor_id) {
        return res.status(400).json({ error: "produccion_id y sensor_id son obligatorios" });
    }

    db.query(
        'INSERT INTO produccion_sensores (produccion_id, sensor_id) VALUES (?, ?)',
        [produccion_id, sensor_id],
        (err, results) => {
            if (err) {
                console.error('❌ Error al insertar relación producción-sensor:', err);
                return res.status(500).json({ error: 'Error al agregar el sensor a la producción' });
            }
            res.status(201).json({ message: "Sensor agregado a la producción exitosamente" });
        }
    );
});

// Ruta para eliminar un sensor de una producción
app.delete('/produccion_sensores/:produccion_id/:sensor_id', (req, res) => {
    const { produccion_id, sensor_id } = req.params;
    db.query(
        'DELETE FROM produccion_sensores WHERE produccion_id = ? AND sensor_id = ?',
        [produccion_id, sensor_id],
        (err, results) => {
            if (err) {
                console.error('❌ Error al eliminar relación producción-sensor:', err);
                return res.status(500).json({ error: 'Error al eliminar el sensor de la producción' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Relación no encontrada' });
            }
            res.status(200).json({ message: 'Sensor eliminado de la producción correctamente' });
        }
    );
});

// =================== LECTURAS DE SENSORES ===================
// Ruta para obtener lecturas de un sensor
app.get('/lecturas_sensor/:sensor_id', (req, res) => {
    const { sensor_id } = req.params;
    db.query('SELECT * FROM lecturas_sensor WHERE sensor_id = ? ORDER BY fecha DESC', [sensor_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener lecturas del sensor' });
        }
        res.status(200).json(results);
    });
});

// Ruta para obtener lecturas de sensores de una producción
app.get('/lecturas_sensor/produccion/:produccion_id', (req, res) => {
    const { produccion_id } = req.params;
    db.query('SELECT * FROM lecturas_sensor WHERE produccion_id = ? ORDER BY fecha DESC', [produccion_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener lecturas de sensores de la producción' });
        }
        res.status(200).json(results);
    });
});

// Ruta para agregar una lectura de sensor
app.post('/lecturas_sensor', (req, res) => {
    const { produccion_id, sensor_id, fecha, valor, unidad } = req.body;

    if (!sensor_id || !fecha || valor === undefined || !unidad) {
        return res.status(400).json({
            error: "Campos incompletos",
            details: "sensor_id, fecha, valor y unidad son obligatorios"
        });
    }

    db.query(
        'INSERT INTO lecturas_sensor (produccion_id, sensor_id, fecha, valor, unidad) VALUES (?, ?, ?, ?, ?)',
        [produccion_id, sensor_id, fecha, valor, unidad],
        (err, results) => {
            if (err) {
                console.error('❌ Error al insertar lectura de sensor:', err);
                return res.status(500).json({ error: 'Error al agregar la lectura del sensor' });
            }
            res.status(201).json({
                message: "Lectura de sensor agregada exitosamente",
                id: results.insertId
            });
        }
    );
});

// =================== USO DE INSUMOS ===================
// Ruta para obtener registros de uso de insumos
app.get('/uso_insumos/:produccion_id', (req, res) => {
    const { produccion_id } = req.params;
    db.query('SELECT * FROM uso_insumos WHERE produccion_id = ? ORDER BY fecha DESC', [produccion_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener registros de uso de insumos' });
        }
        res.status(200).json(results);
    });
});

// Ruta para agregar un registro de uso de insumo
app.post('/uso_insumos', (req, res) => {
    const {
        produccion_id, insumo_id, fecha, cantidad,
        responsable_id, valor_unitario, valor_total, observaciones
    } = req.body;

    if (!produccion_id || !insumo_id || !fecha || !cantidad || !responsable_id || !valor_unitario) {
        return res.status(400).json({
            error: "Campos incompletos",
            details: "produccion_id, insumo_id, fecha, cantidad, responsable_id y valor_unitario son obligatorios"
        });
    }

    // Calcular valor total si no se proporciona
    const total = valor_total || (parseFloat(valor_unitario) * parseFloat(cantidad));

    db.query(
        `INSERT INTO uso_insumos 
        (produccion_id, insumo_id, fecha, cantidad, responsable_id, valor_unitario, valor_total, observaciones) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [produccion_id, insumo_id, fecha, cantidad, responsable_id, valor_unitario, total, observaciones],
        (err, results) => {
            if (err) {
                console.error('❌ Error al insertar uso de insumo:', err);
                return res.status(500).json({ error: 'Error al agregar el registro de uso de insumo' });
            }
            res.status(201).json({
                message: "Registro de uso de insumo agregado exitosamente",
                id: results.insertId
            });
        }
    );
});

// Ruta para eliminar un registro de uso de insumo
app.delete('/uso_insumos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM uso_insumos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('❌ Error al eliminar registro de uso de insumo:', err);
            return res.status(500).json({ error: 'Error al eliminar el registro de uso de insumo' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Registro de uso de insumo eliminado correctamente' });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});
