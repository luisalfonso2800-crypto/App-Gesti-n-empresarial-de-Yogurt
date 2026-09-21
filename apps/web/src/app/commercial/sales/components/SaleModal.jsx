/**
 * @file SaleModal.jsx
 * @module commercial/sales/components
 * @description Modal orquestador para registro de ventas y despacho desde cava (SRP < 150 líneas).
 * @responsibility Orquestar inputs maestros, sección de despacho, ficha de balance y validaciones Poka-Yoke.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/components/ui/SmartModal, ./modal-parts/*
 */
import React, { useState } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { formatCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './sale-modal.module.css';
import SaleGeneralFields from './modal-parts/SaleGeneralFields';
import SaleProductsDispatchSection from './modal-parts/SaleProductsDispatchSection';
import SaleBalanceReceiptCard from './modal-parts/SaleBalanceReceiptCard';
import SalesCreditScheduler from './SalesCreditScheduler';

export function SaleModal({ 
  isOpen, onClose, formData, products, clients, 
  handleChange, handleDetailsChange, handleSubmit,
  isSubmitting, errorMsg, onNewClient
}) {
  const [stockError, setStockError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleAddDetail = (newDetail) => handleDetailsChange([...formData.detalles, newDetail]);
  const handleRemoveDetail = (index) => handleDetailsChange(formData.detalles.filter((_, i) => i !== index));
  const handleUpdateDetailQty = (index, newQty, newPrice) => {
    if (newQty <= 0) return handleRemoveDetail(index);
    const updated = formData.detalles.map((d, i) => {
      if (i !== index) return d;
      const targetProduct = products.find(p => (p.idProducto || p.id) === (d.idProducto || d.id));
      const pInfo = targetProduct?.producto || targetProduct || {};
      const minMay = Number(pInfo.cantidadMinimaMayorista || 12);
      const mayPrice = Number(pInfo.precioMayorista || 0);
      const regPrice = Number(pInfo.precioVenta || pInfo.precioVentaSug || d.precioUnitario);
      const calculatedPrice = newPrice !== undefined ? newPrice : (mayPrice > 0 && newQty >= minMay ? mayPrice : regPrice);
      return { ...d, cantidad: newQty, precioUnitario: calculatedPrice };
    });
    handleDetailsChange(updated);
  };

  const utilidadTotal = formData.detalles.reduce((sum, d) => sum + ((d.precioUnitario - d.costoUnitario) * d.cantidad), 0);
  const isDirty = formData.detalles.length > 0 || Boolean(formData.idCliente);
  const clientName = clients.find(x => String(x.id) === String(formData.idCliente))?.nombre || 'Cliente no seleccionado';
  const isClienteMissing = !formData.idCliente;
  const isFechaMissing = !formData.fechaVenta;
  const isDetallesMissing = formData.detalles.length === 0;
  const isFechaLimiteMissing = formData.tipoPago === 'CREDITO' && !formData.fechaLimitePago;

  const missingFields = [
    isClienteMissing && 'Cliente', isFechaMissing && 'Fecha de venta',
    isDetallesMissing && 'Al menos 1 producto en la orden',
    stockError && 'Resolver stock insuficiente', isFechaLimiteMissing && 'Fecha límite de pago'
  ].filter(Boolean);

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0 ? `Complete los campos obligatorios: ${missingFields.join(', ')}` : '';

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!isSubmitDisabled) handleSubmit(e);
  };
  const handleClose = () => { setHasSubmitted(false); onClose(); };

  return (
    <SmartModal 
      isOpen={isOpen} onClose={handleClose} title="Nueva Venta (Despacho desde Cava)"
      isDirty={isDirty} isSubmitting={isSubmitting}
    >
      {errorMsg && <div className={styles.errorMessage}><span>⚠️</span><span>{errorMsg}</span></div>}

      <form onSubmit={handleFormSubmit} className={styles.formContainer}>
        <SaleGeneralFields
          formData={formData} handleChange={handleChange} clients={clients}
          onNewClient={onNewClient} hasSubmitted={hasSubmitted}
          isClienteMissing={isClienteMissing} isFechaMissing={isFechaMissing}
        />

        <div className={styles.taxToggleBanner}>
          <label className={styles.taxToggleLabel}>
            <input type="checkbox" name="aplicaIva" checked={formData.aplicaIva ?? false} onChange={handleChange} />
            <span>Liquidar con IVA (Factura Gravada Comercial)</span>
          </label>
          {formData.aplicaIva && <span className={styles.taxToggleBadge}>IVA Activo</span>}
        </div>

        <SaleProductsDispatchSection
          products={products} detalles={formData.detalles}
          onAddDetail={handleAddDetail} onRemoveDetail={handleRemoveDetail}
          onUpdateQty={handleUpdateDetailQty} onStockErrorChange={setStockError}
          hasSubmitted={hasSubmitted} isDetallesMissing={isDetallesMissing}
        />

        <SaleBalanceReceiptCard
          detalles={formData.detalles} totalVenta={formData.totalVenta} utilidadTotal={utilidadTotal}
          aplicaIva={formData.aplicaIva} baseImponible={formData.baseImponible} ivaTotal={formData.ivaTotal}
        />

        <SalesCreditScheduler
          formData={formData} handleChange={handleChange}
          hasSubmitted={hasSubmitted} isFechaLimiteMissing={isFechaLimiteMissing}
        />

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Observaciones</label>
          <input 
            name="observaciones" value={formData.observaciones ?? ''}
            onChange={(e) => handleChange({ target: { name: 'observaciones', value: e.target.value.toUpperCase() } })} 
            className={`${modalStyles.input} ${styles.uppercaseInput}`}
          />
        </div>

        {formData.idCliente && formData.detalles.length > 0 && (
          <div className={styles.saleSummaryBanner}>
            <strong>Resumen:</strong> {formData.detalles.length} ítem(s) para <strong>{clientName}</strong> ({formData.canalVenta || 'DIRECTO'} / {formData.tipoPago || 'CONTADO'}): <strong>{formatCurrency(formData.totalVenta)}</strong>.
          </div>
        )}

        <div className={modalStyles.actions}>
          <button type="button" onClick={handleClose} className={modalStyles.btnCancel}>Cancelar</button>
          <SubmitButton 
            isSubmitting={isSubmitting} text="Despachar y Facturar"
            disabled={isSubmitDisabled} title={submitTitle}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
