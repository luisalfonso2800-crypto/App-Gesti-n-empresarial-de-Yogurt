/**
 * @file SupplierPricePresentationFields.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Campos de presentación de compra, cantidad en empaque y unidad de medida.
 * @responsibility Renderizar los inputs de la presentación comercial y su desglose físico.
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 * @dependencies react, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supplier-price-modal.module.css';

export default function SupplierPricePresentationFields({ formData, handleChange }) {
  return (
    <div className={styles.presentationGrid}>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Presentación Compra <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="presentacionCompra" 
          value={formData.presentacionCompra ?? ''} 
          onChange={handleChange} 
          placeholder="Ej: BOLSA x 900 ml, BULTO x 25 kg"
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          required 
        />
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Cant. Presentación <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="cantidadPresentacion" 
          type="text" 
          inputMode="decimal" 
          placeholder="0"
          value={formData.cantidadPresentacion ?? ''} 
          onChange={(e) => {
            let val = e.target.value.replace(/[^0-9.]/g, '');
            if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, '');
            handleChange({ target: { name: 'cantidadPresentacion', value: val } });
          }}
          className={modalStyles.input} 
          required 
        />
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Unidad <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="unidadPresentacion" 
          value={formData.unidadPresentacion ?? ''} 
          onChange={handleChange} 
          placeholder="Ej: KG, LITRO"
          className={`${modalStyles.input} ${styles.uppercaseInput}`} 
          required 
        />
      </div>
    </div>
  );
}
