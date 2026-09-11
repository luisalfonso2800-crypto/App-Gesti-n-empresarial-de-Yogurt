/**
 * @file SaleModal.jsx
 * @module commercial/sales/components
 * @description Vista del formulario de captura para nuevas ventas (CSS Modules + Summary).
 * @responsibility Presentar al usuario los controles para definir los montos y elegir lotes FEFO.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/SmartModal, CurrencySmartInput, SmartSelect, StrictNumberInput
 */
import React, { useState, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import CurrencySmartInput from '@/components/ui/inputs/CurrencySmartInput';
import StrictNumberInput from '@/components/ui/inputs/StrictNumberInput';
import { ShoppingCart, Plus, Trash2, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '@/components/ui/SmartModal.module.css';

export function SaleModal({ 
  isOpen, onClose, formData, products, clients, 
  handleChange, handleDetailsChange, handleSubmit,
  isSubmitting, errorMsg
}) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [stockError, setStockError] = useState('');

  const selectedProd = products.find(p => p.id === selectedProductId);

  // Validar stock reactivamente
  useEffect(() => {
    if (selectedProd && qty) {
      const q = Number(qty);
      const disp = Number(selectedProd.cantidadActual);
      if (q > disp) {
        setStockError(`Stock insuficiente en cava: solo hay ${disp} unidades disponibles`);
      } else {
        setStockError('');
      }
    } else {
      setStockError('');
    }
  }, [selectedProd, qty]);

  const handleAddProduct = () => {
    if (!selectedProductId || !qty || !price || stockError) return;
    const q = Number(qty);
    const p = Number(price);
    if (q <= 0 || p <= 0) return;

    if (!selectedProd) return;

    const newDetail = {
      idProducto: selectedProd.id,
      nombre: selectedProd.producto?.nombre,
      cantidad: q,
      precioUnitario: p,
      costoUnitario: Number(selectedProd.costoPromedio || 0),
    };

    handleDetailsChange([...formData.detalles, newDetail]);
    setSelectedProductId('');
    setQty('');
    setPrice('');
  };

  const handleRemoveProduct = (index) => {
    const newDet = formData.detalles.filter((_, i) => i !== index);
    handleDetailsChange(newDet);
  };

  const handleProductSelect = (e) => {
    const val = e.target.value;
    setSelectedProductId(val);
    const prod = products.find(p => p.id === val);
    if (prod && prod.producto) {
      setPrice(Number(prod.producto.precioVentaSug) || '');
    } else {
      setPrice('');
    }
  };

  const utilidadTotal = formData.detalles.reduce((sum, d) => sum + ((d.precioUnitario - d.costoUnitario) * d.cantidad), 0);
  const isDirty = formData.detalles.length > 0 || !!formData.idCliente;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (stockError || formData.detalles.length === 0) return;
    handleSubmit(e);
  };
  
  const getClientName = () => {
    const c = clients.find(x => String(x.id) === String(formData.idCliente));
    return c ? c.nombre : 'Cliente no seleccionado';
  };

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nueva Venta (Despacho desde Cava)"
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div className={styles.errorBanner}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.twoColumns}>
          <SmartSelect
            label="Cliente"
            name="idCliente"
            value={formData.idCliente ?? ''}
            onChange={handleChange}
            required
            options={clients.map(c => ({ id: c.id, label: c.nombre, subtext: c.documento }))}
          />
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Fecha Venta <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="fechaVenta" 
              type="date" 
              value={formData.fechaVenta ?? ''} 
              onChange={handleChange} 
              className={styles.input} 
              required 
            />
          </div>

          <SmartSelect
            label="Canal"
            name="canalVenta"
            value={formData.canalVenta ?? ''}
            onChange={handleChange}
            options={[
              {id: 'DIRECTO', label: 'Venta Directa'},
              {id: 'DISTRIBUIDOR', label: 'Distribuidor'},
              {id: 'INSTITUCIONAL', label: 'Institucional'},
            ]}
          />

          <SmartSelect
            label="Tipo de Pago"
            name="tipoPago"
            value={formData.tipoPago ?? ''}
            onChange={handleChange}
            options={[
              {id: 'CONTADO', label: 'Contado'},
              {id: 'CREDITO', label: 'Crédito'},
            ]}
          />
        </div>

        <div style={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '8px', padding: '1.25rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0', color: '#44403c', fontSize: '1rem' }}><ShoppingCart size={18} /> Productos a Despachar</h4>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <SmartSelect
                label="Producto en Cava"
                name="selectedProductId"
                value={selectedProductId}
                onChange={handleProductSelect}
                options={products.filter(p => Number(p.cantidadActual) > 0).map(p => ({
                  id: p.id,
                  label: p.producto?.nombre,
                  subtext: `Stock: ${p.cantidadActual} ${p.producto?.unidadMedida}`
                }))}
              />
            </div>
            
            <div style={{ width: '5rem' }}>
              <StrictNumberInput
                label="Cant."
                name="qty"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="1"
                error={stockError}
              />
            </div>
            
            <div style={{ width: '8rem' }}>
              <CurrencySmartInput
                label="Precio Unit."
                name="price"
                value={price ?? ''}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: 5.000"
              />
            </div>

            <div style={{ paddingBottom: '2px' }}>
              <button 
                type="button" 
                onClick={handleAddProduct}
                disabled={!selectedProductId || !qty || !price || stockError}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#e7e5e4', color: '#1c1917', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', height: '38px' }}
              >
                <Plus size={16} /> Agregar
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #d6d3d1', color: '#78716c' }}>
                  <th style={{ padding: '0.5rem 0', textAlign: 'left', fontWeight: 500 }}>Producto</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500 }}>Cant.</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500 }}>P. Venta</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500 }}>Subtotal</th>
                  <th style={{ padding: '0.5rem 0' }}></th>
                </tr>
              </thead>
              <tbody>
                {formData.detalles.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e7e5e4' }}>
                    <td style={{ padding: '0.75rem 0', color: '#1c1917', fontWeight: 500 }}>{d.nombre}</td>
                    <td style={{ padding: '0.75rem 0', color: '#1c1917', textAlign: 'right' }}>{d.cantidad}</td>
                    <td style={{ padding: '0.75rem 0', color: '#1c1917', textAlign: 'right' }}>{formatCurrency(d.precioUnitario)}</td>
                    <td style={{ padding: '0.75rem 0', color: '#1c1917', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(d.cantidad * d.precioUnitario)}</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                      <button type="button" onClick={() => handleRemoveProduct(i)} style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {formData.detalles.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '1.5rem 0', textAlign: 'center', color: '#a8a29e', fontStyle: 'italic' }}>No hay productos agregados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ficha de balance previa a confirmar */}
        {formData.detalles.length > 0 && (
          <div style={{ backgroundColor: '#fdfaf5', border: '2px dashed #d6d3d1', borderRadius: '8px', padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'serif', fontSize: '1.125rem', color: '#1c1917', margin: '0 0 1rem 0', borderBottom: '1px solid #e7e5e4', paddingBottom: '0.5rem' }}>
              <Receipt size={20} /> BALANCE PREVIO
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {formData.detalles.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#57534e' }}>
                  <span>{d.cantidad}x {d.nombre}</span>
                  <span style={{ fontSize: '0.75rem', color: '#a8a29e' }}>Costo Est: {formatCurrency(d.costoUnitario * d.cantidad)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#44403c' }}>
                <span>Subtotal Venta:</span>
                <strong style={{ fontSize: '1rem' }}>{formatCurrency(formData.totalVenta)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#57534e' }}>Margen Bruto Estimado:</span>
                <strong style={{ color: utilidadTotal > 0 ? '#047857' : '#e11d48' }}>
                  {formatCurrency(utilidadTotal)}
                </strong>
              </div>
            </div>
          </div>
        )}

        {formData.tipoPago === 'CREDITO' && (
          <div className={styles.twoColumns} style={{ marginTop: '0.5rem' }}>
            <CurrencySmartInput
              label="Valor Pagado (Abono)"
              name="valorPagado"
              value={formData.valorPagado ?? ''}
              onChange={handleChange}
              placeholder="0"
            />
            <div className={styles.inputGroup}>
              <label className={styles.label}>Fecha Límite <span style={{color: '#e11d48'}}>*</span></label>
              <input 
                name="fechaLimitePago" 
                type="date" 
                value={formData.fechaLimitePago ?? ''} 
                onChange={handleChange} 
                className={styles.input} 
                required 
              />
            </div>
          </div>
        )}

        {formData.idCliente && formData.detalles.length > 0 && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
            <strong>Resumen:</strong> Se registrará una venta de <strong>{formData.detalles.length} tipo(s) de producto(s)</strong> al cliente <strong>{getClientName()}</strong> mediante el canal <strong>{formData.canalVenta.toLowerCase()}</strong>. La modalidad de pago será de <strong>{formData.tipoPago.toLowerCase()}</strong> por un total de <strong>{formatCurrency(formData.totalVenta)}</strong>.
          </div>
        )}

        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={styles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting} 
            text="Despachar y Facturar"
            disabled={formData.detalles.length === 0 || stockError}
          />
        </div>
      </form>
    </SmartModal>
  );
}
