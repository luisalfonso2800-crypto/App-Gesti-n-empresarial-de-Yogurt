/**
 * @file SupplierPriceModal.jsx
 * @module catalog/supplier-prices/components
 * @description Modal y formulario para la creación/edición de precios de proveedor (CSS Modules + Summary).
 * @responsibility Manejar la entrada de datos, cálculo inverso automático, y envío.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies SmartModal, SmartSelect, CurrencySmartInput, StrictNumberInput
 */
import React, { useState, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import CurrencySmartInput from '@/components/ui/inputs/CurrencySmartInput';
import { formatCurrency, cleanCurrency } from '@/lib/formatters';
import styles from '@/components/ui/SmartModal.module.css';
import { montoATextoPesos } from '@/utils/numberToWords';

export function SupplierPriceModal({ isOpen, onClose, editingItem, onSubmit, allInsumos = [], allProveedores = [] }) {
  const [formData, setFormData] = useState({
    idInsumo: '',
    idProveedor: '',
    presentacionCompra: '',
    cantidadPresentacion: '',
    unidadPresentacion: '',
    cantidadEquivalenteBase: '',
    precioCompra: '',
    costoUnidadBase: '',
    observaciones: '',
    activo: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        precioCompra: editingItem.precioCompra || '',
        cantidadPresentacion: editingItem.cantidadPresentacion || '',
        cantidadEquivalenteBase: editingItem.cantidadEquivalenteBase || ''
      });
    } else {
      setFormData({
        idInsumo: '',
        idProveedor: '',
        presentacionCompra: '',
        cantidadPresentacion: '',
        unidadPresentacion: '',
        cantidadEquivalenteBase: '',
        precioCompra: '',
        costoUnidadBase: '',
        observaciones: '',
        activo: true
      });
    }
    setErrorMsg('');
  }, [editingItem, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Cálculo inverso automático del costo base
  useEffect(() => {
    const pc = cleanCurrency(formData.precioCompra);
    const cb = Number(formData.cantidadEquivalenteBase);
    
    if (pc > 0 && cb > 0) {
      const costo = pc / cb;
      setFormData(prev => ({ ...prev, costoUnidadBase: costo }));
    } else {
      setFormData(prev => ({ ...prev, costoUnidadBase: '' }));
    }
  }, [formData.precioCompra, formData.cantidadEquivalenteBase]);

  const isDirty = !!formData.idInsumo || !!formData.idProveedor || !!formData.precioCompra;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const pc = cleanCurrency(formData.precioCompra);
      const payload = {
        ...formData,
        cantidadPresentacion: Number(formData.cantidadPresentacion),
        cantidadEquivalenteBase: Number(formData.cantidadEquivalenteBase),
        precioCompra: pc,
        costoUnidadBase: Number(formData.costoUnidadBase)
      };
      
      await onSubmit(payload, editingItem);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInsumoName = () => {
    const i = allInsumos.find(x => String(x.id) === String(formData.idInsumo));
    return i ? i.nombre : 'desconocido';
  };
  
  const getProveedorName = () => {
    const p = allProveedores.find(x => String(x.id) === String(formData.idProveedor));
    return p ? p.nombre : 'desconocido';
  };

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Precio de Proveedor' : 'Nuevo Precio de Proveedor'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div className={styles.errorBanner}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.twoColumns}>
          <SmartSelect
            label="Insumo"
            name="idInsumo"
            value={formData.idInsumo ?? ''}
            onChange={handleChange}
            options={allInsumos.map(i => ({ id: i.id, label: i.nombre, subtext: i.categoria }))}
            required
            placeholder="Seleccione insumo"
          />
          
          <SmartSelect
            label="Proveedor"
            name="idProveedor"
            value={formData.idProveedor ?? ''}
            onChange={handleChange}
            options={allProveedores.map(p => ({ id: p.id, label: p.nombre, subtext: p.nitCedula || p.contacto }))}
            required
            placeholder="Seleccione proveedor"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Presentación Compra <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="presentacionCompra" 
              value={formData.presentacionCompra ?? ''} 
              onChange={handleChange} 
              placeholder="Ej: BOLSA x 900 ml, BULTO x 25 kg"
              className={styles.input} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Cant. Presentación <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="cantidadPresentacion" 
              type="text"
              inputMode="decimal"
              value={formData.cantidadPresentacion ?? ''} 
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9.]/g, '');
                if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, '');
                handleChange({ target: { name: 'cantidadPresentacion', value: val } });
              }}
              className={styles.input} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Unidad <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="unidadPresentacion" 
              value={formData.unidadPresentacion ?? ''} 
              onChange={handleChange} 
              placeholder="Ej: kg, litro"
              className={styles.input} 
              required 
            />
          </div>
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Equivalente Unidad Base <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="cantidadEquivalenteBase" 
              type="text"
              inputMode="decimal"
              value={formData.cantidadEquivalenteBase ?? ''} 
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9.]/g, '');
                if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, '');
                handleChange({ target: { name: 'cantidadEquivalenteBase', value: val } });
              }}
              placeholder="Ej: 25000 (para gramos)"
              className={styles.input} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Precio de Compra ($) <span style={{color: '#e11d48'}}>*</span></label>
            <input
              name="precioCompra"
              type="text"
              inputMode="numeric"
              min="0"
              placeholder="0"
              value={formData.precioCompra ? String(formData.precioCompra).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'precioCompra', value: raw } });
              }}
              onKeyDown={(e) => {
                if (e.key === '-') e.preventDefault();
              }}
              className={styles.input}
              required
            />
            {formData.precioCompra && parseInt(String(formData.precioCompra).replace(/\D/g, ''), 10) > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#065F46', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                ✦ {montoATextoPesos(parseInt(String(formData.precioCompra).replace(/\D/g, ''), 10))}
              </span>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#fafaf9', border: '1px solid #e7e5e4', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#57534e', fontWeight: 500 }}>Costo Calculado (Unidad Base):</span>
            <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1c1917' }}>
              {formData.costoUnidadBase ? formatCurrency(formData.costoUnidadBase) : '$0'}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#78716c', marginTop: '0.25rem' }}>Cálculo automático: Precio Compra ÷ Equivalente Base</p>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Observaciones</label>
          <input 
            name="observaciones" 
            value={formData.observaciones ?? ''} 
            onChange={handleChange} 
            className={styles.input} 
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            name="activo" 
            checked={formData.activo} 
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Mantener precio activo</span>
        </label>

        {formData.idInsumo && formData.idProveedor && formData.precioCompra && formData.costoUnidadBase && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el precio de compra del insumo <strong>{getInsumoName()}</strong> con el proveedor <strong>{getProveedorName()}</strong>. El sistema procesará el costo de <strong>{formatCurrency(formData.precioCompra)}</strong> para obtener un valor unitario base de <strong>{formatCurrency(formData.costoUnidadBase)}</strong>.
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
            text="Guardar Precio"
            disabled={!formData.idInsumo || !formData.idProveedor || !formData.costoUnidadBase || isSubmitting}
          />
        </div>
      </form>
    </SmartModal>
  );
}
