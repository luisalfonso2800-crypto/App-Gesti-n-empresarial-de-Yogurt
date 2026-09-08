/**
 * @file useProductsData.js
 * @module catalog/products/hooks
 * @description Carga de listado de productos finales.
 * @responsibility Llamadas HTTP y estado asincrónico para productos.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useProductsData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/products');
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
      await apiClient.patch(`/products/${item.id}`, { activo: !item.activo });
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  return { items, loading, error, fetchItems, handleToggleActive };
}
