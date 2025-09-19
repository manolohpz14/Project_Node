const conector=require("./database/conexion.cjs")
const express= require("express")
const cors= require("cors")
const persona_paths= require("./paths/persona.cjs")
const cookieParser = require('cookie-parser');
const fs=require("fs")
const https = require('http');

console.log("Iniciamos")
require("dotenv").config()
conector.conexion() //Dentro del try se nos printea que estamos conectados


const options = {
    cert: fs.readFileSync('server_combined.pem'),
    key: fs.readFileSync('server.key'),
    ca: fs.readFileSync('ca.crt')
  };



const app= express();
app.use(cors()); //me permite conexiones entre dominios cruzados




//Ojo, lo soguiente sirve para que lo que llegue como JSON se transforme como objeto directamente en el req
//y lo que llegue por express.urleconded se trnasforme directamente a objeto
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());

app.use(express.text({ type: "text/plain" })) //Si recibes una petición cuyo Content-Type sea text/plain, entonces léela como texto plano y guárdala en req.body."


//app.listen(80, "0.0.0.0", function() {
//console.log("Escuchando en el puerto 5049 en todas las interfaces");
//});

https.createServer(options, app).listen(5050, () => {
    console.log('Servidor HTTPS corriendo en el puerto 443');
  });
// //Rutas
app.use(persona_paths.router)
app.use(express.static('public'))





