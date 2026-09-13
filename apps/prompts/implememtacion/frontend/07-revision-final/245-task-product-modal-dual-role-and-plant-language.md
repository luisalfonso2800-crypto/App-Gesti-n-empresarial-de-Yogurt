TAREA:
1. Incorporar la Regla Poka-Yoke de Lenguaje de Planta y Orientación Contextual en AGENTS.md.
2. Actualizar la tarjeta didáctica de semielaborados en ProductModal para resolver la duda operativa de la base láctea / yogur natural sin dulce.

OBJETIVO:
Garantizar que la interfaz hable en lenguaje de operario de planta y explique con claridad el doble rol de la base de yogur (insumo de transformación vs. venta comercial envasada), preservando intactos la tarjeta de 3 métricas financieras, el stepping de 5 en 5 y los selectores en cascada ya implementados.

FUENTE DE VERDAD:
- `AGENTS.md`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

REGLA DE CONSULTA:
Lee y modifica exclusivamente `AGENTS.md` y `ProductModal.jsx`. Prohibido tocar backend, DTOs o componentes ajenos.

ALCANCE:

LEER:
- `AGENTS.md`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

MODIFICAR:
- `AGENTS.md`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

NO MODIFICAR:
- backend (`apps/api/`).
- lógica de selectores en cascada ni stepping numérico.

INSTRUCCIONES:

1. NUEVA DIRECTRIZ EN AGENTS.md:
   - Ubicar la sección de principios de UI/Poka-Yoke en `AGENTS.md`.
   - Incorporar la directriz:
     "### REGLA POKA-YOKE DE ORIENTACIÓN CONTEXTUAL Y LENGUAJE DE PLANTA:
      El usuario nunca debe memorizar teoría contable ni adivinar por qué un campo se deshabilita, oculta o recalcula en pantalla. Toda variación reactiva debe justificarse en el instante exacto y en lenguaje llano de operario de planta (ej. 'leche en tanque', 'envase comercial', 'ganancia por unidad') en lugar de tecnicismos abstractos (WIP, BOM, CIF, margen de contribución marginal). Las fórmulas de rentabilidad deben traducirse en tiempo real a valores monetarios concretos ($) según los datos ingresados."

2. GUÍA DIDÁCTICA DE LA BASE LÁCTEA EN PRODUCTMODAL.JSX:
   - En la tarjeta de costo operativo para productos a granel (`isGranel === true`), actualizar el texto informativo a ancho completo (`gridColumn: '1 / -1'`) con la siguiente estructura:
     * Encabezado: "🏭 Base Láctea en Tanque (Para Consumo Interno)"
     * Descripción: "Este producto se almacena por litros en marmita/cava y no tiene precio de venta al público porque no está envasado. Su costo se liquidará automáticamente según la leche y los fermentos que consuma la orden de fabricación."
     * Nota Didáctica MANNÁ (#EFF6FF, borde #BFDBFE):
       "💡 **¿También comercializas este yogur natural al cliente final?**
       1. Guarda primero este registro a granel para acumular los litros de base elaborados en planta.
       2. Luego crea otro producto llamado por ejemplo 'Yogurt Natural 1 Litro' con su respectiva presentación en botella, donde sí podrás fijar el precio de venta."

3. PRESERVACIÓN ESTRICTA:
   - NO reemplazar ni alterar la tarjeta de 3 métricas de proyección financiera (`Precio Venta | Costo Máx. Receta | Ganancia Esperada`) en productos comerciales.
   - NO alterar el comportamiento de aumento de 5 en 5 en el margen objetivo.
   - NO alterar el filtrado en cascada de categorías (WIP vs Comercial).

VERIFICACIÓN:
pnpm --filter web exec next lint --file src/app/catalog/products/components/ProductModal.jsx

CRITERIO DE FINALIZACIÓN:
- `AGENTS.md` incluye la regla de lenguaje de planta.
- La tarjeta de semielaborados en `ProductModal.jsx` incluye la guía paso a paso para la venta de yogur natural envasado.
- Se preservan las 3 métricas financieras y el stepping de 5 en 5.
- `next lint` finaliza con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Modificación realizada en `AGENTS.md`:
- Ajuste de texto en `ProductModal.jsx`:
- Comprobación lint:
- Estado: