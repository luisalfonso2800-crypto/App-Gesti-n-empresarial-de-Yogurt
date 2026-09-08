TAREA DE AUDITORÍA Y DIAGNÓSTICO INTEGRAL — FLUJO DE COMPRAS, RELACIONES Y CÁLCULOS

OBJETIVO TÉCNICO
Ejecutar una auditoría técnica profunda y de solo lectura sobre la base de datos, el backend y el frontend para mapear de extremo a extremo el circuito de Compras.
El resultado debe ser un informe técnico detallado que se guardará físicamente en `docs/diagnosticos/DIAGNOSTICO_MODULO_COMPRAS_BACKEND.md`.

REGLAS DE EJECUCIÓN OBLIGATORIAS
1. MODO ESTRICTAMENTE DE SOLO LECTURA: No modifiques código fuente ni esquemas en `apps/api` o `apps/web`.
2. NO asumir ni adivinar: Extrae nombres literales de campos, tablas, métodos de servicios y funciones de controladores.
3. Generar el documento markdown final con todos los hallazgos en la ruta indicada.

FUENTES DE VERDAD A INSPECCIONAR
- apps/api/prisma/schema.prisma (Modelos: Insumo, Proveedor, Precios_Proveedores / PrecioProveedor, Compra, DetalleCompra, Inventario, MovimientoInventario, etc.)
- apps/api/src/purchases/ (controlador, servicio, repositorio, dtos o módulos)
- apps/api/src/supplier-prices/ (controlador, servicio, repositorio)
- apps/api/src/supplies/ (controlador, servicio, repositorio)
- apps/api/src/suppliers/ (controlador, servicio, repositorio)
- apps/api/src/inventory/ (manejo de existencias y movimientos)
- apps/web/src/app/catalog/supplier-prices/page.jsx (origen de datos del carrito/storage)
- apps/web/src/app/operations/purchases/new/page.jsx (checklist y formulario de compra)

ESTRUCTURA EXACTA DEL INFORME A GENERAR (`docs/diagnosticos/DIAGNOSTICO_MODULO_COMPRAS_BACKEND.md`)

1. MAPA DE MODELOS DE BASE DE DATOS Y RELACIONES (Prisma):
   - Extraer y transcribir los modelos exactos vinculados: `Proveedor`, `Insumo`, `Precios_Proveedores`, `Compra`, `DetalleCompra`, `Inventario`, `MovimientoInventario`.
   - Identificar cómo se relacionan: llaves foráneas, nombres de campos, tipos de datos y unicidad.
   - Detallar campos para conversión: ¿Dónde se almacena la presentación comercial, el factor de conversión numérico (`contenidoBase`), la unidad base y la marca?

2. DIAGNÓSTICO DEL CASO CRÍTICO "CANTINA 40L":
   - Explicar por qué en pantalla se observó `contenidoBase: 1` o `1 Litros` en lugar de `40 Litros`.
   - Verificar si en la base de datos `contenidoBase` está guardado en 1 o si el endpoint/frontend descartó el campo real.

3. AUDITORÍA DE SERVICIOS Y CONTROLADORES EN LA API:
   - Mapear los endpoints existentes en `apps/api/src/purchases/`:
     * Rutas HTTP, parámetros de entrada y DTOs esperados.
     * Métodos de cálculo de subtotales, totales y costos unitarios dentro de `purchases.service.js` o `purchases.repository.js`.
     * Manejo de la transacción `prisma.$transaction`: ¿Cómo actualiza el inventario físico hoy? ¿Qué cantidad suma a bodega (`cantidad` o `cantidad * contenidoBase`)?

4. TRAZABILIDAD DEL FLUJO DE DATOS (CATÁLOGO -> CARRITO -> CHECKLIST -> FORMULARIO):
   - Detallar el payload JSON exacto que `apps/web/src/app/catalog/supplier-prices/page.jsx` serializa en `sessionStorage.getItem('selectedForPurchase')`.
   - Señalar qué atributos técnicos se pierden en el camino (marca, contenido base numérico, stock mínimo, idProveedor).
   - Indicar qué llamadas fetch hace actualmente la página de compras que provocan errores 404 y cuál es la URL base correcta según el resto del frontend.

5. PROPUESTA ARQUITECTÓNICA: CENTRALIZACIÓN MATEMÁTICA EN BACKEND:
   - Diseñar el flujo de liquidación centralizada para que el frontend NO haga cálculos:
     * Definir el contrato de un endpoint (ej. `POST /purchases/simulate` o payload de cálculo en `POST /purchases`).
     * Entradas requeridas: `idPrecioProveedor`, `cantidadEmpaques`, `precioEmpaque`.
     * Salidas oficiales calculadas por el backend: `subtotal`, `ingresoNetoBodega`, `costoBaseUnitario`.
   - Explicar cómo debe procesar el backend los insumos marcados como "No Conseguidos" (motivos) frente a los "Conseguidos".

VALIDACIÓN Y ENTREGA
- Verificar que el archivo `docs/diagnosticos/DIAGNOSTICO_MODULO_COMPRAS_BACKEND.md` se cree con información técnica fidedigna.
- Confirmar que ningún archivo de código haya sido alterado durante la inspección.

FORMATO DE REPORTE EN CONSOLA
Entregar únicamente el reporte estándar indicando:
• ESTADO: Diagnóstico Completado
• INFORME GENERADO: docs/diagnosticos/DIAGNOSTICO_MODULO_COMPRAS_BACKEND.md
• RESUMEN DE HALLAZGOS: Causa raíz de conversión 40L, estado de endpoints 404 y propuesta para centralizar cálculos en backend.