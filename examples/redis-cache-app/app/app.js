const express = require('express');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
  }
});

// Manejo de eventos de Redis
redisClient.on('connect', () => {
  console.log('✅ Conectado a Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Error de Redis:', err);
});

redisClient.on('ready', () => {
  console.log('🚀 Redis listo para usar');
});

// Conectar a Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Error conectando a Redis:', error);
    process.exit(1);
  }
})();

// Configuración de sesiones con Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'mi-secreto-super-seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true en producción con HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===============================
// RUTAS PRINCIPALES
// ===============================

// Ruta principal con información de la API
app.get('/', (req, res) => {
  res.json({
    message: '🔴 Redis Cache App',
    description: 'API de demostración para Redis con Node.js',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      'GET /': 'Información de la API',
      'GET /health': 'Estado de salud de Redis',
      'GET /stats': 'Estadísticas de Redis',
      'GET /cache/:key': 'Obtener valor del cache',
      'POST /cache': 'Establecer valor en cache',
      'DELETE /cache/:key': 'Eliminar clave del cache',
      'GET /weather/:city': 'Obtener clima (con cache)',
      'GET /session': 'Información de sesión',
      'POST /session/login': 'Iniciar sesión',
      'POST /session/logout': 'Cerrar sesión',
      'GET /leaderboard': 'Tabla de puntuaciones',
      'POST /leaderboard': 'Añadir puntuación',
      'GET /pubsub/publish/:message': 'Publicar mensaje',
      'GET /analytics': 'Contadores y analytics'
    }
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const ping = await redisClient.ping();
    const info = await redisClient.info('server');
    
    res.json({
      status: 'healthy',
      redis: {
        connected: redisClient.isOpen,
        ping: ping,
        uptime: info.match(/uptime_in_seconds:(\d+)/)?.[1] || 'unknown'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Estadísticas de Redis
app.get('/stats', async (req, res) => {
  try {
    const info = await redisClient.info();
    const dbSize = await redisClient.dbSize();
    const memory = await redisClient.info('memory');
    
    res.json({
      success: true,
      stats: {
        db_size: dbSize,
        connected_clients: info.match(/connected_clients:(\d+)/)?.[1] || 0,
        used_memory_human: memory.match(/used_memory_human:([^\r\n]+)/)?.[1] || 'unknown',
        total_connections_received: info.match(/total_connections_received:(\d+)/)?.[1] || 0,
        total_commands_processed: info.match(/total_commands_processed:(\d+)/)?.[1] || 0,
        uptime_in_days: info.match(/uptime_in_days:(\d+)/)?.[1] || 0
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// CACHE BÁSICO
// ===============================

// Obtener valor del cache
app.get('/cache/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await redisClient.get(key);
    
    if (value === null) {
      return res.status(404).json({
        success: false,
        message: 'Clave no encontrada en cache',
        key: key
      });
    }
    
    // Incrementar contador de accesos
    await redisClient.incr(`access_count:${key}`);
    
    res.json({
      success: true,
      key: key,
      value: JSON.parse(value),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Establecer valor en cache
app.post('/cache', async (req, res) => {
  try {
    const { key, value, ttl = 3600 } = req.body; // TTL por defecto: 1 hora
    
    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Key y value son requeridos'
      });
    }
    
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    
    res.json({
      success: true,
      message: 'Valor guardado en cache',
      key: key,
      ttl: ttl,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Eliminar clave del cache
app.delete('/cache/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const deleted = await redisClient.del(key);
    
    res.json({
      success: true,
      message: deleted > 0 ? 'Clave eliminada' : 'Clave no existía',
      key: key,
      deleted: deleted > 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// CACHE AVANZADO - API CLIMA
// ===============================

app.get('/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const cacheKey = `weather:${city.toLowerCase()}`;
    
    // Intentar obtener del cache primero
    const cachedWeather = await redisClient.get(cacheKey);
    
    if (cachedWeather) {
      const data = JSON.parse(cachedWeather);
      return res.json({
        success: true,
        source: 'cache',
        city: city,
        data: data,
        cached_at: data.cached_at,
        timestamp: new Date().toISOString()
      });
    }
    
    // Si no está en cache, simular llamada a API externa
    console.log(`🌤️  Obteniendo clima para ${city} desde API externa...`);
    
    // Simular datos de clima (en un caso real usarías OpenWeatherMap u otra API)
    const weatherData = {
      city: city,
      temperature: Math.floor(Math.random() * 35) + 5, // 5-40°C
      humidity: Math.floor(Math.random() * 100),
      description: ['soleado', 'nublado', 'lluvioso', 'ventoso'][Math.floor(Math.random() * 4)],
      wind_speed: Math.floor(Math.random() * 20),
      cached_at: new Date().toISOString()
    };
    
    // Guardar en cache por 10 minutos
    await redisClient.setEx(cacheKey, 600, JSON.stringify(weatherData));
    
    // Incrementar contador de ciudades consultadas
    await redisClient.incr('weather:total_requests');
    await redisClient.incr(`weather:city_requests:${city.toLowerCase()}`);
    
    res.json({
      success: true,
      source: 'api',
      city: city,
      data: weatherData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// SESIONES
// ===============================

// Obtener información de sesión
app.get('/session', (req, res) => {
  res.json({
    success: true,
    session_id: req.sessionID,
    user: req.session.user || null,
    login_time: req.session.loginTime || null,
    visits: req.session.visits || 0,
    timestamp: new Date().toISOString()
  });
});

// Iniciar sesión
app.post('/session/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
    }
    
    // Simulación de autenticación (en producción verificarías contra BD)
    if (password === 'password123') {
      req.session.user = {
        username: username,
        id: Date.now()
      };
      req.session.loginTime = new Date().toISOString();
      req.session.visits = (req.session.visits || 0) + 1;
      
      // Guardar estadística de login en Redis
      await redisClient.incr('total_logins');
      await redisClient.incr(`user_logins:${username}`);
      
      res.json({
        success: true,
        message: 'Login exitoso',
        user: req.session.user,
        session_id: req.sessionID
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cerrar sesión
app.post('/session/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error cerrando sesión'
      });
    }
    
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  });
});

// ===============================
// LEADERBOARD (SORTED SETS)
// ===============================

// Obtener tabla de puntuaciones
app.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Obtener top puntuaciones (orden descendente)
    const leaderboard = await redisClient.zRevRangeWithScores('game:leaderboard', 0, limit - 1);
    
    const formattedLeaderboard = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
      formattedLeaderboard.push({
        rank: Math.floor(i / 2) + 1,
        player: leaderboard[i],
        score: parseInt(leaderboard[i + 1])
      });
    }
    
    res.json({
      success: true,
      leaderboard: formattedLeaderboard,
      total_players: await redisClient.zCard('game:leaderboard'),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Añadir puntuación
app.post('/leaderboard', async (req, res) => {
  try {
    const { player, score } = req.body;
    
    if (!player || !score) {
      return res.status(400).json({
        success: false,
        message: 'Player y score son requeridos'
      });
    }
    
    // Añadir/actualizar puntuación en el sorted set
    await redisClient.zAdd('game:leaderboard', { score: parseInt(score), value: player });
    
    // Obtener ranking del jugador
    const rank = await redisClient.zRevRank('game:leaderboard', player);
    
    res.json({
      success: true,
      message: 'Puntuación añadida',
      player: player,
      score: parseInt(score),
      rank: rank + 1,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// PUB/SUB
// ===============================

// Publicar mensaje
app.get('/pubsub/publish/:message', async (req, res) => {
  try {
    const { message } = req.params;
    const channel = req.query.channel || 'notifications';
    
    const messageData = {
      content: message,
      timestamp: new Date().toISOString(),
      sender: 'api'
    };
    
    const subscribers = await redisClient.publish(channel, JSON.stringify(messageData));
    
    res.json({
      success: true,
      message: 'Mensaje publicado',
      channel: channel,
      content: message,
      subscribers: subscribers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// ANALYTICS Y CONTADORES
// ===============================

app.get('/analytics', async (req, res) => {
  try {
    // Incrementar contador de visitas a analytics
    await redisClient.incr('analytics:page_views');
    
    // Obtener varios contadores
    const totalLogins = await redisClient.get('total_logins') || 0;
    const weatherRequests = await redisClient.get('weather:total_requests') || 0;
    const pageViews = await redisClient.get('analytics:page_views') || 0;
    const totalPlayers = await redisClient.zCard('game:leaderboard');
    
    // Obtener ciudades más consultadas
    const weatherKeys = await redisClient.keys('weather:city_requests:*');
    const topCities = [];
    
    for (const key of weatherKeys.slice(0, 5)) {
      const city = key.replace('weather:city_requests:', '');
      const requests = await redisClient.get(key);
      topCities.push({ city, requests: parseInt(requests) });
    }
    
    topCities.sort((a, b) => b.requests - a.requests);
    
    res.json({
      success: true,
      analytics: {
        total_logins: parseInt(totalLogins),
        weather_requests: parseInt(weatherRequests),
        page_views: parseInt(pageViews),
        total_players: totalPlayers,
        top_cities: topCities,
        redis_info: {
          db_size: await redisClient.dbSize(),
          used_memory: (await redisClient.info('memory')).match(/used_memory_human:([^\r\n]+)/)?.[1]
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===============================
// UTILIDADES
// ===============================

// Limpiar toda la base de datos (solo para desarrollo)
app.delete('/flush', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Operación no permitida en producción'
      });
    }
    
    await redisClient.flushDb();
    
    res.json({
      success: true,
      message: 'Base de datos Redis limpiada',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    path: req.originalUrl,
    available_endpoints: [
      'GET /',
      'GET /health',
      'GET /stats',
      'GET /cache/:key',
      'POST /cache',
      'DELETE /cache/:key',
      'GET /weather/:city',
      'GET /session',
      'POST /session/login',
      'POST /session/logout',
      'GET /leaderboard',
      'POST /leaderboard',
      'GET /pubsub/publish/:message',
      'GET /analytics'
    ]
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

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando aplicación...');
  await redisClient.quit();
  process.exit(0);
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor Redis Cache App corriendo en puerto ${port}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   GET  http://localhost:${port}/ - Información de la API`);
  console.log(`   GET  http://localhost:${port}/health - Estado de Redis`);
  console.log(`   GET  http://localhost:${port}/stats - Estadísticas`);
  console.log(`   GET  http://localhost:${port}/analytics - Analytics`);
});
