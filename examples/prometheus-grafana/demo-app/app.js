const express = require('express');
const promClient = require('prom-client');

const app = express();
const port = 8000;

// Crear registro de métricas por defecto
const register = new promClient.Registry();

// Agregar métricas por defecto
promClient.collectDefaultMetrics({
  register,
  prefix: 'demo_app_',
});

// Métricas personalizadas
const httpRequestDuration = new promClient.Histogram({
  name: 'demo_app_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'demo_app_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'demo_app_active_connections',
  help: 'Number of active connections'
});

const customBusinessMetric = new promClient.Gauge({
  name: 'demo_app_business_value',
  help: 'Custom business metric for demonstration'
});

// Registrar métricas
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeConnections);
register.registerMetric(customBusinessMetric);

// Middleware para métricas
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
});

app.use(express.json());

// Simular conexiones activas
let connections = 0;
setInterval(() => {
  connections = Math.floor(Math.random() * 100) + 10;
  activeConnections.set(connections);
}, 5000);

// Simular métrica de negocio
setInterval(() => {
  const value = Math.random() * 1000;
  customBusinessMetric.set(value);
}, 3000);

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: '📊 Demo App para Métricas de Prometheus',
    version: '1.0.0',
    endpoints: [
      'GET / - Esta página',
      'GET /metrics - Métricas de Prometheus',
      'GET /health - Health check',
      'POST /webhook/alerts - Webhook para AlertManager',
      'GET /simulate/load - Simular carga',
      'GET /simulate/error - Simular error'
    ]
  });
});

// Endpoint de métricas para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Webhook para recibir alertas de AlertManager
app.post('/webhook/alerts', (req, res) => {
  console.log('🚨 Alerta recibida:', JSON.stringify(req.body, null, 2));
  res.json({ received: true, timestamp: new Date().toISOString() });
});

// Simular carga para testing
app.get('/simulate/load', (req, res) => {
  const delay = Math.random() * 2000 + 500; // 500-2500ms
  setTimeout(() => {
    res.json({
      message: 'Carga simulada completada',
      delay: `${delay}ms`,
      timestamp: new Date().toISOString()
    });
  }, delay);
});

// Simular error para testing
app.get('/simulate/error', (req, res) => {
  if (Math.random() > 0.5) {
    res.status(500).json({
      error: 'Error simulado',
      timestamp: new Date().toISOString()
    });
  } else {
    res.json({
      message: 'Sin error esta vez',
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta para generar carga artificial
app.get('/load/:duration', (req, res) => {
  const duration = parseInt(req.params.duration) || 1000;
  const start = Date.now();
  
  // CPU intensivo
  while (Date.now() - start < duration) {
    Math.random() * Math.random();
  }
  
  res.json({
    message: `CPU load generated for ${duration}ms`,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`📊 Demo App listening on port ${port}`);
  console.log(`🔗 Métricas disponibles en: http://localhost:${port}/metrics`);
  console.log(`❤️ Health check en: http://localhost:${port}/health`);
});
