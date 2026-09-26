# BLOQUE 1 DE REMEDIACIÓN — BLINDAJE DE SEGURIDAD SERVER-SIDE

# BLOQUE 1 DE REMEDIACIÓN — BLINDAJE DE SEGURIDAD SERVER-SIDE

## Contexto
Auditoría forense completada (INFORME-36).
Hallazgos a corregir en este bloque:
- HAL-F10-01 (CRÍTICO): DTOs transaccionales vacíos.
- HAL-F10-02 (CRÍTICO): Backend confía en totales del cliente.

Causa raíz común (INFORME-33): ValidationPipe está configurado en
main.js con whitelist=true, transform=true, forbidNonWhitelisted=true,
pero es INOPERANTE porque los DTOs son clases JavaScript vacías sin
decoradores y sin metadata de TypeScript. NestJS trata el body como
Object genérico y no valida ni filtra nada.

## Alcance
Módulos afectados: sales, purchases, payments, lots.
Archivos DTOs: apps/api/src/{sales,purchases,payments,lots}/dto/*.js
Archivos repositorios: apps/api/src/{sales,purchases,payments,lots}/*.repository.js
Framework: NestJS + JavaScript (SIN TypeScript).

## Reglas de ejecución
- Cada fix cita su hallazgo origen (HAL-F10-01, HAL-F10-02).
- Cada fix incluye su test de regresión (TEST-AUD-14, TEST-AUD-15).
- Un commit atómico por hallazgo (dos commits mínimo).
- Rama: remediation/bloque-1-seguridad.
- NO modificar el informe de auditoría (INFORME-36).
- Si aparece hallazgo nuevo, va a BACKLOG_POST_AUDITORIA.md.
- DETENERSE al terminar. No avanzar a Bloque 2 sin autorización.

## Tareas

### T1. Decidir estrategia de validación
Tres opciones viables sin TypeScript:
A) Zod (validación explícita, sin decoradores, integración limpia).
B) Joi (schema declarativo).
C) Validación manual con funciones helper.

Criterios de decisión:
- Menor impacto en código existente.
- Compatibilidad con NestJS + JavaScript puro.
- Facilidad para escribir tests unitarios.
- Tamaño de la dependencia.

Recomendación esperada: A (Zod).
Decidir y justificar en el informe del bloque con al menos 3 razones.

### T2. Implementar validación de payload en ventas
- Instalar zod si no está instalado.
- Crear apps/api/src/sales/schemas/create-sale.schema.js.
- Validar:
  - detalles: array no vacío (min 1).
  - cada detalle: cantidad > 0, precioUnitario >= 0, descuento >= 0.
  - Si el payload incluye campos como baseGravable, ivaTotal,
    totalVenta, descuentoTotal: IGNORARLOS (no tomarlos del cliente).
  - Rechazar campos no declarados en el schema.
- Aplicar el schema en SalesService.create (antes del repository).
- Si falla, lanzar BadRequestException con detalle del campo inválido.

### T3. Implementar recálculo server-side en ventas
En apps/api/src/sales/sales.repository.js, en el flujo de creación:
- Descartar `data.subtotal`, `data.totalVenta`, `data.ivaTotal`,
  `data.descuentoTotal` si vienen del cliente.
- Recalcular desde `data.detalles`:
  - subtotalLinea = cantidad × precioUnitario
  - descuentoLinea: según tipo (ver HAL-F7-04, pero NO resolverlo
    aquí; solo aplicar la regla actual del sistema)
  - baseLinea: si precioIncluyeIva = true → subtotalLinea / (1 + tarifa)
    si false → subtotalLinea
  - ivaLinea = baseLinea × tarifa
  - totalLinea = baseLinea + ivaLinea
- Sumar a nivel de cabecera: subtotal, baseGravable, ivaTotal,
  descuentoTotal, totalVenta.
- Persistir los totales recalculados, NO los del cliente.

### T4. Replicar validación en compras, pagos y lotes
Mismo patrón para:
- create-purchase.schema.js + purchases.repository.js
- create-payment.schema.js + payments.repository.js
- create-lot.schema.js + lots.repository.js
Aplicar y recalcular donde aplique (compras sí, pagos parcialmente,
lotes según su semántica).

### T5. Tests de regresión (implementar, no solo proponer)
TEST-AUD-14: POST /sales con body { hack: 123 } → HTTP 400.
  Aserción: status 400 + mensaje incluye "hack" o similar.
TEST-AUD-15: POST /sales con un detalle de $10,000 y total declarado
  por el cliente $1 → backend recalcula y persiste $11,900 (IVA 19%).
  Aserción: venta.totalVenta === 11900.

Ambos tests en apps/api/src/sales/sales.controller.spec.js o
similar, usando el framework de tests ya existente (Jest).

### T6. Verificación final del bloque
- Correr suite completa (npm test en apps/api).
- Confirmar que los tests previos siguen verdes.
- Documentar cambios en INFORME-REMEDIACION-01.md con:
  - Estrategia elegida y justificación.
  - Archivos modificados (diff resumido).
  - Tests implementados y resultado.
  - Regresiones detectadas (esperado: ninguna).
  - Hallazgos nuevos → BACKLOG_POST_AUDITORIA.md.
  - Estado de HAL-F10-01 y HAL-F10-02: RESUELTOS o PENDIENTES.

## Formato de entrega
- INFORME-REMEDIACION-01.md con secciones T1 a T6.
- Máximo 1500 palabras.
- DETENERSE. No avanzar a Bloque 2.

## Criterios de aceptación del bloque
1. Payload con campos extra es rechazado con HTTP 400.
2. Venta enviada con total manipulado es recalculada por backend.
3. TEST-AUD-14 y TEST-AUD-15 pasan (no fallan, no se saltan).
4. Ningún test previamente verde se puso rojo.
5. HAL-F10-01 y HAL-F10-02 marcados como RESUELTOS en el informe.
6. Informe del bloque entregado.