# Usar imagen oficial de Node.js
FROM node:18-alpine

# Instalar dumb-init para manejo de señales
RUN apk add --no-cache dumb-init curl

# Crear usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Cambiar ownership del directorio
RUN chown -R nodejs:nodejs /app
USER nodejs

# Copiar package.json y package-lock.json
COPY --chown=nodejs:nodejs package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código de la aplicación
COPY --chown=nodejs:nodejs . .

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Usar dumb-init para ejecutar la aplicación
ENTRYPOINT ["dumb-init", "--"]

# Comando para ejecutar la aplicación
CMD ["node", "app.js"]
