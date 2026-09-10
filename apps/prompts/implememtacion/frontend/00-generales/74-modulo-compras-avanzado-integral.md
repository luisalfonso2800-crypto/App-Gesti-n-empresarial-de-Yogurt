TAREA CONTROLADA — MÓDULO DE COMPRAS: LISTADO INTELIGENTE DE EXISTENTES Y ALTA DINÁMICA DE NUEVOS

OBJETIVO
Construir el flujo integral de Compras (`/operations/purchases/new` y backend) garantizando una experiencia de usuario ágil:
1. Listar dinámicamente proveedores e insumos ya registrados en la base de datos para selección inmediata.
2. Permitir el alta en caliente ("+ Crear Nuevo") tanto de insumos como de proveedores sin abandonar la compra en curso.
3. Sincronizar automáticamente inventarios, precios de proveedor, trazabilidad de lotes y cuentas por pagar.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/api/src/purchases/
- apps/api/src/inventory/
- apps/api/src/supplies/
- apps/api/src/suppliers/
- apps/web/src/app/operations/purchases/
- apps/web/src/components/ui/icons.jsx

REGLAS TÉCNICAS OBLIGATORIAS
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo. PROHIBIDO Tailwind.
3. Usar iconos centralizados desde apps/web/src/components/ui/icons.jsx.
4. Transacciones atómicas con `prisma.$transaction` en el backend.
5. Los cálculos matemáticos (conversión neta a bodega, costo base y subtotal) deben reaccionar en tiempo real.

ALCANCE PUNTUAL

1. Selector Híbrido de Proveedores:
   - Al abrir el campo, desplegar todos los proveedores activos registrados en BD con buscador por texto.
   - En la cabecera del desplegable, incluir la opción destacada: "+ Registrar Nuevo Proveedor".
   - Si se selecciona uno existente: carga automáticamente sus condiciones comerciales predeterminadas.
   - Si se crea uno nuevo: abre un modal/drawer liviano (Razón social, NIT, Teléfono), lo guarda en el estado de la compra y lo deja preseleccionado.

2. Selector Híbrido de Insumos (Por Fila):
   - Cada línea de compra tiene un selector con buscador que lista todos los insumos existentes en base de datos (con su categoría y unidad base visible en texto tenue).
   - En el menú figura la opción: "+ Crear Nuevo Insumo".
   - Si se elige un insumo existente:
     * Fija su `Unidad Base` (solo lectura).
     * Si tiene cotización previa en `Precios_Proveedores`, sugiere la última presentación y precio de compra de referencia.
   - Si es nuevo: despliega el modal rápido de insumo (Nombre, Categoría, Unidad Base y Stock Mínimo) y lo inserta listo en la fila actual.

3. Matriz de Conversión y Datos Operativos:
   - Presentación de compra (ej. Bulto 50 kg, Caja 100 und).
   - Cantidad de empaques comprados y Contenido base por empaque.
   - Cálculo visual: `Total a bodega = Empaques * Contenido` y `Costo base = Precio / Contenido`.
   - Toggle colapsable "Calidad / Lote" para capturar Lote del proveedor y Fecha de vencimiento (obligatoria si es materia prima perecedera).

4. Backend Transaccional (`apps/api/src/purchases/`):
   - Endpoint `POST /purchases` que procesa la compra completa:
     * Alta de proveedor o insumos si vienen identificados como nuevos.
     * Consecutivo `CMP-YYYY-XXXX`.
     * Asiento de la compra y detalle.
     * Entrada en `Inventarios` y `Movimientos_Inventario` (`ENTRADA_COMPRA`).
     * Actualización/inserción histórica en `Precios_Proveedores`.
     * Registro en Cuentas por Pagar si la condición es `CREDITO`.

VALIDACIÓN
- Comprobar que `pnpm --filter web build` compile con código 0.
- Comprobar que la API arranque y valide rutas sin fallas de sintaxis.

FORMATO DE CIERRE
Entregar exclusivamente el reporte estándar indicando estado, módulos enlazados, archivos modificados y confirmación de build limpio.