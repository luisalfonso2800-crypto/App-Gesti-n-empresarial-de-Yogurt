/**
 * @file useRecipesData.js
 * @module catalog/recipes/hooks
 * @description Carga de recetas, productos e insumos.
 * @responsibility Manejo de estado asíncrono y llamadas a la API para datos maestros.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useRecipesData() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recipesData, productsData, suppliesData, pricesData] = await Promise.all([
        apiClient.get('/recipes'),
        apiClient.get('/products'),
        apiClient.get('/supplies'),
        apiClient.get('/supplier-prices/active')
      ]);
      setItems(recipesData);
      setProducts(productsData);
      setSupplies(suppliesData);
      setPrices(pricesData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleActive = async (item) => {
    try {
      await apiClient.patch(`/recipes/${item.id}`, { activo: !item.activo });
      fetchData();
    } catch (err) {
      console.error('Error al cambiar estado de receta:', err);
      setError(err.message || 'Error al cambiar estado');
    }
  };

  return {
    items, products, supplies, prices, loading, error, fetchData, handleToggleActive
  };
}
