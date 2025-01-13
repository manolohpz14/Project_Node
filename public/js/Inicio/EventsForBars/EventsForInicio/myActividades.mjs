
function eventforActivities (obj_actividades,upload_activity,get_all_activities_user,delete_activity_and_File,downloadFile) {

    document.querySelector("#ActivitiesDiv").addEventListener("click", async function() {
      let grid = document.querySelector(".grid");
      grid.style.transition = "transform 0.5s ease-out";
      grid.style.transform = "translateX(250vw)";
      grid.style.overflow = "hidden";

    

    // const obj_actividades=[
    // {Tema:"Tema 1",Color:"green", Actividad: "Actividad 1", Fecha_fin: "2024-12-23",  Fecha_creación: "2024-12-17", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T1Act1"},
    // {Tema:"Tema 1",Color:"green",  Actividad: "Actividad 2", Fecha_fin: "2024-12-27", Fecha_creación: "2024-12-20", Explicacion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T1Act2"},
    // {Tema:"Tema 2",Color:"blue",  Actividad: "Actividad 1", Fecha_fin: "2024-12-23", Fecha_creación: "2024-12-15", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T2Act1"},
    // {Tema:"Tema 2",Color:"blue", Actividad: "Actividad 1", Fecha_fin: "2025-01-20", Fecha_creación: "2024-12-13", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T2Act2"},
    // {Tema:"Tema 2",Color:"blue", Actividad: "Actividad 1", Fecha_fin: "2025-01-15", Fecha_creación: "2025-01-08", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T2Act3"},
    // {Tema:"Tema 3",Color:"orange", Actividad: "Actividad 1", Fecha_fin: "2025-02-20", Fecha_creación: "2025-02-13", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T3Act1"}]
  

    setTimeout(async () => {
      grid.innerHTML=""

      //1.6) Utilizamos el método reduce para crear un objeto ordenador para crear la interfaz
      const temasDivididos = obj_actividades.reduce((result, actividad) => {
        //  -- Crea una clave para el tema si no existe en el objeto acumulador
        if (!result[actividad.Tema]) {
            result[actividad.Tema] = []; // Inicializa la lista vacía
        }
        //  --Agrega la actividad correspondiente al array del tema
        result[actividad.Tema].push(actividad);
    
        return result; // Devuelve el objeto acumulador actualizado.
        }, {});



    
      const actividades_user = await get_all_activities_user();
      if (actividades_user) {
        console.log(actividades_user);
      }

      //1.7) Recorremos el objeto creado y ordenado para crear la interfaz
      Object.entries(temasDivididos).forEach(([tema, actividades]) => {

        //1.7.1) Añadimos un header h2 al grid por cada tema
        const temaHeader = document.createElement('h2');
        temaHeader.textContent = tema;
        temaHeader.style.color = 'rgb(0, 0, 0)';
        temaHeader.style.marginBottom = '1rem';
        temaHeader.style.fontSize = '2rem';
        grid.appendChild(temaHeader);
        
        //1.7.2) debajo del header correspondiente del tema creamos un div por cada actividad
        const actividadesContainer = document.createElement('div');
        actividadesContainer.style.marginBottom = '1.5rem';
    


        

        //1.8) Creamos y damos formato al div (se crea uno por actividad)
        actividades.forEach(actividad => {
            const actividadDiv = document.createElement('div');
            actividadDiv.style.cursor = 'pointer';
            actividadDiv.style.border = '1px solid #ddd';
            actividadDiv.style.borderRadius = '8px';
            actividadDiv.style.padding = '0.5rem';
            actividadDiv.style.marginBottom = '1.5rem';
            actividadDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            actividadDiv.style.transition = "height 0.4s linear, background-color 0.3s ease";
            actividadDiv.style.overflow = "hidden"; // Para evitar saltos visuales
            actividadDiv.style.height = "auto"
          //1.8.1) Inicialmente cada div tiene la siguiente info
          actividadDiv.innerHTML = `
          <p style="font-size: 1.1rem; margin-bottom:0.5rem; color: black">${actividad.Actividad}</p>
          <div id="basicInformation" style="font-size: 0.8rem;color: grey; margin-bottom:1rem">
              <p>Fecha de Creación: <span style="color: black;">${actividad.Fecha_creación || '-'}</span></p>
              <p>Fecha de Fin: <span style="color: black;">${actividad.Fecha_fin || '-'}</span></p>
              <p>Estado: <span class="estado" style="color: black;">Abrir para ver</span></p>
              
          </div>
      `;

            

          //1.8.2) Añadimos un evento de click a cada div de actividad, controlando cuando se abre para entregar y cuando se cierra
            actividadDiv.addEventListener("click", function(){
                const estadoSpan=actividadDiv.querySelector(".estado")
                const existingInteractionContainer = actividadDiv.querySelector(".interaction-container");
                console.log(existingInteractionContainer)
                if (existingInteractionContainer) {
                    const p_explicacion = actividadDiv.querySelector("#p_explicacion");
                    // || (estadoSpan.textContent==="Entregado")
                    if ((existingInteractionContainer.querySelector("textarea").value==="" && existingInteractionContainer.querySelector("#containerForSummary").innerHTML==="")
                      || (estadoSpan.textContent==="Entregado")) {

                      existingInteractionContainer.remove();
                      p_explicacion.remove()
                      const estadoSpan=actividadDiv.querySelector(".estado")
                      estadoSpan.textContent="Abrir para ver"
                      estadoSpan.style.color="rgba(0,0,0,1)"


                      setTimeout(() => {
                          actividadDiv.style.height = "auto";
                      }, 10);
                    return
                    }
                    else {
                      const confirmDelete = confirm("¿Estás seguro? Perderás la selección.");
                      if (confirmDelete) {
                          existingInteractionContainer.remove();
                          p_explicacion.remove();
                          setTimeout(() => {
                              actividadDiv.style.height ="auto";
                          }, 10);
                          const estadoSpan=actividadDiv.querySelector(".estado")
                          estadoSpan.textContent="Abrir para ver"
                          estadoSpan.style.color="rgba(0,0,0,1)"

                      }
                      return; // Salimos para evitar añadir otro interactionContainer}
                  
                  }
                }


                //1.8.3) Cada div tiene un interactionContainer, que contendrá el textarea para enviar comentarios y
                //los botones necesarios para realizar la entrega, además tendrá la clase ".interaction-container"
                const interactionContainer = document.createElement('div');
                //--Ojo, importante quitar la propagación para que el evento click de la propia actividad no afecte
                //al evento click de los botones


                interactionContainer.addEventListener("click", function(event){
                  event.stopPropagation();
                })
                //Añadimos la exlicacion de la actividad
                const p_explicacion = document.createElement("div");
                p_explicacion.style.textAlign = "left";
                p_explicacion.style.color = "grey";
                
                // Obtener el texto de la base de datos
                let expl = actividad.Explicacion;
                
                // Reemplazar los saltos de línea por etiquetas <br> para que sean visibles en el navegador
                expl = expl.replace(/\n/g, '<br>');
                
                // Aquí reemplazamos las URLs por enlaces clickeables
                const enlaceRegex = /(https?:\/\/[^\s]+)/g; // Expresión regular para encontrar URLs
                expl = expl.replace(enlaceRegex, (url) => {
                    return `<a href="${url}" target="_blank" style="color: blue; text-decoration: underline;">${url}</a>`;
                });
                
                // Insertar el texto con los saltos de línea y enlaces en el HTML
                p_explicacion.innerHTML = 'Explicacion: <span class="estado" style="color: black;">' + expl + '</span>';
                p_explicacion.id = "p_explicacion";
                p_explicacion.style.marginBottom = "1rem";
                p_explicacion.style.fontSize = "0.8rem";
                
                // Agregar el contenedor al DOM
                interactionContainer.append(p_explicacion);
                //--Indicamos que en contenedor interactionContainer es donde se debe agregar comentarios y archivos para la entrega
                interactionContainer.innerHTML+="<p id=encabezadoEntrega style='margin-bottom:1rem; color:grey'><u>Aqui debes hacer la entrega con comentarios</u></p>"
                
                //Le damos formato al iterarion container
                interactionContainer.classList.add("interaction-container");
                interactionContainer.style.backgroundColor = "rgb(255, 255, 255)";  
                interactionContainer.style.padding = '0.4rem';
                interactionContainer.style.marginTop = '1rem';
                interactionContainer.style.borderRadius = '0.6rem';
                interactionContainer.style.textAlign="center"

                //Creamos un textarea donde añadir comentarios
                const commentTextarea = document.createElement('textarea');
                commentTextarea.placeholder = 'Escribe un comentario...';
                commentTextarea.style.width = '100%';
                commentTextarea.style.height = '8rem';
                commentTextarea.style.marginBottom = '1rem';
                commentTextarea.style.padding = '0.8rem';
                commentTextarea.style.border = '1px solid #ddd';
                commentTextarea.style.borderRadius = '0.4rem';
                commentTextarea.style.resize = 'none';
                commentTextarea.style.fontSize="0.7rem"
                interactionContainer.appendChild(commentTextarea);


                //Creamos un "#containerForSummary" donde resumiremos el archivo y comentario entregado
                const previewContainer = document.createElement('div');
                previewContainer.id="containerForSummary"
                previewContainer.style.display = 'flex';
                previewContainer.style.flexDirection = 'column';
                previewContainer.style.gap = '0.8rem';
                interactionContainer.appendChild(previewContainer);

        
                //Creamos un buttonContainer que tendrá tres botones, enviar, borrar y agregar archivo
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.gap = '1rem';
                buttonContainer.style.justifyContent = 'flex-start';
                buttonContainer.style.marginTop = '1rem';
        
                const selectFileButton = document.createElement('button');
                selectFileButton.innerHTML = '&#128206;'; // Clip icon
                selectFileButton.title = 'Seleccionar archivo';
                selectFileButton.style.flex = '1';
                selectFileButton.style.padding = '0.8rem';
                selectFileButton.style.border = 'none';
                selectFileButton.style.fontSize = '1.4rem';
                selectFileButton.style.backgroundColor = '#e0e0e0';
                selectFileButton.style.borderRadius = '0.6rem';
                buttonContainer.appendChild(selectFileButton);
        
                const deleteFileButton = document.createElement('button');
                deleteFileButton.innerHTML = '&#128465;'; // Trash icon
                deleteFileButton.title = 'Borrar entrega';
                deleteFileButton.style.flex = '1';
                deleteFileButton.style.padding = '0.8rem';
                deleteFileButton.style.border = 'none';
                deleteFileButton.style.fontSize = '1.4rem';
                deleteFileButton.style.backgroundColor = '#e57373';
                deleteFileButton.style.color = '#fff';
                deleteFileButton.style.borderRadius = '0.6rem';
                buttonContainer.appendChild(deleteFileButton);
        
                const sendFileButton = document.createElement('button');
                sendFileButton.innerHTML = '&#11014;'; // Arrow up icon
                sendFileButton.title = 'Enviar entrega';
                sendFileButton.style.flex = '1';
                sendFileButton.style.padding = '0.8rem';
                sendFileButton.style.border = 'none';
                sendFileButton.style.fontSize = '1.4rem';
                sendFileButton.style.backgroundColor = '#81c784';
                sendFileButton.style.color = '#fff';
                sendFileButton.style.borderRadius = '0.6rem';
                buttonContainer.appendChild(sendFileButton);
        
                interactionContainer.appendChild(buttonContainer);


                let selectedFile = null;
        
                //1.9) Añadimos un evento click al botón de agregar achivo, que añadirá información a preview container
                selectFileButton.addEventListener('click', () => {
                  //Creamos un fileinput ficticio
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = 'image/*,application/pdf,application/zip,application/x-rar-compressed';
                    ;
                    fileInput.multiple = false
                    fileInput.name="achivo"
                    fileInput.style.display = 'none';
                    document.body.appendChild(fileInput);
        
                    fileInput.click();
        
                    //1.9.1) Añadimos un evento change sobre el input para agrgar archivo
                    fileInput.addEventListener('change', () => {
                        actividadDiv.style.height="auto"
                        if (fileInput.files.length > 0) {
                            selectedFile = fileInput.files[0];
                            previewContainer.innerHTML = '';
        
                            const filePreview = document.createElement('div');
                            filePreview.style.display = 'flex';
                            filePreview.style.alignItems = 'center';
                            filePreview.style.gap = '0.8rem';
        
                            const fileIcon = document.createElement('span');
                            fileIcon.style.fontSize = '1rem';
                            fileIcon.style.color = "grey";
                            fileIcon.textContent = selectedFile.type.startsWith('image/') ? '🖼️' : '📄';
        
                            const fileName = document.createElement('span');
                            fileName.textContent = selectedFile.name;
                            fileName.style.fontSize = '0.7rem';
                            filePreview.appendChild(fileIcon);
                            filePreview.appendChild(fileName);
        
                            previewContainer.appendChild(filePreview);
                        }
                        document.body.removeChild(fileInput);
                    });
                });
        

                //1.10) Añadimos un evento click al botón de borrar selección/borrar entrega de la bd
                //Aquí borraremos lo que hayamos entregado ya o borramos lo que estemos a punto de entregar (reseteo)
                deleteFileButton.addEventListener('click', async () => {
                  

                    if (confirm('¿Estás seguro de que quieres borrar la entrega?')) {
                      //Aqui debe ir un fetch que con un delete(borrar de la bd)
                      try{
                        await delete_activity_and_File(actividad.Actividad, actividad.Tema)
                        selectedFile = null;
                        previewContainer.innerHTML = '';
                        commentTextarea.value = '';
                        commentTextarea.style.display = 'block';
                        selectFileButton.style.display="block"
                        sendFileButton.style.display="block"
                        const estadoSpan = actividadDiv.querySelector('.estado');
                        estadoSpan.textContent = 'No entregado';
                        estadoSpan.style.color = 'red';
                        actividadDiv.style.height="auto"
                        interactionContainer.querySelector("#encabezadoEntrega").innerHTML="<u>Aqui debes hacer la entrega con comentarios</u>"
                      }
                      catch{
                        alert("No se ha podido borrar la actividad ahora mismo, intentelo mas tarde")

                      }
                  }
                });
        
                //1.11)Añadimos un evento click sobre el botón de enviar, que enviará info a la BD
                sendFileButton.addEventListener('click', async () => {
                    const comment = commentTextarea.value.trim();
                    if (selectedFile && comment) {
                        console.log(comment)
                        console.log(actividad.Actividad)
                        console.log(actividad.Tema)
                        try{
                          await upload_activity(selectedFile,comment, actividad.Actividad, actividad.Tema)
                          const estadoSpan = actividadDiv.querySelector('.estado');
                          estadoSpan.textContent = 'Entregado';
                          estadoSpan.style.color = 'green';
                          previewContainer.style.textAlign="left"
          
                          previewContainer.innerHTML = `
                              <div id=downloadFile style="display: flex; align-items: center; gap: 0.6rem;">
                                  <span style="font-size:0.8rem">Archivo: </span><span style="font-size: 1.2rem;">${selectedFile.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                                  <span style="font-size:0.8rem;color:grey ;word-break: break-all"><strong>${selectedFile.name}</strong></span>
                              </div>
                              <p style="font-size:0.8rem;color:grey"><strong style="color:black">Comentario:</strong> ${comment}</p>
                          `;

                        //   previewContainer.innerHTML = `
                        //   <div id="downloadFile" style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; margin-bottom: 10px;">
                        //     <span style="font-size: 0.8rem;">Archivo: </span>
                        //     <span style="font-size: 1.2rem; color: grey;">
                        //       ${selectedFile.type.startsWith('image/') ? '🖼️' : '📄'}
                        //     </span>
                        //     <span style="font-size: 0.8rem; color: grey; word-break: break-all;">
                        //       <strong>${selectedFile.name}</strong>
                        //     </span>
                        //   </div>
                        //   <p style="font-size: 0.8rem; color: grey; word-wrap: break-word; margin-top: 5px;">
                        //     <strong style="color: black;">Comentario:</strong> ${comment}
                        //   </p>
                        // `;
                        

                          commentTextarea.style.display = 'none';
                          sendFileButton.style.display="none"
                          selectFileButton.style.display="none"
                          actividadDiv.style.height="auto"
                          interactionContainer.querySelector("#encabezadoEntrega").innerHTML="<u>Entrega realizada</u>"

                          if (previewContainer.querySelector('#downloadFile')) {
                            const sendExcerciseElement = previewContainer.querySelector('#downloadFile');
                            sendExcerciseElement.addEventListener('click', async (event) => {
                              event.stopPropagation()
                              await downloadFile(actividad.Actividad,actividad.Tema)
                            })
                          }
                        }
                        catch {
                          alert("error al subir el archivo, intentalo de nuevo")
                        }
                        // Aquí debería ir el fetch.
                    } else {
                        alert('Por favor, selecciona un archivo y escribe un comentario antes de enviar.');
                    }
                });

                if (actividades_user.message) {
                  console.log("no hay avtividades que mostrar")
                }



                else if (actividades_user.some(entrega => entrega.Actividad === actividad.Actividad && entrega.Tema === actividad.Tema)) {
                  const entrega = actividades_user.find(entrega => entrega.Actividad === actividad.Actividad);


                  const estadoSpan = actividadDiv.querySelector('.estado');
                  estadoSpan.textContent = 'Entregado';
                  estadoSpan.style.color = 'green';
                  previewContainer.style.textAlign="left"

                  previewContainer.innerHTML = `
                  <div id=downloadFile style="display: flex; align-items: center; gap: 0.6rem;">
                      <span style="font-size:0.8rem">Archivo: </span><span style="font-size: 1.2rem;">${entrega.Nombre_archivo.startsWith('image/') ? '🖼️' : '📄'}</span>
                      <span style="font-size:0.8rem;color:grey ;word-break: break-all"><strong>${entrega.Nombre_archivo}</strong></span>
                  </div>
                  <p style="font-size:0.8rem;color:grey"><strong style="color:black">Comentario:</strong> ${entrega.Comentarios}</p>
              `;
              
                //   previewContainer.innerHTML = `
                //   <div id="downloadFile" style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; margin-bottom: 10px;">
                //     <span style="font-size: 0.8rem;">Archivo: </span>
                //     <span style="font-size: 1.2rem; color: grey;">
                //       ${entrega.Nombre_archivo.startsWith('image/') ? '🖼️' : '📄'}
                //     </span>
                //     <span style="font-size: 0.8rem; color: grey; word-wrap: break-word;">
                //       <strong>${entrega.Nombre_archivo}</strong>
                //     </span>
                //   </div>
                //   <p style="font-size: 0.8rem; color: grey; word-wrap: break-word; margin-top: 5px;">
                //     <strong style="color: black;">Comentario:</strong> ${entrega.Comentarios}
                //   </p>
                // `;
                
                  if (previewContainer.querySelector('#downloadFile')) {
                    const sendExcerciseElement = previewContainer.querySelector('#downloadFile');
                    sendExcerciseElement.addEventListener('click', async (event) => {
                      event.stopPropagation()
                      await downloadFile(actividad.Actividad,actividad.Tema)
                    })
                  }

                  commentTextarea.style.display = 'none';
                  sendFileButton.style.display="none"
                  selectFileButton.style.display="none"
                  actividadDiv.style.height="auto"
                  interactionContainer.querySelector("#encabezadoEntrega").innerHTML="<u>Entrega realizada</u>"

                  //Aqui se añade un addevent listener al boton para borrar de la db la entrega
                  
                }

                else {
                  const estadoSpan = actividadDiv.querySelector('.estado');
                  estadoSpan.textContent = 'No entregado';
                  estadoSpan.style.color = 'red';
                }

              
              //1.14)Por último pero no menos importante de este primer punto, añadimos
              //La animación al preview container
              const initialHeight = actividadDiv.offsetHeight;
              actividadDiv.appendChild(interactionContainer);
              const newHeight = actividadDiv.offsetHeight;


              actividadDiv.style.height = `${initialHeight}px`;
              setTimeout(() => {
                  actividadDiv.style.height = newHeight+"px";
              }, 10);

              
            })

            //Añadimos al div de actividades con nuestro div de la actividad
            actividadesContainer.appendChild(actividadDiv);
        });

        //Añadimos al grid nuestro único div con todas las actividades
        grid.appendChild(actividadesContainer);
    });
    grid.style.transform = "";
  },250)

  })

}





export{eventforActivities}