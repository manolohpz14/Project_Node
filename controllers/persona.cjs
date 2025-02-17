
const validator= require("validator");
const {Usuarios,Actividades,Actividades_entregadas, Mensajes}=require("../models/Persona.cjs")
const bcrypt=require("bcrypt")
const jwt= require('jsonwebtoken')
const path=require('path')
const fs = require('fs').promises


//----------------------función para guardar los datos de usuario en la db-------------------








async function insertarDocumentos(req, res) {
    try {
        // Obtener las actividades desde req.body
        const actividades = req.body; // Asumiendo que el cuerpo de la solicitud contiene un array de actividades

        // Validar que el cuerpo de la solicitud no esté vacío y tenga las actividades
        if (!actividades || actividades.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron actividades" });
        }

        // Insertar los documentos en la colección 'actividad'

        const resultado = await Actividades.insertMany(actividades);
        res.status(201).json({ message: "Documentos insertados correctamente", data: resultado });


    } catch (error) {
        console.error("Error al insertar los documentos:", error);
        // Responder con un error
        res.status(500).json({ message: "Error al insertar los documentos", error: error.message });
    }
}








function get_all_activities(req, res) {
    Actividades.find()
        .then(actividades => {
            // Si no se encuentran actividades, respondemos con un mensaje
            if (actividades.length === 0) {
                return res.status(404).json({ message: 'No se encontraron actividades' });
            }

            // Devolver las actividades encontradas
            res.status(200).json(actividades);
        })
        .catch(error => {
            // En caso de error, respondemos con un mensaje de error
            console.error(error);
            res.status(500).json({ message: 'Hubo un error al obtener las actividades' });
        });
}




function get_all_messages(req, res) {
    Mensajes.find()
        .then(actividades => {
            // Si no se encuentran actividades, respondemos con un mensaje
            if (actividades.length === 0) {
                return res.status(404).json({ message: 'No se encontraron mensajes' });
            }

            // Devolver las actividades encontradas
            res.status(200).json(actividades);
        })
        .catch(error => {
            // En caso de error, respondemos con un mensaje de error
            console.error(error);
            res.status(500).json({ message: 'Hubo un error al obtener las actividades' });
        });
}


function get_all_activities_user(req, res) {
    const username = req.cookies["username"];
    Actividades_entregadas.find({ username })
        .then(actividades => {
            // Si no se encuentran actividades, respondemos con un mensaje
            if (actividades.length === 0) {
                return res.status(200).json({ message: 'No se encontraron actividades' });
            }

            // Iteramos sobre cada actividad para modificar el Nombre_archivo
            actividades.forEach(actividad => {
                actividad.Nombre_archivo = actividad.Nombre_archivo.split(path.sep).slice(-1)[0];
            });

            // Devolver las actividades encontradas
            res.status(200).json(actividades);
        })
        .catch(error => {
            // En caso de error, respondemos con un mensaje de error
            console.error(error);
            res.status(500).json({ message: 'Hubo un error al obtener las actividades' });
        });
}


async function delete_activity_and_File(req,res) {
    try {

        const username=req.cookies["username"]
        const Actividad=req.body.Actividad
        const Tema=req.body.Tema
        // Paso 1: Eliminar el registro del usuario en la base de datos
        await Actividades_entregadas.findOneAndDelete({ username, Actividad, Tema });

        // Paso 2: Eliminar la carpeta donde se almacenó el archivo
        let rootpath = __dirname.split(path.sep);
        rootpath.pop(); // Eliminar el último directorio (__dirname)
        rootpath = path.join(...rootpath);

        const dirPath = path.join(rootpath, "imagenes", "personas", username, Tema+"_"+Actividad);
        await fs.rm(dirPath, { recursive: true, force: true }); // Elimina la carpeta y su contenido
        res.status(200).json({message:"Actividad_eliminada"});


    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al obtener las actividades' });
        console.error("Error al eliminar usuario y carpeta:", error.message);
    }
}



const upload_message = async function (req, res) {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const username=req.cookies["username"]
        const texto = req.body.texto;

        // Validar que los campos requeridos estén presentes
        if (!username || !texto) {
            return res.status(400).json({
                status: "error",
                message: "El nombre de usuario y el texto son obligatorios",
            });
        }

        // Generar la fecha en formato español y huso horario de Madrid
        const fecha_anuncio = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Formato 24 horas
        });

        // Crear un nuevo mensaje
        const nuevoMensaje = new Mensajes({
            username: username.trim(),
            texto: texto.trim(),
            fecha_anuncio: fecha_anuncio,
        });

        // Guardar el mensaje en la base de datos
        const mensajeGuardado = await nuevoMensaje.save();

        // Devolver una respuesta exitosa
        res.status(201).json({
            status: "success",
            message: "Mensaje creado exitosamente",
            data: mensajeGuardado,
        });
    } catch (error) {
        // En caso de error, devolver un mensaje de error
        console.error("Error al crear el mensaje:", error.message);
        res.status(500).json({
            status: "error",
            message: "Hubo un error al crear el mensaje",
        });
    }
};





const upload_activity = async function (req, res) {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const username=req.cookies["username"]
        const tema = req.body.Tema;
        const actividad = req.body.Actividad;
        const comentarios = req.body.Comentarios;

        // Validar que los campos requeridos estén presentes
        if (!username || !comentarios || !actividad || !tema) {
            return res.status(400).json({
                status: "error",
                message: "Algun fallo",
            });
        }

        if (req.fileValidationError === 'Error'){
            return res.status(400).json({
                status: "error",
                message: "Has pasado una extension no valida de imagen",
            })
        }

        if (req.bodyNotOK === 'Error'){
            return res.status(400).json({
                status: "error",
                message: "No se han pasado los campos que se debían",
            })
        }

        if (req.alreadyExistsUser === 'Error'){
            return res.status(400).json({
                status: "error",
                message: "Este usuario ya ha entregado esta actividad",
            })
        }

        const Fecha_entrega = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Formato 24 horas
        });


        let Nombre_archivo
        if (req.file) {
            Nombre_archivo= req.file.path;
        }

        // Crear un nuevo mensaje
        const nuevaEntrega = new Actividades_entregadas({
            username: username.trim(),
            Tema: tema.trim(),
            Actividad:actividad,
            Fecha_entrega: Fecha_entrega,
            Comentarios:comentarios,
            Nombre_archivo

        });


        // Guardar el mensaje en la base de datos
        const mensajeGuardado = await nuevaEntrega.save();

        // Devolver una respuesta exitosa
        res.status(201).json({
            status: "success",
            message: "Mensaje creado exitosamente",
            data: mensajeGuardado,
        });
    } catch (error) {
        // En caso de error, devolver un mensaje de error
        console.error("Error al crear el mensaje:", error.message);
        res.status(500).json({
            status: "error",
            message: "Hubo un error al crear el mensaje",
        });
    }
};




async function create(req, res) {
    const parametros = req.body; // Obtenemos los datos enviados en el POST. AQUÍ NO HAY IMAGEN REQ BODY Y REQ FILE SE SPARAN AUTOMATICAMENTE


    try {
        // Validamos los campos `nombre` y `apellidos` usando validator
        let evalue_title = validator.isEmpty(parametros.username);


        if (evalue_title === true) {
            throw new Error("No se ha validado la información");
        }

    } catch (error) {

        return res.status(400).json({
            status: "error",
            mensaje: "Hay fallos en la validación",
            error: error.message,
            linea: error.stack    
        });
    }


    if (req.fileValidationError === 'Error'){
        return res.status(400).json({
            status: "error",
            message: "Has pasado una extension no valida de imagen",
        })
    }

    if (req.existsUsername){
        return res.status(400).json({
            status: "error",
            message: "Ya existe el usuario",
        })
    }
    
    if (req.existsEmail){
        return res.status(400).json({
            status: "error",
            message: "Ya existe el email",
        })
    }

    if (req.userNotOK){
        return res.status(400).json({
            status: "error",
            message: "El nombre de usuario debe tener al menos 3 letras sin espacios y solo mayúsculas y minúsculas y menos de 14 caracteres",
        })
    }

    if (req.nombreNotOK){
        return res.status(400).json({
            status: "error",
            message: "El nombre de la persona debe tener al menos 3 letras sin espacios y solo mayúsculas y minúsculas y menos de 15 caracteres",
        })
    }
    
    
    if (req.emilNotOk){
        return res.status(400).json({
            status: "error",
            message: "El email debe tener extension educaand, al menos 4 caracteres delante del @ y menos de 30 caracteres",
        })
    }

    if (req.passwordNotOk){
        return res.status(400).json({
            status: "error",
            message: "La constraseña debe tener al menos 6 caracteres",
        })
    }

    if (req.file) {
        parametros["foto"] = req.file.path;
    }

    const persona_model = new Usuarios(parametros);

    try {
        const personasaved = await persona_model.save(); // Mongoose se encargará del encriptado de la contraseña aqui gracia a pre
        return res.status(200).json({
            status: "finalizado con éxito",
            persona: personasaved
        });
    } catch(error){
        if (error.code === 11000) {  // Código de error MongoDB para clave duplicada
            // Si el error es por clave duplicada, devuelve un mensaje más claro
            const field = Object.keys(error.keyValue)[0]; // Obtenemos el campo duplicado
            const message = field === 'username' ? 'El nombre de usuario ya está en uso' : 'El correo electrónico ya está registrado';
            res.status(400).json({ message });
        } else {
            return res.status(400).json({
                status: "error",
                message: error.message,
    
                
            });
        }

    }
}




async function start_session (req, res) {
    try {
        const username = req.query.username;  // Obtiene el valor de 'username'
        const password = req.query.password;

        // Busca una persona por el campo `username`
        const persona = await Usuarios.findOne({ username: username });
        if (!persona || !persona.password) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado la persona en la db",
            });
        }

        const is_correct = await bcrypt.compare(password, persona.password);
        if (!is_correct) {
            return res.status(401).json({
                error: "Usuario o contraseña inválidos",
            });
        }

        let userForToken = {
            id: persona._id,
            username: persona.username
        };


        const token = jwt.sign(userForToken, process.env.SECRET_KEY, { expiresIn: '1h' });
        const rutaBase = path.resolve(__dirname, '..'); // Obtiene la ruta base


        // Establecer las cookies:
        // Cookie para el token
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
            secure: false,  // Cambiar a true si estás usando HTTPS
            sameSite: "lax"
        });

        // Cookie para el nombre de usuario (sin JWT)
        res.cookie('username', persona.username, {
            httpOnly: false,  // Evitar que JavaScript acceda a la cookie
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
            secure: false,  // Cambiar a true si estás usando HTTPS
            sameSite: "lax"
        });

        // Redirigir al usuario a la página de inicio
        res.status(200).sendFile(path.join(rutaBase, 'public', 'inicio.html'));
        
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: error.message,
        });
    }
}

function root (req,res) {
    const rutaBase = path.resolve(__dirname, '..'); // Obtiene la ruta base
    res.status(200).sendFile(path.join(rutaBase, 'public', 'portada.html'));
}





async function downloadFile(req, res) {
    try {
        // Obtener el nombre de usuario desde las cookies
        const username = req.cookies["username"];

        // Validar que el nombre de usuario exista
        if (!username) {
            return res.status(400).json({ error: 'El nombre del usuario no existe.' });
        }

        // Obtener los parámetros de consulta
        const { actividad, tema } = req.query;

        // Validar que los parámetros actividad y tema estén presentes
        if (!actividad || !tema) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos (actividad o tema).' });
        }

        // Buscar el archivo en la base de datos basado en username, actividad y tema
        const activity = await Actividades_entregadas.findOne({
            username: username,
            Actividad: actividad,
            Tema: tema,
        });

        if (!activity) {
            return res.status(404).json({ error: 'Archivo no encontrado para el usuario, actividad y tema especificados.' });
        }

        // Obtener la ruta absoluta del archivo
        const filePath = activity.Nombre_archivo;

        // Enviar el archivo al cliente para la descarga
        //res.download(path [, filename] [, options] [, callback])
        res.download(filePath, path.basename(filePath), (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).json({ error: 'No se pudo descargar el archivo.' });
            }
        });
    } catch (error) {
        console.error('Error al manejar la solicitud de descarga:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}


const calculate_minutes_connected = async (req, res) => {
    try {
        const username = req.cookies['username'];

        if (!username) {
            return res.status(400).json({ message: "No se recibió el username en las cookies" });
        }

        // Obtener al usuario desde la base de datos
        const usuario = await Usuarios.findOne({ username: username });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Hora actual en el servidor en el huso horario español
        const cierreSesion = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Formato 24 horas
        });

        // Convertir a objetos Date para cálculos
        const ultimaConexion = usuario.ult_conexion; // Convertir a Date

        function convertirFecha(fechaStr) {
            const [fecha, hora] = fechaStr.split(", ");
            const [dia, mes, año] = fecha.split("/").map(Number);
            return new Date(`${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}T${hora}`);
        }

        // Calcular diferencia en minutos. Esto se debe hacer mucho mejor...
        const diferenciaMinutos = Math.floor((convertirFecha(cierreSesion) - convertirFecha(ultimaConexion)) / 1000 / 60);
        console.log(diferenciaMinutos)
        if (diferenciaMinutos < 0) {
            return res.status(400).json({ message: "Error en las fechas" });
        }

        // Actualizar los minutos conectados del usuario
        usuario.minutos_conectados = (usuario.minutos_conectados || 0) + diferenciaMinutos;

        // Actualizar `ult_conexion` con la hora actual
        usuario.ult_conexion = cierreSesion;

        // Guardar los cambios en la base de datos
        await usuario.save();

        res.status(200).json({ 
            message: "Minutos conectados actualizados",
            diferenciaMinutos,
        });
    } catch (error) {
        console.error("Error al calcular minutos conectados:", error.message);
        res.status(500).json({ message: "Hubo un error en el servidor" });
    }
};

const get_minutes_connected = async (req, res) => {
    try {
        // Obtener todos los usuarios de la base de datos
        const usuarios = await Usuarios.find({}, "username minutos_conectados");

        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }

        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener minutos conectados:", error.message);
        res.status(500).json({ message: "Hubo un error en el servidor" });
    }
};





async function edit_last_conexion (req, res) {
    try {
        const username = req.cookies['username']
        const persona = await Usuarios.findOne({ username: username });

        if (!persona) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado la persona en la db",
            });
        }

        // Obtener la hora actual ajustada al huso horario español
        const fechaHoraEspañola = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Formato 24 horas
        });//Esto genera una cadena de texto que representa la fecha y hora ajustada al huso horario especificado (Europe/Madrid en este caso). Es importante notar que:



        // Guardar la fecha en la base de datos con la hora española
        persona.ult_conexion = fechaHoraEspañola;
        await persona.save();

        res.status(200).json({
            status: "success",
            mensaje: "Fecha de última conexión actualizada.",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: error.message,
        });
    }
};











//----------------------función para borrar usuario de la db-------------------
async function delete_One(req, res) {
    let name_persona_borrar = req.params.name;
    try {
        const result = await Usuarios.deleteOne({ nombre_usuario: name_persona_borrar });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado ninguna persona con ese nombre en la db",
            });
        }

        return res.status(200).json({
            status: "exito",
            mensaje: `La persona con el nombre ${name_persona_borrar} ha sido eliminada`,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al intentar borrar la persona en la db",
            error: error.message,
            linea: error.stack
        });
    }
}



//----------------------función para editar contraseña de la db-------------------
async function changePassword(req,res){
  

}


async function get_all_photo(req, res) {
    try {
        const personas = await Usuarios.find({});
        if (!personas || personas.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron usuarios."
            });
        }

        // Determinar la ruta raíz donde se encuentran las fotos
        const rootpath = path.resolve(__dirname, '..'); // Retrocede un nivel en el directorio

        let array_fotos = [];
        for (let persona of personas) {
            if (!persona.foto) {
                const filePath = path.join(rootpath, "anonimo.png");
                array_fotos.push({ foto: filePath, username: persona.username, ult_conexion:persona.ult_conexion });
            }
            else {
                const filePath = path.join(rootpath, persona.foto);
                array_fotos.push({ foto: filePath, username: persona.username, ult_conexion:persona.ult_conexion });
            }
        }

        // Crear un array con las fotos codificadas en base64
        const photosArray = await Promise.all(array_fotos.map(async (objeto) => {
            try {
                const file = await fs.readFile(objeto.foto);
                const mimeType = path.extname(objeto.foto) === '.jpg' ? 'image/jpeg' : 'image/png';
                const base64Image = file.toString('base64');
                return { foto: `data:${mimeType};base64,${base64Image}`, username: objeto.username, ult_conexion:objeto.ult_conexion };
            } catch (err) {
                console.error(`Error leyendo el archivo: ${objeto.foto}`, err.message);
                return { foto: null, username: objeto.username, error: 'Error al leer la foto' };
            }
        }));

        // Enviar las fotos en un JSON
        res.status(200).json(photosArray);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            linea: error.stack,
            mensaje: error.message
        });
    }
}








module.exports={
    root,
    create,
    start_session,
    edit_last_conexion,
    delete_One,
    changePassword,
    get_all_photo,
    get_all_activities,
    get_all_messages,
    upload_message,
    calculate_minutes_connected,
    get_minutes_connected,
    upload_activity,
    get_all_activities_user,
    delete_activity_and_File,
    insertarDocumentos,
    downloadFile
    
    
}