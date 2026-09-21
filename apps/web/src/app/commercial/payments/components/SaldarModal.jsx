/**
 * @file SaldarModal.jsx
 * @module commercial/payments/components
 * @description Modal Poka-Yoke para saldar el 100% de la deuda de una venta (SRP < 120 líneas).
 * @responsibility Confirmar liquidación completa de la venta con un solo clic.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/lib/formatters, @/utils/numberToWords, ../payments.module.css
 */
'use client';

import React, { useState, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { formatCurrency } from '@/lib/formatters';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../payments.module.css';

const METODOS_PAGO = [
  { id: 'EFECTIVO', label: 'Efectivo' },
  { id: 'TRANSFERENCIA', label: 'Transferencia' },
  { id: 'TARJETA', label: 'Tarjeta' }
];

export default function SaldarModal({
  isOpen,
  onClose,
  saleItem,
  onConfirmSaldar,
  isSubmitting,
  submitError
}) {
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [observaciones, setObservaciones] = useState('');

  const saldoExacto = saleItem ? Number(saleItem.saldoPendiente) : 0;
  const isSubmitDisabled = saldoExacto <= 0 || !metodoPago || isSubmitting;

  useEffect(() => {
    if (isOpen) {
      setMetodoPago('EFECTIVO');
      setObservaciones('');
    }
  }, [isOpen, saleItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onConfirmSaldar({
      idVenta: saleItem.id,
      idCliente: saleItem.idCliente,
      valorPagado: saldoExacto,
      metodoPago,
      observaciones: observaciones.trim()
        ? `SALDO TOTAL DE CARTERA - ${observaciones.trim().toUpperCase()}`
        : 'SALDO TOTAL DE CARTERA'
    });
  };

  if (!saleItem) return null;

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="Saldar Deuda Completa"
      subtitle={`Cliente: ${saleItem.cliente?.nombre || 'General'} | Venta #${saleItem.id.slice(0, 8)}`}
      isDirty={Boolean(observaciones)}
      isSubmitting={isSubmitting}
    >
      {submitError && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.modalInfoCardSuccess}>
          <span className={styles.modalInfoLabel}>Total Exacto a Liquidar</span>
          <strong className={styles.modalInfoValueSuccess}>{formatCurrency(saldoExacto)}</strong>
          <span className={styles.modalInfoWords}>✦ {montoATextoPesos(saldoExacto)}</span>
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Método de Pago <span className={styles.requiredAsterisk}>*</span>
          </label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className={modalStyles.input}
            required
          >
            {METODOS_PAGO.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Observación (Opcional)</label>
          <input
            type="text"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value.toUpperCase())}
            placeholder="Ej: LIQUIDACIÓN COMPLETA POR CLIENTE"
            className={`${modalStyles.input} ${styles.uppercaseInput}`}
          />
        </div>

        <div className={styles.summaryBanner}>
          Al confirmar, la venta pasará a estado <strong>COMPLETADO</strong> y su saldo pendiente será de <strong>$ 0</strong>.
        </div>

        <div className={modalStyles.actions}>
          <button type="button" onClick={onClose} className={modalStyles.btnCancel}>
            Cancelar
          </button>
          <SubmitButton
            isSubmitting={isSubmitting}
            text={`Saldar ${formatCurrency(saldoExacto)}`}
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
