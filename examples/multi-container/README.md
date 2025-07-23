# Multi-Container Application 🐳🔗

Una aplicación completa que demuestra la comunicación entre múltiples contenedores Docker usando **Docker Compose**. Este ejemplo incluye un frontend (Nginx + HTML/JavaScript) y un backend (Node.js + Express) trabajando juntos.

## 📖 Descripción

Este proyecto muestra cómo crear y orquestar múltiples contenedores que trabajan juntos para formar una aplicación completa. Es perfecto para entender conceptos avanzados de Docker como redes, comunicación entre contenedores y orquestación con Docker Compose.

## 🏗️ Estructura del Proyecto

```
multi-container/
├── README.md                    # Este archivo
├── docker-compose.yml          # Orquestación de servicios
├── frontend/                   # Aplicación web frontend
│   ├── Dockerfile              # Imagen del frontend
│   └── index.html              # Interfaz web interactiva
└── backend/                    # API backend
    ├── Dockerfile              # Imagen del backend
    └── app.js                  # Servidor Express.js
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Nginx Alpine**: Servidor web ligero
- **HTML5 + CSS3**: Interfaz moderna y responsive
- **JavaScript (ES6+)**: Lógica del cliente y comunicación con API
- **Fetch API**: Peticiones HTTP asíncronas

### Backend
- **Node.js 14**: Runtime de JavaScript
- **Express.js**: Framework web minimalista
- **Docker Alpine**: Imagen base optimizada

### Infraestructura
- **Docker Compose**: Orquestación de contenedores
- **Docker Networks**: Comunicación entre contenedores

## 🚀 Instrucciones de Ejecución

### Prerrequisitos

- Docker instalado en tu sistema
- Docker Compose instalado

> 📋 **Nota**: Si necesitas instalar Docker, consulta nuestro [Manual de Instalación](https://harol-reina.github.io/blog/post-3/)

### Pasos para ejecutar

1. **Navega a la carpeta del proyecto**:
   ```bash
   cd examples/multi-container
   ```

2. **Construye y levanta todos los contenedores**:
   ```bash
   docker-compose up --build
   ```

3. **Accede a las aplicaciones**:
   
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:3000/api

4. **Prueba la comunicación**:
   - Ve al frontend en tu navegador
   - Haz clic en "Hacer Petición al Backend"
   - Observa la respuesta del API

5. **Detener la aplicación**:
   ```bash
   # Presiona Ctrl+C en la terminal, o en otra terminal:
   docker-compose down
   ```

## 📋 Comandos Útiles

### Docker Compose

```bash
# Ejecutar en segundo plano
docker-compose up -d

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs frontend
docker-compose logs backend

# Detener y eliminar contenedores
docker-compose down

# Reconstruir sin caché
docker-compose up --build --no-cache

# Escalar servicios (múltiples instancias)
docker-compose up --scale backend=3
```

### Monitoreo y Debug

```bash
# Ver contenedores activos
docker-compose ps

# Ejecutar comando en contenedor específico
docker-compose exec backend sh
docker-compose exec frontend sh

# Ver uso de recursos
docker stats

# Inspeccionar la red creada
docker network ls
docker network inspect multi-container_default
```

## 🌐 Endpoints del API

### Backend Endpoints

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/api` | Mensaje de saludo | `{"message": "Hola desde el backend"}` |

### Expandir el API

Puedes agregar más endpoints editando `backend/app.js`:

```javascript
// Ejemplo de nuevos endpoints
app.get('/api/users', (req, res) => {
  res.json({ users: ['usuario1', 'usuario2'] });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running', 
    timestamp: new Date().toISOString() 
  });
});
```

## 🔧 Personalización

### Modificar el Frontend

1. Edita `frontend/index.html` para cambiar la interfaz
2. Ejecuta `docker-compose up --build` para ver los cambios

### Modificar el Backend

1. Edita `backend/app.js` para agregar nuevos endpoints
2. Reinicia los contenedores: `docker-compose restart backend`

### Cambiar Puertos

Modifica `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3000:80"  # Cambiar puerto del frontend
  backend:
    ports:
      - "4000:3000"  # Cambiar puerto del backend
```

### Agregar Base de Datos

Ejemplo para agregar PostgreSQL:

```yaml
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 📚 Conceptos de Docker Demostrados

### Docker Compose
- **Servicios múltiples**: Frontend y backend como servicios separados
- **Redes automáticas**: Comunicación entre contenedores
- **Volúmenes**: Persistencia de datos
- **Variables de entorno**: Configuración dinámica

### Comunicación entre Contenedores
- **DNS interno**: Los contenedores se comunican por nombre de servicio
- **Redes bridge**: Aislamiento y conectividad controlada
- **Port mapping**: Exposición selectiva de puertos

### Desarrollo vs Producción
- **Hot reload**: Montaje de volúmenes para desarrollo
- **Multi-stage builds**: Optimización para producción
- **Health checks**: Monitoreo de salud de servicios

## ⚡ Próximos Pasos

Después de dominar este ejemplo, puedes:

1. **Agregar una base de datos** (PostgreSQL, MongoDB)
2. **Implementar autenticación** (JWT, OAuth)
3. **Añadir un proxy reverso** (Nginx como load balancer)
4. **Configurar SSL/HTTPS** con certificados
5. **Usar Docker Swarm** para orquestación avanzada
6. **Implementar CI/CD** con GitHub Actions
7. **Monitoreo con Prometheus** y Grafana

## 🔍 Arquitectura del Sistema

```
┌─────────────────┐    HTTP     ┌─────────────────┐
│                 │   Request   │                 │
│    Frontend     ├─────────────►     Backend     │
│  (Nginx:8080)   │             │  (Node.js:3000) │
│                 │◄─────────────┤                 │
└─────────────────┘   Response  └─────────────────┘
         │                               │
         │                               │
    ┌────▼────┐                     ┌────▼────┐
    │Frontend │                     │Backend  │
    │Container│                     │Container│
    └─────────┘                     └─────────┘
         │                               │
         └───────────┬───────────────────┘
                     │
              ┌──────▼──────┐
              │Docker Bridge│
              │   Network   │
              └─────────────┘
```

## 🐛 Solución de Problemas

### Error de comunicación entre contenedores

```bash
# Verificar que los contenedores estén en la misma red
docker network ls
docker inspect multi-container_default

# Probar conectividad desde un contenedor
docker-compose exec frontend ping backend
```

### Puerto en uso

```bash
# Verificar qué proceso usa los puertos
sudo lsof -i :8080
sudo lsof -i :3000

# Cambiar puertos en docker-compose.yml si es necesario
```

### Problemas de caché de Docker

```bash
# Limpiar imágenes y contenedores
docker system prune -a

# Reconstruir desde cero
docker-compose down --volumes
docker-compose up --build --force-recreate
```

### Backend no responde

```bash
# Verificar logs del backend
docker-compose logs backend

# Entrar al contenedor del backend
docker-compose exec backend sh
```

## 📊 Monitoreo y Logs

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo frontend
docker-compose logs -f frontend

# Solo backend
docker-compose logs -f backend
```

### Métricas de rendimiento

```bash
# Uso de recursos por contenedor
docker stats

# Información detallada del contenedor
docker-compose exec backend cat /proc/meminfo
```

---

**¡Felicitaciones!** 🎉 Has configurado exitosamente una aplicación multi-container con Docker Compose. Este es un paso importante hacia arquitecturas de microservicios y aplicaciones distribuidas.