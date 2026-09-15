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
  const [presentations, setPresentations] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPresentations, setLoadingPresentations] = useState(true);
  const [error, setError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const [productsData, recipesData] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/recipes')
      ]);
      setItems(productsData);
      setRecipes(recipesData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchPresentations = async () => {
    setLoadingPresentations(true);
    try {
      const data = await apiClient.get('/presentations');
      setPresentations(data || []);
    } catch (err) {
      console.error('Error al cargar presentaciones en productos:', err);
      setPresentations([]);
    } finally {
      setLoadingPresentations(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchPresentations();
  }, []);

  const handleToggleActive = async (item) => {
    try {
      setActionNotice(null);
      await apiClient.patch(`/products/${item.id}`, { activo: !item.activo });
      await fetchItems();
    } catch (err) {
      setActionNotice(err.message || 'Error al cambiar estado');
    }
  };

  const deleteProduct = async (idOrIds) => {
    try {
      setActionNotice(null);
      if (Array.isArray(idOrIds)) {
        await Promise.all(idOrIds.map(id => apiClient.delete(`/products/${id}`)));
      } else {
        await apiClient.delete(`/products/${idOrIds}`);
      }
      await fetchItems();
      return { success: true };
    } catch (err) {
      const msg = err.message || 'No se pudo eliminar el producto.';
      setActionNotice(msg);
      return { success: false, message: msg };
    }
  };

  return {
    items,
    presentations,
    recipes,
    loading,
    loadingPresentations,
    fetchPresentations,
    error,
    actionNotice,
    clearActionNotice: () => setActionNotice(null),
    fetchItems,
    handleToggleActive,
    deleteProduct,
    notifyUser: (msg) => setActionNotice(msg)
  };
}
