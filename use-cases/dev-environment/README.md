# 🐳 Entorno de Desarrollo con Docker

Un entorno de desarrollo completo y productivo utilizando Docker Compose, con hot reload, debugging remoto, base de datos PostgreSQL, Redis para cache y herramientas de administración.

## 🚀 Características

- **Hot Reload**: Cambios automáticos sin reiniciar el contenedor
- **Debugging Remoto**: Debug de Node.js desde tu IDE favorito
- **Base de Datos**: PostgreSQL con datos de prueba preconfigurados
- **Cache**: Redis para desarrollo y testing
- **Admin UI**: Interfaz web para gestionar la base de datos
- **Variables de Entorno**: Configuración flexible para desarrollo
- **Health Checks**: Monitoreo automático de servicios
- **API REST**: Endpoints completos para testing
- **Interfaz Web**: Dashboard de desarrollo incluido

## 🛠️ Tecnologías

- **Backend**: Node.js 18 + Express.js
- **Base de Datos**: PostgreSQL 15
- **Cache**: Redis 7
- **Admin**: Adminer (interfaz web para DB)
- **Contenedores**: Docker + Docker Compose
- **Development**: Nodemon para hot reload

## 📁 Estructura del Proyecto

```
dev-environment/
├── app/
│   ├── public/
│   │   └── index.html          # Dashboard web de desarrollo
│   ├── .env.example            # Ejemplo de variables de entorno
│   ├── app.js                  # Aplicación principal con API
│   ├── package.json            # Dependencias y scripts
│   └── Dockerfile              # Imagen de desarrollo
├── db/
│   └── init.sql                # Script de inicialización de PostgreSQL
├── docker-compose.yml          # Orquestación de servicios
└── README.md                   # Esta documentación
```

## 🔧 Instalación y Ejecución

### Prerrequisitos
- Docker y Docker Compose instalados
- Puertos libres: 3000, 5432, 6379, 8080, 9229

### Pasos

1. **Clonar y navegar**:
```bash
cd use-cases/dev-environment
```

2. **Configurar variables de entorno**:
```bash
cp app/.env.example app/.env
```

3. **Ejecutar entorno completo**:
```bash
docker-compose up -d
```

4. **Verificar servicios**:
```bash
docker-compose ps
```

5. **Ver logs en tiempo real**:
```bash
docker-compose logs -f app
```

## 🌐 Servicios Disponibles

### Aplicación Principal
- **URL**: http://localhost:3000
- **Dashboard**: http://localhost:3000 (interfaz web)
- **API**: http://localhost:3000/api/*
- **Health Check**: http://localhost:3000/health

### Base de Datos PostgreSQL
- **Host**: localhost:5432
- **Database**: devdb
- **Usuario**: dev
- **Contraseña**: dev

### Adminer (Admin DB)
- **URL**: http://localhost:8080
- **Sistema**: PostgreSQL
- **Servidor**: db
- **Usuario**: dev
- **Contraseña**: dev
- **Base de datos**: devdb

### Redis
- **Host**: localhost:6379
- **Sin contraseña en desarrollo**

### Debugging Remoto
- **Puerto**: 9229
- **URL**: `localhost:9229` (para conectar desde IDE)

## 📋 Endpoints de la API

### Información del Sistema
```bash
# Información principal
curl http://localhost:3000/

# Información detallada del entorno
curl http://localhost:3000/dev/info

# Health check
curl http://localhost:3000/health

# Logs de desarrollo
curl http://localhost:3000/dev/logs
```

### API de Tareas (CRUD)

#### Listar todas las tareas
```bash
curl http://localhost:3000/api/tasks
```

#### Crear nueva tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Nueva tarea de desarrollo"}'
```

#### Actualizar tarea
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Tarea actualizada", "completed": true}'
```

#### Eliminar tarea
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## 🔍 Desarrollo y Debugging

### Hot Reload
Los cambios en el código se reflejan automáticamente sin reiniciar el contenedor:

```bash
# Editar app/app.js y ver cambios inmediatamente
echo "console.log('Hot reload funcionando!');" >> app/app.js
```

### Debugging Remoto con VS Code

1. **Configurar launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docker Debug",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}/app",
      "remoteRoot": "/app",
      "protocol": "inspector"
    }
  ]
}
```

2. **Iniciar en modo debug**:
```bash
docker-compose exec app npm run debug
```

3. **Conectar desde VS Code**: F5 o "Run and Debug"

### Variables de Entorno

Editar `app/.env` para personalizar:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://dev:dev@db:5432/devdb
API_KEY=tu-api-key-secreta
REDIS_URL=redis://redis:6379
```

## 🗄️ Base de Datos

### Conexión desde herramientas externas
```bash
# Usando psql
psql -h localhost -p 5432 -U dev -d devdb

# Usando DBeaver, pgAdmin, etc.
Host: localhost
Port: 5432
Database: devdb
Username: dev
Password: dev
```

### Datos de prueba incluidos
- **Usuarios**: 3 usuarios de desarrollo
- **Tareas**: 6 tareas de ejemplo
- **Índices**: Optimizados para desarrollo
- **Triggers**: Timestamps automáticos

### Comandos útiles
```bash
# Conectar a PostgreSQL desde contenedor
docker-compose exec db psql -U dev -d devdb

# Ejecutar backup
docker-compose exec db pg_dump -U dev devdb > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U dev devdb < backup.sql
```

## 🔴 Redis para Cache

### Conectar desde CLI
```bash
# Desde contenedor
docker-compose exec redis redis-cli

# Desde host (si tienes redis-cli)
redis-cli -p 6379
```

### Comandos básicos
```redis
# Ver todas las claves
KEYS *

# Establecer valor
SET dev:test "Hello Redis"

# Obtener valor
GET dev:test

# Ver información
INFO
```

## 📊 Monitoreo y Logs

### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f redis
```

### Estados de salud
```bash
# Ver estado de contenedores
docker-compose ps

# Health check manual
curl http://localhost:3000/health

# Estadísticas de Docker
docker stats
```

## 🚨 Solución de Problemas

### Problema: Puerto en uso
```bash
# Verificar qué proceso usa el puerto
sudo lsof -i :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en el host
```

### Problema: Base de datos no conecta
```bash
# Verificar logs de PostgreSQL
docker-compose logs db

# Reiniciar solo la base de datos
docker-compose restart db

# Verificar conexión
docker-compose exec db pg_isready -U dev
```

### Problema: Hot reload no funciona
```bash
# En algunos sistemas, habilitar polling
echo "CHOKIDAR_USEPOLLING=true" >> app/.env

# Reiniciar aplicación
docker-compose restart app
```

### Problema: Permisos de archivos
```bash
# Cambiar propietario de archivos
sudo chown -R $USER:$USER .

# Verificar permisos
ls -la app/
```

## 🎯 Scripts Útiles

### Package.json Scripts
```bash
# Desarrollo con hot reload
npm run dev

# Modo debug
npm run debug

# Watch mode avanzado
npm run dev:watch

# Ejecutar tests
npm run test
```

### Docker Compose Scripts
```bash
# Iniciar en background
docker-compose up -d

# Reconstruir imágenes
docker-compose build

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Limpiar volúmenes (CUIDADO: borra datos)
docker-compose down -v
```

## 🔧 Personalización

### Agregar nuevas dependencias
```bash
# Desde host
echo '"nueva-libreria": "^1.0.0"' >> app/package.json

# Desde contenedor
docker-compose exec app npm install nueva-libreria

# Reconstruir imagen
docker-compose build app
```

### Agregar nuevos servicios
Editar `docker-compose.yml`:
```yaml
services:
  # ... servicios existentes
  
  nuevo-servicio:
    image: imagen:tag
    ports:
      - "puerto:puerto"
    networks:
      - dev-network
```

### Configurar variables de entorno
```bash
# Agregar al docker-compose.yml
environment:
  - NUEVA_VARIABLE=valor
  - OTRA_VARIABLE=${OTRA_VARIABLE:-default}
```

## 📚 Recursos Adicionales

- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Node.js Debugging Guide](https://nodejs.org/en/guides/debugging-getting-started/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Commands](https://redis.io/commands)
- [Express.js Guide](https://expressjs.com/guide/)

## 🎓 Casos de Uso Comunes

### Desarrollo de API
1. Editar `app/app.js` para agregar endpoints
2. Los cambios se reflejan automáticamente
3. Probar con curl o Postman
4. Verificar en base de datos con Adminer

### Testing con Base de Datos
1. Los datos de prueba están preconfigurados
2. Usar endpoints para CRUD operations
3. Verificar cambios en tiempo real
4. Reset de datos reiniciando el contenedor

### Debugging de Aplicaciones
1. Configurar debugger en tu IDE
2. Establecer breakpoints
3. Ejecutar en modo debug
4. Inspeccionar variables y stack trace

## 🔄 Limpieza

```bash
# Parar servicios
docker-compose down

# Eliminar volúmenes (CUIDADO: borra datos persistentes)
docker-compose down -v

# Eliminar imágenes
docker rmi $(docker images "dev-environment*" -q)

# Limpiar sistema Docker
docker system prune -a
```

---

**¡Disfruta desarrollando con Docker! 🐳**
