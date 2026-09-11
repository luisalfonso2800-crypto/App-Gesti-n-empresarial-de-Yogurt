/**
 * @file ProductModal.jsx
 * @module catalog/products/components
 * @description Modal de administración de atributos del producto (CSS Modules + Summary).
 * @responsibility Formulario para los valores comerciales del producto.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies SmartModal, SmartSelect, CurrencySmartInput, StrictNumberInput
 */
import React, { useRef } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import CurrencySmartInput from '@/components/ui/inputs/CurrencySmartInput';
import { cleanCurrency, formatCurrency } from '@/lib/formatters';
import { PRESETS } from '@/lib/presetImages';
import styles from '@/components/ui/SmartModal.module.css';

export function ProductModal({ 
  isOpen, onClose, editingItem, formData, handleChange, handleSubmit, 
  presentations = [], isSubmitting, errorMsg 
}) {
  const fileInputRef = useRef(null);
  
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
    const pc = cleanCurrency(formData.precioVenta);
    const mO = Number(formData.margenObjetivo);
    handleSubmit(e, {
      ...formData,
      precioVenta: pc,
      margenObjetivo: mO
    });
  };

  const getPresentationName = () => {
    if (!formData.idPresentacion) return 'desconocida';
    const pres = presentations.find(p => String(p.id) === String(formData.idPresentacion));
    return pres ? pres.nombre : 'desconocida';
  };

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Producto' : 'Nuevo Producto'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div className={styles.errorBanner}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="nombre" 
              value={formData.nombre ?? ''} 
              onChange={handleChange} 
              placeholder="Ej: Yogurt Fresa"
              className={styles.input} 
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
            onChange={handleChange} 
            className={styles.input} 
            required 
          />
        </div>

        <div className={styles.twoColumns}>
          <CurrencySmartInput
            label="Precio de Venta"
            name="precioVenta"
            value={formData.precioVenta ?? ''}
            onChange={handleChange}
            placeholder="Ej: 5.000"
            required
          />

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
          <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Producto Activo</span>
        </label>

        {formData.nombre && formData.idPresentacion && formData.precioVenta && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el producto <strong>{formData.nombre}</strong> (en presentación {getPresentationName()}), destinado al canal <strong>{formData.canalVenta || 'no definido'}</strong>, con un precio sugerido de <strong>{formatCurrency(formData.precioVenta)}</strong>.
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
            disabled={!formData.nombre || !formData.idPresentacion}
          />
        </div>
      </form>
    </SmartModal>
  );
}
