/**
 * @file ProductModalActions.jsx
 * @module catalog/products/components/modal-parts
 * @description Pie de resumen y botones de acción para ProductModal.
 * @responsibility Renderizar banner dinámico de resumen y botones cancelar/guardar.
 */
import React from 'react';
import { SubmitButton } from '@/components/ui/SmartModal';
import { formatCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

export function ProductModalActions({
  editingItem,
  formData,
  presentations = [],
  precioVentaNum = 0,
  isSubmitDisabled,
  submitTitle,
  isSubmitting,
  onClose
}) {
  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>Observaciones</label>
        <input name="observaciones" value={formData.observaciones ?? ''} onChange={onClose ? undefined : undefined} className={`${modalStyles.input} ${styles.uppercaseInput}`} readOnly />
      </div>

      <label className={styles.activeCheckboxLabel}>
        <input type="checkbox" name="activo" checked={formData.activo} readOnly />
        <span className={styles.activeCheckboxText}>Producto Activo</span>
      </label>

      {formData.nombre && (
        <div className={styles.productSummaryBanner}>
          <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el producto <strong>{formData.nombre}</strong>{formData.idPresentacion ? <> (en presentación <strong>{presentations.find(p => String(p.id) === String(formData.idPresentacion))?.nombre || 'desconocida'}</strong>)</> : null}{formData.canalVenta ? <>, destinado al canal <strong>{formData.canalVenta}</strong></> : null}{precioVentaNum > 0 ? <>, con precio sugerido de <strong>{formatCurrency(formData.precioVenta)}</strong></> : null}.
        </div>
      )}

      <div className={modalStyles.actions}>
        <button type="button" onClick={onClose} className={modalStyles.btnCancel}>Cancelar</button>
        <SubmitButton isSubmitting={isSubmitting} text="Guardar Producto" disabled={isSubmitDisabled} title={submitTitle} className={isSubmitDisabled ? styles.btnSubmitDisabled : ''} />
      </div>
    </>
  );
}
