#Creo mi imagen de Node

FROM node:22.11-slim

# RUN mkdir -p /usr/src/app

# WORKDIR /usr/src/app

COPY package*.json .

#instalo node_module segun la distribucion de la imagenm

RUN npm install

#me copio todo lo que tengo en mi segundo_proyecto_node a el directorio de mi contenedor
COPY . .

RUN pwd

CMD ["node", "index.cjs"]

