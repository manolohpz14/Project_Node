



//3)----------------------------Interfaz para el calendario------------------------------


function eventForCalendar (obj_actividades, create_activities_admin) {
    const monthsLi = document.getElementById('months'); // Obtener el <li> de "Calendario"
    monthsLi.addEventListener('click', function (e) {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
        // if  (window.innerWidth<950) {
        // document.getElementById('toggle-sidebar-top').click()
        // }

        //3.1) Se hace un fetch para obtener las actividades que están creadas y poder señalarlas en el calendario
        // const obj_actividades=[
        //     {Tema:"Tema 1",Color:"green", Actividad: "Actividad 1", Fecha_fin: "2024-12-23",  Fecha_creación: "2024-12-17", Abreviacion:"T1Act1"},
        //     {Tema:"Tema 1",Color:"green",  Actividad: "Actividad 2", Fecha_fin: "2024-12-27", Fecha_creación: "2024-12-20",Abreviacion:"T1Act2"},
        //     {Tema:"Tema 2",Color:"blue",  Actividad: "Actividad 1", Fecha_fin: "2024-12-23", Fecha_creación: "2024-12-15",Abreviacion:"T2Act1"},
        //     {Tema:"Tema 2",Color:"blue", Actividad: "Actividad 1", Fecha_fin: "2025-01-20", Fecha_creación: "2024-12-13",Abreviacion:"T2Act2"},
        //     {Tema:"Tema 2",Color:"blue", Actividad: "Actividad 1", Fecha_fin: "2025-01-15", Fecha_creación: "2025-01-08",Abreviacion:"T2Act3"},
        //     {Tema:"Tema 3",Color:"orange", Actividad: "Actividad 1", Fecha_fin: "2025-02-20", Fecha_creación: "2025-02-13",Abreviacion:"T3Act1"}]
        e.preventDefault(); // Evitar que el enlace se siga de forma predeterminada

        // Inicializar los botones de navegación si aún no existen
        if (!document.getElementById('nav-container')) {
            initNavButtons(obj_actividades);
        }

        // Mostrar las tarjetas correspondientes SOLO del mes actual
        createCardsForMonth(obj_actividades);

    });


    const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]; // Días de la semana
    let currentDate = new Date(); // Fecha actual
    let currentMonth = currentDate.getMonth(); // Obtén el mes actual (0-11)
    let currentYear = currentDate.getFullYear(); // Obtén el año actual


    // Función para obtener los días del mes
    function getDaysInMonth(month, year) {
        const date = new Date(year, month + 1, 0); // Fecha para el último día del mes
        return date.getDate(); // Devuelve el número de días del mes
    }

    //3.2)Función que limpia el grid, crea los botones y añade dinñamicamente una clase a cada uno de los NUEVOS elementos
    //del grid (los días) con un setTimeout para que se produzca una animación al moverse a la izquierda o a la derecha
    function initNavButtons(obj_actividades) {
    const grid = document.querySelector('.grid');
    grid.innerHTML=""
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = "";
    mainContent.appendChild(grid);

    // Crear el contenedor de los botones
    const navContainer = document.createElement('div');
    navContainer.id = 'nav-container';
    navContainer.style.textAlign="center"

    // Crear el encabezado para mostrar el mes y el año
    const monthHeader = document.createElement('h2');
    monthHeader.id = 'month-header';
    navContainer.appendChild(monthHeader); // Agregar el encabezado al contenedor

    // Crear el contenedor de botones
    const navContainer_buttons = document.createElement('div');
    navContainer_buttons.id = 'nav-container-buttons';
    navContainer_buttons.style.display="flex"
    navContainer_buttons.style.justifyContent="space-between"


    // Crear el botón de anterior
    const prevButton = document.createElement('button');
    prevButton.style.padding = "0.2rem";
    prevButton.style.backgroundColor = "#ffffff"; // Azul bonito
    prevButton.style.color = "rgb(0, 0, 0)"; // Texto blanco
    prevButton.style.boxShadow="1px 1px 8px 0px rgb(192, 192, 192)"
    prevButton.style.border = "none";
    prevButton.style.borderRadius = "5px";
    prevButton.style.cursor = "pointer";
    prevButton.style.fontSize = "1rem";
    prevButton.style.display = "flex"; // Para usar flexbox
    prevButton.style.justifyContent = "center"; // Centra horizontalmente
    prevButton.style.alignItems = "center"; // Centra verticalmente
    prevButton.style.textAlign = "center"; // Asegurar que el texto está centrado
    prevButton.id = 'prev-month';

    // Crear el ícono y texto
    const icon = document.createElement('i');
    icon.className = "fa-solid fa-arrow-left"; // Clase para el ícono de Font Awesome
    icon.style.marginRight = "0.5rem"; // Espaciado entre ícono y texto

    const text = document.createTextNode("Anterior"); // Texto del botón

    // Agregar el ícono y texto al botón
    prevButton.appendChild(icon);
    prevButton.appendChild(text);

    // Crear el botón de "Mes Siguiente"
    const nextButton = document.createElement('button');
    nextButton.style.padding = "0.2rem";
    nextButton.style.backgroundColor = "#ffffff"; // Azul bonito
    nextButton.style.color = "rgb(0, 0, 0)"; // Texto blanco
    nextButton.style.boxShadow="1px 1px 8px 0px rgb(192, 192, 192)"
    nextButton.style.border = "none";
    nextButton.style.borderRadius = "5px";
    nextButton.style.cursor = "pointer";
    nextButton.style.fontSize = "1rem";
    nextButton.style.display = "flex"; // Para usar flexbox
    nextButton.style.justifyContent = "center"; // Centra horizontalmente
    nextButton.style.alignItems = "center"; // Centra verticalmente
    nextButton.style.textAlign = "center"; // Asegurar que el texto está centrado
    nextButton.id = 'next-month';

    const icon_r = document.createElement('i');
    icon_r.className = "fa-solid fa-arrow-right"; // Clase para el ícono de Font Awesome
    icon_r.style.marginLeft = "0.5rem"; // Espaciado entre ícono y texto

    const text_r = document.createTextNode("Siguiente"); // Texto del botón

    nextButton.appendChild(text_r);
    nextButton.appendChild(icon_r);
    
    //Añadir formulario administrador

    const parent = grid.parentElement; // selecciona el div padre

    // Crear botón
    const createBtn = document.createElement('button');
    createBtn.textContent = "Crear nueva actividad";
    createBtn.style.margin = "1rem auto";
    createBtn.style.display = "block";
    createBtn.style.padding = "0.5rem 1rem";
    createBtn.style.fontSize = "1rem";
    createBtn.style.cursor = "pointer";
    createBtn.style.backgroundColor = "#4CAF50";
    createBtn.style.color = "white";
    createBtn.style.border = "none";
    createBtn.style.borderRadius = "5px";

    
    // Crear contenedor del formulario (inicialmente oculto)
    const formContainer = document.createElement('div');
    formContainer.style.display = "none";
    formContainer.style.marginTop = "1rem";
    formContainer.style.padding = "1rem";
    formContainer.style.border = "1px solid #ccc";
    formContainer.style.borderRadius = "5px";
    formContainer.style.backgroundColor = "#f9f9f9";

    // Formulario
    formContainer.innerHTML = `
        <style>
        .activity-form {
            display: flex;
            flex-direction: column;
            gap: 1rem; /* espacio entre elementos */
            margin: auto; /* centra en el contenedor */
            padding: 1rem;
            background: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            font-family: sans-serif;
        }
    
        .activity-form label {
            display: flex;
            flex-direction: column;
            font-weight: 600;
            font-size: 0.9rem;
        }
    
        .activity-form input,
        .activity-form textarea {
            margin-top: 0.3rem;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 0.9rem;
        }
    
        .activity-form textarea {
            resize: vertical;
            min-height: 80px;
        }
    
        .activity-form button {
            background-color: #2196F3;
            color: white;
            padding: 0.7rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
        }
    
        .activity-form button:hover {
            background-color: #1976D2;
        }
    
        /* Responsivo */
        @media (max-width: 480px) {
            .activity-form {
            max-width: 100%;
            padding: 0.8rem;
            }
        }
        </style>
    
        <form class="activity-form">
        <h3>Crear Actividad</h3>
        <label>Tema:
            <input type="text" id="tema" required>
        </label>
        <label>Color:
            <input type="color" id="color" value="#000000">
        </label>
        <label>Actividad:
            <input type="text" id="actividad" required>
        </label>
        <label>Fecha fin:
            <input type="date" id="fecha_fin" required>
        </label>
        <label>Abreviación:
            <input type="text" id="abreviacion" required>
        </label>
        <label>Explicación:
            <textarea id="explicacion"></textarea>
        </label>
        <button id="submitActivity">Crear</button>
        </form>
    `;
  

    parent.prepend(formContainer);

    // Mostrar/ocultar formulario al hacer click en el botón
    createBtn.addEventListener('click', () => {
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
        grid.style.display = grid.style.display === 'none' ? 'grid' : 'none';
    });

    // Enviar formulario
    formContainer.querySelector('#submitActivity').addEventListener('click', async () => {
        const newActivity = {
            Tema: document.getElementById('tema').value,
            Color: document.getElementById('color').value,
            Actividad: document.getElementById('actividad').value,
            Fecha_fin: document.getElementById('fecha_fin').value,
            Abreviacion: document.getElementById('abreviacion').value,
            Explicacion: document.getElementById('explicacion').value
        };

        const result = await create_activities_admin(newActivity);

        // Mostrar resultado o error dentro del formulario
        if (result.error) {
            formContainer.innerHTML += `<p style="color:red;">Error: ${result.error}</p>`;
        } else {
            formContainer.innerHTML += `<p style="color:green;">Actividad creada correctamente (${result.count})</p>`;
            // Opcional: resetear campos
            formContainer.querySelectorAll('input, textarea').forEach(input => input.value = '');
            formContainer.style.display = 'none';
        }
        
    });

    // Agregar los botones al contenedor
    navContainer_buttons.appendChild(prevButton);
    navContainer_buttons.appendChild(nextButton);
    navContainer_buttons.appendChild(createBtn);


    navContainer.appendChild(navContainer_buttons);

    // Agregar el contenedor de botones al principio del mainContent
    mainContent.prepend(navContainer);

    // Añadir los event listeners que resta un mes al actual y añade la clase slide-left
    prevButton.addEventListener('click', function () {
        currentMonth--; // Cambiar al mes anterior
        if (currentMonth < 0) {
            currentMonth = 11; // Si es enero, volver a diciembre
            currentYear--; // Y restar un año
        }
        let divs=document.querySelectorAll(".grid-item")
        divs.forEach(function(item){
            item.classList.add("slide-left")
        })
        setTimeout(()=>{createCardsForMonth(obj_actividades)}, 300)
    });

    // Añadir los event listeners que suma un mes al actual y añade la clase slide-right
    nextButton.addEventListener('click', function () {
        currentMonth++; // Cambiar al mes siguiente
        if (currentMonth > 11) {
            currentMonth = 0; // Si es diciembre, volver a enero
            currentYear++; // Y sumar un año
        }
        let divs=document.querySelectorAll(".grid-item") //En este punto los divs ya estan creados, luego se aplica la animación
        divs.forEach(function(item){
            item.classList.add("slide-right")
        })
        setTimeout(()=>{createCardsForMonth(obj_actividades)}, 300)
    });
    }

    //3.3) Función que crea las tarjetas del mes
    function createCardsForMonth(obj_actividades) {
        const grid = document.querySelector('.grid');
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(7, 1fr)"; // 7 columnas iguales
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // Día de la semana del primer día del mes

        // Limpiar la cuadrícula antes de agregar nuevas tarjetas
        grid.innerHTML = '';

        // Añadir los días de la semana en la primera fila
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.style.textAlign = "center";
            dayHeader.textContent = day; // Muestra el nombre del día
            grid.appendChild(dayHeader);
        });

        // Crear las tarjetas vacías para llenar los días antes del primer día del mes
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.height = "8rem";
            grid.appendChild(emptyDiv);
        }

        // Crear las tarjetas para cada día del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const card = document.createElement('div');
            card.classList.add('grid-item');
            card.style.height = "8rem";
            card.style.textAlign = "center";
            card.style.position = "relative";
            card.textContent = day; // Muestra el día en la tarjeta

            // Buscar actividades que coincidan con este día
            //'2025-01-12' ESTE ES EL FORMATO
            const currentDate = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
            obj_actividades.forEach(actividad => {
                if (actividad.Fecha_fin === currentDate) {
                    // Crear botón para la actividad
                    const activityButton = document.createElement('button');
                    activityButton.textContent = actividad.Abreviacion;
                    activityButton.style.fontSize="0.7rem"
                    activityButton.classList.add("activityButton")

                    // Estilos del botón
                    activityButton.style.display = "inline-block"; // Para mantener el flujo del documento
                    activityButton.style.margin = "0.1rem 0"; // Espaciado entre botones
                    activityButton.style.backgroundColor = actividad.Color; // Azul bonito
                    activityButton.style.color = "black"; // Texto blanco
                    activityButton.style.border = "none"; // Sin bordes
                    activityButton.style.borderRadius = "0.6rem"; // Bordes redondeados
                    activityButton.style.padding = "0.2rem 0.3rem"; // Tamaño del botón
                    activityButton.style.cursor = "pointer"; // Indicador de clic
                    

                    // Agregar funcionalidad al botón (puedes personalizarlo)
                    activityButton.addEventListener('click', () => {
                        alert(`Actividad: ${actividad.Actividad}`);
                    });
                    card.style.display="flex"
                    card.style.alignItems="center"
                    card.style.flexDirection="column"
                    // Añadir el botón al día correspondiente
                    card.appendChild(activityButton);
                }
            });

            grid.appendChild(card);
        }

        // Actualizar el encabezado del mes
        const monthHeader = document.getElementById('month-header');
        if (monthHeader) {
            monthHeader.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }
    }


  

}

export {eventForCalendar}