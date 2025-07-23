# Node.js + MongoDB App 🚀🍃

Una aplicación completa que demuestra la integración de **Node.js** con **MongoDB** usando **Docker Compose**. Este ejemplo incluye un API REST con operaciones CRUD y persistencia de datos en MongoDB.

## 📖 Descripción

Este proyecto muestra cómo crear una aplicación web con Node.js y Express que se conecta a una base de datos MongoDB, todo containerizado con Docker. Es perfecto para entender la integración entre aplicaciones Node.js y bases de datos NoSQL en un entorno containerizado.

## 🏗️ Estructura del Proyecto

```
node-mongo-app/
├── README.md                    # Este archivo
├── docker-compose.yml          # Orquestación de servicios
└── app/                        # Aplicación Node.js
    ├── Dockerfile              # Imagen de la aplicación
    ├── package.json            # Dependencias de Node.js
    ├── app.js                  # Servidor Express + API
    └── .dockerignore           # Archivos a excluir del build
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js 18**: Runtime de JavaScript
- **Express.js 4.18**: Framework web minimalista
- **Mongoose 7.5**: ODM para MongoDB

### Base de Datos
- **MongoDB 6.0**: Base de datos NoSQL
- **Docker Volume**: Persistencia de datos

### Infraestructura
- **Docker Compose**: Orquestación de contenedores
- **Docker Networks**: Comunicación entre servicios

## 🚀 Instrucciones de Ejecución

### Prerrequisitos

- Docker instalado en tu sistema
- Docker Compose instalado
- curl (para probar los endpoints)

> 📋 **Nota**: Si necesitas instalar Docker, consulta nuestro [Manual de Instalación](https://harol-reina.github.io/blog/post-3/)

### Pasos para ejecutar

1. **Navega a la carpeta del proyecto**:
   ```bash
   cd examples/node-mongo-app
   ```

2. **Construye y levanta todos los servicios**:
   ```bash
   docker-compose up --build
   ```

3. **Verifica que los servicios estén funcionando**:
   
   - **Backend API**: http://localhost:3000
   - **MongoDB**: localhost:27017
   - **Health Check**: http://localhost:3000/health

4. **Detener la aplicación**:
   ```bash
   # Presiona Ctrl+C en la terminal, o en otra terminal:
   docker-compose down
   ```

## 🌐 API Endpoints

### Información General

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/` | Información de la aplicación | JSON con estado general |
| GET | `/health` | Estado de salud del servicio | JSON con salud y uptime |

### CRUD de Items

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/items` | Obtener todos los items | - |
| POST | `/api/items` | Crear nuevo item | `{"name": "string", "description": "string"}` |
| GET | `/api/items/:id` | Obtener item por ID | - |

## 🧪 Ejemplos con cURL

### 1. Verificar que la aplicación esté funcionando

```bash
# Información general de la aplicación
curl http://localhost:3000

# Respuesta esperada:
# {
#   "message": "¡Aplicación Node.js con MongoDB en Docker!",
#   "status": "running",
#   "timestamp": "2025-07-22T...",
#   "database": "connected"
# }
```

### 2. Health Check

```bash
# Verificar estado de salud
curl http://localhost:3000/health

# Respuesta esperada:
# {
#   "status": "healthy",
#   "database": "connected",
#   "uptime": 123.456,
#   "timestamp": "2025-07-22T..."
# }
```

### 3. Operaciones CRUD con Items

#### Obtener todos los items (inicialmente vacío)

```bash
curl http://localhost:3000/api/items

# Respuesta esperada:
# {
#   "success": true,
#   "count": 0,
#   "data": []
# }
```

#### Crear un nuevo item

```bash
# Crear primer item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi primer item",
    "description": "Este es un item de prueba creado con Docker"
  }'

# Respuesta esperada:
# {
#   "success": true,
#   "message": "Item creado exitosamente",
#   "data": {
#     "_id": "...",
#     "name": "Mi primer item",
#     "description": "Este es un item de prueba creado con Docker",
#     "createdAt": "2025-07-22T...",
#     "__v": 0
#   }
# }
```

#### Crear más items de ejemplo

```bash
# Segundo item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto Docker",
    "description": "Un producto almacenado en MongoDB containerizada"
  }'

# Tercer item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tarea completada",
    "description": "Configuración exitosa de Node.js + MongoDB + Docker"
  }'

# Item solo con nombre (descripción opcional)
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Item mínimo"}'
```

#### Obtener todos los items (después de crear algunos)

```bash
curl http://localhost:3000/api/items

# Respuesta esperada:
# {
#   "success": true,
#   "count": 4,
#   "data": [
#     {
#       "_id": "...",
#       "name": "Mi primer item",
#       "description": "Este es un item de prueba creado con Docker",
#       "createdAt": "2025-07-22T...",
#       "__v": 0
#     },
#     // ... más items
#   ]
# }
```

#### Obtener un item específico por ID

```bash
# Primero obtén un ID de la lista anterior, luego:
curl http://localhost:3000/api/items/AQUI_EL_ID_DEL_ITEM

# Ejemplo con un ID real:
# curl http://localhost:3000/api/items/64f1a2b3c4d5e6f7a8b9c0d1

# Respuesta esperada:
# {
#   "success": true,
#   "data": {
#     "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
#     "name": "Mi primer item",
#     "description": "Este es un item de prueba creado con Docker",
#     "createdAt": "2025-07-22T...",
#     "__v": 0
#   }
# }
```

### 4. Manejo de Errores

#### Crear item sin nombre (error de validación)

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"description": "Item sin nombre"}'

# Respuesta esperada (error):
# {
#   "success": false,
#   "message": "El nombre es requerido"
# }
```

#### Buscar item con ID inválido

```bash
curl http://localhost:3000/api/items/id_inexistente

# Respuesta esperada (error):
# {
#   "success": false,
#   "message": "Error obteniendo item",
#   "error": "Cast to ObjectId failed for value..."
# }
```

#### Acceder a ruta inexistente

```bash
curl http://localhost:3000/ruta/inexistente

# Respuesta esperada (404):
# {
#   "success": false,
#   "message": "Ruta no encontrada",
#   "path": "/ruta/inexistente"
# }
```

## 📋 Comandos Útiles

### Docker Compose

```bash
# Ejecutar en segundo plano
docker-compose up -d

# Ver logs de todos los servicios
docker-compose logs

# Ver logs del backend
docker-compose logs backend

# Ver logs de MongoDB
docker-compose logs mongo

# Reiniciar un servicio específico
docker-compose restart backend

# Detener y eliminar todo (incluyendo volúmenes)
docker-compose down -v

# Reconstruir sin caché
docker-compose up --build --no-cache
```

### Conexión directa a MongoDB

```bash
# Conectar al contenedor de MongoDB
docker-compose exec mongo mongosh

# Una vez dentro del shell de MongoDB:
use nodeapp
db.items.find()
db.items.countDocuments()
```

### Debug del Backend

```bash
# Acceder al contenedor del backend
docker-compose exec backend sh

# Ver variables de entorno
docker-compose exec backend env

# Ver archivos de la aplicación
docker-compose exec backend ls -la /app
```

## 🔧 Personalización

### Cambiar la base de datos

Edita `docker-compose.yml` para cambiar el nombre de la base de datos:

```yaml
environment:
  - MONGO_URL=mongodb://mongo:27017/mi_nueva_db
  - MONGO_INITDB_DATABASE=mi_nueva_db
```

### Agregar autenticación a MongoDB

```yaml
mongo:
  image: mongo:6.0
  environment:
    - MONGO_INITDB_ROOT_USERNAME=admin
    - MONGO_INITDB_ROOT_PASSWORD=password123
    - MONGO_INITDB_DATABASE=nodeapp
```

### Cambiar puertos

```yaml
services:
  backend:
    ports:
      - "4000:3000"  # Cambiar puerto externo
  mongo:
    ports:
      - "27018:27017"  # Cambiar puerto de MongoDB
```

## 📊 Schema de Datos

### Estructura del Item

```javascript
{
  "_id": "ObjectId generado automáticamente",
  "name": "String (requerido)",
  "description": "String (opcional)",
  "createdAt": "Date (automático)",
  "__v": "Number (versión del documento)"
}
```

### Ejemplo de documento en MongoDB

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Producto de ejemplo",
  "description": "Descripción detallada del producto",
  "createdAt": "2025-07-22T10:30:45.123Z",
  "__v": 0
}
```

## 🚀 Script de Prueba Automatizada

Puedes usar este script bash para probar todos los endpoints:

```bash
#!/bin/bash
echo "🧪 Probando API Node.js + MongoDB..."

echo "1. Health Check..."
curl -s http://localhost:3000/health | jq

echo -e "\n2. Información general..."
curl -s http://localhost:3000 | jq

echo -e "\n3. Obteniendo items iniciales..."
curl -s http://localhost:3000/api/items | jq

echo -e "\n4. Creando nuevo item..."
curl -s -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Item de prueba automatizada", "description": "Creado por script"}' | jq

echo -e "\n5. Obteniendo todos los items..."
curl -s http://localhost:3000/api/items | jq

echo -e "\n✅ Pruebas completadas!"
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB

```bash
# Verificar que MongoDB esté corriendo
docker-compose ps

# Ver logs de MongoDB
docker-compose logs mongo

# Reiniciar MongoDB
docker-compose restart mongo
```

### Error "Cannot find module"

```bash
# Reconstruir la imagen del backend
docker-compose build backend

# Verificar que package.json esté presente
docker-compose exec backend cat package.json
```

### Puerto en uso

```bash
# Verificar qué proceso usa el puerto 3000
sudo lsof -i :3000

# O usar netstat
netstat -tulpn | grep :3000
```

### Limpiar datos de MongoDB

```bash
# Detener servicios y eliminar volúmenes
docker-compose down -v

# Volver a levantar servicios
docker-compose up
```

## ⚡ Próximos Pasos

Después de dominar este ejemplo, puedes:

1. **Agregar autenticación** (JWT, bcrypt)
2. **Implementar más modelos** (Users, Categories, etc.)
3. **Añadir validaciones avanzadas** con Joi o express-validator
4. **Configurar índices** en MongoDB para optimización
5. **Implementar paginación** en los endpoints
6. **Añadir tests** con Jest o Mocha
7. **Configurar CI/CD** con GitHub Actions
8. **Usar MongoDB Atlas** para producción

---

**¡Felicitaciones!** 🎉 Has configurado exitosamente una aplicación Node.js con MongoDB usando Docker. Este es un excelente foundation para aplicaciones web modernas con bases de datos NoSQL.
