const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Responder a preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta principal del API
app.get('/api', (req, res) => {
  res.json({ 
    message: "Hola desde el backend",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Ruta para información del sistema
app.get('/api/info', (req, res) => {
  res.json({
    service: "Multi-Container Backend",
    version: "1.0.0",
    node_version: process.version,
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    memory_usage: process.memoryUsage()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    message: err.message
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend escuchando en http://localhost:${port}`);
  console.log(`📊 Health check disponible en http://localhost:${port}/api/health`);
  console.log(`ℹ️  Info del sistema en http://localhost:${port}/api/info`);
});
