const mongoose = require("mongoose");
const path = require('path');


async function conexion() {
    try {
        const uri = `mongodb://${process.env.PATH_DB}:27017/ClassProject`;
        console.log(uri)
        

        if (process.env.SSL ==="false") {
            // Conexión normal sin opciones avanzadas
            await mongoose.connect(uri);
            console.log("Conexión normal establecida con MongoDB");
        } else {
            // Conexión con opciones avanzadas (TLS y certificados)
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                tls: true, // Usar TLS (SSL)
                tlsCAFile: path.join(__dirname, '../ca.crt'), // Ruta al certificado de la CA
                tlsCertificateKeyFile: path.join(__dirname, '../server_combined.pem'),
                tlsAllowInvalidCertificates: true
            });
            console.log("Conexión avanzada establecida con MongoDB");
        }
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
    }
}

module.exports = { conexion };
