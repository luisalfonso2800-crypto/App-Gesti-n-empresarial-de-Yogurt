TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Ubicar el botón de privacidad (ojo) exclusivamente en el módulo de Ventas, con estado 'cerrado' por defecto, enmascarando todos los valores numéricos y monetarios con asteriscos (••••••) mientras esté inactivo:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/web/src/app/commercial/sales/page.jsx` (y/o sus componentes de tabla/tarjetas en `components/`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/page.jsx` (o componentes asociados de vista de ventas)

INSTRUCCIONES TÉCNICAS:

1. Estado Local de Privacidad por Defecto en Ventas:
   - En la vista de Ventas, inicializar el estado como privado por defecto:
     `const [mostrarCifras, setMostrarCifras] = useState(false);` // Inicia cerrado (false)
   - Función auxiliar de enmascaramiento:
     ```javascript
     const maskMoney = (valor) => mostrarCifras ? `$ ${Number(valor || 0).toLocaleString()}` : "$ ••••••";
     const maskQty = (valor, suffix = "") => mostrarCifras ? `${valor} ${suffix}`.trim() : "•• " + suffix;
     const maskPct = (valor) => mostrarCifras ? `${valor}%` : "••%";
     ```

2. Integrar el Botón de Ojo en la Cabecera de Ventas:
   - Ubicar el botón junto al título "Ventas" o al lado del botón "Nueva Venta":
     ```jsx
     <button
       type="button"
       onClick={() => setMostrarCifras((prev) => !prev)}
       title={mostrarCifras ? "Ocultar cifras financieras" : "Mostrar cifras financieras"}
       className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1.5 shadow-sm"
     >
       {mostrarCifras ? <EyeIcon className="w-5 h-5 text-emerald-600"/> : <EyeOffIcon className="w-5 h-5 text-amber-600"/>}
       <span className="text-xs font-semibold text-slate-700">{mostrarCifras ? "Ocultar Cifras" : "Ver Cifras"}</span>
     </button>
     ```

3. Aplicar Enmascaramiento a las Cifras:
   - Tarjeta 1 (Ventas del Período): `maskMoney(totalVentas)` y `maskQty(totalUnds, 'unds despachadas')`.
   - Tarjeta 2 (Ganancia del Período): `maskMoney(gananciaPeriodo)` y `maskPct(margenPeriodo)`.
   - Tarjeta 3 (Cartera por Cobrar): `maskMoney(carteraPendiente)`.
   - Tarjeta 4 (Ganancia Total Año): `maskMoney(gananciaAnio)`.
   - Tabla de Ventas:
     * Columna Total: `{maskMoney(venta.total)}`
     * Columna Saldo Pendiente: `{maskMoney(venta.saldo)}`
   - Si se incluyó un botón de ojo huérfano en el Header general (`Header.jsx`), removerlo para que el control pertenezca exclusivamente a la pantalla de Ventas.
   - Respetar el límite de líneas SRP (< 120 líneas en `page.jsx`).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al ingresar al módulo de Ventas, las 4 tarjetas y la tabla muestran inmediatamente asteriscos ($ ••••••) por defecto con el ojo cerrado.
- Al pulsar el ojo, se descubren los valores monetarios exactos ($270.000, $223.250).
- Al volver a pulsar, se ocultan de nuevo en asteriscos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
