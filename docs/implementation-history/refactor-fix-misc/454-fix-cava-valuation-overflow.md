TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Sanear la valorización multimillonaria de Cava ($40.154.999,98 para 71 L) y blindar la fórmula de cómputo para multiplicar estrictamente por el costo unitario por Litro:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo de consulta/cálculo de cava (`apps/api/src/inventory/inventory.repository.js` o servicio equivalente) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/inventory/inventory.repository.js` (o servicio que calcula la valorización de Cava)

INSTRUCCIONES TÉCNICAS:

1. Corrección de la fórmula de Valorización de Cava:
   - Al iterar los productos de Cava (`BASES_LACTEAS` o `PRODUCTO_TERMINADO`):
     ```javascript
     const stockLts = Number(item.stockActual || item.stockLitros || 0);
     // Obtener costo unitario por litro (si excede un umbral lógico ej. > $20.000/L para bases lácteas, usar el costo estándar de receta)
     let costoUnit = Number(item.costoPromedio || item.costoUnitario || 0);
     if (costoUnit > 15000) {
       // Recuperar costo estándar de su receta o normalizar (ej. ~3869 COP/L)
       costoUnit = Number(item.recetas?.[0]?.costoUnitarioProyectado || 3869);
     }
     const valorizacionReal = stockLts * costoUnit;
     ```
   - Actualizar el registro persistente de ese producto para corregir el valor corrupto de $40.154.999,98:
     * Asignar `costoPromedio: 3869`
     * La valorización calculada para 71 L debe ser `71 * 3869 = 274699`.

2. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/inventory/inventory.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La fila de `YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO - YOGURT A GRANEL` muestra una valorización realista (aprox. $274.699 COP) en lugar de$ 40.154.999,98.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.