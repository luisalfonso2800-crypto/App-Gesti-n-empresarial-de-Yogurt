> Corrige los errores de API en el modal de Nuevo Insumo y en handleConfirmar de FormPhase:

1. DIAGNÓSTICO DE LOS ERRORES:
   - "Error al registrar insumo": el payload enviado a POST /api/v1/insumos tiene campos mal tipados (ej. stockMinimo debe ser Number(stockMinimo), categoria/unidadBase deben alinearse con el schema de Prisma).
   - "ApiError: Error en la petición" en handleConfirmar: 
     * Se está intentando crear compras separadas en lugar de incorporar los ítems a la orden existente (`orderId`).
     * Se envían filas con precio 0 o campos relacionales requeridos nulos (ej. falta idPresentacion, o idProveedor es inválido).

2. ACCIÓN EN apps/web/src/app/operations/purchases/new/components/FormPhase.jsx (y QuickInsumoModal):
   - En el Modal de Registro de Insumo:
     * Asegura el formateo correcto de tipos:
       ```javascript
       {
         nombre: form.nombre.trim(),
         categoria: form.categoria,
         unidadBase: form.unidadBase,
         stockMinimo: parseFloat(form.stockMinimo) || 0
       }
       ```
     * Maneja el retorno de la API asegurando que el nuevo insumo se seleccione automáticamente en la fila activa.
   - En `handleConfirmar`:
     * Valida que cada fila tenga: proveedor seleccionado (id), insumo seleccionado (id), cantidad > 0 y precioUnitario > 0. Si una fila está incompleta o en $0, muestra alerta específica antes de llamar a la API.
     * En lugar de llamar flujos no soportados, despacha la adición de ítems directo a la orden activa (`orderId`) mediante el endpoint existente de adición de ítems (`POST /api/v1/purchases/orders/${orderId}/items` o el servicio correspondiente del backend).
     * En caso de error, muestra en consola y en el toast el detalle exacto que devuelve el backend (`error.response?.data?.message || error.message`).

3. VALIDACIÓN:
   - Valida la sintaxis con:
     node --check apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
   - Prueba en navegador:
     1) Registra un nuevo insumo desde el modal sin que arroje error.
     2) Completa una fila con proveedor, insumo y precio mayor a 0 y confirma la incorporación a la orden exitosamente.