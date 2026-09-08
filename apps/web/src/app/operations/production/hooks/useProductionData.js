/**
 * @file useProductionData.js
 * @module operations/production/hooks
 * @description Maneja la carga de órdenes de producción y recetas asociadas.
 * @responsibility Consumir API para obtener el listado de producción y recetas activas, gestionar estado de carga.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useProductionData() {
  const [productions, setProductions] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, recData] = await Promise.all([
        apiClient.get('/production'),
        apiClient.get('/recipes')
      ]);
      setProductions(prodData);
      setRecipes(recData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { productions, recipes, loading, error, fetchData };
}
