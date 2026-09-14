/**
 * @file PurchasesModals.jsx
 * @module operations/purchases/components
 * @description Modales de renombrado y eliminación para órdenes de compras activas.
 * @responsibility Renderizar diálogos Poka-Yoke con CSS Modules para compras.
 * @usedBy apps/web/src/app/operations/purchases/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/Button
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import styles from '../purchases.module.css';

export default function PurchasesModals({
  editNameModalOpen,
  setEditNameModalOpen,
  editNameValue,
  setEditNameValue,
  editNameError,
  setEditNameError,
  isSubmittingEditName,
  handleEditNameSubmit,
  deleteModalOpen,
  setDeleteModalOpen,
  deleteError,
  setDeleteError,
  isSubmittingDelete,
  executeDelete
}) {
  return (
    <>
      <SmartModal 
        isOpen={!!editNameModalOpen} 
        onClose={() => { setEditNameModalOpen(null); setEditNameError(null); }} 
        title="EDITAR NOMBRE DE LISTA"
      >
        <div className={styles.modalLayout}>
          {editNameError && (
            <div className={styles.modalErrorBadge}>
              ⚠️ {editNameError}
            </div>
          )}

          <label className={styles.modalInputLabel}>NUEVO NOMBRE PERSONALIZADO:</label>
          <input 
            type="text" 
            value={editNameValue} 
            onChange={(e) => {
              setEditNameValue(e.target.value.toUpperCase());
              setEditNameError(null);
            }}
            placeholder="EJ. PROVEEDORES LOCALES"
            className={styles.modalInputText}
          />

          {editNameValue.trim() && (
            <div className={styles.modalSuccessBanner}>
              <strong>Acción a realizar:</strong> Se renombrará la orden a:{' '}
              <code>LISTA DE COMPRA - {editNameValue.trim().toUpperCase()} - {new Date().toLocaleDateString()}</code>
            </div>
          )}

          <div className={styles.modalFooterActions}>
            <Button variant="secondary" onClick={() => { setEditNameModalOpen(null); setEditNameError(null); }}>
              Cancelar
            </Button>
            <SubmitButton
              onClick={handleEditNameSubmit}
              loading={isSubmittingEditName}
              disabled={!editNameValue.trim() || isSubmittingEditName}
              missingFields={!editNameValue.trim() ? ['Nuevo nombre personalizado'] : []}
            >
              Guardar Nombre
            </SubmitButton>
          </div>
        </div>
      </SmartModal>

      <SmartModal 
        isOpen={!!deleteModalOpen} 
        onClose={() => { setDeleteModalOpen(null); setDeleteError(null); }} 
        title="ELIMINAR LISTA EN RUTA"
      >
        <div className={styles.modalLayout}>
          {deleteError && (
            <div className={styles.modalErrorBadge}>
              ⚠️ {deleteError}
            </div>
          )}

          <p className={styles.modalParagraph}>
            ¿Estás seguro que deseas eliminar la lista seleccionada? Esta acción borrará la orden activa y no se puede deshacer.
          </p>

          <div className={styles.modalDangerBanner}>
            <strong>Advertencia Poka-Yoke:</strong> Se eliminará permanentemente la orden de compra en ruta. Los ítems asociados no consolidados se descartarán.
          </div>

          <div className={styles.modalFooterActions}>
            <Button variant="secondary" onClick={() => { setDeleteModalOpen(null); setDeleteError(null); }}>
              Cancelar
            </Button>
            <SubmitButton 
              variant="danger" 
              onClick={executeDelete}
              loading={isSubmittingDelete}
              disabled={isSubmittingDelete}
            >
              Eliminar Lista
            </SubmitButton>
          </div>
        </div>
      </SmartModal>
    </>
  );
}
