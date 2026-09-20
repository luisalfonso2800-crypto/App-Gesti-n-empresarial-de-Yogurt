/**
 * @file ProductWholesaleSection.jsx
 * @module catalog/products/components/modal-parts
 * @description Sección de tarifa y escala mayorista con cálculo de descuento en tiempo real.
 * @responsibility Renderizar los controles de precio mayorista, cantidad mínima y píldoras de descuento porcentual (SRP < 120 líneas).
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

const DISCOUNT_PERCENTAGES = [10, 20, 25, 30, 40];

export function ProductWholesaleSection({ formData, handleChange, precioVentaNum }) {
  const precioMayoristaNum = Number(String(formData.precioMayorista || '').replace(/\D/g, '')) || 0;
  const selectedDiscount = formData.descuentoMayoristaPorcentaje ? Number(formData.descuentoMayoristaPorcentaje) : null;

  const handlePillClick = (percent) => {
    const calcMayorista = Math.round(precioVentaNum * (1 - percent / 100));
    handleChange({ target: { name: 'precioMayorista', value: String(calcMayorista) } });
    handleChange({ target: { name: 'descuentoMayoristaPorcentaje', value: percent } });
  };

  const handleManualPriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    handleChange({ target: { name: 'precioMayorista', value: raw } });
    // Si el usuario escribe manualmente, desmarcar las píldoras de porcentaje
    handleChange({ target: { name: 'descuentoMayoristaPorcentaje', value: '' } });
  };

  const ahorroUnidad = precioVentaNum > precioMayoristaNum ? precioVentaNum - precioMayoristaNum : 0;
  const pctReal = precioVentaNum > 0 && precioMayoristaNum > 0 && precioVentaNum >= precioMayoristaNum
    ? Math.round(((precioVentaNum - precioMayoristaNum) / precioVentaNum) * 100)
    : 0;

  return (
    <div className={styles.wholesaleCard}>
      <div className={styles.wholesaleHeader}>
        <span>📦</span> Tarifa y Escala Mayorista (B2B / Distribuidores)
      </div>

      <div className={styles.wholesaleGrid}>
        {/* Cantidad Mínima Mayorista */}
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Cantidad Mínima Mayorista (Unds/Lts)</label>
          <input
            type="number"
            min="1"
            name="cantidadMinimaMayorista"
            value={formData.cantidadMinimaMayorista ?? 12}
            onChange={handleChange}
            placeholder="12"
            className={modalStyles.input}
          />
        </div>

        {/* Precio Mayorista */}
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Precio Mayorista ($)</label>
          <input
            type="text"
            inputMode="numeric"
            min="0"
            name="precioMayorista"
            placeholder="0"
            value={formData.precioMayorista ? String(formData.precioMayorista).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
            onChange={handleManualPriceChange}
            className={modalStyles.input}
          />
          {Boolean(precioMayoristaNum > 0) && (
            <span className={styles.currencyInWordsText}>
              ✦ {montoATextoPesos(precioMayoristaNum)}
            </span>
          )}
        </div>
      </div>

      {/* Selector de Descuento Rápido */}
      <div>
        <label className={modalStyles.label}>Descuento Rápido sobre Precio Venta:</label>
        <div className={discountPillsContainerClass(styles)}>
          {DISCOUNT_PERCENTAGES.map((pct) => (
            <button
              key={pct}
              type="button"
              className={`${styles.discountPill} ${selectedDiscount === pct ? styles.discountPillActive : ''}`}
              onClick={() => handlePillClick(pct)}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Mensaje de ayuda en texto natural */}
      {Boolean(precioMayoristaNum > 0 && precioVentaNum > 0) && (
        <div className={styles.wholesaleNaturalText}>
          ✦ <strong>Escala activa:</strong> Pedidos desde {formData.cantidadMinimaMayorista || 12} unidades a <strong>$ {precioMayoristaNum.toLocaleString('es-CO')}/und</strong> ({pctReal}% de rebaja, ahorro de $ {ahorroUnidad.toLocaleString('es-CO')} por unidad frente al precio de venta).
        </div>
      )}
    </div>
  );
}

function discountPillsContainerClass(styles) {
  return styles.discountPillsContainer;
}
