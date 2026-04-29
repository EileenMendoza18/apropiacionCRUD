import { get, post, deleteData, updateData } from "./index.js";

// --- ELEMENTOS DEL DOM ---
const botonVisualizar = document.getElementById('miBoton');
const formulario = document.getElementById('caja');
const seccionMensaje = document.getElementById('section');
const h2 = document.getElementById('section__div');
const botonGuardar = document.getElementById('guardar'); // Botón del submit
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

// --- ESTADO ---
let tasks = await get('tasks');
let tareaEnEdicionId = null; // Variable para controlar si editamos o creamos

// --- FUNCIONES DE APOYO ---
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

// --- RENDERIZADO (READ, UPDATE, DELETE) ---
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

        // BOTÓN ELIMINAR
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Eliminar";
        btnDelete.classList.add('button');
        btnDelete.addEventListener('click', async () => {
            const confirmar = confirm(`¿Eliminar "${element.title}"?`);
            if (confirmar) {
                try {
                    await deleteData('tasks', element.id);
                    tasks = tasks.filter(t => t.id !== element.id);
                    tarjetaDiv.remove();
                    alert("Tarea eliminada");
                } catch (error) {
                    alert("Error al eliminar");
                }
            }
        });

        // --- 5. ACTUALIZAR TAREA (UPDATE - PARTE 1: CARGAR) ---
        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Editar";
        btnEdit.classList.add('button');
        btnEdit.addEventListener('click', () => {
            // Desplazar al formulario
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Cargar datos en los inputs
            inputId.value = element.userId;
            inputTarea.value = element.title;
            inputEstado.value = element.completed.toString();

            // Cambiar modo a edición
            tareaEnEdicionId = element.id;
            botonGuardar.textContent = "Actualizar Tarea";
            botonGuardar.style.backgroundColor = "#ff9800"; // Naranja para distinguir
        });

        tarjetaDiv.appendChild(h3);
        tarjetaDiv.appendChild(p);
        tarjetaDiv.appendChild(btnDelete);
        tarjetaDiv.appendChild(btnEdit);
        seccionMensaje.appendChild(tarjetaDiv);
    });
}

// --- MANEJO DE FORMULARIO (CREATE & UPDATE - PARTE 2: ENVIAR) ---
async function handleFormSubmit(e) {
    e.preventDefault();
    
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

        if (tareaEnEdicionId) {
            // MODO ACTUALIZAR (PUT)
            console.log("Actualizando tarea...");
            const tareaActualizada = await updateData('tasks', tareaEnEdicionId, nuevaData);
            
            // Actualizar array local
            const index = tasks.findIndex(t => t.id === tareaEnEdicionId);
            tasks[index] = tareaActualizada;

            alert("Tarea actualizada con éxito");
            
            // Resetear modo edición
            tareaEnEdicionId = null;
            botonGuardar.textContent = "Guardar tarea";
            botonGuardar.style.backgroundColor = "";
        } else {
            // MODO CREAR (POST)
            const respuestaServidor = await post('tasks', nuevaData);
            tasks.push(respuestaServidor);
            alert("Tarea creada con éxito");
        }

        formulario.reset();
        renderizarTareas(tasks.filter(t => t.completed === nuevaData.completed));
        contador.textContent = `Total: ${tasks.filter(t => t.completed === nuevaData.completed).length}`;

    } catch (error) {
        console.error('Error en el servidor:', error);
        alert("Error al conectar con el servidor");
    }
}

// --- EVENTOS GENERALES ---
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