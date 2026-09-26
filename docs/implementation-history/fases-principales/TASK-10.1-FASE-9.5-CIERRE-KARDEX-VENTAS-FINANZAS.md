# FASE 9.5 — CIERRE DE KARDEX, VENTAS Y FINANZAS

## Reglas
- NO modificar código.
- NO avanzar a Fase 10.
- Máximo 350 palabras.

## Tareas

### T1. Resolver comportamiento real de HAL-F9-01
Determinar si Prisma lanza excepción o devuelve 0 cuando se consulta
campo inexistente 'cantidadProducida'.
- Si es excepción: el dashboard falla visiblemente → sin agravante.
- Si es retorno 0: el módulo de metas está muerto silenciosamente
  → añadir agravante explícito.
Citar versión de Prisma y comportamiento documentado.

### T2. Documentar cascada dashboard
HAL-F7-01 (margen sobre precio con IVA) y HAL-F9-02 (utilidad neta
sin recaudo) son dos distorsiones independientes del mismo dashboard.
Presentarlas juntas como "Cascada de distorsiones gerenciales".
No requiere ID nuevo, solo anotación.

### T3. Marcar HAL-F9-04 como REQUIERE VALIDACIÓN
El bloqueo de anticipos puede ser intencional.
Verificar:
- ¿Existe campo saldoAFavor en schema?
- ¿Hay requisito de negocio documentado?
Si no hay evidencia: marcar como REQUIERE VALIDACIÓN CON NEGOCIO
antes de mantener severidad ALTO.

### T4. Ampliar HAL-F9-03 con impacto fiscal
Añadir: "Sin stockAnterior/stockNuevo, no hay trazabilidad auditable
de Kardex. Riesgo en inspección DIAN o auditoría interna."
Mantener ALTO.

### T5. Actualizar conteo
Fase 9: 2 CRÍTICOS + 2 ALTOS = 4.
Acumulado: 17 CRÍTICOS + 16 ALTOS + 3 MEDIOS = 36.

## Entrega
- HAL-F9-01 resuelto (excepción vs 0).
- Cascada dashboard anotada.
- HAL-F9-04 marcado o confirmado.
- HAL-F9-03 ampliado.
- Conteo actualizado.
- Máximo 350 palabras.
- DETENERSE. Listo para autorizar Fase 10.