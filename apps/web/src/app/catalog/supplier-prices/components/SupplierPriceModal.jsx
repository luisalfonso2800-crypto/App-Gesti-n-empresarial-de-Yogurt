/**
 * @file SupplierPriceModal.jsx
 * @module catalog/supplier-prices/components
 * @description Modal declarativo para creación/edición de precios de proveedor (SRP + CSS Modules).
 * @responsibility Orquestar la presentación visual y delegar estados en useSupplierPriceForm y subcomponentes atómicos.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies SmartModal, SmartSelect, ./modal-parts/SupplierPricePresentationFields, ./modal-parts/SupplierPriceEquivalenceFields, ./modal-parts/useSupplierPriceForm
 */
import React from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { cleanCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './supplier-price-modal.module.css';
import SupplierPricePresentationFields from './modal-parts/SupplierPricePresentationFields';
import SupplierPriceEquivalenceFields from './modal-parts/SupplierPriceEquivalenceFields';
import SupplierPriceTaxFields from './modal-parts/SupplierPriceTaxFields';
import { useSupplierPriceForm } from './modal-parts/useSupplierPriceForm';

export function SupplierPriceModal({ isOpen, onClose, editingItem, onSubmit, allInsumos = [], allProveedores = [] }) {
  const {
    formData,
    isSubmitting,
    errorMsg,
    isDirty,
    insumoName,
    proveedorName,
    isSubmitDisabled,
    submitTitle,
    handleChange,
    handleSubmit
  } = useSupplierPriceForm({ isOpen, editingItem, onSubmit, onClose, allInsumos, allProveedores });

  const selectedInsumo = allInsumos.find(i => String(i.id) === String(formData.idInsumo));
  const insumoUnidadBase = selectedInsumo?.unidadBase || selectedInsumo?.Unidad_Base || '';

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Precio de Proveedor' : 'Nuevo Precio de Proveedor'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={modalStyles.twoColumns}>
          <SmartSelect
            label="Insumo"
            name="idInsumo"
            value={formData.idInsumo ?? ''}
            onChange={handleChange}
            options={allInsumos.map(i => ({ id: i.id, label: i.nombre, subtext: i.categoria }))}
            required
            placeholder="Seleccione insumo"
          />
          
          <SmartSelect
            label="Proveedor"
            name="idProveedor"
            value={formData.idProveedor ?? ''}
            onChange={handleChange}
            options={allProveedores.map(p => ({ id: p.id, label: p.nombre, subtext: p.nitCedula || p.contacto }))}
            required
            placeholder="Seleccione proveedor"
          />
        </div>

        <SupplierPricePresentationFields formData={formData} handleChange={handleChange} />

        <SupplierPriceEquivalenceFields formData={formData} handleChange={handleChange} />

        <SupplierPriceTaxFields 
          formData={formData} 
          handleChange={handleChange} 
          insumoUnidadBase={insumoUnidadBase} 
        />

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Observaciones</label>
          <input 
            name="observaciones" 
            value={formData.observaciones ?? ''} 
            onChange={handleChange} 
            className={`${modalStyles.input} ${styles.uppercaseInput}`}
          />
        </div>

        <label className={styles.checkboxLabel}>
          <input 
            type="checkbox" 
            name="activo" 
            checked={formData.activo} 
            onChange={handleChange} 
          />
          <span className={styles.checkboxText}>Mantener precio activo</span>
        </label>

        {formData.idInsumo && formData.idProveedor && (
          <div className={styles.summaryCard}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el precio de compra del insumo <strong>{insumoName}</strong> con el proveedor <strong>{proveedorName}</strong>. El sistema procesará el costo de <strong>${Number(cleanCurrency(formData.precioCompra) || 0).toLocaleString('es-CO')}</strong> para obtener un valor unitario base de <strong>${Number(formData.costoUnidadBase || 0).toLocaleString('es-CO', { minimumFractionDigits: Number(formData.costoUnidadBase) % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}</strong>.
          </div>
        )}

        <div className={modalStyles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={modalStyles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting} 
            text="Guardar Precio"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
