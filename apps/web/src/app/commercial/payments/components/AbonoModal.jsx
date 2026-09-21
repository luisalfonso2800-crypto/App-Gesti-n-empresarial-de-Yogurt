/**
 * @file AbonoModal.jsx
 * @module commercial/payments/components
 * @description Modal Poka-Yoke para registrar abonos parciales a una venta (SRP < 120 líneas).
 * @responsibility Validar y registrar pago parcial con opción de reprogramación de crédito.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/components/ui/SmartModal, @/lib/formatters, @/utils/numberToWords, ../payments.module.css
 */
'use client';

import React, { useState, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import { formatCurrency, cleanCurrency } from '@/lib/formatters';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../payments.module.css';

const METODOS = [{ id: 'EFECTIVO', label: 'Efectivo' }, { id: 'TRANSFERENCIA', label: 'Transferencia' }, { id: 'TARJETA', label: 'Tarjeta' }];

export default function AbonoModal({ isOpen, onClose, saleItem, onConfirmAbono, isSubmitting, submitError }) {
  const [valorAbono, setValorAbono] = useState('');
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [nuevaFechaLimite, setNuevaFechaLimite] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const saldoActual = saleItem ? Number(saleItem.saldoPendiente) : 0;
  const numericValor = cleanCurrency(valorAbono);
  const isExceeded = numericValor > saldoActual;
  const isSubmitDisabled = !numericValor || numericValor <= 0 || isExceeded || !metodoPago || isSubmitting;
  const isDirty = Boolean(valorAbono || observaciones || nuevaFechaLimite);

  useEffect(() => {
    if (isOpen) {
      setValorAbono('');
      setMetodoPago('EFECTIVO');
      setNuevaFechaLimite('');
      setObservaciones('');
    }
  }, [isOpen, saleItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    onConfirmAbono({
      idVenta: saleItem.id,
      idCliente: saleItem.idCliente,
      valorPagado: numericValor,
      metodoPago,
      nuevaFechaLimite: nuevaFechaLimite ? new Date(nuevaFechaLimite).toISOString() : null,
      observaciones: observaciones.trim() ? observaciones.trim().toUpperCase() : null
    });
  };

  if (!saleItem) return null;

  return (
    <SmartModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Abono a Cartera"
      subtitle={`Cliente: ${saleItem.cliente?.nombre || 'General'} | Venta #${saleItem.id.slice(0, 8)}`}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {submitError && <div className={styles.errorMessage}><span>⚠️</span><span>{submitError}</span></div>}
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.modalInfoCard}>
          <span className={styles.modalInfoLabel}>Saldo Pendiente Actual</span>
          <strong className={styles.modalInfoValue}>{formatCurrency(saldoActual)}</strong>
        </div>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Valor del Abono ($) <span className={styles.requiredAsterisk}>*</span></label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={valorAbono ? String(valorAbono).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
            onChange={(e) => setValorAbono(e.target.value.replace(/\D/g, ''))}
            className={`${modalStyles.input} ${isExceeded ? styles.inputErrorBorder : ''}`}
            required
          />
          {isExceeded && <span className={styles.fieldErrorText}>El abono no puede superar el saldo actual ({formatCurrency(saldoActual)})</span>}
          {numericValor > 0 && !isExceeded && <span className={styles.paymentWordsBadge}>✦ {montoATextoPesos(numericValor)}</span>}
        </div>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Método de Pago <span className={styles.requiredAsterisk}>*</span></label>
          <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className={modalStyles.input} required>
            {METODOS.map((m) => (<option key={m.id} value={m.id}>{m.label}</option>))}
          </select>
        </div>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Nueva Fecha Límite (Opcional)</label>
          <input type="date" value={nuevaFechaLimite} onChange={(e) => setNuevaFechaLimite(e.target.value)} className={modalStyles.input} />
        </div>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Observación</label>
          <input
            type="text"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value.toUpperCase())}
            placeholder="Ej: ABONO PARCIAL"
            className={`${modalStyles.input} ${styles.uppercaseInput}`}
          />
        </div>
        <div className={modalStyles.actions}>
          <button type="button" onClick={onClose} className={modalStyles.btnCancel}>Cancelar</button>
          <SubmitButton
            isSubmitting={isSubmitting}
            text="Confirmar Abono"
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
          />
        </div>
      </form>
    </SmartModal>
  );
}
