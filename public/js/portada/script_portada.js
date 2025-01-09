document.addEventListener('DOMContentLoaded', () => {


const encabezado = document.getElementById("h2_anim");
let intervaloId;
    // Función para añadir letras con un intervalo
function escribirTexto(frase_escribir) {
    const palabras = frase_escribir.split(" "); // Dividimos el texto en palabras
    let letraIndex = 0;
    let palabraIndex = 0;
    let frase = "";
    encabezado.textContent=""
    const clases = ['font-1', 'font-2', 'font-3', 'font-4', 'font-5'];  // Clases para los estilos
     

    function animar() {
        if (palabraIndex < palabras.length) {
            const palabra = palabras[palabraIndex];
            let palabraHtml = '';

            // Crear palabra con las letras hasta el índice actual
            for (let i = 0; i <= letraIndex; i++) {
                palabraHtml += palabra[i];
            }

            // Aplicar estilo
            const textoconestilo = `<span class="${clases[palabraIndex % clases.length]}">${palabraHtml}</span> `;
            encabezado.innerHTML = frase + textoconestilo; // Mostrar el texto en el encabezado

            letraIndex++; // Aumentar el índice de letra

            if (letraIndex === palabra.length) { // Si ya hemos terminado una palabra
                letraIndex = 0;
                frase += textoconestilo + "<br>"; // Añadir la palabra completa al texto mostrado
                palabraIndex++; // Avanzar a la siguiente palabra
            }
        }
    }
    intervaloId =setInterval(animar, 100);
}


escribirTexto("¡Bienvenido a desarrollo de interfaces!");



document.querySelector("#images_container").addEventListener("click", function() {
    clearInterval(intervaloId)
    escribirTexto("¡La doc está disponible abajo!");
});


    function popUp() {
                //div que pone la pantalla en negro
                let div_absolute=document.createElement("div")
                div_absolute.id="div_absolute_background"
                div_absolute.style.position="absolute"
                div_absolute.style.top="0"
                div_absolute.style.left="0"
                div_absolute.style.height= Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)+"px"
                div_absolute.style.zIndex="999"
                div_absolute.style.backgroundColor="rgba(88, 88, 88, 0.7)"
                div_absolute.style.width="100vw"
                document.querySelector("body").appendChild(div_absolute)
        
                //div que crea el recuadro de iniciar sesión
                let div_absolute_2=document.createElement("div")
                div_absolute_2.id="div_absolute_poppup"
                div_absolute_2.style.position="fixed "
                div_absolute_2.style.top="50%"
                div_absolute_2.style.left="50%"
                div_absolute_2.style.padding="5rem"
                div_absolute_2.style.paddingTop="0.5rem"
                div_absolute_2.style.paddingBottom="2.5rem"
                div_absolute_2.style.zIndex="9999"
                div_absolute_2.style.transform = "translate(-50%, -50%)"
                div_absolute_2.style.backgroundColor="rgb(0, 0, 0)"
                div_absolute_2.style.borderRadius="1.5rem"
                div_absolute_2.style.boxShadow="0.2rem 0.2rem 0.2rem 0.2rem rgba(4, 1, 46, 0.5)"
                
                let img_logo=document.createElement("img")
                img_logo.src="./img/logo.png"
                img_logo.style.width="5rem"
                img_logo.style.marginBottom="1rem"
                div_absolute_2.append(img_logo)
                document.querySelector("body").appendChild(div_absolute_2)
        
                div_absolute.addEventListener("click", function() {
                    // Remueve el fondo negro y el pop-up
                    div_absolute.remove();
                    div_absolute_2.remove();
                });        
    }


    function createform (config) {
        const form = document.createElement("form");
        form.action = config.action || "#"; 
        form.method = config.method || "POST"; 
        form.id = config.id || "dynamicForm"; 
        form.style.display = config.style?.display || "flex";
        form.style.flexDirection = config.style?.flexDirection || "column";
        form.style.gap = config.style?.gap || "1rem";
        form.enctype= config.enctype
    

        config.fields.forEach(field => {
            const fieldContainer = document.createElement("div");
            fieldContainer.className = "form-group"; // Clase para estilo
    
            // Crear la etiqueta si existe
            if (field.label) {
                const label = document.createElement("label");
                label.textContent = field.label;
                label.htmlFor = field.id || field.name;
                fieldContainer.appendChild(label);
            }
    
            // Crear el campo de entrada
            const input = document.createElement("input");
            input.type = field.type || "text"; // Tipo de input (text, email, password, etc.)
            input.name = field.name || ""; // Nombre del campo
            input.id = field.id || ""; // ID del campo
            input.placeholder = field.placeholder || ""; // Placeholder
            input.required = field.required || false; // Si el campo es obligatorio
    
            // Agregar clases y estilos adicionales al input si se especifican
            if (field.className) input.className = field.className;
            if (field.style) Object.assign(input.style, field.style);

    
            fieldContainer.appendChild(input);
    
            // Agregar el campo al formulario
            form.appendChild(fieldContainer);

        });
        let div_separator=document.createElement("div")
        div_separator.className="separator"
        form.appendChild(div_separator);

        // Crear un botón de envío
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = config.submitText || "Enviar";
        submitButton.className = config.submitClass || "btn-submit";
    
        form.appendChild(submitButton);
    
        // Agregar el formulario al cuerpo o a un contenedor especificado
        const targetContainer = document.querySelector(config.targetContainer || "body");
        targetContainer.appendChild(form);
    }


    //---------Eventos a partir de la funcion anterior--------------------
    document.querySelector("#singup").addEventListener("click", function(){
        popUp()
        let texto_plano=document.createElement("h2")
        texto_plano.style.fontFamily = "'Arial', sans-serif"; // Fuente moderna
        texto_plano.textContent="Inicio de Sesión"
        texto_plano.style.fontSize="1.5rem"
        texto_plano.color="white"
        document.querySelector("#div_absolute_poppup").append(texto_plano)
        createform({
            id: "loginForm_singup",
            action: "/inicio",
            method: "GET",
            fields: [
                {
                    type: "text",
                    id: "username",
                    name: "username",
                    placeholder: "Nombre de usuario",
                    required: true
                },
                {
                    type: "password",
                    id: "password",
                    name: "password",
                    placeholder: "Contraseña",
                    required: true
                }
            ],
            submitText: "Iniciar sesión",
            targetContainer: "#div_absolute_poppup" // ID del contenedor donde se añadirá el formulario
        });
    })

    
    document.querySelector("#register").addEventListener("click", function(){
        popUp()
        let texto_plano=document.createElement("h2")
        texto_plano.style.fontFamily = "'Arial', sans-serif"; // Fuente moderna
        texto_plano.textContent="Registrate en tu nuevo Classroom"
        texto_plano.style.fontSize="1.5rem"
        texto_plano.color="white"
        document.querySelector("#div_absolute_poppup").append(texto_plano)
        createform({
            id: "createuserForm",
            action: "/register",
            enctype:"multipart/form-data",
            method: "POST",
            fields: [
                {
                    type: "text",
                    id: "nombre",
                    name: "nombre",
                    placeholder: "Nombre",
                    required: true
                },
                {
                    type: "text",
                    id: "username",
                    name: "username",
                    placeholder: "Nombre de usuario",
                    required: true
                },
                {
                    type: "text",
                    id: "email",
                    name: "email",
                    placeholder: "Email educaand",
                    required: true
                },
 
                {
                    type: "password",
                    id: "password",
                    name: "password",
                    placeholder: "Contraseña",
                    required: true
                },
                {
                    type: "password",
                    id: "repit_password",
                    placeholder: "Repite tu contraseña",
                    required: true
                },
                {
                    type: "file",
                    id: "foto",
                    name: "foto",
                    placeholder: "Inserta una foto",
                    required: true
                },

            ],
            submitText: "Crear usuario",
            targetContainer: "#div_absolute_poppup" // ID del contenedor donde se añadirá el formulario
        });
        const div_absolute_poppup=document.querySelector("#div_absolute_poppup")
        const mensaje_servidor=document.createElement("p")

        const form = document.getElementById("createuserForm");
        if (form) {
            form.addEventListener("submit", async function(event) {
                event.preventDefault(); // Prevenir la recarga de la página

                const formData = new FormData(form);
                console.log(formData)/// Crear un FormData con los datos del formulario

                try {
                    // Realizar el fetch con multipart/form-data automáticamente por el FormData
                    const response = await fetch(form.action, {
                        method: form.method,
                        body: formData 
                        // Enviar el FormData que incluye la imagen y demás datos
                    });
                    if (response.ok) {
                        // Si la respuesta es exitosa, asumimos que el servidor devuelve un JSON
                        const resultado = await response.json();
                        console.log("Respuesta del servidor:", resultado);
                        
                        mensaje_servidor.style.color = "green";
                        mensaje_servidor.textContent = "Usuario creado exitosamente"; // Mensaje de éxito
                        const inputs=document.querySelectorAll("input")
                        inputs.forEach(function(input){
                            input.value=""
                        })

                        div_absolute_poppup.append(mensaje_servidor)
                    } else {
                        // Si la respuesta es un error (status 4xx, 5xx), manejamos el mensaje de error
                        const errorData = await response.json(); // Asumimos que el servidor devuelve un JSON con el error
                        console.error("Error del servidor:", errorData);
                        
                        mensaje_servidor.style.color = "red";
                        mensaje_servidor.textContent = `Error: ${errorData.message || "Ha ocurrido un error en el servidor"}`; // Mensaje de error
                        div_absolute_poppup.append(mensaje_servidor)
                    }
                } catch (error) {
                    console.error("Error al enviar el formulario:", error);
                    mensaje_servidor.style.color="red"
                    mensaje_servidor.textContent=error
                    div_absolute_poppup.append(mensaje_servidor)
                }
            });
        }
    })


    
    document.querySelector("#passwordforgot").addEventListener("click", function(){
        popUp()
        let texto=document.createElement("h2")
        texto.style.fontFamily = "'Arial', sans-serif"; // Fuente moderna
        texto.textContent="Cambia tu contraseña"
        texto.style.fontSize="1.5rem"
        texto.color="white"
        document.querySelector("#div_absolute_poppup").append(texto)
        createform({
            id: "loginForm",
            action: "/submit",
            method: "POST",
            fields: [
                {
                    type: "text",
                    id: "username",
                    placeholder: "Nombre de usuario",
                    required: true
                },
                {
                    type: "password",
                    id: "password_old",
                    placeholder: "Contraseña actual",
                    required: true
                },

                {
                    type: "password",
                    id: "password",
                    placeholder: "Nueva contraseña",
                    required: true
                },
                {
                    type: "password",
                    id: "repit_password_old",
                    placeholder: "Repite tu contraseña nueva",
                    required: true
                },
            ],
            submitText: "Cambiar contraseña",
            targetContainer: "#div_absolute_poppup" // ID del contenedor donde se añadirá el formulario
        });
        let texto_plano=document.createElement("p")
        texto_plano.textContent="¡Recuerda introducir una contraseña segura!"
        texto_plano.style.fontSize="1.2rem"
        texto_plano.color="white"
        document.querySelector("#div_absolute_poppup").style.paddingBottom="0px"
        document.querySelector("#div_absolute_poppup").append(texto_plano)

        let texto_plano_2 = document.createElement("p");
        texto_plano_2.style.fontSize = "1rem";
        texto_plano_2.style.color = "red";
        texto_plano_2.style.marginTop = "1rem";
        document.querySelector("#div_absolute_poppup").append(texto_plano_2);


    let passwordInput = document.querySelector("#password");
    let repeatPasswordInput = document.querySelector("#repit_password_old");
    repeatPasswordInput.addEventListener("input", function () {
        // Verificar si algún campo está vacío
        if (passwordInput.value === "" || repeatPasswordInput.value === "") {
            texto_plano_2.textContent = ""; // Limpiar el mensaje
        } 
        // Verificar si las contraseñas no coinciden
        else if (passwordInput.value !== repeatPasswordInput.value) {
            texto_plano_2.textContent = "Las contraseñas no coinciden. Por favor, revisa.";
            texto_plano_2.style.color = "red"; // Cambiar el color del mensaje
        } 
        // Las contraseñas coinciden
        else {
            texto_plano_2.textContent = "¡Las contraseñas coinciden!";
            texto_plano_2.style.color = "green"; // Cambiar el color del mensaje
        }
    });
    

    });


    const buttons = document.querySelectorAll('.buttonClass1, .buttonClass2');

    // Agregar el efecto al pasar el mouse sobre los botones
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)'; // Aumenta el tamaño
            button.style.backgroundColor = '#007BFF'; // Cambia el color de fondo
            button.style.color = 'white'; // Cambia el color del texto
        });

        // Restaurar estilo cuando el mouse salga del botón
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1.0)'; // Restaura el tamaño original
            button.style.backgroundColor = ''; // Restaura el color original
            button.style.color = ''; // Restaura el color original del texto
        });
    });



    window.addEventListener('resize', function(){

        let div_back = document.querySelector("#div_absolute_background");
        div_back.style.height= Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) + "px"

    });

})

