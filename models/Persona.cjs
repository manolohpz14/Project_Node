const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");



// Definir el esquema de Contactos
const ContactosSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value); // Solo letras y espacios
            },
            message: "El nombre solo puede contener letras y espacios"
        }
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        unique: true,
        trim: true,
        minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"],
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        unique: true,
        lowercase: true,
    },
    fecha_creacion: {
        type: String,
        default: function() {
            return new Date().toLocaleString('es-ES', {
                timeZone: 'Europe/Madrid',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // Formato 24 horas
            });
        }
    },
    foto: {
        type: String,
        default: "imagen_anonimous.png"
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },
    ult_conexion: {
        type: String,
        default: "No se ha accedido nunca"
    },
    minutos_conectados: {
        type: Number,
        default: 0, // Inicializar en 0 minutos
        validate: {
            validator: function(value) {
                return value >= 0; // Validar que no sea negativo
            },
            message: "Los minutos conectados no pueden ser negativos"
        }
    },
    
});


// `pre-save` es para encriptar la contraseña antes de guardar (se podrian meter mas cosas). this se refiere a la propia instacia de la clase modelo.
ContactosSchema.pre("save", async function(next) {
    if (this.isModified("password")) { //Is Modified me detecta automaticamente si yo ya he hecho algún cambio en mi función de callback, lo cual es muyyyyy útil
        this.password = await bcrypt.hash(this.password, 10);
    }
    next(); //Los usos de middlewares requieren de next aveces, como por ejemplo la funcion de callback en el middleware de borrar usuario
});


// Método de instancia para comparar contraseñas
ContactosSchema.methods.comparePassword = async function(password) { //con metod creo el método que a mi me de la gana
    return await bcrypt.compare(password, this.password);
};


const ActivitiesSchema = new Schema({
    Tema: {
        type: String,
        required: [true, "El Tema es obligatorio"],
        trim: true,
    },
    Color: {
        type: String,
        required: [true, "El color de la actividad es obligatorio"],
        default: "black",
    },
    Actividad: {
        type: String,
        required: [true, "El nombre de la actividad es obligatorio"],
    },
    Fecha_fin: {
        type: String,
        required: [true, "La fecha de finalizacion es obligatoria"],
    },
    Fecha_creación: {
        type: String,
        required: [true, "La fecha de creacion es obligatoria"],
    },
    Abreviacion: {
        type: String,
        required: [true, "La abreviacion de la actividad es obligatoria"],
    },
    Explicacion: {
        type: String,
        required: [true, "La explicacion de la actividad es obligatoria"],
    },
});





const EntregasSchema = new Schema({
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        unique: true,
        trim: true,
        minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"],
    },
    Tema: {
        type: String,
        required: [true, "El Tema es obligatorio"],
        trim: true,
    },
    Actividad: {
        type: String,
        required: [true, "El nombre de la actividad es obligatorio"],
    },
    Fecha_entrega: {
        type: String,
        required: [true, "La fecha de entrega es obligatoria"],
    },
    Comentarios: {
        type: String,
        required: [true, "El comentario es obligatorio"],
        minlength: [1, "El comentario debe tener al menos 3 caracteres"],
        maxlength: [1000, "No se pueden superar los 1000 caracteres en el comentario"],
    },
    Nombre_archivo: {
        type: String,
        required: [true, "El nombre del es obligatorio"],
    }
});





const MensajesSchema = new Schema({
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        trim: true,
        minlength: [3, "El nombre de usuario debe tener al menos 3 caracteres"],
    },
    texto: {
        type: String,
        required: [true, "El texto es obligatorio"],
        minlength: [1, "El nombre de usuario debe tener al menos 3 caracteres"],
        maxlength: [1000, "No se pueden superar los 1000 caracteres"],
    },
    fecha_anuncio: {
        type: String,
        required: [true, "El nombre de la fecha_anuncio es obligatoria"]
    }
});


const Usuarios = model("Usuarios", ContactosSchema, "Users");
const Actividades = model("Actividades", ActivitiesSchema, "Activities");
const Actividades_entregadas = model("Actividades_entregadas", EntregasSchema, "Activities_recieved");
const Mensajes = model("Mensajes", MensajesSchema, "Messages");




module.exports = { Usuarios, Actividades, Actividades_entregadas,Mensajes };







