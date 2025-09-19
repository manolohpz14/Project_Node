const express= require("express");
const router=express.Router();
const persona_Controller=require('../controllers/persona.cjs');
const multer=require("multer");
const fs= require("fs").promises
const path=require("path")
const jwt= require('jsonwebtoken')
const {Usuarios, Actividades_entregadas, Actividades}=require("../models/Persona.cjs")


//el primer parametro de cb es para indicar el error
//el segundo parametro de cb depende de lo ue se este haciendo:
//un string para el almacenamiento, un true o false para una validacion,
//un string para el nombre de un archivo
const almacenamiento_imagenes = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const username = req.body.username;

    
            // Si el usuario existe, procedemos con la creación de directorios
            let rootpath = __dirname.split(path.sep);
            rootpath.pop(); // Eliminar el último directorio (__dirname)
            rootpath = path.join(...rootpath);

    
            // Crear la ruta del directorio usando path.join para que sea compatible con el SO
            const filePath = path.join(rootpath, "imagenes", "personas", username);

            await fs.mkdir(filePath, { recursive: true });
    
            // Establecer la ruta del archivo donde se almacenará usando path.join
            cb(null, path.join("imagenes", "personas", username));
        } catch (error) {
            console.error("Error creando el directorio:", error.message);
            cb(new Error("Error al crear el directorio"), null); // Propagar el error si ocurre
        }
    },

    filename: function(req, file, callback) {
        const nombre_usuario = req.body.username;
        const now = new Date(Date.now());

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        

        const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        callback(null, nombre_usuario + "_" + formattedDate + "_" + file.originalname);
        
    }
});





async function validarExtensionyRegistro (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const username = req.body.username;
    const email = req.body.email;


    const nombre=req.body.nombre
    const password=req.body.password


    const existsUsername = await Usuarios.findOne({ username });
    const existsEmail = await Usuarios.findOne({ email });

    if (existsUsername) {
        req.existsUsername = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    // Verificar si la extensión es PNG
    if (extension !== '.png' && extension !== '.jpg') {
        req.fileValidationError = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }




    if (existsEmail) {
        req.existsEmail = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    if (username.length > 14) {
        req.userNotOK = 'Error'; // Establecer el error
        return cb(null, false);  // Rechazar el archivo
    }


    if (email.length > 30) {
        req.emilNotOk = 'Error'; // Establecer el error
        return cb(null, false);  // Rechazar el archivo
    }

    if (nombre.length > 15) {
        req.nombreNotOK = 'Error'; // Establecer el error
        return cb(null, false);  // Rechazar el archivo
    }



    // Validar el campo 'nombre'
    if (!nombre || !/^[a-zA-Z\s]+$/.test(nombre)) {
        req.nombreNotOK = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    // Validar el campo 'username'
    if (!username || username.length < 3) {
        req.userNotOK = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }


    // Validar el campo 'email'
    const emailRegex = /^[a-zA-Z0-9._%+-]{4,}@g\.educaand\.es$/;
    if (!email || !emailRegex.test(email)) {
        req.emilNotOk = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    // Validar el campo 'password'
    if (!password || password.length < 6) {
        req.passwordNotOk = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }
    return cb(null, true);  // Aceptar el archivo
};


const subidas_imagenes = multer({
    storage: almacenamiento_imagenes,
    fileFilter: validarExtensionyRegistro
});








const almacenamiento_actividades = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const username = req.cookies["username"];
            const actividad = req.body.Actividad;
            const Tema = req.body.Tema;

    
            // Si el usuario existe, procedemos con la creación de directorios
            let rootpath = __dirname.split(path.sep);
            rootpath.pop(); // Eliminar el último directorio (__dirname)
            rootpath = path.join(...rootpath);
    
            // Crear la ruta del directorio usando path.join para que sea compatible con el SO
            const filePath = path.join(rootpath, "imagenes", "personas", username,Tema+"_"+actividad);
            await fs.mkdir(filePath, { recursive: true });
    
            // Establecer la ruta del archivo donde se almacenará usando path.join
            cb(null, filePath);
        } catch (error) {
            console.error("Error creando el directorio:", error.message);
            cb(new Error("Error al crear el directorio"), null); // Propagar el error si ocurre
        }
    },

    filename: function(req, file, callback) {
        const nombre_usuario = req.cookies["username"];
        const now = new Date(Date.now());

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        callback(null, nombre_usuario + "_" + formattedDate + "_" + file.originalname);
    }
});




async function validarExtensionactividad(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const username = req.cookies["username"];

    if(!req.body.Actividad || !req.body.Comentarios || !req.body.Tema) {
        req.bodyNotOK = 'Error'; // Establecer el error en la solicitud
        return cb(null, false); // Rechazar el archivo

    }

    const Fecha_entrega = new Date();

        // Buscar la actividad original para comprobar fecha límite
    const actividadOriginal = await Actividades.findOne({ Tema: req.body.Tema, Actividad: req.body.Actividad });
    if (!actividadOriginal) {
        req.NotExistActivity = 'Error';
        return cb(null, false); // Rechazar el archivo
    }

    // Convertir Fecha_fin a Date
    const fechaFin = new Date(actividadOriginal.Fecha_fin + "T23:59:59");

    // Comprobar si la fecha de entrega es posterior a la fecha límite
    if (Fecha_entrega > fechaFin) {
        req.ActivityLate = 'Error';
        return cb(null, false); // Rechazar el archivo
    }



    const existsUsername = await Actividades_entregadas.findOne({ username:username, Tema: req.body.Tema, Actividad: req.body.Actividad});

    if(existsUsername) {
        req.alreadyExistsUser = 'Error';
        return cb(null, false); // Rechazar el archivo
    }



    const extensionesPermitidas = ['.zip', '.rar', '.pdf', '.png'];
    if (!extensionesPermitidas.includes(extension)) {
        req.fileValidationError = 'Error'; // Establecer el error en la solicitud
        return cb(null, false); // Rechazar el archivo
    }

    return cb(null, true);  // Aceptar el archivo
};


const subidas_actividades= multer({
    storage: almacenamiento_actividades,
    fileFilter: validarExtensionactividad
});





//-----------MIDDLEWARE para verificar token--------------------------
function verificarToken(req, res, next) {
    const token = req.cookies['token'];
    const username = req.cookies['username'];

    if (!token) {
        return res.status(403).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>No autorizado</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 50px; }
                    h1 { color: #e74c3c; }
                    p { color: #555; }
                    a { color: #3498db; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>No estás autorizado</h1>
                <p>Debes iniciar sesión para acceder a esta página.</p>
                <a href="/">Volver al inicio</a>
            </body>
            </html>
        `);
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err || decoded.username !== username) {
            return res.status(401).send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>No autorizado</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 50px; }
                        h1 { color: #e74c3c; }
                        p { color: #555; }
                        a { color: #3498db; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <h1>No estás autorizado</h1>
                    <p>Tu sesión no es válida.</p>
                    <a href="/">Volver al inicio</a>
                </body>
                </html>
            `);
        }

        req.usuario = decoded;
        next();
    });
}


//const parseFormFields = multer().none();
//-------------------------

router.get("/saludo", (req, res) => {
  res.json({ mensaje: "Hola, este GET no necesita parámetros" });
});



router.get("/consulta", (req, res) => {
  const { nombre, edad } = req.query;
  res.send({ mensaje: "Recibido GET con query params", nombre, edad }); //lo mismo que res.json
});



router.get("/consulta/:id", (req, res) => {
  const { id } = req.params;
  res.json({ mensaje: "Recibido GET con parámetro de ruta", id });
});


router.post("/form-url", (req, res) => {
  // Ejemplo 1: json
  const { nombre, edad } = req.body;
  res.send({ mensaje: "Recibido POST urlencoded", nombre, edad });
});


router.post("/form-url2", (req, res) => {
  const { nombre, edad } = req.body;

  // Ejemplo 2: texto plano
  res.send(`Formulario recibido: ${nombre}, ${edad}`);

});


router.post("/form-url3", (req, res) => {
  const { nombre, edad } = req.body;

  // Ejemplo 3: array
  res.send([nombre, edad]);

});


router.post("/form-url4", (req, res) => {
  const { nombre, edad } = req.body;

  // Ejemplo 4: HTML
  res.send(`<p>Usuario: ${nombre}</p><p>Edad: ${edad}</p>`);

});



router.put("/texto", (req, res) => {
  const contenido = req.body;
  res.send({ mensaje: "Recibido PUT text/plain", contenido });
});




//-------------------------
router.post("/register",[subidas_imagenes.single("foto")], persona_Controller.create) //Ruta que nos permite crear el usuario en la db
//router.put('/inicio/:name', persona_Controller.changePassword) //Ruta que nos permite cambiar contraseñas,emails. Es protegida por el middleware
router.delete("/usuario",verificarToken, persona_Controller.delete_One) //Ruta que nos permite borrar usuarios.








//---------------------------
router.get("/", persona_Controller.root)  //Ruta que nos permite obtener el token de inicio de sesión y obtener el html de portada
router.post("/inicio", persona_Controller.start_session)  //Ruta que nos permite obtener el token de inicio de sesión y obtener el html de portada
router.get("/inicio/get_all_photo",verificarToken, persona_Controller.get_all_photo)
router.put("/inicio/edit_last_conexion",verificarToken, persona_Controller.edit_last_conexion)
router.post("/inicio/set_all_minutes",verificarToken, persona_Controller.calculate_minutes_connected)
router.get("/inicio/get_all_minutes",verificarToken, persona_Controller.get_minutes_connected)
router.get("/inicio/get_all_activities",verificarToken, persona_Controller.get_all_activities)
router.get("/inicio/get_all_messages",verificarToken, persona_Controller.get_all_messages)
router.get("/inicio/get_all_activities_user",verificarToken, persona_Controller.get_all_activities_user)
router.post("/inicio/upload_message",verificarToken, persona_Controller.upload_message)
router.post("/inicio/upload_answer",verificarToken, persona_Controller.upload_answer)
router.post("/inicio/upload_activity",verificarToken, [subidas_actividades.single("archivo")], persona_Controller.upload_activity)
router.delete("/inicio/delete_activity_and_File",verificarToken, persona_Controller.delete_activity_and_File) //Ruta que nos permite borrar usuarios.
router.post("/inicio/add_activities", persona_Controller.insertarDocumentos)
router.post("/inicio/logout",verificarToken, persona_Controller.logout)
router.get("/downloadFile",verificarToken, persona_Controller.downloadFile)
router.get("/inicio.html",verificarToken, persona_Controller.get_inicio_html)
router.post("/create_activities_admin",verificarToken, persona_Controller.create_activities_admin)
router.get("/public_for_admin/inicio.html",verificarToken, persona_Controller.get_inicio_html_admin)





//MUY IMPORTANTE AQUÍ EXORTAMOS EL ROUTER
module.exports ={router} //¡Devuelvo mis rutas¡¡¡¡