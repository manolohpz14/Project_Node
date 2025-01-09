# Utilizar la imagen base de Node.js
FROM node:22.11-slim

# Copiar los archivos de dependencias al contenedor
COPY package*.json .

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el resto de los archivos de tu proyecto
COPY . .

# Exponer el puerto 5050 para que el contenedor pueda escuchar en ese puerto
EXPOSE 5050

# Ejecutar la aplicación Node.js
CMD ["node", "index.cjs"]