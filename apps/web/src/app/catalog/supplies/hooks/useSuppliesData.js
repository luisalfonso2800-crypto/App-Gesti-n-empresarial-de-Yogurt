/**
 * @file useSuppliesData.js
 * @module catalog/supplies/hooks
 * @description Gestión de datos e integración API de insumos con eliminación condicional.
 * @responsibility Proveer la lista de insumos, cambios de estado y hard delete seguro con control de error 409.
 * @usedBy apps/web/src/app/catalog/supplies/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSuppliesData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

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
      setActionNotice(null);
      await apiClient.patch(`/supplies/${item.id}`, { activo: !item.activo });
      await fetchItems();
    } catch (err) {
      setActionNotice(err.message || 'Error al cambiar estado');
    }
  };

  const handleDeleteSupply = async (id) => {
    try {
      setActionNotice(null);
      await apiClient.delete(`/supplies/${id}`);
      await fetchItems();
      return { success: true };
    } catch (err) {
      const msg = err.message || 'No se pudo eliminar el insumo.';
      setActionNotice({ type: 'error', message: msg });
      return { success: false, message: msg };
    }
  };

  const notifyUser = (message, type = 'success') => {
    setActionNotice({ type, message });
  };

  return {
    items,
    loading,
    error,
    actionNotice,
    clearActionNotice: () => setActionNotice(null),
    fetchItems,
    handleToggleActive,
    handleDeleteSupply,
    notifyUser
  };
}
