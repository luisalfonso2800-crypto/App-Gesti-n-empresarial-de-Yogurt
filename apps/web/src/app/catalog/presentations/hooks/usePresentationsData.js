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
    try {
      await apiClient.patch(`/presentations/${item.id}`, { activo: !item.activo });
      fetchPresentations();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return { presentations, loading, error, fetchPresentations, handleToggleActive };
}
