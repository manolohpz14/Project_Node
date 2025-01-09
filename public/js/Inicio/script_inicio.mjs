import { eventforInicio } from "./EventsForBars/myInicio.mjs";
import { eventForCalendar } from "./EventsForBars/myCalendar.mjs";
import { eventForUser } from "./EventsForBars/myUsers.mjs";
import { eventForStats } from "./EventsForBars/myCharts.mjs";
import { eventforTopBar } from "./EventsForBars/myTopBar.mjs";
import {getCookie, get_all_photo,last_conexion,get_all_messages,upload_message,set_full_time_at_page,
  get_full_time_at_page,get_all_activities,upload_activity,get_all_activities_user,deleteActivityAndFile} from "./Fetchs/fetchs.mjs"
import Chart from 'chart.js/auto'


document.addEventListener("DOMContentLoaded", async function(){ 


  const username=getCookie("username")


  //-------------------HAGO TODOS LOS FETCHS-------------------------
  await last_conexion();
  
  //paso a recoger la info de las fotos y la ultimas conexiones de los usuarios
  const photosArray = await get_all_photo();
    if (photosArray) {
      console.log(photosArray); // Aquí tienes acceso a photosArray
    }

  const mensajes = await get_all_messages();
    if (mensajes) {
      console.log(mensajes); // Aquí tienes acceso a photosArray
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
    eventforInicio(upload_message,photosArray,mensajes, obj_actividades,username,upload_activity,get_all_activities_user,deleteActivityAndFile)
    eventForCalendar(obj_actividades)
    eventForUser(photosArray)
    eventForStats(Chart,get_full_time_at_page)

  }



  my_listeners_sidebar() //lo ejecuto para añadir todos los addeventlistener al código




  let sidebarContent = document.getElementById('sidebar').innerHTML; // Almacena el contenido inicial del sidebar
  let open_bar = true; // Estado de visibilidad del sidebar



  //-------------------Media Query en JS-----------------------//
  function handleSidebarContent() {
    const mediaQuery = window.matchMedia('(max-width: 950px)');

    // Función para mostrar/ocultar texto e imágenes
    function toggleContent() {

    
      //si el ancho es menor que 950, oculta la foro y la descripcion de los iconos
      if (mediaQuery.matches && open_bar===true)  {
        const sidebar = document.querySelector('.sidebar'); // Selecciona la sidebar
        const sidebarLinks_ul = document.querySelector('.sidebar-links') //Selecionamos la etiqueta ul
        const sidebarLinks = document.querySelectorAll('.sidebar a'); // Selecciona todos los enlaces dentro de .sidebar
        // Pantalla menor a 950px: oculta texto y elimina imágenes
        sidebar.style.width = "2rem";
        sidebarLinks_ul.style.marginTop="0rem"
        sidebar.style.textAlign="left";
        const main_content = document.querySelector('.main-content'); 
        main_content.style.marginLeft="2rem"
  
        // Oculta los enlaces
        Array.from(sidebarLinks).forEach(link => {
          console.log(link)
          link.style.opacity = '0'; // Hace que el texto desaparezca
        });
  



        //si el ancho es mayor que 950, devuelve a la forma original tanto el texto como la foto
      } else if(!mediaQuery.matches && open_bar===true) {
        const sidebar = document.querySelector('.sidebar'); // Selecciona la sidebar
        const sidebarLinks_ul = document.querySelector('.sidebar-links') //Selecionamos la etiqueta ul
        const sidebarLinks = document.querySelectorAll('.sidebar a'); // Selecciona todos los enlaces dentro de .sidebar

        sidebar.innerHTML = sidebarContent; // Restaurar contenido inicial
        my_listeners_sidebar()

        // Pantalla mayor o igual a 950px: muestra texto y restaura imágenes
        sidebar.style.width = "10rem";
        sidebarLinks_ul.style.marginTop="2rem"
        sidebar.style.textAlign="center";
        const main_content = document.querySelector('.main-content'); 
        main_content.style.marginLeft="10rem"
  
        // Muestra los enlaces
        sidebarLinks.forEach(link => {
          link.style.opacity = '1'; // Restaura el texto
        });
      }

      
    }
  
    // Llama a la función al cargar la página
    toggleContent();
  
    // Escucha los cambios de la media query
    mediaQuery.addEventListener('change', toggleContent);
  }


handleSidebarContent();









//-------------------Barra lateral ajustar según media-Query-----------------------// 
function toggleSidebar() {
  const windowWidth = window.innerWidth;

  // Si la pantalla es menor de 950px y el menú está cerrado, ábrelo
  if (windowWidth < 950 && open_bar === false) {
      let sidebar = document.getElementById('sidebar');
      // Seleccionar elementos necesarios para la manipulación
      sidebar.innerHTML = sidebarContent; // Restaurar contenido inicial
      my_listeners_sidebar()

      sidebar = document.querySelector('.sidebar'); 
      const sidebarLinks_ul = document.querySelector('.sidebar-links'); 
      const main_content = document.querySelector('.main-content'); 

      const sidebarLinks = document.querySelectorAll('.sidebar a'); 
      
      sidebar.style.width = "2rem";
      sidebarLinks_ul.style.marginTop="0rem"
      sidebar.style.textAlign="left";
      main_content.style.marginLeft="2rem"
        
      
      // Ocultar texto de los enlaces
      Array.from(sidebarLinks).forEach(link => {
          link.style.opacity = '0'; // Ocultar texto
      });


      main_content.style.width="90vw"

        open_bar = true; // Actualizar estado
  } 
  // Si la pantalla es menor de 950px y el menú está abierto, ciérralo
  else if (windowWidth < 950 && open_bar === true) {
      const sidebar = document.querySelector('.sidebar'); // Selecciona la sidebar
    
      sidebar.style.width = '0';
      sidebar.style.padding = '0';
      sidebar.innerHTML = ""; // Vaciar el contenido
      open_bar = false; // Actualizar estado
      const main_content=document.querySelector(".main-content")
      main_content.style.width="100vw"
      main_content.style.marginLeft="0rem"
  } 
  // Si la pantalla es mayor o igual a 950px y el menú está cerrado, ábrelo
  else if (open_bar === false) {


    
      let sidebar = document.getElementById('sidebar');
      sidebar.style.width = '10rem';
      const main_content=document.querySelector(".main-content")
      main_content.style.marginLeft="10rem"


      sidebar.innerHTML = sidebarContent; // Restaurar contenido inicial
      my_listeners_sidebar()
      sidebar = document.querySelector('.sidebar'); // Selecciona la sidebar
      const sidebarLinks_ul = document.querySelector('.sidebar-links'); // Seleccionar ul

      sidebarLinks_ul.style.marginTop = "1.5rem"; // Ajustar estilo
      sidebar.style.textAlign = "center"; // Centrar contenido

      main_content.style.width="90vw"

      open_bar = true; // Actualizar estado
  } 
  // Si la pantalla es mayor o igual a 950px y el menú está abierto, ciérralo
  else {
      const sidebar = document.querySelector('.sidebar'); // Selecciona la sidebar
      sidebar.style.width = '0';
      sidebar.style.padding = '0';
      sidebar.innerHTML = ""; // Vaciar el contenido
      open_bar = false; // Actualizar estado
      const main_content=document.querySelector(".main-content")
      main_content.style.marginLeft="0rem"
      main_content.style.width="100vw"
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


