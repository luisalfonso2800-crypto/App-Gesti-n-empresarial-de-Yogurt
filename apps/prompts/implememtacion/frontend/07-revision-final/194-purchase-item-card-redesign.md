# REDISEÑO INDUSTRIAL Y ELEVACIÓN VISUAL DE LAS FILAS DE COMPRA (DESIGN SYSTEM MANNÁ)

DIAGNÓSTICO VISUAL:
La tarjeta actual presenta un fondo verde plano tipo alerta, etiquetas desalineadas, campos de contenido/unidad fracturados y el texto de "monto en letras" desborda verticalmente rompiendo la cuadrícula. La caja de "Ingreso / Subtotal" flota sin jerarquía y el total inferior carece de estructura contenedora.

OBJETIVO:
Rediseñar la tarjeta de ítem y la barra de totales bajo el estándar de consola industrial MANNÁ:
1. Tarjeta base: fondo blanco marfil (#FFFFFF), borde sutil (#E5DFD5), acento lateral izquierdo en verde salvia (#10B981) para "Última Adición", y sombra suave.
2. Cuadrícula limpia en dos líneas operativas:
   - Fila 1 (Identificación): Proveedor (25%), Insumo con stock pill (30%), Marca (15%), Empaque y Contenido agrupados con selector de unidad (30%).
   - Fila 2 (Cálculo Financiero): Cantidad de Empaques, Precio Unitario con máscara de miles, y Tarjeta Táctica de Subtotal e Ingreso neto a inventario con su valor en letras encapsulado.
3. Botón de eliminar: icono sutil en gris cálido con transición a rojo al hover.
4. Barra de Total General: contenedor elevado con separación clara entre flete, subtotal de insumos y gran total con valor en letras.

REGLAS DE OPERACIÓN:
- Modifica exclusivamente `apps/web/src/app/operations/purchases/new/page.jsx` (y su CSS module si aplica).
- CERO scripts temporales (`patch*.js`, `fix*.js`) ni subcarpetas auxiliares.
- Consistencia con la utilidad global `montoATextoPesos` de `@/utils/numberToWords`.

---

### 1. ESTRUCTURA JSX RENOVADA PARA LA FILA EN `page.jsx`:

Reemplaza el mapeo del contenedor de cada fila por la siguiente estructura:

```jsx
<div
  key={fila.id || index}
  style={{
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #E5DFD5',
    borderLeft: isUltimaAdicion ? '4px solid #10B981' : '1px solid #E5DFD5',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 5px rgba(24, 38, 34, 0.04)',
    position: 'relative',
    transition: 'border-color 0.2s ease'
  }}
>
  {/* CABECERA SUPERIOR DE LA TARJETA */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {isUltimaAdicion && (
        <span style={{
          backgroundColor: '#ECFDF5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
          fontSize: '0.65rem',
          fontWeight: '800',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          letterSpacing: '0.04em'
        }}>
          ✦ ÚLTIMA ADICIÓN
        </span>
      )}
      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#78716C' }}>
        ÍTEM #{index + 1}
      </span>
    </div>

    {/* Botón eliminar fila */}
    <button
      type="button"
      onClick={() => handleEliminarFila(index)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#A8A29E',
        padding: '0.25rem',
        borderRadius: '4px',
        transition: 'color 0.15s, background-color 0.15s'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#A8A29E'; e.currentTarget.style.backgroundColor = 'transparent'; }}
      title="Eliminar este ítem"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    </button>
  </div>

  {/* LÍNEA 1: ESPECIFICACIÓN DEL INSUMO */}
  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1fr 1.2fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
    {/* Proveedor */}
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#182622', marginBottom: '0.25rem' }}>
        Proveedor
      </label>
      <input
        type="text"
        placeholder="Ej: Colanta, Disar..."
        value={fila.proveedor || ''}
        onChange={(e) => handleFilaChange(index, 'proveedor', e.target.value)}
        style={{
          width: '100%',
          padding: '0.45rem 0.6rem',
          borderRadius: '6px',
          border: '1px solid #D6D3D1',
          fontSize: '0.82rem',
          color: '#182622',
          backgroundColor: '#FAFAF9'
        }}
      />
    </div>

    {/* Insumo */}
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#182622' }}>
          Insumo <span style={{ color: '#DC2626' }}>*</span>
        </label>
        {fila.insumoSeleccionado && (
          <span style={{ fontSize: '0.62rem', color: '#78716C' }}>
            Unidad: {fila.unidadBase || 'ml'} | Mín: {fila.stockMinimo || 0}
          </span>
        )}
      </div>
      <input
        type="text"
        placeholder="Buscar insumo..."
        value={fila.insumoNombre || ''}
        onChange={(e) => handleFilaChange(index, 'insumoNombre', e.target.value)}
        style={{
          width: '100%',
          padding: '0.45rem 0.6rem',
          borderRadius: '6px',
          border: '1px solid #D6D3D1',
          fontSize: '0.82rem',
          color: '#182622'
        }}
      />
    </div>

    {/* Marca */}
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#182622', marginBottom: '0.25rem' }}>
        Marca
      </label>
      <input
        type="text"
        placeholder="Marca del producto..."
        value={fila.marca || ''}
        onChange={(e) => handleFilaChange(index, 'marca', e.target.value)}
        style={{
          width: '100%',
          padding: '0.45rem 0.6rem',
          borderRadius: '6px',
          border: '1px solid #D6D3D1',
          fontSize: '0.82rem',
          color: '#182622'
        }}
      />
    </div>

    {/* Empaque y Presentación combinada */}
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#182622', marginBottom: '0.25rem' }}>
        Empaque / Contenido
      </label>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        <select
          value={fila.empaque || 'BOLSA'}
          onChange={(e) => handleFilaChange(index, 'empaque', e.target.value)}
          style={{
            flex: 1,
            padding: '0.45rem 0.4rem',
            borderRadius: '6px',
            border: '1px solid #D6D3D1',
            fontSize: '0.75rem',
            color: '#182622',
            backgroundColor: '#FFFFFF'
          }}
        >
          <option value="BOLSA">Bolsa</option>
          <option value="BOTELLA">Botella</option>
          <option value="CAJA">Caja</option>
          <option value="BULTO">Bulto</option>
          <option value="POTE">Pote</option>
        </select>
        <input
          type="number"
          placeholder="900"
          value={fila.contenido || ''}
          onChange={(e) => handleFilaChange(index, 'contenido', e.target.value)}
          style={{
            width: '65px',
            padding: '0.45rem 0.4rem',
            borderRadius: '6px',
            border: '1px solid #D6D3D1',
            fontSize: '0.82rem',
            textAlign: 'right'
          }}
        />
        <select
          value={fila.unidadContenido || 'ml'}
          onChange={(e) => handleFilaChange(index, 'unidadContenido', e.target.value)}
          style={{
            width: '55px',
            padding: '0.45rem 0.2rem',
            borderRadius: '6px',
            border: '1px solid #D6D3D1',
            fontSize: '0.75rem',
            backgroundColor: '#FAFAF9'
          }}
        >
          <option value="ml">ml</option>
          <option value="L">L</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="und">und</option>
        </select>
      </div>
    </div>
  </div>

  {/* LÍNEA 2: TRANSACCIÓN ECONÓMICA Y CÁLCULOS EN VIVO */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: '140px 220px 1fr',
    gap: '1rem',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: '1px solid #EFEAE1'
  }}>
    {/* Cantidad de Empaques */}
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#182622', marginBottom: '0.25rem' }}>
        Cant. Empaques
      </label>
      <input
        type="number"
        min="1"
        value={fila.cantidad || ''}
        onChange={(e) => handleFilaChange(index, 'cantidad', e.target.value)}
        style={{
          width: '100%',
          padding: '0.45rem 0.6rem',
          borderRadius: '6px',
          border: '1px solid #D6D3D1',
          fontSize: '0.88rem',
          fontWeight: '700',
          color: '#182622',
          backgroundColor: '#FFFFFF',
          textAlign: 'center'
        }}
      />
    </div>

    {/* Precio Unitario con conversión inline limpia */}
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#182622', marginBottom: '0.25rem' }}>
        Precio Unitario ($)
      </label>
      <input
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={fila.precioUnitario ? Number(fila.precioUnitario).toLocaleString('es-CO') : ''}
        onChange={(e) => handlePrecioChange(index, e.target.value)}
        style={{
          width: '100%',
          padding: '0.45rem 0.6rem',
          borderRadius: '6px',
          border: '1px solid #D6D3D1',
          fontSize: '0.88rem',
          fontWeight: '700',
          color: '#182622',
          backgroundColor: '#FFFFFF',
          textAlign: 'right'
        }}
      />
      {fila.precioUnitario > 0 && (
        <div style={{ fontSize: '0.66rem', color: '#065F46', fontWeight: '600', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          ✦ {montoATextoPesos(fila.precioUnitario)}
        </div>
      )}
    </div>

    {/* Panel Táctico de Ingreso Neto y Subtotal */}
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '1.5rem',
      paddingLeft: '1rem',
      borderLeft: '1px solid #E5DFD5'
    }}>
      {/* Volumen ingresado */}
      <div style={{ textAlign: 'right' }}>
        <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: '#78716C', textTransform: 'uppercase' }}>
          Ingreso Neto
        </span>
        <strong style={{ fontSize: '0.9rem', color: '#182622' }}>
          {(Number(fila.cantidad || 0) * Number(fila.contenido || 0)).toLocaleString('es-CO')} {fila.unidadContenido || 'ml'}
        </strong>
      </div>

      {/* Subtotal en dinero */}
      <div style={{ textAlign: 'right' }}>
        <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: '#78716C', textTransform: 'uppercase' }}>
          Subtotal
        </span>
        <strong style={{ fontSize: '1.1rem', color: '#182622' }}>
          ${(Number(fila.cantidad || 0) * Number(fila.precioUnitario || 0)).toLocaleString('es-CO')}
        </strong>
        {Number(fila.cantidad || 0) * Number(fila.precioUnitario || 0) > 0 && (
          <div style={{ fontSize: '0.66rem', color: '#065F46', fontWeight: '600' }}>
            ✦ {montoATextoPesos(Number(fila.cantidad || 0) * Number(fila.precioUnitario || 0))}
          </div>
        )}
      </div>
    </div>
  </div>
</div>

REDISEÑO DEL RESUMEN TOTAL INFERIOR:
Reemplaza el texto flotante de "Total Compras Adicionales" por una barra de control cerrada:

JavaScript
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5DFD5',
  borderRadius: '8px',
  padding: '1rem 1.5rem',
  marginTop: '1.5rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
}}>
  {/* Desglose rápido */}
  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#78716C' }}>
    <span>Ítems registrados: <strong style={{ color: '#182622' }}>{filas.length}</strong></span>
    <span>Flete global: <strong style={{ color: '#182622' }}>${Number(flete || 0).toLocaleString('es-CO')}</strong></span>
  </div>

  {/* Gran Total */}
  <div style={{ textAlign: 'right' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', justifyContent: 'flex-end' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#78716C' }}>TOTAL COMPRA:</span>
      <strong style={{ fontSize: '1.4rem', fontWeight: '900', color: '#182622' }}>
        ${totalCompra.toLocaleString('es-CO')}
      </strong>
    </div>
    {totalCompra > 0 && (
      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#065F46', marginTop: '0.15rem' }}>
        ✦ {montoATextoPesos(totalCompra)}
      </div>
    )}
  </div>
</div>