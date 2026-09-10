TAREA CONTROLADA — RECETAS V2: FASE 3 (INTEGRACIÓN OPERATIVA CON PRODUCCIÓN E INVENTARIO)

OBJETIVO
Conectar el módulo de Producción con el nuevo sistema de Recetas V2:
1. Precargar automáticamente la Lista de Materiales (BOM) escalada y agrupada por etapas al seleccionar una receta.
2. Resolver variantes activas (ej. selección de "Cereal Choco" o "Ninguno") activando o desactivando los insumos de empaque y complementos vinculados.
3. Crear un snapshot inmutable de la fórmula al registrar la orden de producción para proteger la trazabilidad histórica.
4. Comparar Necesidad Teórica vs. Stock Actual de Inventario y emitir alertas de faltantes.
5. Permitir registrar el consumo real por insumo al finalizar la orden, descontando el inventario físico con base en lo reportado y calculando la merma real.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- Documento de diseño técnico aprobado (Recetas V2)
- apps/api/src/production/ (production.repository.js, production.controller.js)
- apps/api/src/inventory/ (inventory.repository.js)
- apps/web/src/app/operations/production/

REGLAS TÉCNICAS OBLIGATORIAS
1. Código backend en JavaScript (.js) exclusivamente. PROHIBIDO TypeScript.
2. CSS Modules en frontend. PROHIBIDO Tailwind.
3. Redondeo estricto hacia arriba con Math.ceil() para insumos cuya unidad sea "Unidades" (empaques físicos).
4. El inventario se descuenta por consumo real reportado, NUNCA por merma teórica automática.
5. Respetar transacciones de Prisma (prisma.$transaction) para la creación de producción y movimientos de inventario.

ALCANCE PUNTUAL

1. Backend — Producción e Integración BOM (apps/api/src/production/):
   - Endpoint GET /production/recipe-bom/:idReceta?cantidad=X&variantes=A,B:
     * Retorna la lista consolidada de insumos escalados linealmente según la cantidad a producir.
     * Aplica Math.ceil() en insumos con unidad "Unidades".
     * Incluye stock actual disponible en inventario para cada insumo.
     * Retorna el faltante proyectado (Math.max(0, Requerido - Stock)).
   - Snapshot en Creación de Orden (POST /production):
     * Al crear la orden, guardar en DetalleProduccion los insumos seleccionados, cantidades teóricas proyectadas y costo unitario vigente como instantánea histórica inmutable.

2. Backend — Cierre de Producción y Descuento de Stock:
   - Al finalizar/completar una producción:
     * Registrar en DetalleProduccion el campo `cantidadRealUtilizada`.
     * Generar transaccionalmente los registros en `Movimientos_Inventario` con tipo "SALIDA_PRODUCCION".
     * Actualizar la columna `cantidadActual` en la tabla `Inventarios`.
     * Calcular y persistir la desviación o merma real (Real - Teórico).

3. Frontend — Vistas de Producción (apps/web/src/app/operations/production/):
   - Pantalla de Nueva Orden de Producción:
     * Selector de Receta activa (en lugar de obligar a meter insumos manualmente).
     * Campo numérico de "Cantidad a Producir".
     * Selectores dinámicos para los grupos de variante detectados (ej. Dropdown para grupo "CEREAL").
     * Tabla interactiva de materiales precargada:
       - Insumo | Etapa | Tipo | Requerido Teórico | Stock Actual | Estado (OK / Faltante en rojo).
   - Formulario de Cierre de Lote / Producción:
     * Permitir al operario ingresar la cantidad física consumida real (precargada con el teórico por defecto).
     * Indicador visual de merma o variación real.

VALIDACIÓN
1. `pnpm --filter api build` y arranque limpio.
2. `pnpm --filter web build` exitoso con código 0.

FORMATO DE CIERRE
Entregar exclusivamente:

FASE 3 RECETAS V2 (PRODUCCIÓN E INVENTARIO) — CIERRE
• Estado: COMPLETADO / ERROR
• Endpoint BOM escalado con stock implementado: SÍ / NO
• Snapshot inmutable en producción: SÍ / NO
• Descuento de inventario por consumo real: SÍ / NO
• Redondeo Math.ceil() en unidades físicas: SÍ / NO
• UI de producción integrada con recetas y variantes: SÍ / NO
• JavaScript nativo: OK
• TypeScript introducido: NO
• Build general: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]