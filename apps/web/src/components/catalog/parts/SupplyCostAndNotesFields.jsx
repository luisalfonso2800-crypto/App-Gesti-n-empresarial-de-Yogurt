/**
 * @file SupplyCostAndNotesFields.jsx
 * @module components/catalog/parts
 * @description Campos de densidad (con asistente de balanza), observaciones y estado activo para insumos (< 140 líneas).
 * @responsibility Renderizar bloque de densidad y notas opcionales del formulario de insumos.
 */
import React from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';
import { DensityAssistant } from './DensityAssistant';

export function SupplyCostAndNotesFields({
  formData,
  handleChange,
  disabled = false
}) {
  return (
    <>
      <DensityAssistant formData={formData} handleChange={handleChange} disabled={disabled} />

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Observaciones</label>
        <input 
          name="observaciones" 
          value={formData.observaciones ?? ''} 
          onChange={handleChange} 
          disabled={disabled}
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
        />
      </div>

      <label className={styles.checkboxLabel}>
        <input 
          type="checkbox" 
          name="activo" 
          checked={formData.activo} 
          onChange={handleChange} 
          disabled={disabled}
        />
        <span className={styles.checkboxText}>Insumo Activo</span>
      </label>
    </>
  );
}
