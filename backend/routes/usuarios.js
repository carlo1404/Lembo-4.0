// Suponiendo que tienes una lista de usuarios o estás consultando desde una base de datos
const express = require('express');
const app = express();
const port = 3307;

// Lista de usuarios simulada (puedes obtenerla de la base de datos)
const usuarios = [
  { id: 1, nombre: 'Juan Pérez', rol: 'responsable' },
  { id: 2, nombre: 'Ana Gómez', rol: 'admin' },
  { id: 3, nombre: 'Carlos López', rol: 'responsable' },
  { id: 4, nombre: 'Marta Sánchez', rol: 'usuario' },
];

// Mapeo de roles
const rolMap = {
  responsable: 'Administrador (admin)',
  admin: 'Administrador (admin)',
  personal_apoyo: 'Personal de apoyo',
  usuario: 'Usuario'
};

// Ruta para obtener usuarios por rol
app.get('/api/usuarios', (req, res) => {
  const rol = req.query.rol; // Obtén el parámetro 'rol' de la query string
  if (!rol) {
    return res.status(400).json({ error: 'El parámetro rol es necesario.' });
  }

  // Filtrar usuarios por rol
  const usuariosFiltrados = usuarios.filter(usuario => usuario.rol === rol);

  // Mapeo de roles antes de enviar la respuesta
  const usuariosMapeados = usuariosFiltrados.map(usuario => ({
    ...usuario,
    rol: rolMap[usuario.rol] || usuario.rol // Mapeo del rol
  }));

  // Devolver los usuarios filtrados con el rol mapeado
  res.json(usuariosMapeados);
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
