import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Pool de conexiones reutilizable
const pool = mysql.createPool({
    host: process.env.DB_HOST,          // Debe ser 'localhost' si estás usando MySQL Workbench
    user: process.env.DB_USER,          // Usuario de la base de datos
    password: process.env.DB_PASSWORD,  // Contraseña de la base de datos
    database: process.env.DB_NAME,      // Nombre de la base de datos
    port: process.env.DB_PORT || 3307,  // Puerto de la base de datos
    waitForConnections: true,
    connectionLimit: 10,                // Máximo de conexiones simultáneas
});

export default pool;
