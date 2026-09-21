/**
 * @file page.jsx
 * @module commercial/payments
 * @description Centro de Cartera y Recaudos (Orquestador SRP < 120 líneas).
 * @responsibility Presentar KPIs, filtros, tabla de cuentas por cobrar y orquestar modales.
 * @usedBy Next.js App Router
 * @dependencies react, componentes locales de cartera, @/components/ui/States, @/components/ui/AssistedEmptyState
 */
'use client';

import React, { useState } from 'react';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import styles from './payments.module.css';
import { useReceivablesData } from './hooks/useReceivablesData';
import ReceivablesKpis from './components/ReceivablesKpis';
import ReceivablesFilters from './components/ReceivablesFilters';
import ReceivablesTable from './components/ReceivablesTable';
import AbonoModal from './components/AbonoModal';
import SaldarModal from './components/SaldarModal';
import InvoiceDetailModal from './components/InvoiceDetailModal';

export default function PaymentsPage() {
  const [invoiceSale, setInvoiceSale] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const {
    kpis,
    ventas,
    loading,
    error,
    filters,
    selectedSale,
    isAbonoOpen,
    isSaldarOpen,
    isSubmitting,
    submitError,
    handleChangeFilter,
    handleResetFilters,
    handleOpenAbono,
    handleCloseAbono,
    handleOpenSaldar,
    handleCloseSaldar,
    handleConfirmAbono,
    handleConfirmSaldar
  } = useReceivablesData();

  const handleOpenInvoice = (sale) => {
    setInvoiceSale(sale);
    setIsInvoiceOpen(true);
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Centro de Cartera y Recaudos</h1>
          <p className={styles.subtitle}>
            Control de ingresos por cartera de clientes, recaudos efectivos y saldos pendientes por cobrar.
          </p>
        </div>
      </div>

      <ReceivablesKpis kpis={kpis} />

      <ReceivablesFilters
        filters={filters}
        onChangeFilter={handleChangeFilter}
        onResetFilters={handleResetFilters}
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : ventas.length === 0 ? (
        <AssistedEmptyState
          icon="💵"
          title="No hay cuentas pendientes por cobrar"
          description="Toda la cartera de clientes se encuentra al día o no coincide con los filtros aplicados."
          actionLabel="Restablecer Filtros"
          onAction={handleResetFilters}
        />
      ) : (
        <ReceivablesTable
          receivables={ventas}
          onOpenAbono={handleOpenAbono}
          onOpenSaldar={handleOpenSaldar}
          onOpenInvoice={handleOpenInvoice}
        />
      )}

      <AbonoModal
        isOpen={isAbonoOpen}
        onClose={handleCloseAbono}
        saleItem={selectedSale}
        onConfirmAbono={handleConfirmAbono}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <SaldarModal
        isOpen={isSaldarOpen}
        onClose={handleCloseSaldar}
        saleItem={selectedSale}
        onConfirmSaldar={handleConfirmSaldar}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />

      <InvoiceDetailModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        saleItem={invoiceSale}
      />
    </div>
  );
}
