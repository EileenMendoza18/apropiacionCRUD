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