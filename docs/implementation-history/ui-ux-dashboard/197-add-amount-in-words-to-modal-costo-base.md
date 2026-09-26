TAREA:
Incorporar valor en letras al campo 'Costo Base Referencial ($)' en el modal de Nuevo Insumo

OBJETIVO:
Mostrar en tiempo real la conversión a letras (ej. "✦ Seis mil novecientos pesos") debajo del campo "Costo Base Referencial ($)" dentro del modal "Nuevo Insumo", reutilizando la función utilitaria global `montoATextoPesos`.

FUENTE DE VERDAD:
- `apps/web/src/app/operations/purchases/new/page.jsx`
- `apps/web/src/utils/numberToWords.js`

REGLA DE CONSULTA:
Lee únicamente los archivos especificados en el alcance. No realices exploraciones secundarias en el repositorio.

ALCANCE:

LEER:
- `apps/web/src/app/operations/purchases/new/page.jsx`
- `apps/web/src/utils/numberToWords.js`

CREAR:
- ningún archivo.

MODIFICAR:
- `apps/web/src/app/operations/purchases/new/page.jsx` (o el componente del modal si está desacoplado)

NO MODIFICAR:
- `apps/web/src/utils/numberToWords.js`
- ningún otro archivo fuera del alcance.

INSTRUCCIONES:

1. Asegura la importación de la función global en la cabecera:
   ```javascript
   import { montoATextoPesos } from '@/utils/numberToWords';