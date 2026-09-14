/**
 * @file SupplierFormFields.jsx
 * @module components/catalog/parts
 * @description Campos del formulario de proveedor (Razón Social, NIT, Contacto, Celular, Email, Dirección, Observaciones).
 * @responsibility Renderizar los controles de entrada con clases de CSS Modules y feedback de validación.
 * @usedBy apps/web/src/components/catalog/SupplierModal.jsx
 * @dependencies react, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supplier-modal.module.css';

export default function SupplierFormFields({
  formData,
  handleChange,
  isNitError,
  isTelefonoError,
  isEmailError
}) {
  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Razón Social / Nombre <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="razonSocial" 
          value={formData.razonSocial ?? ''} 
          onChange={handleChange} 
          placeholder="Ej: LÁCTEOS XYZ S.A.S"
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          required 
        />
      </div>

      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            NIT / Cédula <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="nit"
            value={formData.nit ?? ''}
            onChange={handleChange}
            placeholder="Ej: 900.123.456-7"
            className={`${modalStyles.input} ${isNitError ? styles.inputErrorBorder : ''}`}
            required
          />
          {isNitError && (
            <span className={styles.fieldErrorText}>
              NIT o Cédula requerido
            </span>
          )}
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Nombre de Contacto</label>
          <input 
            name="nombreContacto" 
            value={formData.nombreContacto ?? ''} 
            onChange={handleChange} 
            className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          />
        </div>
      </div>

      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Teléfono / Celular <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="telefono"
            value={formData.telefono ?? ''}
            onChange={handleChange}
            placeholder="Ej: 300 123 4567"
            className={`${modalStyles.input} ${isTelefonoError ? styles.inputErrorBorder : ''}`}
            required
          />
          {isTelefonoError && (
            <span className={styles.fieldErrorText}>
              El celular debe tener 10 dígitos
            </span>
          )}
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Email</label>
          <input 
            type="email"
            name="email" 
            value={formData.email ?? ''} 
            onChange={handleChange} 
            className={`${modalStyles.input} ${isEmailError ? styles.inputErrorBorder : ''}`} 
          />
          {isEmailError && (
            <span className={styles.fieldErrorText}>
              Ingrese un correo electrónico válido (ej. contacto@empresa.com)
            </span>
          )}
        </div>
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Dirección <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="direccion" 
          value={formData.direccion ?? ''} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          required 
        />
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Observaciones</label>
        <textarea 
          name="observaciones" 
          value={formData.observaciones ?? ''} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${styles.textareaObservations}`} 
        />
      </div>

      <label className={styles.checkboxLabel}>
        <input 
          type="checkbox" 
          name="activo" 
          checked={formData.activo} 
          onChange={handleChange} 
        />
        <span className={styles.checkboxText}>Proveedor Activo</span>
      </label>
    </>
  );
}
