# TAREA CONTROLADA — IMPLEMENTACIÓN DE MODALES INTELIGENTES POKA-YOKE (ESTÉTICA VINTAGE / INDUSTRIAL)

## REGLAS DE ORO Y RESTRICCIONES DE EJECUCIÓN
1. CERO SUPOSICIONES: No adivines nombres de endpoints, tipos de datos ni relaciones Prisma. Lee e inspecciona directamente los archivos fuente antes de tocar código:
   - Lee `apps/api/prisma/schema.prisma` para verificar nombres exactos de campos en cada entidad.
   - Lee los controladores correspondientes en `apps/api/src/` para conocer la firma y estructura exacta de los DTOs esperados.
   - Lee los componentes actuales en `apps/web/src/app/` para mantener las rutas de llamada API existentes.
2. NO ROMPER EL BACKEND: Los controladores existentes de NestJS esperan números primitivos (Int, Float, Decimal) o strings limpios. La capa de presentación maneja formato visual (`$50.000`), pero el payload HTTP enviado debe limpiarse y coincidir de forma estricta con el contrato del backend.
3. INVESTIGACIÓN EFICIENTE: Consulta archivos locales específicos usando rutas relativas directas; no ejecutes escaneos recursivos pesados ni búsquedas abiertas innecesarias.
4. CONTROL DE PRUEBAS: Crea pruebas unitarias y de renderizado para los formateadores y componentes base antes de considerarlos finalizados.

---

## FASE 1: UTILIDADES MATEMÁTICAS, FORMATO Y SUS TESTS

1. Crea el archivo `apps/web/src/lib/formatters.js` con las siguientes funciones puras exportadas:
   - `formatCurrency(val)`: 
     * Convierte cualquier valor válido a entero redondeado (`Math.round(Number(val))`).
     * Retorna el formato en pesos colombianos con prefijo '$' y puntos de miles: `$1.000`, `$50.000`. CERO DECIMALES.
     * Si el valor es `null`, `undefined` o `''`, retorna cadena vacía `''`. Si es 0 numérico explícito, retorna `'$0'`.
   - `cleanCurrency(str)`: 
     * Remueve el símbolo `$` y todos los puntos `.` o comas `,` dejando solo dígitos.
     * Retorna número entero puro o `0` si está vacío.
   - `numberToWordsSpanish(num)`:
     * Traduce números enteros de 0 a 999.999.999 a texto legible en mayúsculas/minúsculas seguido de "PESOS M/CTE" (ej: `50000` -> `"Cincuenta mil pesos M/CTE"`).
   - `onlyNumbers(str)`:
     * Remueve cualquier caracter que no sea dígito (`/\D/g`).

2. Crea el archivo de prueba unitaria `apps/web/src/lib/__tests__/formatters.test.js`:
   - Valida que `formatCurrency(15000.80)` devuelva `"$15.001"`.
   - Valida que `formatCurrency("")` devuelva `""`.
   - Valida que `cleanCurrency("$1.250.000")` devuelva `1250000`.
   - Valida que `onlyNumbers("123-abc.45")` devuelva `"12345"`.
   - Ejecuta la prueba con el runner del proyecto (`pnpm --filter web test apps/web/src/lib/__tests__/formatters.test.js` o equivalente configurado en package.json).

---

## FASE 2: COMPONENTES UI BASE POKA-YOKE (apps/web/src/components/ui/)

1. Contenedor Base `apps/web/src/components/ui/SmartModal.jsx`:
   - Props obligatorias: `isOpen`, `onClose`, `title`, `children`, `isDirty` (booleano), `isSubmitting` (booleano).
   - Backdrop: `fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-200`.
   - Contenedor: `bg-[#FAF8F5] border border-stone-300 rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden`.
   - Cabecera: Título en tipografía sobria (`font-serif tracking-tight text-stone-900 text-lg font-bold`), borde inferior tenue `border-b border-stone-200 px-6 py-4 flex justify-between items-center`.
   - Botón Cerrar (X): Con llamada a `handleSafeClose()`.
   - Manejo de Salida Accidental:
     * Si `isDirty === true` y el usuario presiona `Escape` o hace clic en el backdrop, NO cerrar el modal directamente.
     * Mostrar un diálogo de confirmación interno integrado: *"Tienes datos ingresados sin guardar. ¿Deseas salir y perder los cambios?"* con opciones `[Continuar Editando]` y `[Descartar Cambios]`.
     * Si `isDirty === false`, cerrar inmediatamente.
   - Cuerpo con scroll limpio: `px-6 py-4 overflow-y-auto space-y-4`.
   - Botón de Envío Anti-Doble Clic:
     * Durante `isSubmitting === true`, el botón debe tener `disabled={true}`, cursor `not-allowed`, opacidad reducida y mostrar texto `"Procesando..."` acompañado de un spinner SVG sutil.

2. Input Monetario `apps/web/src/components/ui/inputs/CurrencySmartInput.jsx`:
   - Props: `label`, `value`, `onChange`, `placeholder`, `error`, `required`, `name`.
   - Estado inicial: Vacío por defecto; PROHIBIDO inicializar en `0`. Placeholder por defecto: `"Ej: 50.000"`.
   - Atributos del input: `type="text"`, `inputMode="numeric"`.
   - En el evento `onChange`: Bloquear de inmediato la escritura de letras, espacios, signos negativos `-` o símbolos.
   - Debajo del input renderizar contenedor de asistencia:
     * Muestra el valor formateado: `$50.000`.
     * Muestra la lectura en palabras generada por `numberToWordsSpanish`.
     * Texto en `font-mono text-xs text-stone-500 mt-1 select-none`.

3. Input Numérico Estricto `apps/web/src/components/ui/inputs/StrictNumberInput.jsx`:
   - Para Cédula, NIT, Teléfono, Días de crédito.
   - Filtra caracteres no numéricos en tiempo real en `onChange` mediante `onlyNumbers(e.target.value)`.
   - Sin ceros por defecto.

4. Selector Dinámico `apps/web/src/components/ui/inputs/SmartSelect.jsx`:
   - Props: `label`, `value`, `onChange`, `options` (array de `{ id, label, subtext }`), `placeholder`, `emptyActionLabel`, `onEmptyAction`.
   - Si `options` está vacío, no mostrar un selector inerte; renderizar un mensaje claro con botón de acción rápida (ej: *"No hay registros disponibles. [+ Crear nuevo]"*).

5. Tooltip Explicativo `apps/web/src/components/ui/PokaYokeTooltip.jsx`:
   - Icono `(i)` o `(?)` en `text-stone-400 hover:text-stone-700 cursor-help ml-1 inline-flex`.
   - Al hacer hover o focus, despliega tarjeta flotante con `bg-stone-800 text-stone-100 text-xs rounded-md p-2 shadow-lg z-50 max-w-xs`.

---

## FASE 3: REFACTORIZACIÓN EN VISTAS CRÍTICAS (FRONTEND)

Aplica los componentes base en las vistas identificadas con deficiencias, verificando previamente los contratos de API:

1. Modal de Ventas / Despachos (`apps/web/src/app/commercial/sales/`):
   - Selector de Cliente alimentado por catálogo.
   - Selector de Producto en Cava.
   - Al seleccionar producto, consultar su stock actual en Cava (`InventarioProducto`).
   - Si la cantidad digitada supera el stock disponible:
     * Borde rojo arcilla (`border-rose-500 focus:ring-rose-200`).
     * Mensaje de error reactivo: *"Stock insuficiente en cava: solo hay X unidades disponibles"*.
     * Bloquear botón de despacho.
   - Ficha de balance previa a confirmar (tipo recibo vintage): muestra cantidad de unidades, precio unitario, costo de lote estimado y margen proyectado antes de enviar la orden.

2. Modal de Pagos y Cobros (`apps/web/src/app/commercial/payments/`):
   - Reemplazar `ID Cliente` e `ID Venta` por selectores.
   - Filtro en cascada: Al seleccionar un cliente, el selector de venta debe consultar y mostrar exclusivamente las facturas pendientes de cobro de dicho cliente, indicando su saldo pendiente formateado: `FAC-001 (Saldo: $45.000)`.
   - Si el cliente no registra deudas, renderizar: *"Este cliente está al día"* y bloquear el botón guardar.
   - Campo `Valor Pagado` implementado con `CurrencySmartInput`. Validar que el valor a pagar no exceda el saldo pendiente.

3. Modal de Precios de Proveedor (`apps/web/src/app/catalog/supplier-prices/`):
   - Reemplazar `ID Insumo` e `ID Proveedor` por selectores cargados con datos reales.
   - Cálculo Inverso Automático: Al digitar *Cantidad Presentación* y *Precio Compra*, calcular y mostrar en solo lectura el costo base resultante:
     $$\text{Costo Unidad Base} = \frac{\text{Precio Compra}}{\text{Cantidad Equivalente Base}}$$
   - Eliminar el ingreso manual obligatorio de cálculos que el software puede derivar automáticamente.

4. Modales de Catálogos (Gastos, Clientes, Productos, Insumos, Presentaciones):
   - En Gastos: Categorías y tipo de gasto mediante selectores estructurados. Valor con `CurrencySmartInput`.
   - En Clientes: Documento y teléfono blindados con `StrictNumberInput`.
   - En Insumos y Productos: Eliminar ceros iniciales forzados en stock mínimo, precios y márgenes. Reemplazar inputs de relación por selectores.

---

## FASE 4: SANITIZACIÓN DE PAYLOADS Y RETROALIMENTACIÓN

1. Antes de ejecutar el `fetch` o `axios` en cada formulario:
   - Limpiar valores monetarios con `cleanCurrency` para enviar enteros o números limpios al backend.
   - Asegurar que no se envíen campos `undefined`, vacíos o cadenas no esperadas.
2. Manejo de Errores de API:
   - Si el backend retorna error (400, 409, 500), NO cerrar el modal ni limpiar los inputs ya digitados.
   - Mostrar un banner de alerta visible en la parte superior del modal (`bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-sm`) explicando el motivo real del error devuelto por la API.
3. Notificación de Éxito:
   - Al completarse la petición con éxito (200/201), cerrar el modal, limpiar el formulario y disparar la recarga reactiva de la tabla principal emitiendo un toast informativo.

---

## FASE 5: VERIFICACIÓN TÉCNICA OBLIGATORIA
Ejecuta las siguientes validaciones y confirma que el resultado sea exitoso sin errores de sintaxis ni de ejecución:
1. Verificación de sintaxis de los archivos creados y editados:
   node --check apps/web/src/lib/formatters.js
   node --check apps/web/src/components/ui/SmartModal.jsx
   node --check apps/web/src/components/ui/inputs/CurrencySmartInput.jsx
   node --check apps/web/src/components/ui/inputs/StrictNumberInput.jsx
2. Ejecución de las pruebas unitarias:
   pnpm --filter web test apps/web/src/lib/__tests__/formatters.test.js
3. Inspección visual: Confirma que no existan advertencias de hidratación de React ni errores de consola en el navegador al abrir y cerrar cada modal.