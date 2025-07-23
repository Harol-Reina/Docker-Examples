FROM node:18-alpine

# Instalar curl para health checks
RUN apk add --no-cache curl dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Directorio de trabajo
WORKDIR /app

# Cambiar propietario
RUN chown -R nodejs:nodejs /app
USER nodejs

# Copiar dependencias
COPY --chown=nodejs:nodejs package*.json ./

# Instalar dependencias
RUN npm install && npm cache clean --force

# Copiar código
COPY --chown=nodejs:nodejs . .

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
