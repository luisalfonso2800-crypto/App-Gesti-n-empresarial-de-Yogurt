TAREA:
Incorporar la regla de Selectores Dependientes en Cascada y Formularios Contextuales (Poka-Yoke) en AGENTS.md

OBJETIVO:
Actualizar `AGENTS.md` para estandarizar de forma obligatoria que todo formulario o modal del sistema evalúe y ejecute dependencias lógicas entre campos: si un campo determina la naturaleza de los siguientes (ej. presentación comercial vs granel), las opciones subsiguientes deben filtrarse reactivamente, los valores huérfanos deben resetearse y los campos irrelevantes deben ocultarse o transformarse.

FUENTE DE VERDAD:
- `AGENTS.md` (Bloque III: Reglas Funcionales y UX)

REGLA DE CONSULTA:
Lee exclusivamente `AGENTS.md`. Prohibido tocar código de frontend o backend.

ALCANCE:

LEER:
- `AGENTS.md`

CREAR:
- ningún archivo.

MODIFICAR:
- `AGENTS.md`

NO MODIFICAR:
- ningún archivo en `apps/api/` ni `apps/web/`.

INSTRUCCIONES:

1. Ubicar en `AGENTS.md` el Bloque III (o la sección de formularios/Poka-Yoke tras la Regla 13 o Regla 39).
2. Agregar la nueva directriz:

   `### 13.2. SELECTORES EN CASCADA Y DEPENDENCIAS CONTEXTUALES (POKA-YOKE)`
   - **Análisis de Dependencia Previo:** Al diseñar o intervenir cualquier formulario, la IA DEBE identificar si algún campo maestro condiciona las opciones, la validez o la pertinencia de otros campos dependientes.
   - **Filtrado Reactivo Estricto:** Los selectores dependientes NO deben mostrar opciones incompatibles con el valor actual del campo maestro (ej. si la presentación es "A GRANEL", el selector de categoría solo debe mostrar categorías de semielaborados/WIP; si es presentación comercial, solo categorías terminadas).
   - **Auto-Reseteo Preventivo:** Si el usuario cambia el valor de un campo maestro y el campo dependiente contiene un valor que ya no es válido en el nuevo contexto, la IA DEBE resetearlo inmediatamente en el estado a un valor por defecto seguro. Está terminantemente prohibido dejar valores huérfanos o contradictorios en el payload.
   - **Adaptación Visual de Campos (Hiding/Showing):** Si la selección de un campo vuelve irrelevante a otros (ej. costo de producción vs precio de venta comercial), los campos no aplicables deben ocultarse o sustituirse por tarjetas informativas contextuales.
   - **Imposibilidad de Estados Inválidos:** La interfaz debe hacer físicamente imposible que el usuario arme combinaciones contradictorias antes de presionar guardar.

NO HACER:
- No borrar ni sobreescribir las reglas preexistentes de `AGENTS.md`.
- No alterar la configuración de Git ni ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
- `AGENTS.md` contiene la directriz 13.2 de selectores dependientes en cascada y auto-reseteo preventivo.

VERIFICACIÓN:
Comprobar que el archivo `AGENTS.md` conserve formato Markdown limpio y coherente.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivo modificado:
- Sección incorporada:
- Estado: