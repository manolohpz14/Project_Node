

function eventforTopBar(username,photosArray) {
    const img_top_bar=document.querySelector(".topbar-photo")
    const fotousername = photosArray.find(f => f.username === username);
    if (fotousername) {
    img_top_bar.src = fotousername.foto;
    } else {
    img_top_bar.src="./img/anonimo.jpg"; 
    }
    img_top_bar.style.objectFit="cover"
    img_top_bar.style.objectFit="cover"
    const topbar_username=document.querySelector(".topbar-username")
    topbar_username.textContent=username



    const topbar_right=document.querySelector(".topbar-right")
    topbar_right.style.cursor="pointer"

    let overlay = null;


    //------Añadimos a la foto la animación----------------
    topbar_right.addEventListener("click", () => {
    if (overlay) {
        // Si ya existe el div llamado overlay, eliminarlo y restablecer la variable
        overlay.remove();
        overlay = null;
        return;
    }

    // Crear el fondo semitransparente
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; 
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";

    // Crear la imagen
    const img_doc = document.createElement("img");
    img_doc.style.width = "30rem";
    img_doc.style.borderRadius = "8px"; // Bordes redondeados, opcional
    img_doc.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"; // Sombra para mejor estética
    img_doc.style.opacity = "0"; // Inicia transparente
    img_doc.style.transform = "translate(150%, -80%) scale(0.01)"; // Inicia desde fuera de la pantalla

    // Establecer la fuente de la imagen
    if (fotousername) {
        img_doc.src = fotousername.foto; // Foto encontrada
    } else {
        img_doc.src = "./img/anonimo.jpg"; // Imagen predeterminada
    }

    // Añadir la imagen al fondo
    overlay.appendChild(img_doc);

    // Añadir el fondo al body
    document.body.appendChild(overlay);

    // Añadir animación a la imagen después de un pequeño retraso, el retraso es importantisimo!!!!!!
    setTimeout(() => {
        img_doc.style.transition = "transform 1s ease-out, opacity 0.5s ease-out";
        img_doc.style.transform = "translate(0, 0) scale(1)"; 
        img_doc.style.opacity = "1";
    }, 50);

    // Cerrar al hacer clic fuera de la imagen
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) { // Solo cerrar si se hace clic fuera de la imagen
        // Animación de salida
        img_doc.style.transition = "transform 0.5s ease-in, opacity 0.5s ease-in";
        img_doc.style.transform = "translate(100%, -100%) scale(0.01)"; // Volver a la esquina superior izquierda
        img_doc.style.opacity = "0"; // Hacer invisible

        // Eliminar el overlay después de la animación de salida
        setTimeout(() => {
            overlay.remove();
            overlay = null; // Restablecer la variable al eliminar
        }, 500); // Duración de la animación
        }
    });
    });
}

export{eventforTopBar}