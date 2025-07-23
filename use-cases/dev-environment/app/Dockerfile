# Usar imagen oficial de Node.js para desarrollo
FROM node:18-alpine

# Instalar herramientas adicionales para desarrollo
RUN apk add --no-cache \
    curl \
    git \
    dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Cambiar propietario del directorio
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Copiar archivos de dependencias
COPY --chown=nodejs:nodejs package*.json ./

# Instalar dependencias (incluyendo devDependencies para desarrollo)
RUN npm install && npm cache clean --force

# Copiar código de la aplicación
COPY --chown=nodejs:nodejs . .

# Crear directorio público si no existe
RUN mkdir -p public

# Exponer puertos para la aplicación y debugger
EXPOSE 3000 9229

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Usar dumb-init para manejo de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto (se puede sobrescribir en docker-compose)
CMD ["npm", "run", "dev"]
