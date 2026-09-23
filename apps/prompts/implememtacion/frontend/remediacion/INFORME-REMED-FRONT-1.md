# INFORME DE REMEDIACIÓN — BLOQUE FRONT-1: POKA-YOKE Y ERRORES CRÍTICOS

> **Fecha:** 2026-09-22  
> **Alcance:** Remediación de 6 hallazgos críticos y altos en la capa web frontend (`apps/web/src`)  
> **Estado:** ✅ COMPLETADO

---

## 1. Resumen Ejecutivo de Acciones Quirúrgicas

| ID Hallazgo | Severidad | Módulo / Archivo Afectado | Acción Realizada |
| :--- | :---: | :--- | :--- |
| **HAL-F0-01** | CRÍTICO | `apps/web/src/app/operations/production/hooks/useProductionPageData.js` | Erradicado `alert(e.message)` nativo en `startOrder`. Reemplazado por `showNotification(..., 'error')` del Design System MANNÁ. |
| **HAL-F2-01** | CRÍTICO | `apps/web/src/app/catalog/recipes/components/recipeHelpers.js`<br>`apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` | Eliminado fallback unitario estático (`4390`). En caso de WIP con costo nulo o inválido, se asigna 0 y se genera señal `{ costoInvalido: true, motivo: 'WIP sin costo configurado' }`. En `RecipeModal.jsx`, se bloquea `canSubmit` y se despliega advertencia visual. |
| **HAL-F4-01** | ALTO | `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx` | Restringido input de merma a `max="99.9"`. Al ingresar un valor `>= 100`, se activa borde de error y advertencia descriptiva inline: *"⚠️ La merma debe ser menor a 100%"*. |
| **HAL-F4-02** | ALTO | `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`<br>`apps/web/src/app/catalog/presentations/components/modal-parts/PresentationCapacityFields.jsx` | Detección estricta de envases `BALDE` o `TANQUE_GRANEL`. Se exige `cantidadMl > 0`, bloqueando el botón submit y mostrando mensaje descriptivo de campo requerido para volumen a granel. |
| **HAL-F9-01** | ALTO | `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` | En `computeTotals`, se añadió la guarda estricta `maxDescPermitido = brutoLinea * 0.50`, restringiendo el descuento máximo comercial permitido al 50% por línea. |
| **HAL-F9-02** | ALTO | `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` | Erradicado el spread operator `{ ...formData }` al enviar la petición. Se construyó una whitelist limpia sanitizada compatible con el esquema Zod `.strict()` del backend. |

---

## 2. Validación de Arquitectura y Reglas

- **Validación SRP / CSS Modules:**
  Ejecución de `node .agents/scripts/verify-srp.js` sobre los archivos modificados:
  `✔ Verificación SRP y CSS Modules exitosa (0 infracciones)`
- **Límites de Líneas:**
  - `RecipeModal.jsx`: 149 líneas (cumple límite < 150 líneas).
  - `RecipeStageBomTable.jsx`: 140 líneas (cumple límite < 150 líneas).
  - `PresentationModal.jsx`: 150 líneas (cumple límite < 150 líneas).
- **Estilos en línea:** 0 nuevos estilos en línea introducidos.

---

## 3. Próximos Pasos

Continuar con la remediación del **Bloque Front-2** (Validación Preventiva y Ergonomía de Planta).
