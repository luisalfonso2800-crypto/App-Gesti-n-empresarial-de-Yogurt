/**
 * @file DensityAssistant.jsx
 * @module components/catalog/parts
 * @description Asistente de densidad con botón para desbloquear edición manual con modal de confirmación (< 130 líneas).
 */
import React, { useState } from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../supply-modal.module.css';
import { DensityConfirmModal } from './DensityConfirmModal';
import { DensityCalculatorBox } from './DensityCalculatorBox';

const PRESETS = [
  { label: 'Agua (1.0)', value: 1.0 },
  { label: 'Leche (1.03)', value: 1.03 },
  { label: 'Yogur (~1.06)', value: 1.06 },
  { label: 'Miel/Jalea (1.42)', value: 1.42 }
];

export function DensityAssistant({ formData, handleChange, disabled = false }) {
  const [showCalc, setShowCalc] = useState(false);
  const [isManualUnlocked, setIsManualUnlocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentDens = parseFloat(formData.densidad) || 1.0;

  const handleApplyCalc = (mlVal, pVal) => {
    const ml = parseFloat(mlVal);
    const p = parseFloat(pVal);
    if (ml > 0 && p > 0) {
      handleChange({ target: { name: 'densidad', value: String(Math.round((p / ml) * 100) / 100) } });
    }
  };

  const handleUnlockClick = () => {
    if (isManualUnlocked) {
      setIsManualUnlocked(false);
    } else {
      setShowConfirmModal(true);
    }
  };

  return (
    <div className={`${styles.densityAssistantCard} ${disabled ? styles.fieldDisabled : ''}`}>
      <div className={styles.densityHeaderRow}>
        <div className={styles.densityPresetsRow}>
          <span className={styles.densityPresetsLabel}>Presets rápidos:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              disabled={disabled}
              onClick={() => handleChange({ target: { name: 'densidad', value: String(p.value) } })}
              className={`${styles.densityPresetChip} ${Number(formData.densidad) === p.value ? styles.densityPresetChipActive : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowCalc(!showCalc)}
          className={styles.densityToggleBtn}
        >
          {showCalc ? '✕ Cerrar calculadora' : '⚖️ ¿No conoces la densidad? Calcúlala con tu balanza'}
        </button>
      </div>

      {showCalc && (
        <DensityCalculatorBox disabled={disabled} onApplyCalc={handleApplyCalc} />
      )}

      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Densidad (g/ml)</label>
        <div className={styles.densityInputGroupContainer}>
          <input
            name="densidad"
            type="number"
            step="0.01"
            min="0.5"
            max="2.5"
            readOnly={!isManualUnlocked}
            disabled={disabled}
            value={formData.densidad ?? '1.0'}
            onChange={handleChange}
            placeholder="1.0"
            className={`${modalStyles.input} ${styles.numberRightInput} ${styles.densityInputField} ${!isManualUnlocked ? styles.inputReadOnly : ''}`}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={handleUnlockClick}
            className={styles.densityEditBtn}
            title={isManualUnlocked ? 'Bloquear campo' : 'Modificar manualmente'}
          >
            {isManualUnlocked ? '🔒 Bloquear' : '✏️ Editar'}
          </button>
        </div>
        <span className={styles.densityContextFoot}>
          ✦ 1 Litro de este producto pesará aprox. {Math.round(currentDens * 1000).toLocaleString('es-CO')} g
        </span>
      </div>

      <DensityConfirmModal
        isOpen={showConfirmModal}
        onConfirm={() => {
          setIsManualUnlocked(true);
          setShowConfirmModal(false);
        }}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
}
