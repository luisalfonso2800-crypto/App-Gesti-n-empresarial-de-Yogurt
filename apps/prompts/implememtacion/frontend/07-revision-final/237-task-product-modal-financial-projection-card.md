OBJETIVO: Reestructurar el bloque de Margen Objetivo en `apps/web/src/app/catalog/products/components/ProductModal.jsx` para que abarque el ancho completo (desde debajo de Precio de Venta hasta el final de Margen Objetivo) y proyecte de forma automática la ecuación completa: Precio de Venta ($X) ➔ Costo Máximo ($Y) ➔ Ganancia Esperada ($Z).

FUENTE DE VERDAD:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `AGENTS.md` (Reglas 0, 2, 13.1, 16.1, 38)

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

INSTRUCCIONES:

1. REESTRUCTURACIÓN DEL LAYOUT (ANCHO COMPLETO):
   - Extraer el contenedor de ayuda del interior de la columna derecha de `margenObjetivo`.
   - Ubicar la tarjeta de proyección financiera inmediatamente debajo de la fila de inputs con `gridColumn: '1 / -1'` (o como contenedor full-width posterior a la grilla de dos columnas).
   - Asegurar que no afecte la cápsula de moneda en texto (`✦ Doce mil pesos`) del input de precio.

2. CÁLCULO REACTIVO INTEGRAL:
   - Extraer valores numéricos limpios:
     * `precioVentaNum`: parsear `formData.precioVenta` a entero limpio.
     * `margenNum`: `Number(formData.margenObjetivo) || 0`.
     * `costoMaximo`: `precioVentaNum > 0 ? Math.round(precioVentaNum * (1 - (margenNum / 100))) : 0`.
     * `gananciaEsperada`: `precioVentaNum > 0 ? Math.round(precioVentaNum - costoMaximo) : 0`.

3. RENDERIZADO VISUAL ERGONÓMICO (TARJETA TÁCTICA):
   - Estructura de la tarjeta (#F8FAFC, borde #E2E8F0, padding '0.75rem 1rem', borderRadius '8px', marginTop '0.75rem'):
     * Cabecera explicativa:
       `💡 Margen Objetivo: Porcentaje de ganancia bruta proyectado sobre la venta. Define el tope de costo admisible en la receta para asegurar la rentabilidad.`
     * Si `precioVentaNum > 0`:
       - Tira métrica de 3 valores en columnas horizontales (Precio Venta | Costo Máximo Admisible | Ganancia Neta Esperada).
       - Si `margenNum > 0` (Fondo #F0FDF4, borde #BBF7D0, texto #166534):
         `✦ Proyección: Para un precio de venta de $ {precioVentaFormateado}, se espera que el costo de fabricación no supere $ {costoMaximoFormateado} para obtener una ganancia de $ {gananciaEsperadaFormateada}/und ({margenNum}%).`
       - Si `margenNum === 0` o vacío (Fondo #FFFBEB, borde #FDE68A, texto #B45309):
         `⚠️ Proyección con 0%: Para un precio de venta de $ {precioVentaFormateado}, se espera que el costo sea $ {precioVentaFormateado} y la ganancia sea $ 0 (venta al costo exacto de producción).`

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/products/components/ProductModal.jsx`

SALIDA: Reporte conciso indicando: reubicación full-width del bloque, fórmulas de proyección aplicadas y confirmación del lint con código 0.
```[cite: 1, 2]

---

**Implementación directa en `ProductModal.jsx`**

Si deseas aplicarlo de una vez en `apps/web/src/app/catalog/products/components/ProductModal.jsx`, reemplaza la grilla donde residen ambos inputs por este bloque simétrico y ordenado[cite: 2]:

```jsx
{/* FILA DE PRECIO DE VENTA Y MARGEN OBJETIVO */}
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.85rem' }}>
  {/* Columna Izquierda: Precio de Venta */}
  <div>
    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#182622', marginBottom: '0.35rem' }}>
      PRECIO DE VENTA ($) <span style={{ color: '#DC2626' }}>*</span>
    </label>
    <CurrencySmartInput
      value={formData.precioVenta}
      onChange={(val) => handleInputChange('precioVenta', val)}
      placeholder="0"
    />
  </div>

  {/* Columna Derecha: Margen Objetivo */}
  <div>
    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#182622', marginBottom: '0.35rem' }}>
      MARGEN OBJETIVO (%) <span style={{ color: '#DC2626' }}>*</span>
    </label>
    <StrictNumberInput
      value={formData.margenObjetivo}
      onChange={(val) => handleInputChange('margenObjetivo', val)}
      placeholder="0"
      min={0}
      max={100}
    />
  </div>

  {/* TARJETA DE PROYECCIÓN FINANCIERA (ANCHO COMPLETO) */}
  <div style={{
    gridColumn: '1 / -1',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginTop: '0.25rem'
  }}>
    <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: '1.35', marginBottom: precioVentaNum > 0 ? '0.65rem' : '0' }}>
      💡 <strong>Margen Objetivo:</strong> Ganancia bruta esperada sobre la venta. El costo total de receta (ingredientes + envase) no debe superar el tope admisible para garantizar la utilidad del negocio[cite: 2].
    </div>

    {precioVentaNum > 0 && (
      <div style={{
        backgroundColor: margenObjetivoNum > 0 ? '#F0FDF4' : '#FFFBEB',
        border: `1px solid ${margenObjetivoNum > 0 ? '#BBF7D0' : '#FDE68A'}`,
        borderRadius: '6px',
        padding: '0.55rem 0.85rem'
      }}>
        {/* Tira Métrica de 3 Valores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', marginBottom: '0.45rem' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Precio Venta</span>
            <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>$ {precioVentaNum.toLocaleString('es-CO')}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Costo Máx. Receta</span>
            <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>$ {costoMaximoPermitido.toLocaleString('es-CO')}</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Ganancia Esperada</span>
            <strong style={{ fontSize: '0.88rem', color: margenObjetivoNum > 0 ? '#166534' : '#B45309' }}>
              $ {gananciaEsperada.toLocaleString('es-CO')} ({margenObjetivoNum}%)
            </strong>
          </div>
        </div>

        {/* Resumen explicativo dinámico */}
        <div style={{
          fontSize: '0.72rem',
          fontWeight: '600',
          color: margenObjetivoNum > 0 ? '#166534' : '#B45309',
          borderTop: `1px solid ${margenObjetivoNum > 0 ? '#DCFCE7' : '#FEF3C7'}`,
          paddingTop: '0.35rem',
          textAlign: 'center'
        }}>
          {margenObjetivoNum > 0 ? (
            `✦ Para un valor de venta de $ ${precioVentaNum.toLocaleString('es-CO')}, se espera que el costo sea máx. $ ${costoMaximoPermitido.toLocaleString('es-CO')} para una ganancia de $ ${gananciaEsperada.toLocaleString('es-CO')}/und.`
          ) : (
            `⚠️ Con margen de 0%, se espera que el costo sea de $ ${precioVentaNum.toLocaleString('es-CO')} y la ganancia sea de $ 0 (venta al costo exacto de producción)[cite: 2].`
          )}
        </div>
      </div>
    )}
  </div>
</div>