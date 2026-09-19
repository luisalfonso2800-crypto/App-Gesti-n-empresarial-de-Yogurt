/**
 * @file SaleModal.jsx
 * @module commercial/sales/components
 * @description Modal orquestador para registro de ventas y despacho desde cava (SRP + CSS Modules).
 * @responsibility Orquestar inputs maestros, sección de despacho, ficha de balance y validaciones Poka-Yoke.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/SmartModal, ./modal-parts/SaleGeneralFields, ./modal-parts/SaleProductsDispatchSection, ./modal-parts/SaleBalanceReceiptCard, ./modal-parts/SaleCreditFields
 */
import React, { useState } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { formatCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './sale-modal.module.css';
import SaleGeneralFields from './modal-parts/SaleGeneralFields';
import SaleProductsDispatchSection from './modal-parts/SaleProductsDispatchSection';
import SaleBalanceReceiptCard from './modal-parts/SaleBalanceReceiptCard';
import SaleCreditFields from './modal-parts/SaleCreditFields';

export function SaleModal({ 
  isOpen, onClose, formData, products, clients, 
  handleChange, handleDetailsChange, handleSubmit,
  isSubmitting, errorMsg
}) {
  const [stockError, setStockError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAddDetail = (newDetail) => handleDetailsChange([...formData.detalles, newDetail]);
  const handleRemoveDetail = (index) => handleDetailsChange(formData.detalles.filter((_, i) => i !== index));

  const utilidadTotal = formData.detalles.reduce((sum, d) => sum + ((d.precioUnitario - d.costoUnitario) * d.cantidad), 0);
  const isDirty = formData.detalles.length > 0 || !!formData.idCliente;
  const clientName = clients.find(x => String(x.id) === String(formData.idCliente))?.nombre || 'Cliente no seleccionado';

  const isClienteMissing = !formData.idCliente;
  const isFechaMissing = !formData.fechaVenta;
  const isDetallesMissing = formData.detalles.length === 0;
  const isFechaLimiteMissing = formData.tipoPago === 'CREDITO' && !formData.fechaLimitePago;

  const missingFields = [];
  if (isClienteMissing) missingFields.push('Cliente');
  if (isFechaMissing) missingFields.push('Fecha de venta');
  if (isDetallesMissing) missingFields.push('Al menos 1 producto en la orden');
  if (stockError) missingFields.push('Resolver stock insuficiente');
  if (isFechaLimiteMissing) missingFields.push('Fecha límite de pago');

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0 ? `Complete los campos obligatorios: ${missingFields.join(', ')}` : '';

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (isSubmitDisabled) return;
    handleSubmit(e);
  };

  const handleClose = () => {
    setHasSubmitted(false);
    onClose();
  };

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Nueva Venta (Despacho desde Cava)"
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className={styles.formContainer}>
        <SaleGeneralFields
          formData={formData}
          handleChange={handleChange}
          clients={clients}
          hasSubmitted={hasSubmitted}
          isClienteMissing={isClienteMissing}
          isFechaMissing={isFechaMissing}
        />

        <SaleProductsDispatchSection
          products={products}
          detalles={formData.detalles}
          onAddDetail={handleAddDetail}
          onRemoveDetail={handleRemoveDetail}
          onStockErrorChange={setStockError}
          hasSubmitted={hasSubmitted}
          isDetallesMissing={isDetallesMissing}
        />

        <SaleBalanceReceiptCard
          detalles={formData.detalles}
          totalVenta={formData.totalVenta}
          utilidadTotal={utilidadTotal}
        />

        <SaleCreditFields
          formData={formData}
          handleChange={handleChange}
          hasSubmitted={hasSubmitted}
          isFechaLimiteMissing={isFechaLimiteMissing}
        />

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Observaciones</label>
          <input 
            name="observaciones" 
            value={formData.observaciones ?? ''} 
            onChange={(e) => handleChange({ target: { name: 'observaciones', value: e.target.value.toUpperCase() } })} 
            className={`${modalStyles.input} ${styles.uppercaseInput}`}
          />
        </div>

        {formData.idCliente && formData.detalles.length > 0 && (
          <div className={styles.saleSummaryBanner}>
            <strong>Resumen:</strong> Se registrará una venta de <strong>{formData.detalles.length} tipo(s) de producto(s)</strong> al cliente <strong>{clientName}</strong> mediante el canal <strong>{formData.canalVenta ? formData.canalVenta.toLowerCase() : 'directo'}</strong>. Modalidad de pago: <strong>{formData.tipoPago ? formData.tipoPago.toLowerCase() : 'contado'}</strong> por un total de <strong>{formatCurrency(formData.totalVenta)}</strong>.
          </div>
        )}

        <div className={modalStyles.actions}>
          <button 
            type="button" 
            onClick={handleClose}
            className={modalStyles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting} 
            text="Despachar y Facturar"
            disabled={isSubmitDisabled}
            title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
