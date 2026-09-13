Lógica de cálculo reactivo en ProductModal.jsx

Dentro del componente, antes del return, extrae y computa las cifras numéricas limpias:  
MD

JavaScript
// Cálculo reactivo de costo máximo y ganancia según margen objetivo
const precioVentaNum = Number(String(formData.precioVenta || '').replace(/\D/g, '')) || 0;
const margenObjetivoNum = Number(formData.margenObjetivo) || 0;

const costoMaximoPermitido = precioVentaNum > 0 && margenObjetivoNum > 0
  ? Math.round(precioVentaNum * (1 - (margenObjetivoNum / 100)))
  : 0;

const gananciaEsperada = precioVentaNum > 0 && margenObjetivoNum > 0
  ? precioVentaNum - costoMaximoPermitido
  : 0;
Estructura JSX debajo del input "MARGEN OBJETIVO (%)"

Ubica el contenedor del input de margenObjetivo y añade el bloque explicativo dinámico:  
MD

JavaScript
{/* Ayuda contextual y píldora dinámica de margen objetivo */}
<div style={{ marginTop: '0.35rem', fontSize: '0.75rem', lineHeight: '1.3', color: '#64748B' }}>
  <span>
    💡 <strong>Ganancia esperada:</strong> Margen bruto proyectado sobre la venta. El costo de receta (materia prima + empaque) no debe superar el tope para asegurar la rentabilidad.
  </span>

  {precioVentaNum > 0 && margenObjetivoNum > 0 && (
    <div style={{
      marginTop: '0.35rem',
      padding: '0.35rem 0.6rem',
      backgroundColor: '#F0FDF4',
      border: '1px solid #BBF7D0',
      borderRadius: '6px',
      color: '#166534',
      fontSize: '0.74rem',
      fontWeight: '600'
    }}>
      ✦ Costo máximo admisible: $ {costoMaximoPermitido.toLocaleString('es-CO')} (Utilidad: $ {gananciaEsperada.toLocaleString('es-CO')}/und).
    </div>
  )}

  {precioVentaNum > 0 && (!margenObjetivoNum || margenObjetivoNum === 0) && (
    <div style={{
      marginTop: '0.35rem',
      padding: '0.3rem 0.5rem',
      backgroundColor: '#FFFBEB',
      border: '1px solid #FDE68A',
      borderRadius: '6px',
      color: '#B45309',
      fontSize: '0.72rem'
    }}>
      ⚠️ Con margen de 0%, el producto se venderá al costo exacto sin utilidad.
    </div>
  )}
</div>
Comprobación posterior:

Bash
pnpm --filter web exec next lint --file src/app/catalog/products/components/ProductModal.jsx