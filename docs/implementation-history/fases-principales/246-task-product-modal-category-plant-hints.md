TAREA:
Implementar etiquetas descriptivas de planta y micro-guía reactiva por categoría WIP en ProductModal.jsx.

OBJETIVO:
En `apps/web/src/app/catalog/products/components/ProductModal.jsx`, hacer autoexplicativo el selector de "CATEGORÍA" cuando el producto esté en modo "A GRANEL" (semielaborado en planta):
1. Renombrar las opciones del desplegable con ejemplos reales de planta láctea.
2. Renderizar una micro-cápsula reactiva debajo del selector que explique de forma inmediata qué tipo de producto corresponde a la opción elegida.

FUENTE DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `AGENTS.md` (Regla 13.2 de Selectores en Cascada y Poka-Yoke de Lenguaje de Planta)

REGLA DE CONSULTA:
Lee y modifica exclusivamente `ProductModal.jsx`. Prohibido alterar backend, base de datos u otros componentes.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

NO MODIFICAR:
- ningún archivo en `apps/api/`.
- ningún hook ni controlador fuera de este componente.

INSTRUCCIONES:

1. ETIQUETAS DESCRIPTIVAS EN EL SELECTOR WIP:
   - En el catálogo de categorías para productos a granel (`CATEGORIAS_WIP`), enriquecer las etiquetas visibles:
     * `BASES_LACTEAS`: "Bases Lácteas (Yogur base blanco, leche cultivada en tanque)"
     * `DULCES_JALEAS`: "Dulces y Jaleas (Fruta cocida, jaleas en marmita)"
     * `INSUMO_BASE_WIP`: "Otras Premezclas de Planta (Jarabes, estabilizantes, no lácteos)"

2. CÁPSULA DIDÁCTICA REACTIVA (POKA-YOKE):
   - Inmediatamente debajo del `<select>` de Categoría (o integrado armónicamente en el bloque full-width `gridColumn: '1 / -1'` de orientación), renderizar una tarjeta/cápsula reactiva según la categoría seleccionada:
     * Si `formData.categoria === 'BASES_LACTEAS'`:
       "🥛 **Aplica para:** Yogur natural base, leche fermentada o base para yogur griego antes de filtrar o saborizar. Se almacena por litros en tanques o cavas."
     * Si `formData.categoria === 'DULCES_JALEAS'`:
       "🍓 **Aplica para:** Preparados artesanales de fruta (fresa, mora, melocotón, maracuyá) cocinados en paila o marmita para mezclar o fondear el yogur."
     * Si `formData.categoria === 'INSUMO_BASE_WIP'`:
       "⚙️ **Aplica para:** Premezclas líquidas intermedias que no sean leche ni dulce (ej. jarabes invertidos, mezclas de féculas o neutros)."
   - Estilo: fondo `#F1F5F9`, borde `#CBD5E1`, color `#334155`, padding `0.45rem 0.75rem`, borderRadius `6px`, fontSize `0.74rem`, marginTop `0.35rem`.

3. PRESERVACIÓN:
   - Mantener las categorías comerciales intactas cuando la presentación sea vaso, botella o cualquier envase comercial.
   - Preservar intacta la lógica de cálculo de márgenes y el stepping de 5 en 5.

VERIFICACIÓN:
pnpm --filter web exec next lint --file src/app/catalog/products/components/ProductModal.jsx
node --check apps/web/src/app/catalog/products/components/ProductModal.jsx

CRITERIO DE FINALIZACIÓN:
- Las opciones de categorías WIP muestran nombres técnicos claros con ejemplos de planta.
- Al alternar entre "Bases Lácteas" y "Dulces y Jaleas", la cápsula inferior actualiza reactivamente su descripción y ejemplos.
- ESLint y comprobación de sintaxis finalizan con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Modificación realizada en `ProductModal.jsx`:
- Vista previa de los textos reactivos integrados:
- Comprobación lint:
- Estado:
```[cite: 1, 2, 4]

---

**Comando para ejecutar en la consola de Antigravity:**

```text
> ejecuta la tarea @[apps/prompts/implememtacion/frontend/08-modales/248-task-product-modal-category-plant-hints.md]