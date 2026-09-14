/**
 * @file ClientFormModal.jsx
 * @module commercial/clients/components
 * @description Modal de captura y edición de clientes comerciales y personas naturales (SRP + CSS Modules).
 * @responsibility Presentar los campos de datos generales, canal, contacto y días de crédito con feedback Poka-Yoke.
 * @usedBy apps/web/src/app/commercial/clients/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/inputs/SmartSelect, @/components/ui/inputs/StrictNumberInput
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import StrictNumberInput from '@/components/ui/inputs/StrictNumberInput';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../clients.module.css';

const TIPOS_CLIENTE = [
  { id: 'MAYORISTA', label: 'Mayorista' },
  { id: 'MINORISTA', label: 'Minorista' },
  { id: 'CONSUMIDOR_FINAL', label: 'Consumidor Final' }
];

const CANALES_VENTA = [
  { id: 'DIRECTO', label: 'Venta Directa' },
  { id: 'DISTRIBUIDOR', label: 'Distribuidor' },
  { id: 'INSTITUCIONAL', label: 'Institucional' }
];

export default function ClientFormModal({
  isOpen,
  onClose,
  formData,
  isSubmitting,
  submitError,
  isDirty,
  isSubmitDisabled,
  submitTitle,
  handleChange,
  handleSubmit
}) {
  const isPhoneInvalid = Boolean(formData.telefono && formData.telefono.replace(/\D/g, '').length < 10);

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nuevo Cliente"
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {submitError && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Razón Social / Nombre <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            placeholder="Ej: MINIMERCADO LA ESQUINA"
            className={`${modalStyles.input} ${styles.uppercaseInput}`} 
            required 
          />
        </div>

        <div className={modalStyles.twoColumns}>
          <SmartSelect
            label="Tipo de Cliente"
            name="tipoCliente"
            value={formData.tipoCliente}
            onChange={handleChange}
            options={TIPOS_CLIENTE}
            required
          />
          
          <SmartSelect
            label="Canal"
            name="canal"
            value={formData.canal}
            onChange={handleChange}
            options={CANALES_VENTA}
            required
          />
        </div>

        <div className={modalStyles.twoColumns}>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Persona de Contacto</label>
            <input 
              name="contacto" 
              value={formData.contacto} 
              onChange={handleChange} 
              className={`${modalStyles.input} ${styles.uppercaseInput}`} 
            />
          </div>
          
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Teléfono / Celular</label>
            <input 
              name="telefono" 
              value={formData.telefono} 
              onChange={handleChange} 
              placeholder="Ej: 300 123 4567"
              className={`${modalStyles.input} ${isPhoneInvalid ? styles.inputErrorBorder : ''}`}
            />
            {isPhoneInvalid && (
              <span className={styles.fieldErrorText}>
                El celular debe tener 10 dígitos
              </span>
            )}
          </div>
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Dirección</label>
          <input 
            name="direccion" 
            value={formData.direccion} 
            onChange={handleChange} 
            className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          />
        </div>

        <div className={styles.creditDaysCol}>
          <StrictNumberInput
            label="Días de Crédito"
            name="diasCredito"
            value={formData.diasCredito}
            onChange={handleChange}
            placeholder="Ej: 30"
            required
          />
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Observaciones</label>
          <textarea 
            name="observaciones" 
            value={formData.observaciones} 
            onChange={handleChange} 
            className={`${modalStyles.input} ${styles.textareaObservations}`} 
          />
        </div>

        {formData.nombre && formData.tipoCliente && formData.canal && (
          <div className={styles.summaryBanner}>
            <strong>Resumen:</strong> Se registrará el cliente <strong>{formData.nombre}</strong> clasificado como <strong>{formData.tipoCliente.toLowerCase()}</strong> para el canal <strong>{formData.canal.toLowerCase()}</strong>. {Number(formData.diasCredito) > 0 ? `Se le otorgarán ${formData.diasCredito} días de crédito.` : 'Las ventas serán de contado (0 días de crédito).'}
          </div>
        )}

        <div className={modalStyles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={modalStyles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting} 
            text="Guardar Cliente"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
