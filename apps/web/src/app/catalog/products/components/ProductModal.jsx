/**
 * @file ProductModal.jsx
 * @module catalog/products/components
 * @description Modal de administración de atributos del producto (CSS Modules + Summary).
 * @responsibility Formulario para los valores comerciales del producto con validación Poka-Yoke.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies SmartModal, SmartSelect, CurrencySmartInput, StrictNumberInput
 */
import React, { useRef } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { cleanCurrency, formatCurrency } from '@/lib/formatters';
import { PRESETS } from '@/lib/presetImages';
import styles from '@/components/ui/SmartModal.module.css';
import { montoATextoPesos } from '@/utils/numberToWords';

export function ProductModal({ 
  isOpen, onClose, editingItem, formData, handleChange, handleSubmit, 
  presentations = [], isSubmitting, errorMsg 
}) {
  const fileInputRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['nombre', 'descripcion', 'observaciones'].includes(name)) {
      handleChange({ target: { name, value: value.toUpperCase() } });
    } else {
      handleChange(e);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FBF9F5';
        ctx.fillRect(0, 0, 400, 400);

        const scale = Math.min(400 / img.width, 400 / img.height);
        const x = (400 / 2) - (img.width / 2) * scale;
        const y = (400 / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        handleChange({ target: { name: 'imagenUrl', value: dataUrl } });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const isDirty = !!formData.nombre || !!formData.idPresentacion;

  const onSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    const pc = cleanCurrency(formData.precioVenta);
    const mO = Number(formData.margenObjetivo);
    handleSubmit(e, {
      ...formData,
      nombre: (formData.nombre || '').trim().toUpperCase(),
      descripcion: (formData.descripcion || '').trim().toUpperCase(),
      observaciones: (formData.observaciones || '').trim().toUpperCase(),
      precioVenta: pc,
      margenObjetivo: mO
    });
  };

  const getPresentationName = () => {
    if (!formData.idPresentacion) return 'desconocida';
    const pres = presentations.find(p => String(p.id) === String(formData.idPresentacion));
    return pres ? pres.nombre : 'desconocida';
  };

  const missingFields = [];
  if (!formData.nombre?.trim()) missingFields.push('Nombre');
  if (!formData.idPresentacion) missingFields.push('Presentación');
  if (!formData.categoria) missingFields.push('Categoría');
  if (!formData.canalVenta) missingFields.push('Canal de venta');
  if (!formData.descripcion?.trim()) missingFields.push('Descripción');
  if (!formData.precioVenta) missingFields.push('Precio de venta');
  if (formData.margenObjetivo === '' || formData.margenObjetivo === null || formData.margenObjetivo === undefined) missingFields.push('Margen objetivo');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0
    ? `Complete los campos obligatorios: ${missingFields.join(', ')}`
    : '';

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Producto' : 'Nuevo Producto'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div style={{
          marginBottom: '1rem',
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#B91C1C',
          padding: '0.6rem 0.85rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="nombre" 
              value={formData.nombre ?? ''} 
              onChange={handleInputChange} 
              placeholder="Ej: YOGURT FRESA"
              className={styles.input} 
              style={{ textTransform: 'uppercase' }}
              required 
            />
          </div>
          
          <SmartSelect
            label="Presentación"
            name="idPresentacion"
            value={formData.idPresentacion ?? ''}
            onChange={handleChange}
            options={presentations.map(p => ({ id: p.id, label: p.nombre }))}
            required
            placeholder="Seleccione presentación"
          />
        </div>

        <div className={styles.twoColumns}>
          <SmartSelect
            label="Categoría"
            name="categoria"
            value={formData.categoria ?? ''}
            onChange={handleChange}
            options={[
              { id: 'LACTEOS', label: 'Lácteos' },
              { id: 'POSTRES', label: 'Postres' },
              { id: 'BEBIDAS', label: 'Bebidas' }
            ]}
            required
            placeholder="Seleccione categoría"
          />
          
          <SmartSelect
            label="Canal de Venta"
            name="canalVenta"
            value={formData.canalVenta ?? ''}
            onChange={handleChange}
            options={[
              { id: 'B2B', label: 'B2B (Mayoristas)' },
              { id: 'B2C', label: 'B2C (Consumidor Final)' },
              { id: 'AMBOS', label: 'Ambos' }
            ]}
            required
            placeholder="Seleccione canal"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Imagen del Producto (URL o Preset)</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem', alignItems: 'center' }}>
            {PRESETS.map(preset => (
              <img 
                key={preset.id} 
                src={preset.url} 
                alt={preset.name}
                title={preset.name}
                onClick={() => handleChange({ target: { name: 'imagenUrl', value: preset.url } })}
                style={{ 
                  width: '40px', height: '40px', cursor: 'pointer', borderRadius: '4px', border: formData.imagenUrl === preset.url ? '2px solid #1C3F35' : '1px solid #ccc' 
                }}
              />
            ))}
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#F7F4EE', border: '1px solid #D97706', borderRadius: '4px', cursor: 'pointer', color: '#1C3F35', fontWeight: '500' }}
            >
              📁 Subir Imagen desde el Equipo
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              name="imagenUrl" 
              value={formData.imagenUrl ?? ''} 
              onChange={handleChange} 
              placeholder="https://... o clic en preset/subir"
              className={styles.input} 
              style={{ flex: 1 }}
            />
            {formData.imagenUrl && (
              <img src={formData.imagenUrl} alt="Preview" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#FBF9F5', border: '2px solid #D97706' }} />
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Descripción <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="descripcion" 
            value={formData.descripcion ?? ''} 
            onChange={handleInputChange} 
            className={styles.input} 
            style={{ textTransform: 'uppercase' }}
            required 
          />
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Precio de Venta ($) <span style={{color: '#e11d48'}}>*</span></label>
            <input
              name="precioVenta"
              type="text"
              inputMode="numeric"
              min="0"
              placeholder="0"
              value={formData.precioVenta ? String(formData.precioVenta).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'precioVenta', value: raw } });
              }}
              onKeyDown={(e) => {
                if (e.key === '-') e.preventDefault();
              }}
              className={styles.input}
              required
            />
            {formData.precioVenta && parseInt(String(formData.precioVenta).replace(/\D/g, ''), 10) > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#065F46', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                ✦ {montoATextoPesos(parseInt(String(formData.precioVenta).replace(/\D/g, ''), 10))}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Margen Objetivo (%) <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              type="number"
              step="0.01"
              min="0"
              name="margenObjetivo" 
              value={formData.margenObjetivo ?? ''} 
              onChange={handleChange} 
              placeholder="Ej: 30"
              className={styles.input} 
              required 
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Observaciones</label>
          <input 
            name="observaciones" 
            value={formData.observaciones ?? ''} 
            onChange={handleInputChange} 
            className={styles.input} 
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            name="activo" 
            checked={formData.activo} 
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Producto Activo</span>
        </label>

        {formData.nombre && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el producto <strong>{formData.nombre}</strong>{formData.idPresentacion ? <> (en presentación <strong>{getPresentationName()}</strong>)</> : null}{formData.canalVenta ? <>, destinado al canal <strong>{formData.canalVenta}</strong></> : null}{formData.precioVenta ? <>, con precio sugerido de <strong>{formatCurrency(formData.precioVenta)}</strong></> : null}.
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
            text="Guardar Producto"
            disabled={isSubmitDisabled}
            title={submitTitle}
            style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
        </div>
      </form>
    </SmartModal>
  );
}
