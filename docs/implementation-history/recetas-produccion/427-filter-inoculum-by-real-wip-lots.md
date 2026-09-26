TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir `findIntermediates()` en `apps/api/src/products/products.repository.js` para que solo genere y liste opciones de "INÓCULO / INICIADOR" para productos que realmente tengan lotes semielaborados WIP registrados en la base de datos:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`

INSTRUCCIONES TÉCNICAS:

1. En `findIntermediates()` de `products.repository.js`:
   - En la consulta `prisma.producto.findMany`:
     * Asegurar que se incluyan los lotes semielaborados:
       `lotes: { where: { tipoLote: 'SEMIELABORADO_WIP', stockActual: { gt: 0 } }, take: 1 }`
       (o `lotes: { where: { tipoLote: 'SEMIELABORADO_WIP' }, take: 1 }` para cubrir histórico).
   - Al iterar los productos base encontrados:
     * Generar la variante `INOCULO_WIP` ÚNICAMENTE si el producto cuenta con al menos un lote en `p.lotes` (`p.lotes?.length > 0`).
     * Si no tiene lotes semielaborados asociados (como el recién creado "YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO"), NO agregar la opción de inóculo sintético.
     * La base a granel (`BASE_GRANEL`) puede seguir disponible si es base láctea.
   - Respetar el límite de líneas SRP.

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- En el grupo "🧫 Iniciadores y Cepas (Inóculo WIP)" del selector BOM solo aparece exactamente 1 opción: la correspondiente al lote existente en inventario ("YOGURT BASE INICIADOR YOGURT COMERCIAL").
- No aparece inóculo para productos sin lote semielaborado físico.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.