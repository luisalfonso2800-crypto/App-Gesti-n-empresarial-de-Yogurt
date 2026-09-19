/**
 * @file SupplierPriceTaxFields.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Configuración de IVA y desglose fiscal reactivo.
 * @responsibility Renderizar los controles de IVA y la previsualización de 3 líneas (base, iva, costo final).
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 * @dependencies react, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supplier-price-modal.module.css';

export default function SupplierPriceTaxFields({ formData, handleChange, insumoUnidadBase = '' }) {
  const unidadLabel = insumoUnidadBase || 'und';
  const subtotalBase = Number(formData.costoBaseSinIva || 0);
  const montoIva = Number(formData.montoIvaCalculado || 0);
  const costoFinal = Number(formData.costoUnidadBase || 0);

  return (
    <div className={styles.taxSection}>
      <div className={styles.taxHeaderRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="tieneIva"
            checked={Boolean(formData.tieneIva)}
            onChange={handleChange}
          />
          <span className={styles.checkboxText}><strong>Aplica IVA</strong></span>
        </label>

        {formData.tieneIva && (
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="precioIncluyeIva"
              checked={Boolean(formData.precioIncluyeIva)}
              onChange={handleChange}
            />
            <span className={styles.checkboxText}>Precio incluye IVA</span>
          </label>
        )}
      </div>

      {formData.tieneIva && (
        <div className={styles.taxInputsGrid}>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Tasa IVA (%)</label>
            <input
              name="porcentajeIva"
              type="text"
              inputMode="decimal"
              placeholder="19"
              value={formData.porcentajeIva ?? '19'}
              onChange={(e) => {
                let val = e.target.value.replace(/[^0-9.]/g, '');
                if ((val.match(/\./g) || []).length > 1) val = val.replace(/\.+$/, '');
                handleChange({ target: { name: 'porcentajeIva', value: val } });
              }}
              className={modalStyles.input}
            />
          </div>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Modalidad Fiscal</label>
            <select
              name="precioIncluyeIva"
              value={formData.precioIncluyeIva ? 'true' : 'false'}
              onChange={(e) => handleChange({ target: { name: 'precioIncluyeIva', value: e.target.value === 'true', type: 'checkbox', checked: e.target.value === 'true' } })}
              className={modalStyles.input}
            >
              <option value="true">Precio incluye IVA</option>
              <option value="false">IVA adicional (+ tasa)</option>
            </select>
          </div>
        </div>
      )}

      {/* Previsualización reactiva de 3 líneas */}
      <div className={styles.taxBreakdownCard}>
        <div className={styles.taxBreakdownRow}>
          <span>Subtotal Base (Sin IVA):</span>
          <strong>${subtotalBase.toLocaleString('es-CO', { minimumFractionDigits: subtotalBase % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}</strong>
        </div>
        <div className={styles.taxBreakdownRow}>
          <span>Monto IVA ({formData.tieneIva ? `${formData.porcentajeIva || 19}%` : 'Exento'}):</span>
          <strong>${montoIva.toLocaleString('es-CO', { minimumFractionDigits: montoIva % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}</strong>
        </div>
        <div className={styles.taxBreakdownFinal}>
          <span>Costo por Unidad Base Final:</span>
          <span className={styles.costSuccessText}>${costoFinal.toLocaleString('es-CO', { minimumFractionDigits: costoFinal % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })} / {unidadLabel}</span>
        </div>
        {!formData.tieneIva && (
          <div className={styles.taxNoteExempt}>
            ✦ Tarifa sin IVA: Este insumo no genera impuestos adicionales.
          </div>
        )}
      </div>
    </div>
  );
}
