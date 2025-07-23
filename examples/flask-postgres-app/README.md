# Flask + PostgreSQL App 🐍🐘

Una aplicación completa de **API REST** desarrollada con **Flask** y **PostgreSQL**, totalmente containerizada con Docker. Este ejemplo demuestra una arquitectura moderna de microservicios con persistencia de datos, validaciones, migraciones y endpoints CRUD completos.

## 📖 Descripción

Este proyecto muestra cómo crear una API REST robusta y escalable usando Flask como framework web y PostgreSQL como base de datos relacional, todo orquestado con Docker Compose. Incluye características avanzadas como validaciones, paginación, manejo de errores y health checks.

## 🏗️ Estructura del Proyecto

```
flask-postgres-app/
├── README.md                    # Este archivo
├── docker-compose.yml          # Orquestación de servicios
├── init.sql                    # Script de inicialización de PostgreSQL
└── app/                        # Aplicación Flask
    ├── Dockerfile              # Imagen de la aplicación
    ├── requirements.txt        # Dependencias de Python
    ├── app.py                  # Aplicación principal con API REST
    └── .dockerignore           # Archivos a excluir del build
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.11**: Lenguaje de programación
- **Flask 2.3**: Framework web minimalista y potente
- **SQLAlchemy**: ORM para Python
- **Flask-Migrate**: Manejo de migraciones de base de datos
- **Marshmallow**: Serialización y validación de datos
- **Flask-CORS**: Manejo de Cross-Origin Resource Sharing

### Base de Datos
- **PostgreSQL 15**: Base de datos relacional robusta
- **Docker Volume**: Persistencia de datos

### Infraestructura
- **Docker Compose**: Orquestación de contenedores
- **Health checks**: Monitoreo de salud de servicios
- **Docker Networks**: Comunicación segura entre servicios

## 🚀 Instrucciones de Ejecución

### Prerrequisitos

- Docker instalado en tu sistema
- Docker Compose instalado
- curl (para probar los endpoints)

> 📋 **Nota**: Si necesitas instalar Docker, consulta nuestro [Manual de Instalación](https://harol-reina.github.io/blog/post-3/)

### Pasos para ejecutar

1. **Navega a la carpeta del proyecto**:
   ```bash
   cd examples/flask-postgres-app
   ```

2. **Construye y levanta todos los servicios**:
   ```bash
   docker-compose up --build
   ```

3. **Verifica que los servicios estén funcionando**:
   
   - **Flask API**: http://localhost:5000
   - **PostgreSQL**: localhost:5432
   - **Health Check**: http://localhost:5000/health

4. **La aplicación creará automáticamente las tablas** necesarias al iniciarse

5. **Detener la aplicación**:
   ```bash
   # Presiona Ctrl+C en la terminal, o en otra terminal:
   docker-compose down
   ```

## 🌐 API Endpoints

### Información General

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/` | Información de la API y endpoints disponibles | JSON con metadata |
| GET | `/health` | Estado de salud del servicio y base de datos | JSON con estado |

### CRUD de Usuarios

| Método | Endpoint | Descripción | Body Requerido |
|--------|----------|-------------|----------------|
| GET | `/api/users` | Obtener todos los usuarios (paginado) | - |
| POST | `/api/users` | Crear nuevo usuario | `{"name": "string", "email": "string", "age": int}` |
| GET | `/api/users/<id>` | Obtener usuario por ID | - |
| PUT | `/api/users/<id>` | Actualizar usuario | `{"name": "string", "email": "string", "age": int}` |
| DELETE | `/api/users/<id>` | Eliminar usuario | - |

### Parámetros de Consulta

- **Paginación en GET /api/users**:
  - `page`: Número de página (default: 1)
  - `per_page`: Items por página (default: 10)

## 🧪 Ejemplos con cURL

### 1. Verificar que la aplicación esté funcionando

```bash
# Información general de la API
curl http://localhost:5000

# Respuesta esperada:
# {
#   "message": "🚀 Flask + PostgreSQL API",
#   "version": "1.0.0",
#   "status": "running",
#   "timestamp": "2025-07-22T...",
#   "endpoints": {
#     "GET /": "Información de la API",
#     "GET /health": "Estado de salud",
#     ...
#   }
# }
```

### 2. Health Check

```bash
# Verificar estado de salud
curl http://localhost:5000/health

# Respuesta esperada:
# {
#   "status": "healthy",
#   "database": "connected",
#   "timestamp": "2025-07-22T..."
# }
```

### 3. Operaciones CRUD con Usuarios

#### Obtener todos los usuarios (inicialmente vacío)

```bash
curl http://localhost:5000/api/users

# Respuesta esperada:
# {
#   "success": true,
#   "data": [],
#   "pagination": {
#     "page": 1,
#     "pages": 0,
#     "per_page": 10,
#     "total": 0
#   }
# }
```

#### Crear nuevos usuarios

```bash
# Crear primer usuario
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "age": 30
  }'

# Respuesta esperada:
# {
#   "success": true,
#   "message": "Usuario creado exitosamente",
#   "data": {
#     "id": 1,
#     "name": "Juan Pérez",
#     "email": "juan@example.com",
#     "age": 30,
#     "created_at": "2025-07-22T...",
#     "updated_at": "2025-07-22T..."
#   }
# }
```

#### Crear más usuarios de ejemplo

```bash
# Segundo usuario
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria@example.com",
    "age": 25
  }'

# Tercer usuario
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos López",
    "email": "carlos@example.com",
    "age": 35
  }'

# Usuario sin edad (campo opcional)
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Rodríguez",
    "email": "ana@example.com"
  }'
```

#### Obtener todos los usuarios (después de crear algunos)

```bash
curl http://localhost:5000/api/users

# Con paginación
curl "http://localhost:5000/api/users?page=1&per_page=2"

# Respuesta esperada:
# {
#   "success": true,
#   "data": [
#     {
#       "id": 1,
#       "name": "Juan Pérez",
#       "email": "juan@example.com",
#       "age": 30,
#       "created_at": "2025-07-22T...",
#       "updated_at": "2025-07-22T..."
#     },
#     // ... más usuarios
#   ],
#   "pagination": {
#     "page": 1,
#     "pages": 2,
#     "per_page": 2,
#     "total": 4
#   }
# }
```

#### Obtener un usuario específico por ID

```bash
# Obtener usuario con ID 1
curl http://localhost:5000/api/users/1

# Respuesta esperada:
# {
#   "success": true,
#   "data": {
#     "id": 1,
#     "name": "Juan Pérez",
#     "email": "juan@example.com",
#     "age": 30,
#     "created_at": "2025-07-22T...",
#     "updated_at": "2025-07-22T..."
#   }
# }
```

#### Actualizar un usuario

```bash
# Actualizar usuario con ID 1
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Carlos Pérez",
    "age": 31
  }'

# Respuesta esperada:
# {
#   "success": true,
#   "message": "Usuario actualizado exitosamente",
#   "data": {
#     "id": 1,
#     "name": "Juan Carlos Pérez",
#     "email": "juan@example.com",
#     "age": 31,
#     "created_at": "2025-07-22T...",
#     "updated_at": "2025-07-22T..." // Nueva fecha de actualización
#   }
# }
```

#### Eliminar un usuario

```bash
# Eliminar usuario con ID 1
curl -X DELETE http://localhost:5000/api/users/1

# Respuesta esperada:
# {
#   "success": true,
#   "message": "Usuario eliminado exitosamente"
# }
```

### 4. Manejo de Errores y Validaciones

#### Crear usuario con datos inválidos

```bash
# Email inválido
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Inválido",
    "email": "email_invalido",
    "age": 25
  }'

# Respuesta esperada (error):
# {
#   "success": false,
#   "message": "Datos de entrada inválidos",
#   "errors": {
#     "email": ["Not a valid email address."]
#   }
# }
```

#### Crear usuario con email duplicado

```bash
# Intentar crear usuario con email existente
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Otro Usuario",
    "email": "juan@example.com"
  }'

# Respuesta esperada (error):
# {
#   "success": false,
#   "message": "El email ya está registrado"
# }
```

#### Buscar usuario inexistente

```bash
curl http://localhost:5000/api/users/999

# Respuesta esperada (404):
# {
#   "success": false,
#   "message": "Usuario no encontrado",
#   "error": "404 Not Found: ..."
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

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar un servicio específico
docker-compose restart backend

# Detener y eliminar todo (incluyendo volúmenes)
docker-compose down -v

# Reconstruir sin caché
docker-compose up --build --no-cache
```

### Conexión directa a PostgreSQL

```bash
# Conectar al contenedor de PostgreSQL
docker-compose exec postgres psql -U postgres -d flaskapp

# Una vez dentro del shell de PostgreSQL:
\dt                    # Listar tablas
SELECT * FROM users;   # Ver todos los usuarios
\q                     # Salir
```

### Debug del Backend

```bash
# Acceder al contenedor del backend
docker-compose exec backend bash

# Ver variables de entorno
docker-compose exec backend env

# Ver archivos de la aplicación
docker-compose exec backend ls -la /app
```

## 🔧 Personalización

### Cambiar configuración de base de datos

Edita `docker-compose.yml`:

```yaml
postgres:
  environment:
    POSTGRES_DB: mi_nueva_db
    POSTGRES_USER: mi_usuario
    POSTGRES_PASSWORD: mi_password_seguro
```

### Agregar nuevos modelos

Ejemplo para agregar un modelo `Product`:

```python
class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Numeric(10, 2))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

### Configurar variables de entorno

Crea un archivo `.env`:

```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/flaskapp
FLASK_ENV=development
SECRET_KEY=tu_clave_secreta_aqui
```

## 📊 Schema de Base de Datos

### Tabla Users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    age INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Ejemplo de registro

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "age": 30,
  "created_at": "2025-07-22T10:30:45.123456",
  "updated_at": "2025-07-22T10:30:45.123456"
}
```

## 🧪 Script de Prueba Automatizada

Guarda este script como `test_api.sh`:

```bash
#!/bin/bash
echo "🧪 Probando API Flask + PostgreSQL..."

BASE_URL="http://localhost:5000"

echo "1. Health Check..."
curl -s $BASE_URL/health | jq

echo -e "\n2. Información de la API..."
curl -s $BASE_URL | jq

echo -e "\n3. Obtener usuarios iniciales..."
curl -s $BASE_URL/api/users | jq

echo -e "\n4. Crear nuevo usuario..."
curl -s -X POST $BASE_URL/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Usuario de Prueba", "email": "test@example.com", "age": 28}' | jq

echo -e "\n5. Obtener todos los usuarios..."
curl -s $BASE_URL/api/users | jq

echo -e "\n6. Obtener usuario específico (ID: 1)..."
curl -s $BASE_URL/api/users/1 | jq

echo -e "\n7. Actualizar usuario..."
curl -s -X PUT $BASE_URL/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Usuario Actualizado", "age": 29}' | jq

echo -e "\n✅ Pruebas completadas!"
```

Ejecutar el script:

```bash
chmod +x test_api.sh
./test_api.sh
```

## 🔍 Arquitectura del Sistema

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│                 │    Requests     │                 │
│   Client/cURL   ├─────────────────►   Flask API     │
│                 │                 │   (Port 5000)   │
│                 │◄─────────────────┤                 │
└─────────────────┘   JSON Response └─────────┬───────┘
                                              │
                                              │ SQLAlchemy
                                              │ ORM
                                              │
                                    ┌─────────▼───────┐
                                    │                 │
                                    │   PostgreSQL    │
                                    │   (Port 5432)   │
                                    │                 │
                                    └─────────────────┘
                                              │
                                              │
                                    ┌─────────▼───────┐
                                    │                 │
                                    │ Docker Volume   │
                                    │ (Persistence)   │
                                    │                 │
                                    └─────────────────┘
```

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo y healthy
docker-compose ps
docker-compose logs postgres

# Verificar conectividad desde el backend
docker-compose exec backend python -c "
import psycopg2
conn = psycopg2.connect('postgresql://postgres:password@postgres:5432/flaskapp')
print('¡Conexión exitosa!')
conn.close()
"
```

### Error "relation does not exist"

```bash
# Las tablas se crean automáticamente, pero si hay problemas:
docker-compose restart backend

# O recrear todo desde cero
docker-compose down -v
docker-compose up --build
```

### Puerto en uso

```bash
# Verificar qué proceso usa el puerto 5000
sudo lsof -i :5000

# O cambiar el puerto en docker-compose.yml
ports:
  - "8000:5000"  # Mapear puerto 8000 externo al 5000 interno
```

### Limpiar datos de PostgreSQL

```bash
# Detener servicios y eliminar volúmenes
docker-compose down -v

# Volver a levantar servicios (base de datos limpia)
docker-compose up
```

## ⚡ Próximos Pasos

Después de dominar este ejemplo, puedes:

1. **Implementar autenticación** (JWT, Flask-Login)
2. **Añadir más modelos** con relaciones (Foreign Keys)
3. **Configurar migraciones** con Flask-Migrate
4. **Implementar testing** con pytest
5. **Añadir logging** estructurado
6. **Configurar Swagger/OpenAPI** para documentación
7. **Implementar cache** con Redis
8. **Añadir búsqueda avanzada** y filtros
9. **Configurar CI/CD** con GitHub Actions
10. **Usar AWS RDS** o **PostgreSQL en la nube** para producción

---

**¡Felicitaciones!** 🎉 Has configurado exitosamente una API REST completa con Flask y PostgreSQL usando Docker. Este es un excelente foundation para aplicaciones web modernas con bases de datos relacionales.
