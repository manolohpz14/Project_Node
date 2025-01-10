const conector=require("./database/conexion.cjs")
const express= require("express")
const cors= require("cors")
const persona_paths= require("./paths/persona.cjs")
const cookieParser = require('cookie-parser');

console.log("Iniciamos")
require("dotenv").config()
conector.conexion() //Dentro del try se nos printea que estamos conectados



const app= express();
app.use(cors()); //me permite conexiones entre dominios cruzados

app.use(express.static('public'))


//Ojo, lo soguiente sirve para que lo que llegue como JSON se transforme como objeto directamente en el req
//y lo que llegue por express.urleconded se trnasforme directamente a objeto
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());

// //Escuchar peticiones http
app.listen(5049, function(){
    console.log("escuchando en dicho puerto 5050")
})


// //Rutas
app.use(persona_paths.router)







