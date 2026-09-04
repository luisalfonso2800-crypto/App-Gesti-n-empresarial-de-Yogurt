LEE PRIMERO:
@[docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md]

Y EJECUTA EXCLUSIVAMENTE EL REFINAMIENTO VISUAL Y DE DATOS DEL MÓDULO INSUMOS.

CONTEXTO
========
El Backend y Frontend levantan correctamente.
PostgreSQL está operativo con los datos de prueba existentes.
El Dashboard ya fue atendido.
Estamos en la etapa de PRUEBAS FUNCIONALES V1.

IMPORTANTE:
- Frontend estrictamente en JavaScript (.js, .jsx).
- PROHIBIDO TypeScript (.ts, .tsx).
- Mantener estilos con CSS Modules.
- PROHIBIDO Tailwind o librerías externas de UI.
- NO instalar dependencias.
- NO tocar PostgreSQL, esquemas Prisma ni reejecutar seeds.

OBJETIVO DE LA TAREA
====================
Afinar y limpiar la interfaz del módulo Insumos en:
`apps/web/src/app/catalog/supplies/`

ALCANCE PUNTUAL
===============
1. Revisar `apps/web/src/app/catalog/supplies/page.jsx` y su módulo CSS.
2. Manejo de Código:
   - Asegurarse de mostrar el código de catálogo real del insumo (`code` del backend, ej. INS-AZUC, INS-LECHE).
   - Si no existe `code` o viene nulo, usar un identificador legible. No mostrar pedazos crudos de UUID si hay un campo de negocio.
3. Columnas y visualización de la tabla:
   - Presentar claramente: Código, Nombre, Categoría, Unidad Base, Stock Mínimo, Estado y Acciones.
   - Si el backend expone el stock actual o movimientos, integrarlo de forma clara. Si no, no inventar campos que rompan la API.
4. Búsqueda y Filtros básicos en frontend:
   - Añadir barra de búsqueda rápida por Nombre/Código y/o filtro por Categoría para facilitar la navegación con múltiples registros.
5. Estados de interfaz:
   - Verificar y asegurar estados limpios de: Cargando (loading skeleton o spinner), Sin datos (empty state claro) y Error de conexión.
6. Mantener intactas las acciones existentes (Crear, Editar, Desactivar).

VALIDACIÓN
==========
1. Compilar el frontend: `pnpm --filter web build` (Debe terminar en OK).
2. Verificar que no se hayan creado archivos .ts o .tsx.
3. Verificar que no se hayan tocado otros módulos.

CIERRE OBLIGATORIO
==================
Entregar exactamente este reporte:

REFINAMIENTO INSUMOS — CIERRE
• Estado: COMPLETADO / ERROR
• Columna Código: [Detalle del campo utilizado]
• Filtro/Búsqueda añadido: SÍ / NO
• Estados (Loading/Empty/Error): OK / NO OK
• JavaScript: OK
• TypeScript introducido: NO
• CSS Modules: OK
• Base de datos modificada: NO
• Seed reejecutado: NO
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]