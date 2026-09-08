/**
 * @file useSuppliersData.js
 * @module catalog/suppliers/hooks
 * @description Gestión de datos de la API para proveedores.
 * @responsibility Proveer la lista de proveedores, manejar estado de carga, y proveer la acción para toggle de activo.
 * @usedBy apps/web/src/app/catalog/suppliers/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSuppliersData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/suppliers');
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
      await apiClient.patch(`/suppliers/${item.id}`, { activo: !item.activo });
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return { items, loading, error, fetchItems, handleToggleActive };
}
