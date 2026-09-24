/**
 * @file SupplierPriceEquivalenceFields.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Pasos 5 y 6: Cantidad con pleca espaciosa, precio y delegación en SupplierPriceTaxCard (< 115 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 */
'use client';

import React from 'react';
import { numeroATexto, montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supplier-price-modal.module.css';
import { UNIDADES_AUTORIZADAS } from './SupplierPricePresentationFields';
import SupplierPriceTaxCard from './SupplierPriceTaxCard';

export default function SupplierPriceEquivalenceFields({
  formData,
  handleChange,
  isStep5Active,
  isStep6Active,
  insumoUnidadBase = ''
}) {
  const selectedUnit = UNIDADES_AUTORIZADAS.find(
    u => u.value.toLowerCase() === (formData.unidadPresentacion || '').toLowerCase()
  );
  const plecaSigla = selectedUnit ? selectedUnit.sigla : (formData.unidadPresentacion || 'und');
  const unidadNombreCompleto = selectedUnit ? selectedUnit.nombreCompleto : (formData.unidadPresentacion || 'unidades');
  const empaqueNombre = formData.presentacionCompra || 'empaque';
  const numericPrice = formData.precioCompra ? parseInt(String(formData.precioCompra).replace(/\D/g, ''), 10) : 0;
  const numericQty = formData.cantidadPresentacion ? Number(String(formData.cantidadPresentacion).replace(/\D/g, '')) : 0;
  const unidadFinal = insumoUnidadBase || formData.unidadPresentacion || 'und';

  return (
    <div className={styles.step6Container}>
      <div className={styles.twoColumnsRow}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            5. {isStep5Active ? `¿Cuántos ${unidadNombreCompleto} tiene cada ${empaqueNombre}?` : '5. Contenido por empaque (defina unidad)'} <span className={styles.requiredAsterisk}>*</span>
          </label>
          <div className={`${styles.plecaInputContainer} ${!isStep5Active ? styles.inputDisabled : ''}`}>
            <input
              name="cantidadPresentacion"
              type="text"
              inputMode="decimal"
              disabled={!isStep5Active}
              placeholder="0"
              value={isStep5Active && formData.cantidadPresentacion ? String(formData.cantidadPresentacion).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
              onChange={(e) => {
                let val = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
                handleChange({ target: { name: 'cantidadPresentacion', value: val } });
                if (['kg', 'g', 'L', 'ml', 'und'].includes(formData.unidadPresentacion?.toLowerCase())) {
                  let factor = Number(val) || 0;
                  if (formData.unidadPresentacion?.toLowerCase() === 'kg') factor = factor * 1000;
                  if (formData.unidadPresentacion?.toLowerCase() === 'l') factor = factor * 1000;
                  handleChange({ target: { name: 'cantidadEquivalenteBase', value: factor } });
                }
              }}
              className={styles.plecaInputField}
              required
            />
            <span className={styles.plecaBadge}>| {isStep5Active ? plecaSigla : '--'}</span>
          </div>
          {isStep5Active && numericQty > 0 && (
            <span className={styles.quantityWords}>
              ✦ {numeroATexto(numericQty)} {unidadNombreCompleto.toLowerCase()}
            </span>
          )}
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            6. Precio acordado por cada {empaqueNombre} ($) <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            name="precioCompra"
            type="text"
            inputMode="numeric"
            disabled={!isStep6Active}
            placeholder="0"
            value={isStep6Active && formData.precioCompra ? String(formData.precioCompra).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              handleChange({ target: { name: 'precioCompra', value: raw } });
            }}
            onKeyDown={(e) => {
              if (e.key === '-') e.preventDefault();
            }}
            className={`${modalStyles.input} ${styles.priceInputField} ${!isStep6Active ? styles.inputDisabled : ''}`}
            required
          />
          {isStep6Active && numericPrice > 0 && (
            <span className={styles.priceWords}>
              ✦ {montoATextoPesos(numericPrice)}
            </span>
          )}
        </div>
      </div>

      <SupplierPriceTaxCard formData={formData} unidadFinal={unidadFinal} />
    </div>
  );
}
