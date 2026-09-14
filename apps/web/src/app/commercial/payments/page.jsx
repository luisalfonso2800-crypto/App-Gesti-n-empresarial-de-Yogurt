/**
 * @file page.jsx
 * @module commercial/payments
 * @description Orquestador principal de la vista de Pagos y Cobros (SRP + CSS Modules).
 * @responsibility Presentar la cabecera, tabla de ingresos y delegar lógica y modales a submódulos.
 * @usedBy Next.js App Router
 * @dependencies react, @/components/ui/Button, @/components/ui/Table, @/components/ui/States, @/components/ui/AssistedEmptyState, @/lib/formatters
 */
'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { formatCurrency } from '@/lib/formatters';
import styles from './payments.module.css';
import { usePaymentsPageData } from './hooks/usePaymentsPageData';
import PaymentFormModal from './components/PaymentFormModal';

export default function PaymentsPage() {
  const {
    payments,
    clients,
    loading,
    error,
    submitError,
    isModalOpen,
    isSubmitting,
    formData,
    pendingSales,
    paymentValue,
    showExceedError,
    clientName,
    projectedBalance,
    isSubmitDisabled,
    submitTitle,
    isDirty,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit
  } = usePaymentsPageData();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Pagos y Cobros</h1>
          <p className={styles.subtitle}>Control de ingresos por cartera de clientes, recaudos efectivos y saldos pendientes por cobrar.</p>
        </div>
        <Button onClick={handleOpenModal}>Nuevo Pago</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : payments.length === 0 ? (
        <AssistedEmptyState
          icon="💵"
          title="Comienza registrando tu primer Pago o Cobro"
          description="Seguimiento a recaudos de cartera y control de ingresos por ventas."
          actionLabel="+ Registrar Pago/Cobro"
          onAction={handleOpenModal}
          topButtonLabel="Nuevo Pago"
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Fecha</TH>
              <TH>Cliente</TH>
              <TH>Venta (ID)</TH>
              <TH>Valor</TH>
              <TH>Método</TH>
            </TR>
          </THead>
          <TBody>
            {payments.map((item) => (
              <TR key={item.id}>
                <TD>{new Date(item.fechaPago).toLocaleDateString()}</TD>
                <TD>{item.cliente?.nombre || item.idCliente}</TD>
                <TD>{item.idVenta}</TD>
                <TD>{formatCurrency(item.valorPagado)}</TD>
                <TD>{item.metodoPago}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <PaymentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        clients={clients}
        pendingSales={pendingSales}
        paymentValue={paymentValue}
        showExceedError={showExceedError}
        clientName={clientName}
        projectedBalance={projectedBalance}
        isSubmitDisabled={isSubmitDisabled}
        submitTitle={submitTitle}
        isSubmitting={isSubmitting}
        submitError={submitError}
        isDirty={isDirty}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
