/**
 * @file SupplierPricePresentationFields.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Pasos 3 y 4: Presentación comercial y unidad de medida autorizada (en una sola fila).
 * @responsibility Implementar la selección de presentación y unidad base (< 110 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx
 */
'use client';

import React, { useState } from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supplier-price-modal.module.css';

export const PRESENTACIONES_CATALOGO = [
  'BOLSA', 'BULTO', 'GARRAFA', 'CAJA', 'CANASTILLA', 'BOTELLA', 'FRASCO', 'TAMBOR', 'PAQUETE'
];

export const UNIDADES_AUTORIZADAS = [
  { value: 'kg', label: 'Kilogramos', nombreCompleto: 'Kilogramos', sigla: 'kg' },
  { value: 'g', label: 'Gramos', nombreCompleto: 'Gramos', sigla: 'g' },
  { value: 'L', label: 'Litros', nombreCompleto: 'Litros', sigla: 'L' },
  { value: 'ml', label: 'Mililitros', nombreCompleto: 'Mililitros', sigla: 'ml' },
  { value: 'und', label: 'Unidades', nombreCompleto: 'Unidades', sigla: 'und' }
];

export default function SupplierPricePresentationFields({ formData, handleChange, isStep3Active, isStep4Active }) {
  const [esOtraPresentacion, setEsOtraPresentacion] = useState(
    formData.presentacionCompra && !PRESENTACIONES_CATALOGO.includes(formData.presentacionCompra.split(' ')[0])
  );

  return (
    <div className={styles.twoColumnsRow}>
      {/* Paso 3: Presentación Comercial */}
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          3. Presentación Comercial <span className={styles.requiredAsterisk}>*</span>
        </label>
        {!esOtraPresentacion ? (
          <select
            name="presentacionSelect"
            disabled={!isStep3Active}
            value={formData.presentacionCompra?.split(' ')[0] || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'OTRA') {
                setEsOtraPresentacion(true);
                handleChange({ target: { name: 'presentacionCompra', value: '' } });
              } else {
                handleChange({ target: { name: 'presentacionCompra', value: val } });
              }
            }}
            className={`${modalStyles.input} ${!isStep3Active ? styles.inputDisabled : ''}`}
          >
            <option value="">Seleccione empaque...</option>
            {PRESENTACIONES_CATALOGO.map(pres => (
              <option key={pres} value={pres}>{pres}</option>
            ))}
            <option value="OTRA">OTRA...</option>
          </select>
        ) : (
          <div className={styles.otraInputRow}>
            <input
              name="presentacionCompra"
              disabled={!isStep3Active}
              value={formData.presentacionCompra ?? ''}
              onChange={handleChange}
              placeholder="Nombre presentación (ej: CUBETA)"
              className={`${modalStyles.input} ${styles.uppercaseInput} ${!isStep3Active ? styles.inputDisabled : ''}`}
              required
            />
            <button
              type="button"
              className={styles.backToSelectBtn}
              onClick={() => {
                setEsOtraPresentacion(false);
                handleChange({ target: { name: 'presentacionCompra', value: '' } });
              }}
              title="Volver a lista"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Paso 4: Unidad de Medida */}
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          4. Unidad de Medida <span className={styles.requiredAsterisk}>*</span>
        </label>
        <select
          name="unidadPresentacion"
          disabled={!isStep4Active}
          value={formData.unidadPresentacion ?? ''}
          onChange={handleChange}
          className={`${modalStyles.input} ${!isStep4Active ? styles.inputDisabled : ''}`}
          required
        >
          <option value="">Seleccione unidad...</option>
          {UNIDADES_AUTORIZADAS.map(u => (
            <option key={u.value} value={u.value}>{u.nombreCompleto} ({u.sigla})</option>
          ))}
        </select>
      </div>
    </div>
  );
}
