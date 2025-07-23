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

// Almacenamiento en memoria para alertas
let receivedAlerts = [];
let alertStats = {
  total: 0,
  resolved: 0,
  firing: 0,
  lastReceived: null
};

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: '📊 Demo App para Métricas de Prometheus',
    version: '1.0.0',
    alertStats: alertStats,
    endpoints: [
      'GET / - Esta página',
      'GET /metrics - Métricas de Prometheus',
      'GET /health - Health check',
      'GET /alerts - Ver dashboard de alertas',
      'GET /alerts/api - API de alertas recibidas',
      'POST /webhook/alerts - Webhook para AlertManager',
      'GET /simulate/load - Simular carga',
      'GET /simulate/error - Simular error',
      'GET /simulate/cpu/:seconds - Simular carga de CPU',
      'GET /simulate/memory - Simular uso de memoria'
    ]
  });
});

// Dashboard web para ver alertas
app.get('/alerts', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Alertas - AlertManager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .firing { color: #dc3545; }
        .resolved { color: #28a745; }
        .total { color: #007bff; }
        .alerts-container {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .alert {
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 15px;
            padding: 15px;
            position: relative;
        }
        .alert.firing {
            border-left: 5px solid #dc3545;
            background: #fff5f5;
        }
        .alert.resolved {
            border-left: 5px solid #28a745;
            background: #f0fff4;
        }
        .alert-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 10px;
        }
        .alert-name {
            font-weight: bold;
            font-size: 1.1em;
        }
        .alert-status {
            padding: 4px 8px;
            border-radius: 4px;
            color: white;
            font-size: 0.8em;
        }
        .status-firing { background: #dc3545; }
        .status-resolved { background: #28a745; }
        .alert-time {
            color: #666;
            font-size: 0.9em;
        }
        .alert-labels {
            margin-top: 10px;
        }
        .label {
            display: inline-block;
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 3px;
            margin: 2px;
            font-size: 0.8em;
        }
        .no-alerts {
            text-align: center;
            color: #666;
            padding: 40px;
        }
        .refresh-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Dashboard de Alertas</h1>
            <p>Monitoreo en tiempo real de AlertManager</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number total" id="total-alerts">0</div>
                <div>Total Alertas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number firing" id="firing-alerts">0</div>
                <div>Activas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number resolved" id="resolved-alerts">0</div>
                <div>Resueltas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="last-received">Nunca</div>
                <div>Última Recibida</div>
            </div>
        </div>

        <div class="alerts-container">
            <button class="refresh-btn" onclick="loadAlerts()">🔄 Actualizar</button>
            <h3>Alertas Recibidas</h3>
            <div id="alerts-list">
                <div class="no-alerts">Cargando alertas...</div>
            </div>
        </div>
    </div>

    <script>
        function formatTime(timestamp) {
            return new Date(timestamp).toLocaleString('es-ES');
        }

        function formatTimeAgo(timestamp) {
            const now = new Date();
            const time = new Date(timestamp);
            const diff = now - time;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            
            if (minutes < 1) return 'Hace menos de 1 minuto';
            if (minutes < 60) return \`Hace \${minutes} minuto\${minutes !== 1 ? 's' : ''}\`;
            if (hours < 24) return \`Hace \${hours} hora\${hours !== 1 ? 's' : ''}\`;
            return formatTime(timestamp);
        }

        async function loadAlerts() {
            try {
                const response = await fetch('/alerts/api');
                const data = await response.json();
                
                // Actualizar estadísticas
                document.getElementById('total-alerts').textContent = data.stats.total;
                document.getElementById('firing-alerts').textContent = data.stats.firing;
                document.getElementById('resolved-alerts').textContent = data.stats.resolved;
                document.getElementById('last-received').textContent = 
                    data.stats.lastReceived ? formatTimeAgo(data.stats.lastReceived) : 'Nunca';
                
                // Actualizar lista de alertas
                const alertsList = document.getElementById('alerts-list');
                
                if (data.alerts.length === 0) {
                    alertsList.innerHTML = '<div class="no-alerts">No hay alertas recibidas</div>';
                    return;
                }
                
                alertsList.innerHTML = data.alerts.map(alert => \`
                    <div class="alert \${alert.status}">
                        <div class="alert-header">
                            <div class="alert-name">\${alert.alertname}</div>
                            <span class="alert-status status-\${alert.status}">\${alert.status.toUpperCase()}</span>
                        </div>
                        <div><strong>Descripción:</strong> \${alert.summary || 'N/A'}</div>
                        <div><strong>Detalles:</strong> \${alert.description || 'N/A'}</div>
                        <div class="alert-time"><strong>Recibida:</strong> \${formatTime(alert.receivedAt)}</div>
                        <div class="alert-labels">
                            \${Object.entries(alert.labels || {}).map(([key, value]) => 
                                \`<span class="label">\${key}: \${value}</span>\`
                            ).join('')}
                        </div>
                    </div>
                \`).join('');
                
            } catch (error) {
                console.error('Error cargando alertas:', error);
                document.getElementById('alerts-list').innerHTML = 
                    '<div class="no-alerts">Error cargando alertas</div>';
            }
        }

        // Cargar alertas al inicio
        loadAlerts();

        // Auto-actualizar cada 30 segundos
        setInterval(loadAlerts, 30000);
    </script>
</body>
</html>
  `);
});

// API para obtener alertas recibidas
app.get('/alerts/api', (req, res) => {
  res.json({
    alerts: receivedAlerts.slice(-50), // Últimas 50 alertas
    stats: alertStats
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

// Webhook mejorado para recibir alertas de AlertManager
app.post('/webhook/alerts', (req, res) => {
  const alertPayload = req.body;
  const timestamp = new Date().toISOString();
  
  console.log('🚨 Alerta recibida de AlertManager:', JSON.stringify(alertPayload, null, 2));
  
  // Procesar cada alerta en el payload
  if (alertPayload.alerts && Array.isArray(alertPayload.alerts)) {
    alertPayload.alerts.forEach(alert => {
      const processedAlert = {
        alertname: alert.labels?.alertname || 'Unknown',
        status: alert.status || 'unknown',
        summary: alert.annotations?.summary || '',
        description: alert.annotations?.description || '',
        labels: alert.labels || {},
        annotations: alert.annotations || {},
        startsAt: alert.startsAt,
        endsAt: alert.endsAt,
        receivedAt: timestamp,
        fingerprint: alert.fingerprint || Date.now().toString()
      };
      
      // Agregar a la lista de alertas
      receivedAlerts.unshift(processedAlert);
      
      // Mantener solo las últimas 100 alertas
      if (receivedAlerts.length > 100) {
        receivedAlerts = receivedAlerts.slice(0, 100);
      }
      
      // Actualizar estadísticas
      alertStats.total++;
      if (alert.status === 'firing') {
        alertStats.firing++;
      } else if (alert.status === 'resolved') {
        alertStats.resolved++;
      }
      alertStats.lastReceived = timestamp;
      
      // Log detallado
      console.log(`📋 Alerta procesada: ${processedAlert.alertname} - ${processedAlert.status}`);
    });
  }
  
  res.json({ 
    received: true, 
    timestamp: timestamp,
    alertsProcessed: alertPayload.alerts?.length || 0,
    message: 'Alertas procesadas correctamente'
  });
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

// Simular carga de CPU
app.get('/simulate/cpu/:seconds', (req, res) => {
  const seconds = parseInt(req.params.seconds) || 1;
  const duration = seconds * 1000;
  const start = Date.now();
  
  // CPU intensivo
  while (Date.now() - start < duration) {
    Math.random() * Math.random();
  }
  
  cpuUsageGauge.set(Math.random() * 100);
  
  res.json({
    message: `Carga de CPU generada por ${seconds} segundos`,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString()
  });
});

// Simular uso de memoria
app.get('/simulate/memory', (req, res) => {
  const bigArray = new Array(1000000).fill('test data');
  memoryUsageGauge.set(process.memoryUsage().heapUsed);
  
  res.json({
    message: 'Uso de memoria simulado',
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`📊 Demo App listening on port ${port}`);
  console.log(`🔗 Métricas disponibles en: http://localhost:${port}/metrics`);
  console.log(`❤️ Health check en: http://localhost:${port}/health`);
  console.log(`🚨 Dashboard de alertas en: http://localhost:${port}/alerts`);
  console.log(`📡 Webhook AlertManager en: http://localhost:${port}/webhook/alerts`);
});
