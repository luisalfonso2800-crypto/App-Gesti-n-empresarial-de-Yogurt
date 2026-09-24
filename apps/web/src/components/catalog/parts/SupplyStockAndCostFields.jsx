/**
 * @file SupplyStockAndCostFields.jsx
 * @module components/catalog/parts
 * @description Fila de dos columnas con Stock Mínimo y Costo Base Referencial (< 140 líneas).
 */
import React from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';
import { montoATextoPesos } from '@/utils/numberToWords';

export function SupplyStockAndCostFields({
  formData,
  handleChange,
  rawCostoBase,
  minStockNum,
  selectedUnitName,
  isStockMinimoError,
  isContenidoOk
}) {
  return (
    <div className={modalStyles.twoColumns}>
      <div className={`${modalStyles.inputGroup} ${!isContenidoOk ? styles.fieldDisabled : ''}`}>
        <label className={modalStyles.label}>
          Stock Mínimo <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="stockMinimo" 
          value={formData.stockMinimo ?? ''} 
          onChange={handleChange} 
          disabled={!isContenidoOk}
          placeholder="0"
          className={`${modalStyles.input} ${styles.numberRightInput} ${isStockMinimoError ? styles.inputErrorBorder : ''}`} 
        />
        {isStockMinimoError && <span className={styles.fieldErrorText}>Este campo es requerido</span>}
        {formData.stockMinimo && formData.unidadBase && (
          <span className={styles.stockHelperText}>
            *El mínimo {minStockNum === 1 ? 'es' : 'son'} {formData.stockMinimo} {selectedUnitName} para emitir alertas de reabastecimiento.*
          </span>
        )}
      </div>

      <div className={`${modalStyles.inputGroup} ${!isContenidoOk ? styles.fieldDisabled : ''}`}>
        <label className={modalStyles.label}>Costo Base Referencial ($)</label>
        <div className={styles.costBaseContainer}>
          <input 
            name="costoBase" 
            value={formData.costoBase ?? ''} 
            onChange={handleChange} 
            disabled={!isContenidoOk}
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
    </div>
  );
}
