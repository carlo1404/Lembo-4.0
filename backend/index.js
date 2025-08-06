/*// backend/index.js o app.js
const express = require('express');
const app = express();

const insumosRoutes = require('./routes/insumos');
const cultivosRoutes = require('./routes/cultivos');

app.use('/api/insumos', insumosRoutes);
app.use('/api/cultivos', cultivosRoutes);

// ...
