TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Refactorizar el modal de liquidación y cierre de lote (`BatchLiquidationModal.jsx` / `FinalizeBatchModal.jsx` y su módulo CSS):
1. Eliminar decimales infinitos/innecesarios y aplicar separadores de miles en teóricos y reales (ej: "5.000 ml" y "208,33 g").
2. Integrar un contenedor ergonómico para "Volumen Real Obtenido" con sufijo integrado "Litros".
3. Mejorar la tabla de balance de materia (Consumo Real vs Teórico) con iconografía, badges de desviación/merma y resumen de balance de masa.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/production/components/FinalizeBatchModal.jsx` (o componente de liquidación de lote)
2. `apps/web/src/app/production/production.module.css` (o CSS del modal de producción)

INSTRUCCIONES TÉCNICAS:

1. En el componente de liquidación:
   - Encabezado y banner superior:
     * Banner informativo con icono `<CheckCircle2 size={16} color="#1B4332" />`:
       "Al liquidar, se descontarán automáticamente los insumos utilizados de bodega y se registrará el lote terminado en cava."
   - Sección "Volumen Real Obtenido":
     * Envolver en un layout limpio con label arriba y un input agrupado con badge fijo a la derecha:
       ```jsx
       <div className={styles.volumeInputWrapper}>
         <span className={styles.volumeIcon}><Scale size="{16}"/></span>
         <input type="number" step="0.1" value={volumenReal} ... />
         <span className={styles.volumeSuffix}>Litros Obtenidos</span>
       </div>
       ```
   - Tabla de Balance de Masa (Consumo Real vs Teórico):
     * Cabecera con iconografía: `📦 Insumo`, `📐 Teórico`, `⚖️ Real Utilizado`, `📊 Desviación / Merma`.
     * Formateo numérico en filas:
       - Teórico: si es ml/g entero, formatear con miles `Math.round(val).toLocaleString('es-CO')` (ej: `5.000 ml`). Si tiene fracción, limitar a 2 decimales (`208,33 g`).
       - Input Real: redondear el valor inicial cargado a máximo 2 decimales (nunca `208,3333`).
       - Desviación / Merma: si desviación === 0, badge verde suave `0% (Exacto)`; si hay exceso, badge ámbar `+X%`; si hay ahorro, badge azul `-X%`.
   - Botones de acción:
     * Mantener botón "Cancelar" y botón primario MANNÁ "Confirmar Liquidación y Entrada a Stock" con icono `<Check size={16} />`.
   - Mantener el componente bajo 135 líneas (SRP).

2. En el archivo CSS:
   - `.volumeInputWrapper`: contenedor flexible centrado, borde `1px solid #CBD5E1`, border-radius `8px`, fondo blanco, padding de 0 10px, altura 42px.
   - `.liquidationTable`: ancho 100%, borde colapsado, cabeceras con fondo suave `#F8FAFC`, padding de celdas 10px 12px, bordes inferiores `#E2E8F0`.
   - `.badgeExact`: fondo `#DCFCE7`, color `#166534`, font-weight `600`, font-size `11px`, border-radius `12px`, padding `2px 8px`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/components/FinalizeBatchModal.jsx` (o archivo intervenido)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Se erradican los decimales largos (208,3333 pasa a 208,33 g o 208 g).
- El volumen obtenido tiene un input con sufijo y prefijo nítido sin textos encimados.
- La tabla de insumos muestra iconos, balance claro y badges de merma intuitivos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.