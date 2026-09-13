TAREA:
Implementar snapshot inmutable de receta en órdenes de producción y redondeo estricto de empaques discretos en Kardex (apps/api).

OBJETIVO:
En `apps/api/src/production/`:
1. Congelar un snapshot inmutable de la receta (etapas, parámetros de proceso, temperaturas y BOM) al momento de programar o crear una orden de producción en `ProductionRepository.create`, garantizando que ediciones futuras a la receta maestra no alteren la trazabilidad histórica de lotes.
2. Estandarizar el redondeo al alza (`Math.ceil`) en el cálculo de consumo de materiales para toda la familia de unidades discretas (`['UNIDAD', 'UNIDADES', 'UND', 'PZA', 'VASO', 'BOTELLA', 'TAPA']`), evitando consumos fraccionarios de empaques en el inventario.

FUENTES DE VERDAD:
- `docs/diagnosticos/AUDITORIA_SISTEMA_INTEGRAL_RECETAS.md` (Fase 3)
- `apps/api/prisma/schema.prisma`
- `apps/api/src/production/production.repository.js`
- `apps/api/src/production/production.service.js`
- `AGENTS.md` (Reglas 0, 2, 7, 13.1, 13.2)

ARCHIVOS A MODIFICAR:
- `apps/api/src/production/production.repository.js`

INSTRUCCIONES:

1. SNAPSHOT INMUTABLE DE RECETA AL PROGRAMAR ORDEN:
   - Al crear una orden de producción (`create` en `production.repository.js`):
     * Consultar la receta activa con sus etapas (`etapasReceta`), parámetros técnicos (tiempos, temperaturas) e insumos/productos intermedios (`detalles`).
     * Almacenar este snapshot estructurado en la orden (campo de observaciones/metadatos o estructura JSON correspondiente) para que la orden conserve su propia copia de fabricación independiente de la receta maestra.

2. CONSUMO DISCRETO DE MATERIALES DE EMPAQUE (KARDEX):
   - En `getRecipeBom` y en la deducción de inventario de `completeProduction`:
     * Definir la lista de unidades indivisibles:
       `const UNIDADES_DISCRETAS = ['UNIDAD', 'UNIDADES', 'UND', 'PZA', 'PIEZA', 'VASO', 'BOTELLA', 'TAPA', 'ETIQUETA'];`
     * Al calcular el requerimiento teórico (`reqTeorico`), evaluar:
       ```javascript
       const esUnidadDiscreta = UNIDADES_DISCRETAS.includes(detalle.unidad?.toUpperCase().trim());
       const cantidadFinal = esUnidadDiscreta ? Math.ceil(reqTeorico) : Number(reqTeorico.toFixed(4));
       ```
     * Garantizar que los empaques nunca registren descuentos con decimales (ej. 52.3 vasos -> 53 vasos).

VERIFICACIÓN:
1. `pnpm --filter api exec node -e "require('@babel/register'); require('./src/production/production.repository.js'); console.log('Production Repo OK');"`
2. `node --check apps/api/src/production/production.repository.js`

CRITERIO DE FINALIZACIÓN:
- Las órdenes de producción guardan el snapshot técnico de la receta.
- Los consumos de empaques se redondean siempre con Math.ceil para unidades discretas.
- Verificación sintáctica limpia con código de salida 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Reporte conciso indicando: archivo modificado, lógica de snapshot inmutable, unidades discretas integradas y comprobación sintáctica con código 0.