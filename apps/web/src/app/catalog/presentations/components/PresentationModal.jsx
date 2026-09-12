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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['nombre', 'observaciones'].includes(name)) {
      handleChange({ target: { name, value: value.toUpperCase() } });
    } else {
      handleChange(e);
    }
  };

  const handleKeyDownNumeric = (e) => {
    if (e.key === '-') {
      e.preventDefault();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    const cantOz = Math.max(0, Number(formData.cantidadOz) || 0);
    const cantMl = Math.max(0, Number(formData.cantidadMl) || 0);

    handleSubmit(e, {
      ...formData,
      nombre: (formData.nombre || '').trim().toUpperCase(),
      observaciones: (formData.observaciones || '').trim().toUpperCase(),
      cantidadOz: cantOz,
      cantidadMl: cantMl
    });
  };

  const missingFields = [];
  if (!formData.nombre?.trim()) missingFields.push('Nombre de la presentación');
  if (formData.cantidadOz === '' || formData.cantidadOz === null || formData.cantidadOz === undefined) missingFields.push('Cantidad en Oz');
  if (formData.cantidadMl === '' || formData.cantidadMl === null || formData.cantidadMl === undefined) missingFields.push('Cantidad en Ml');
  if (!formData.tipoEnvase) missingFields.push('Tipo de envase');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0
    ? `Complete los campos obligatorios: ${missingFields.join(', ')}`
    : '';

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Presentación' : 'Nueva Presentación'}
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
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre de la Presentación <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="nombre" 
            value={formData.nombre ?? ''} 
            onChange={handleInputChange} 
            placeholder="Ej: BOTELLA VIDRIO 250ML"
            className={styles.input}
            style={{ textTransform: 'uppercase' }}
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
              value={formData.cantidadOz ? String(formData.cantidadOz).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'cantidadOz', value: raw } });
              }}
              onKeyDown={handleKeyDownNumeric}
              placeholder="0"
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
              value={formData.cantidadMl ? String(formData.cantidadMl).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'cantidadMl', value: raw } });
              }}
              onKeyDown={handleKeyDownNumeric}
              placeholder="0"
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
            { id: 'UNIDAD', label: 'UNIDAD' },
            { id: 'ENVASE', label: 'ENVASE' },
            { id: 'BOLSA', label: 'BOLSA' },
            { id: 'CAJA', label: 'CAJA' },
            { id: 'BULTO', label: 'BULTO' },
            { id: 'BOTELLA', label: 'BOTELLA' },
            { id: 'BIDÓN', label: 'BIDÓN' },
            { id: 'CANASTILLA', label: 'CANASTILLA' },
            { id: 'OTRO', label: 'OTRO' }
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
            onChange={handleInputChange} 
            className={styles.input}
            style={{ textTransform: 'uppercase' }}
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

        {formData.nombre && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'registrará'} la presentación <strong>{formData.nombre}</strong>{formData.tipoEnvase ? <> (envase de <strong>{formData.tipoEnvase.replace('_', ' ').toLowerCase()}</strong>)</> : null}, con capacidad de <strong>{formData.cantidadOz || 0} Oz</strong> ({formData.cantidadMl || 0} Ml).
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
            disabled={isSubmitDisabled}
            title={submitTitle}
            style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
        </div>
      </form>
    </SmartModal>
  );
}
