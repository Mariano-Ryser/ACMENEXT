//CAMBIAR FONT GOOGLE

Para cambiar la fuente de letras dirijete a 
------"/app/ui/fonts.ts"
Donde encontraras que fuentes estas exportando
lo cual agregaremos al "<body>" que se encuentra en "/app/layout.tsx"


CAPITULO 4
Creacion del disenio del panel de Control

ui/dashboard/navlinks  ---> iconos https://heroicons.com/


Estilar
Navbar /app/page.tsx

promesa await --  se ejecuta en cascada

await Promise.all --- Comience a ejecutar todas las búsquedas de datos al mismo tiempo, lo que puede generar ganancias en el rendimiento.


Capitulo 8 

Qué es la representación estática y cómo puede mejorar el rendimiento de su aplicación.

Qué es la representación dinámica y cuándo utilizarla.

Diferentes enfoques para hacer que tu tablero sea dinámico.

Simule una búsqueda lenta de datos para ver qué sucede.

Capitulo 9 

Qué es el streaming y cuándo puedes utilizarlo.

Cómo implementar streaming con loading.tsxSuspense.

¿Qué son los esqueletos de carga?

Qué son los grupos de rutas y cuándo puedes utilizarlos.

Dónde colocar los límites de suspenso en su aplicación.


capitulo 12 - Creating an invoice

Crea un formulario para capturar la entrada del usuario.
Cree una acción de servidor e invoquela desde el formulario.
Dentro de su Acción de Servidor, extraiga los datos del formDataobjeto.
Validar y preparar los datos que se insertarán en su base de datos.
Inserte los datos y gestione cualquier error.
Revalidar el caché y blueirigir al usuario nuevamente a la página de facturas.

Chapter 14
Improving form accessibility
There are three things we're already doing to improve accessibility in our forms:

Semantic HTML: Using semantic elements (<input>, <option>, etc) instead of <div>. This allows assistive technologies (AT) to focus on the input elements and provide appropriate contextual information to the user, making the form easier to navigate and understand.
Labelling: Including <label> and the htmlFor attribute ensures that each form field has a descriptive text label. This improves AT support by providing context and also enhances usability by allowing users to click on the label to focus on the corresponding input field.
Focus Outline: The fields are properly styled to show an outline when they are in focus. This is critical for accessibility as it visually indicates the active element on the page, helping both keyboard and screen reader users to understand where they are on the form. You can verify this by pressing tab.