> Diagnostica y corrige el fallo al registrar un insumo nuevo desde FormPhase:

1. DIAGNÓSTICO DEL CONTRATO BACKEND:
   - Revisa en apps/api/src/ (en insumos.controller.js, insumos.service.js, o insumos.schema.js) y en apps/api/prisma/schema.prisma:
     * Cuáles son los campos obligatorios del modelo Insumo.
     * Cuáles son los enums válidos para `categoria` y `unidadBase` (o `unidadMedida`).
     * Qué tipos de datos exige el validador (Zod / Joi / Prisma).

2. ACCIÓN EN apps/web/src/app/operations/purchases/new/components/FormPhase.jsx (y QuickInsumoModal):
   - Ajusta el formulario y el payload de `handleCreateInsumo` para cumplir exactamente con el contrato del backend:
     * Mapea las unidades y categorías a los valores Enum exactos que espera la API (ej. transformar "ml" a "MILILITRO" o "ML", "Materia Prima" a "MATERIA_PRIMA", según defina el backend).
     * Asegura que `stockMinimo` sea `parseFloat(form.stockMinimo) || 0`.
     * Incluye cualquier campo requerido faltante (ej. código autogenerado o default, descripción vacía).
   - En el bloque `catch` de `handleCreateInsumo`, extrae e imprime en consola y en el Toast el detalle real del error:
     ```javascript
     const serverError = err?.response?.data?.message || err?.response?.data?.error || err?.message;
     console.error('Detalle error insumo:', err?.response?.data);
     showNotification(`Error al registrar insumo: ${JSON.stringify(serverError)}`, 'error');
     ```

3. VALIDACIÓN:
   - Valida la sintaxis:
     node --check apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
   - Prueba en navegador: abre el modal "+ Nuevo Insumo", llena el formulario y guárdalo; debe responder 201 Created, seleccionarse en la fila y notificar en verde.