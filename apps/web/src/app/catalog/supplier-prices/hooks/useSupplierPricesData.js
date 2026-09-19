/**
 * @file useSupplierPricesData.js
 * @module catalog/supplier-prices/hooks
 * @description Maneja la obtención, filtrado, ordenamiento y actualización de precios de proveedores.
 * @responsibility Carga de datos desde la API, derivación de estados combinados (filtros) y cálculos de resúmenes. No contiene lógica de UI.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSupplierPricesData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filterInsumo, setFilterInsumo] = useState('');
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterSort, setFilterSort] = useState('none');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/supplier-prices');
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
      await apiClient.patch(`/supplier-prices/${item.id}`, { activo: !item.activo });
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al cambiar estado');
    }
  };

  const handleSubmitForm = async (formData, editingItem) => {
    try {
      if (editingItem) {
        await apiClient.patch(`/supplier-prices/${editingItem.id}`, formData);
      } else {
        await apiClient.post('/supplier-prices', formData);
      }
      fetchItems();
    } catch (err) {
      alert(err.message || 'Error al guardar');
      throw err;
    }
  };

  const clearFilters = () => {
    setFilterInsumo('');
    setFilterProveedor('');
    setFilterEstado('Todos');
    setFilterSearch('');
    setFilterSort('none');
  };

  const hasFilters = filterInsumo !== '' || filterProveedor !== '' || filterEstado !== 'Todos' || filterSearch !== '' || filterSort !== 'none';

  const uniqueInsumos = useMemo(() => {
    const map = new Map();
    items.forEach(i => {
      if (i.insumo) map.set(i.idInsumo, i.insumo);
    });
    return Array.from(map.values());
  }, [items]);

  const uniqueProveedores = useMemo(() => {
    const map = new Map();
    items.forEach(i => {
      if (i.proveedor) map.set(i.idProveedor, i.proveedor);
    });
    return Array.from(map.values());
  }, [items]);

  const bestPricesMap = useMemo(() => {
    const map = new Map();
    items.forEach(item => {
      if (item.activo) {
        const itemCosto = Number(item.costoUnidadBase || 0);
        const currentMin = map.get(item.idInsumo);
        if (currentMin === undefined || itemCosto < currentMin) {
          map.set(item.idInsumo, itemCosto);
        }
      }
    });
    return map;
  }, [items]);

  const summaryCard = useMemo(() => {
    if (!filterInsumo) return null;
    const activeItemsForInsumo = items.filter(i => i.idInsumo === filterInsumo && i.activo);
    if (activeItemsForInsumo.length === 0) return null;

    let minItem = activeItemsForInsumo[0];
    let maxItem = activeItemsForInsumo[0];

    activeItemsForInsumo.forEach(i => {
      const iCosto = Number(i.costoUnidadBase || 0);
      const minCosto = Number(minItem.costoUnidadBase || 0);
      const maxCosto = Number(maxItem.costoUnidadBase || 0);
      if (iCosto < minCosto) minItem = i;
      if (iCosto > maxCosto) maxItem = i;
    });

    const optionsCount = activeItemsForInsumo.length;
    let savingsPercent = 0;
    const minFinal = Number(minItem.costoUnidadBase || 0);
    const maxFinal = Number(maxItem.costoUnidadBase || 0);
    if (maxFinal > 0 && maxFinal !== minFinal) {
      savingsPercent = ((maxFinal - minFinal) / maxFinal) * 100;
    }

    return {
      minItem,
      maxItem,
      optionsCount,
      savingsPercent: savingsPercent.toFixed(2)
    };
  }, [items, filterInsumo]);

  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      if (filterInsumo && item.idInsumo !== filterInsumo) return false;
      if (filterProveedor && item.idProveedor !== filterProveedor) return false;
      if (filterEstado === 'Activos' && !item.activo) return false;
      if (filterEstado === 'Inactivos' && item.activo) return false;
      if (filterSearch) {
        const query = filterSearch.toLowerCase();
        const insumoName = (item.insumo?.Nombre_Insumo || item.insumo?.nombre || '').toLowerCase();
        const proveedorName = (item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || '').toLowerCase();
        const pres = (item.presentacionCompra || '').toLowerCase();
        if (!insumoName.includes(query) && !proveedorName.includes(query) && !pres.includes(query)) {
          return false;
        }
      }
      return true;
    });

    if (filterSort === 'asc') {
      result.sort((a, b) => a.costoUnidadBase - b.costoUnidadBase);
    }
    return result;
  }, [items, filterInsumo, filterProveedor, filterEstado, filterSearch, filterSort]);

  return {
    items,
    loading,
    error,
    filteredItems,
    fetchItems,
    handleToggleActive,
    handleSubmitForm,
    filterInsumo, setFilterInsumo,
    filterProveedor, setFilterProveedor,
    filterEstado, setFilterEstado,
    filterSearch, setFilterSearch,
    filterSort, setFilterSort,
    clearFilters,
    hasFilters,
    uniqueInsumos,
    uniqueProveedores,
    bestPricesMap,
    summaryCard
  };
}
