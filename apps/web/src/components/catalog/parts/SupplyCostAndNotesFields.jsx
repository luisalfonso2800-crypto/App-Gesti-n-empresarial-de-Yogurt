/**
 * @file SupplyCostAndNotesFields.jsx
 * @module components/catalog/parts
 * @description Campos secundarios de costo base, observaciones y estado activo para insumos.
 * @responsibility Renderizar campos opcionales del formulario de insumos.
 */
import React from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';
import { montoATextoPesos } from '@/utils/numberToWords';

export function SupplyCostAndNotesFields({
  formData,
  handleChange,
  rawCostoBase
}) {
  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Densidad (g/ml)</label>
        <input 
          name="densidad" 
          type="number"
          step="0.01"
          min="0.5"
          max="2.5"
          value={formData.densidad ?? '1.0'} 
          onChange={handleChange} 
          placeholder="1.0"
          className={`${modalStyles.input} ${styles.numberRightInput}`} 
        />
        <span className={styles.stockHelperText}>
          Ej: Leche 1.03, Miel 1.42, Agua 1.0
        </span>
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Costo Base Referencial ($)</label>
        <div className={styles.costBaseContainer}>
          <input 
            name="costoBase" 
            value={formData.costoBase ?? ''} 
            onChange={handleChange} 
            placeholder="0"
            className={`${modalStyles.input} ${styles.numberRightInput}`} 
          />
          {rawCostoBase > 0 && (
            <span className={styles.costBaseBadge}>
              o {montoATextoPesos(rawCostoBase)}
            </span>
          )}
        </div>
        {rawCostoBase > 0 && (
          <div className={styles.unitCostIndicator}>
            Costo por unidad base: ${(rawCostoBase / (parseFloat(formData.contenidoReferencial) || (['g', 'ml'].includes(formData.unidadBase?.toLowerCase()) ? 1000 : 1))).toLocaleString('es-CO', {maximumFractionDigits: 2})} / {formData.unidadBase || 'ud'}
          </div>
        )}
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Observaciones</label>
        <input 
          name="observaciones" 
          value={formData.observaciones ?? ''} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
        />
      </div>

      <label className={styles.checkboxLabel}>
        <input 
          type="checkbox" 
          name="activo" 
          checked={formData.activo} 
          onChange={handleChange} 
        />
        <span className={styles.checkboxText}>Insumo Activo</span>
      </label>
    </>
  );
}
