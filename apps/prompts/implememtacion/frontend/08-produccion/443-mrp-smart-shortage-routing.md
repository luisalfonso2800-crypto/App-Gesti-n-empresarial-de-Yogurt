TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Implementar el enrutador inteligente MRP en el modal de lanzamiento de producción, bifurcando la acción de faltantes: Compras para materias primas, y Producción para semielaborados WIP.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE el archivo del BOM de Producción.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionBomTable.jsx` (o donde resida el botón "+ Disparar Lista de Compra")

INSTRUCCIONES TÉCNICAS:

1. Clasificación de Faltantes:
   - Dentro del componente, filtrar los insumos del BOM que tienen estado "Insuficiente" (o faltante > 0) en dos arrays distintos:
     ```javascript
     const faltantesWip = insumosBOM.filter(item => item.faltante > 0 && (item.tipo === 'WIP' || item.tipo === 'INOCULO_WIP' || item.categoria === 'BASES_LACTEAS'));
     const faltantesCompra = insumosBOM.filter(item => item.faltante > 0 && !faltantesWip.includes(item));
     ```

2. Renderizado Dinámico del Banner de Alerta:
   - Eliminar el botón estático "+ Disparar Lista de Compra".
   - Si `faltantesCompra.length > 0`:
     * Renderizar alerta roja: "Faltan materias primas en bodega. Se requiere orden de compra."
     * Mostrar botón: `<button onClick={handleGoToPurchases}>🛒 Generar Borrador de Compra</button>`.
     * El manejador debe redirigir al módulo de compras (ej. mediante `router.push` o abriendo el modal de compras) pasando un payload serializado en la URL o estado global con los `id` y cantidades faltantes.
   - Si `faltantesCompra.length === 0` pero `faltantesWip.length > 0`:
     * Renderizar alerta ámbar: "Inóculo / Base WIP insuficiente en cava. Se requiere fabricar semielaborado."
     * Mostrar botón: `<button onClick={handleGoToProduction}>🏭 Producir Semielaborado Faltante</button>`.
     * El manejador cierra el modal actual y abre una nueva planificación enfocada en el producto base requerido.

3. Bloqueo Poka-Yoke:
   - Mantener deshabilitado el botón "Iniciar Fabricación Inmediata" si la suma de `faltantesCompra.length + faltantesWip.length > 0`.
   - Respetar el límite SRP (< 135 líneas). Extraer lógica compleja a funciones auxiliares si es necesario.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionBomTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Si falta leche, el sistema ofrece ir a Compras.
- Si falta inóculo WIP, el sistema bloquea compras y ofrece ir a fabricar el inóculo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.