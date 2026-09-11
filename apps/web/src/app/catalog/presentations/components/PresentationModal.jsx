/**
 * @file PresentationModal.jsx
 * @module catalog/presentations/components
 * @description Modal de registro y actualización de presentaciones con SmartComponents Poka-Yoke (CSS Modules).
 * @responsibility Presentar el form y capturar unidades volumétricas seguras (sin negativos).
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies SmartModal, SmartSelect
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { PRESETS } from '@/lib/presetImages';
import styles from '@/components/ui/SmartModal.module.css';

export function PresentationModal({ 
  isOpen, onClose, editingItem, formData, setFormData, handleChange, handleSubmit, 
  isSubmitting, errorMsg 
}) {
  const isDirty = !!formData.nombre || !!formData.tipoEnvase;

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    // Permite números y un punto o coma (para decimales), pero elimina el signo menos u otras letras
    let cleanVal = value.replace(/[^0-9.,]/g, '');
    
    // Normalizar coma a punto
    cleanVal = cleanVal.replace(/,/g, '.');

    // Evitar múltiples puntos
    const parts = cleanVal.split('.');
    if (parts.length > 2) {
      cleanVal = parts[0] + '.' + parts.slice(1).join('');
    }

    setFormData(prev => ({ ...prev, [name]: cleanVal }));
  };

  const handleKeyDownNumeric = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const cantOz = Math.max(0, Number(formData.cantidadOz) || 0);
    const cantMl = Math.max(0, Number(formData.cantidadMl) || 0);

    handleSubmit(e, {
      ...formData,
      cantidadOz: cantOz,
      cantidadMl: cantMl
    });
  };

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Presentación' : 'Nueva Presentación'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div className={styles.errorBanner}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre de la Presentación <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="nombre" 
            value={formData.nombre ?? ''} 
            onChange={handleChange} 
            placeholder="Ej: Botella Vidrio 250ml"
            className={styles.input}
            required 
          />
        </div>

        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Cantidad (Oz) <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="cantidadOz" 
              type="text"
              inputMode="decimal"
              value={formData.cantidadOz ?? ''} 
              onChange={handleNumericChange}
              onKeyDown={handleKeyDownNumeric}
              placeholder="Ej: 12"
              className={styles.input}
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Cantidad (Ml) <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="cantidadMl" 
              type="text"
              inputMode="decimal"
              value={formData.cantidadMl ?? ''} 
              onChange={handleNumericChange}
              onKeyDown={handleKeyDownNumeric}
              placeholder="Ej: 350"
              className={styles.input}
              required 
            />
          </div>
        </div>

        <SmartSelect
          label="Tipo de Envase"
          name="tipoEnvase"
          value={formData.tipoEnvase ?? ''}
          onChange={handleChange}
          options={[
            { id: 'VIDRIO', label: 'Vidrio' },
            { id: 'PLASTICO_PET', label: 'Plástico PET' },
            { id: 'CARTON', label: 'Cartón (Tetra)' },
            { id: 'BOLSA', label: 'Bolsa Plástica' },
            { id: 'OTRO', label: 'Otro' },
          ]}
          required
          placeholder="Seleccione envase"
        />
        <div className={styles.inputGroup}>
          <label className={styles.label}>Imagen del Envase (URL o Preset)</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
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
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              name="imagenUrl" 
              value={formData.imagenUrl ?? ''} 
              onChange={handleChange} 
              placeholder="https://... o clic en preset arriba"
              className={styles.input} 
              style={{ flex: 1 }}
            />
            {formData.imagenUrl && (
              <img src={formData.imagenUrl} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#FBF9F5', border: '1px solid #E8E2D7' }} />
            )}
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

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            name="activo" 
            checked={formData.activo} 
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Presentación Activa</span>
        </label>

        {formData.nombre && formData.tipoEnvase && (formData.cantidadOz !== '' || formData.cantidadMl !== '') && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'registrará'} la presentación <strong>{formData.nombre}</strong> (envase de {formData.tipoEnvase.replace('_', ' ').toLowerCase()}), con capacidad de <strong>{formData.cantidadOz || 0} Oz</strong> ({formData.cantidadMl || 0} Ml).
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
            text="Guardar Presentación"
            disabled={!formData.nombre || !formData.tipoEnvase || formData.cantidadOz === '' || formData.cantidadMl === ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
