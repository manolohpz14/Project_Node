const express= require("express");
const router=express.Router();
const persona_Controller=require('../controllers/persona.cjs');
const multer=require("multer");
const fs= require("fs").promises
const path=require("path")
const jwt= require('jsonwebtoken')
const {Usuarios, Actividades_entregadas}=require("../models/Persona.cjs")


//el primer parametro de cb es para indicar el error
//el segundo parametro de cb depende de lo ue se este haciendo:
//un string para el almacenamiento, un true o false para una validacion,
//un string para el nombre de un archivo
const almacenamiento_imagenes = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const username = req.body.username;
            const email = req.body.email;
            console.log(username);
            console.log(email);
    
            // Si el usuario existe, procedemos con la creación de directorios
            let rootpath = __dirname.split(path.sep);
            rootpath.pop(); // Eliminar el último directorio (__dirname)
            rootpath = path.join(...rootpath);
            console.log(rootpath)
    
            // Crear la ruta del directorio usando path.join para que sea compatible con el SO
            const filePath = path.join(rootpath, "imagenes", "personas", username);
            console.log(`Directorio creado: ${filePath}`);
            console.log(filePath)
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
        console.log(nombre_usuario + "_" + formattedDate + "_" + file.originalname)
        callback(null, nombre_usuario + "_" + formattedDate + "_" + file.originalname);
        
    }
});





async function validarExtensionyRegistro (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const username = req.body.username;
    const email = req.body.email;
    console.log(username)
    console.log(email)

    const nombre=req.body.nombre
    const password=req.body.password
    console.log(req.body)


    // Verificar si la extensión es PNG
    if (extension !== '.png') {
        req.fileValidationError = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    const existsUsername = await Usuarios.findOne({ username });
    const existsEmail = await Usuarios.findOne({ email });

    if (existsUsername) {
        req.existsUsername = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    if (existsEmail) {
        req.existsEmail = 'Error'; // Establecer el error en la solicitud
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
        console.log(password)
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
            console.log(req.body)
            const username = req.cookies["username"];
            const actividad = req.body.Actividad;
            const Tema = req.body.Tema;
            console.log(username);
            console.log(actividad);
    
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
        console.log(req.body)
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
    console.log(username)

    if(!req.body.Actividad || !req.body.Comentarios || !req.body.Tema) {
        console.log("No se han pasado todos los campos que se deben")
        req.bodyNotOK = 'Error'; // Establecer el error en la solicitud
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
    //const token = req.headers['authorization'];
    const token = req.cookies['token']
    const username = req.cookies['username']
    console.log(token)
    if (!token) {
        return res.status(403).json({ mensaje: "No se proporcionó un token o el toquen a caaducado" }); // En el cliente se debería mopstrar algo como SESIÓN CADUCADA SIEMPRE
    }

    // Verifica el token JWT
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: "Token inválido" });
        }
        req.usuario=decoded
        console.log(decoded)
        console.log(req.usuario.username)
        console.log(username)
        if (req.usuario.username!=username){
            return res.status(401).json({mensaje:"Personal no autorizado"})
        }
        next()
    });
    
}


//const parseFormFields = multer().none();



//-------------------------
router.post("/register",[subidas_imagenes.single("foto")], persona_Controller.create) //Ruta que nos permite crear el usuario en la db
//router.put('/inicio/:name', persona_Controller.changePassword) //Ruta que nos permite cambiar contraseñas,emails. Es protegida por el middleware
router.delete("/usuario",verificarToken, persona_Controller.delete_One) //Ruta que nos permite borrar usuarios.



//---------------------------
router.get("/inicio", persona_Controller.start_session)  //Ruta que nos permite obtener el token de inicio de sesión y obtener el html de portada
router.get("/inicio/get_all_photo",verificarToken, persona_Controller.get_all_photo)
router.put("/inicio/edit_last_conexion",verificarToken, persona_Controller.edit_last_conexion)
router.post("/inicio/set_all_minutes",verificarToken, persona_Controller.calculate_minutes_connected)
router.get("/inicio/get_all_minutes",verificarToken, persona_Controller.get_minutes_connected)
router.get("/inicio/get_all_activities",verificarToken, persona_Controller.get_all_activities)
router.get("/inicio/get_all_messages",verificarToken, persona_Controller.get_all_messages)
router.get("/inicio/get_all_activities_user",verificarToken, persona_Controller.get_all_activities_user)
router.post("/inicio/upload_message",verificarToken, persona_Controller.upload_message)
router.post("/inicio/upload_activity",verificarToken, [subidas_actividades.single("archivo")], persona_Controller.upload_activity)
router.delete("/inicio/delete_activity_and_File",verificarToken, persona_Controller.delete_activity_and_File) //Ruta que nos permite borrar usuarios.







//MUY IMPORTANTE AQUÍ EXORTAMOS EL ROUTER
module.exports ={router} //¡Devuelvo mis rutas¡¡¡¡