/**
 * @file useGoalsPageData.js
 * @module commercial/goals/hooks
 * @description Hook de datos, métricas, filtros reactivos, paginación y mutaciones para Rumbo MANNÁ.
 * @responsibility Carga de metas, fondos disponibles, cálculo de KPIs, filtrado multicriterio y modales Poka-Yoke.
 * @usedBy apps/web/src/app/commercial/goals/page.jsx
 * @dependencies React, apiClient
 */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';

const PAGE_SIZE = 10;

export function useGoalsPageData() {
  const [goals, setGoals] = useState([]);
  const [availableFunds, setAvailableFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros reactivos
  const [filterSearch, setFilterSearch] = useState('');
  const [filterAmbito, setFilterAmbito] = useState('TODOS');
  const [filterBotanico, setFilterBotanico] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(1);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [contributeGoal, setContributeGoal] = useState(null);

  // Modal Archivo
  const [archiveGoalModalOpen, setArchiveGoalModalOpen] = useState(false);
  const [goalToArchive, setGoalToArchive] = useState(null);
  const [archiveSubmitting, setArchiveSubmitting] = useState(false);

  // Modal Métricas Detail
  const [metricsModalOpen, setMetricsModalOpen] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState(null);

  const fetchGoalsAndFunds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [goalsData, fundsData] = await Promise.all([
        apiClient.get('/goals'),
        apiClient.get('/goals/available-funds').catch(() => null)
      ]);
      setGoals(Array.isArray(goalsData) ? goalsData : []);
      setAvailableFunds(fundsData);
    } catch (err) {
      console.error('Error fetching goals data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoalsAndFunds();
  }, [fetchGoalsAndFunds]);

  // KPIs superiores
  const globalMetrics = useMemo(() => {
    const totalGoals = goals.length;
    let harvestedCount = 0;
    let activeGrowingCount = 0;

    goals.forEach((g) => {
      const prog = g.progresoPorcentaje || 0;
      if (prog >= 100 || g.estadoBotanico === 'COSECHADA') {
        harvestedCount += 1;
      } else {
        activeGrowingCount += 1;
      }
    });

    return {
      totalGoals,
      harvestedCount,
      activeGrowingCount,
      availableFunds: availableFunds?.fondosDisponibles || 0
    };
  }, [goals, availableFunds]);

  // Filtrado reactivo
  const filteredGoals = useMemo(() => {
    let list = goals;

    if (filterAmbito !== 'TODOS') {
      list = list.filter(g => g.ambito === filterAmbito);
    }

    if (filterBotanico !== 'TODOS') {
      list = list.filter(g => g.estadoBotanico === filterBotanico);
    }

    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase().trim();
      list = list.filter(g => {
        const tit = (g.titulo || '').toLowerCase();
        const desc = (g.descripcion || '').toLowerCase();
        return tit.includes(q) || desc.includes(q);
      });
    }

    return list;
  }, [goals, filterAmbito, filterBotanico, filterSearch]);

  // Paginación fija de 10
  const totalPages = Math.max(1, Math.ceil(filteredGoals.length / PAGE_SIZE));
  const paginatedGoals = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredGoals.slice(start, start + PAGE_SIZE);
  }, [filteredGoals, currentPage]);

  const hasFilters = Boolean(filterSearch || filterAmbito !== 'TODOS' || filterBotanico !== 'TODOS');

  const clearFilters = () => {
    setFilterSearch('');
    setFilterAmbito('TODOS');
    setFilterBotanico('TODOS');
    setCurrentPage(1);
  };

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

  const openArchiveConfirm = (goal) => {
    setGoalToArchive(goal);
    setArchiveGoalModalOpen(true);
  };

  const closeArchiveConfirm = () => {
    setGoalToArchive(null);
    setArchiveGoalModalOpen(false);
  };

  const confirmArchive = async (id) => {
    setArchiveSubmitting(true);
    try {
      await apiClient.delete(`/goals/${id}`);
      closeArchiveConfirm();
      await fetchGoalsAndFunds();
    } catch (e) {
      alert(e.message || 'Error al archivar la meta');
    } finally {
      setArchiveSubmitting(false);
    }
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

  const openMetricsModal = (type) => {
    setSelectedMetricType(type);
    setMetricsModalOpen(true);
  };

  const closeMetricsModal = () => {
    setSelectedMetricType(null);
    setMetricsModalOpen(false);
  };

  return {
    goals,
    availableFunds,
    loading,
    error,
    fetchGoalsAndFunds,
    // Filtros
    filterSearch,
    setFilterSearch: (val) => { setFilterSearch(val); setCurrentPage(1); },
    filterAmbito,
    setFilterAmbito: (val) => { setFilterAmbito(val); setCurrentPage(1); },
    filterBotanico,
    setFilterBotanico: (val) => { setFilterBotanico(val); setCurrentPage(1); },
    hasFilters,
    clearFilters,
    // Paginación
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize: PAGE_SIZE,
    filteredGoalsCount: filteredGoals.length,
    paginatedGoals,
    // Métricas
    globalMetrics,
    metricsModalOpen,
    selectedMetricType,
    openMetricsModal,
    closeMetricsModal,
    // Modales
    isModalOpen,
    goalToEdit,
    contributeGoal,
    setContributeGoal,
    openNewGoalModal,
    openEditGoalModal,
    closeModal,
    handleSaveGoal,
    handleContribute,
    // Archivo
    archiveGoalModalOpen,
    goalToArchive,
    archiveSubmitting,
    openArchiveConfirm,
    closeArchiveConfirm,
    confirmArchive
  };
}
