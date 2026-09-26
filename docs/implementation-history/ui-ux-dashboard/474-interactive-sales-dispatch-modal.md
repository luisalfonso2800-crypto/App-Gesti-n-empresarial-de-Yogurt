TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Rediseñar el modal de Nueva Venta/Despacho (`SaleModal.jsx` / `SalesDispatchModal.jsx`) integrando catálogo visual con imágenes, botones de crédito dinámico (15/30/flechas) y acceso directo a nuevo cliente:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/components/SalesDispatchModal.jsx` (o modal de Nueva Venta)
2. `apps/web/src/app/commercial/sales/components/SalesCreditScheduler.jsx` (nuevo subcomponente modular para control de crédito y fechas)

INSTRUCCIONES TÉCNICAS:

1. Subcomponente de Crédito (`SalesCreditScheduler.jsx`):
   - Renderizar cuando `tipoPago === 'CREDITO'`:
     * Botones rápidos: `[15 de mes]`, `[Fin de mes / 30]`, `[+8 días]`, `[+15 días]`.
     * Flechas `◄` y `►` para ajustar la fecha en ±1 día.
     * Selector de fecha nativo/calendario sincronizado.
     * Texto explicativo en tiempo real:
       `"Vence el ${nombreDia}, ${dia} de ${mes} de ${año} (Faltan ${diasRestantes} días para el cobro)"`.

2. Modal Principal de Despacho (`SalesDispatchModal.jsx`):
   - Fila de Cliente:
     * Selector de cliente junto al botón `+` que dispara el modal de creación de cliente.
     * Si el cliente seleccionado tiene cartera vencida o cupo activo, mostrar badge sutil: `Saldo pendiente: $X`.
   - Sección "Productos a Despachar":
     * Reemplazar el selector de texto plano por una cuadrícula o carrusel compacto de productos en cava:
       - Foto miniatura (`fotoComercialUrl` o placeholder).
       - Nombre, presentación y badge de stock en Cava (ej. `25 und disponibles`).
       - Precio regular vs precio mayorista si supera `cantidadMinimaMayorista`.
     * Control de cantidad con botones `[-] [cant] [+]` y botón `Agregar`.
     * Poka-Yoke: Impedir agregar una cantidad superior al stock disponible en Cava.
   - Respetar el límite de líneas SRP (< 135 líneas). Utilizar módulo CSS o Tailwind sin inline styles desordenados.

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/components/...`
2. `pnpm --filter web build` (o verificación sintáctica equivalente)
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El modal permite elegir fecha de crédito mediante los botones de quincena/mes y flechas con feedback natural.
- Los productos se seleccionan visualmente viendo su foto, stock real y tarifa mayorista automática.
- Se puede registrar o invocar un nuevo cliente desde la misma vista.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.