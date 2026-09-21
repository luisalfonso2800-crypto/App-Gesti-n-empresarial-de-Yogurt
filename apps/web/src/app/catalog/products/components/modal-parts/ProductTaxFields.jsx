/**
 * @file ProductTaxFields.jsx
 * @module catalog/products/components/modal-parts
 * @description Configuración tributaria de IVA del producto (SRP < 100 líneas).
 * @responsibility Selección de tipo de impuesto, tarifa y si el precio incluye IVA.
 * @usedBy apps/web/src/app/catalog/products/components/ProductModal.jsx
 * @dependencies react, @/components/ui/SmartModal.module.css, ../product-modal.module.css
 */
'use client';

import React from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

const TIPOS_IMPUESTO = [
  { id: 'GRAVADO', label: 'GRAVADO (19%)' },
  { id: 'EXENTO', label: 'EXENTO (0%)' },
  { id: 'EXCLUIDO', label: 'EXCLUIDO (0%)' }
];

export function ProductTaxFields({ formData, handleChange, showPricingFields = true }) {
  if (!showPricingFields) return null;

  const currentTipo = formData.tipoImpuesto || 'GRAVADO';
  const isGravado = currentTipo === 'GRAVADO';

  const handleTipoChange = (e) => {
    const nuevoTipo = e.target.value;
    handleChange({ target: { name: 'tipoImpuesto', value: nuevoTipo } });
    if (nuevoTipo === 'EXCLUIDO' || nuevoTipo === 'EXENTO') {
      handleChange({ target: { name: 'tarifaIva', value: 0 } });
    } else {
      handleChange({ target: { name: 'tarifaIva', value: 19 } });
    }
  };

  return (
    <div className={styles.taxSectionCard}>
      <div className={styles.taxSectionHeader}>
        <span>🏛️</span> Configuración Tributaria (IVA)
      </div>

      <div className={styles.taxGrid}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Tipo de Impuesto <span className={styles.requiredAsterisk}>*</span>
          </label>
          <select
            name="tipoImpuesto"
            value={currentTipo}
            onChange={handleTipoChange}
            className={modalStyles.input}
            required
          >
            {TIPOS_IMPUESTO.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Tarifa IVA (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            name="tarifaIva"
            value={isGravado ? (formData.tarifaIva ?? 19) : 0}
            onChange={handleChange}
            disabled={!isGravado}
            className={modalStyles.input}
          />
        </div>
      </div>

      <div className={styles.taxCheckboxWrapper}>
        <label className={styles.activeCheckboxLabel}>
          <input
            type="checkbox"
            name="precioIncluyeIva"
            checked={formData.precioIncluyeIva ?? true}
            onChange={handleChange}
          />
          <span className={styles.activeCheckboxText}>
            El Precio de Venta fijado <strong>ya incluye IVA</strong>
          </span>
        </label>
      </div>
    </div>
  );
}
