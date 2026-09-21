TAREA (DIAGNÓSTICO Y PLANIFICACIÓN - MÁXIMO 3 TOOL CALLS EN TOTAL):
Auditar el soporte del Backend y Base de Datos para el flujo de "Producto Semielaborado / Reserva de Inóculo Interno":
1. Revisar los modelos y schemas relacionados con `ProductionOrder`, `Batch`, `InventoryMovement` e `Ingredient` / `Product`.
2. Verificar si existe la capacidad de registrar un sub-lote derivado como insumo interno recirculado en inventario sin pasar por compras.
3. Proponer la estrategia técnica (migración o extensión de endpoints) para soportar la división de lote en la liquidación.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee puntualmente los archivos de modelo/controlador de producción e inventario en backend.
- Modificar EXCLUSIVAMENTE el reporte de auditoría.

ARCHIVOS A INSPECCIONAR:
1. `apps/api/src/modules/production/` (controladores y servicios de liquidación)
2. `apps/api/src/modules/inventory/` (esquema de movimientos y lotes)
3. `apps/api/prisma/schema.prisma` (o definiciones de base de datos)

PREGUNTAS DE AUDITORÍA:
- ¿Cómo modela el backend la entrada a stock tras liquidar una orden (`finalizeBatch`)?
- ¿Permite crear un registro de inventario como insumo derivado de un lote de producción?
- ¿Cómo calcularía el costo de transferencia del iniciador reservado?

DETENCIÓN:
Genera un informe conciso con las respuestas y el plan de migración/ajuste, y DETENTE inmediatamente.