TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Dividir la vista de Cava de Inventario en 'Cava Comercial (Envasados)' y 'Bases Lácteas en Cava (Granel)', calculando en la sección comercial el costo, precio de venta, ganancia unitaria y proyección de venta total:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/production/inventory/page.jsx` (o componente contenedor de pestañas de inventario)
2. `apps/web/src/app/production/inventory/components/CavaInventoryTable.jsx` (o tabla de cava correspondiente)

INSTRUCCIONES TÉCNICAS:

1. Sub-pestañas o Separación en Cava:
   - Dividir la sección de Cava en 2 pestañas bien identificadas:
     * `Cava Comercial (Envasados)`: Filtra productos cuya categoría sea `LACTEOS` o `PRODUCTO_TERMINADO`, con `presentacionId` no nula y sin la palabra 'GRANEL' en su presentación.
     * `Bases en Cava (Granel / Tanques)`: Filtra productos con categoría `BASES_LACTEAS` o presentación a granel en litros.

2. Columnas Financieras para 'Cava Comercial (Envasados)':
   - Columnas requeridas en la tabla:
     1. `Producto Terminado`: Nombre comercial en negrita + contenedor y volumen (ej. `CONTENEDOR DE 16 OZ • 500 ml`).
     2. `Stock Actual`: Badge con las unidades disponibles (ej. `25 Unidades`).
     3. `Costo Unitario`: Costo promedio del lote/receta (ej. `$ 1.870`).
     4. `Precio Venta`: Precio base comercial (ej. `$ 12.000`).
     5. `Ganancia / Margen Unitario`: Diferencia `(Precio Venta - Costo Unitario)` y porcentaje de margen `(Ganancia / Precio Venta * 100)`.
     6. `Venta Total Proyectada`: `Stock Actual * Precio Venta`.
     7. `Ganancia Total Proyectada`: `Stock Actual * Ganancia Unitaria`.
   - Footer / Resumen Superior con métricas agregadas:
     * `Total Potencial en Cava`: Suma de todas las ventas proyectadas.
     * `Utilidad Bruta Proyectada`: Suma de todas las ganancias totales proyectadas.

3. Vista de 'Bases en Cava (Granel)':
   - Conservar la vista estándar de control fabril: Producto, Categoría (`BASES_LACTEAS`), Stock en Litros (`L`), Costo por Litro y Valorización total en Cava.
   - Respetar el límite de líneas SRP (< 135 líneas por componente, extraer subcomponente si es necesario).

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/inventory/...`
2. `pnpm --filter web build`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista de Cava queda dividida claramente entre productos comerciales listos para despacho y bases lácteas de tanque.
- En la tabla de envasados se calcula y visualiza con exactitud el costo unitario, ganancia por unidad, total vendible y ganancia total proyectada.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.