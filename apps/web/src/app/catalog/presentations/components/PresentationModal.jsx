/**
 * @file PresentationModal.jsx
 * @module catalog/presentations/components
 * @description Orquestador modular del modal de presentaciones (SRP < 150 líneas, cero inline styles).
 * @responsibility Presentar el formulario de envase/capacidad, delegar subida de imagen y enviar payload sanitizado.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies SmartModal, SmartSelect, ./modal-parts/PresentationImageUploader, ./modal-parts/usePresentationUploader, ./presentation-modal.module.css
 */

import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './presentation-modal.module.css';
import { PresentationImageUploader } from './modal-parts/PresentationImageUploader';
import { usePresentationUploader } from './modal-parts/usePresentationUploader';

const TIPO_ENVASE_OPTIONS = [
  { id: 'UNIDAD', label: 'UNIDAD' },
  { id: 'ENVASE', label: 'ENVASE' },
  { id: 'BOLSA', label: 'BOLSA' },
  { id: 'CAJA', label: 'CAJA' },
  { id: 'BULTO', label: 'BULTO' },
  { id: 'BOTELLA', label: 'BOTELLA' },
  { id: 'BIDÓN', label: 'BIDÓN' },
  { id: 'CANASTILLA', label: 'CANASTILLA' },
  { id: 'OTRO', label: 'OTRO' }
];

function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') : 'http://localhost:3001';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function PresentationModal({ 
  isOpen, onClose, isEditing, editingItem, formData, handleChange, handleSubmit, 
  isSubmitting, errorMsg 
}) {
  const activeIsEditing = isEditing !== undefined ? Boolean(isEditing) : Boolean(editingItem);

  const { isUploading, uploadError, localBlobUrl, handleFileChange, handleClearImage } = usePresentationUploader({
    isOpen,
    currentImageUrl: formData.imagenUrl,
    onImageChange: (url) => handleChange({ target: { name: 'imagenUrl', value: url } })
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name === 'nombre' || name === 'observaciones' ? { target: { name, value: (value ?? '').toUpperCase() } } : e);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    handleSubmit(e, {
      ...formData,
      nombre: (formData.nombre || '').trim().toUpperCase(),
      observaciones: (formData.observaciones || '').trim().toUpperCase(),
      tipoEnvase: (formData.tipoEnvase || 'ENVASE').trim().toUpperCase(),
      cantidadOz: Math.max(0, Number(formData.cantidadOz) || 0),
      cantidadMl: Math.max(0, Number(formData.cantidadMl) || 0),
      imagenUrl: (formData.imagenUrl || '').trim() || null,
      activo: Boolean(formData.activo)
    });
  };

  const missingFields = [];
  if (!formData.nombre?.trim()) missingFields.push('Nombre de la presentación');
  if (formData.cantidadOz === '' || formData.cantidadOz === null || formData.cantidadOz === undefined) missingFields.push('Cantidad en Oz');
  if (formData.cantidadMl === '' || formData.cantidadMl === null || formData.cantidadMl === undefined) missingFields.push('Cantidad en Ml');
  if (!formData.tipoEnvase) missingFields.push('Tipo de envase');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting || isUploading;
  const submitTitle = isUploading ? 'Espere mientras se completa la subida...' : missingFields.length > 0 ? `Complete: ${missingFields.join(', ')}` : 'Guardar cambios de la presentación';
  const activeError = uploadError || (typeof errorMsg === 'string' ? errorMsg : (errorMsg?.message || ''));
  const activeDisplayImage = localBlobUrl || resolveImageUrl(formData.imagenUrl);

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title={activeIsEditing ? 'Editar Presentación' : 'Nueva Presentación'} isDirty={Boolean(formData.nombre || formData.tipoEnvase !== 'ENVASE')} isSubmitting={isSubmitting || isUploading}>
      {activeError && <div className={styles.errorMessage}><span>⚠️</span><span>{activeError}</span></div>}

      <form onSubmit={onSubmit} className={styles.formContainer}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Nombre de la Presentación <span className={styles.requiredAsterisk}>*</span></label>
          <input name="nombre" value={formData.nombre ?? ''} onChange={handleInputChange} placeholder="Ej: BOTELLA VIDRIO 250ML" className={`${modalStyles.input} ${styles.uppercaseInput}`} required />
        </div>

        <div className={modalStyles.twoColumns}>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Cantidad (Oz) <span className={styles.requiredAsterisk}>*</span></label>
            <input name="cantidadOz" type="text" inputMode="decimal" value={formData.cantidadOz ? String(formData.cantidadOz).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} onChange={e => handleChange({ target: { name: 'cantidadOz', value: e.target.value.replace(/\D/g, '') } })} onKeyDown={e => e.key === '-' && e.preventDefault()} placeholder="0" className={modalStyles.input} required />
          </div>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Cantidad (Ml) <span className={styles.requiredAsterisk}>*</span></label>
            <input name="cantidadMl" type="text" inputMode="decimal" value={formData.cantidadMl ? String(formData.cantidadMl).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} onChange={e => handleChange({ target: { name: 'cantidadMl', value: e.target.value.replace(/\D/g, '') } })} onKeyDown={e => e.key === '-' && e.preventDefault()} placeholder="0" className={modalStyles.input} required />
          </div>
        </div>

        <SmartSelect label="Tipo de Envase" name="tipoEnvase" value={formData.tipoEnvase ?? 'ENVASE'} onChange={handleChange} options={TIPO_ENVASE_OPTIONS} required placeholder="Seleccione envase" />
        <PresentationImageUploader activeDisplayImage={activeDisplayImage} isUploading={isUploading} onFileChange={handleFileChange} onClearImage={handleClearImage} />

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Observaciones</label>
          <input name="observaciones" value={formData.observaciones ?? ''} onChange={handleInputChange} className={`${modalStyles.input} ${styles.uppercaseInput}`} />
        </div>

        <label className={styles.activeCheckboxLabel}>
          <input type="checkbox" name="activo" checked={Boolean(formData.activo)} onChange={handleChange} />
          <span className={styles.activeCheckboxText}>Presentación Activa</span>
        </label>

        {formData.nombre && (
          <div className={styles.presentationSummaryBanner}>
            <strong>Resumen:</strong> Se {activeIsEditing ? 'actualizará' : 'registrará'} la presentación <strong>{formData.nombre}</strong>{formData.tipoEnvase ? <> (envase de <strong>{formData.tipoEnvase.replace('_', ' ').toLowerCase()}</strong>)</> : null}, con capacidad de <strong>{formData.cantidadOz || 0} Oz</strong> ({formData.cantidadMl || 0} Ml).
          </div>
        )}

        <div className={modalStyles.actions}>
          <button type="button" onClick={onClose} className={modalStyles.btnCancel}>Cancelar</button>
          <SubmitButton isSubmitting={isSubmitting || isUploading} text={activeIsEditing ? 'Guardar Cambios' : 'Crear Presentación'} disabled={isSubmitDisabled} title={submitTitle} className={isSubmitDisabled ? styles.btnSubmitDisabled : ''} />
        </div>
      </form>
    </SmartModal>
  );
}
