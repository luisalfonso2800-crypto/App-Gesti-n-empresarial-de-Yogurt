TAREA:
Implementar insignia reactiva permanente de conversión tipo reloj (⏱️ HH:MM) en todos los campos de tiempo de etapas en RecipeModal.jsx.

OBJETIVO:
En `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`:
1. Mostrar de forma permanente una insignia visual de reloj al lado o debajo de cada input de tiempo (`tiempoEstandarMin`, `tiempoMinimoMin`, `tiempoMaximoMin`).
2. Sin importar si el tiempo es menor o mayor a 60 minutos, proyectar siempre la equivalencia en formato digital `00:00` (horas y minutos), actualizándose en tiempo real conforme el usuario escribe.
3. Si el campo está vacío o en cero, renderizar `⏱️ 00:00 h`.
4. Si el valor ingresado es, por ejemplo, `30`, mostrar `⏱️ 00:30 h (30 min)`. Si es `480`, mostrar `⏱️ 08:00 h (8 h)`. Si es `500`, mostrar `⏱️ 08:20 h (8 h 20 min)`.
5. Mantener la estética visual MANNÁ: fondo lino `#F7F4EE`, borde `#E5DFD5`, texto `#182622` o acento `#C58A3E`, tipografía compacta (`0.72rem`) y sin romper la grilla.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `AGENTS.md` (Reglas 13.1, 13.2, 35 y 36)

REGLA DE CONSULTA:
Modifica exclusivamente `RecipeModal.jsx`. Prohibido tocar backend, DTOs o base de datos.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

NO MODIFICAR:
- ningún archivo en `apps/api/`.

INSTRUCCIONES:

1. FUNCIÓN DE FORMATEO DIGITAL REACTIVO:
   Crear la función utilitaria pura dentro de `RecipeModal.jsx`:
   ```javascript
   function formatMinutesToDigitalClock(val) {
     const totalMins = Math.max(0, Math.floor(Number(val) || 0));
     const hours = Math.floor(totalMins / 60);
     const mins = totalMins % 60;
     const hh = hours.toString().padStart(2, '0');
     const mm = mins.toString().padStart(2, '0');

     if (totalMins === 0) {
       return `${hh}:${mm} h`;
     }
     if (hours === 0) {
       return `${hh}:${mm} h (${mins} min)`;
     }
     if (mins === 0) {
       return `${hh}:${mm} h (${hours} h)`;
     }
     return `${hh}:${mm} h (${hours} h ${mins} min)`;
   }