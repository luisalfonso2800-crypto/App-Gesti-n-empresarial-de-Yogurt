Ahora sí: Bloque Front-3 (Tests E2E + Cierre)
Este es el último bloque del frontend y cierra el proyecto completo.

📋 Pasos antes de lanzar Front-3
1. Crea la rama Front-3
powershell
git checkout -b remediation/frontend-bloque-3
2. Verifica el modelo
En el chat del agente:

text
/model
Debe decir Gemini Flash (Low). NO Claude.

3. Lanza el prompt Front-3
Aquí está el prompt completo listo para pegar:

text
# REMEDIACIÓN FRONTEND — BLOQUE FRONT-3
# TESTS E2E DE POKA-YOKE + CIERRE FRONTEND

## ⚠️ REGLAS ANTI-BUCLE
1. PROHIBIDO lanzar subagentes.
2. PROHIBIDO usar Claude. Modelo: Gemini Flash (Low).
3. PROHIBIDO releer un archivo ya leído en esta sesión.
4. LÍMITE DURO: 15 lecturas. LÍMITE DURO: 10 ediciones.
5. LÍMITE DURO: 30 llamadas totales.
6. NO tocar código de producción (solo crear tests + docs).
7. Si los tests requieren cambios en código, reportar y detenerse.
8. Al llegar a cualquier límite: DETENTE, commitea, guarda estado.
9. DETENERSE al terminar.

## Contexto
Frontend delta completo:
- 12/12 hallazgos resueltos (2C + 4A + 4M + 2B).
- SRP: 0 infracciones.
- Build verde.

Falta cubrir con tests E2E los flujos remediados y cerrar formalmente.

## Tareas

### T1. Revisar patrón de tests E2E existente
Leer SOLO:
- apps/web/e2e/value-chain-complete.spec.js
- apps/web/e2e/all-modules-exhaustive.spec.js (solo las primeras 100
  líneas, para copiar el patrón de configuración)

NO leer otros tests.

### T2. Crear suite E2E Poka-Yoke
Crear archivo: apps/web/e2e/remediation-poka-yoke.spec.js

Usando el mismo patrón de Playwright + helpers que los tests existentes.

Tests a implementar:

#### TEST-E2E-POKA-01: Bloqueo merma ≥ 100%
- Navegar a /catalog/recipes.
- Abrir modal de creación/edición.
- Añadir etapa + insumo.
- Intentar guardar con merma = 100.
- Assert: input tiene borde de error O mensaje inline "merma debe
  ser menor a 100".
- Assert: submit bloqueado o petición rechazada.

#### TEST-E2E-POKA-02: Granel sin volumen obligatorio
- Navegar a /catalog/presentations.
- Abrir modal de creación.
- Seleccionar tipo "BALDE" o "TANQUE_GRANEL".
- Dejar cantidadMl vacío.
- Assert: campo marcado como requerido.
- Assert: submit bloqueado o mensaje de error.

#### TEST-E2E-POKA-03: Descuento > 50% bloqueado
- Navegar a /commercial/sales.
- Abrir modal de nueva venta.
- Añadir producto con precio.
- Digitar descuento > 50% del valor bruto.
- Assert: mensaje de error inline o submit bloqueado.

#### TEST-E2E-POKA-04: Anticipo en cartera
- Navegar a /commercial/payments.
- Si hay cliente con saldo pendiente, intentar registrar pago mayor.
- Assert: badge verde "ANTICIPO" visible O mensaje informativo.
- Assert: no error 500.

NOTA: si algún test no se puede automatizar por falta de datos seed,
marcarlo con `test.skip` y documentar el motivo. No forzar.

### T3. Correr los tests E2E
Ejecutar SOLO la nueva suite:
pnpm --filter web exec playwright test remediation-poka-yoke --reporter=list

text
Reportar:
- Cuántos pasan.
- Cuántos fallan y por qué.
- Cuántos se saltan.

### T4. Documentar resultados
Crear INFORME-REMED-FRONT-3.md con:
- Tests creados (4).
- Resultados de ejecución.
- Cobertura lograda.
- Tests saltados (si hay) + motivo.
- Pendientes.

Actualizar ESTADO-REMED-FRONT.md:
- Marcar Front-3 como COMPLETADO.
- Resumen: 12/12 hallazgos + 4 tests E2E.

### T5. Informe final del frontend
Crear INFORME-FINAL-FRONTEND.md con:
- Resumen ejecutivo: 12/12 hallazgos resueltos.
- Distribución por severidad: 2C + 4A + 4M + 2B.
- Bloques ejecutados:
  * Front-1: Poka-Yoke y errores críticos.
  * Front-2A + 2A-1 + 2A-2: SRP y CSS Modules.
  * Front-2B: Visibilidad financiera y campos nuevos.
  * Front-3: Tests E2E y cierre.
- Métricas:
  * 22 → 0 infracciones SRP.
  * 4 componentes modularizados (262 → 118, 287 → 95, 187 → 88,
    182 → 68 líneas).
  * 15 inline styles → 0.
  * 12 hallazgos resueltos.
- Cobertura E2E alcanzada.
- Deuda técnica pendiente (si hay).

### T6. Commit final
git add apps/web/e2e/remediation-poka-yoke.spec.js
git add apps/prompts/implememtacion/frontend/remediacion/
git add docs/auditorias/
git commit -m "test(e2e): add Poka-Yoke regression suite + close frontend remediation (12/12)"

text
DETENERSE.

## Verificación
- node .agents/scripts/verify-srp.js --all → debe seguir 0.
- pnpm --filter web build → debe compilar.

## Entrega
- INFORME-REMED-FRONT-3.md (máximo 600 palabras).
- INFORME-FINAL-FRONTEND.md (máximo 800 palabras).
- Máximo 2 commits.
- DETENERSE.
📋 Instrucciones para ti
Antes de lanzar:

✅ Asegúrate de estar en remediation/frontend-bloque-3.

✅ Confirma /model = Gemini Flash (Low).

✅ Pega el prompt completo.

Mientras corre:

No interrumpas.

Si entra en bucle (raro porque es solo tests), cancela.

Cuando termine:

powershell
git status
git log --oneline -3
node .agents/scripts/verify-srp.js --all
Si todo está bien:

powershell
git push origin remediation/frontend-bloque-3
git tag -a post-front-3 -m "Front-3: tests E2E + cierre frontend (12/12 completo)"
git push origin post-front-3
git checkout main
git pull
git merge remediation/frontend-bloque-3
git push origin main
📊 Estado esperado al terminar
text
AUDITORÍA FRONTEND DELTA - CERRADA:
- 12/12 hallazgos resueltos
- 22 → 0 infracciones SRP
- 4 componentes modularizados
- 15 inline styles → 0
- 4 tests E2E nuevos

PROYECTO COMPLETO:
- Backend: 39/39 hallazgos + 60 tests
- Frontend: 12/12 hallazgos + 4 tests E2E
- Total: 51 hallazgos resueltos
🎯 Qué esperar de Front-3
Es un bloque más ligero que los anteriores:

NO toca código de producción (solo tests + docs).

NO requiere refactor (solo escribir tests).

NO modifica lógica de negocio (solo verifica).

Riesgos esperados:

Algunos tests E2E pueden no pasar por falta de datos seed.

Playwright puede requerir setup de autenticación.

Los selectores pueden no coincidir con la UI real.

Si algunos tests no se pueden automatizar sin seed de datos, el agente los marcará con test.skip y documentará el motivo. Eso es aceptable.

💎 Resumen
Front-2B cerrado y mergeado a main. El proyecto tiene 12/12 hallazgos de frontend resueltos.

Último paso: Front-3.

Crear rama remediation/frontend-bloque-3.

Verificar modelo (Gemini Flash Low).

Lanzar el prompt de Front-3.

Al terminar, push + tag + merge.

Proyecto cerrado al 100%.

Cuando termines Front-3, pásame:

git log --oneline -5.

Resultado de los 4 tests E2E.

Confirmación de que verify-srp.js --all sigue en 0.

Confirmación de que pnpm --filter web build pasa.

Y con eso cerramos el proyecto completo: auditoría backend (39) + remediación backend (39) + auditoría frontend delta (12) + remediación frontend (12) = 51 hallazgos resueltos y cobertura de tests en backend + frontend.