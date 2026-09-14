/**
 * @file FormPhaseStickyBar.jsx
 * @module operations/purchases/new/parts
 * @description Barra superior fija para acciones rápidas, visualización de total y confirmación de compra.
 * @responsibility Navegación, total en pesos y letras, adición de fila y disparador de guardado.
 * @usedBy apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
 * @dependencies React, @/utils/numberToWords, ../../new-purchase.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import styles from '../../new-purchase.module.css';

export default function FormPhaseStickyBar({
  isDirectPurchase,
  router,
  setPhase,
  generatedId,
  totalConFlete,
  addRow,
  handleConfirmar,
  isSubmitting,
  detallesCount
}) {
  return (
    <div className={styles.stickyTopBar}>
      <button 
        type="button" 
        onClick={() => isDirectPurchase ? router.push('/operations/purchases') : setPhase(1)} 
        className={`${styles.cancelBtn} ${styles.stickyCancelBtn}`}
      >
        {isDirectPurchase ? '← Volver a Compras' : '← Volver a Checklist'}
      </button>
      <h2 className={styles.stickyTitle}>
        {isDirectPurchase ? 'Nueva Compra Directa' : `Registro de Compras Adicionales (En Ruta) — ${generatedId}`}
      </h2>
      <div className={styles.stickyTotalBox}>
        <div className={styles.stickyTotalAmount}>
          Total: ${totalConFlete.toLocaleString('es-CO')}
        </div>
        {totalConFlete > 0 && (
          <div className={styles.stickyTotalInWords}>
            ✦ {montoATextoPesos(totalConFlete)}
          </div>
        )}
      </div>
      <button 
        type="button" 
        className={`${styles.addBtn} ${styles.stickyAddBtn}`} 
        onClick={addRow}
      >
        + Añadir Fila
      </button>
      <button
        type="button"
        className={`${styles.saveBtn} ${styles.stickySaveBtn} ${detallesCount === 0 ? styles.stickySaveBtnDisabled : ''}`}
        onClick={handleConfirmar}
        disabled={isSubmitting || detallesCount === 0}
      >
        {isSubmitting 
          ? (isDirectPurchase ? 'Guardando...' : 'Confirmando...') 
          : (isDirectPurchase ? 'Guardar y Registrar Compra' : 'Confirmar e Incorporar a la Orden')}
      </button>
    </div>
  );
}
