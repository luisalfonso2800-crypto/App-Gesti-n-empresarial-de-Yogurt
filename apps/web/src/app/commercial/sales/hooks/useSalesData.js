/**
 * @file useSalesData.js
 * @module commercial/sales/hooks
 * @description Lectura asíncrona de datos de ventas.
 * @responsibility Recuperar ventas registradas desde la API del backend.
 * @usedBy apps/web/src/app/commercial/sales/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSalesData() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fechaInicio, setFechaInicio] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, '0')}-${String(firstDay.getDate()).padStart(2, '0')}`;
  });

  const [fechaFin, setFechaFin] = useState(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
  });

  const [currentPage, setCurrentPage] = useState(1);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/sales');
      setSales(data || []);
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

  const handleDateChange = (inicio, fin) => {
    setFechaInicio(inicio);
    setFechaFin(fin);
    setCurrentPage(1);
  };

  const handleDateReset = () => {
    setFechaInicio('');
    setFechaFin('');
    setCurrentPage(1);
  };

  const filteredSales = useMemo(() => {
    if (!fechaInicio && !fechaFin) return sales;
    return (sales || []).filter((v) => {
      if (!v.fechaVenta) return true;
      const f = new Date(v.fechaVenta).setHours(0, 0, 0, 0);
      const inicio = fechaInicio ? new Date(`${fechaInicio}T00:00:00`).setHours(0, 0, 0, 0) : -Infinity;
      const fin = fechaFin ? new Date(`${fechaFin}T23:59:59`).setHours(23, 59, 59, 999) : Infinity;
      return f >= inicio && f <= fin;
    });
  }, [sales, fechaInicio, fechaFin]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE) || 1;
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSales.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSales, currentPage]);

  return {
    sales,
    filteredSales,
    paginatedSales,
    loading,
    error,
    fetchSales,
    fechaInicio,
    fechaFin,
    handleDateChange,
    handleDateReset,
    currentPage,
    totalPages,
    totalItems: filteredSales.length,
    setCurrentPage
  };
}
