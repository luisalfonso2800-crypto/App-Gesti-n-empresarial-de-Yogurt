TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir en las tarjetas de "Productos Formulados Listos para Producir" la lectura de stock en cava (Litros vs und) y aplicar el bloqueo/indicador visual cuando no existan insumos o inóculos suficientes en inventario:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el componente de tarjetas de productos formulados (ej. `apps/web/src/app/operations/production/components/FormulatedProductsList.jsx` o componente que renderiza las tarjetas superiores de la bitácora) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

INSTRUCCIONES TÉCNICAS:

1. Corrección del Stock visible "En Cava":
   - Para productos clasificados como base láctea o WIP (`BASES_LACTEAS`, `INTERMEDIO_WIP` o presentación granel):
     * Mostrar la unidad correspondiente en Litros:
       `En Cava: ${Number(prod.stockLitros ?? prod.stockActual ?? 0).toFixed(1)} L`
     * Para productos envasados comerciales terminados, conservar la unidad `${stock} und`.

2. Bloqueo Poka-Yoke por Insumos / Inóculos Insuficientes:
   - Evaluar si el producto formulado tiene cobertura para fabricar al menos 1 tanda mínima:
     * Si la receta requiere inóculo WIP y el stock total de semielaborados en cava es 0:
       - Cambiar el botón `Producir Lote` por una pastilla o botón deshabilitado:
         `<button disabled className="bg-slate-200 text-slate-500 cursor-not-allowed ...">⚠ Sin Inóculo en Cava</button>`
     * Si faltan materias primas esenciales en bodega:
       - Indicar visualmente `⚠ Insumos Insuficientes`.
   - Solo mostrar el botón verde activo `▶ Producir Lote` cuando los recursos de bodega y cava cubran el lote base.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/...`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Las bases intermedias en las tarjetas muestran su volumen real en Litros ("L") en lugar de "0 und".
- Con la cava de inóculos en 0, las tarjetas dependientes quedan bloqueadas con advertencia visible sin permitir lanzamiento directo ciego.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.