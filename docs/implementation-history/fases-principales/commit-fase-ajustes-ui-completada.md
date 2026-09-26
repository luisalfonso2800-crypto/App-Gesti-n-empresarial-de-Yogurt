feat(ajustes-ui): consolidar SCADA Multiplexor y UI post-modularizacion

- Cambios tecnicos de la fase:
  * Desarrollo completo del SCADA Multiplexor en `/dashboard` con Canvas industriales (Silos, Radar FEFO, Osciloscopio financiero).
  * Rediseño de cabeceras, tarjetas tácticas MANNÁ y Cinta de Accesos Rápidos (Cero Tailwind, CSS Modules, Cero Scroll - Viewport Lock 100vh).
  * Creacion e integracion del framework de SmartModals y StrictNumberInputs (prevencion de errores Poka-Yoke).
  * Correccion transversal de modales CRUD en catalogos (proveedores, insumos, productos, ventas, cobros).
  * Implementacion de backend SCADA (dashboard module) para telemetría simulada/real.
  * Ajustes en `globals.css` y `shell.module.css` para anclaje total de layout (height 100vh) y prevencion de overscrolling.
  * Actualización de Avatar de Productos (`ProductAvatar.jsx`) con escalado dinámico fluido y lupa al hover.
  * Paginación local táctil en catálogos.

- Documentacion, prompts y ajustes incorporados por el desarrollador:
  * `apps/prompts/implememtacion/frontend/dashboard/`: Planes e instrucciones del Multiplexor, arreglos de fallbacks (lucide), layouts estables.
  * `apps/prompts/implememtacion/frontend/03-Smart-Modals/`: Documentacion de integracion Poka-Yoke.
  * `docs/MANUAL_DE_DISEÑO_UI/`: Guidelines de diseno actualizados.
  * `AGENTS.md`: Nuevas directivas agregadas sobre lectura cruzada de AI_PROJECT_OPERATING_MANUAL, erradicacion del alert/confirm y confirmaciones visuales.

- Alcance:
  * Cierre estricto de fase de consolidacion UI (ajustes esteticos, correccion scroll, estandarizacion modal y multiplexor) sin incluir dependencias ajenas.
