# AUDITORÍA TÉCNICA ESTRUCTURAL — MÓDULO COMPRAS (PRE-TEST E2E)

## ⚠️ REGLAS ESTRICTAS DE ULTRA-AHORRO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, builds de Next.js/NestJS o dev servers.
4. PROHIBIDO modificar código de producción (`apps/web/`, `apps/api/`). CERO ediciones en archivos existentes.
5. LÍMITES DUROS: Máximo 18 lecturas directas (`Read`), exactamente 1 archivo a crear (`AUDITORIA-COMPRAS.md`), máximo 20 llamadas a herramientas en total.
6. PROHIBIDO hacer búsquedas recursivas ciegas (`grep`, `find`, `listDir` masivos). Usa las rutas exactas provistas.
7. Al escribir el archivo de entrega, DETENTE inmediatamente sin generar mensajes conversacionales redundantes.

---

## 📌 CONTEXTO Y FUENTES DE VERDAD A INSPECCIONAR (RUTAS EXACTAS)

### Frontend (Página principal, Listados y Modales):
- `apps/web/src/app/operations/purchases/page.jsx`
- `apps/web/src/app/operations/purchases/hooks/usePurchasesPageData.js`
- `apps/web/src/app/operations/purchases/components/PurchasesHistoryTable.jsx`
- `apps/web/src/app/operations/purchases/components/PurchasesActiveOrdersSection.jsx`

### Frontend (Flujo Nueva Compra Directa y Checklist):
- `apps/web/src/app/operations/purchases/new/page.jsx`
- `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx`
- `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx`
- `apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx`
- `apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js`

### Backend y Base de Datos:
- `apps/api/prisma/schema.prisma` (Modelos Compra, DetalleCompra, Proveedor, Insumo, PrecioProveedor, Inventario, MovimientoInventario)
- `apps/api/src/purchases/purchases.controller.js` (o `.ts` si aplica en el backend)
- `apps/api/src/purchases/purchases.service.js` (o `.repository.js`)

---

## 🛠️ TAREAS DE AUDITORÍA QUIRÚRGICA

### T1. Inventario de Archivos
- Reportar ruta y conteo de líneas de cada archivo auditado en Frontend y Backend de Compras.

### T2. Página de Listado (`/operations/purchases`)
- Título exacto en el encabezado.
- Botones de acción principales (texto exacto de "+ Nueva Compra", "Nueva Compra Directa", "Crear / Gestionar Lista").
- Texto exacto de estado vacío (`empty state`).
- Columnas de la tabla de órdenes activas y del historial de compras finalizadas.
- Selectores semánticos y filtros/buscadores disponibles.

### T3. Flujo "Nueva Compra Directa" (`FormPhase`)
- Título del formulario e indicadores de cabecera.
- Botones de navegación y acción: "← Volver a Compras", "Limpiar Borrador", "Consultar Stock", "+ Añadir Fila", "Guardar y Registrar Compra".
- Campos globales: Costo adicional / Flete global (name, placeholder, microtexto de ayuda) y condición de compra.

### T4. Fila de Ítem de Compra (`FormPhaseRowItem`)
- Lista exhaustiva de campos y controles por cada insumo:
  * Proveedor (autocomplete/select).
  * Insumo (autocomplete/selector).
  * Marca y Empaque (tipo de empaque, contenido unitario y unidad técnica).
  * Cantidad de empaques y precio unitario.
  * Configuración tributaria (checkbox Aplica IVA, Tasa IVA default 19%, selector Incluye IVA).
  * Fórmulas calculadas visibles en pantalla: Ingreso Neto a bodega, Costo unitario base, Base, IVA ($) y Subtotal con desglose en letras.

### T5. Drawer "Consultar Stock de Insumos" (`StockLookupDrawer`)
- Botón disparador en cabecera y título del drawer.
- Buscador reactivo.
- Estructura de la tarjeta del insumo (Stock Actual vs. Mínimo, semáforo).
- Estado dinámico Poka-Yoke: Botón "+ Añadir a Compra" vs. badge "✓ En compra" / botón "✕ Quitar".

### T6. Matriz Poka-Yoke y Reglas de Negocio
Identificar y certificar las siguientes validaciones en UI y lógica:
- Insumo y Proveedor requeridos.
- Invariantes de números: cantidad > 0, precio > 0, contenido unitario > 0.
- Bloqueo condicional de guardado si `filas.length === 0` o si hay filas marcadas como `isUnconfigured`.
- Manejo de insumos duplicados dentro de la misma compra.

### T7. Contratos de Backend y Efectos Colaterales
- Endpoints documentados (`GET`, `POST`, `PUT/PATCH`, `DELETE`).
- Esquemas de validación (Zod o DTOs) y respuestas de error HTTP (400, 404, 409).
- Efectos automáticos al registrar la compra:
  * Incremento en tabla `Inventario` (cantidad física en unidad base).
  * Registro en `MovimientoInventario` (Kardex: `ENTRADA_COMPRA`).
  * Actualización o refresco de cotizaciones en `PrecioProveedor`.

### T8. Modelo Prisma y Estados
- Relaciones exactas entre `Compra`, `DetalleCompra`, `Proveedor`, `Insumo` y `Precios_Proveedores`.
- Campos obligatorios vs. opcionales.
- Enum o tipos de estado (`BORRADOR`, `REGISTRADA`, `ANULADA`).

### T9. Flujo Completo Happy-Path (Paso a Paso E2E)
- Detallar la secuencia interactiva desde `/operations/purchases` hasta la confirmación de la persistencia y actualización de la tabla histórica.

### T10. Comportamientos Especiales de Sincronización
- Sincronización del draft en `localStorage` (`manna_direct_purchase_draft`).
- Estado de loading / disable en botón submit durante la mutación de red.
- Confirmación visual (toasts, cierre de modales o redirección reactiva).

---

## 🛑 ENTREGABLE Y CONDICIÓN DE DETENCIÓN
Crear exclusivamente:
`apps/prompts/testing/AUDITORIA-COMPRAS.md`

El archivo debe organizar de manera concisa y tabular cada una de las 10 secciones auditadas (máximo 3000 palabras) respetando las fuentes de verdad sin suposiciones.

**DETENCIÓN:**
Una vez escrito el archivo `AUDITORIA-COMPRAS.md`, DETENTE de inmediato. No ejecutes comandos adicionales.

## 📋 REPORTE EN TERMINAL
Responde ÚNICAMENTE con:
• Archivo generado: `apps/prompts/testing/AUDITORIA-COMPRAS.md`.
• Total de archivos leídos.
• Estado: COMPLETADO.