/**
 * @file page.jsx
 * @module commercial/expenses
 * @description Orquestador de la vista de Gastos Operativos (SRP < 120 líneas).
 * @usedBy Next.js App Router
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
import { useExpensesFilter } from './hooks/useExpensesFilter';
import ExpenseFormModal from './components/ExpenseFormModal';
import ExpensesKpis from './components/ExpensesKpis';
import ExpensesFilters from './components/ExpensesFilters';

export default function ExpensesPage() {
  const {
    expenses, loading, error, submitError, isModalOpen, isSubmitting,
    formData, isDirty, isSubmitDisabled, submitTitle,
    handleOpenModal, handleCloseModal, handleChange, handleSubmit
  } = useExpensesPageData();

  const filter = useExpensesFilter(expenses);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Gastos</h1>
          <p className={styles.subtitle}>Registro de erogaciones operativas, servicios públicos, nómina y costos de planta.</p>
        </div>
        <Button onClick={handleOpenModal}>Nuevo Gasto</Button>
      </div>

      <ExpensesKpis items={filter.filteredExpenses} />

      <ExpensesFilters
        searchQuery={filter.searchQuery}
        onSearchChange={filter.setSearchQuery}
        selectedCategory={filter.selectedCategory}
        onCategoryChange={filter.setSelectedCategory}
        selectedPeriod={filter.selectedPeriod}
        onPeriodChange={filter.setSelectedPeriod}
        onReset={filter.handleResetFilters}
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : filter.filteredExpenses.length === 0 ? (
        <AssistedEmptyState
          icon="📊"
          title="No se encontraron gastos para los criterios seleccionados"
          description="Ajusta o limpia los filtros para ver otros períodos o registra un nuevo gasto."
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
            {filter.filteredExpenses.map((item) => (
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
        isOpen={isModalOpen} onClose={handleCloseModal}
        formData={formData} isSubmitting={isSubmitting}
        submitError={submitError} isDirty={isDirty}
        isSubmitDisabled={isSubmitDisabled} submitTitle={submitTitle}
        handleChange={handleChange} handleSubmit={handleSubmit}
      />
    </div>
  );
}
