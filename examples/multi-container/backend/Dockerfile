# Usa la imagen oficial de Node.js (versión LTS más reciente)
FROM node:18-alpine

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Crear el directorio de la aplicación
WORKDIR /app

# Cambiar ownership del directorio de trabajo
RUN chown -R nodejs:nodejs /app
USER nodejs

# Copiar package.json y package-lock.json (si existe)
COPY --chown=nodejs:nodejs package*.json ./

# Instalar dependencias
RUN npm install && npm cache clean --force

# Copiar el código de la aplicación
COPY --chown=nodejs:nodejs . .

# Exponer el puerto
EXPOSE 3000

# Health check para verificar que la aplicación esté funcionando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Usar dumb-init para ejecutar la aplicación
ENTRYPOINT ["dumb-init", "--"]

# Ejecutar la aplicación
CMD ["node", "app.js"]
