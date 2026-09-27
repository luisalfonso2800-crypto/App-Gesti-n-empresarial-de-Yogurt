/**
 * @file useLotsData.js
 * @module operations/lots/hooks
 * @description Hook de datos, filtrado reactivo, paginación y mutaciones para la bitácora de lotes.
 * @responsibility Carga de lotes, cálculo de métricas FEFO, filtrado multicriterio, paginación y baja de lotes.
 * @usedBy apps/web/src/app/operations/lots/page.jsx
 * @dependencies React, apiClient
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

const PAGE_SIZE = 10;

export function useLotsData() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros reactivos
  const [tab, setTab] = useState('EXISTENCIA'); // EXISTENCIA, CEPAS, AGOTADOS, TODOS
  const [filterSearch, setFilterSearch] = useState('');
  const [filterType, setFilterType] = useState('TODOS'); // TODOS, TERMINADO, SEMIELABORADO_WIP
  const [filterStatus, setFilterStatus] = useState('TODOS'); // TODOS, OPTIMO, WARNING, DANGER
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de modales
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [selectedLotForDiscard, setSelectedLotForDiscard] = useState(null);
  const [discardSubmitting, setDiscardSubmitting] = useState(false);

  const [metricsModalOpen, setMetricsModalOpen] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState(null);

  const fetchLots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/lots');
      setLots(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLots();
  }, [fetchLots]);

  const getStatus = useCallback((vencimiento) => {
    if (!vencimiento) return { text: 'Sin Vencimiento', color: 'default', days: 999 };
    const days = Math.ceil((new Date(vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return { text: 'Vencido', color: 'danger', days };
    if (days <= 15) return { text: 'Próximo a Vencer', color: 'warning', days };
    return { text: 'Óptimo', color: 'active', days };
  }, []);

  // Métricas globales superiores
  const globalMetrics = useMemo(() => {
    const totalLots = lots.length;
    let inStockCount = 0;
    let strainsCount = 0;
    let alertCount = 0;

    lots.forEach((lote) => {
      const disp = Number(lote.cantidadDisponible) || 0;
      if (disp > 0) {
        inStockCount += 1;
        if (lote.tipoLote === 'SEMIELABORADO_WIP' || Boolean(lote.idLotePadre)) {
          strainsCount += 1;
        }
        const st = getStatus(lote.fechaVencimiento);
        if (st.color === 'danger' || st.color === 'warning') {
          alertCount += 1;
        }
      }
    });

    return {
      totalLots,
      inStockCount,
      strainsCount,
      alertCount
    };
  }, [lots, getStatus]);

  // Contadores de pestañas
  const tabCounts = useMemo(() => {
    const act = lots.filter(l => Number(l.cantidadDisponible) > 0);
    const cep = lots.filter(l => (l.tipoLote === 'SEMIELABORADO_WIP' || Boolean(l.idLotePadre)) && Number(l.cantidadDisponible) > 0);
    const ago = lots.filter(l => Number(l.cantidadDisponible) <= 0 || l.estado === 'AGOTADO' || l.estado === 'DESCARTADO');
    return {
      act: act.length,
      cep: cep.length,
      ago: ago.length,
      all: lots.length
    };
  }, [lots]);

  // Filtrado reactivo de lotes
  const filteredLots = useMemo(() => {
    // 1. Filtro base por pestaña
    let list = lots;
    if (tab === 'EXISTENCIA') {
      list = list.filter(l => Number(l.cantidadDisponible) > 0);
    } else if (tab === 'CEPAS') {
      list = list.filter(l => (l.tipoLote === 'SEMIELABORADO_WIP' || Boolean(l.idLotePadre)) && Number(l.cantidadDisponible) > 0);
    } else if (tab === 'AGOTADOS') {
      list = list.filter(l => Number(l.cantidadDisponible) <= 0 || l.estado === 'AGOTADO' || l.estado === 'DESCARTADO');
    }

    // 2. Filtro por tipo de lote
    if (filterType !== 'TODOS') {
      list = list.filter(l => {
        if (filterType === 'SEMIELABORADO_WIP') {
          return l.tipoLote === 'SEMIELABORADO_WIP' || Boolean(l.idLotePadre);
        }
        return l.tipoLote !== 'SEMIELABORADO_WIP' && !l.idLotePadre;
      });
    }

    // 3. Filtro por estado FEFO
    if (filterStatus !== 'TODOS') {
      list = list.filter(l => {
        const st = getStatus(l.fechaVencimiento);
        if (filterStatus === 'OPTIMO') return st.color === 'active';
        if (filterStatus === 'WARNING') return st.color === 'warning';
        if (filterStatus === 'DANGER') return st.color === 'danger';
        return true;
      });
    }

    // 4. Búsqueda de texto
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase().trim();
      list = list.filter(l => {
        const cod = (l.codigoLote || l.id || '').toLowerCase();
        const prod = (l.producto?.nombre || 'insumo interno').toLowerCase();
        return cod.includes(q) || prod.includes(q);
      });
    }

    return list;
  }, [lots, tab, filterType, filterStatus, filterSearch, getStatus]);

  // Paginación fija de 10 elementos
  const totalPages = Math.max(1, Math.ceil(filteredLots.length / PAGE_SIZE));
  const paginatedLots = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLots.slice(start, start + PAGE_SIZE);
  }, [filteredLots, currentPage]);

  const hasFilters = Boolean(filterSearch || filterType !== 'TODOS' || filterStatus !== 'TODOS');

  const clearFilters = () => {
    setFilterSearch('');
    setFilterType('TODOS');
    setFilterStatus('TODOS');
    setCurrentPage(1);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setCurrentPage(1);
  };

  const openDiscardModal = (lote) => {
    setSelectedLotForDiscard(lote);
    setDiscardModalOpen(true);
  };

  const closeDiscardModal = () => {
    setSelectedLotForDiscard(null);
    setDiscardModalOpen(false);
  };

  const confirmDiscard = async ({ id, cantidad, motivo }) => {
    setDiscardSubmitting(true);
    try {
      await apiClient.post(`/lots/${id}/discard`, { cantidad, motivo });
      closeDiscardModal();
      await fetchLots();
    } catch (e) {
      alert(e.message || 'Error al procesar la baja del lote');
    } finally {
      setDiscardSubmitting(false);
    }
  };

  const openMetricsModal = (metricType) => {
    setSelectedMetricType(metricType);
    setMetricsModalOpen(true);
  };

  const closeMetricsModal = () => {
    setSelectedMetricType(null);
    setMetricsModalOpen(false);
  };

  return {
    lots,
    loading,
    error,
    fetchLots,
    getStatus,
    // Tabs & Filtros
    tab,
    setTab: handleTabChange,
    tabCounts,
    filterSearch,
    setFilterSearch: (val) => { setFilterSearch(val); setCurrentPage(1); },
    filterType,
    setFilterType: (val) => { setFilterType(val); setCurrentPage(1); },
    filterStatus,
    setFilterStatus: (val) => { setFilterStatus(val); setCurrentPage(1); },
    hasFilters,
    clearFilters,
    // Paginación
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize: PAGE_SIZE,
    filteredLotsCount: filteredLots.length,
    paginatedLots,
    // Métricas
    globalMetrics,
    metricsModalOpen,
    selectedMetricType,
    openMetricsModal,
    closeMetricsModal,
    // Modal de baja
    discardModalOpen,
    selectedLotForDiscard,
    discardSubmitting,
    openDiscardModal,
    closeDiscardModal,
    confirmDiscard
  };
}
