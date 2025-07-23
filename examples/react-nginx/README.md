# React + Nginx App ⚛️🔧

Una aplicación **React** moderna servida por **Nginx** y completamente containerizada con **Docker**. Este ejemplo demuestra las mejores prácticas para desplegar aplicaciones frontend usando un build multi-stage optimizado.

## 📖 Descripción

Este proyecto muestra cómo crear, construir y desplegar una aplicación React completa usando Docker con un build multi-stage. La aplicación incluye múltiples páginas, routing del lado del cliente, diseño responsive y está optimizada para producción con Nginx como servidor web.

## 🏗️ Estructura del Proyecto

```
react-nginx/
├── README.md                       # Este archivo
├── docker-compose.yml             # Orquestación de servicios
├── nginx/                         # Configuración de Nginx
│   └── default.conf               # Configuración personalizada del servidor
└── client/                        # Aplicación React
    ├── Dockerfile                 # Multi-stage build
    ├── package.json               # Dependencias de Node.js
    ├── .dockerignore              # Archivos a excluir del build
    ├── public/                    # Archivos públicos
    │   ├── index.html             # HTML base
    │   ├── manifest.json          # PWA manifest
    │   └── favicon.ico            # Icono del sitio
    └── src/                       # Código fuente React
        ├── index.js               # Punto de entrada
        ├── index.css              # Estilos base
        ├── App.js                 # Componente principal
        └── App.css                # Estilos de la aplicación
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Framework frontend con hooks y componentes funcionales
- **React Router DOM**: Navegación SPA del lado del cliente
- **CSS3**: Estilos modernos con Flexbox, Grid y animaciones
- **Responsive Design**: Adaptable a todos los dispositivos

### Servidor Web
- **Nginx Alpine**: Servidor web de alto rendimiento y ligero
- **Gzip Compression**: Compresión automática de recursos
- **Security Headers**: Headers de seguridad implementados
- **Caching Strategy**: Estrategia de caché optimizada

### Infraestructura
- **Docker Multi-stage**: Build optimizado en dos etapas
- **Docker Compose**: Orquestación simplificada
- **Health Checks**: Monitoreo automático de salud

## 🚀 Instrucciones de Ejecución

### Prerrequisitos

- Docker instalado en tu sistema
- Docker Compose instalado

> 📋 **Nota**: Si necesitas instalar Docker, consulta nuestro [Manual de Instalación](https://harol-reina.github.io/blog/post-3/)

### Pasos para ejecutar

1. **Navega a la carpeta del proyecto**:
   ```bash
   cd examples/react-nginx
   ```

2. **Construye y levanta la aplicación**:
   ```bash
   docker-compose up --build
   ```

3. **Accede a la aplicación**:
   
   - **Aplicación React**: http://localhost:3000
   - **Health Check**: http://localhost:3000/health

4. **Para ejecutar en segundo plano**:
   ```bash
   docker-compose up -d
   ```

5. **Detener la aplicación**:
   ```bash
   docker-compose down
   ```

## 🌐 Funcionalidades de la Aplicación

### Páginas Disponibles

| Ruta | Descripción | Características |
|------|-------------|----------------|
| `/` | Página principal | Estadísticas en tiempo real, arquitectura del sistema |
| `/about` | Acerca de | Información del proyecto y tecnologías |
| `/features` | Características | Lista expandible de funcionalidades |
| `/contact` | Contacto | Formulario de contacto funcional |

### Características Principales

- **🎨 Diseño Moderno**: Interfaz atractiva con gradientes y animaciones
- **📱 Responsive**: Funciona perfectamente en desktop, tablet y móvil
- **🧭 Single Page App**: Navegación fluida sin recargas de página
- **⚡ Optimizado**: Build de producción optimizado y comprimido
- **🔒 Seguro**: Headers de seguridad y mejores prácticas implementadas
- **📊 Interactivo**: Componentes con estado y actualizaciones en tiempo real

## 🐳 Arquitectura Docker

### Multi-Stage Build

```dockerfile
# Etapa 1: Construcción
FROM node:18-alpine AS build
# - Instala dependencias
# - Construye la aplicación
# - Genera archivos estáticos optimizados

# Etapa 2: Producción  
FROM nginx:alpine
# - Copia archivos construidos
# - Configura Nginx
# - Imagen final ultra-ligera
```

### Beneficios del Multi-Stage Build

- **📦 Imagen final pequeña**: Solo contiene Nginx + archivos estáticos
- **🔒 Seguridad**: No incluye herramientas de desarrollo en producción
- **⚡ Rendimiento**: Nginx optimizado para servir contenido estático
- **🛠️ Mantenibilidad**: Separación clara entre build y runtime

## 📋 Comandos Útiles

### Docker Compose

```bash
# Ejecutar y ver logs
docker-compose up

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Reconstruir sin caché
docker-compose up --build --no-cache

# Detener servicios
docker-compose down

# Ver estado de servicios
docker-compose ps
```

### Docker Directo

```bash
# Construir la imagen
docker build -t react-nginx-app ./client

# Ejecutar contenedor
docker run -d -p 3000:80 --name my-react-app react-nginx-app

# Ver logs del contenedor
docker logs my-react-app

# Acceder al contenedor
docker exec -it my-react-app sh

# Detener y eliminar
docker stop my-react-app && docker rm my-react-app
```

### Desarrollo Local (sin Docker)

```bash
cd client

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test
```

## 🔧 Personalización

### Modificar la Aplicación React

1. **Editar componentes**: Modifica archivos en `client/src/`
2. **Añadir nuevas páginas**: Agrega rutas en `App.js`
3. **Cambiar estilos**: Edita `App.css` o `index.css`
4. **Reconstruir**: Ejecuta `docker-compose up --build`

### Configurar Nginx

Edita `nginx/default.conf` para:
- Cambiar configuraciones de caché
- Añadir nuevos headers de seguridad
- Configurar proxy reverso
- Añadir SSL/HTTPS

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Puerto de la aplicación
REACT_APP_PORT=3000

# URL del API (si tienes backend)
REACT_APP_API_URL=http://localhost:5000

# Configuración de build
GENERATE_SOURCEMAP=false
```

### Cambiar Puerto

Modifica `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Cambiar puerto externo
```

## 🧪 Ejemplos de Pruebas

### Health Check

```bash
# Verificar que la aplicación esté funcionando
curl http://localhost:3000/health

# Respuesta esperada:
# healthy
```

### Verificar Headers de Seguridad

```bash
# Inspeccionar headers HTTP
curl -I http://localhost:3000

# Headers esperados:
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

### Verificar Compresión

```bash
# Verificar que Gzip esté habilitado
curl -H "Accept-Encoding: gzip" -I http://localhost:3000

# Buscar header:
# Content-Encoding: gzip
```

### Test de Carga Simple

```bash
# Usando Apache Bench (si está instalado)
ab -n 100 -c 10 http://localhost:3000/

# Usando curl en bucle
for i in {1..10}; do
  curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/
done
```

## 📊 Optimizaciones Implementadas

### Build de Producción

- **Tree Shaking**: Eliminación de código no utilizado
- **Minificación**: CSS y JavaScript comprimidos
- **Source Maps**: Generación opcional para debugging
- **Bundle Splitting**: División inteligente de chunks

### Configuración Nginx

- **Gzip Compression**: Compresión automática de recursos
- **Cache Headers**: Caché agresivo para assets estáticos
- **Security Headers**: Protección contra ataques comunes
- **Error Handling**: Páginas de error personalizadas

### Docker Optimizations

- **Multi-stage Build**: Imagen final mínima
- **Alpine Images**: Imágenes base ligeras
- **Layer Caching**: Optimización de capas Docker
- **Non-root User**: Ejecución con usuario sin privilegios

## 🔍 Arquitectura del Sistema

```
┌─────────────────┐   HTTP Request   ┌─────────────────┐
│                 │   Port 3000      │                 │
│   Web Browser   ├──────────────────►     Docker      │
│                 │                  │   Container     │
│                 │◄──────────────────┤                 │
└─────────────────┘   HTML/CSS/JS    └─────────┬───────┘
                                              │
                                              │
                                    ┌─────────▼───────┐
                                    │                 │
                                    │  Nginx Server   │
                                    │   (Port 80)     │
                                    │                 │
                                    └─────────┬───────┘
                                              │
                                              │
                                    ┌─────────▼───────┐
                                    │                 │
                                    │ Static Files    │
                                    │ (React Build)   │
                                    │                 │
                                    └─────────────────┘
```

## 🐛 Solución de Problemas

### Error de Build

```bash
# Limpiar cache de Docker
docker system prune -a

# Reconstruir desde cero
docker-compose down
docker-compose up --build --no-cache
```

### Puerto en Uso

```bash
# Verificar qué proceso usa el puerto 3000
sudo lsof -i :3000

# Cambiar puerto en docker-compose.yml
ports:
  - "8080:80"  # Usar puerto 8080 en su lugar
```

### Problemas de Memoria

```bash
# Aumentar memoria disponible para Docker
# En Docker Desktop: Settings > Resources > Memory

# Verificar uso de memoria del contenedor
docker stats
```

### Error de Permisos

```bash
# Verificar que Docker esté corriendo
docker ps

# Añadir usuario al grupo docker (Linux)
sudo usermod -aG docker $USER
# Luego reiniciar sesión
```

### Debugging del Contenedor

```bash
# Acceder al contenedor
docker-compose exec react-app sh

# Ver logs de Nginx
docker-compose exec react-app cat /var/log/nginx/access.log
docker-compose exec react-app cat /var/log/nginx/error.log

# Verificar archivos servidos
docker-compose exec react-app ls -la /usr/share/nginx/html/
```

## ⚡ Próximos Pasos

Después de dominar este ejemplo, puedes:

1. **Añadir un Backend API** (Node.js, Python, etc.)
2. **Implementar autenticación** (JWT, OAuth)
3. **Configurar SSL/HTTPS** con certificados
4. **Añadir base de datos** (PostgreSQL, MongoDB)
5. **Implementar CI/CD** con GitHub Actions
6. **Desplegar en la nube** (AWS, Google Cloud, Azure)
7. **Configurar Load Balancer** para múltiples instancias
8. **Añadir monitoreo** (Prometheus, Grafana)
9. **Implementar PWA** completa
10. **Configurar CDN** para assets estáticos

## 🌟 Características Avanzadas Opcionales

### PWA (Progressive Web App)

La aplicación ya incluye:
- `manifest.json` configurado
- Service Worker ready
- Responsive design
- Offline capabilities potential

### Performance Monitoring

```javascript
// Añadir en src/index.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Environment Variables

```bash
# En .env
REACT_APP_VERSION=$npm_package_version
REACT_APP_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
```

---

**¡Felicitaciones!** 🎉 Has configurado exitosamente una aplicación React completa con Nginx y Docker. Este setup es perfecto para aplicaciones frontend modernas listas para producción.
