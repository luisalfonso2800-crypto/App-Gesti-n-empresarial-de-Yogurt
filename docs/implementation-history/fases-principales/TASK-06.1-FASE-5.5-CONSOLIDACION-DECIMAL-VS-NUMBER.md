# FASE 5.5 — CONSOLIDACIÓN DE HALLAZGOS DECIMAL VS NUMBER

## Reglas
- NO modificar código.
- NO avanzar a Fase 6.
- Máximo 300 palabras.

## Tareas

### T1. Reformular HAL-F5-01, HAL-F5-02, HAL-F5-04
No son hallazgos independientes. Son instancias materializadas de
HAL-F4-07 (conversión sistemática Decimal→Number).
Reformular como sub-ítems dentro de HAL-F4-07:

HAL-F4-07 (CRÍTICO arquitectónico):
  Instancias verificadas:
  - production.repository.js L732-739 (Kardex insumos)
  - inventory.repository.js L150-164 (CPP)
  - sales.repository.js L127-132 (Kardex terminados)
  - production.repository.js L1027-1039 (WIP)
  - payments.repository.js L54-59 (cartera)
  - 288 conversiones Number() en backend

### T2. Mantener HAL-F5-03 como hallazgo independiente
La cuádruple conversión frontend ↔ backend (BD → JSON → Number → Backend
Number) es una capa nueva que HAL-F4-07 no cubría.
Severidad: ALTO.
ID único: HAL-F5-03.

### T3. Aclarar serialización Prisma → JSON
Determinar si Prisma envía Decimal como string o number al frontend.
Citar versión de Prisma o marcar NO VERIFICADO — requiere prueba.

### T4. Cuantificar las 288 conversiones
Desglose aproximado:
- X en cálculos financieros (CRÍTICAS)
- Y en logging/formateo (inocuas)
- Z en DTOs de presentación (bajo riesgo)

### T5. Corregir conteo
Fase 5:
- CRÍTICO: 0 nuevos
- ALTO: 1 nuevo (HAL-F5-03)
- Instancias verificadas de HAL-F4-07: 5
Acumulado único: 13 CRÍTICOS + 9 ALTOS + 1 MEDIO = 23.

## Entrega
- HAL-F4-07 reformulado con instancias.
- HAL-F5-03 mantenido.
- Serialización aclarada o marcada.
- Conteo corregido.
- Máximo 300 palabras.
- DETENERSE. Listo para autorizar Fase 6.