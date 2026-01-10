const conector=require("./database/conexion.cjs")
const express= require("express")
const cors= require("cors")
const persona_paths= require("./paths/persona.cjs")
const cookieParser = require('cookie-parser');
const { crearActividadPorDefecto } = require("./models/Persona.cjs");


async function main() {
    try {
        console.log("Iniciamos");
        await conector.conexion();
        await crearActividadPorDefecto();

        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(express.text({ type: "text/plain" }));

        app.use(persona_paths.router);
        app.use(express.static("public"));

        app.listen(5050, "0.0.0.0", () => {
            console.log("Servidor HTTP corriendo en el puerto 5050");
        });

    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
        process.exit(1); // Parar el proceso si falla el arranque
    }
}

main();
