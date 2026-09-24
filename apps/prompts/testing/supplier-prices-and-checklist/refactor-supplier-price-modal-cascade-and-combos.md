TAREA CONTROLADA — REFACTORIZACIÓN ERGONÓMICA DE PRECIOS DE PROVEEDORES: COMBOBOX CON ALTA EN CALIENTE, CASCADA POKA-YOKE Y PLECA DINÁMICA

OBJETIVO TÉCNICO:
Transformar el modal `SupplierPriceModal.jsx` (y sus subcomponentes) en `apps/web/src/app/catalog/supplier-prices/`:
1. Reemplazar los `<select>` nativos rígidos de Insumo y Proveedor por selectores interactivos estilizados con búsqueda reactiva y opciones destacadas `+ Registrar Nuevo Insumo` y `+ Registrar Nuevo Proveedor`, replicando el comportamiento y estilo visual de `/operations/purchases/new`.
2. Controlar el ancho del menú desplegable (`max-width: 100%`, `max-height: 220px`, scroll suave) para evitar desbordes desproporcionados en pantalla.
3. Implementar Cascada Poka-Yoke progresiva (todos los campos bloqueados por defecto, habilitándose 1 a 1 en estricto orden):
   Insumo -> Proveedor -> Presentación Comercial -> Unidad de Medida -> Cantidad de Presentación -> Precio de Compra.
4. En el input de "Cantidad de la Presentación", renderizar una pleca divisoria fija a la derecha con la sigla de la unidad seleccionada en el paso previo (ej: `| kg`, `| L`, `| ml`, `| und`).
5. Incluir botón de limpieza (🗑️ o ✕) en la cabecera de las secciones o inputs para resetear el valor cómodamente.
6. Etiquetas dinámicas en lenguaje natural (claras para usuarios no técnicos) y conversión del precio a letras en tiempo real.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 3 LECTURAS):
- apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx (y su CSS Module)
- apps/web/src/app/operations/purchases/new/components/FormPhase.jsx (como referencia visual de los desplegables con + Nuevo)
- apps/web/src/components/catalog/SupplyModal.jsx (o modal de creación rápida de insumo/proveedor)
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 LECTURAS, MÁXIMO 3 EDICIONES):
- NO modificar rutas de backend ni endpoints de producción (`apps/api/`).
- CERO búsquedas recursivas masivas (`grep -r`, `find .`).
- Mantener modularidad y SRP (< 140 líneas por archivo/subcomponente).
- Usar exclusivamente CSS Modules, prohibido estilos inline desordenados.

ACCIONES ESPECÍFICAS:

1. SELECTORES DE INSUMO Y PROVEEDOR (COMBOBOX CON BUSCADOR Y ALTA RÁPIDA):
   - Integrar buscador con filtro por texto.
   - En la primera opción del menú desplegable:
     * `+ Nuevo Insumo` -> Dispara la apertura de `SupplyModal` (en capa modal superior o estado controlado). Al guardar el insumo nuevo, se refresca la lista y queda preseleccionado automáticamente.
     * `+ Nuevo Proveedor` -> Dispara el modal de creación de proveedor (`SupplierModal`). Al crearlo con éxito, queda preseleccionado.
   - Limitar el ancho del contenedor flotante de opciones (`max-width: 100%`, ancho acoplado al input, bordes suaves y sombra tenue).

2. ORDEN DE CASCADA POKA-YOKE (PASO A PASO):
   - **Paso 1 (Insumo):** Habilitado inicialmente. Al elegirlo, se desbloquea el Proveedor.
   - **Paso 2 (Proveedor):** Desbloqueado solo tras elegir Insumo. Al seleccionar Proveedor, se desbloquea Presentación.
   - **Paso 3 (Presentación Comercial):**
     * Desplegable con presentaciones registradas en el catálogo (Bolsa, Bulto, Garrafa, Caja, Canastilla, etc.).
     * Si no existe la deseada, opción `OTRA...` que habilita un input para escribir el nombre de la nueva presentación.
   - **Paso 4 (Unidad de Medida Base):**
     * Selector con unidades autorizadas: `Kilogramos (kg)`, `Gramos (g)`, `Litros (L)`, `Mililitros (ml)`, `Unidades (und)`.
   - **Paso 5 (Cantidad de la Presentación):**
     * Desbloqueado solo tras definir la unidad.
     * Input numérico con máscara de miles (sin ceros fijos molestos).
     * **Pleca integrada a la derecha:** Divisor visual `| [sigla]` fijo dentro del input que cambia automáticamente según la unidad del Paso 4 (ej. si eligió Litros, muestra `| L`).
   - **Paso 6 (Precio de Compra e Impuestos):**
     * Input monetario con máscara de miles en vivo, sin decimales.
     * Debajo del input, mostrar en tiempo real la conversión en texto (`montoATextoPesos` o `numeroATexto`, ej. *"Cincuenta mil pesos M/CTE"*).
     * Checkbox de IVA y selector de modalidad (Precio incluye IVA / Más IVA).

3. ERGONOMÍA VISUAL Y BOTÓN DE LIMPIEZA:
   - Añadir un botón discreto de reset (ícono ✕ o cesto de basura 🗑️) a la derecha del label o dentro del input de Insumo y Proveedor para que el usuario pueda limpiar la selección sin tener que borrar a mano.
   - Etiquetas dinámicas en lenguaje natural:
     * En lugar de `"CANTIDAD PRESENTACIÓN"`, mostrar: `"¿Cuánto contiene cada [empaque] comercial?"`.
     * En lugar de `"PRECIO COMPRA"`, mostrar: `"Precio acordado por cada [empaque]"`.

4. CÁLCULO EN VIVO DE COSTO UNITARIO:
   - Proyectar en la tarjeta resumen inferior:
     `Costo Unitario Base = Precio sin IVA / (Cantidad Presentación * Equivalencia)`.
     Mostrando claramente el desglose (ej. `$ 3.43 / ml` o `$ 3.000 / kg`).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Los desplegables no se desbordan y permiten crear Insumo o Proveedor sin salirse del modal.
- La cascada respeta el orden estricto de desbloqueo.
- El input de cantidad incluye la pleca con la sigla de la unidad seleccionada.
- `verify-srp.js` finaliza con código 0.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Componentes creados o modificados.
- Confirmación de selectores estilizados y pleca dinámica.
- Resultado de verify-srp.js.
- Estado: [COMPLETADO / BLOQUEADO].