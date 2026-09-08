TAREA CONTROLADA — ACTUALIZACIÓN INTEGRAL DE SEMILLA (SEED) CON RECETAS V2 MULTI-ETAPA Y VARIANTES

OBJETIVO
Actualizar y ejecutar `apps/api/prisma/seed-test-data.js` para poblar la base de datos limpia con un catálogo maestro coherente y múltiples recetas completas bajo el nuevo modelo jerárquico: `Receta` -> `EtapaReceta` -> `DetalleReceta`.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/api/prisma/schema.prisma
- apps/api/prisma/seed-test-data.js

REGLAS TÉCNICAS OBLIGATORIAS
1. Exclusivamente JavaScript nativo (.js). PROHIBIDO TypeScript.
2. Usar transacciones o inserciones anidadas de Prisma para poblar la estructura `Receta -> etapas -> detalles`.
3. Todo insumo asignado en recetas debe existir previamente en el seed de Insumos.
4. Poblar precios de proveedor activos para que el cálculo teórico de costos funcione.
5. NO modificar schema.prisma ni controladores.

DATOS REQUERIDOS EN EL SEED

1. Catálogo Base Completo:
   - Proveedores (lácteos, empaques, frutas/aditivos).
   - Insumos obligatorios:
     * Materias primas: Leche cruda (Litros), Cultivo láctico (Gramos), Azúcar (Kilogramos), Estabilizante (Gramos).
     * Complementos/Variantes: Pulpa de Fresa (Kilogramos), Pulpa de Mora (Kilogramos), Cereal Choco Rice (Gramos), Cereal Maíz Crispy (Gramos), Jalea de Frutos Rojos (Kilogramos).
     * Empaques y papelería: Vaso 3.5 oz (Unidades), Cono/Cúpula 2 oz (Unidades), Tapa Plástica (Unidades), Cuchara Pequeña (Unidades), Etiqueta Escolar (Unidades), Cinta de Seguridad (Unidades), Botella 1L (Unidades), Tapa Botella (Unidades), Etiqueta 1L (Unidades).
   - Precios de Proveedor vigentes vinculados con empaque comercial y costo unitario base calculado.
   - Productos y Presentaciones:
     * Producto 1: Yogur Escolar 3.5 oz (Presentación: Vaso 3.5 oz).
     * Producto 2: Yogur Tradicional Fresa 1L (Presentación: Botella 1L).
     * Producto 3: Yogur Griego Natural 500g (Presentación: Vaso 500g).

2. Recetas Técnicas V2 a Sembrar:
   - Receta A: "Fórmula Yogur Escolar 3.5 oz Multivariante" (Rendimiento: 100 Unidades):
     * Etapa 1: "Preparación de Base Blanca" (Orden 1, Tiempo Est: 45 min, Temp: 85°C - 43°C).
       - Leche cruda: 12 Litros (BASE).
       - Cultivo láctico: 30 Gramos (BASE).
       - Azúcar: 1.2 Kilogramos (BASE).
     * Etapa 2: "Fermentación Controlada" (Orden 2, Tiempo Min: 480 min, Est: 540 min, Max: 600 min, Temp: 42°C - 44°C).
       - Sin insumos (proceso térmico).
     * Etapa 3: "Refrigeración y Estabilización" (Orden 3, Tiempo Est: 180 min, Temp: 4°C).
       - Sin insumos (proceso térmico).
     * Etapa 4: "Dosificación de Complementos" (Orden 4, Tiempo Est: 30 min).
       - Cereal Choco Rice: 1500 Gramos (tipoInsumo: COMPLEMENTO, esOpcional: true, grupoVariante: "CEREAL").
       - Cereal Maíz Crispy: 1500 Gramos (tipoInsumo: COMPLEMENTO, esOpcional: true, grupoVariante: "CEREAL").
       - Jalea de Frutos Rojos: 1000 Gramos (tipoInsumo: COMPLEMENTO, esOpcional: true, grupoVariante: "JALEA").
     * Etapa 5: "Envasado, Sellado y Empaque" (Orden 5, Tiempo Est: 60 min).
       - Vaso 3.5 oz: 100 Unidades (EMPAQUE_BASE, merma: 2%).
       - Tapa Plástica: 100 Unidades (EMPAQUE_BASE, merma: 2%).
       - Etiqueta Escolar: 100 Unidades (EMPAQUE_BASE, merma: 1%).
       - Cinta de Seguridad: 100 Unidades (EMPAQUE_BASE).
       - Cono/Cúpula 2 oz: 100 Unidades (EMPAQUE_COMPLEMENTO, esOpcional: true, grupoVariante: "CEREAL").
       - Cuchara Pequeña: 100 Unidades (EMPAQUE_COMPLEMENTO, esOpcional: true, grupoVariante: "CEREAL").

   - Receta B: "Fórmula Yogur Batido Fresa 1L" (Rendimiento: 50 Unidades):
     * Etapa 1: "Pasteurización e Inoculación" (Orden 1, Tiempo Est: 60 min).
       - Leche cruda: 48 Litros (BASE).
       - Cultivo láctico: 100 Gramos (BASE).
       - Azúcar: 4 Kilogramos (BASE).
     * Etapa 2: "Incubación" (Orden 2, Tiempo Est: 500 min, Temp: 43°C).
     * Etapa 3: "Saborización y Enfriamiento" (Orden 3, Tiempo Est: 40 min).
       - Pulpa de Fresa: 5 Kilogramos (BASE, merma: 1%).
       - Estabilizante: 200 Gramos (BASE).
     * Etapa 4: "Embotellado y Etiquetado" (Orden 4, Tiempo Est: 45 min).
       - Botella 1L: 50 Unidades (EMPAQUE_BASE, merma: 1%).
       - Tapa Botella: 50 Unidades (EMPAQUE_BASE, merma: 1%).
       - Etiqueta 1L: 50 Unidades (EMPAQUE_BASE, merma: 2%).

VALIDACIÓN Y EJECUCIÓN
1. Actualizar el código de `apps/api/prisma/seed-test-data.js`.
2. Ejecutar la inserción real en base de datos mediante: `pnpm --filter api exec node prisma/seed-test-data.js`.
3. Verificar que no haya errores de claves foráneas ni duplicidad de nombres.

FORMATO DE CIERRE
Entregar exclusivamente este reporte:

ACTUALIZACIÓN SEED RECETAS V2 — CIERRE
• Estado: COMPLETADO / ERROR
• Insumos y proveedores sembrados: SÍ / NO
• Precios de proveedor vigentes: SÍ / NO
• Recetas sembradas con etapas y BOM: SÍ / NO
• Variantes y tipos de insumo configurados: SÍ / NO
• Ejecución del script en base de datos: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]