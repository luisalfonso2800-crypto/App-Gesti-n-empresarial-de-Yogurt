TAREA CONTROLADA — CENTRALIZACIÓN MATEMÁTICA EN BACKEND Y RESOLUCIÓN VISUAL EXACTA DEL CHECKLIST

OBJETIVO TÉCNICO EXACTO
Basado en `docs/diagnosticos/DIAGNOSTICO_MODULO_COMPRAS_BACKEND.md` y en las inconsistencias reportadas en el Checklist de Compras:
1. Eliminar la etiqueta confusa y huérfana "Local" reemplazándola por el badge explícito "Marca: Local" (o "Marca: Sin marca").
2. Eliminar por completo el texto redundante "| 1 Litros". Formatear el desglose legible como: "Presentación: Cantina (40 Litros)" usando `cantidadEquivalenteBase` de la BD (evitando el fallback erróneo a 1).
3. Corregir el origen en `apps/web/src/app/catalog/supplier-prices/page.jsx` para serializar en `sessionStorage` el campo real `cantidadEquivalenteBase` (40) y no `cantidadPresentacion` (1).
4. Implementar el endpoint `POST /api/v1/purchases/simulate` en NestJS para centralizar toda la aritmética (subtotales, ingreso neto a bodega y costo base unitario). El frontend NUNCA debe calcular estos valores directamente.
5. Diseñar la UX de la tarjeta: botones gemelos [✓ Conseguido] / [✕ No Conseguido], captura de motivos al marcar no conseguido, input de cantidad con `min="1"` (forzando >= 1) y resumen oficial devuelto por el backend.

FUENTES DE VERDAD OBLIGATORIAS
- docs/diagnosticos/DIAGNOSTICO_MODULO_COMPRAS_BACKEND.md
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/api/src/purchases/purchases.controller.js
- apps/api/src/purchases/purchases.service.js
- apps/api/src/purchases/purchases.repository.js
- apps/web/src/app/catalog/supplier-prices/page.jsx
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React (.jsx, .js). PROHIBIDO TERMINANTEMENTE TypeScript.
2. CSS Modules exclusivo (.module.css). PROHIBIDO Tailwind.
3. El frontend actúa solo como recolector de inputs; todos los totales, conversiones y costos unitarios provienen de la respuesta del backend (`/purchases/simulate`).

ESPECIFICACIÓN PUNTUAL DE IMPLEMENTACIÓN

1. CORRECCIÓN DEL ORIGEN DE DATOS (Storage en Catálogo):
   - En `apps/web/src/app/catalog/supplier-prices/page.jsx`:
     * Serializar `contenidoBase: item.cantidadEquivalenteBase || item.cantidadPresentacion || 1`.
     * Almacenar `idPrecioProveedor: item.id`, `marca: item.insumo?.marca || 'Sin marca'`, `stockMinimo: item.insumo?.stockMinimo || 0`, `unidadBase: item.insumo?.unidadBase || 'Unidades'`, `presentacionCompra: item.presentacionCompra`.

2. ENDPOINT DE LIQUIDACIÓN CENTRALIZADA EN BACKEND:
   - En `apps/api/src/purchases/`:
     * Crear ruta `POST /api/v1/purchases/simulate`.
     * Request body: `{ items: [{ idPrecioProveedor, cantidadEmpaques, precioEmpaque }] }`.
     * Lógica en servicio:
       - Consultar cada `PrecioProveedor` en Prisma incluyendo su relación con `Insumo`.
       - Factor real = `precioProveedor.cantidadEquivalenteBase || 1`.
       - `ingresoNetoBodega = cantidadEmpaques * factorReal`.
       - `subtotal = cantidadEmpaques * precioEmpaque`.
       - `costoBaseUnitario = precioEmpaque / factorReal`.
     * Response: `{ subtotalGlobal, itemsLiquidados: [{ idPrecioProveedor, subtotal, ingresoNetoBodega, costoBaseUnitario, unidadBase }] }`.

3. CORRECCIÓN VISUAL Y FORMULACIÓN EN CHECKLIST (`page.jsx` y `.module.css`):
   - Encabezado de la Tarjeta:
     * Nombre del Insumo en negrita.
     * Badge de Categoría: `<span className={styles.badge}>Categoría: {item.categoria}</span>`
     * Badge de Marca explícito: `<span className={styles.badge}>Marca: {item.marca || 'Sin marca'}</span>` (NUNCA mostrar el texto de la marca solo o descontextualizado).
     * Badge de Stock Mínimo: `<span className={styles.badgeWarning}>Stock Mín: {item.stockMinimo} {item.unidadBase}</span>`
   - Formato de Presentación:
     * Ubicado arriba a la derecha: `Presentación: {item.presentacionCompra} ({factorReal} {item.unidadBase})`.
     * Eliminar cualquier renderizado de `| 1 Litros`. Ejemplo resultante: `Presentación: Cantina (40 Litros)`.
   - Control de Entrada:
     * `Cant. Solicitada`: `<input type="number" min="1" ... />`. Si el usuario ingresa <= 0 o vacío, normalizar inmediatamente a 1.
     * `Precio Empaque ($)`: input editable precargado con la tarifa pactada.
   - Panel de Resultados (Alimentado por la API simulate):
     * `Subtotal: $XXX.XXX`
     * `Total neto a bodega: 240.00 Litros` (para 6 cantinas de 40L)
     * `Costo unitario real: $1500.00 / Litros` ($60.000 / 40)
   - Botones de Estado y Flujo:
     * [✓ Conseguido]: Estado activo por defecto con borde verde sutil.
     * [✕ No Conseguido]: Al seleccionarlo, atenúa la tarjeta y abre desplegable de motivos:
       ["Agotado en punto de venta", "Proveedor ya no distribuye este insumo", "Precio fuera de presupuesto", "Problema de calidad evidente", "Otro motivo (especificar)"].
       Si selecciona "Otro motivo", mostrar un `<input type="text" placeholder="Especifique el motivo..." />`.
     * El botón "Continuar a Formulario (Fase 2)" únicamente transfiere los insumos marcados como [✓ Conseguido].

VALIDACIÓN OBLIGATORIA
1. `pnpm --filter web build` debe compilar sin errores (Código 0).
2. Verificar que al abrir el Checklist con "Cantina 40L" y solicitar 6 unidades a $60.000, la pantalla muestre:
   - Marca: "Marca: Local"
   - Presentación: "Presentación: Cantina (40 Litros)"
   - Subtotal: "$360000.00"
   - Total neto a bodega: "240.00 Litros"
   - Costo unitario real: "$1500.00 / Litros"
   - Sin etiquetas sueltas ni divisiones erradas entre 1.

FORMATO DE REPORTE
Entregar exclusivamente el reporte estándar indicando estado, archivos modificados y confirmación de build limpio.