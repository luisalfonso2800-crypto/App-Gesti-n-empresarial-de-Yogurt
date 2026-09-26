TAREA (RESTAURACIÓN ESTÉTICA INMEDIATA - MÁXIMO 2 EDICIONES):
Corregir la presentación visual de "Productos Formulados Listos para Producir" en `apps/web/src/app/operations/production/components/` implementando tarjetas limpias (Cards) contenidas, con imágenes recortadas a altura fija, diseño en cuadrícula responsiva (Grid) y botón operativo con estilos corporativos.

ARCHIVOS A EDITAR DIRECTAMENTE:
1. `apps/web/src/app/operations/production/components/ProductionProductLaunchpad.jsx`
2. `apps/web/src/app/operations/production/components/ProductionProductLaunchpadCard.jsx`

INSTRUCCIONES EXACTAS DE MAQUETACIÓN:

1. En `ProductionProductLaunchpad.jsx`:
   - Cabecera:
     * Título "Productos Formulados Listos para Producir" con su badge de contador al lado.
     * Barra de búsqueda compacta a la derecha: `<input type="text" placeholder="Buscar fórmula o producto..." className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 w-56" />`
   - Contenedor de Productos:
     * Reemplazar la lista vertical por un Grid responsivo con límite de altura y scroll vertical suave:
       `style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', maxHeight: '380px', overflowY: 'auto', padding: '4px' }}`
     * Si no hay coincidencias de búsqueda, mostrar mensaje sutil de catálogo vacío.
   - Respetar límite SRP (< 120 líneas).

2. En `ProductionProductLaunchpadCard.jsx`:
   - Envolver cada elemento en una TARJETA COMPACTA con bordes redondeados y sombra suave:
     `style={{ display: 'flex', flexDirection: 'column', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff', overflow: 'hidden', height: '100%' }}`
   - Imagen superior:
     * Contenedor con altura estricta fija: `style={{ width: '100%', height: '120px', backgroundColor: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}`
     * Etiqueta `<img>`: `style={{ width: '100%', height: '100%', objectFit: 'cover' }}`.
     * Fallback si no hay imagen: renderizar el icono de empaque centrado con color tenue.
   - Contenido inferior (Padding interno `p-3` o `style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}`):
     * Título del producto: `style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.1rem' }}`
     * Badge de Stock: `style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}` con el icono 📦 y el valor `En Cava: X`.
     * Botón "▶ Producir Lote":
       `style={{ width: '100%', padding: '0.45rem', borderRadius: '8px', backgroundColor: '#1b4d3e', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}`
   - Respetar límite SRP (< 90 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionProductLaunchpad.jsx`
2. `node --check apps/web/src/app/operations/production/components/ProductionProductLaunchpadCard.jsx`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- Las tarjetas forman una cuadrícula armónica de varias columnas.
- Las imágenes están acotadas a 120px de alto sin deformarse ni desbordarse.
- Los botones tienen el color verde corporativo (`#1b4d3e`) y fondo de tarjeta blanco limpio.
- `verify-srp` retorna 0 infracciones.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
