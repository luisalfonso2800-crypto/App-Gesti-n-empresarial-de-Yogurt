feat(multilevel-recipes-wip): consolidar recetas multinivel, semielaborados WIP y trazabilidad de lotes

- Cambios tecnicos de la fase:
  * Backend & Prisma: Flexibilización de DetalleReceta y DetalleProduccion para admitir idInsumo o idProductoIntermedio.
  * Prisma: Incorporación de autorreferencia idLotePadre en modelo Lote para genealogía sanitaria y trazabilidad de árbol de lotes (BPM / INVIMA).
  * Catálogo: Creación y registro de presentación de sistema 'A GRANEL' para productos intermedios y bases en tanque.
  * Motor de Producción: Adaptación de getRecipeBom, startProduction y completeProduction para resolución dual de stock (Inventario e InventarioProducto), deducción de saldo en lote padre y propagación de costos unitarios.
  * Módulo Recetas Frontend: Selector agrupado con optgroups (Insumos vs Bases WIP) y regla Poka-Yoke anti-recursión.
  * Módulo Recetas Frontend: Cápsula resumen de composición y proyección de costos en verde (#F0FDF4).
  * Módulo Producción Frontend: Detección reactiva de bases intermedias, consulta asíncrona de tanques/lotes activos en /lots, selector de Lote Padre y bloqueo por stock insuficiente.
  * Módulo Presentaciones & Catálogos: Ajustes de subida de imágenes, presets y sincronización de contratos.
  * Ajustes de Inventario: Módulo de ajuste global de inventario y widget de onboarding en Header.

- Documentacion, prompts y ajustes incorporados por el desarrollador:
  * `docs/diagnosticos/ARQUITECTURA_RECETAS_MULTINIVEL_WIP.md`: Diagnóstico y diseño arquitectónico detallado.
  * `docs/diagnosticos/AUDITORIA_CADENA_VALOR_Y_DEPENDENCIAS.md`: Auditoría integral de dependencias de cadena de valor.
  * `docs/diagnosticos/AUDITORIA_OPERACIONES_PLANTA_Y_EMPTY_STATES.md`: Auditoría de estados vacíos y operaciones de planta.
  * `docs/diagnosticos/AUDITORIA_MODALES_FRONTEND.md`: Auditoría y estandarización de modales frontend.
  * `apps/prompts/implememtacion/frontend/07-revision-final/`: Prompts de tareas 211 a 232 completados e integrados.

- Alcance:
  * Consolidación integral de la rama feat/manna-decision-analytics-engine, recetas multinivel, semielaborados WIP a granel y trazabilidad sanitaria de lotes.
