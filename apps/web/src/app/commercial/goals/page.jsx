'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Plus, Wallet } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { formatCurrency } from '@/lib/formatters';
import { PurposeDedicationSection } from './components/PurposeDedicationSection';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { ContributeModal } from './components/ContributeModal';
import styles from './goals.module.css';

/**
 * @file page.jsx
 * @description Vista principal del módulo Rumbo MANNÁ (Metas, Sueños y Propósito) (< 120 líneas).
 */
export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [availableFunds, setAvailableFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [contributeGoal, setContributeGoal] = useState(null);

  const fetchGoalsAndFunds = async () => {
    try {
      setLoading(true);
      const [goalsData, fundsData] = await Promise.all([
        apiClient.get('/goals'),
        apiClient.get('/goals/available-funds').catch(() => null)
      ]);
      setGoals(Array.isArray(goalsData) ? goalsData : []);
      setAvailableFunds(fundsData);
    } catch (err) {
      console.error('Error fetching goals data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsAndFunds();
  }, []);

  const handleSaveGoal = async (payload) => {
    if (goalToEdit) {
      await apiClient.put(`/goals/${goalToEdit.id}`, payload);
    } else {
      await apiClient.post('/goals', payload);
    }
    fetchGoalsAndFunds();
  };

  const handleContribute = async (goalId, payload) => {
    await apiClient.post(`/goals/${goalId}/contribute`, payload);
    fetchGoalsAndFunds();
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('¿Deseas archivar esta meta?')) return;
    await apiClient.delete(`/goals/${id}`);
    fetchGoalsAndFunds();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <Sprout size={28} className={styles.sproutIcon} />
            <h1 className={styles.title}>Rumbo MANNÁ</h1>
          </div>
          <p className={styles.subtitle}>Metas tangibles, sueños familiares y ritmo de cosecha en tiempo real.</p>
        </div>
        <button
          type="button"
          className={styles.newGoalBtn}
          onClick={() => { setGoalToEdit(null); setIsModalOpen(true); }}
        >
          <Plus size={16} />
          Sembrar Nuevo Sueño
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
          <button type="button" className={styles.newGoalBtn} onClick={() => { setGoalToEdit(null); setIsModalOpen(true); }}>
            <Plus size={16} />
            Sembrar Primera Meta
          </button>
        </div>
      ) : (
        <section className={styles.goalsGrid}>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => { setGoalToEdit(g); setIsModalOpen(true); }}
              onDelete={handleDeleteGoal}
              onOpenContribute={(g) => setContributeGoal(g)}
            />
          ))}
        </section>
      )}

      <GoalFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setGoalToEdit(null); }}
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
