const mongoose = require("mongoose");

async function conexion() {
    try {
        console.log("mongodb://"+process.env.PATH_DB+":27017/ClassProject?tls=false")
        await mongoose.connect("mongodb://"+process.env.PATH_DB+":27017/ClassProject?tls=false");
        console.log("¡Nos hemos conectado!");
    } catch (error) {  
        console.log(error);
        console.log("La conexión ha fallado");
    }
}

module.exports = { conexion };

