# Etapa 1: Construcción de la aplicación React
FROM node:18-alpine AS build

# Instalar dumb-init para manejo de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactjs -u 1001

WORKDIR /app

# Cambiar ownership del directorio
RUN chown -R reactjs:nodejs /app
USER reactjs

# Copiar package.json y package-lock.json
COPY --chown=reactjs:nodejs package*.json ./

# Instalar dependencias
RUN npm install && npm cache clean --force

# Copiar código fuente
COPY --chown=reactjs:nodejs . .

# Construir la aplicación para producción
RUN npm run build

# Etapa 2: Servidor Nginx para servir la aplicación
FROM nginx:alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar archivos construidos desde la etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Crear usuario no-root para Nginx
RUN adduser -D -s /bin/sh nginx-user

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
