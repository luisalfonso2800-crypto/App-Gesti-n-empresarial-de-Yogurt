/**
 * @file useSuppliesData.js
 * @module catalog/supplies/hooks
 * @description Gestión de datos e integracion API de insumos.
 * @responsibility Proveer la lista de insumos y actualizar estado/filtros de categoría.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSuppliesData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/supplies');
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggleActive = async (item) => {
    try {
      await apiClient.patch(`/supplies/${item.id}`, { activo: !item.activo });
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return { items, loading, error, fetchItems, handleToggleActive };
}
