# TASK — FIX PRODUCCIÓN → VER LOTE

## OBJETIVO

Diagnosticar y corregir exclusivamente la navegación de:

Producción → "Ver Lote: XXXXXXXX"

Actualmente la acción navega a Inventario.

Primero identifica la causa raíz. Solo modifica código si la navegación realmente es incorrecta.

---

## ALCANCE

Investigar únicamente:

- componente que renderiza "Ver Lote";
- componente padre que proporciona la acción;
- callback relacionado;
- hook/utilidad de navegación relacionada;
- rutas existentes de production, lots e inventory.

Prioridad inicial:

apps/web/src/app/operations/production/components/ProductionOrderCard.jsx

NO investigar todo el proyecto.

NO modificar backend.

NO modificar estilos.

NO modificar Design System.

NO refactorizar.

NO modificar rutas no relacionadas.

NO realizar mejoras adicionales.

---

## TRAZABILIDAD OBLIGATORIA

Reconstruye exactamente esta cadena:

"Ver Lote"
→ componente
→ callback
→ hook/utilidad, si existe
→ router.push / Link / navegación centralizada
→ ruta final

Determina:

1. archivo responsable;
2. función responsable;
3. identificador real del lote utilizado;
4. ruta exacta generada actualmente.

---

## CLASIFICACIÓN DE CAUSA

Determina cuál aplica:

A — Ruta incorrecta hardcodeada.

B — Función/utilidad devuelve Inventario incorrectamente.

C — Producción recibe un callback incorrecto.

D — Existe una ruta de Lotes pero se utiliza accidentalmente Inventario.

E — La navegación a Inventario es intencional según la implementación actual.

F — El identificador del lote es incorrecto/inexistente y provoca un fallback.

No asumir la respuesta antes de inspeccionar el código.

---

## CRITERIO FUNCIONAL

La acción:

"Ver Lote: XXXXXXXX"

representa el lote generado por Producción.

La arquitectura distingue:

Producción
→ genera el resultado

Lotes
→ conserva la identidad y trazabilidad del lote

Inventario
→ gestiona existencias y movimientos

No asumir que "Ver Lote" significa "Ver Inventario".

La decisión debe basarse exclusivamente en las rutas y navegación realmente implementadas.

---

## MODIFICACIÓN

NO modificar código durante la fase de diagnóstico.

Si la navegación actual es correcta:

NO MODIFICAR NADA.

Si es incorrecta:

realizar únicamente el cambio mínimo necesario para que:

Producción → Ver Lote

utilice el destino correcto YA EXISTENTE en el frontend.

No crear una nueva arquitectura de navegación.

No crear una ruta nueva salvo que la investigación demuestre que la ruta correspondiente ya está definida pero mal utilizada.

Conservar el identificador real del lote.

---

## VALIDACIÓN

Después del cambio, ejecutar:

node .agents/scripts/verify-srp.js

Además comprobar:

1. sintaxis válida de los archivos modificados;
2. "Ver Lote" genera la ruta correcta;
3. el identificador real del lote continúa utilizándose;
4. las demás acciones de ProductionOrderCard no fueron alteradas.

No corregir errores no relacionados.

---

## STOP CONDITION

Detenerse cuando:

- la causa raíz esté identificada;
- la navegación sea correcta o se haya determinado que no requiere cambio;
- la validación haya terminado.

No continuar con refactorizaciones ni mejoras.

---

## REPORTE FINAL

Responder únicamente con:

STATUS:
COMPLETADO / NO REQUIERE CAMBIO / BLOQUEADO

CAUSA:
[A-F] + explicación breve.

ARCHIVO:
archivo responsable.

CAMBIO:
qué se modificó, o "ninguno".

RUTA ANTERIOR:
ruta real encontrada.

RUTA CORRECTA:
ruta real existente.

IDENTIFICADOR:
campo/valor utilizado para identificar el lote.

VALIDACIÓN:
resultado de node .agents/scripts/verify-srp.js

No incluir código completo.
No realizar análisis adicional.