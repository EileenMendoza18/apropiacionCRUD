import { get, post } from "./index.js";

// --- ELEMENTOS DEL DOM ---
const botonVisualizar = document.getElementById('miBoton');
const formulario = document.getElementById('caja');
const seccionMensaje = document.getElementById('section');
const h2 = document.getElementById('section__div');
const inputId = document.querySelector(".inputID");
const inputTarea = document.getElementById("inputTarea");
const inputEstado = document.getElementById("inputEstado");
const idError = document.getElementById("idError");
const tareaError = document.getElementById("tareaError");
const estadoError = document.getElementById("estadoError");

const divBtns = document.createElement("div");
const buttonActive = document.createElement("button");
const buttonInactive = document.createElement("button");
const contador = document.createElement("p");

// --- ESTADO INICIAL ---
let tasks = await get('tasks');

// --- FUNCIONES DE VALIDACIÓN Y ERROR ---
function showError(errorElement, message) {
    errorElement.textContent = message;
}

function clearError(errorElement, inputElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('error');
}

function isValidInput(input, message, errorElement) {
    if (!input.value.trim()) {
        showError(errorElement, message);
        input.classList.add('error');
        return false;
    }
    clearError(errorElement, input);
    return true;
}

// --- RENDERIZADO ---
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

// --- 3. CREAR TAREA (CREATE) ---

/**
 * Captura el evento submit del formulario
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validaciones previas
    const idValido = isValidInput(inputId, 'ID obligatorio', idError);
    const tareaValida = isValidInput(inputTarea, 'Tarea obligatoria', tareaError);
    const estadoValido = isValidInput(inputEstado, 'Estado obligatorio', estadoError);

    if (!idValido || !tareaValida || !estadoValido) return;

    const valorEstado = inputEstado.value.trim().toLowerCase();
    if (valorEstado !== "true" && valorEstado !== "false") {
        showError(estadoError, 'Debe ser "true" o "false"');
        return;
    }

    try {
        const nuevaData = {
            userId: parseInt(inputId.value.trim()),
            title: inputTarea.value.trim(),
            completed: valorEstado === "true"
        };

        // Enviar datos usando POST
        console.log("Enviando nueva tarea al servidor...");
        const respuestaServidor = await post('tasks', nuevaData);
        
        // Después de la respuesta, actualizamos el array local
        tasks.push(respuestaServidor);
        alert("Tarea creada con éxito");

        // Limpiar formulario
        formulario.reset();
        
        // Volver a listar las tareas (actualizar el DOM)
        renderizarTareas(tasks.filter(t => t.completed === nuevaData.completed));
        contador.textContent = `Total: ${tasks.filter(t => t.completed === nuevaData.completed).length}`;

    } catch (error) {
        console.error('Error al crear tarea:', error);
        alert("No se pudo conectar con el servidor para crear la tarea");
    }
}

// --- EVENTOS ---

// Vinculamos el evento submit
formulario.addEventListener('submit', handleFormSubmit);

botonVisualizar.addEventListener('click', (e) => {
    e.preventDefault();
    divBtns.classList.add('divButton');
    buttonActive.textContent = "Activos";
    buttonActive.classList.add('button');
    buttonInactive.textContent = "Inactivos";
    buttonInactive.classList.add('button');

    seccionMensaje.appendChild(divBtns);
    divBtns.appendChild(buttonActive);
    divBtns.appendChild(buttonInactive);
    
    formulario.classList.add('visible');
    seccionMensaje.classList.add('visible');
    botonVisualizar.classList.add('none');
    h2.classList.add('none');
    
    renderizarTareas(tasks.slice(0, 5));
});

buttonActive.addEventListener('click', (e) => {
    e.preventDefault();
    const activas = tasks.filter(t => t.completed === true);
    renderizarTareas(activas);
    contador.textContent = `Total activas: ${activas.length}`;
    divBtns.appendChild(contador);
});

buttonInactive.addEventListener('click', (e) => {
    e.preventDefault();
    const inactivas = tasks.filter(t => t.completed === false);
    renderizarTareas(inactivas);
    contador.textContent = `Total inactivas: ${inactivas.length}`;
    divBtns.appendChild(contador);
});

// Limpieza de errores en tiempo real
[inputId, inputTarea, inputEstado].forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim().length > 0) {
            if (input === inputId) clearError(idError, inputId);
            if (input === inputTarea) clearError(tareaError, inputTarea);
            if (input === inputEstado) clearError(estadoError, inputEstado);
        }
    });
});