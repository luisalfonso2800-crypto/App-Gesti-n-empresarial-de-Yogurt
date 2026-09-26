TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Refactorizar la tarjeta de lote en la Bitácora de Fabricación (`ProductionOrderCard.jsx` o componente equivalente en `apps/web/src/app/operations/production/components/` y su CSS):
1. Detectar si el lote cuenta con división de inóculo / sub-lote hijo registrado (`loteHijoInoculo` o desglose de volumen reservado vs disponible).
2. Si hubo división: mostrar dos bloques de balance operativo: "Disponible para Envasar" (volumen para cava/empaque) e "Iniciador Guardado" (volumen de inóculo con su código de trazabilidad hijo).
3. En los enlaces inferiores, incluir el acceso directo a la trazabilidad del lote hijo de inóculo junto al lote principal.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionOrderCard.jsx` (o tarjeta de orden liquidada)
2. `apps/web/src/app/operations/production/production.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `ProductionOrderCard.jsx`:
   - Evaluar los datos de liquidación del lote:
     * Si `order.reservaInoculo?.cantidad > 0` o existe sub-lote derivado:
       - Renderizar grid de dos columnas (`styles.splitVolumeGrid`):
         * Columna 1 (Envasado/Venta):
           - Micro-label: `🥛 DISPONIBLE PARA ENVASAR`
           - Valor: `<strong>{volumenPrincipal} Litros</strong> en cava`
         * Columna 2 (Inóculo/Semilla):
           - Micro-label: `🧫 INICIADOR GUARDADO`
           - Valor: `<strong>{volumenInoculo} Litros</strong> ({codigoLoteInoculo})`
     * Si no hubo división: mantener la caja única tradicional con `Volumen Obtenido`.
   - En el pie de la tarjeta:
     * Mantener enlace al Lote Principal (`Ver Lote: {codigoLote}`).
     * Si existe inóculo reservado, añadir badge o link secundario: `<span className={styles.inoculumLink}>🧫 Cepa: {codigoLoteInoculo}</span>`.
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

2. En `production.module.css`:
   - Definir los estilos para el grid de desglose:
     ```css
     .splitVolumeGrid {
       display: grid;
       grid-template-columns: 1fr 1fr;
       gap: 10px;
       background: #FAF9F6;
       border: 1px solid #EFECE6;
       border-radius: 8px;
       padding: 10px 12px;
       margin-bottom: 12px;
     }
     .volumeBlockHeader {
       font-size: 10.5px;
       font-weight: 700;
       color: #64748B;
       letter-spacing: 0.03em;
       margin-bottom: 3px;
       display: flex;
       align-items: center;
       gap: 4px;
     }
     .volumeBlockValue {
       font-size: 13.5px;
       font-weight: 700;
       color: #1B4332;
     }
     .inoculumHighlight {
       color: #047857;
       background: #ECFDF5;
       border-radius: 4px;
       padding: 1px 6px;
       font-size: 11px;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tarjeta de producción liquidada exhibe cuánto volumen quedó disponible para envasar y cuánto se apartó como iniciador con su código correlativo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.