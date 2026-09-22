# FASE 10 — SCHEMA PRISMA Y FRONTEND VS BACKEND

## Reglas heredadas
- NO modificar código.
- NO asumir que un campo existe porque su nombre lo sugiere.
- Si no se puede demostrar, marcar NO VERIFICADO.
- Máximo 1500 palabras. Tablas > prosa.
- DETENERSE al terminar. No avanzar a Fase 11.

## Contexto heredado (36 hallazgos únicos)
Los hallazgos previos ya cubrieron:
- Uso de Number() (HAL-F4-07, 288 ocurrencias)
- Redondeos (HAL-F4-06, HAL-F6-01, HAL-F6-03)
- Hardcoding de unidades (HAL-F3-02)
- Fórmulas matemáticas (Fase 4)
- Kardex, ventas, finanzas (Fase 9)

## Tareas

### T1. Matriz de tipos en schema.prisma
Recorrer schema.prisma completo y listar:
- Todos los campos @db.Decimal(X,Y): nombre | tabla | precisión |
  escala | uso | riesgo de insuficiencia.
- Todos los campos Float: nombre | tabla | uso | ¿debería ser Decimal?
- Todos los campos Int: nombre | tabla | uso | ¿debería ser Decimal?
- Campos con nombres ambiguos (cantidad, monto, valor, precio, costo,
  total, saldo, stock).

### T2. Auditoría de escalas Decimal
Identificar inconsistencias:
- Decimal(12,2) para dinero → ¿suficiente?
- Decimal(12,4) para cantidades → ¿suficiente para micro-ingredientes
  (mg, ml)?
- Decimal(5,2) para porcentajes → ¿cubre IVA 19%, mermas hasta 99.99%?
- Decimal(14,2) para grandes cantidades → ¿suficiente para acumulados
  anuales?
Ejemplo: si un campo es Decimal(10,2) y almacena costos unitarios
por gramo de insumos muy costosos (ej. $3,500.75/g), el límite
superior es 99,999,999.99. ¿Se puede superar?

### T3. Consistencia de tipos entre schema y DTOs
- ¿Los DTOs usan number o string para campos Decimal?
- ¿Los DTOs validan con class-validator o manualmente?
- ¿Los DTOs redondean o truncan antes de guardar?
- ¿Hay campos Decimal que se exponen al frontend como number y pierden
  precisión?

### T4. Auditoría de frontend: ¿duplica cálculos?
Buscar en apps/web:
- Cálculos de IVA (useSaleForm.js ya visto)
- Cálculos de subtotal y total
- Cálculos de descuento
- Cálculos de margen
- Cálculos de stock o disponibilidad
Para cada cálculo: ¿está duplicado con el backend?
¿Los resultados coinciden o divergen?

### T5. Discrepancias frontend vs backend
Identificar casos donde:
- Frontend calcula X y backend calcula Y (distintos).
- Frontend redondea con Math.round, backend con Decimal.
- Frontend envía datos calculados sin que el backend los valide.
Ejemplos documentados: HAL-F4-06 (redondeo IVA línea), HAL-F5-03
(cuádruple casteo).
Formalizar como hallazgo si no está ya cubierto.

### T6. Relación con hallazgos previos
- HAL-F4-07 (288 Number()): ¿qué porcentaje está en frontend?
- HAL-F5-03 (cuádruple casteo): ¿hay más casos similares?
- HAL-F4-06 (redondeo IVA): ¿frontend y backend usan redondeos
  distintos?

## Formato de hallazgos
ID: HAL-F10-XX
Severidad | Archivo | Línea | Campo / Tipo |
Problema | Ejemplo numérico | Impacto | Condición que lo dispara.

## Entrega
- Matriz de tipos Prisma (T1)
- Auditoría de escalas (T2)
- Consistencia schema vs DTOs (T3)
- Frontend duplica cálculos (T4)
- Discrepancias frontend vs backend (T5)
- Relación con fases previas (T6)
- Conteo por severidad
- NO VERIFICADO
- Máximo 1500 palabras
- DETENERSE. No avanzar a Fase 11.