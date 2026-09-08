/**
 * @file useSalesData.js
 * @module commercial/sales/hooks
 * @description Lectura asíncrona de datos de ventas.
 * @responsibility Recuperar ventas registradas desde la API del backend.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSalesData() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/sales');
      setSales(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return { sales, loading, error, fetchSales };
}
