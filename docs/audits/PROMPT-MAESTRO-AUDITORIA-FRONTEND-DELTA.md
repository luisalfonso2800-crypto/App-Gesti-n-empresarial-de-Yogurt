🎯 Estrategia: cada fase guarda su informe + commit local
La idea es que cada fase haga 3 cosas antes de detenerse:

Guarda el informe en un archivo del repo.

Hace commit local (no push, para no gastar red).

Deja un "estado" en un archivo maestro que registra en qué fase va.

Así, si se corta la cuota:

El informe ya está guardado en disco.

El commit ya está hecho (aunque sea local).

El estado registra dónde se quedó para retomar exactamente ahí.

📋 Modificación del prompt maestro: guardado incremental
Voy a modificar el prompt maestro para incluir estas reglas anti-pérdida:

text
## REGLAS DE GUARDADO INCREMENTAL (críticas)

Después de CADA fase, sin excepción, el agente debe:

### 1. Guardar el informe
Crear `apps/prompts/implememtacion/frontend/auditorias/INFORME-AUD-FN.md`
con el contenido completo de la fase N.

### 2. Actualizar el estado global
Actualizar `apps/prompts/implememtacion/frontend/auditorias/ESTADO-AUDITORIA.md`
con el siguiente formato:

```markdown
# Estado de Auditoría Frontend Delta

## Fases completadas
- [x] F0 — Ingesta y reconciliación — COMPLETADA — 2026-09-22
- [x] F1 — Mapa actualizado — COMPLETADA — 2026-09-22
- [ ] F2 — Cálculos locales — PENDIENTE
- [ ] F3 — Manejo de errores — PENDIENTE
...

## Última fase ejecutada
F1 — Mapa actualizado — finalizada 2026-09-22 15:30

## Próxima fase
F2 — Cálculos locales

## Informe parcial de F2 (si aplica)
(En caso de corte a mitad de fase, dejar notas parciales aquí
para retomar exactamente donde quedó)
3. Commit local
Ejecutar:

text
git add apps/prompts/implememtacion/frontend/auditorias/
git commit -m "audit(frontend): fase FN completada - <título>"
NO hacer push (para no gastar cuota de red innecesariamente).
El humano puede hacer push manualmente si quiere.

4. Confirmar antes de detenerse
Reportar:

Informe guardado en: <ruta>

Estado actualizado: sí/no

Commit: <hash>

Próxima fase: FN+1

5. DETENERSE
text

## 📋 Prompt maestro completo con guardado incremental

Aquí está el prompt maestro definitivo con las reglas anti-pérdida integradas:
AUDITORÍA FRONTEND DELTA — PROMPT MAESTRO
(Con guardado incremental anti-pérdida)
REGLAS ANTI-QUEMA (obligatorias en TODAS las fases)
PROHIBIDO lanzar subagentes de cualquier tipo.

PROHIBIDO usar Claude Opus o Sonnet. Modelo: Gemini Flash (Low).

NO explorar todo el repositorio. Ir por capas.

En cada fase: máximo 15 lecturas de archivo.

NO modificar código de apps/web. Solo auditar.

Al terminar cada fase: crear informe, actualizar estado,
commit local, DETENERSE.

NO avanzar a la siguiente fase sin autorización del humano.

El humano dirá "continúa con Fase FN" para avanzar.

Priorizar verificación de hallazgos previos sobre exploración nueva.

REGLAS DE GUARDADO INCREMENTAL (críticas)
Después de CADA fase, sin excepción, el agente debe:

1. Guardar el informe
Crear apps/prompts/implememtacion/frontend/auditorias/INFORME-AUD-FN.md
con el contenido completo de la fase N.

2. Actualizar el estado global
Actualizar apps/prompts/implememtacion/frontend/auditorias/ESTADO-AUDITORIA.md
con el formato especificado en la sección ESTADO-AUDITORIA.md.

3. Commit local
text
git add apps/prompts/implememtacion/frontend/auditorias/
git commit -m "audit(frontend): fase FN completada - <título>"
NO hacer push (el humano lo hace manualmente).

4. Reportar antes de detenerse
Confirmar:

Informe guardado en: <ruta>

Estado actualizado: sí

Commit: <hash>

Próxima fase: FN+1

5. DETENERSE
CONTEXTO GENERAL
Auditoría DELTA del frontend post-remediación backend (39/39 resueltos).

Cambios del backend que impactan frontend:
Zod schemas en 4 módulos (rechazan campos extra).

unit-registry.js canónico (sincronizado en Bloque 6B).

decimal-utils.js (precisión financiera).

useSaleForm.js reescrito backend-first (no calcula localmente).

Campos nuevos: densidad, unidadCantidadProducida, saldoAFavor,
stockAnterior, stockNuevo, cantidadTeoricaOriginal.

Errores nuevos: BadRequestException en ~15 casos.

Dashboard: utilidadDevengada y flujoCajaReal separadas.

Schema: costos unitarios en Decimal(14,4).

Auditorías previas (7 archivos):
Ubicación: [INDICAR RUTA DONDE ESTÁN]
Lista:

AUDIT-CARTERA-VENTAS-PAGOS.md

AUDIT-EXPENSES-DASHBOARD-SCADA.md

AUDIT-INVENTORY-PRODUCTION-UNITS.md

AUDIT-RECIPES-BOM-COSTING.md

AUDIT-SUPPLY-CHAIN-AND-PURCHASES.md

AUDIT-TAX-IVA-PRODUCTS-SALES-IMPACT.md

AUDIT-TECHNICAL-DEBT-ARCHITECTURE.md

Los informes van en:
apps/prompts/implememtacion/frontend/auditorias/INFORME-AUD-FN.md

El estado global va en:
apps/prompts/implememtacion/frontend/auditorias/ESTADO-AUDITORIA.md

Formato de ESTADO-AUDITORIA.md:
markdown
# Estado de Auditoría Frontend Delta

## Fases completadas
- [x] F0 — Ingesta y reconciliación — COMPLETADA — 2026-09-22
- [x] F1 — Mapa actualizado — COMPLETADA — 2026-09-22
- [ ] F2 — Cálculos locales — PENDIENTE
- [ ] F3 — Manejo de errores — PENDIENTE
- [ ] F4 — Validaciones preventivas — PENDIENTE
- [ ] F5 — Unidades de medida — PENDIENTE
- [ ] F6 — Campos nuevos — PENDIENTE
- [ ] F7 — Dashboard — PENDIENTE
- [ ] F8 — Formato números — PENDIENTE
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
F1 — Mapa actualizado — finalizada 2026-09-22 15:30

## Próxima fase
F2 — Cálculos locales

## Informe parcial de la fase actual (si aplica)
(En caso de corte a mitad de fase, dejar notas parciales aquí
para retomar exactamente donde quedó. Ejemplo:
- Tarea T1 completada: leídos 5 archivos.
- Tarea T2 a medias: leídos 3 de 8.
- Pendiente: T2 completar, T3, T4.)
FASE F0 — INGESTA Y RECONCILIACIÓN
Tareas
Leer las 7 auditorías previas (solo secciones de hallazgos).

Extraer: ID hallazgo, severidad, archivo, línea, descripción.

Clasificar en: RESUELTO | VIGENTE | OBSOLETO | REAGRAVADO.

Construir matriz única consolidada.

Entregable
INFORME-AUD-F0.md (máximo 2500 palabras).

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F1 — MAPA ACTUALIZADO DEL FRONTEND
Tareas
Tomar el mapa de auditorías previas.

Verificar vigencia con 3-4 lecturas.

Añadir páginas/formularios nuevos.

Verificar límites SRP.

Entregable
INFORME-AUD-F1.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F2 — CÁLCULOS LOCALES DUPLICADOS (DELTA)
Tareas
Tomar inventario de cálculos locales de las auditorías previas.

Verificar cuáles siguen vigentes en el código actual.

Identificar cuáles se eliminaron en Bloque 6B.

Identificar duplicaciones residuales con el backend.

Divergencias frontend ↔ backend.

Entregable
INFORME-AUD-F2.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F3 — MANEJO DE ERRORES (NUEVOS BadRequestException)
Tareas
Listar los ~15 BadRequestException nuevos del backend.

Verificar si el frontend captura cada uno y muestra mensaje útil.

Identificar los que caen en catch genérico o mensaje feo.

Entregable
INFORME-AUD-F3.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F4 — VALIDACIONES PREVENTIVAS
Tareas
Tomar inventario de validaciones de auditorías previas.

Verificar vigencia.

Añadir validaciones faltantes para casos nuevos.

Reportar faltantes.

Entregable
INFORME-AUD-F4.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F5 — UNIDADES DE MEDIDA EN FRONTEND
Tareas
Verificar que todos los componentes usan unitNormalizer
sincronizado.

Verificar oz, mg y otras unidades.

Reportar usos ad-hoc o hardcodeados.

Entregable
INFORME-AUD-F5.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F6 — CAMPOS NUEVOS DEL BACKEND
Tareas
Listar campos nuevos: densidad, unidadCantidadProducida, saldoAFavor,
stockAnterior, stockNuevo, cantidadTeoricaOriginal, costoBaseSinIva.

Para cada uno: ¿capturado? ¿mostrado? ¿editable?

Reportar campos no expuestos.

Entregable
INFORME-AUD-F6.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F7 — DASHBOARD Y MÉTRICAS
Tareas
Verificar utilidadDevengada y flujoCajaReal separados.

Verificar margen sin IVA.

Verificar sumas crudas.

Reportar discrepancias.

Entregable
INFORME-AUD-F7.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F8 — FORMATO DE NÚMEROS, FECHAS, UNIDADES
Tareas
Verificar parseo de Decimal strings.

Verificar formato COP, fechas, porcentajes, cantidades.

Reportar inconsistencias.

Entregable
INFORME-AUD-F8.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F9 — CONTRATOS API FRONTEND ↔ ZOD
Tareas
Para cada endpoint POST/PUT: verificar payload vs Zod schema.

Reportar incompatibilidades.

Entregable
INFORME-AUD-F9.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F10 — ESTADOS DE CARGA Y FEEDBACK
Tareas
Verificar spinners, mensajes, timeouts, empty states.

Reportar faltantes.

Entregable
INFORME-AUD-F10.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. DETENERSE.

FASE F11 — TESTS E2E Y CIERRE
Tareas
Listar tests existentes.

Verificar cobertura.

Proponer tests faltantes.

Crear INFORME-AUD-FRONTEND-CONSOLIDADO.md.

Entregable
INFORME-AUD-F11.md + INFORME-AUD-FRONTEND-CONSOLIDADO.md.

Al terminar
GUARDAR + ACTUALIZAR ESTADO + COMMIT. Auditoría completa.

FORMATO DE HALLAZGOS
ID: HAL-FFN-XX
Severidad: CRÍTICO | ALTO | MEDIO | BAJO
Origen: PREVIO | NUEVO | REAGRAVADO | RESUELTO
Archivo | Línea | Componente | Problema | Impacto |
Ejemplo | Recomendación.

CÓMO PROCEDER
Ejecutar SOLO Fase F0.

Guardar informe + actualizar estado + commit.

DETENERSE.

Esperar "continúa con Fase F1".

Repetir hasta F11.

Al terminar, crear INFORME-AUD-FRONTEND-CONSOLIDADO.md.

ENTREGA INICIAL
Ejecutar SOLO Fase F0.
GUARDAR + ACTUALIZAR ESTADO + COMMIT.
DETENERSE.

text

## 🎯 Recuperación tras un corte de cuota

Si se corta la cuota a mitad de una fase:

1. **Abres el repo** y revisas `ESTADO-AUDITORIA.md`.
2. **Ves la sección "Informe parcial de la fase actual"**.
3. **Le dices al agente** cuando recuperes cuota:
Retoma la auditoría frontend delta desde el estado actual.
Lee apps/prompts/implememtacion/frontend/auditorias/ESTADO-AUDITORIA.md
y continúa desde donde quedó.

Si hay un informe parcial de la fase actual, retoma desde ahí.
NO reinicies la fase, NO rehagas lo ya hecho.

text

4. **El agente lee el estado + el informe parcial** y continúa exactamente donde se quedó.

## 📋 Instrucciones para ti

### Paso 1 — Crear los archivos base antes de lanzar

```powershell
# Directorio
New-Item -ItemType Directory -Force -Path "apps\prompts\implememtacion\frontend\auditorias"

# Prompt maestro
# (pega el contenido del prompt de arriba)

# Estado inicial
Crea ESTADO-AUDITORIA.md con este contenido inicial:

markdown
# Estado de Auditoría Frontend Delta

## Fases completadas
- [ ] F0 — Ingesta y reconciliación — PENDIENTE
- [ ] F1 — Mapa actualizado — PENDIENTE
- [ ] F2 — Cálculos locales — PENDIENTE
- [ ] F3 — Manejo de errores — PENDIENTE
- [ ] F4 — Validaciones preventivas — PENDIENTE
- [ ] F5 — Unidades de medida — PENDIENTE
- [ ] F6 — Campos nuevos — PENDIENTE
- [ ] F7 — Dashboard — PENDIENTE
- [ ] F8 — Formato números — PENDIENTE
- [ ] F9 — Contratos API — PENDIENTE
- [ ] F10 — Feedback/Estados — PENDIENTE
- [ ] F11 — Tests E2E + Cierre — PENDIENTE

## Última fase ejecutada
Ninguna — auditoría no iniciada

## Próxima fase
F0 — Ingesta y reconciliación

## Informe parcial de la fase actual
(sin contenido por ahora)
Paso 2 — Guardar el prompt maestro
Crea PROMPT-MAESTRO-AUDITORIA-FRONTEND-DELTA.md con el prompt completo.

Paso 3 — Commit inicial
powershell
git checkout -b audit/frontend-delta
git add apps/prompts/implememtacion/frontend/auditorias/
git commit -m "audit(frontend): setup inicial del prompt maestro y estado"
git push origin audit/frontend-delta
Paso 4 — Verifica modelo = Gemini Flash (Low)
Paso 5 — Lanza F0
Le dices al agente:

text
Lee apps/prompts/implememtacion/frontend/auditorias/PROMPT-MAESTRO-AUDITORIA-FRONTEND-DELTA.md
y ejecuta SOLO la Fase F0.

este era el promp inicial que te iva a pasar, pero lo cambie por el anterio te lo dejo como referencia por si pase algo por alto: # AUDITORÍA FRONTEND DELTA — PROMPT MAESTRO

## REGLAS ANTI-QUEMA (obligatorias en TODAS las fases)
1. PROHIBIDO lanzar subagentes de cualquier tipo.
2. PROHIBIDO usar Claude Opus o Sonnet. Modelo: Gemini Flash (Low).
3. NO explorar todo el repositorio. Ir por capas.
4. En cada fase: máximo 15 lecturas de archivo.
5. NO modificar código de apps/web. Solo auditar.
6. Al terminar cada fase: crear informe y DETENERSE.
7. NO avanzar a la siguiente fase sin autorización del humano.
8. El humano dirá "continúa con Fase FN" para avanzar.
9. Priorizar verificación de hallazgos previos sobre exploración nueva.

## CONTEXTO GENERAL
Auditoría DELTA del frontend post-remediación backend (39/39 resueltos).

### Cambios del backend que impactan frontend:
- Zod schemas en 4 módulos (rechazan campos extra).
- unit-registry.js canónico (sincronizado en Bloque 6B).
- decimal-utils.js (precisión financiera).
- useSaleForm.js reescrito backend-first (no calcula localmente).
- Campos nuevos: densidad, unidadCantidadProducida, saldoAFavor,
  stockAnterior, stockNuevo, cantidadTeoricaOriginal.
- Errores nuevos: BadRequestException en ~15 casos.
- Dashboard: utilidadDevengada y flujoCajaReal separadas.
- Schema: costos unitarios en Decimal(14,4).

### Auditorías previas (7 archivos):
Ubicación: [INDICAR RUTA DONDE ESTÁN]
Lista:
- AUDIT-CARTERA-VENTAS-PAGOS.md
- AUDIT-EXPENSES-DASHBOARD-SCADA.md
- AUDIT-INVENTORY-PRODUCTION-UNITS.md
- AUDIT-RECIPES-BOM-COSTING.md
- AUDIT-SUPPLY-CHAIN-AND-PURCHASES.md
- AUDIT-TAX-IVA-PRODUCTS-SALES-IMPACT.md
- AUDIT-TECHNICAL-DEBT-ARCHITECTURE.md

### Los informes van en:
apps/prompts/implememtacion/frontend/auditorias/INFORME-AUD-FN.md

---

## FASE F0 — INGESTA Y RECONCILIACIÓN

### Tareas
- Leer las 7 auditorías previas (usar solo las secciones de hallazgos,
  no el contexto largo).
- Extraer: ID hallazgo, severidad, archivo, línea, descripción.
- Clasificar cada hallazgo en:
  * RESUELTO por remediación backend (verificar rápido).
  * VIGENTE (sigue siendo problema).
  * OBSOLETO (el código cambió y ya no aplica).
  * REAGRAVADO (era MEDIO, ahora es CRÍTICO).
- Construir matriz única consolidada.

### Entregable
INFORME-AUD-F0.md (máximo 2500 palabras).

### Al terminar
DETENERSE. NO avanzar a F1.

---

## FASE F1 — MAPA ACTUALIZADO DEL FRONTEND

### Tareas
- Tomar el mapa de páginas/formularios de auditorías previas
  (especialmente AUDIT-TECHNICAL-DEBT-ARCHITECTURE.md).
- Verificar vigencia con 3-4 lecturas de archivo.
- Añadir páginas/formularios nuevos.
- Verificar que se cumplen los límites SRP (page < 120, componente
  < 150).
- Reportar excepciones documentadas (DashboardOperationalView.jsx).

### Entregable
INFORME-AUD-F1.md.

### Al terminar
DETENERSE. NO avanzar a F2.

---

## FASE F2 — CÁLCULOS LOCALES DUPLICADOS (DELTA)

### Tareas
- Tomar inventario de cálculos locales de:
  * AUDIT-CARTERA-VENTAS-PAGOS.md (ventas, saldos)
  * AUDIT-RECIPES-BOM-COSTING.md (costos en recipeHelpers.js)
  * AUDIT-TAX-IVA-PRODUCTS-SALES-IMPACT.md (IVA)
- Verificar cuáles siguen vigentes en el código actual.
- Identificar cuáles se eliminaron en Bloque 6B (useSaleForm).
- Identificar cuáles se DUPLICAN aún con el backend
  (sospechosos: recipeHelpers.js, useRecipeForm.js).
- Divergencias entre frontend y backend.

### Entregable
INFORME-AUD-F2.md.

### Al terminar
DETENERSE. NO avanzar a F3.

---

## FASE F3 — MANEJO DE ERRORES (NUEVOS BadRequestException)

### Tareas
- Listar los ~15 BadRequestException nuevos del backend:
  * rendimientoBase = 0
  * merma fuera de [0, 100)
  * costo unitario inválido
  * granel sin volumen
  * descuento > 50%
  * payload con campos extra (Zod)
  * unidad incompatible
  * cantidad negativa
  * producción con costo inválido
  * presentación granel sin cantidadMl
  * ... (resto a descubrir)
- Verificar si el frontend captura cada uno y muestra mensaje útil.
- Identificar los que caen en catch genérico o mensaje feo.

### Entregable
INFORME-AUD-F3.md.

### Al terminar
DETENERSE. NO avanzar a F4.

---

## FASE F4 — VALIDACIONES PREVENTIVAS

### Tareas
- Tomar el inventario de validaciones de
  AUDIT-TECHNICAL-DEBT-ARCHITECTURE.md (sección MOD-01).
- Verificar cuáles siguen vigentes.
- Añadir validaciones faltantes para los nuevos casos:
  * merma 0-100 en formulario de recetas.
  * descuento ≤ 50% en ventas.
  * volumen obligatorio en presentaciones granel.
  * rendimientoBase > 0 en recetas.
  * costo > 0 y ≤ 50000 en producción.
- Reportar validaciones faltantes.

### Entregable
INFORME-AUD-F4.md.

### Al terminar
DETENERSE. NO avanzar a F5.

---

## FASE F5 — UNIDADES DE MEDIDA EN FRONTEND

### Tareas
- Verificar que todos los componentes que muestran/ingresan unidades
  usan `unitNormalizer.js` sincronizado con `unit-registry` backend.
- Auditorías previas mencionan: `cantidadOz`, `cantidadMl` en
  presentaciones, unidades de insumos, unidades de recetas.
- Verificar que oz, mg y otras unidades se muestran correctamente.
- Reportar usos ad-hoc o hardcodeados.

### Entregable
INFORME-AUD-F5.md.

### Al terminar
DETENERSE. NO avanzar a F6.

---

## FASE F6 — CAMPOS NUEVOS DEL BACKEND

### Tareas
- Listar campos nuevos que el backend introdujo:
  * `Insumo.densidad`
  * `Producto.densidad`
  * `Produccion.unidadCantidadProducida`
  * `Venta.saldoAFavor` (si aplica)
  * `MovimientoInventario.stockAnterior`
  * `MovimientoInventario.stockNuevo`
  * `DetalleProduccion.cantidadTeoricaOriginal` (en observaciones)
  * `PrecioProveedor.costoBaseSinIva`
- Para cada uno: ¿el frontend lo captura? ¿Lo muestra? ¿Lo edita?
- Reportar campos no expuestos.

### Entregable
INFORME-AUD-F6.md.

### Al terminar
DETENERSE. NO avanzar a F7.

---

## FASE F7 — DASHBOARD Y MÉTRICAS

### Tareas
- Verificar que el dashboard muestra `utilidadDevengada` y
  `flujoCajaReal` como métricas separadas.
- Verificar que el margen se calcula sobre precio sin IVA.
- Verificar que totales agregados usan sumas crudas (no redondeo
  intermedio).
- Referenciar AUDIT-EXPENSES-DASHBOARD-SCADA.md (vigente).
- Reportar discrepancias.

### Entregable
INFORME-AUD-F7.md.

### Al terminar
DETENERSE. NO avanzar a F8.

---

## FASE F8 — FORMATO DE NÚMEROS, FECHAS, UNIDADES

### Tareas
- Verificar parseo de strings Decimal del backend.
- Verificar formato COP (separadores, decimales).
- Verificar formato de fechas.
- Verificar formato de porcentajes, cantidades, unidades.
- Reportar inconsistencias.

### Entregable
INFORME-AUD-F8.md.

### Al terminar
DETENERSE. NO avanzar a F9.

---

## FASE F9 — CONTRATOS API FRONTEND ↔ ZOD

### Tareas
- Para cada endpoint POST/PUT en el frontend:
  * ¿El payload coincide con el Zod schema del backend?
  * ¿Envía campos extra que Zod rechazará?
  * ¿Falta algún campo obligatorio?
- Referenciar los Zod schemas creados en Bloque 1:
  * create-sale.schema.js
  * create-purchase.schema.js
  * create-payment.schema.js
  * discard-lot.schema.js
- Reportar incompatibilidades.

### Entregable
INFORME-AUD-F9.md.

### Al terminar
DETENERSE. NO avanzar a F10.

---

## FASE F10 — ESTADOS DE CARGA, FEEDBACK, EMPTY STATES

### Tareas
- Referenciar AUDIT-TECHNICAL-DEBT-ARCHITECTURE.md (sección UI-01).
- Verificar que hay spinners durante llamadas.
- Verificar mensajes de éxito.
- Verificar manejo de timeout.
- Verificar empty states.
- Reportar faltantes.

### Entregable
INFORME-AUD-F10.md.

### Al terminar
DETENERSE. NO avanzar a F11.

---

## FASE F11 — TESTS E2E Y CIERRE

### Tareas
- Listar tests existentes en `apps/web/e2e`.
- Referenciar `value-chain-complete.spec.js`.
- Verificar cobertura de flujos críticos.
- Proponer tests faltantes (sin implementar).
- Crear INFORME-AUD-FRONTEND-CONSOLIDADO.md.

### Entregable
INFORME-AUD-F11.md + INFORME-AUD-FRONTEND-CONSOLIDADO.md.

### Al terminar
Auditoría completa.

---

## FORMATO DE HALLAZGOS
ID: HAL-FFN-XX
Severidad: CRÍTICO | ALTO | MEDIO | BAJO
Origen: PREVIO | NUEVO | REAGRAVADO | RESUELTO
Archivo | Línea | Componente | Problema | Impacto |
Ejemplo | Recomendación.

## CLASIFICACIÓN DE SEVERIDAD
- CRÍTICO: produce datos incorrectos o bloquea funcionalidad.
- ALTO: degrada experiencia o riesgo de inconsistencia.
- MEDIO: problema de usabilidad o mantenibilidad.
- BAJO: cosmético o mejora.

## CÓMO PROCEDER
1. Ejecutar SOLO Fase F0.
2. Crear INFORME-AUD-F0.md.
3. DETENERSE.
4. Esperar "continúa con Fase F1".
5. Repetir hasta F11.
6. Al terminar, crear INFORME-AUD-FRONTEND-CONSOLIDADO.md.

## ENTREGA INICIAL
Ejecutar SOLO Fase F0. DETENERSE.