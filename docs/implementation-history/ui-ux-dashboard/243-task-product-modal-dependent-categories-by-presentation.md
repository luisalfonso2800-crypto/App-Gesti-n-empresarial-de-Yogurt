OBJETIVO:
Implementar selectores dependientes en cascada en `ProductModal.jsx`: condicionar las opciones del selector de "CATEGORÍA" según la "PRESENTACIÓN" seleccionada, segregando estrictamente las categorías de semielaborados en planta (WIP a granel) de las categorías comerciales terminadas. Prohibido usar TypeScript.

FUENTE DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `AGENTS.md` (Reglas 0, 2, 13.1, 16.1, 38)

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

INSTRUCCIONES:

1. SEGREGACIÓN DE CATÁLOGO DE CATEGORÍAS:
   Definir dentro o fuera del componente las listas segregadas de categorías:
   ```javascript
   // Categorías exclusivas para bases líquidas/semielaboradas en planta
   const CATEGORIAS_WIP = [
     { value: 'INSUMO_BASE_WIP', label: 'Insumo Base / Semielaborado (WIP)' },
     { value: 'BASES_LACTEAS', label: 'Bases Lácteas (Tanque / Cava)' },
     { value: 'DULCES_JALEAS', label: 'Dulces y Jaleas Artesanales' }
   ];

   // Categorías exclusivas para productos envasados de venta comercial
   const CATEGORIAS_COMERCIALES = [
     { value: 'LACTEOS', label: 'Lácteos Terminados (Comercial)' },
     { value: 'POSTRES', label: 'Postres y Otros' },
     { value: 'BEBIDAS', label: 'Bebidas' }
   ];