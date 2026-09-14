/**
 * @file useLotsData.js
 * @module operations/lots/hooks
 * @description Hook de datos y lógica para la bitácora de lotes en cava.
 * @responsibility Carga de lotes, dar de baja por vencimiento y cálculo de días FEFO.
 * @usedBy apps/web/src/app/operations/lots/page.jsx
 * @dependencies React, apiClient
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useLotsData() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLots = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/lots');
      setLots(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleDiscard = async (id, qty) => {
    const qtyToDiscard = prompt(`Cantidad a dar de baja por vencimiento (max ${qty}):`, qty);
    if (!qtyToDiscard || isNaN(qtyToDiscard) || Number(qtyToDiscard) <= 0 || Number(qtyToDiscard) > qty) return;
    
    try {
      await apiClient.post(`/lots/${id}/discard`, { cantidad: Number(qtyToDiscard), motivo: 'Vencimiento en Cava' });
      alert("Lote dado de baja exitosamente.");
      fetchLots();
    } catch (e) {
      alert(e.message);
    }
  };

  const getStatus = (vencimiento) => {
    if (!vencimiento) return { text: 'Sin Vencimiento', color: 'default' };
    const days = Math.ceil((new Date(vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return { text: 'Vencido', color: 'danger', days };
    if (days <= 15) return { text: 'Próximo a Vencer', color: 'warning', days };
    return { text: 'Óptimo', color: 'active', days };
  };

  return {
    lots,
    loading,
    error,
    fetchLots,
    handleDiscard,
    getStatus
  };
}
