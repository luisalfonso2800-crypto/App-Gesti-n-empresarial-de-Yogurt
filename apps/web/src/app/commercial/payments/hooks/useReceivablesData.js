/**
 * @file useReceivablesData.js
 * @module commercial/payments/hooks
 * @description Custom hook para el consumo y orquestación de Cartera y Recaudos (SRP < 150 líneas).
 * @responsibility Cargar datos de GET /payments/receivables y coordinar abonos/liquidaciones POST /payments.
 * @usedBy apps/web/src/app/commercial/payments/page.jsx
 * @dependencies react, @/lib/api-client
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';

const INITIAL_FILTERS = {
  searchQuery: '',
  estado: 'TODOS',
  montoMin: '',
  montoMax: ''
};

export function useReceivablesData() {
  const [data, setData] = useState({ kpis: {}, ventas: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Estados de Modales
  const [selectedSale, setSelectedSale] = useState(null);
  const [isAbonoOpen, setIsAbonoOpen] = useState(false);
  const [isSaldarOpen, setIsSaldarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fetchReceivables = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.estado && filters.estado !== 'TODOS') {
        params.estado = filters.estado;
      }
      if (filters.montoMin) {
        params.montoMin = filters.montoMin;
      }
      if (filters.montoMax) {
        params.montoMax = filters.montoMax;
      }

      const res = await apiClient.get('/payments/receivables', { params });
      setData(res || { kpis: {}, ventas: [] });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar cartera');
    } finally {
      setLoading(false);
    }
  }, [filters.estado, filters.montoMin, filters.montoMax]);

  useEffect(() => {
    fetchReceivables();
  }, [fetchReceivables]);

  const handleChangeFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleOpenAbono = (item) => {
    setSelectedSale(item);
    setSubmitError(null);
    setIsAbonoOpen(true);
  };

  const handleCloseAbono = () => {
    setIsAbonoOpen(false);
    setSelectedSale(null);
    setSubmitError(null);
  };

  const handleOpenSaldar = (item) => {
    setSelectedSale(item);
    setSubmitError(null);
    setIsSaldarOpen(true);
  };

  const handleCloseSaldar = () => {
    setIsSaldarOpen(false);
    setSelectedSale(null);
    setSubmitError(null);
  };

  const handleProcessPayment = async (payload, onSuccess) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiClient.post('/payments', {
        ...payload,
        fechaPago: new Date().toISOString()
      });
      if (onSuccess) onSuccess();
      await fetchReceivables();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Error al registrar pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAbono = (payload) => {
    handleProcessPayment(payload, handleCloseAbono);
  };

  const handleConfirmSaldar = (payload) => {
    handleProcessPayment(payload, handleCloseSaldar);
  };

  const filteredVentas = useMemo(() => {
    const list = data.ventas || [];
    if (!filters.searchQuery) return list;
    const query = filters.searchQuery.toLowerCase().trim();
    return list.filter((v) => {
      const clientName = (v.cliente?.nombre || '').toLowerCase();
      const saleId = String(v.id || '').toLowerCase();
      return clientName.includes(query) || saleId.includes(query);
    });
  }, [data.ventas, filters.searchQuery]);

  return {
    kpis: data.kpis,
    ventas: filteredVentas,
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
    handleConfirmSaldar,
    fetchReceivables
  };
}
