/**
 * @file CartToastMessage.jsx
 * @module catalog/supplier-prices/components/parts
 * @description Mensaje con acción de cambio de lista para el toast de compras (Cero inline styles).
 * @responsibility Renderizar texto informativo y botón interactivo de transferencia de lista en el toast.
 * @usedBy apps/web/src/app/catalog/supplier-prices/hooks/useCartManager.js
 * @dependencies react, lucide-react, ./move-list-modal.module.css
 */
'use client';
import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import styles from './move-list-modal.module.css';

export function CartToastMessage({
  listName,
  hasMultipleLists,
  isReady,
  isMoving,
  savedItem,
  targetListId,
  onPause,
  onResume,
  onChangeList
}) {
  const isBtnDisabled = !isReady || isMoving;
  const btnClass = `${styles.toastActionBtn} ${isBtnDisabled ? styles.toastActionBtnDisabled : styles.toastActionBtnEnabled}`;

  return (
    <div
      className={styles.toastContent}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
    >
      <span>Añadido a {listName}</span>
      {hasMultipleLists && (
        <button
          type="button"
          disabled={isBtnDisabled}
          onClick={() => isReady && savedItem && onChangeList(savedItem, targetListId)}
          className={btnClass}
        >
          <ArrowRightLeft size={14} />
          {!isReady ? 'Guardando...' : isMoving ? 'Transfiriendo...' : 'Cambiar de lista'}
        </button>
      )}
    </div>
  );
}
