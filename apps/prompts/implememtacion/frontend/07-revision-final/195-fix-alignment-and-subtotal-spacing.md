# CORRECCIÓN DE ALINEACIÓN VERTICAL (INPUTS) Y ESPACIADO ENTRE INGRESO NETO Y SUBTOTAL

DIAGNÓSTICO VISUAL:
1. Desalineación vertical de inputs: El campo "Cant. Empaques" y el campo "Precio Unitario ($)" no están nivelados en el eje Y debido a que el texto en letras ("✦ Tres mil doscientos...") genera un alto dinámico y el contenedor padre tiene un alineamiento centrado (`align-items: center`).
2. Apiñamiento en cifras: "INGRESO NETO" y "SUBTOTAL" están excesivamente pegados horizontalmente, dificultando la lectura de ambas métricas.

OBJETIVOS:
- Alinear perfectamente en la parte superior (`align-items: flex-start`) ambos inputs para que sus bordes superiores coincidan exactamente en la misma línea visual.
- Separar "INGRESO NETO" y "SUBTOTAL" con un espacio generoso (`gap: 3rem` o división limpia) y dar a cada cifra su propio bloque de lectura.

REGLAS DE OPERACIÓN:
- Modifica exclusivamente `apps/web/src/app/operations/purchases/new/page.jsx`.
- CERO scripts temporales (`patch*.js`, `fix*.js`) ni subcarpetas auxiliares.
- Edición atómica y directa.

---

### INSTRUCCIONES EN `apps/web/src/app/operations/purchases/new/page.jsx`:

Ubica la fila de cálculo financiero (la franja crema que contiene `Cant. Empaques`, `Precio Unitario`, `INGRESO NETO` y `SUBTOTAL`) y reemplaza su estructura por la siguiente:

```jsx
{/* LÍNEA 2: TRANSACCIÓN ECONÓMICA Y CÁLCULOS EN VIVO */}
<div style={{
  display: 'grid',
  gridTemplateColumns: '130px 240px 1fr',
  gap: '1.25rem',
  alignItems: 'flex-start', /* Alinea los inputs en el mismo tope superior */
  backgroundColor: '#F7F4EE',
  padding: '0.85rem 1.25rem',
  borderRadius: '6px',
  border: '1px solid #EFEAE1'
}}>
  {/* 1. Cantidad de Empaques */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{
      display: 'block',
      fontSize: '0.72rem',
      fontWeight: '700',
      color: '#182622',
      marginBottom: '0.35rem',
      minHeight: '1rem',
      lineHeight: '1rem'
    }}>
      Cant. Empaques
    </label>
    <input
      type="number"
      min="1"
      value={fila.cantidad || ''}
      onChange={(e) => handleFilaChange(index, 'cantidad', e.target.value)}
      style={{
        width: '100%',
        height: '38px',
        padding: '0.45rem 0.6rem',
        borderRadius: '6px',
        border: '1px solid #D6D3D1',
        fontSize: '0.95rem',
        fontWeight: '700',
        color: '#182622',
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}
    />
  </div>

  {/* 2. Precio Unitario con conversión inline */}
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{
      display: 'block',
      fontSize: '0.72rem',
      fontWeight: '700',
      color: '#182622',
      marginBottom: '0.35rem',
      minHeight: '1rem',
      lineHeight: '1rem'
    }}>
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
        height: '38px',
        padding: '0.45rem 0.6rem',
        borderRadius: '6px',
        border: '1px solid #D6D3D1',
        fontSize: '0.95rem',
        fontWeight: '700',
        color: '#182622',
        backgroundColor: '#FFFFFF',
        textAlign: 'right',
        boxSizing: 'border-box'
      }}
    />
    {fila.precioUnitario > 0 && (
      <span style={{
        fontSize: '0.68rem',
        color: '#065F46',
        fontWeight: '600',
        marginTop: '0.35rem',
        lineHeight: 1.2
      }}>
        ✦ {montoATextoPesos(fila.precioUnitario)}
      </span>
    )}
  </div>

  {/* 3. Panel Separado: Ingreso Neto y Subtotal */}
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: '3rem', /* Espaciado amplio y desahogado entre ambas métricas */
    paddingLeft: '1.5rem',
    borderLeft: '1px solid #E5DFD5',
    minHeight: '48px'
  }}>
    {/* Ingreso Neto */}
    <div style={{ textAlign: 'right' }}>
      <span style={{
        display: 'block',
        fontSize: '0.65rem',
        fontWeight: '800',
        color: '#78716C',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '0.25rem'
      }}>
        Ingreso Neto
      </span>
      <strong style={{ fontSize: '1.05rem', color: '#182622', fontWeight: '800' }}>
        {(Number(fila.cantidad || 0) * Number(fila.contenido || 0)).toLocaleString('es-CO')} {fila.unidadContenido || 'ml'}
      </strong>
    </div>

    {/* Subtotal */}
    <div style={{ textAlign: 'right' }}>
      <span style={{
        display: 'block',
        fontSize: '0.65rem',
        fontWeight: '800',
        color: '#78716C',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '0.25rem'
      }}>
        Subtotal
      </span>
      <strong style={{ fontSize: '1.25rem', color: '#182622', fontWeight: '900', lineHeight: 1 }}>
        ${(Number(fila.cantidad || 0) * Number(fila.precioUnitario || 0)).toLocaleString('es-CO')}
      </strong>
      {Number(fila.cantidad || 0) * Number(fila.precioUnitario || 0) > 0 && (
        <span style={{
          display: 'block',
          fontSize: '0.68rem',
          color: '#065F46',
          fontWeight: '600',
          marginTop: '0.35rem'
        }}>
          ✦ {montoATextoPesos(Number(fila.cantidad || 0) * Number(fila.precioUnitario || 0))}
        </span>
      )}
    </div>
  </div>
</div>