/**
 * @file page.jsx
 * @module commercial/goals
 * @description Vista principal del módulo Rumbo MANNÁ (Metas, Sueños y Propósito) (SRP < 120 líneas).
 */
'use client';

import React from 'react';
import { Sprout, Plus } from 'lucide-react';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { PurposeDedicationSection } from './components/PurposeDedicationSection';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { ContributeModal } from './components/ContributeModal';
import { GoalsMetrics } from './components/GoalsMetrics';
import { GoalsFilterBar } from './components/GoalsFilterBar';
import { GoalsPagination } from './components/GoalsPagination';
import { GoalsMetricsDetailModal } from './components/GoalsMetricsDetailModal';
import { ConfirmArchiveGoalModal } from './components/ConfirmArchiveGoalModal';
import { useGoalsPageData } from './hooks/useGoalsPageData';
import styles from './goals.module.css';

export default function GoalsPage() {
  const {
    goals, availableFunds, loading, error, isModalOpen, goalToEdit, contributeGoal,
    setContributeGoal, openNewGoalModal, openEditGoalModal, closeModal,
    handleSaveGoal, handleContribute,
    filterSearch, setFilterSearch, filterAmbito, setFilterAmbito, filterBotanico, setFilterBotanico,
    hasFilters, clearFilters,
    currentPage, setCurrentPage, totalPages, pageSize, filteredGoalsCount, paginatedGoals,
    globalMetrics, metricsModalOpen, selectedMetricType, openMetricsModal, closeMetricsModal,
    archiveGoalModalOpen, goalToArchive, archiveSubmitting, openArchiveConfirm, closeArchiveConfirm, confirmArchive
  } = useGoalsPageData();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <Sprout size={28} className={styles.sproutIcon} />
            <h1 className={styles.title}>Rumbo MANNÁ</h1>
          </div>
          <p className={styles.subtitle}>Tablero de Metas, Sueños y Retribución del Propósito.</p>
        </div>
        <button type="button" className={styles.newGoalBtn} onClick={openNewGoalModal}>
          <Plus size={16} /> Sembrar Nuevo Sueño
        </button>
      </header>

      {/* 4 KPIs Interactivas */}
      <GoalsMetrics
        metrics={globalMetrics}
        loading={loading}
        onCardClick={openMetricsModal}
      />

      {/* Dedicatoria Solemne */}
      <PurposeDedicationSection />

      {/* Barra de Filtros */}
      <GoalsFilterBar
        filterSearch={filterSearch}
        setFilterSearch={setFilterSearch}
        filterAmbito={filterAmbito}
        setFilterAmbito={setFilterAmbito}
        filterBotanico={filterBotanico}
        setFilterBotanico={setFilterBotanico}
        hasFilters={hasFilters}
        clearFilters={clearFilters}
      />

      {paginatedGoals.length === 0 ? (
        <div className={styles.emptyState}>
          <Sprout size={40} color="#2D5A43" />
          <h3 className={styles.emptyTitle}>
            {hasFilters ? 'No se encontraron metas con estos filtros' : 'Aún no hay metas sembradas'}
          </h3>
          <p className={styles.emptyDesc}>
            {hasFilters ? 'Intenta restablecer los filtros para ver tus metas.' : 'Siembra hoy el primer objetivo para tu familia o para la empresa.'}
          </p>
          <button type="button" className={styles.newGoalBtn} onClick={hasFilters ? clearFilters : openNewGoalModal}>
            {hasFilters ? 'Limpiar Filtros' : <><Plus size={16} /> Sembrar Primera Meta</>}
          </button>
        </div>
      ) : (
        <>
          <section className={styles.goalsGrid}>
            {paginatedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={openEditGoalModal}
                onDelete={() => openArchiveConfirm(goal)}
                onOpenContribute={(g) => setContributeGoal(g)}
              />
            ))}
          </section>

          <GoalsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredGoalsCount}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modales */}
      <GoalFormModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSaveGoal} goalToEdit={goalToEdit} />
      <ContributeModal isOpen={Boolean(contributeGoal)} onClose={() => setContributeGoal(null)} goal={contributeGoal} onSuccess={handleContribute} />
      <GoalsMetricsDetailModal isOpen={metricsModalOpen} onClose={closeMetricsModal} type={selectedMetricType} metrics={globalMetrics} goals={goals} availableFunds={availableFunds} onApplyFilter={setFilterBotanico} />
      <ConfirmArchiveGoalModal isOpen={archiveGoalModalOpen} onClose={closeArchiveConfirm} goal={goalToArchive} onConfirm={confirmArchive} submitting={archiveSubmitting} />
    </div>
  );
}
