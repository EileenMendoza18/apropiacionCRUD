import { get} from "./index.js";

const boton = document.getElementById('miBoton');
const seccionMensaje =document.getElementById('section')
const h2= document.getElementById('section__div');

const divBtns= document.createElement("div")
const buttonActive = document.createElement("button");
const buttonInactive = document.createElement("button");
const contador= document.createElement("p")

console.log("Iniciando petición GET al servidor...");
let tasks = await get('tasks');

console.log("Respuesta recibida del servidor:", tasks);

/**
 * Función para renderizar tareas en el DOM
 * Requisito: Mostrar tareas en el documento
 */
function renderizarTareas(listaFiltrada) {
    const tarjetasViejas = document.querySelectorAll('.tarjetaDiv');
    tarjetasViejas.forEach(tarjeta => tarjeta.remove());

    listaFiltrada.forEach(element => {
        const tarjetaDiv = document.createElement("div");
        tarjetaDiv.classList.add("tarjetaDiv");

        const h3 = document.createElement("h3");
        h3.textContent = `Tarea: ${element.title}`;

        const p = document.createElement("p");
        p.textContent = `Usuario Asignado: ${element.userId}`;

        tarjetaDiv.appendChild(h3);
        tarjetaDiv.appendChild(p);
        seccionMensaje.appendChild(tarjetaDiv);
    });
}


boton.addEventListener('click', async (e) => {
    e.preventDefault();
    divBtns.classList.add('divButton')
    buttonActive.textContent = "Activos"
    buttonActive.classList.add('button')
    buttonInactive.textContent = "Inactivos"
    buttonInactive.classList.add('button')

    seccionMensaje.appendChild(divBtns)
    divBtns.appendChild(buttonActive)
    divBtns.appendChild(buttonInactive)
    
    seccionMensaje.classList.add('visible');
    boton.classList.add('none')
    h2.classList.add('none')
    console.log("Renderizando primeras 5 tareas por defecto...");
    renderizarTareas(tasks.slice(0, 5));
});

buttonActive.addEventListener('click', async (f)=>{
    f.preventDefault();
    const activas = tasks.filter(t => t.completed === true);
    renderizarTareas(activas);
    contador.textContent = `El total de tareas activas es de ${activas.length}`;
    divBtns.appendChild(contador);
    
})

buttonInactive.addEventListener('click', async (g)=>{
    g.preventDefault();
    const inactivas = tasks.filter(t => t.completed === false);
    renderizarTareas(inactivas);
    contador.textContent = `El total de tareas inactivas es de ${inactivas.length}`;
    divBtns.appendChild(contador);
})
