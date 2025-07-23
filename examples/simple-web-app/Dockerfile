# Usa una imagen base oficial de Nginx
FROM nginx:alpine

# Copia el archivo HTML al contenedor
COPY index.html /usr/share/nginx/html/index.html

# Exponer el puerto 80
EXPOSE 80

# Ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]