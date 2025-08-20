import { eventforInicio } from "./EventsForBars/myInicio.mjs";
import { eventForCalendar } from "./EventsForBars/myCalendar.mjs";
import { eventForUser } from "./EventsForBars/myUsers.mjs";
import { eventForStats } from "./EventsForBars/myCharts.mjs";
import { eventforTopBar } from "./EventsForBars/myTopBar.mjs";
import {getCookie, get_all_photo,last_conexion,get_all_messages,upload_message,set_full_time_at_page,
  get_full_time_at_page,get_all_activities,upload_activity,get_all_activities_user,
  deleteActivityAndFile,downloadFile, upload_answer} from "./Fetchs/fetchs.mjs"
import Chart from 'chart.js/auto'


document.addEventListener("DOMContentLoaded", async function(){

  
  let open_bar = true; // Estado de visibilidad del sidebar
  //handleSidebarContent()
  initSidebarResponsive();
  
  const username=getCookie("username")


  //-------------------HAGO TODOS LOS FETCHS-------------------------
  await last_conexion();
  
  //paso a recoger la info de las fotos y la ultimas conexiones de los usuarios
  const photosArray = await get_all_photo();
    if (photosArray) {
      console.log(photosArray); // Aquí tienes acceso a photosArray
    }


  const obj_actividades = await get_all_activities();
    if (obj_actividades) {
      console.log(obj_actividades); // Aquí tienes acceso a photosArray
    }

  
  
  //------------Eventos que no dependen del SideBar---------------------
  set_full_time_at_page();
  eventforTopBar(username,photosArray)






  //--------------Aqui meto los addeventListeners de cada sideBar-------------
  function my_listeners_sidebar(){
    eventforInicio(upload_message, upload_answer, photosArray, get_all_messages, 
      obj_actividades,username,upload_activity,get_all_activities_user,
      deleteActivityAndFile,downloadFile)
    eventForCalendar(obj_actividades)
    eventForUser(photosArray)
    eventForStats(Chart,get_full_time_at_page)

  }



  my_listeners_sidebar() //lo ejecuto para añadir todos los addeventlistener al código






  //-------------------Media Query en JS-----------------------//
  function initSidebarResponsive() {
    const sidebar = document.getElementById('sidebar');
    const central_content = document.querySelector('.central_content');
    const mediaQuery = window.matchMedia('(max-width: 950px)');
    let mainContent = document.querySelector('.main-content');

    const handleSidebarMode = (e) => {
        if (e.matches && open_bar==false) {
            // Pantalla menor de 950px
            sidebar.classList.add('horizontal');
            central_content.classList.add('vertical')
            mainContent.classList.add('expanded'); 
        } else if (!e.matches && open_bar==false) {
            // Pantalla mayor o igual a 950px
            sidebar.classList.remove('horizontal');
            central_content.classList.remove('vertical')
            mainContent.classList.add('expanded'); 
        }
        else if (e.matches && open_bar==true) {
          // Pantalla mayor o igual a 950px
          sidebar.classList.add('horizontal');
          central_content.classList.add('vertical')
          mainContent.classList.add('expanded'); 
          mainContent.classList.add('margin_top')
      }
      else if (!e.matches && open_bar==true) {
        // Pantalla mayor o igual a 950px
        sidebar.classList.remove('horizontal');
        central_content.classList.remove('vertical')
        mainContent.classList.remove('expanded'); 
        mainContent.classList.remove('margin_top')
    }

    };

    // Ejecuta la función al cargar la página
    handleSidebarMode(mediaQuery);

    // Escucha los cambios de la media query
    mediaQuery.addEventListener('change', handleSidebarMode);
}

// Llama a la función cuando necesites inicializar










//-------------------Barra lateral ajustar según media-Query-----------------------// 
function toggleSidebar() {
  const mediaQuery = window.matchMedia('(max-width: 950px)')

  if (!mediaQuery.matches && open_bar === true) {
    let sidebar = document.getElementById('sidebar');
    let mainContent = document.querySelector('.main-content');
    sidebar.classList.add('hidden_left');
    mainContent.classList.add('expanded'); // Expande el contenido principal
    open_bar=false // Agrega la clase para ocultar el sidebar
  } else if (!mediaQuery.matches && open_bar==false) {
    let sidebar = document.getElementById('sidebar');
    let mainContent = document.querySelector('.main-content');
    sidebar.classList.remove('hidden_left');
    sidebar.classList.remove('hidden_up');
    mainContent.classList.remove('expanded');
    open_bar=true// Remueve la clase para hacerlo visible
  }
  //lo voy a cerrar,t engo que dejar expended y quitar horizontal
  else if (mediaQuery.matches && open_bar==true) {
    let sidebar = document.getElementById('sidebar');
    let mainContent = document.querySelector('.main-content');
    sidebar.classList.add('hidden_up');
    mainContent.classList.add('expanded'); // Expande el contenido principal
    mainContent.classList.remove('margin_top')
    open_bar=false // Agrega la clase para ocultar el sidebar
  }
  //lo voy a abrir, tengo que dejar expanded y tengo que dejar horixontal
  else {
    let sidebar = document.getElementById('sidebar');
    let mainContent = document.querySelector('.main-content');
    sidebar.classList.remove('hidden_left');
    sidebar.classList.remove('hidden_up');
    mainContent.classList.add('expanded');
    mainContent.classList.add('margin_top')
    open_bar=true// Remueve la clase para hacerlo visible

  }
  }


    // Añadir los eventos de click para mostrar u ocultar la barra lateral
document.getElementById('toggle-sidebar-top').addEventListener('click', toggleSidebar)
//-------------------Barra lateral ajustar según media-Query-----------------------// 
  

const inicio = document.querySelector('#inicio');
inicio.click()




});



//Despliegue de usuarios
//Desliegue de usuarios


