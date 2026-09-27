/**
 * @file useSuppliersData.js
 * @module catalog/suppliers/hooks
 * @description Gestión de datos de la API para proveedores con manejo de estados sin alert().
 * @responsibility Proveer la lista de proveedores, manejar estado de carga y conmutación de activo.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSuppliersData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/suppliers');
      setItems(Array.isArray(data) ? data : []);
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
      await apiClient.patch(`/suppliers/${item.id}`, { activo: !item.activo });
      await fetchItems();
    } catch (err) {
      setActionNotice(err.message || 'Error al cambiar estado del proveedor');
    }
  };

  return {
    items,
    loading,
    error,
    actionNotice,
    clearActionNotice: () => setActionNotice(null),
    fetchItems,
    handleToggleActive
  };
}
