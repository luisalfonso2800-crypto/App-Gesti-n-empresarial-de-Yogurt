# POKA-YOKE COMPLETO — EMPAQUE / CONTENIDO / UNIDAD EN COMPRAS (BACKEND + FRONTEND)

## ⚠️ REGLAS ESTRICTAS DE AHORRO DE CUOTA Y AISLAMIENTO (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar tests Playwright o builds completos innecesarios durante la edición.
4. LÍMITES DUROS: Máximo 25 lecturas (`Read`), máximo 12 ediciones (`Edit`), máximo 35 llamadas a herramientas en total.
5. PROHIBIDO hacer búsquedas recursivas ciegas (`grep`, `find`, `listDir` masivos). Usa las rutas exactas provistas.
6. Edición directa con `Edit`. CERO scripts temporales (`patch.js`, `fix.js`).
7. Si una edición genera errores de sintaxis o rompe contratos, DETENTE de inmediato y repórtalo.

---

## 📌 CONTEXTO DEL PROBLEMA POKA-YOKE
- **Falla operativa actual:** Al comprar insumos granel o fraccionados (ej. "1 bolsa de fresa de 500 g"), el operador deja `Empaque = UNIDAD`, `Contenido = 1`, `Unidad = und`. El inventario suma "1 und" en lugar de 500 gramos, quebrando recetas, Kardex y CPP.
- **Solución en 5 capas:**
  1. Autocompletar desde cotización activa (`SupplierPrice`) si existe una opción única.
  2. Desplegar selector de presentaciones de compra registradas para el par Insumo + Proveedor.
  3. Alerta visual Poka-Yoke si se selecciona `UNIDAD` con `Contenido = 1` en insumos pesables o medibles (g, kg, ml, L).
  4. Preview interactivo del impacto en inventario físico en unidad base.
  5. Warning si `Empaque ≠ UNIDAD` pero `Contenido = 1`.

---

## 🔍 FASE 1: AUDITORÍA TÉCNICA Y DIAGNÓSTICO (MÁXIMO 10 LECTURAS)

### Rutas Exactas a Inspeccionar:
- **Backend Precios:**
  * `apps/api/src/supplier-prices/supplier-prices.controller.js`
  * `apps/api/src/supplier-prices/supplier-prices.service.js`
  * `apps/api/src/supplier-prices/supplier-prices.repository.js`
  * `apps/api/prisma/schema.prisma` (Modelo `PrecioProveedor` / `SupplierPrice`)
- **Frontend Compras:**
  * `apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js`
  * `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx`
  * `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowPackaging.jsx`

### Entregable de Auditoría:
Crear: `apps/prompts/testing/AUDITORIA-POKA-YOKE-COMPRAS.md` (< 1200 palabras) resumiendo:
1. Existencia del endpoint de cotizaciones por Insumo + Proveedor (`idInsumo` + `idProveedor`).
2. Mapeo de campos: `presentacionCompra`, `cantidadPresentacion`, `unidadPresentacion`, `cantidadEquivalenteBase`, `precioCompra`.
3. Brechas en el hook de compras y plan de implementación en 5 capas.

---

## ⚙️ FASE 2: IMPLEMENTACIÓN BACKEND (CAPAS 1 Y 2)

### T1. Endpoint de Cotizaciones por Insumo y Proveedor
En `apps/api/src/supplier-prices/`:
1. **Repository (`supplier-prices.repository.js`):**
   * Implementar método `findBySupplierAndSupply(idProveedor, idInsumo)`:
     ```javascript
     async findBySupplierAndSupply(idProveedor, idInsumo) {
       return this.prisma.precioProveedor.findMany({
         where: {
           idProveedor,
           idInsumo,
           activo: true,
         },
         orderBy: { fechaRegistro: 'desc' },
       });
     }
     ```
2. **Service (`supplier-prices.service.js`):**
   * Exponer la consulta validando presencia de ambos UUIDs.
3. **Controller (`supplier-prices.controller.js`):**
   * Endpoint `GET /supplier-prices/lookup?idProveedor=...&idInsumo=...` (o `supplier/prices/lookup` respetando el prefijo del módulo).
   * Retornar arreglo de cotizaciones con status 200.

---

## 🎨 FASE 3: IMPLEMENTACIÓN FRONTEND (CAPAS 1 A 5)

### T2. Consumo y Autocompletado Reactivo
En `apps/web/src/app/operations/purchases/new/`:
1. **Hook (`useFormPhaseData.js`):**
   * Al seleccionar o cambiar `idProveedor` e `idInsumo` en una fila, consultar automáticamente las cotizaciones disponibles mediante `apiClient`.
   * **Capa 1:** Si devuelve exactamente 1 cotización activa, precargar automáticamente:
     `empaque`, `contenidoUnitario` (`cantidadEquivalenteBase`), `unidadMedida`, y `precioUnitario`.
   * **Capa 2:** Si devuelve múltiples cotizaciones ($N > 1$), habilitar selector rápido de "Presentación de Compra Habitual" para poblar los valores con un clic.
   * Si no hay cotizaciones, mantener fallback a los valores canónicos del insumo (`unidadBase`).

2. **Validaciones y Warnings Poka-Yoke (`FormPhaseRowPackaging.jsx` / `FormPhaseRowItem.jsx`):**
   * **Capa 3 (Alerta UNIDAD + Contenido = 1):** Si el insumo tiene unidad base `kg`, `g`, `L` o `ml`, y el operador selecciona empaque `UNIDAD` con contenido `1`, renderizar advertencia ámbar:
     `⚠️ El insumo se mide en [unidadBase]. Ingresarás solo 1 [unidadBase] a bodega.`
   * **Capa 4 (Preview de impacto en inventario):** Renderizar de forma visible el cálculo matemático claro:
     `✦ Impacto en Inventario: [cantEmpaques] × [contenidoUnitario] [unidad] = +[totalNeto] [unidad] en bodega.`
   * **Capa 5 (Warning Empaque ≠ UNIDAD + Contenido = 1):** Si se selecciona `BOLSA`, `BULTO`, `CAJA`, `BIDÓN` o `CANASTILLA` pero el contenido se deja en `1`, renderizar alerta de control:
     `⚠️ ¿Un(a) [empaque] contiene solo 1 [unidad]? Verifica el contenido neto por empaque.`

---

## 🧪 VALIDACIÓN LOCAL Y GOBERNANZA
1. Validar sintaxis en backend:
   `node --check apps/api/src/supplier-prices/supplier-prices.controller.js`
   `node --check apps/api/src/supplier-prices/supplier-prices.service.js`
   `node --check apps/api/src/supplier-prices/supplier-prices.repository.js`
2. Validar sintaxis y SRP en frontend:
   `node --check apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowPackaging.jsx`
   `node .agents/scripts/verify-srp.js`

---

## 🛑 CRITERIO DE DETENCIÓN
- Auditoría documentada en `apps/prompts/testing/AUDITORIA-POKA-YOKE-COMPRAS.md`.
- Endpoint backend operativo y consumido en el formulario de compras.
- Advertencias Poka-Yoke (Capas 3, 4 y 5) visibles en pantalla ante configuraciones ambiguas.
- CERO errores de sintaxis (`verify-srp.js` termina en 0).
- DETENTE inmediatamente sin realizar commits ni tocar módulos fuera de alcance.

## 📋 REPORTE DE SALIDA (ESTRICTO)
Responde ÚNICAMENTE con:
• Archivo de auditoría generado.
• Endpoint backend implementado / adaptado.
• Componentes frontend actualizados con las 5 capas Poka-Yoke.
• Resultado de verificación sintáctica y guardián SRP.
• Estado: [COMPLETADO / BLOQUEADO].