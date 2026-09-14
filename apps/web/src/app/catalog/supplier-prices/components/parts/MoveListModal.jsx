/**
 * @file MoveListModal.jsx
 * @module catalog/supplier-prices/components/parts
 * @description Modal desacoplado de selección de lista destino para transferencia de insumos cotizados (SRP + CSS Modules).
 * @responsibility Presentar las listas disponibles para mover un insumo y ejecutar la transferencia.
 * @usedBy apps/web/src/app/catalog/supplier-prices/hooks/useCartManager.js, apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies react, @/components/ui/Modal, @/components/ui/Button, ./move-list-modal.module.css
 */
'use client';
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import styles from './move-list-modal.module.css';

export function MoveListModal({
  isOpen,
  onClose,
  pendingItem,
  activeListId,
  lists,
  isMoving,
  onConfirmMove
}) {
  const [selectedTargetList, setSelectedTargetList] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedTargetList('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fromId = pendingItem?.fromListId || activeListId;
  const options = Object.values(lists || {}).filter(
    l => l.id !== fromId && !l.id.startsWith('local-')
  );

  const handleConfirm = () => {
    if (!pendingItem || !selectedTargetList) return;
    const toList = lists[selectedTargetList];
    onConfirmMove(pendingItem.item, fromId, selectedTargetList, toList?.name || 'la lista');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar lista destino"
    >
      <div className={styles.modalBody}>
        <p className={styles.modalText}>
          Selecciona la lista de compra a la que deseas transferir este insumo:
        </p>

        {options.length === 0 ? (
          <div className={styles.emptyStateContainer}>
            <p className={styles.emptyStateTitle}>
              No hay otras listas activas disponibles.
            </p>
            <p className={styles.emptyStateSubtitle}>
              Crea una nueva lista desde el carrito primero.
            </p>
          </div>
        ) : (
          <select
            value={selectedTargetList}
            onChange={e => setSelectedTargetList(e.target.value)}
            className={styles.selectInput}
          >
            <option value="">-- Seleccione una lista --</option>
            {options.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        )}

        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={isMoving || !selectedTargetList}
            onClick={handleConfirm}
          >
            {isMoving ? 'Transfiriendo...' : 'Confirmar transferencia'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
