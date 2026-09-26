TAREA DE INVESTIGACIÓN (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 4 TOOL CALLS DE SOLO LECTURA):
Investigar la causa raíz exacta de la distorsión matemática en la vista de Inventario (donde "VALOR EN BODEGA" marca $6.586.534.768 y "YOGUR GRIEGO" con 1603,333 g muestra $36.924.768).

PROHIBICIONES ESTRICTAS:
- NO modificar ningún archivo. Cero ediciones (`Edit`, `Write`).
- NO ejecutar búsquedas recursivas abiertas ni comandos largos de consola.
- NO leer archivos CSS.

PUNTOS EXACTOS A LOCALIZAR Y LEER:

1. Endpoint / Servicio de Inventario Bodega:
   - Localizar la función que responde a los datos de la pestaña "Bodega (Insumos)" y sus KPIs superiores (revisar `apps/api/src/inventory/` o `apps/web/src/app/operations/inventory/`).
   - Extraer exactamente:
     * ¿Cómo se calcula la columna `Valorización` de cada fila?
     * ¿Cómo se calcula la tarjeta KPI `VALOR EN BODEGA`?

2. Origen del dato "YOGUR GRIEGO":
   - Verificar si en la base de datos (Prisma / Seed) el costo unitario de ese insumo está guardado por Gramo o por Kilogramo.
   - Verificar si el frontend recibe ya el valor calculado o si lo multiplica localmente en el componente de React (`stockActual * costoUnitario`).

3. Salida Requerida:
   - Detenerse inmediatamente tras leer esos puntos y emitir un reporte conciso en consola con:
     a) Ruta exacta del archivo y número de línea donde se realiza el cálculo.
     b) Fragmento literal de código donde ocurre la multiplicación o suma.
     c) Diagnóstico puntual: Si el fallo es por falta de conversión de unidades (g -> Kg), un seed corrupto, o un cálculo directo en frontend/backend.

DETENCIÓN:
Una vez recopilados los fragmentos de código, DETENTE de inmediato sin ejecutar ninguna otra acción.
