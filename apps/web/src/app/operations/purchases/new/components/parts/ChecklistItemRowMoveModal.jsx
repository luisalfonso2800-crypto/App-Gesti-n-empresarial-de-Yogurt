/**
 * @file ChecklistItemRowMoveModal.jsx
 * @module operations/purchases/new/parts
 * @description Modal para transferir un ítem de checklist a otra orden de compra activa.
 * @responsibility Selección de lista destino, validación Poka-Yoke y feedback de transferencia.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx
 * @dependencies React, @/components/ui/SmartModal, @/components/ui/Button, ../../new-purchase.module.css
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import styles from '../../new-purchase.module.css';

export default function ChecklistItemRowMoveModal({
  isOpen,
  onClose,
  item,
  availableLists,
  lists,
  selectedTargetList,
  setSelectedTargetList,
  moveError,
  setMoveError,
  isMoving,
  handleMoveList
}) {
  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="MOVER A OTRA LISTA"
    >
      <div className={styles.moveModalContainer}>
        {moveError && (
          <div className={styles.moveErrorBox}>
            ⚠️ {moveError}
          </div>
        )}

        <p className={styles.moveModalText}>
          Selecciona la lista de compra a la que deseas transferir este insumo (<strong>{item.insumoData?.nombre || item.nombre}</strong>):
        </p>
        
        {availableLists.length === 0 ? (
          <div className={styles.moveEmptyState}>
            <p className={styles.moveEmptyTitle}>No hay otras listas activas disponibles.</p>
            <p className={styles.moveEmptySub}>Crea una nueva lista desde el carrito primero.</p>
          </div>
        ) : (
          <select 
            value={selectedTargetList} 
            onChange={e => {
              setSelectedTargetList(e.target.value);
              setMoveError(null);
            }}
            className={styles.moveListSelect}
          >
            <option value="">-- SELECCIONE UNA LISTA DESTINO --</option>
            {availableLists.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        )}

        {/* Resumen Poka-Yoke */}
        {selectedTargetList && (
          <div className={styles.moveSuccessBox}>
            <strong>Acción a realizar:</strong> Se transferirá el insumo <code>{item.insumoData?.nombre || item.nombre}</code> a la lista <code>{lists[selectedTargetList]?.name}</code>.
          </div>
        )}

        <div className={styles.moveModalActions}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <SubmitButton
            onClick={handleMoveList}
            isSubmitting={isMoving}
            disabled={isMoving || !selectedTargetList || availableLists.length === 0}
            text="Confirmar Transferencia"
            processingText="Transfiriendo..."
          />
        </div>
      </div>
    </SmartModal>
  );
}
