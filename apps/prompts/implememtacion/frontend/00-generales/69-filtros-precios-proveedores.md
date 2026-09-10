TAREA CONTROLADA — FILTROS DINÁMICOS: PRECIOS DE PROVEEDORES

OBJETIVO
Agregar una barra de filtrado reactivo en la cabecera de la tabla en `apps/web/src/app/catalog/supplier-prices/` (o la ruta correspondiente a Precios de Proveedores) para permitir localizar tarifas rápidamente sin recargar la página.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/web/src/app/catalog/supplier-prices/

REGLAS TÉCNICAS
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. Estilos exclusivamente con CSS Modules. PROHIBIDO Tailwind.
3. El filtrado debe ocurrir preferentemente en memoria del cliente (o con query params limpios si la tabla tiene paginación por backend).

ALCANCE PUNTUAL
1. Barra de Filtros (UI):
   - Ubicarla entre el encabezado/botón "Nuevo Registro" y la tabla de datos.
   - Componentes de filtro:
     * Selector <Select> "Filtrar por Insumo" (opción "Todos los insumos" por defecto).
     * Selector <Select> "Filtrar por Proveedor" (opción "Todos los proveedores" por defecto).
     * Selector <Select> "Estado" (Activos, Inactivos, Todos).
     * Input de texto para búsqueda libre.
     * Botón "Limpiar Filtros" cuando haya algún criterio aplicado.

2. Lógica de Filtrado:
   - Los selectores de Insumo y Proveedor deben poblarse dinámicamente a partir de los datos cargados (o de sus respectivos endpoints /supplies y /suppliers).
   - Actualizar la lista visible en tiempo real combinando los criterios seleccionados.

VALIDACIÓN
- Comprobar que `pnpm --filter web build` compile con código 0 sin errores de estilos ni de imports.

FORMATO DE CIERRE
Entregar exclusivamente el reporte estándar indicando estado, archivos modificados y confirmación de build limpio.