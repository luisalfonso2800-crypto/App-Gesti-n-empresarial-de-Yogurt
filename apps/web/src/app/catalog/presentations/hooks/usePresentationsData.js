/**
 * @file usePresentationsData.js
 * @module catalog/presentations/hooks
 * @description Obtiene los formatos y presentaciones con control estricto de paginación de 10 elementos.
 * @responsibility Llamada API de lectura de `/presentations`, manejador de estados y slicing de página (10 items).
 * @usedBy apps/web/src/app/catalog/presentations/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';

const PAGE_SIZE = 10;

export function usePresentationsData() {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPresentations = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/presentations');
      setPresentations(Array.isArray(data) ? data : []);
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

  const totalItems = presentations.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // Ajustar página actual si excede el nuevo total de páginas
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedPresentations = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return presentations.slice(startIndex, startIndex + PAGE_SIZE);
  }, [presentations, currentPage]);

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

  return {
    presentations: paginatedPresentations,
    allPresentations: presentations,
    totalItems,
    totalPages,
    currentPage,
    pageSize: PAGE_SIZE,
    setCurrentPage,
    loading,
    error,
    fetchPresentations,
    handleToggleActive,
    deletePresentation
  };
}
