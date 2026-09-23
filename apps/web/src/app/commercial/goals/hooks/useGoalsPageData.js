'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * @file useGoalsPageData.js
 * @description Hook de datos y acciones para la vista principal de Metas y Sueños (Rumbo MANNÁ).
 * @returns {object} Estados y controladores de modales, fondos y CRUD de metas.
 */
export function useGoalsPageData() {
  const [goals, setGoals] = useState([]);
  const [availableFunds, setAvailableFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [contributeGoal, setContributeGoal] = useState(null);

  const fetchGoalsAndFunds = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchGoalsAndFunds();
  }, [fetchGoalsAndFunds]);

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

  const openNewGoalModal = () => {
    setGoalToEdit(null);
    setIsModalOpen(true);
  };

  const openEditGoalModal = (goal) => {
    setGoalToEdit(goal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGoalToEdit(null);
  };

  return {
    goals,
    availableFunds,
    loading,
    isModalOpen,
    goalToEdit,
    contributeGoal,
    setContributeGoal,
    openNewGoalModal,
    openEditGoalModal,
    closeModal,
    handleSaveGoal,
    handleContribute,
    handleDeleteGoal
  };
}
