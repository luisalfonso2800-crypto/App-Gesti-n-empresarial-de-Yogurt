# PLAN MAESTRO DE MODULARIZACIÓN FRONTEND

Este documento establece el diagnóstico y la hoja de ruta estratégica para refactorizar la capa de presentación (UI) del aplicativo web, migrando de componentes monolíticos hacia una arquitectura atómica, limpia y escalable, preservando JavaScript nativo y estricto apego al manejo de estado sin saturar los ficheros `.jsx`.

## 1. Matriz de Auditoría (Resumen Tabular de Archivos Críticos)

Se realizó un escrutinio de las páginas principales en `apps/web/src/app` que superan las 120 líneas de código, identificando una fuerte mezcla de responsabilidades (UI + Fetch + Form State + Modal Logic).

| Ruta de `page.jsx` | Líneas Actuales | Diagnóstico Rápido de Responsabilidades |
| :--- | :--- | :--- |
| `operations/purchases/new` | ~1247 | **Crítico.** Maneja 25 estados paralelos y 3 efectos. Mezcla fetch, simulación, renderizado de modals (proveedor, insumo) y checklist. |
| `catalog/supplier-prices` | ~562 | **Severo.** Administra 12 estados. Contiene lógicas de selección masiva, filtrado y renderizado del carrito integrado en la vista. |
| `catalog/recipes` | ~450 | **Severo.** Lógica densa de anidamiento de costos, materiales y pasos de receta mezclada con el layout y modals. |
| `operations/production` | ~361 | **Medio.** Formulario de lotes integrado en el controlador visual. |
| `catalog/supplies` | ~286 | **Medio.** CRUD de insumos y modals anclados en un solo componente. |
| `catalog/products` | ~256 | **Medio.** Similar a supplies. Mezcla peticiones de red y UI. |
| `catalog/suppliers` | ~250 | **Medio.** Render de lista, modals y submit combinados. |
| `catalog/presentations` | ~225 | **Medio.** Fuerte acoplamiento con la vista. |
| `commercial/sales` | ~220 | **Medio.** Generación de ventas, calculo y post integrados. |

---

## 2. Catálogo de Lógica Duplicada Identificada

Durante el rastreo se han identificado los siguientes patrones anómalos o duplicados, candidatos directos a extracción hacia Custom Hooks y utilidades compartidas:

1. **Gestión de Carritos Temporales:** 
   - Lógica de sincronización `sessionStorage` (`sessionStorage.getItem`, `JSON.parse`) multiplicada entre `Header.jsx`, `supplier-prices/page.jsx` y `purchases/new/page.jsx`.
2. **Formateadores (Currency y Fechas):** 
   - Funciones en línea en múltiples `page.jsx` como `toLocaleString('es-CO')` o conversiones manuales repetidas en el render mapping.
3. **Control de Modales y Dropdowns:** 
   - Excesiva presencia de combinaciones `[isOpen, setIsOpen]` con `ref` y detectores de "clic afuera" (`mousedown`) replicados 1:1 entre distintas vistas (e.g. búsqueda de proveedores e insumos).
4. **Clientes de Red con Interceptores en Línea:** 
   - Bloques iterativos de `try/catch` que despachan alertas (`dispatchEvent(showNotification...)`) repartidos a lo largo de las páginas operativas.

---

## 3. Estándar de Modularización Atómica

Toda nueva implementación o refactor deberá estructurarse en **3 capas claramente delimitadas por pantalla**:

*   **`page.jsx` (Orquestador Visual):**
    *   Exclusivo para la delegación y el renderizado principal del *Layout*.
    *   No debe exceder idealmente las **100 líneas**.
    *   Sin lógica matemática, sin sentencias nativas `fetch` o procesamiento pesado de arrays.
*   **`hooks/` (Capa de Lógica / Control):**
    *   Uso de Custom Hooks como `usePurchasesData.js` (para gestionar peticiones asíncronas y fetching) y `usePurchasesForm.js` o `usePurchasesActions.js` (para encapsular los múltiples `useState` de formularios).
*   **`components/` (Capa Atómica de Presentación):**
    *   Fragmentación de UI en subcomponentes puramente declarativos (dumb components) alojados junto a la vista o en `src/components/ui/` (ej. `ChecklistTable.jsx`, `SupplierModal.jsx`, `OrderSummary.jsx`). Reciben información estrictamente mediante *props*.

---

## 4. Estándar JSDoc de Trazabilidad Cruzada

Al segmentar la aplicación, los imports deben ser fácilmente rastreables. Se impondrá la siguiente plantilla JSDoc obligatoria en la cabecera de todo componente, utilidad o hook exportado:

```javascript
/**
 * @file purchases/hooks/usePurchasesData.js
 * @module hooks/usePurchasesData
 * @description Hook encargado de inicializar catálogos y resolver validaciones asíncronas de base de datos.
 * @responsibility Consolidar la capa de datos de la vista de nueva compra (Fase 1).
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies apiClient, useState, useEffect
 */
```

---

## 5. Roadmap de Refactorización Progresiva (Fases)

Para mitigar riesgos y no bloquear la operación de la base actual de negocio, la modularización se ejecutará secuencialmente:

*   **Fase 1: Módulo de Operaciones (Crítico)**
    - Refactor de `purchases/new/page.jsx` hacia Custom Hooks (`usePurchasesData`, `usePurchasesCart`) y extracción de componentes anidados (modales de Insumos y Proveedores).
    - Desacoplamiento de las lógicas complejas en `inventory` y `production/batches`.
*   **Fase 2: Catálogos y Costos (Severo)**
    - Refactorización de `supplier-prices/page.jsx` hacia un esquema de componentes y custom hooks de UI.
    - Simplificación visual de `recipes/page.jsx` para independizar el motor de renderizado de árboles de receta y separarlo del CRUD regular.
*   **Fase 3: Circuito Comercial (Medio)**
    - Aislamiento lógico de `sales/page.jsx`, `clients`, `expenses` y `payments`.
*   **Fase 4: Shell, Utilidades y UI Global (Bajo)**
    - Extracción y centralización definitiva del estado temporal de notificaciones de Toast, carritos flotantes (`Header.jsx`) a un Hook Global (ej. Zustand o Context) para evitar la contaminación cruzada y duplicidad en Storage API.
