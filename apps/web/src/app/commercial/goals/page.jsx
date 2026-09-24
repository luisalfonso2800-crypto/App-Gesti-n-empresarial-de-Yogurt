'use client';

import React from 'react';
import { Sprout, Plus, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { PurposeDedicationSection } from './components/PurposeDedicationSection';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { ContributeModal } from './components/ContributeModal';
import { useGoalsPageData } from './hooks/useGoalsPageData';
import styles from './goals.module.css';

/**
 * @file page.jsx
 * @description Vista principal del módulo Rumbo MANNÁ (Metas, Sueños y Propósito) (< 120 líneas).
 */
export default function GoalsPage() {
  const {
    goals, availableFunds, loading, isModalOpen, goalToEdit, contributeGoal,
    setContributeGoal, openNewGoalModal, openEditGoalModal, closeModal,
    handleSaveGoal, handleContribute, handleDeleteGoal
  } = useGoalsPageData();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div />
        <button type="button" className={styles.newGoalBtn} onClick={openNewGoalModal}>
          <Plus size={16} /> Sembrar Nuevo Sueño
        </button>
      </header>

      {availableFunds && (
        <div className={styles.fundsBanner}>
          <div className={styles.fundsIconBox}><Wallet size={20} /></div>
          <div className={styles.fundsInfo}>
            <span className={styles.fundsLabel}>Fondos Disponibles para Asignar</span>
            <strong className={styles.fundsAmount}>{formatCurrency(availableFunds.fondosDisponibles || 0)}</strong>
          </div>
          <div className={styles.fundsDetailRow}>
            <span>Utilidad Neta: {formatCurrency(availableFunds.utilidadNetaOperativa || 0)}</span>
            <span>Aportes Reservados: {formatCurrency(availableFunds.aportesReservados || 0)}</span>
          </div>
        </div>
      )}

      <PurposeDedicationSection />

      {loading ? (
        <div className={styles.emptyState}><p className={styles.emptyTitle}>Consultando ritmo de cosecha...</p></div>
      ) : goals.length === 0 ? (
        <div className={styles.emptyState}>
          <Sprout size={40} color="#2D5A43" />
          <h3 className={styles.emptyTitle}>Aún no hay metas sembradas</h3>
          <p className={styles.emptyDesc}>Siembra hoy el primer objetivo para tu familia o para la empresa.</p>
          <button type="button" className={styles.newGoalBtn} onClick={openNewGoalModal}>
            <Plus size={16} /> Sembrar Primera Meta
          </button>
        </div>
      ) : (
        <section className={styles.goalsGrid}>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={openEditGoalModal}
              onDelete={handleDeleteGoal}
              onOpenContribute={(g) => setContributeGoal(g)}
            />
          ))}
        </section>
      )}

      <GoalFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveGoal}
        goalToEdit={goalToEdit}
      />

      <ContributeModal
        isOpen={Boolean(contributeGoal)}
        onClose={() => setContributeGoal(null)}
        goal={contributeGoal}
        onSuccess={handleContribute}
      />
    </div>
  );
}
