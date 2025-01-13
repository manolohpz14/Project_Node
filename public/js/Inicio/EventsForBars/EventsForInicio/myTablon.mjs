function eventforTablon(upload_message, objeto_foto, get_all_messages, nombre_usuario) {
  document.querySelector("#TablonDiv").addEventListener("click", async function () {
    const objeto = await get_all_messages();
    if (objeto) {
      console.log(objeto); // Aquí tienes acceso a photosArray
    }
    let grid = document.querySelector(".grid");
    grid.style.transition = "transform 0.5s ease-out";
    grid.style.transform = "translateX(-250vw)";
    grid.style.overflow = "hidden";

    setTimeout(() => {
      const tablondiv = document.querySelector("#TablonDiv");
      tablondiv.style.borderBottom = "0.3rem solid rgb(0, 136, 255)";
      tablondiv.style.backgroundColor = "rgb(224, 238, 249)";
      const grid = document.querySelector(".grid");
      grid.innerHTML = "";
      grid.style.gridTemplateColumns = "1fr"; // Solo una columna
      grid.style.gridAutoRows = "auto"; // Altura automática para las filas

      //----------------Pintar Casilla para publicar mensajes----------------
      const img = document.createElement("img");
      img.style.marginRight = "1rem";
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.padding = "1rem"; // Espaciado interno
      div.style.border = "1px solid #ccc";
      div.style.borderRadius = "8px";

      // Usar la función para obtener el valor de "username"
      const username = nombre_usuario;
      console.log(username);

      // Asegurarse de que ambos elementos existan
      if (username) {
        console.log("holaa");
        const div_conatainer = document.createElement("div");
        const div_2 = document.createElement("div");
        const etiqueta_p_2 = document.createElement("p");
        etiqueta_p_2.textContent = `${username}`;
        div_2.append(etiqueta_p_2);
        const fotousername = objeto_foto.find((f) => f.username === username);
        if (fotousername) {
          img.src = fotousername.foto; // Foto encontrada
        } else {
          img.src = "./img/anonimo.jpg"; // Imagen predeterminada
        }
        img.style.borderRadius = "50%";
        img.style.width = "2.5rem";
        img.style.height = "2.5rem";
        img.style.objectFit = "cover";

        div_conatainer.prepend(img);
        div_conatainer.append(div_2);
        div_conatainer.style.display = "flex";
        div.append(div_conatainer);
      }
      const textarea = document.createElement("textarea");
      textarea.style.width = "100%";
      textarea.style.resize = "none"; // Evitar que el usuario redimensione el textarea
      textarea.style.marginTop = "1rem";
      textarea.style.color = "rgb(72, 72, 72)";
      textarea.style.borderColor = "rgb(229, 229, 229)";
      textarea.style.height = "5rem"; // Ajustar altura inicial
      textarea.style.fontSize = "1rem";
      textarea.style.lineHeight = "1.5rem";
      textarea.placeholder = "Escribe aquí...";

      // Evento para manejar Shift + Enter
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault(); // Prevenir comportamiento por defecto
          textarea.value += "\n"; // Agregar salto de línea
        }
      });

      // Colocar el cursor al principio del textarea
      textarea.addEventListener("focus", () => {
        textarea.selectionStart = 0;
        textarea.selectionEnd = 0;
      });

      div.append(textarea);

      const publicarBtn = document.createElement("button");
      publicarBtn.textContent = "Publicar";
      publicarBtn.style.padding = "0.2rem";
      publicarBtn.style.backgroundColor = "#007BFF"; // Azul bonito
      publicarBtn.style.color = "#fff"; // Texto blanco
      publicarBtn.style.border = "none";
      publicarBtn.style.borderRadius = "5px";
      publicarBtn.style.cursor = "pointer";
      publicarBtn.style.fontSize = "1rem";
      publicarBtn.style.marginTop = "1rem";
      publicarBtn.style.display = "flex"; // Para usar flexbox
      publicarBtn.style.justifyContent = "center"; // Centra horizontalmente
      publicarBtn.style.alignItems = "center"; // Centra verticalmente
      publicarBtn.style.textAlign = "center";

      // Hover efecto para el botón
      publicarBtn.addEventListener("mouseover", () => {
        publicarBtn.style.backgroundColor = "#0056b3"; // Azul más oscuro al pasar el mouse
      });
      publicarBtn.addEventListener("mouseout", () => {
        publicarBtn.style.backgroundColor = "#007BFF"; // Regresar al color original
      });

      publicarBtn.style.width = "5rem";
      publicarBtn.textAlign = "center";

      publicarBtn.addEventListener("click", async () => {
        const valor_texto = document.querySelector("textarea").value;
        const now = new Date();

        // Obtener partes de la fecha
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Mes (0-11) +1 y rellenar con 0 si es necesario
        const day = String(now.getDate()).padStart(2, "0"); // Día del mes

        // Obtener partes de la hora
        const hours = String(now.getHours()).padStart(2, "0"); // Horas
        const minutes = String(now.getMinutes()).padStart(2, "0"); // Minutos
        const seconds = String(now.getSeconds()).padStart(2, "0"); // Segundos

        const fecha_mensaje = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

        const objeto_example = [
          { username: username, texto: valor_texto, fecha_anuncio: fecha_mensaje },
        ];

        try {
          // Intentar subir el mensaje a la base de datos
          await upload_message(objeto_example[0]);
          pintar(objeto_example, objeto_foto); // Pintar el mensaje si se sube correctamente
          document.querySelector("textarea").value = ""; // Limpiar el textarea
        } catch {
          // Crear el mensaje de error
          let errorMsg = document.querySelector("#error-message");
          if (!errorMsg) {
            errorMsg = document.createElement("p");
            errorMsg.id = "error-message";
            errorMsg.textContent = "Error en publicar el mensaje";
            errorMsg.style.color = "red";
            errorMsg.style.marginTop = "1rem";
            div.append(errorMsg); // Añadir el mensaje de error al DOM
          }
        }

        // Agregar un evento para eliminar el mensaje de error al hacer clic en el textarea
        const textarea = div.querySelector("textarea");
        textarea.addEventListener("click", () => {
          const errorMsg = div.querySelector("#error-message");
          if (errorMsg) {
            errorMsg.remove(); // Eliminar el mensaje de error
          }
        });
      });

      div.append(publicarBtn);
      div.id = "new-message";
      grid.prepend(div);
      const div_messages = document.createElement("div");
      div_messages.id = "content-messages";
      grid.append(div_messages);

      // Función que pinta todos los mensajes de una lista y los pone en pantalla
      function pintar(objeto, objeto_foto) {
        // Iterar sobre los datos y generar las tarjetas
        for (let i = 0; i < objeto.length; i++) {
          const div = document.createElement("div");
          div.style.backgroundColor = "rgb(255, 255, 255)";
          div.style.padding = "1rem"; // Espaciado interno
          div.style.border = "1px solid #ccc";
          div.style.borderRadius = "8px";

          // Obtener datos del usuario actual
          const persona = objeto[i];
          let foto;

          // Buscar si hay coincidencia en objeto_foto
          const fotoEncontrada = objeto_foto.find((f) => f.username === persona.username);
          if (fotoEncontrada) {
            foto = fotoEncontrada.foto; // Foto encontrada
          } else {
            foto = "./img/anonimo.png"; // Imagen predeterminada
          }

          // Crear elementos para la tarjeta
          const img = document.createElement("img");
          img.src = foto; // Usar foto encontrada o predeterminada
          img.style.borderRadius = "50%";
          img.style.width = "2.5rem";
          img.style.height = "2.5rem";
          img.style.objectFit = "cover";
          img.style.marginRight = "1rem";

          const div_container = document.createElement("div");
          const div_2 = document.createElement("div");
          const etiqueta_p_2 = document.createElement("p");
          const etiqueta_p_3 = document.createElement("p");

          etiqueta_p_2.textContent = `${persona.username}`;
          etiqueta_p_3.textContent = `${persona.fecha_anuncio}`;
          etiqueta_p_3.style.fontSize = "0.8rem";
          etiqueta_p_3.style.color = "rgb(100, 100, 100)";

          div_2.append(etiqueta_p_2);
          div_2.append(etiqueta_p_3);

          div_container.prepend(img);
          div_container.append(div_2);
          div_container.style.display = "flex";
          div.append(div_container);

          const texto = document.createElement("p");
          texto.style.marginTop="1rem"
          texto.textContent = persona.texto;
          div.append(texto);

          div.id = "content-message";
          div.style.marginTop = "1rem";

          // Insertar la tarjeta al contenedor principal
          const div_messages = document.querySelector("#content-messages");
          div_messages.prepend(div);
        }
      }
      grid.style.transform = "";

      pintar(objeto, objeto_foto);
    }, 500);
    
  });
}

export { eventforTablon };
