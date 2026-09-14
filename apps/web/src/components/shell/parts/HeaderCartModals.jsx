/**
 * @file HeaderCartModals.jsx
 * @module components/shell/parts
 * @description Modales auxiliares para renombrar y eliminar listas de compra desde el Header.
 * @responsibility Renderizar diálogos de confirmación Poka-Yoke con estilos desacoplados.
 * @usedBy apps/web/src/components/shell/Header.jsx
 * @dependencies react, @/components/ui/SmartModal, @/components/ui/Button
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { Button } from '@/components/ui/Button';
import styles from '../header.module.css';

export default function HeaderCartModals({
  editNameModalOpen,
  setEditNameModalOpen,
  editNameValue,
  setEditNameValue,
  editNameError,
  setEditNameError,
  isSubmittingEditName,
  handleEditNameSubmit,
  listToDelete,
  setListToDelete,
  deleteError,
  setDeleteError,
  isSubmittingDelete,
  handleDeleteList
}) {
  return (
    <>
      <SmartModal 
        isOpen={!!editNameModalOpen} 
        onClose={() => { setEditNameModalOpen(null); setEditNameError(null); }} 
        title="EDITAR NOMBRE DE LISTA"
      >
        <div className={styles.modalFormLayout}>
          {editNameError && (
            <div className={styles.modalErrorMessage}>
              ⚠️ {editNameError}
            </div>
          )}

          <label className={styles.modalLabel}>NUEVO NOMBRE PERSONALIZADO:</label>
          <input 
            type="text" 
            value={editNameValue} 
            onChange={(e) => {
              setEditNameValue(e.target.value.toUpperCase());
              setEditNameError(null);
            }}
            placeholder="EJ. PROVEEDORES LOCALES"
            className={styles.modalTextInput}
          />

          {editNameValue.trim() && (
            <div className={styles.modalSummaryBanner}>
              <strong>Acción a realizar:</strong> Se actualizará el nombre de la lista a:{' '}
              <code>LISTA DE COMPRA - {editNameValue.trim().toUpperCase()} - {new Date().toLocaleDateString()}</code>
            </div>
          )}

          <div className={styles.modalActionsRow}>
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
        isOpen={!!listToDelete} 
        onClose={() => { setListToDelete(null); setDeleteError(null); }} 
        title="DESCARTAR LISTA"
      >
        <div className={styles.modalFormLayout}>
          {deleteError && (
            <div className={styles.modalErrorMessage}>
              ⚠️ {deleteError}
            </div>
          )}

          <p className={styles.modalWarningText}>
            ¿Estás seguro que deseas eliminar esta lista de compra? Esta acción no se puede deshacer.
          </p>

          <div className={styles.modalWarningBanner}>
            <strong>Advertencia Poka-Yoke:</strong> Se eliminará la lista activa junto con todos los insumos que contiene.
          </div>

          <div className={styles.modalActionsRow}>
            <Button variant="secondary" onClick={() => { setListToDelete(null); setDeleteError(null); }}>
              Cancelar
            </Button>
            <SubmitButton 
              variant="danger" 
              onClick={handleDeleteList}
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
