# Simple Web App 🌐

Una aplicación web básica que demuestra cómo containerizar una página HTML estática usando Docker y Nginx.

## 📖 Descripción

Este ejemplo muestra cómo crear un contenedor Docker simple que sirve una página web estática utilizando el servidor web Nginx. Es perfecto para principiantes que quieren entender los conceptos básicos de Docker.

## 🏗️ Estructura del Proyecto

```
simple-web-app/
├── Dockerfile           # Definición del contenedor
├── docker-compose.yml   # Configuración de Docker Compose
├── index.html          # Página web principal
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Docker**: Containerización
- **Nginx Alpine**: Servidor web ligero
- **HTML**: Contenido web estático
- **Docker Compose**: Orquestación simplificada

## 🚀 Instrucciones de Ejecución

### Prerrequisitos

- Docker instalado en tu sistema
- Docker Compose instalado

> 📋 **Nota**: Si necesitas instalar Docker, consulta nuestro [Manual de Instalación](https://harol-reina.github.io/blog/post-3/)

### Pasos para ejecutar

1. **Navega a la carpeta del proyecto**:
   ```bash
   cd examples/simple-web-app
   ```

2. **Construye y levanta el contenedor**:
   ```bash
   docker-compose up --build
   ```

3. **Accede a la aplicación**:
   
   Abre tu navegador web y ve a: **http://localhost:8080**

4. **Detener la aplicación**:
   ```bash
   # Presiona Ctrl+C en la terminal, o en otra terminal:
   docker-compose down
   ```

## 📋 Comandos Útiles

### Docker Compose

```bash
# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs

# Detener y eliminar contenedores
docker-compose down

# Reconstruir sin caché
docker-compose up --build --no-cache
```

### Docker (sin Compose)

```bash
# Construir la imagen
docker build -t simple-web-app .

# Ejecutar el contenedor
docker run -d -p 8080:80 --name my-web-app simple-web-app

# Detener el contenedor
docker stop my-web-app

# Eliminar el contenedor
docker rm my-web-app
```

## 🔧 Personalización

### Modificar el contenido web

1. Edita el archivo `index.html` con tu contenido
2. Ejecuta `docker-compose up --build` para ver los cambios

### Cambiar el puerto

Modifica el archivo `docker-compose.yml` y cambia el mapeo de puertos:

```yaml
ports:
  - "3000:80"  # Cambiar 8080 por el puerto deseado
```

## 📚 Conceptos de Docker Demostrados

- **FROM**: Uso de imagen base (nginx:alpine)
- **COPY**: Copia de archivos al contenedor
- **EXPOSE**: Exposición de puertos
- **CMD**: Comando de inicio del contenedor
- **Volumes**: Montaje de archivos locales
- **Port mapping**: Mapeo de puertos host-contenedor

## ⚡ Próximos Pasos

Después de dominar este ejemplo, puedes:

1. Añadir CSS y JavaScript al HTML
2. Usar múltiples páginas HTML
3. Integrar con bases de datos
4. Implementar SSL/HTTPS
5. Usar Docker multi-stage builds

## 🐛 Solución de Problemas

### Puerto en uso
```bash
# Si el puerto 8080 está ocupado, cambia el puerto en docker-compose.yml
# o detén el proceso que lo está usando:
sudo lsof -i :8080
```

### Permisos de Docker
```bash
# Si tienes problemas de permisos, añade tu usuario al grupo docker:
sudo usermod -aG docker $USER
# Luego reinicia sesión
```

---

**¡Felicitaciones!** 🎉 Has configurado exitosamente una aplicación web containerizada con Docker. Este es el primer paso en tu journey con contenedores.