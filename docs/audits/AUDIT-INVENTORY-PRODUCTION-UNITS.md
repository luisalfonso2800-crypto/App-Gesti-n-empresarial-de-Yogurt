# AUDITORÍA MAESTRA: INVENTARIO, VALORIZACIÓN Y CADENA DE UNIDADES
**Documento Maestro:** `docs/audits/AUDIT-INVENTORY-PRODUCTION-UNITS.md`  
**Fecha de Consolidación:** 20 de Septiembre de 2026  
**Fuentes Integradas:** `AUDITORIA_CADENA_CUSTODIA_UNIDADES_Y_VALORIZACION_INVENTARIO.md`, `524-audit-inventory-valuation-root-cause.md.md`, `526-audit-recipe-production-inventory-units-chain.md`, `inventory-audit.md`, `production-inventory-audit.md`, `120-audit-and-upgrade-inventory-module.md`, `122-audit-production-and-inventory-relations.md`, `390-audit-intermediate-product-inoculum-flow.md`, `401-audit-inoculum-inventory-and-recipe-flow.md`.

---

## 1. RESUMEN EJECUTIVO Y ESTADO DE RESOLUCIÓN

| ID | Hallazgo / Problema Identificado | Archivo(s) Afectado(s) | Estado Actual | Solución Implementada / Acción Pendiente |
| :--- | :--- | :--- | :--- | :--- |
| **INV-01** | Distorsión de valorización en bodega ($6.586M inflado por gramos vs kg). | `apps/api/src/inventory/inventory.service.js` | **[RESUELTO]** | Normalización incondicional de escala en `findAll`: si la unidad base es `G`/`ML` y el costo unitario $> 100$, divide entre 1.000. `valorTotalBodega` ahora refleja valores operativos reales. |
| **INV-02** | Ausencia de utilidad de conversión canónica de unidades (masa/volumen). | `apps/api/src/common/utils/unit-converter.js` | **[RESUELTO]** | Implementada clase pura `UnitConverter` con normalización de sinónimos (`G`, `KG`, `ML`, `L`, etc.) y cálculo exacto de factores de escala `getConversionFactor`. |
| **PRD-01** | Deducción de BOM en producción sin normalización a `Insumo.unidadBase`. | `apps/api/src/production/production.repository.js` | **[RESUELTO]** | En el cálculo de insumos regulares, `det.cantidadRequerida` se convierte a `cantEnUnidadBase` usando `UnitConverter.convert(...)` antes de contrastar stock físico y calcular `costoTeorico`. |
| **PRD-02** | Trazabilidad y reserva de inóculo / semielaborados WIP con múltiples lotes FEFO. | `apps/api/src/production/production.repository.js` | **[RESUELTO]** | Soporte para agregación de lotes `SEMIELABORADO_WIP`, conversión automática de litros a gramos/ml en BOM y cálculo de stock comprometido. |
| **DB-01** | Semillas y datos históricos en BD con precios en KG asignados a insumos en Gramos. | Base de datos PostgreSQL (`Precios_Proveedores`, `Insumos`) | **[PENDIENTE / VIGENTE]** | Los registros históricos en base de datos mantienen la discrepancia de origen. Aunque el backend ahora normaliza en runtime al calcular `valorTotal`, se requiere una migración/seed limpia para que `costoUnidadBase` coincida estrictamente con `Insumo.unidadBase`. |
| **SCH-01** | Modelo `Inventario` en Prisma no almacena unidad física explícita. | `apps/api/prisma/schema.prisma` | **[RESUELTO POR DISEÑO]** | Se mantiene gobernado por `Insumo.unidadBase` como invariante canónica única para evitar redundancia de columnas en BD. |

---

## 2. DETALLE TÉCNICO DE HALLAZGOS Y VERIFICACIÓN CONTRA EL CÓDIGO

### INV-01 / INV-02: Valorización y Conversor de Unidades
- **Diagnóstico Original:** El stock de `YOGUR GRIEGO` de $1.603,333\text{ g}$ se multiplicaba por $\$23.030\text{ COP}$ (costo por kilogramo), resultando en $\$36.924.768$ en lugar de $\$36.925$.
- **Código Verificado:** En `apps/api/src/inventory/inventory.service.js`:
  ```javascript
  const unidadBase = (item.insumo?.unidadBase || item.unidadMedida || '').toUpperCase().trim();
  const isSmallUnit = ['G', 'GRAMO', 'GRAMOS', 'ML', 'MILILITRO', 'MILILITROS'].includes(unidadBase);
  let costoPorUnidadBase = costoUnitario;
  if (isSmallUnit && costoUnitario > 100) {
    costoPorUnidadBase = costoUnitario / 1000;
    valorTotal = Math.round(stockActual * costoPorUnidadBase);
  }
  ```
- **Veredicto:** **RESUELTO**. El acumulador `metadata.valorTotalBodega` opera sobre los totales normalizados.

### PRD-01: Cálculo de Requerimientos y Costos en Producción
- **Diagnóstico Original:** Si una receta formulaba $500\text{ g}$ de un insumo cuya unidad base en inventario era `Kg`, el sistema descontaba $500\text{ Kg}$ o calculaba un costo $\times 1.000$.
- **Código Verificado:** En `apps/api/src/production/production.repository.js`:
  ```javascript
  const unidadBaseInsumo = det.insumo?.unidadBase || det.unidad || 'Unidades';
  const cantEnUnidadBase = UnitConverter.convert(reqTeorico, det.unidad, unidadBaseInsumo);
  const faltante = Math.max(0, cantEnUnidadBase - stockActual);
  ```
- **Veredicto:** **RESUELTO**. La comparación contra `stockActual` y la valoración teórica se ejecutan en la unidad base real.

---

## 3. ACCIONES PENDIENTES RECOMENDADAS (BACKLOG TÉCNICO)

1. **Limpieza de Seeds (`Precios_Proveedores`):**
   - Ejecutar script de calibración en `Precios_Proveedores` para recalcular `costoUnidadBase = precioCompra / cantidadEquivalenteBase`.
2. **Validación Poka-Yoke en Compras:**
   - Forzar en la creación de compras y cotizaciones de proveedores que la unidad seleccionada corresponda a la familia física de la unidad base del insumo.
