/**
 * @file PaymentClientAndSaleFields.jsx
 * @module commercial/payments/components/modal-parts
 * @description Campos de Fecha, Cliente y Venta pendiente a imputar con validación Poka-Yoke.
 * @responsibility Renderizar los selectores principales del cobro y banners de estado del cliente.
 * @usedBy apps/web/src/app/commercial/payments/components/PaymentFormModal.jsx
 * @dependencies react, @/components/ui/inputs/SmartSelect, @/lib/formatters, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { formatCurrency } from '@/lib/formatters';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../../payments.module.css';

export default function PaymentClientAndSaleFields({
  formData,
  handleChange,
  clients,
  pendingSales,
  hasSubmitted = false
}) {
  const isFechaInvalid = hasSubmitted && !formData.fechaPago;
  const isClienteInvalid = hasSubmitted && !formData.idCliente;
  const isVentaInvalid = hasSubmitted && !formData.idVenta;

  return (
    <>
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Fecha de Pago <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          name="fechaPago" 
          type="date" 
          value={formData.fechaPago ?? ''} 
          onChange={handleChange} 
          className={`${modalStyles.input} ${isFechaInvalid ? styles.inputErrorBorder : ''}`} 
          required 
        />
        {isFechaInvalid && (
          <span className={styles.fieldErrorText}>La fecha de pago es obligatoria</span>
        )}
      </div>

      <SmartSelect
        label="Cliente"
        name="idCliente"
        value={formData.idCliente ?? ''}
        onChange={handleChange}
        options={clients.map(c => ({ id: c.id, label: c.nombre, subtext: c.documento }))}
        required
        placeholder="Seleccione un cliente"
        error={isClienteInvalid ? 'Seleccione el cliente' : undefined}
      />

      {formData.idCliente && pendingSales.length === 0 && (
        <div className={styles.clientUpToDateBanner}>
          Este cliente está al día
        </div>
      )}

      {formData.idCliente && pendingSales.length > 0 && (
        <SmartSelect
          label="Venta Pendiente"
          name="idVenta"
          value={formData.idVenta ?? ''}
          onChange={handleChange}
          options={pendingSales.map(s => ({
            id: s.id,
            label: `Venta ${new Date(s.fechaVenta).toLocaleDateString()} - ${s.canalVenta}`,
            subtext: `Saldo: ${formatCurrency(s.saldoPendiente)}`
          }))}
          required
          placeholder="Seleccione venta a abonar"
          error={isVentaInvalid ? 'Seleccione la venta a la cual imputar el abono' : undefined}
        />
      )}
    </>
  );
}
