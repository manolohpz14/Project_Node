
  //2)-----------------------------Interfaz para los usuarios-----------------------------//

  function eventForUser (objeto_foto) {
    const usersLi = document.getElementById('usuarios');
    usersLi.addEventListener('click', function (e) {
        e.preventDefault(); // Evitar que el enlace se siga de forma predeterminada

        // Mostrar el calendario (si no está ya visible)
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML=""
        const grid=document.createElement("div")
        grid.classList.add("grid")
        grid.id="grid"
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "1fr"; // 1 columna
        mainContent.appendChild(grid)

        //2.1)Aquí se hace un fetch para recoger la info de los usuarios
        // const objeto = [
        // { Nombre: "Manolo", ult_conexion: "15:45" },
        // { Nombre: "Ana", edad: 20, ult_conexion: "16:30" },
        // { Nombre: "Luis", edad: 22, ult_conexion: "18:15" }
        // ];
        
        // const objeto_foto = [
        // { username: "Manolo", foto: "#" },
        // { username: "Ana", foto: "#" },
        // { username: "Luis", foto: "#" }
        // ];
        
        // 2.2) Aquí se itera sobre lo recogido en el fetch para crear dinamicamente las tarjetas con la info de cada usuario
        for (let i = 0; i < objeto_foto.length; i++) {
          const img = document.createElement("img");
          img.style.marginRight="1rem"
          const div = document.createElement("div");
          div.id="divUsuario"
          div.style.fontSize="0.8rem"
          div.style.margin="auto"
          div.style.width="100%"
          div.style.padding = "0.5rem"; // Espaciado interno
          //div.style.boxShadow="2px 2px 0px 0px rgba(0,0,0,0.1)"
          div.style.border="0.1rem solid rgba(202, 200, 200, 0.1)"
          div.style.borderRadius = "8px";
          div.style.backgroundColor = "#ffffff"
          div.style.marginTop = "1rem"
          
          // Combinar datos de ambos arrays
          const persona = objeto_foto[i];

          img.src=persona.foto
          img.style.borderRadius="50%"
          img.style.width="2.5rem"
          img.style.height="2.5rem"
          img.style.objectFit="cover"
          // Asegurarse de que ambos elementos existan
          if (persona) {
              div.innerHTML = `${persona.username} <span style="color:grey; font-size:0.7rem;
              margin-left:1rem">
              Ultima conexion: ${persona.ult_conexion}
              </span>`;
              div.style.display="flex"
              div.style.alignItems="center"
          }
          div.prepend(img)
          
          // Añadir el div a la cuadrícula
          grid.appendChild(div);
        }

    
    })
  }


export {eventForUser}


