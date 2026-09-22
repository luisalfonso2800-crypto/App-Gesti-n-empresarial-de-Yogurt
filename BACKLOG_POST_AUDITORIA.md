# BACKLOG POST-AUDITORÍA

Hallazgos nuevos detectados durante la fase de remediación.
NO forman parte del informe de auditoría (39 hallazgos cerrados).
Se revisarán al finalizar los 7 bloques de remediación.

## Formato de entrada

### [BLOQUE-N] HAL-FX-YY (o título descriptivo)
- **Detectado en:** archivo:línea
- **Descripción:** ...
- **Severidad estimada:** CRÍTICO / ALTO / MEDIO / BAJO
- **Bloque donde se detectó:** Bloque N
- **Acción sugerida:** ...

---

## Hallazgos registrados

### [BLOQUE-1] DEUDA-BLOQUE1-01: Asunción de precioIncluyeIva y redondeo por línea en recálculo de ventas
- **Detectado en:** `apps/api/src/sales/sales.repository.js`: L148-158
- **Descripción:** El recálculo forzoso server-side del Bloque 1 asume tarifa estándar del 19% si aplicaIva es true sin evaluar si el precio base de catálogo ya incluía IVA (`precioIncluyeIva`), y liquida el IVA redondeando por línea (`Math.round`) en lugar de base imponible agrupada.
- **Severidad estimada:** ALTO
- **Bloque donde se detectó:** Bloque 1 (Acción previa Bloque 3)
- **Acción sugerida:** Resolver en Bloque 4 (Costos, IVA y Descuentos).

### [BLOQUE-3] DEUDA-BLOQUE3-01: Ausencia de columna de densidad en modelo Insumo
- **Detectado en:** `apps/api/src/common/units/unit-registry.js`: L160-170
- **Descripción:** La conversión automática masa ↔ volumen no puede generalizarse a nivel de base de datos sin un campo `densidad` por insumo en `schema.prisma`.
- **Severidad estimada:** MEDIO
- **Bloque donde se detectó:** Bloque 3
- **Acción sugerida:** Mantener función defensiva `convertVolumeToMass(qty, density)` con densidad obligatoria. Evaluar migración de schema en bloque futuro si el negocio lo demanda.
