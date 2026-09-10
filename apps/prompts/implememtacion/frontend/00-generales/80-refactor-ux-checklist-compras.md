TAREA CONTROLADA — REDISEÑO ERGONÓMICO DE UX Y CONVERSIÓN EN CHECKLIST DE COMPRAS

OBJETIVO TÉCNICO EXACTO
Refactorizar la tarjeta de cada insumo en el Checklist de Compras (`apps/web/src/app/operations/purchases/new/page.jsx` y su CSS module):
1. Eliminar el checkbox "Conseguido" y el selector redundante de estado.
2. Implementar botones gemelos interactivos: [✓ Conseguido] y [✕ No Conseguido].
3. Desplegar selector de motivos + input libre cuando se marque como "No Conseguido".
4. Forzar cantidad mínima >= 1.
5. Calcular y renderizar en tiempo real el Subtotal monetario, el total físico neto que entra a bodega y el costo unitario por fracción.
6. Modernizar el diseño visual para una lectura ágil en planta.

FUENTES DE VERDAD OBLIGATORIAS
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- apps/web/src/components/ui/icons.jsx
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo. PROHIBIDO Tailwind.
3. Usar iconos SVG centralizados desde `apps/web/src/components/ui/icons.jsx`.
4. Todos los cálculos matemáticos deben reaccionar inmediatamente al evento `onChange`.

ESPECIFICACIÓN DE COMPORTAMIENTO Y UI

1. BOTONES DE ACCIÓN DE ESTADO:
   - Estado "CONSEGUIDO" (Activo por defecto o al pulsar el botón verde):
     * Botón verde destacado. La tarjeta muestra borde tenue verde.
     * Este insumo se transferirá a la Fase 2 de ingreso formal.
   - Estado "NO_CONSEGUIDO" (Al pulsar el botón rojo/gris):
     * Botón rojo/ámbar activo. La tarjeta atenúa los campos de compra y despliega una barra de motivos:
     * Dropdown con opciones:
       - "Agotado en punto de venta"
       - "Proveedor ya no distribuye este insumo"
       - "Precio fuera de presupuesto"
       - "Presentación o calidad no aceptable"
       - "Otro motivo (especificar)"
     * Si se selecciona "Otro motivo", mostrar un input de texto para escribir la causa.
     * Los insumos en este estado NO se transfieren al asiento contable de ingreso a bodega, pero su motivo se reporta o guarda para auditoría.

2. INPUT DE CANTIDAD Y VALIDACIÓN:
   - Input numérico con `min="1"`, `step="1"` (o decimal si la unidad es granel).
   - Bloquear y autocorregir si el usuario intenta dejarlo en 0 o negativo (fallback a 1).

3. CÁLCULOS REACTIVOS EN TIEMPO REAL (DESGLOSE COMPLETO):
   - Al modificar `Cant. Solicitada` o `Precio ($)`:
     * Subtotal: `cantidad * precio`.
     * Total Físico a Bodega: `cantidad * contenidoBase`. Mostrar claramente el número junto con la unidad (ej. "Ingresan: 80 Litros" o "Ingresan: 50 Unidades").
     * Desglose Unitario: Mostrar cuánto cuesta cada litro, gramo, o unidad individual (`precio / contenidoBase`).
     * Presentar estos 3 datos en un bloque visual destacado tipo badge o resumen con etiquetas claras:
       - [ Subtotal: $XXX.XXX ]
       - [ Total neto a bodega: X (Unidad) ]
       - [ Costo unitario real: $Y / Unidad ]

4. PULIDO VISUAL DEL COMPONENTE:
   - Estructurar la tarjeta en 3 zonas horizontales claras:
     * Encabezado: Nombre del insumo en tamaño legible, badges de Categoría, Marca y Stock Mínimo.
     * Zona central: Campos de entrada compactos (Cantidad solicitada, Precio del empaque comercial) y bloque de totales calculados.
     * Zona de control: Los dos botones de estado ([✓ Conseguido] / [✕ No Conseguido]) alineados a la derecha.
   - Ajustar estilos en `new-purchase.module.css` para tipografía profesional, bordes con radio suave (`border-radius: 8px`), sombras sutiles y padding equilibrado.

5. BOTÓN CONTINUAR A FASE 2:
   - Al pulsar "Continuar a Formulario (Fase 2)", pasar al estado del formulario únicamente los ítems marcados como "CONSEGUIDO" con las cantidades, precios y presentaciones ajustadas por el usuario.

VALIDACIÓN OBLIGATORIA
- `pnpm --filter web build` debe finalizar con código de salida 0.
- Comprobar que al cambiar la cantidad numérica el subtotal y el total neto a bodega cambien de inmediato.

FORMATO DE REPORTE
Entregar el reporte estándar indicando estado, cambios aplicados y confirmación de build limpio.