Parte 1: Comprendiendo antes de programar

Antes de escribir código, respondan:
1. ¿Qué método HTTP usarían para:
• Crear una tarea: METODO POST
• Listar tareas: METODO GET
• Actualizar una tarea METODO PUT O PATCH
• Eliminar una tarea: METODO DELETE

2. ¿Qué información necesitarían enviar al servidor para actualizar o eliminar una
tarea?
RTA: Para que el servidor sepa exactamente qué hacer, necesitamos enviar lo siguiente:

Para Eliminar: Únicamente necesitamos el ID único de la tarea, generalmente enviado como parte de la URL (ejemplo: /tasks/1).

Para Actualizar:

El ID: Para identificar qué registro cambiar.

El Body (Cuerpo): Un objeto JSON con los datos actualizados (userId, title, completed).

3. ¿En qué momento debe actualizarse el DOM?
RTA: Bajo la arquitectura que estamos manejando con procesos asíncronos (async/await), el DOM debe actualizarse solo después de recibir una respuesta exitosa del servidor.


Parte 2: Implementación Guiada
2. Listar tareas (READ)
¿En qué momento se transforman los datos JSON en elementos HTML?
rta: Los datos dejan de ser JSON y se convierten en HTML en el preciso instante en que el navegador ejecuta el appendChild. A partir de ese segundo, el navegador interpreta esos nodos y los dibuja siguiendo las reglas de mis estilos CSS.

3. Crear tarea (CREATE)
¿Qué ocurre primero: se actualiza el DOM o se envía la solicitud al servidor?
rta: Lo primero que ocurre es el envío de la solicitud al servidor.

4. Eliminar tarea (DELETE)
¿Por qué es importante el id en esta operación?
rta: El ID es fundamental porque es la única referencia inequívoca que permite al cliente y al servidor ponerse de acuerdo sobre qué dato específico debe ser procesado, evitando errores de duplicidad o borrado accidental de información incorrecta.

5. Actualizar tarea (UPDATE)
¿Qué diferencia existe entre modificar un dato en el DOM y modificarlo en el servidor?

rta: Si solo modificamos el DOM, nuestra aplicación olvidaria todo al recargar. Si solo modificamos el servidor pero no el DOM, el usuario pensará que la aplicación no funciona porque no verá el cambio reflejado.


Parte 3: Identificación del Ciclo Completo

Cuando terminen, elaboren un pequeño esquema donde representen:
• Acción del usuario.
• Evento capturado en JavaScript.
• Solicitud HTTP enviada.
• Respuesta del servidor.
• Actualización del DOM.
rta:

1. Operación: LISTAR (READ)
        |
        |
Usuario (Carga la página o pulsa un filtro)      
        |
        |
JS (Evento DOMContentLoaded o click capturado)      
        |
        |
Fetch/HTTP (Solicitud GET a /tasks)      
        |
        |
Servidor (Lee db.json y responde con el array de tareas)
        |
        |
JS (Recibe el JSON y ejecuta renderizarTareas)
        |
        |
DOM (Se crean y muestran las tarjetas de las tareas en el HTML)

2. Operación: CREAR (CREATE)
Usuario (Llena el formulario y clic en "Guardar") 
        |
        |
JS (Evento submit capturado y validado)      
        |
        |
Fetch/HTTP (Solicitud POST con el objeto JSON de la nueva tarea) 
        |
        |
Servidor (Escribe en db.json y responde con la tarea creada + ID)      
        |
        |
JS (Recibe confirmación y actualiza el array local tasks)
        |
        |
DOM (La nueva tarea aparece al final de la lista visualmente)

3. Operación: ACTUALIZAR (UPDATE)
Usuario (Clic en "Editar", cambia datos y clic en "Actualizar")      
        |
        |
JS (Evento submit capturado detectando el ID en edición)      
        |
        |
Fetch/HTTP (Solicitud PUT a /tasks/{id} con los datos nuevos)      
        |
        |
Servidor (Busca el ID, sobreescribe en db.json y responde exitoso)      
        |
        |
JS (Actualiza el objeto dentro del array tasks y limpia el formulario)     
        |
        |
DOM (La tarjeta de la tarea muestra la información actualizada)


4. Operación: ELIMINAR (DELETE)
Usuario (Clic en "Eliminar" y confirma en el aviso)   
        |
        |
JS (Evento click capturado en el botón de la tarjeta)         
        |
        |
Fetch/HTTP (Solicitud DELETE a /tasks/{id})     
        |
        |
Servidor (Borra el registro en db.json y responde con éxito)     
        |
        |
JS (Filtra el array local y ejecuta .remove() en el elemento)     

        |
        |
DOM (La tarjeta de la tarea desaparece de la sección de mensajes)


Reflexión Final

Al finalizar, respondan:
• ¿Qué operación les resultó más sencilla?
rta: La operación más sencilla fue el READ (Listar). Una vez que se entiende cómo funciona la petición GET, el proceso es muy lineal: pedir los datos y recorrer el array con un forEach. No requiere enviar cuerpos complejos de datos (body) ni manejar estados complicados de edición, simplemente es "traer y mostrar".


• ¿Cuál fue la más compleja y por qué?
rta: La operación más compleja fue el UPDATE (Actualizar). Esto se debe a que requiere coordinar varios momentos:

Capturar el ID de la tarea específica al hacer clic en "Editar".

"Viajar" con esos datos de vuelta al formulario (mapear el JSON a los inputs).

Cambiar la lógica del botón de envío para que reconozca que no debe crear algo nuevo, sino modificar lo existente.

Manejar la persistencia tanto en el servidor como en el array local para que la vista se actualice correctamente.

• ¿En qué parte del ciclo sintieron mayor dificultad: en la comunicación con la API o
en la manipulación del DOM?
rta: La mayor dificultad que se me presento fue en la manipulación del DOM.

Aunque la API tiene su complejidad con la asincronía (async/await), una vez que la ruta y el método están claros, el comportamiento es predecible. En cambio, la manipulación del DOM implica gestionar eventos, crear elementos desde cero (createElement), limpiar nodos antiguos para no duplicar información y asegurarse de que los selectores (IDs y clases) coincidan exactamente con el HTML. Un pequeño error al capturar un input (como el TypeError que tuvimos al principio) puede detener toda la aplicación.