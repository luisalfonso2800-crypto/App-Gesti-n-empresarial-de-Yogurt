TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Implementar el 'Modo Privacidad' global mediante un botón con icono de ojo en el Header, enmascarando los valores monetarios sensibles con asteriscos (••••••) cuando el ojo esté cerrado:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/context/PrivacyContext.jsx` (o crear context/hook ligero de privacidad)
2. `apps/web/src/components/layout/Header.jsx` (o componente de la barra superior donde está la fecha/reloj)

INSTRUCCIONES TÉCNICAS:

1. Contexto Global de Privacidad (`PrivacyContext.jsx`):
   - Crear un Provider ligero con estado `isPrivacyActive` (booleano, por defecto `false`):
     * Cargar/guardar valor en `localStorage.getItem('manna_privacy_mode')`.
     * Exponer: `isPrivacyActive`, `togglePrivacyMode()` y helper `maskValue(valorFormateado)`:
       ```javascript
       export const usePrivacy = () => useContext(PrivacyContext);
       // maskValue: si isPrivacyActive es true retorna '$ ••••••', si no retorna el valor original.
       ```

2. Integración en la Barra Superior (`Header.jsx`):
   - Consumir `usePrivacy()`.
   - Insertar el botón del ojo junto a la fecha o indicadores de estado:
     ```jsx
     <button
       type="button"
       onClick={togglePrivacyMode}
       title={isPrivacyActive ? "Mostrar valores monetarios" : "Ocultar cifras (Modo Privacidad)"}
       className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
     >
       {isPrivacyActive ? <EyeOffIcon className="w-4 h-4 text-amber-600"/> : <EyeIcon className="w-4 h-4 text-emerald-600"/>}
     </button>
     ```

3. Aplicar en Componentes Clave:
   - Integrar `usePrivacy` en las tarjetas de Ventas (`sales/page.jsx`), Inventario (`CavaCommercialTable.jsx`) o en el helper común de moneda para que, al conmutar el ojo, todos los precios, utilidades y valorizaciones alternen entre su valor y asteriscos inmediatamente sin recargar la página.
   - Respetar el límite de líneas SRP (< 135 líneas por archivo).

VERIFICACIÓN:
1. `node --check apps/web/src/context/PrivacyContext.jsx`
2. `node --check apps/web/src/components/layout/Header.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- En la barra superior aparece el icono del ojo interactivo.
- Al hacer clic en el ojo para cerrarlo, los valores de ventas, costos y ganancias se transforman en asteriscos ($ ••••••).
- Al volver a abrir el ojo, las cifras numéricas se restauran con normalidad.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
