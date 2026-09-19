/**
 * @file usePresentationsData.js
 * @module catalog/presentations/hooks
 * @description Obtiene los formatos y presentaciones.
 * @responsibility Llamada API de lectura de `/presentations` y manejador de estados.
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function usePresentationsData() {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPresentations = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/presentations');
      setPresentations(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar presentaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  const handleToggleActive = async (item) => {
    const targetId = item?.id ?? item?.idPresentacion ?? item?.ID_Presentacion ?? item?._id;
    if (!targetId) {
      console.error('Identificador no válido para alternar estado:', item);
      return;
    }
    try {
      await apiClient.patch(`/presentations/${targetId}`, { activo: !item.activo });
      fetchPresentations();
    } catch (err) {
      console.error('Error al cambiar estado de presentación:', err);
    }
  };

  const deletePresentation = async (id) => {
    try {
      await apiClient.delete(`/presentations/${id}`);
      fetchPresentations();
      return { success: true };
    } catch (err) {
      const errorText = err?.response?.data?.message || err?.message || 'Error al eliminar la presentación';
      return { success: false, error: errorText };
    }
  };

  return { presentations, loading, error, fetchPresentations, handleToggleActive, deletePresentation };
}
