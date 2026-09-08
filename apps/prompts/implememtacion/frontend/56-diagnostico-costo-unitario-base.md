TAREA CONTROLADA — DIAGNÓSTICO Y PROPUESTA: COSTO POR UNIDAD BASE EN INSUMOS Y PRECIOS

OBJETIVO
Inspeccionar cómo está modelado actualmente en el esquema de Prisma y en el backend el registro de costos, compras y precios de proveedores para insumos, con el fin de calcular de forma instantánea el costo unitario por unidad base (ej. costo por gramo, mililitro o unidad individual cuando se compra por bultos o paquetes).

FUENTES DE VERDAD
- `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`
- `apps/api/prisma/schema.prisma`
- `apps/web/src/app/catalog/supplies/`
- `apps/web/src/app/catalog/supplier-prices/` (o módulo equivalente de Precios de Proveedores)
- `apps/web/src/app/operations/purchases/` (o módulo de Compras)

REGLAS TÉCNICAS ESTRICTAS
1. Esta tarea es de DIAGNÓSTICO E INSPECCIÓN.
2. NO modificar esquemas ni aplicar migraciones a PostgreSQL.
3. NO alterar código ni lógica existente hasta conocer el modelo real.
4. NO instalar dependencias externas ni introducir TypeScript (.ts, .tsx).

ALCANCE DE LA REVISIÓN
1. Inspeccionar `schema.prisma`:
   - Revisar los modelos correspondientes a `Insumos`, `Precios_Proveedor` (o `SupplierPrice`), `Compras` y `Detalle_Compras`.
   - Identificar qué campos existen para: unidad de medida, cantidad comprada, precio total, factor de conversión o precio unitario base.
2. Revisar la lógica de negocio actual:
   - Determinar si el backend ya almacena o calcula el costo unitario equivalente por unidad base (por ejemplo, dividiendo el precio del paquete entre el número de unidades base).
   - Verificar si en el frontend ya existen inputs para cantidad por empaque o factor de conversión.
3. Formular la solución técnica mínima:
   - Explicar cómo mostrar en la interfaz de usuario:
     a) El costo desglosado al cotizar o comprar (ej. "Paquete de 25 vasos a $12.500 → $500 por vaso").
     b) La visualización del costo de referencia por unidad base en el catálogo de Insumos/Recetas.
   - Indicar si la solución requiere un cálculo exclusivo en frontend o si amerita un campo derivado en la base de datos.

FORMATO DE CIERRE
Responder exclusivamente con esta estructura:

DIAGNÓSTICO COSTO UNITARIO BASE — CIERRE
• Estado: COMPLETADO / BLOQUEADO
• Modelo Insumos y Unidad Base: [Campos existentes]
• Modelo Precios / Compras: [Campos existentes para cantidades y costos]
• Factor de conversión existente: SÍ / NO / PARCIAL
• Viabilidad de cálculo instantáneo en Frontend: ALTA / MEDIA / BAJA
• Archivos y modelos inspeccionados: [lista]
• Propuesta de implementación mínima: [Breve descripción técnica sin dependencias]
• Bloqueos: NINGUNO / [Detalle]