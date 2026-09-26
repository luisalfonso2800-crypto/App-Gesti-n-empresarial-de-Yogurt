TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Transformar la vista del historial de lotes liquidados de la Bitácora de Fabricación de una cuadrícula de tarjetas a una tabla de datos compacta tipo hoja de cálculo/Excel para auditoría y trazabilidad rápida:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo donde se renderiza la pestaña de historial (`ProductionHistoryTab.jsx` o dentro de `apps/web/src/app/operations/production/...`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx` (o componente correspondiente de la pestaña Historial)

INSTRUCCIONES TÉCNICAS:

1. Estructura de la Tabla Compacta (Data Table):
   - Reemplazar el layout de tarjetas repetitivas por un componente `<table>` denso y estilizado con Tailwind:
     * Encabezados (`<thead>`):
       - `Fecha`
       - `Lote Fabricado`
       - `Producto / Fórmula`
       - `Inóculo Origen`
       - `Total Obtenido`
       - `Destino Cava`
       - `Reserva WIP (Inóculo)`
       - `Estado`
       - `Detalle`
     * Filas (`<tbody>`):
       - Renderizado alternado (`odd:bg-white even:bg-slate-50/50 hover:bg-emerald-50/40 transition-colors`).
       - Fuentes monoespaciadas para códigos de lote (`font-mono text-xs font-semibold`).
       - Badges compactos para inóculos origen y destino cava.
       - Enlace o botón de acción rápida para abrir el modal de trazabilidad.

2. Herramientas de Cabecera:
   - Incluir un input de filtro rápido por texto (para buscar por lote o producto).
   - Mostrar contador total: `Mostrando X lotes procesados`.

3. Respetar el límite de líneas SRP (< 135 líneas). Si se requiere, extraer filas a un subcomponente auxiliar.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/...`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La pestaña de histórico ya no muestra tarjetas gigantes redundantes.
- Los datos se visualizan en una tabla tabular limpia, compacta y legible tipo hoja de cálculo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.