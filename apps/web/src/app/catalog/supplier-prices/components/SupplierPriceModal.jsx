/**
 * @file SupplierPriceModal.jsx
 * @module catalog/supplier-prices/components
 * @description Modal con Cascada Poka-Yoke (6 pasos), Combobox con alta rápida y pleca fija (< 120 líneas).
 */
'use client';

import React, { useState } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './supplier-price-modal.module.css';
import SupplierPriceCombobox from './modal-parts/SupplierPriceCombobox';
import SupplierPricePresentationFields from './modal-parts/SupplierPricePresentationFields';
import SupplierPriceEquivalenceFields from './modal-parts/SupplierPriceEquivalenceFields';
import SupplierPriceTaxFields from './modal-parts/SupplierPriceTaxFields';
import SupplierPriceQuickModals from './modal-parts/SupplierPriceQuickModals';
import { useSupplierPriceForm } from './modal-parts/useSupplierPriceForm';

export function SupplierPriceModal({
  isOpen, onClose, editingItem, onSubmit, allInsumos = [], allProveedores = [],
  onSupplyCreated, onSupplierCreated
}) {
  const {
    formData, isSubmitting, errorMsg, isDirty,
    isSubmitDisabled, submitTitle, handleChange, handleSubmit
  } = useSupplierPriceForm({ isOpen, editingItem, onSubmit, onClose, allInsumos, allProveedores });

  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [initialSupplySearch, setInitialSupplySearch] = useState('');
  const [initialSupplierSearch, setInitialSupplierSearch] = useState('');

  const selectedInsumo = allInsumos.find(i => String(i.id) === String(formData.idInsumo));
  const insumoUnidadBase = selectedInsumo?.unidadBase || selectedInsumo?.Unidad_Base || '';

  const isStep2Active = Boolean(formData.idInsumo);
  const isStep3Active = isStep2Active && Boolean(formData.idProveedor);
  const isStep4Active = isStep3Active && Boolean(formData.presentacionCompra?.trim());
  const isStep5Active = isStep4Active && Boolean(formData.unidadPresentacion?.trim());
  const isStep6Active = isStep5Active && Number(formData.cantidadPresentacion) > 0;

  return (
    <>
      <SmartModal 
        isOpen={isOpen} onClose={onClose} 
        title={editingItem ? 'Editar Precio de Proveedor' : 'Nuevo Precio de Proveedor'}
        isDirty={isDirty} isSubmitting={isSubmitting}
      >
        {errorMsg && (
          <div className={styles.errorMessage}><span>⚠️</span><span>{errorMsg}</span></div>
        )}

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.twoColumnsRow}>
            <SupplierPriceCombobox
              label="1. Insumo" placeholder="Buscar insumo..."
              value={formData.idInsumo}
              items={allInsumos.map(i => {
                const parts = [];
                if (i.marca) parts.push(i.marca);
                const cant = i.contenidoReferencial && Number(i.contenidoReferencial) > 0 ? Number(i.contenidoReferencial).toLocaleString('es-CO') : '';
                const unidad = i.unidadBase || i.unidadMedida || '';
                const empaque = i.empaque || i.presentacion || '';
                if (cant && unidad) {
                  parts.push(`${cant} ${unidad}${empaque ? ` (${empaque})` : ''}`);
                } else if (empaque) {
                  parts.push(empaque);
                } else if (unidad) {
                  parts.push(unidad);
                }
                return {
                  id: i.id,
                  nombre: i.nombre,
                  subtext: parts.join(' • ')
                };
              })}
              onSelect={(item) => handleChange({ target: { name: 'idInsumo', value: item.id } })}
              onClear={() => {
                handleChange({ target: { name: 'idInsumo', value: '' } });
                handleChange({ target: { name: 'idProveedor', value: '' } });
              }}
              onAddNew={(search) => { setInitialSupplySearch(search); setShowSupplyModal(true); }}
              addNewLabel="+ Registrar Nuevo Insumo" required
            />
            <SupplierPriceCombobox
              label="2. Proveedor"
              placeholder={isStep2Active ? "Buscar proveedor..." : "Bloqueado (elija insumo)"}
              value={formData.idProveedor}
              items={allProveedores.map(p => ({ id: p.id, nombre: p.nombre, subtext: p.nitCedula || p.contacto }))}
              onSelect={(item) => handleChange({ target: { name: 'idProveedor', value: item.id } })}
              onClear={() => handleChange({ target: { name: 'idProveedor', value: '' } })}
              onAddNew={(search) => { setInitialSupplierSearch(search); setShowSupplierModal(true); }}
              addNewLabel="+ Registrar Nuevo Proveedor" disabled={!isStep2Active} required
            />
          </div>

          <SupplierPricePresentationFields 
            formData={formData} handleChange={handleChange}
            isStep3Active={isStep3Active} isStep4Active={isStep4Active}
          />
          <SupplierPriceEquivalenceFields 
            formData={formData} handleChange={handleChange}
            isStep5Active={isStep5Active} isStep6Active={isStep6Active} insumoUnidadBase={insumoUnidadBase}
          />
          <SupplierPriceTaxFields 
            formData={formData} handleChange={handleChange} insumoUnidadBase={insumoUnidadBase} 
          />

          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.label}>Observaciones</label>
            <input 
              name="observaciones" value={formData.observaciones ?? ''} onChange={handleChange} 
              className={`${modalStyles.input} ${styles.uppercaseInput}`}
            />
          </div>

          <div className={modalStyles.actions}>
            <button type="button" onClick={onClose} className={modalStyles.btnCancel}>Cancelar</button>
            <SubmitButton 
              isSubmitting={isSubmitting} text="Guardar Precio" disabled={isSubmitDisabled}
              title={submitTitle} className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
            />
          </div>
        </form>
      </SmartModal>

      <SupplierPriceQuickModals
        showSupplyModal={showSupplyModal} setShowSupplyModal={setShowSupplyModal}
        initialSupplySearch={initialSupplySearch} onSupplyCreated={onSupplyCreated}
        showSupplierModal={showSupplierModal} setShowSupplierModal={setShowSupplierModal}
        initialSupplierSearch={initialSupplierSearch} onSupplierCreated={onSupplierCreated}
        handleChange={handleChange}
      />
    </>
  );
}
