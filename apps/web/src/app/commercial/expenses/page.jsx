/**
 * @file page.jsx
 * @module commercial/expenses
 * @description Orquestador de la vista de Gastos Operativos (SRP + CSS Modules).
 * @responsibility Renderizar cabecera, tabla histórica de gastos y delegar formulario modal a ExpenseFormModal.
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
import styles from './expenses.module.css';
import { useExpensesPageData } from './hooks/useExpensesPageData';
import ExpenseFormModal from './components/ExpenseFormModal';

export default function ExpensesPage() {
  const {
    expenses,
    loading,
    error,
    submitError,
    isModalOpen,
    isSubmitting,
    formData,
    isDirty,
    isSubmitDisabled,
    submitTitle,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit
  } = useExpensesPageData();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Gastos</h1>
          <p className={styles.subtitle}>Registro de erogaciones operativas, servicios públicos, nómina y costos indirectos de fabricación.</p>
        </div>
        <Button onClick={handleOpenModal}>Nuevo Gasto</Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : expenses.length === 0 ? (
        <AssistedEmptyState
          icon="📊"
          title="Comienza registrando tu primer Gasto Operativo"
          description="Registro de servicios, nómina y costos operativos de la planta."
          actionLabel="+ Nuevo Gasto"
          onAction={handleOpenModal}
          topButtonLabel="Nuevo Gasto"
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Fecha</TH>
              <TH>Categoría</TH>
              <TH>Descripción</TH>
              <TH>Valor</TH>
              <TH>Tipo</TH>
            </TR>
          </THead>
          <TBody>
            {expenses.map((item) => (
              <TR key={item.id}>
                <TD>{new Date(item.fecha).toLocaleDateString()}</TD>
                <TD>{item.categoria.replace('_', ' ')}</TD>
                <TD>{item.descripcion}</TD>
                <TD>{formatCurrency(item.valor)}</TD>
                <TD>{item.tipoGasto}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        isSubmitting={isSubmitting}
        submitError={submitError}
        isDirty={isDirty}
        isSubmitDisabled={isSubmitDisabled}
        submitTitle={submitTitle}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
