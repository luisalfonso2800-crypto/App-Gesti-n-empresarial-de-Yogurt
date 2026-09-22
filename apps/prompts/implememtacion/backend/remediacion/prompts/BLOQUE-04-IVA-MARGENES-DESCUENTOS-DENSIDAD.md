Prompt del Bloque 4 (IVA, márgenes, descuentos, densidad)
Este bloque es pesado: 6 hallazgos originales + 2 deudas técnicas (HAL-F2-03 parcial + recálculo de sales incompleto del Bloque 1).

text
# BLOQUE 4 DE REMEDIACIÓN — IVA, MÁRGENES, DESCUENTOS Y DENSIDAD

## Contexto
Auditoría forense completada (INFORME-36).
Bloques 1, 2 y 3 completados.
Hallazgos a corregir en este bloque:
- HAL-F4-04 (ALTO): Backend toma cantidad × precioUnitario como base
  gravable si omite campo.
- HAL-F7-01 (CRÍTICO): Margen dashboard sobre precio con IVA.
- HAL-F7-02 (CRÍTICO): Base gravable errónea si precioIncluyeIva = false.
- HAL-F7-03 (CRÍTICO): Descuento aplicado antes de base gravable.
- HAL-F7-04 (MEDIO): Confusión descuentos comerciales vs financieros.
- HAL-F4-06 (MEDIO): Redondeo IVA línea a línea.

Deudas técnicas pendientes del Bloque 1:
- El recálculo de sales asume precioIncluyeIva = false y usa
  Math.round por línea (introdujo HAL-F4-06 en backend).
- Se debe completar la lógica según precioIncluyeIva.

Deuda técnica pendiente del Bloque 3:
- HAL-F2-03 parcial: production.repository.js L210-212 sigue usando
  factor 1000 entre g y ml sin densidad explícita. Crear campo
  densidad en Insumo/Producto (default 1.0) y consumirlo.

## Alcance
- apps/api/src/sales/sales.repository.js
- apps/api/src/sales/sales.service.js
- apps/api/src/dashboard/dashboard.service.js
- apps/api/src/supplier-prices/supplier-prices.service.js
- apps/api/src/production/production.repository.js (HAL-F2-03)
- apps/web/src/app/catalog/recipes/hooks/useSaleForm.js
- apps/web/src/app/dashboard (si aplica)
- schema.prisma (añadir densidad)

## Reglas de ejecución
- Cada fix cita su hallazgo origen.
- Cada fix incluye su test de regresión (TEST-AUD-06, TEST-AUD-09,
  TEST-AUD-20, TEST-AUD-21, TEST-AUD-EMERG-02).
- Un commit atómico por hallazgo.
- Rama: remediation/bloque-4-iva-margenes.
- NO modificar fixes de Bloques 1, 2 y 3.
- Si aparece hallazgo nuevo, va a BACKLOG_POST_AUDITORIA.md.
- DETENERSE al terminar. No avanzar a Bloque 5.

## Tareas

### T1. Añadir campo densidad (HAL-F2-03)
En schema.prisma:
- Añadir `densidad Decimal? @default(1.0) @db.Decimal(6,4)` a
  modelos Insumo y Producto.
- Migración: valores default 1.0 para registros existentes.
En production.repository.js L210-212:
- Reemplazar el factor 1000 directo por:
const densidad = Number(insumo.densidad || 1.0);
const qtyConvertida = convertVolumeToMass(qtyReal, densidad);

text
- Aplicar según la magnitud (si detUnidad es MASA y lote en VOLUMEN,
o viceversa).
Documentar convención: si densidad = 1.0, comportamiento anterior
(1 L = 1 kg). Si densidad > 1.0 (leche), corrige el error del 3.2%.

### T2. Corregir lógica de IVA en sales.repository.js (HAL-F7-02)
El fix del Bloque 1 hizo:
subtotalConDesc = Math.max(0, subtotalLinea - descuentoLinea)
baseLinea = subtotalConDesc
montoIva = Math.round(baseLinea * tarifaIva)

text
Eso asume precioIncluyeIva = false siempre.

Fix correcto:
const precioIncluyeIva = detalle.precioIncluyeIva ?? producto.precioIncluyeIva ?? false;
const brutoLinea = cantidad * precioUnitario;
const subtotalConDesc = Math.max(0, brutoLinea - descuentoLinea);
let baseLinea, ivaLinea;
if (precioIncluyeIva) {
baseLinea = subtotalConDesc / (1 + tarifaIva / 100);
ivaLinea = subtotalConDesc - baseLinea;
} else {
baseLinea = subtotalConDesc;
ivaLinea = baseLinea * (tarifaIva / 100);
}
totalLinea = baseLinea + ivaLinea;

text
Persistir baseLinea, ivaLinea, totalLinea sin redondear a entero.
El redondeo fiscal se aplica al total de factura (HAL-F4-06).

### T3. Corregir redondeo fiscal (HAL-F4-06)
- NO aplicar Math.round por línea.
- Calcular IVA y base con precisión completa (Decimal o al menos
  Number con redondeo solo al persistir en @db.Decimal(12,2)).
- Redondeo del total de factura: se hace al final sumando todas las
  líneas y redondeando UNA VEZ.
- Alinear frontend (useSaleForm.js) con esta lógica.

### T4. Corregir orden descuento → base → IVA (HAL-F7-03)
- El descuento comercial reduce la base gravable.
- El descuento financiero (pronto pago) NO reduce la base.
- Distinguir tipo de descuento en el payload o en el modelo.
- Aplicar la secuencia correcta:
brutoLinea = cantidad * precioUnitario
if (descuentoComercial) {
baseDespuesComercial = brutoLinea - descuentoComercial
} else {
baseDespuesComercial = brutoLinea
}
if (precioIncluyeIva) {
baseGravable = baseDespuesComercial / (1 + tarifaIva/100)
} else {
baseGravable = baseDespuesComercial
}
ivaCalculado = baseGravable * (tarifaIva/100)
if (descuentoFinanciero) {
descuentoPosterior = ivaCalculado + baseGravable - descuentoFinanciero
}
totalLinea = baseGravable + ivaCalculado - descuentoFinanciero

text

### T5. Corregir margen del dashboard (HAL-F7-01)
En dashboard.service.js L562:
- Actual: `margen = ((precioVenta - costoUnitario) / precioVenta) * 100`.
- Fix:
const precioSinIva = precioIncluyeIva
? precioVenta / (1 + tarifaIva / 100)
: precioVenta;
const margen = ((precioSinIva - costoUnitario) / precioSinIva) * 100;

text
- Verificar que el cálculo usa el costo correcto (de HAL-F4-01
resuelto en Bloque 2).

### T6. Corregir base gravable en supplier-prices (HAL-F4-04 y HAL-F7-04)
- HAL-F4-04 se corrigió parcialmente en Bloque 1 (Zod), pero
verificar que el cálculo de `costoUnidadBase` en
supplier-prices.service.js L52 sigue siendo:
`precioTotalConIva / cantidadEquivalenteBase`
Eso es incorrecto. Debe ser:
`precioSinIva / cantidadEquivalenteBase`
Aplicar el cálculo de IVA según normativa DIAN.
- HAL-F7-04: si el descuento es financiero, no debe restarse de
la base. Documentar la decisión.

### T7. Tests de regresión
TEST-AUD-06: IVA agrupado por base sin descuadre de centavos.
TEST-AUD-09: Venta con precioIncluyeIva = false suma IVA correctamente.
TEST-AUD-20: Descuento comercial reduce base; financiero no.
TEST-AUD-21: Densidad leche 1.032 → costos corregidos 3.2%.
TEST-AUD-EMERG-02: Compra con unidadBase = 'oz' escala por 29.5735.

### T8. Smoke test
- Crear venta con precioIncluyeIva = true → verificar base e IVA.
- Crear venta con precioIncluyeIva = false → verificar.
- Crear venta con descuento comercial → verificar base reducida.
- Crear venta con descuento financiero → verificar base NO reducida.
- Producir lote con insumo lácteo (densidad 1.032) → verificar
costo correcto.
- Verificar margen del dashboard para un producto.

### T9. Verificación y cierre
- Correr suite completa (19 + ~5 = ~24 tests).
- Confirmar 0 regresiones.
- Documentar en INFORME-REMEDIACION-04.md.

## Formato de entrega
- INFORME-REMEDIACION-04.md con T1-T9.
- Máximo 2000 palabras.
- DETENERSE. No avanzar a Bloque 5.

## Criterios de aceptación
1. HAL-F4-04, HAL-F4-06, HAL-F7-01, HAL-F7-02, HAL-F7-03,
 HAL-F7-04, HAL-F2-03 marcados como RESUELTOS.
2. Venta con precioIncluyeIva = true calcula base e IVA correctos.
3. Descuento comercial reduce base; financiero no.
4. Margen dashboard sin IVA.
5. Densidad se usa en producción láctea.
6. 0 regresiones en tests de Bloques 1, 2, 3.
7. Smoke test funcional documentado.