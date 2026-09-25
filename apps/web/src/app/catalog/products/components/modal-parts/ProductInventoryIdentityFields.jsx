import React, { useState } from 'react';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

export function ProductInventoryIdentityFields({
  formData,
  handleInputChange,
  handleChange,
  isGranel,
  isLocked = false,
  codigoSugerido = ''
}) {
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const displayCode = formData.codigo ?? (isEditingCode ? '' : codigoSugerido);

  const handleStartEdit = () => {
    setShowWarning(true);
  };

  const handleConfirmEdit = () => {
    setShowWarning(false);
    setIsEditingCode(true);
  };

  const handleCancelEdit = () => {
    setShowWarning(false);
  };

  return (
    <>
      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Código Interno {isEditingCode ? '(Manual)' : '(Generado por Sistema)'}
          </label>
          <div className={styles.codeProtectedContainer}>
            <input 
              name="codigo" 
              value={displayCode} 
              onChange={handleInputChange} 
              placeholder={codigoSugerido || 'Ej: YOG-FRE-500'}
              readOnly={!isEditingCode}
              disabled={isLocked}
              className={`${styles.codeProtectedInput} ${styles.uppercaseInput}`} 
            />
            {!isLocked && (
              <>
                <div className={styles.codeDivider} />
                {isEditingCode ? (
                  <button
                    type="button"
                    className={styles.btnEditCode}
                    onClick={() => setIsEditingCode(false)}
                    title="Volver a bloquear código interno"
                  >
                    🔒
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.btnEditCode}
                    onClick={handleStartEdit}
                    title="Editar código manualmente de forma excepcional"
                  >
                    ✎
                  </button>
                )}
              </>
            )}
          </div>
          {showWarning && (
            <div className={styles.codeWarningBox}>
              ⚠️ <strong>Advertencia:</strong> Este código es generado automáticamente para evitar duplicados y trazabilidad interna. Modificarlo manualmente puede causar inconsistencias. ¿Deseas editarlo excepcionalmente?
              <div className={styles.codeWarningActions}>
                <button type="button" className={styles.codeWarningBtnCancel} onClick={handleCancelEdit}>
                  Cancelar
                </button>
                <button type="button" className={styles.codeWarningBtnConfirm} onClick={handleConfirmEdit}>
                  Entendido, Editar
                </button>
              </div>
            </div>
          )}
          <span className={styles.helperText}>
            {isEditingCode ? 'Código personalizado manual.' : 'Protegido. Generado automáticamente según nombre y formato.'}
          </span>
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            {isLocked ? 'Unidad de Venta 🔒' : 'Unidad de Venta'}
          </label>
          <select 
            name="unidadVenta" 
            value={formData.unidadVenta || 'UND'} 
            onChange={handleChange}
            disabled={isLocked}
            className={`${modalStyles.input} ${isLocked ? styles.inputLocked : ''}`}
          >
            <option value="UND">UND (Unidad)</option>
            <option value="LITRO">LITRO</option>
            <option value="KILO">KILO</option>
            <option value="LIBRA">LIBRA</option>
            <option value="DOCENA">DOCENA</option>
          </select>
          {isLocked && <span className={styles.fieldLockedNotice}>🔒 Requiere completar nombre y presentación</span>}
        </div>
      </div>

      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            {isLocked ? 'Stock Mínimo en Cava 🔒' : 'Stock Mínimo en Cava (Alerta de reposición)'}
          </label>
          <input 
            type="number"
            min="0"
            name="stockMinimo" 
            value={formData.stockMinimo ?? '5'} 
            onChange={handleChange} 
            placeholder="5"
            disabled={isLocked}
            className={`${modalStyles.input} ${isLocked ? styles.inputLocked : ''}`} 
          />
          {isLocked && <span className={styles.fieldLockedNotice}>🔒 Requiere completar nombre y presentación</span>}
        </div>
        <div>
          {(isGranel || ['INSUMO_BASE_WIP', 'BASES_LACTEAS', 'DULCES_JALEAS', 'TOPPING_CEREAL'].includes(formData.categoria)) && (
            <div className={styles.wipConceptText}>
              💡 <strong>¿Qué es un Semielaborado (WIP)?</strong> Producto intermedio elaborado en planta para envasado posterior.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
