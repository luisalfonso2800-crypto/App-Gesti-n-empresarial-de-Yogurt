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
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './presentation-modal.module.css';
import { PresentationImageUploader } from './modal-parts/PresentationImageUploader';
import { PresentationCapacityFields } from './modal-parts/PresentationCapacityFields';
import { usePresentationUploader } from './modal-parts/usePresentationUploader';

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
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) setHasSubmitted(false);
  }, [isOpen]);

  const { isUploading, uploadError, localBlobUrl, handleFileChange, handleClearImage } = usePresentationUploader({
    isOpen,
    currentImageUrl: formData.imagenUrl,
    onImageChange: (url) => handleChange({ target: { name: 'imagenUrl', value: url } })
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name === 'nombre' || name === 'observaciones' ? { target: { name, value: (value ?? '').toUpperCase() } } : e);
  };

  const isGranel = formData.tipoEnvase === 'BALDE' || formData.tipoEnvase === 'TANQUE_GRANEL';
  const isNombreInvalid = !formData.nombre?.trim();
  const isCantidadOzInvalid = !isGranel && (formData.cantidadOz === '' || formData.cantidadOz === null || formData.cantidadOz === undefined);
  const isCantidadMlInvalid = !isGranel && (formData.cantidadMl === '' || formData.cantidadMl === null || formData.cantidadMl === undefined);
  const isTipoEnvaseInvalid = !formData.tipoEnvase;

  const missingFields = [];
  if (isNombreInvalid) missingFields.push('Nombre de la presentación');
  if (isCantidadOzInvalid) missingFields.push('Cantidad en Oz');
  if (isCantidadMlInvalid) missingFields.push('Cantidad en Ml');
  if (isTipoEnvaseInvalid) missingFields.push('Tipo de envase');

  const hasErrors = missingFields.length > 0;
  const isSubmitDisabled = isSubmitting || isUploading;
  const submitTitle = isUploading ? 'Espere mientras se completa la subida...' : hasSubmitted && hasErrors ? `Complete: ${missingFields.join(', ')}` : 'Guardar cambios de la presentación';

  const onSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    handleSubmit(e, {
      ...formData,
      nombre: (formData.nombre || '').trim().toUpperCase(),
      observaciones: (formData.observaciones || '').trim().toUpperCase(),
      unidadMedida: formData.unidadMedida || (isGranel ? 'L' : 'ml'),
      tipoEnvase: (formData.tipoEnvase || 'ENVASE').trim().toUpperCase(),
      cantidadOz: isGranel ? (Number(formData.cantidadOz) || 33.8) : Math.max(0, Number(formData.cantidadOz) || 0),
      cantidadMl: isGranel ? (Number(formData.cantidadMl) || 1000) : Math.max(0, Number(formData.cantidadMl) || 0),
      imagenUrl: (formData.imagenUrl || '').trim() || null,
      activo: Boolean(formData.activo)
    });
  };

  const activeError = uploadError || (typeof errorMsg === 'string' ? errorMsg : (errorMsg?.message || ''));
  const activeDisplayImage = localBlobUrl || resolveImageUrl(formData.imagenUrl);

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={activeIsEditing ? 'Editar Presentación Comercial' : 'Nueva Presentación Comercial'}
      subtitle="Define el recipiente físico y capacidad para el costeo y envasado en planta."
      isDirty={Boolean(formData.nombre || formData.tipoEnvase !== 'ENVASE')} 
      isSubmitting={isSubmitting || isUploading}
    >
      {activeError && <div className={styles.errorMessage}><span>⚠️</span><span>{activeError}</span></div>}

      <form onSubmit={onSubmit} className={styles.formContainer}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Nombre de la Presentación <span className={styles.requiredAsterisk}>*</span></label>
          <input name="nombre" value={formData.nombre ?? ''} onChange={handleInputChange} placeholder="Ej: BOTELLA VIDRIO 250ML" className={`${modalStyles.input} ${styles.uppercaseInput} ${hasSubmitted && isNombreInvalid ? styles.inputErrorBorder : ''}`} required />
          {hasSubmitted && isNombreInvalid && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
        </div>

        <PresentationCapacityFields 
          formData={formData} 
          handleChange={handleChange} 
          hasSubmitted={hasSubmitted} 
          isCantidadOzInvalid={isCantidadOzInvalid} 
          isCantidadMlInvalid={isCantidadMlInvalid} 
          isTipoEnvaseInvalid={isTipoEnvaseInvalid} 
        />

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
            <strong>Resumen:</strong> Se {activeIsEditing ? 'actualizará' : 'creará'} la presentación <strong>{formData.nombre}</strong> en formato <strong>{formData.tipoEnvase || 'ENVASE'}</strong> de <strong>{formData.cantidadMl || 0}</strong> ml. Cada lote descontará 1 recipiente por unidad terminada.
          </div>
        )}

        <div className={modalStyles.actions}>
          <button type="button" onClick={onClose} className={modalStyles.btnCancel}>Cancelar</button>
          <SubmitButton 
            type="submit"
            isSubmitting={isSubmitting || isUploading} 
            text={activeIsEditing ? 'Guardar Cambios' : 'Crear Presentación'} 
            processingText={isUploading ? 'Subiendo imagen...' : 'Guardando...'}
            disabled={isSubmitDisabled} 
            title={submitTitle} 
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''} 
          />
        </div>
      </form>
    </SmartModal>
  );
}
