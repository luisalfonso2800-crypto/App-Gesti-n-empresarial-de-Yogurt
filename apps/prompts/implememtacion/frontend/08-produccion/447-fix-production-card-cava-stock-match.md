TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la vinculación de stock en cava en las tarjetas de productos formulados para que reconozcan las existencias reales a granel (39 Litros) ignorando discrepancias de sufijo en el nombre:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo donde se consulta o mapea el stock de cava para las tarjetas (`apps/api/src/production/production.service.js` o componente de tarjetas en `apps/web/...`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

INSTRUCCIONES TÉCNICAS:

1. Normalización de Coincidencia de Stock:
   - Al mapear cada producto formulado con su stock en cava:
     * Cotejar preferentemente por `productoId` / relación directa de la receta.
     * Si se compara por nombre, limpiar sufijos de presentación comercial o granel:
       `const cleanName = name.replace(/\s*-\s*YOGURT A GRANEL/i, '').trim();`
     * Sumar las existencias reales de los lotes activos a granel correspondientes a ese producto.
   - De este modo, `YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO` tomará los 39 Litros registrados en `YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO - YOGURT A GRANEL`.

2. Renderizado en Tarjeta:
   - Mostrar el valor formateado: `En Cava: 39.0 L`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check <archivo_modificado>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tarjeta de `YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO` muestra `En Cava: 39.0 L` en lugar de `0.0 L`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.