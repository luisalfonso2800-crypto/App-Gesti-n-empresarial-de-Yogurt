# FASE 5 — AUDITORÍA DECIMAL VS NUMBER

## Reglas heredadas
- NO modificar código.
- NO asumir que un Number() es inocuo.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 1500 palabras. Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 6.

## Premisa correcta (heredada de HAL-F4-07)
- La BD usa @db.Decimal en schema.prisma.
- Prisma devuelve objetos Decimal nativos.
- El código convierte a Number() o parseFloat() antes de operar.
- NO existe decimal.js/big.js/bignumber.js instalado.

## Tareas

### T1. Inventario exhaustivo de conversiones
Grep en apps/api y apps/web por:
- Number(
- parseFloat(
- parseInt(
- .toNumber()      (método de Prisma.Decimal)
- .toFixed(
- + variable       (coerción unaria)
- variable * 1     (coerción por multiplicación)

Para cada ocurrencia, documentar:
archivo | línea | campo de origen | tipo original | tipo destino |
motivo aparente | operación posterior | riesgo.

### T2. Cadena Decimal → Number → cálculo → Decimal
Identificar todas las cadenas donde:
1. Se lee un Decimal de Prisma.
2. Se convierte a Number.
3. Se opera aritméticamente.
4. Se reconvierte a Decimal para guardar.

Ejemplo: 
const stock = Number(inv.cantidadActual); // Decimal → Number
const nuevo = stock - qty;                 // aritmética float64
await prisma.update({ data: { cantidadActual: nuevo } }); // Number → Decimal

Para cada cadena: archivo | línea inicial | línea final | campos |
operación | ejemplo numérico del error esperado.

### T3. Cálculos financieros con Number
Priorizar:
- Costos (costoPromedio, costoUnidadBase, costoReal, costoTeorico)
- Precios (precioUnitario, precioCompra)
- Totales (subtotal, baseGravable, IVA, total, saldo)
- Utilidad y margen
- IVA y descuentos

Para cada uno: ¿Se opera en Number o Decimal? ¿Se reconvierte?

### T4. Frontend: JSON → Number → Decimal
Cuando el frontend recibe JSON del backend (que envía Decimals como
strings o numbers), ¿cómo los trata?
- ¿Los parsea a Number?
- ¿Los envía de vuelta como Number?
- ¿Los redondea antes de enviar?
Buscar en apps/web/src/services, hooks, formularios.

### T5. Ejemplos numéricos demostrados
Para al menos 3 cadenas distintas (inventario, costo, IVA):
- Entrada
- Operación actual (con Number)
- Resultado actual
- Operación esperada (con Decimal)
- Resultado esperado
- Diferencia cuantificada

Ejemplo clásico:
  0.1 + 0.2 = 0.30000000000000004
  Si se multiplica por 1000 → 300.00000000000006
  Si se redondea → 300 (ok) o 301 (según orden)
  Si se acumula 10 veces → error acumulativo visible.

### T6. Relación con hallazgos previos
- HAL-F4-07 (conversión sistemática): ¿dónde se materializa?
- HAL-F1-03 (heurística >100): ¿se beneficia de Number?
- HAL-F4-05 (IVA en costo): ¿usa Number?
- HAL-F4-06 (redondeo por línea): ¿usa Number + Math.round?

## Formato de hallazgos
ID: HAL-F5-XX
Severidad | Archivo | Línea | Campo | Problema |
Cadena Decimal→Number→Decimal | Ejemplo numérico |
Impacto | Condición que lo dispara.

## Entrega
- Inventario de conversiones (T1)
- Cadenas identificadas (T2)
- Cálculos financieros con Number (T3)
- Frontend JSON→Number (T4)
- Ejemplos demostrados (T5)
- Relación con fases previas (T6)
- Conteo por severidad
- NO VERIFICADO
- Máximo 1500 palabras
- DETENERSE. No avanzar a Fase 6.