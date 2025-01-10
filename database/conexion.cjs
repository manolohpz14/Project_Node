const mongoose = require("mongoose");
const path = require('path');
const fs = require('fs');

async function conexion() {
    try {
        // const ca = fs.readFileSync(path.join(__dirname, '../ca.crt'));
        // const cert = fs.readFileSync(path.join(__dirname, '../server.crt'));
        // const key = fs.readFileSync(path.join(__dirname, '../server.key'));

        // Cadena de conexión MongoDB
        const uri = `mongodb://${process.env.PATH_DB}:27017/ClassProject`;

        // Conectar a MongoDB con SSL utilizando TLS
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tls: true,               // Usar TLS (SSL)
            tlsCAFile: path.join(__dirname, '../ca.crt'), // Ruta al certificado de la CA
            tlsCertificateKeyFile: path.join(__dirname, '../server_combined.pem'),
        });
    } catch (error) {  
        console.log(error);
        console.log("La conexión ha fallado");
    }
}

module.exports = { conexion };

