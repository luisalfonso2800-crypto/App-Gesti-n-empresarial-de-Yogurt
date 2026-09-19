/**
 * @file PresentationCapacityFields.jsx
 * @module catalog/presentations/components/modal-parts
 * @description Campos de capacidad (Oz, Ml) y tipo de envase con validación Poka-Yoke.
 * @responsibility Renderizar campos numéricos y select de envase con bordes rojos y microtextos.
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../presentation-modal.module.css';

export const TIPO_ENVASE_OPTIONS = [
  { id: 'ENVASE', label: 'ENVASE (Pote / Contenedor Plástico)' },
  { id: 'BOTELLA', label: 'BOTELLA (Bebible)' },
  { id: 'BOLSA', label: 'BOLSA (Flexible / Sachet)' },
  { id: 'VASO', label: 'VASO (Porción individual)' },
  { id: 'BALDE', label: 'BALDE (Granel / Mayorista)' },
  { id: 'OTRO', label: 'OTRO' }
];

export function PresentationCapacityFields({
  formData,
  handleChange,
  hasSubmitted,
  isCantidadOzInvalid,
  isCantidadMlInvalid,
  isTipoEnvaseInvalid
}) {
  return (
    <>
      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Cantidad (Oz) <span className={styles.requiredAsterisk}>*</span></label>
          <input 
            name="cantidadOz" 
            type="text" 
            inputMode="decimal" 
            value={formData.cantidadOz ? String(formData.cantidadOz).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
            onChange={e => handleChange({ target: { name: 'cantidadOz', value: e.target.value.replace(/\D/g, '') } })} 
            onKeyDown={e => e.key === '-' && e.preventDefault()} 
            placeholder="0" 
            className={`${modalStyles.input} ${hasSubmitted && isCantidadOzInvalid ? styles.inputErrorBorder : ''}`} 
            required 
          />
          {hasSubmitted && isCantidadOzInvalid && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
        </div>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Cantidad (Ml) <span className={styles.requiredAsterisk}>*</span></label>
          <input 
            name="cantidadMl" 
            type="text" 
            inputMode="decimal" 
            value={formData.cantidadMl ? String(formData.cantidadMl).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''} 
            onChange={e => handleChange({ target: { name: 'cantidadMl', value: e.target.value.replace(/\D/g, '') } })} 
            onKeyDown={e => e.key === '-' && e.preventDefault()} 
            placeholder="0" 
            className={`${modalStyles.input} ${hasSubmitted && isCantidadMlInvalid ? styles.inputErrorBorder : ''}`} 
            required 
          />
          {hasSubmitted && isCantidadMlInvalid && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
        </div>
      </div>

      <div>
        <SmartSelect 
          label="Tipo de Envase" 
          name="tipoEnvase" 
          value={formData.tipoEnvase ?? 'ENVASE'} 
          onChange={handleChange} 
          options={TIPO_ENVASE_OPTIONS} 
          required 
          placeholder="Seleccione envase" 
          className={hasSubmitted && isTipoEnvaseInvalid ? styles.inputErrorBorder : ''} 
        />
        {hasSubmitted && isTipoEnvaseInvalid && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
      </div>
      <p className={styles.helperText}>Elige la forma física del producto. Aparecerá en las órdenes de producción y etiquetas de venta.</p>
    </>
  );
}
