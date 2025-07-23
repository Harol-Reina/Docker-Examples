const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configuración de conexión a MongoDB
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/nodeapp';

// Esquema de ejemplo para demostrar funcionalidad
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', ItemSchema);

// Conectar a MongoDB con manejo de errores mejorado
mongoose.connect(mongoUrl, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log("✅ Conectado exitosamente a MongoDB");
  console.log(`📍 URL de conexión: ${mongoUrl}`);
})
.catch(err => {
  console.error("❌ Error conectando a MongoDB:", err.message);
  process.exit(1);
});

// Manejo de eventos de conexión
mongoose.connection.on('error', (err) => {
  console.error('Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

// Rutas de la aplicación
app.get('/', (req, res) => {
  res.json({
    message: '¡Aplicación Node.js con MongoDB en Docker!',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Ruta para health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    database: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Ruta para obtener todos los items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error obteniendo items:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo items',
      error: error.message
    });
  }
});

// Ruta para crear un nuevo item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }

    const newItem = new Item({ name, description });
    const savedItem = await newItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Item creado exitosamente',
      data: savedItem
    });
  } catch (error) {
    console.error('Error creando item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando item',
      error: error.message
    });
  }
});

// Ruta para obtener un item por ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error obteniendo item:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo item',
      error: error.message
    });
  }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📊 Health check disponible en http://localhost:${port}/health`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET  /api/items - Obtener todos los items`);
  console.log(`   POST /api/items - Crear nuevo item`);
  console.log(`   GET  /api/items/:id - Obtener item por ID`);
});
