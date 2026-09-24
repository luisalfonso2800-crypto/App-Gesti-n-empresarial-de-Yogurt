/**
 * @file SupplierPriceTaxCard.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Tarjetas de costo unitario proyectado reactivas (Costo Sin IVA y Con IVA).
 * @responsibility Renderizar desglose de costo unitario dual o unitario base (< 70 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/modal-parts/SupplierPriceEquivalenceFields.jsx
 */
'use client';

import React from 'react';
import styles from '../supplier-price-modal.module.css';

export default function SupplierPriceTaxCard({ formData, unidadFinal }) {
  if (!formData.tieneIva) {
    return (
      <div className={styles.costCard}>
        <div className={styles.costHeaderRow}>
          <span className={styles.costLabel}>Costo Unitario Base:</span>
          <span className={`${styles.costValue} ${styles.costValueHighlight}`}>
            {formData.costoUnitarioSinIva ? (
              `$ ${Number(formData.costoUnitarioSinIva).toLocaleString('es-CO', {
                minimumFractionDigits: Number(formData.costoUnitarioSinIva) % 1 !== 0 ? 2 : 0,
                maximumFractionDigits: 2
              })} / ${unidadFinal}`
            ) : `$ 0 / ${unidadFinal}`}
          </span>
        </div>
        <p className={styles.costHelperText}>
          Precio acordado ÷ (Cantidad × Equivalencia) • Sin IVA
        </p>
      </div>
    );
  }

  return (
    <div className={styles.costGridDual}>
      <div className={styles.costCard}>
        <div className={styles.costHeaderRow}>
          <span className={styles.costLabel}>Costo Sin IVA:</span>
          <span className={styles.costValue}>
            {formData.costoUnitarioSinIva ? (
              `$ ${Number(formData.costoUnitarioSinIva).toLocaleString('es-CO', {
                minimumFractionDigits: Number(formData.costoUnitarioSinIva) % 1 !== 0 ? 2 : 0,
                maximumFractionDigits: 2
              })} / ${unidadFinal}`
            ) : `$ 0 / ${unidadFinal}`}
          </span>
        </div>
        <p className={styles.costHelperText}>
          Subtotal base ÷ (Cantidad × Equivalencia)
        </p>
      </div>

      <div className={`${styles.costCard} ${styles.costCardHighlight}`}>
        <div className={styles.costHeaderRow}>
          <span className={styles.costLabel}>Costo Con IVA ({formData.porcentajeIva || 19}%):</span>
          <span className={`${styles.costValue} ${styles.costValueHighlight}`}>
            {formData.costoUnitarioConIva ? (
              `$ ${Number(formData.costoUnitarioConIva).toLocaleString('es-CO', {
                minimumFractionDigits: Number(formData.costoUnitarioConIva) % 1 !== 0 ? 2 : 0,
                maximumFractionDigits: 2
              })} / ${unidadFinal}`
            ) : `$ 0 / ${unidadFinal}`}
          </span>
        </div>
        <p className={styles.costHelperText}>
          Total fiscal ÷ (Cantidad × Equivalencia)
        </p>
      </div>
    </div>
  );
}
