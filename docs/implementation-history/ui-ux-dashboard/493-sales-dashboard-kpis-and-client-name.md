TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
1) En backend (`sales.repository.js`), resolver el nombre del cliente y el costo/utilidad de las ventas incluyendo sus relaciones de Prisma.
2) En frontend (`sales/page.jsx`), incorporar el dashboard de métricas comerciales del mes y mostrar el nombre real del cliente en la tabla:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/sales/sales.repository.js`
2. `apps/web/src/app/commercial/sales/page.jsx`

INSTRUCCIONES TÉCNICAS:

1. Backend (`sales.repository.js`):
   - En el método de consulta de ventas (`findMany` / `findAll`):
     * Incluir la relación `cliente`:
       `cliente: { select: { id: true, nombre: true, tipoCliente: true, canal: true } }`
     * Incluir los detalles de la venta para calcular costo total de la orden:
       `detalles: { include: { producto: { select: { id: true, nombre: true, costoUnitario: true } } } }`
     * En el mapeo de retorno de cada venta, exponer:
       `clienteNombre: venta.cliente?.nombre || 'Cliente Ocasional'`,
       `clienteTipo: venta.cliente?.tipoCliente || 'MINORISTA'`,
       `costoTotal: venta.detalles.reduce((acc, d) => acc + ((d.costoUnitario || d.producto?.costoUnitario || 0) * d.cantidad), 0)`

2. Frontend (`sales/page.jsx`):
   - Dashboard Superior de KPIs Comerciales del Mes:
     * Calcular sobre las ventas del mes en curso:
       - `Ventas del Mes`: Sumatoria de `total`. Formato `$ {valor.toLocaleString()}`.
       - `Ganancia Bruta Real`: Sumatoria de `(total - costoTotal)`.
       - `Margen Promedio`: `((Ganancia / TotalVentas) * 100).toFixed(1)%`.
       - `Cartera por Cobrar`: Sumatoria de `saldo` donde `saldo > 0`.
       - `Unidades Despachadas`: Sumatoria de cantidades de ítems vendidos.
     * Renderizar 4 tarjetas compactas de KPI (`bg-white p-4 rounded-xl border border-slate-200 shadow-sm`).
   - Ajuste de la Tabla de Ventas:
     * Reemplazar la cabecera `Cliente (ID)` por `Cliente`.
     * Celda de Cliente:
       - Nombre en negrita: `{venta.clienteNombre || venta.cliente?.nombre}`.
       - Subtexto con badge sutil del canal o tipo de cliente (ej. `Minorista`).
     * Formatear columnas numéricas (`Total`, `Saldo`, `Utilidad`) con formato monetario legible (`$ 270.000`).
     * Mostrar badge de condición: `Contado` (verde) o `Crédito` (azul/ámbar con fecha límite).
   - Respetar el límite de líneas SRP (< 120 líneas en `page.jsx`, delegando el dashboard o tabla a componentes auxiliares en `components/` si supera el límite).

VERIFICACIÓN:
1. `node --check apps/api/src/sales/sales.repository.js`
2. `node --check apps/web/src/app/commercial/sales/page.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista de Ventas presenta el Dashboard de métricas del mes (Total facturado, Margen real, Cuentas por cobrar).
- En la tabla se visualiza el nombre real del cliente ("DANIEL MERCADO") en vez del UUID de base de datos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
