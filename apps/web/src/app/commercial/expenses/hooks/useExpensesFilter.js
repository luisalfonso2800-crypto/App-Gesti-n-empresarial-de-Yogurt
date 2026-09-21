/**
 * @file useExpensesFilter.js
 * @module commercial/expenses/hooks
 * @description Hook de filtrado y segmentación en memoria para Gastos Operativos (SRP < 90 líneas).
 * @usedBy apps/web/src/app/commercial/expenses/page.jsx
 */
import { useState, useMemo } from 'react';

export function useExpensesFilter(expenses = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [selectedPeriod, setSelectedPeriod] = useState('TODOS');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = (item.descripcion || '').toLowerCase().includes(q) ||
          (item.categoria || '').toLowerCase().includes(q) ||
          (item.periodo || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedCategory !== 'TODOS') {
        const cat = String(item.categoria || '').toUpperCase();
        if (selectedCategory === 'OTROS') {
          if (['COMPRAS', 'SERVICIOS_PUBLICOS', 'NOMINA', 'MANTENIMIENTO'].includes(cat)) return false;
        } else if (cat !== selectedCategory) {
          return false;
        }
      }
      if (selectedPeriod !== 'TODOS') {
        const itemDate = new Date(item.fecha);
        const now = new Date();
        if (selectedPeriod === 'HOY') {
          if (itemDate.toDateString() !== now.toDateString()) return false;
        } else if (selectedPeriod === 'SEMANA') {
          const diff = (now - itemDate) / (1000 * 60 * 60 * 24);
          if (diff < 0 || diff > 7) return false;
        } else if (selectedPeriod === 'MES') {
          if (itemDate.getMonth() !== now.getMonth() || itemDate.getFullYear() !== now.getFullYear()) return false;
        } else if (selectedPeriod === 'MES_ANTERIOR') {
          const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          if (itemDate.getMonth() !== prevMonth || itemDate.getFullYear() !== prevYear) return false;
        }
      }
      return true;
    });
  }, [expenses, searchQuery, selectedCategory, selectedPeriod]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('TODOS');
    setSelectedPeriod('TODOS');
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPeriod,
    setSelectedPeriod,
    filteredExpenses,
    handleResetFilters
  };
}
