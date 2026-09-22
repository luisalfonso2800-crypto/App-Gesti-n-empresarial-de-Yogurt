# FASE 7.5 — CIERRE DE COSTOS, IVA Y DESCUENTOS

## Reglas
- NO modificar código.
- NO avanzar a Fase 8.
- Máximo 300 palabras.

## Tareas

### T1. Reclasificar HAL-F7-03
De MEDIO a ALTO.
Justificación: permite facturar a $0 silenciosamente sin autorización
ni alerta. Riesgo de fraude interno y control de ingresos.
Combinación con HAL-F4-08 agrava (Math.max oculta la transacción).

### T2. Formalizar HAL-F7-04 (descuentos comerciales vs financieros)
Verificar si el sistema distingue tipo de descuento.
- Si distingue: marcar NO APLICA.
- Si no distingue: formalizar como MEDIO.
Ejemplo:
  Descuento pronto pago 5% sobre $119,000:
  Actual: base = (119000 × 0.95) / 1.19 = 95,000; IVA = 18,050
  Esperado: base = 100,000; IVA = 19,000; descuento financiero = 5,950

### T3. Vincular HAL-F7-01 con HAL-F4-01
Nota: el margen visible en dashboard acumula dos errores:
1. CPP congelado (HAL-F4-01) → costo incorrecto.
2. Margen sobre precio con IVA (HAL-F7-01) → ingreso inflado.
Distorsión final = producto de ambos errores.

### T4. Actualizar conteo
Fase 7: 1 CRÍTICO + 2 ALTOS + 1 MEDIO = 4.
Acumulado: 14 CRÍTICOS + 11 ALTOS + 3 MEDIOS = 28 únicos.

## Entrega
- HAL-F7-03 reclasificado.
- HAL-F7-04 formalizado o marcado no-aplica.
- Nota de vinculación F7-01 ↔ F4-01.
- Conteo actualizado.
- Máximo 300 palabras.
- DETENERSE. Listo para autorizar Fase 8.