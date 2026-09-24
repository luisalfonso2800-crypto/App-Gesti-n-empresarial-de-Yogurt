/**
 * @file ProductInventoryIdentityFields.jsx
 * @module catalog/products/components/modal-parts
 * @description Campos complementarios de código interno, unidad de venta y stock mínimo (SRP < 100).
 * @usedBy ProductBasicFields.jsx
 */

import React from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

export function ProductInventoryIdentityFields({
  formData,
  handleInputChange,
  handleChange,
  isGranel
}) {
  return (
    <>
      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Código Interno (Auto o Manual)
          </label>
          <input 
            name="codigo" 
            value={formData.codigo ?? ''} 
            onChange={handleInputChange} 
            placeholder="Ej: YOG-FRE-500"
            className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          />
          <span className={styles.helperText}>Se autogenera si se deja vacío.</span>
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Unidad de Venta
          </label>
          <select 
            name="unidadVenta" 
            value={formData.unidadVenta || 'UND'} 
            onChange={handleChange}
            className={modalStyles.input}
          >
            <option value="UND">UND (Unidad)</option>
            <option value="LITRO">LITRO</option>
            <option value="KILO">KILO</option>
            <option value="LIBRA">LIBRA</option>
            <option value="DOCENA">DOCENA</option>
          </select>
        </div>
      </div>

      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Stock Mínimo en Cava (Alerta de reposición)
          </label>
          <input 
            type="number"
            min="0"
            name="stockMinimo" 
            value={formData.stockMinimo ?? '5'} 
            onChange={handleChange} 
            placeholder="5"
            className={modalStyles.input} 
          />
        </div>
        <div>
          {(isGranel || ['INSUMO_BASE_WIP', 'BASES_LACTEAS', 'DULCES_JALEAS', 'TOPPING_CEREAL'].includes(formData.categoria)) && (
            <div className={styles.wipConceptText}>
              💡 <strong>¿Qué es un Semielaborado (WIP)?</strong> Producto intermedio elaborado en planta para envasado posterior.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
