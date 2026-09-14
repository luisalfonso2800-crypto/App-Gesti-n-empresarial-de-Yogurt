/**
 * @file SupplierPriceEquivalenceFields.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Inputs para cantidad equivalente en unidad base, precio de compra y tarjeta de costo unitario calculado.
 * @responsibility Manejar la captura del factor de conversión base, máscara de precio y display del costo resultante.
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 * @dependencies react, @/utils/numberToWords, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supplier-price-modal.module.css';

export default function SupplierPriceEquivalenceFields({ formData, handleChange }) {
  const numericPrice = formData.precioCompra ? parseInt(String(formData.precioCompra).replace(/\D/g, ''), 10) : 0;

  return (
    <>
      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Equivalente Unidad Base <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="cantidadEquivalenteBase" 
            type="text" 
            inputMode="numeric" 
            value={formData.cantidadEquivalenteBase ?? ''} 
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              handleChange({ target: { name: 'cantidadEquivalenteBase', value: val } });
            }}
            placeholder="Ej: 25000 (para gramos)"
            className={modalStyles.input} 
            required 
          />
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Precio de Compra ($) <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            name="precioCompra"
            type="text"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={formData.precioCompra ? String(formData.precioCompra).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              handleChange({ target: { name: 'precioCompra', value: raw } });
            }}
            onKeyDown={(e) => {
              if (e.key === '-') e.preventDefault();
            }}
            className={modalStyles.input}
            required
          />
          {numericPrice > 0 && (
            <span className={styles.priceWords}>
              ✦ {montoATextoPesos(numericPrice)}
            </span>
          )}
        </div>
      </div>

      <div className={styles.costCard}>
        <div className={styles.costHeaderRow}>
          <span className={styles.costLabel}>Costo Calculado (Unidad Base):</span>
          <span className={styles.costValue}>
            {formData.costoUnidadBase ? (
              `$ ${Number(formData.costoUnidadBase).toLocaleString('es-CO', {
                minimumFractionDigits: Number(formData.costoUnidadBase) % 1 !== 0 ? 2 : 0,
                maximumFractionDigits: 2
              })}`
            ) : '$ 0'}
          </span>
        </div>
        <p className={styles.costHelperText}>
          Cálculo automático: Precio Compra ÷ Equivalente Base
        </p>
      </div>
    </>
  );
}
