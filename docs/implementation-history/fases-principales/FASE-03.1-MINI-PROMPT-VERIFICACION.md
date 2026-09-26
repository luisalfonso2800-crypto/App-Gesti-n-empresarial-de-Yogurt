Mini-prompt de verificación (Fase 3.1)
text
# VERIFICACIÓN POST-BLOQUE 3 — RESOLUCIÓN DE AMBIGÜEDADES

## Reglas
- NO modificar código todavía.
- Máximo 300 palabras.
- DETENERSE al terminar.

## Tareas

### T1. Verificar HAL-F2-03
- Buscar en production.repository.js L195-212 y L425-429 las líneas
  que aplican factor 1000 entre g y ml.
- ¿Fueron modificadas en el Bloque 3?
- Si NO fueron modificadas: HAL-F2-03 está PARCIALMENTE RESUELTO
  (herramienta creada, no consumida).
- Si SÍ fueron modificadas: citar el cambio.

### T2. Documentar convención de inventario
- ¿El stock de insumos se lleva siempre en g/ml o en la unidad
  base del insumo?
- Citar evidencia en código (campo `unidadBase` en Insumo, uso en
  inventory.repository.js).
- ¿El fix de HAL-F1-04 respeta esa convención?

### T3. Verificar simetría de convertVolumeToMass
- ¿Existe convertMassToVolume?
- Si no, ¿cómo se hace la conversión inversa?
- Documentar.

### T4. Smoke test de frontend
- Abrir UI de recetas.
- Intentar guardar receta con kg + g + oz + mg.
- Confirmar que se guarda sin error.
- Documentar resultado.

### T5. Actualizar BACKLOG si aplica
Registrar en BACKLOG_POST_AUDITORIA.md:
- HAL-F2-03 parcial si no se modificó production.repository.js.
- Convención de inventario si no está documentada.

## Entrega
- Resultado T1-T4.
- Estado real de HAL-F2-03 y HAL-F1-04.
- Máximo 300 palabras.
- DETENERSE.