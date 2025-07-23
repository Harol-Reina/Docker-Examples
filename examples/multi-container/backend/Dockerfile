# Usa la imagen oficial de Node.js
FROM node:14

# Crea el directorio de la aplicación
WORKDIR /app

# Copia los archivos de la aplicación
COPY package*.json ./
RUN npm install
COPY . .

# Expón el puerto
EXPOSE 3000

# Ejecuta la aplicación
CMD ["node", "app.js"]
