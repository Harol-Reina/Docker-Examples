const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Variables de entorno para demostrar configuración
const environment = process.env.NODE_ENV || 'development';
const dbUrl = process.env.DATABASE_URL || 'sqlite://localhost/dev.db';
const apiKey = process.env.API_KEY || 'dev-api-key';

// Datos en memoria para simular una base de datos
let tasks = [
  { id: 1, title: 'Configurar Docker', completed: false, created: new Date().toISOString() },
  { id: 2, title: 'Configurar hot-reload', completed: true, created: new Date().toISOString() },
  { id: 3, title: 'Agregar variables de entorno', completed: true, created: new Date().toISOString() }
];

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ¡Entorno de desarrollo Dockerizado funcionando!',
    environment: environment,
    timestamp: new Date().toISOString(),
    version: require('./package.json').version,
    features: [
      '✅ Hot reload con nodemon',
      '✅ Variables de entorno',
      '✅ API REST completa',
      '✅ Archivos estáticos',
      '✅ CORS habilitado',
      '✅ Logs de desarrollo'
    ]
  });
});

// API de desarrollo - información del entorno
app.get('/dev/info', (req, res) => {
  res.json({
    environment: {
      node_version: process.version,
      platform: process.platform,
      memory_usage: process.memoryUsage(),
      uptime: process.uptime(),
      environment: environment,
      database_url: dbUrl,
      api_key_configured: !!apiKey
    },
    docker: {
      containerized: fs.existsSync('/.dockerenv'),
      hostname: require('os').hostname()
    },
    timestamp: new Date().toISOString()
  });
});

// API de tareas (para demostrar CRUD)
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: tasks,
    count: tasks.length
  });
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({
      success: false,
      error: 'El título es requerido'
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title: title,
    completed: false,
    created: new Date().toISOString()
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask,
    message: 'Tarea creada exitosamente'
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, completed } = req.body;
  
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Tarea no encontrada'
    });
  }

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;
  task.updated = new Date().toISOString();

  res.json({
    success: true,
    data: task,
    message: 'Tarea actualizada exitosamente'
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Tarea no encontrada'
    });
  }

  tasks.splice(taskIndex, 1);

  res.json({
    success: true,
    message: 'Tarea eliminada exitosamente'
  });
});

// Endpoint para testing
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: environment
  });
});

// Endpoint para logs (útil en desarrollo)
app.get('/dev/logs', (req, res) => {
  const logs = [
    { level: 'info', message: 'Servidor iniciado', timestamp: new Date().toISOString() },
    { level: 'info', message: `Ejecutándose en puerto ${port}`, timestamp: new Date().toISOString() },
    { level: 'info', message: `Entorno: ${environment}`, timestamp: new Date().toISOString() }
  ];

  res.json({
    success: true,
    logs: logs
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: environment === 'development' ? err.message : 'Error interno del servidor'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    available_endpoints: [
      'GET /',
      'GET /dev/info',
      'GET /api/tasks',
      'POST /api/tasks',
      'PUT /api/tasks/:id',
      'DELETE /api/tasks/:id',
      'GET /health',
      'GET /dev/logs'
    ]
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📝 Entorno: ${environment}`);
  console.log(`🔧 Modo desarrollo: ${environment === 'development'}`);
  console.log('📋 Endpoints disponibles:');
  console.log('   GET  / - Información principal');
  console.log('   GET  /dev/info - Información del entorno');
  console.log('   GET  /api/tasks - Listar tareas');
  console.log('   POST /api/tasks - Crear tarea');
  console.log('   GET  /health - Health check');
});
