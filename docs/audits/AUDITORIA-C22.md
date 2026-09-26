# AUDITORÍA FORENSE — C22 (Contenido 0 en Compras)

## 1. Código Literal del Helper (T1)
En `apps/web/e2e/helpers/purchase-helpers.js#L33-L45`:
```javascript
33:   if (data.contenidoNeto !== undefined && data.contenidoNeto !== null) {
34:     const netInput = row.locator('input[class*="netContentField"]');
35:     // Esperar a que React termine el re-render tras cambiar empaque
36:     await page.waitForTimeout(500);
37:     // Forzar el fill incluso si el input está temporalmente disabled
38:     await netInput.fill(String(data.contenidoNeto), { force: true }).catch(async () => {
39:       // Fallback: clear + type
40:       await netInput.click({ force: true }).catch(() => {});
41:       await netInput.press('Control+a').catch(() => {});
42:       await netInput.pressSequentially(String(data.contenidoNeto), { delay: 30 }).catch(() => {});
43:     });
44:     await page.waitForTimeout(300);
45:   }
```

---

## 2. Código Literal del Componente de Empaque (T2)
En `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowPackaging.jsx#L31-L46`:
```javascript
31:           <select
32:             value={row.empaqueTipo || 'UNIDAD'}
33:             onChange={e => {
34:               const tipo = e.target.value;
35:               updateDetalle(row.id, 'empaqueTipo', tipo);
36:               if (tipo === 'UNIDAD') {
37:                 updateDetalle(row.id, 'contenidoNeto', '1');
38:                 updateDetalle(row.id, 'empaque', 'UNIDAD');
39:               } else if (tipo !== 'OTRO') {
40:                 updateDetalle(row.id, 'empaque', tipo);
41:               } else {
42:                 updateDetalle(row.id, 'empaque', '');
43:               }
44:             }}
45:             className={styles.empaqueSelect}
46:           >
```
- **Al cambiar a `CAJA`:** `updateDetalle(row.id, 'empaqueTipo', 'CAJA')` y `updateDetalle(row.id, 'empaque', 'CAJA')`.
- **¿Resetea contenidoNeto a 5 al cambiar a CAJA?:** No, no toca `contenidoNeto` a menos que sea `tipo === 'UNIDAD'`, donde lo fija en `'1'`.

---

## 3. Código Literal del Hook (T3)
En `apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js#L122-L142` y `#L299-L311`:
```javascript
122:   const addRow = () => {
123:     const newRow = {
124:       id: Date.now(),
...
129:       empaque: 'UNIDAD',
130:       empaqueTipo: 'UNIDAD',
131:       contenidoNeto: '1',
132:       unidadMedida: 'kg',
...
141:     setDetalles(prev => [newRow, ...prev]);
142:   };
```
```javascript
299:   const updateDetalle = (id, field, value) => {
300:     setDetalles(prev => {
301:       const nextDetalles = prev.map(d => {
302:         if (d.id !== id) return d;
303:         const updated = { ...d, [field]: value };
...
310:         return updated;
311:       });
```
- **Conclusión de T3:** La fila inicial nace con `contenidoNeto: '1'`. Al ejecutarse `updateDetalle(row.id, 'contenidoNeto', raw)`, simplemente guarda el valor en el estado `nextDetalles`. No existe ningún `useEffect` que resetee a 5.

---

## 4. Código Literal del Cálculo (T4)
En `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx#L20-L24`:
```javascript
20:   const empaquesNum = parseInt(row.empaques, 10) || 0;
21:   const precioUnitarioNum = parseInt(row.precioUnitario, 10) || 0;
22:   const contNetoNum = parseFloat(row.contenidoNeto) || 1;
23:   const ingresoNeto = Math.round(empaquesNum * contNetoNum);
24:   const unidadLabel = row.unidadMedida === 'Unidades' ? 'und' : (row.unidadMedida || 'ml');
```
Y en `FormPhaseRowEconomics.jsx#L59-L63`:
```javascript
59:         <div className={`${styles.summaryColRight} ${hasPokaYokeWarning ? styles.netIngresoColWarning : ''}`}>
60:           <span className={styles.summaryMicroLabel}>Ingreso Neto</span>
61:           <strong className={`${styles.netIngresoVal} ${hasPokaYokeWarning ? styles.netIngresoValWarning : ''}`}>
62:             {ingresoNeto.toLocaleString('es-CO')} {unidadLabel}
63:           </strong>
```

---

## 5. Código Literal del Input de Contenido (T5)
En `FormPhaseRowPackaging.jsx#L57-L69`:
```javascript
57:           <input
58:             type="text"
59:             inputMode="decimal"
60:             placeholder="Contenido c/u"
61:             value={row.contenidoNeto ? row.contenidoNeto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : ''}
62:             disabled={row.empaqueTipo === 'UNIDAD'}
63:             onChange={e => {
64:               let raw = e.target.value.replace(/[^0-9.]/g, '');
65:               if ((raw.match(/\./g) || []).length > 1) raw = raw.replace(/\.+$/, '');
66:               updateDetalle(row.id, 'contenidoNeto', raw);
67:             }}
68:             className={`${styles.netContentField} ${row.empaqueTipo === 'UNIDAD' ? styles.netContentDisabled : styles.netContentEnabled} ${hasPokaYokeWarning ? styles.netContentFieldWarning : ''}`}
69:           />
```
- **Es controlado:** `value={row.contenidoNeto ? ... : ''}`.
- **Atributo `disabled`:** Únicamente cuando `row.empaqueTipo === 'UNIDAD'`. Al seleccionar `CAJA`, `disabled` es `false`.

---

## 6. Evaluación de Hipótesis (T6)

- **H1 (Input disabled con CAJA):** **INVÁLIDA**. La línea 62 demuestra `disabled={row.empaqueTipo === 'UNIDAD'}`. Con `CAJA`, el input está habilitado.
- **H2 (Input no controlado / no dispara onChange):** **INVÁLIDA**. El input tiene `value` y `onChange`. Playwright `.fill()` dispara input events estándar de React.
- **H3 (Componente resetea a 5 automáticamente):** **INVÁLIDA**. No existe ningún valor `5` en el hook ni reseteo al cambiar a `CAJA`.
- **H4 (Cálculo usa `|| 1` cuando es 0):** **VÁLIDA Y CONFIRMADA**. Línea 22 de `FormPhaseRowItem.jsx`:
  ```javascript
  const contNetoNum = parseFloat(row.contenidoNeto) || 1;
  ```
  `parseFloat('0')` devuelve `0`. En JavaScript, `0 || 1` es `1`.
  Por tanto, cuando `contenidoNeto = '0'` y `empaques = 5`:
  $$\text{ingresoNeto} = 5 \times 1 = \mathbf{5}$$
  Muestra exactamente **"5 kg"** en pantalla.
- **H5 (`fillRowItem` desordena operaciones):** **INVÁLIDA**. En el helper, `empaqueTipo` se selecciona en la línea 30 y `contenidoNeto` se llena en la línea 38.
- **H6 (`onBlur` cambia el valor):** **INVÁLIDA**. El input no tiene listener `onBlur`.
- **H7 (`parseFloat("0") || fallback` convierte 0):** **VÁLIDA Y CONFIRMADA**. Corresponde a la línea 22 de `FormPhaseRowItem.jsx`.

---

## 7. Causa Raíz Probable (T7)
La causa raíz está en **`FormPhaseRowItem.jsx` (Línea 22)**:
```javascript
const contNetoNum = parseFloat(row.contenidoNeto) || 1;
```
Debido a la coerción booleana de JavaScript con el operador `||`, el número `0` es evaluado como *falsy*, forzando a que `contNetoNum` sea siempre `1`. Al multiplicarse por `empaquesNum = 5`, el sistema produce irremediablemente `5` en vez de `0`.

---

## 8. Recomendación de Fix (T8, sin aplicar)
En `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx#L22`:
```javascript
// Reemplazar:
const contNetoNum = parseFloat(row.contenidoNeto) || 1;

// Por:
const parsedCont = parseFloat(row.contenidoNeto);
const contNetoNum = isNaN(parsedCont) ? 1 : parsedCont;
```
De este modo, cuando el usuario o el test ingrese `0`, `parsedCont` será `0` (que no es `NaN`), calculando:
$$\text{ingresoNeto} = 5 \times 0 = \mathbf{0}$$
