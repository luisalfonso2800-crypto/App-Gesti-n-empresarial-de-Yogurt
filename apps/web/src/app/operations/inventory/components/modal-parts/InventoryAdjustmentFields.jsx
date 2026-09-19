/**
 * @file InventoryAdjustmentFields.jsx
 * @module operations/inventory/components/modal-parts
 * @description Campos del formulario de ajuste de inventario: tipo, cantidad, costo unitario y motivo.
 * @responsibility Renderizar los controles de ajuste de inventario y sus avisos de unidad de medida.
 * @usedBy apps/web/src/app/operations/inventory/components/GlobalInventoryAdjustmentModal.jsx
 * @dependencies react, @/components/ui/inputs/CurrencySmartInput, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import CurrencySmartInput from '@/components/ui/inputs/CurrencySmartInput';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../adjustment-modal.module.css';

export default function InventoryAdjustmentFields({
  tipo,
  setTipo,
  cantidad,
  setCantidad,
  costoUnitario,
  setCostoUnitario,
  motivo,
  setMotivo,
  selectedInsumo,
  unidadBase,
  isCostRequired,
  hasSubmitted = false,
  isCantidadMissing = false,
  isCostoMissing = false,
  isMotivoMissing = false
}) {
  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Tipo de Ajuste <span className={styles.requiredAsterisk}>*</span>
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={modalStyles.select}
          required
        >
          <option value="CARGA_INICIAL">Carga de Saldo Inicial (+)</option>
          <option value="AJUSTE_POSITIVO">Ajuste Positivo (+)</option>
          <option value="AJUSTE_NEGATIVO">Ajuste Negativo (-)</option>
          <option value="MERMA_DESPERDICIO">Merma / Desperdicio (-)</option>
        </select>
      </div>

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Cantidad {selectedInsumo ? `(${unidadBase})` : ''} <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input
          type="number"
          min="0.001"
          step="any"
          value={cantidad}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || !val.includes('-')) {
              setCantidad(val);
            }
          }}
          placeholder="0"
          className={`${modalStyles.input} ${hasSubmitted && isCantidadMissing ? styles.inputErrorBorder : ''}`}
          required
        />
        {hasSubmitted && isCantidadMissing && (
          <span className={styles.fieldErrorText}>La cantidad debe ser mayor a 0</span>
        )}
        {selectedInsumo && (
          <span className={styles.unitHelperText}>
            Unidad técnica de medida del insumo: <strong>{unidadBase}</strong>
          </span>
        )}
      </div>

      {isCostRequired && (
        <CurrencySmartInput
          label={`Costo Unitario por ${unidadBase}`}
          value={costoUnitario}
          onChange={(e) => setCostoUnitario(e.target.value)}
          placeholder="Ej: 25.000"
          required={isCostRequired}
          name="costoUnitario"
          error={hasSubmitted && isCostoMissing ? 'El costo unitario debe ser mayor a $ 0' : undefined}
        />
      )}

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Motivo / Documento Origen {['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(tipo) && (
            <span className={styles.requiredAsterisk}>*</span>
          )}
        </label>
        <input
          type="text"
          value={motivo}
          onChange={(e) => setMotivo((e.target.value ?? '').toUpperCase())}
          placeholder={tipo === 'CARGA_INICIAL' ? 'EJ: INVENTARIO FÍSICO INICIAL' : 'EJ: CONTEO FÍSICO, ENVASE DAÑADO'}
          className={`${modalStyles.input} ${styles.uppercaseInput} ${hasSubmitted && isMotivoMissing ? styles.inputErrorBorder : ''}`}
          required={['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(tipo)}
        />
        {hasSubmitted && isMotivoMissing && (
          <span className={styles.fieldErrorText}>El motivo es obligatorio para salidas y mermas</span>
        )}
      </div>
    </>
  );
}
