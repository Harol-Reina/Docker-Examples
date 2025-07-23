# 🔴 Redis Cache Application

Una aplicación completa que demuestra diferentes patrones de uso de Redis como sistema de cache, sesiones, mensajería pub/sub, leaderboards y analytics.

## 🚀 Características

- **Cache Básico**: Operaciones GET, SET, DELETE con TTL
- **Cache de API**: Simulación de cache para API de clima
- **Sesiones**: Manejo de sesiones de usuario con Redis
- **Leaderboard**: Sistema de puntuaciones usando Sorted Sets
- **Pub/Sub**: Mensajería en tiempo real
- **Analytics**: Contadores y estadísticas
- **Admin UI**: Interfaz web con Redis Commander

## 🛠️ Tecnologías

- **Backend**: Node.js 18 + Express.js
- **Cache**: Redis 7
- **Contenedores**: Docker + Docker Compose
- **Admin**: Redis Commander
- **Testing**: Cliente HTTP (curl/Postman)

## 📁 Estructura del Proyecto

```
redis-cache-app/
├── app/
│   ├── app.js              # Aplicación principal
│   ├── package.json        # Dependencias Node.js
│   └── Dockerfile          # Imagen de la aplicación
├── redis/
│   └── redis.conf          # Configuración Redis
├── docker-compose.yml      # Orquestación de servicios
└── README.md              # Documentación
```

## 🔧 Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose instalados
- Puerto 3000, 6379 y 8081 disponibles

### Pasos

1. **Clonar y navegar**:
```bash
cd examples/redis-cache-app
```

2. **Ejecutar con Docker Compose**:
```bash
docker-compose up -d
```

3. **Verificar servicios**:
```bash
docker-compose ps
```

4. **Ver logs**:
```bash
docker-compose logs -f app
```

## 🌐 Endpoints Disponibles

### Cache Básico

#### Guardar en cache
```bash
curl -X POST http://localhost:3000/cache \
  -H "Content-Type: application/json" \
  -d '{"key": "usuario:123", "value": {"nombre": "Juan", "email": "juan@example.com"}, "ttl": 300}'
```

#### Obtener del cache
```bash
curl http://localhost:3000/cache/usuario:123
```

#### Eliminar del cache
```bash
curl -X DELETE http://localhost:3000/cache/usuario:123
```

### Cache de API (Simulación)

#### Obtener clima (con cache)
```bash
curl http://localhost:3000/weather/madrid
```

#### Forzar actualización del cache
```bash
curl -X POST http://localhost:3000/weather/madrid/refresh
```

### Sesiones de Usuario

#### Iniciar sesión
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "juan", "email": "juan@example.com"}' \
  -c cookies.txt
```

#### Obtener perfil (requiere sesión)
```bash
curl http://localhost:3000/profile -b cookies.txt
```

#### Cerrar sesión
```bash
curl -X POST http://localhost:3000/logout -b cookies.txt
```

### Leaderboard

#### Agregar puntuación
```bash
curl -X POST http://localhost:3000/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"player": "Juan", "score": 1500}'
```

#### Ver top 10
```bash
curl http://localhost:3000/leaderboard/top/10
```

#### Ver puntuación de jugador
```bash
curl http://localhost:3000/leaderboard/player/Juan
```

### Pub/Sub Messaging

#### Enviar mensaje
```bash
curl -X POST http://localhost:3000/publish \
  -H "Content-Type: application/json" \
  -d '{"channel": "notifications", "message": "¡Nuevo evento importante!"}'
```

#### Suscribirse a canal (WebSocket)
```javascript
// En navegador
const eventSource = new EventSource('http://localhost:3000/subscribe/notifications');
eventSource.onmessage = function(event) {
    console.log('Mensaje recibido:', event.data);
};
```

### Analytics

#### Incrementar contador
```bash
curl -X POST http://localhost:3000/analytics/page-views
```

#### Ver estadísticas
```bash
curl http://localhost:3000/analytics/stats
```

### Sistema

#### Health check
```bash
curl http://localhost:3000/health
```

#### Estadísticas Redis
```bash
curl http://localhost:3000/redis/stats
```

## 🎯 Casos de Uso Prácticos

### 1. Cache de Resultados de API
```bash
# Primera llamada - hace petición real
time curl http://localhost:3000/weather/madrid

# Segunda llamada - desde cache (más rápida)
time curl http://localhost:3000/weather/madrid
```

### 2. Sistema de Sesiones
```bash
# Iniciar sesión
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "maria", "email": "maria@example.com"}' \
  -c session.txt

# Usar sesión
curl http://localhost:3000/profile -b session.txt

# Verificar en otra terminal (misma sesión)
curl http://localhost:3000/profile -b session.txt
```

### 3. Leaderboard en Tiempo Real
```bash
# Agregar varias puntuaciones
curl -X POST http://localhost:3000/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"player": "Alice", "score": 2500}'

curl -X POST http://localhost:3000/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"player": "Bob", "score": 1800}'

curl -X POST http://localhost:3000/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"player": "Charlie", "score": 3200}'

# Ver ranking
curl http://localhost:3000/leaderboard/top/10
```

### 4. Mensajería Pub/Sub
```bash
# Terminal 1: Suscribirse a canal
curl http://localhost:3000/subscribe/alerts

# Terminal 2: Enviar mensaje
curl -X POST http://localhost:3000/publish \
  -H "Content-Type: application/json" \
  -d '{"channel": "alerts", "message": "Sistema actualizado exitosamente"}'
```

## 🖥️ Interfaz de Administración

Redis Commander está disponible en: http://localhost:8081
- **Usuario**: admin
- **Contraseña**: admin123

Características:
- Explorar todas las claves Redis
- Ver estructura de datos
- Ejecutar comandos Redis
- Monitorear estadísticas

## 🔍 Monitoreo y Debugging

### Ver logs en tiempo real
```bash
docker-compose logs -f app redis
```

### Conectar a Redis CLI
```bash
docker-compose exec redis redis-cli
```

### Comandos útiles Redis CLI
```redis
# Ver todas las claves
KEYS *

# Ver información del servidor
INFO

# Ver estadísticas de memoria
MEMORY USAGE key_name

# Monitorear comandos en tiempo real
MONITOR

# Ver configuración
CONFIG GET *
```

### Verificar contenido del cache
```bash
# Ver claves de sesiones
docker-compose exec redis redis-cli KEYS "sess:*"

# Ver leaderboard
docker-compose exec redis redis-cli ZRANGE "game:leaderboard" 0 -1 WITHSCORES

# Ver contadores
docker-compose exec redis redis-cli KEYS "analytics:*"
```

## 📊 Métricas y Estadísticas

### Endpoint de estadísticas
```bash
curl http://localhost:3000/redis/stats | jq
```

Respuesta incluye:
- Información del servidor Redis
- Estadísticas de memoria
- Comandos ejecutados
- Conexiones activas
- Estadísticas de persistencia

## 🚨 Solución de Problemas

### Problema: Conexión a Redis falla
```bash
# Verificar que Redis esté ejecutándose
docker-compose ps redis

# Ver logs de Redis
docker-compose logs redis

# Reiniciar servicio Redis
docker-compose restart redis
```

### Problema: Aplicación no inicia
```bash
# Verificar logs de la aplicación
docker-compose logs app

# Reconstruir imagen
docker-compose build app

# Reiniciar todo
docker-compose down && docker-compose up -d
```

### Problema: Cache no funciona
```bash
# Verificar conectividad Redis
docker-compose exec app node -e "
const redis = require('redis');
const client = redis.createClient({url: 'redis://redis:6379'});
client.connect().then(() => console.log('✓ Redis conectado')).catch(console.error);
"
```

### Problema: Sesiones no persisten
```bash
# Verificar claves de sesión
docker-compose exec redis redis-cli KEYS "sess:*"

# Verificar configuración de sesiones
curl http://localhost:3000/redis/stats | jq '.keyspace'
```

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# En docker-compose.yml
environment:
  - NODE_ENV=production
  - REDIS_URL=redis://redis:6379
  - SESSION_SECRET=tu-secreto-super-seguro
  - CACHE_DEFAULT_TTL=300
  - API_CACHE_TTL=600
```

### Configuración Redis Personalizada
Editar `redis/redis.conf`:
```conf
# Cambiar límite de memoria
maxmemory 512mb

# Cambiar política de expiración
maxmemory-policy allkeys-lru

# Habilitar autenticación
requirepass tu-password-seguro
```

## 🎓 Conceptos Redis Demostrados

1. **Strings**: Cache básico con TTL
2. **Hashes**: Almacenamiento de objetos complejos
3. **Sorted Sets**: Leaderboards con puntuaciones
4. **Pub/Sub**: Mensajería en tiempo real
5. **Counters**: Analytics y estadísticas
6. **Expiration**: TTL automático
7. **Persistence**: RDB + AOF
8. **Memory Management**: Políticas de expiración

## 📚 Recursos Adicionales

- [Redis Documentation](https://redis.io/documentation)
- [Redis Commands](https://redis.io/commands)
- [Redis Best Practices](https://redis.io/topics/memory-optimization)
- [Node.js Redis Client](https://github.com/redis/node-redis)

## 🔄 Limpieza

```bash
# Parar servicios
docker-compose down

# Eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Eliminar imágenes
docker rmi $(docker images "redis-cache-app*" -q)
```

---

**¡Disfruta explorando Redis! 🔴**
