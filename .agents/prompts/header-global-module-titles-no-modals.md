TAREA CONTROLADA — HEADER GLOBAL: TÍTULOS DINÁMICOS PARA TODOS LOS MÓDULOS DEL ERP (EXCLUSIÓN DE MODALES)

OBJETIVO TÉCNICO:
1. Actualizar el componente transversal `Header.jsx` para proyectar el título formal de la página activa a partir de la ruta URL (`usePathname`), cubriendo todos los módulos de la plataforma.
2. REGLA ESTRICTA DE MODALES: Los títulos proyectados en el Header corresponden EXCLUSIVAMENTE a la vista/página base (`page.jsx`). La apertura de ventanas flotantes o diálogos (`SmartModal`, `SupplyModal`, `OrderModal`, etc.) NO debe alterar ni sobrescribir el título del módulo en el Header bajo ninguna circunstancia.
3. Centralizar visualmente la instrumentación SCADA (LED "SISTEMA EN LÍNEA", fecha y operador) entre el título del módulo y los botones de acción/carrito del extremo derecho.
4. Aplicar responsividad limpia mediante CSS Modules (ocultar título en móviles < 768px y fecha/operador en < 1024px).

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 2 LECTURAS):
- apps/web/src/components/shell/Header.jsx (o ubicación en layout/Header.jsx)
- apps/web/src/components/shell/header.module.css (o shell.module.css)
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, MÁXIMO 2 EDICIONES):
- CERO búsquedas recursivas masivas (`grep`, `find`, `listDir`).
- Prohibido usar estilos inline (`style={{}}`), usar exclusivamente CSS Modules.
- Respetar SRP: mantener `Header.jsx` modular (< 130 líneas).
- Código exclusivamente JavaScript nativo (.jsx / .js), sin TypeScript.
- No alterar clases ni locators utilizados por las pruebas E2E (`scadaStatus`, `cartContainer`, etc.).

DICCIONARIO DE RUTAS BASE A MAPEAR EN EL HEADER:
- `/dashboard` -> "Centro de Comando SCADA"
- `/operations/purchases/new` -> "Nueva Compra Directa"
- `/operations/purchases` -> "Registro y Control de Compras"
- `/operations/inventory` -> "Control de Inventario y Bodega"
- `/operations/production` -> "Planificación de Producción"
- `/operations/lots` -> "Trazabilidad y Control de Lotes"
- `/catalog/supplies` -> "Catálogo Maestro de Insumos"
- `/catalog/products` -> "Catálogo de Productos Terminados"
- `/catalog/presentations` -> "Presentaciones y Empaques"
- `/catalog/recipes` -> "Recetas Maestras de Elaboración"
- `/catalog/providers` o `/catalog/suppliers` -> "Directorio de Proveedores"
- `/catalog/supplier-prices` -> "Listas de Precios de Proveedores"
- `/commercial/sales` -> "Módulo de Ventas y Despachos"
- `/commercial/clients` -> "Directorio Comercial de Clientes"
- `/commercial/payments` -> "Gestión de Pagos y Cobros"
- `/commercial/expenses` -> "Control de Gastos Operativos"

ACCIONES A EJECUTAR:

1. En `Header.jsx`:
   - Importar `usePathname` de `next/navigation`.
   - Definir una función auxiliar de resolución de títulos que evalúe la ruta de mayor especificidad a menor especificidad:
     ```javascript
     const getModuleTitle = (pathname = '') => {
       if (pathname.startsWith('/operations/purchases/new')) return 'Nueva Compra Directa';
       if (pathname.startsWith('/operations/purchases')) return 'Módulo de Compras';
       if (pathname.startsWith('/operations/inventory')) return 'Control de Inventario';
       if (pathname.startsWith('/operations/production')) return 'Órdenes de Producción';
       if (pathname.startsWith('/operations/lots')) return 'Control de Lotes';
       if (pathname.startsWith('/catalog/supplies')) return 'Catálogo de Insumos';
       if (pathname.startsWith('/catalog/products')) return 'Catálogo de Productos';
       if (pathname.startsWith('/catalog/presentations')) return 'Presentaciones Comerciales';
       if (pathname.startsWith('/catalog/recipes')) return 'Recetas Maestras';
       if (pathname.startsWith('/catalog/supplier-prices')) return 'Precios de Proveedores';
       if (pathname.startsWith('/catalog/providers') || pathname.startsWith('/catalog/suppliers')) return 'Directorio de Proveedores';
       if (pathname.startsWith('/commercial/sales')) return 'Módulo de Ventas';
       if (pathname.startsWith('/commercial/clients')) return 'Directorio de Clientes';
       if (pathname.startsWith('/commercial/payments')) return 'Pagos y Cobros';
       if (pathname.startsWith('/commercial/expenses')) return 'Gastos Operativos';
       if (pathname.startsWith('/dashboard')) return 'Centro de Comando SCADA';
       return 'MANNÁ ERP';
     };
     ```
   - Renderizar el título dentro de `<h1 className={styles.moduleTitle}>{moduleTitle}</h1>` ubicado a la izquierda de la barra superior.
   - Preservar la instrumentación SCADA en el centro y las acciones de usuario/carrito a la derecha.

2. En el archivo CSS Module (`header.module.css` o equivalente):
   - `.topBar`: `display: flex; align-items: center; justify-content: space-between; height: 52px; padding: 0 1rem;`
   - `.moduleTitle`: `font-size: 0.95rem; font-weight: 700; color: #166534; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
   - `.scadaInstrumentation`: `display: flex; align-items: center; gap: 0.75rem; justify-content: center;`
   - Reglas `@media`:
     * `@media (max-width: 1024px)`: ocultar fecha y operador del SCADA (`display: none;`), dejando únicamente la pastilla del LED y el título.
     * `@media (max-width: 768px)`: ocultar `.moduleTitle` para priorizar accesos rápidos y estado del sistema.

VERIFICACIÓN:
1. `node --check apps/web/src/components/shell/Header.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Cada página del ERP muestra su título correspondiente en el Header de forma automática.
- Los modales conservan su estructura interna intacta sin enviar estados ni alterar el Header.
- `verify-srp.js` retorna código 0.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Archivos modificados y líneas resultantes.
- Mapeo de rutas implementado.
- Resultado de verify-srp.js.
- Estado: [COMPLETADO / BLOQUEADO].