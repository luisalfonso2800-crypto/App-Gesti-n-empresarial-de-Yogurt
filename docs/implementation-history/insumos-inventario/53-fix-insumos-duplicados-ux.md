FASE 28 — CORRECCIÓN AUTÓNOMA: MÓDULO INSUMOS Y TABLA MAESTRA
Lee primero:
@[docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md]

OBJETIVO
Diagnosticar, corregir y validar de inmediato los problemas visuales y de datos detectados en la vista `/supplies` (Insumos):
1. Resolver la duplicación de registros mostrada en la tabla.
2. Incorporar la columna de Código en la visualización.
3. Arreglar el corte visual en el Sidebar (sección Operaciones).

AUTORIZACIÓN DE EJECUCIÓN DIRECTA
Tienes autorización para editar directamente el código frontend (`apps/web`) y los scripts/endpoints necesarios sin detenerte a pedir confirmación previa, siempre que:
- Diagnostiques, corrijas y valides en la misma ejecución.
- Toda corrección sea segura, respaldada por la arquitectura existente y sin pérdida de datos.
- No introduzcas TypeScript (.ts, .tsx).
- No introduzcas Tailwind (mantén CSS Modules).
- No instales paquetes externos.
- No alteres esquemas ni realices cambios destructivos en la base de datos.
- Valides cada cambio antes de entregar el reporte final.

PROCEDIMIENTO OBLIGATORIO
1. Diagnóstico de duplicados:
   - Inspeccionar `apps/web/src/app/supplies` (o ruta correspondiente).
   - Verificar si la petición API concatena datos en el estado en lugar de sobreescribirlos (`setSupplies([...prev, ...data])` vs `setSupplies(data)`).
   - Verificar si la API devuelve registros repetidos o si la base de datos tiene duplicados por ejecuciones sucesivas del seed.
2. Corrección:
   - Si es un bug de render/estado en React, corregir la carga en el componente.
   - Si el endpoint o seed duplica registros idénticos por error, corregirlo. Si son registros con diferente ID pero mismo nombre, no eliminarlos arbitrariamente sin justificación.
   - Mostrar la columna "Código" (`code`) en la tabla para trazabilidad.
   - Revisar `apps/web/src/components/shell/shell.module.css` para resolver el solapamiento o corte del texto en el Sidebar (`Producción`).
3. Validación:
   - Ejecutar `pnpm --filter web build` para garantizar que la compilación siga en OK.
   - Comprobar que no haya errores en la consola.

CIERRE
Entregar exclusivamente este reporte:

CORRECCIÓN INSUMOS — CIERRE
• Estado: COMPLETADO / ERROR
• Causa de los duplicados:
• Solución aplicada a la tabla:
• Columna Código integrada: SÍ / NO
• Corrección del Sidebar: SÍ / NO
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]