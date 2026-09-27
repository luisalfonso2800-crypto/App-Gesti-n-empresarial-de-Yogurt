/**
 * @file useSupplierPricesData.js
 * @module catalog/supplier-prices/hooks
 * @description Maneja la obtención, filtrado en cadena dependiente, ordenamiento y actualización de tarifas.
 * @responsibility Carga de datos desde API, derivación de opciones dependientes (Proveedor -> Insumo -> Presentación) y cálculos de resúmenes.
 * @usedBy apps/web/src/app/catalog/supplier-prices/page.jsx
 * @dependencies @/lib/api-client
 */
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';

export function useSupplierPricesData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Filtro en Cadena
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterInsumo, setFilterInsumo] = useState('');
  const [filterPresentacion, setFilterPresentacion] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterSort, setFilterSort] = useState('none');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/supplier-prices');
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
      await apiClient.patch(`/supplier-prices/${item.id}`, { activo: !item.activo });
      fetchItems();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
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
      console.error('Error al guardar cotización:', err);
      throw err;
    }
  };

  // Manejador en cascada: al cambiar proveedor, sincronizar insumo
  const handleSelectProveedor = (provId) => {
    setFilterProveedor(provId);
    if (provId && filterInsumo) {
      const belongs = items.some(
        (i) =>
          (i.idProveedor === provId || i.proveedor?.id === provId) &&
          (i.idInsumo === filterInsumo || i.insumo?.id === filterInsumo)
      );
      if (!belongs) {
        setFilterInsumo('');
        setFilterPresentacion('');
      }
    }
  };

  // Manejador en cascada: al cambiar insumo, sincronizar presentación
  const handleSelectInsumo = (insId) => {
    setFilterInsumo(insId);
    if (insId && filterPresentacion) {
      const belongs = items.some(
        (i) =>
          (i.idInsumo === insId || i.insumo?.id === insId) &&
          (!filterProveedor || i.idProveedor === filterProveedor || i.proveedor?.id === filterProveedor) &&
          i.presentacionCompra === filterPresentacion
      );
      if (!belongs) {
        setFilterPresentacion('');
      }
    }
  };

  const clearFilters = () => {
    setFilterProveedor('');
    setFilterInsumo('');
    setFilterPresentacion('');
    setFilterEstado('Todos');
    setFilterSearch('');
    setFilterSort('none');
  };

  const hasFilters =
    filterProveedor !== '' ||
    filterInsumo !== '' ||
    filterPresentacion !== '' ||
    filterEstado !== 'Todos' ||
    filterSearch !== '' ||
    filterSort !== 'none';

  // Catálogos únicos base
  const uniqueProveedores = useMemo(() => {
    const map = new Map();
    items.forEach((i) => {
      if (i.proveedor) map.set(i.idProveedor, i.proveedor);
    });
    return Array.from(map.values());
  }, [items]);

  const uniqueInsumos = useMemo(() => {
    const map = new Map();
    items.forEach((i) => {
      if (i.insumo) map.set(i.idInsumo, i.insumo);
    });
    return Array.from(map.values());
  }, [items]);

  // En cadena: Insumos disponibles según el proveedor seleccionado
  const availableInsumos = useMemo(() => {
    if (!filterProveedor) return uniqueInsumos;
    const insumoIds = new Set(
      items
        .filter((i) => i.idProveedor === filterProveedor || i.proveedor?.id === filterProveedor)
        .map((i) => i.idInsumo || i.insumo?.id)
        .filter(Boolean)
    );
    return uniqueInsumos.filter((ins) => insumoIds.has(ins.id || ins.ID_Insumo));
  }, [items, uniqueInsumos, filterProveedor]);

  // En cadena: Presentaciones disponibles según el insumo y proveedor seleccionados
  const availablePresentaciones = useMemo(() => {
    const presSet = new Set(
      items
        .filter((i) => {
          if (filterProveedor && i.idProveedor !== filterProveedor && i.proveedor?.id !== filterProveedor) return false;
          if (filterInsumo && i.idInsumo !== filterInsumo && i.insumo?.id !== filterInsumo) return false;
          return true;
        })
        .map((i) => i.presentacionCompra)
        .filter(Boolean)
    );
    return Array.from(presSet);
  }, [items, filterProveedor, filterInsumo]);

  const bestPricesMap = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
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
    const activeItemsForInsumo = items.filter((i) => (i.idInsumo === filterInsumo || i.insumo?.id === filterInsumo) && i.activo);
    if (activeItemsForInsumo.length === 0) return null;

    let minItem = activeItemsForInsumo[0];
    let maxItem = activeItemsForInsumo[0];

    activeItemsForInsumo.forEach((i) => {
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

  // Métricas Globales para Tarjetas de Resumen Superior
  const globalMetrics = useMemo(() => {
    const totalTarifas = items.length;
    const activasCount = items.filter((i) => i.activo).length;
    
    // Proveedores con cotización activa
    const provsActivosSet = new Set(
      items.filter((i) => i.activo).map((i) => i.idProveedor || i.proveedor?.id).filter(Boolean)
    );
    
    // Insumos con al menos una cotización activa
    const insumosCotizadosSet = new Set(
      items.filter((i) => i.activo).map((i) => i.idInsumo || i.insumo?.id).filter(Boolean)
    );

    // Insumos que tienen múltiples cotizaciones activas para comparar
    const insumoCountMap = {};
    const insumoItemsMap = {};
    items.filter((i) => i.activo).forEach((i) => {
      const insId = i.idInsumo || i.insumo?.id;
      if (insId) {
        insumoCountMap[insId] = (insumoCountMap[insId] || 0) + 1;
        if (!insumoItemsMap[insId]) insumoItemsMap[insId] = [];
        insumoItemsMap[insId].push(i);
      }
    });

    const multiCotizadosList = Object.entries(insumoItemsMap)
      .filter(([_, list]) => list.length > 1)
      .map(([_, list]) => {
        const insumoName = list[0]?.insumo?.Nombre_Insumo || list[0]?.insumo?.nombre || 'Insumo';
        const sorted = [...list].sort((a, b) => Number(a.costoUnidadBase || 0) - Number(b.costoUnidadBase || 0));
        const minCosto = Number(sorted[0]?.costoUnidadBase || 0);
        const maxCosto = Number(sorted[sorted.length - 1]?.costoUnidadBase || 0);
        const ahorro = maxCosto > 0 ? (((maxCosto - minCosto) / maxCosto) * 100).toFixed(1) : 0;
        return {
          id: list[0]?.idInsumo || list[0]?.insumo?.id,
          nombre: insumoName,
          count: list.length,
          minCosto,
          maxCosto,
          ahorro,
          mejorProveedor: sorted[0]?.proveedor?.Nombre_Proveedor || sorted[0]?.proveedor?.nombre || 'Proveedor',
          peorProveedor: sorted[sorted.length - 1]?.proveedor?.Nombre_Proveedor || sorted[sorted.length - 1]?.proveedor?.nombre || 'Proveedor'
        };
      });

    return {
      totalTarifas,
      activasCount,
      inactivasCount: totalTarifas - activasCount,
      totalProveedores: provsActivosSet.size,
      totalInsumosCotizados: insumosCotizadosSet.size,
      multiCotizadosCount: multiCotizadosList.length,
      multiCotizadosList
    };
  }, [items]);

  // Filtrado reactivo en cadena
  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      if (filterProveedor && item.idProveedor !== filterProveedor && item.proveedor?.id !== filterProveedor) return false;
      if (filterInsumo && item.idInsumo !== filterInsumo && item.insumo?.id !== filterInsumo) return false;
      if (filterPresentacion && item.presentacionCompra !== filterPresentacion) return false;
      if (filterEstado === 'Activos' && !item.activo) return false;
      if (filterEstado === 'Inactivos' && item.activo) return false;

      if (filterSearch) {
        const query = filterSearch.toLowerCase().trim();
        const insumoName = (item.insumo?.Nombre_Insumo || item.insumo?.nombre || '').toLowerCase();
        const proveedorName = (item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || '').toLowerCase();
        const pres = (item.presentacionCompra || '').toLowerCase();
        const codigo = (item.insumo?.codigo || item.insumo?.id || '').toLowerCase();
        if (!insumoName.includes(query) && !proveedorName.includes(query) && !pres.includes(query) && !codigo.includes(query)) {
          return false;
        }
      }
      return true;
    });

    if (filterSort === 'asc') {
      result.sort((a, b) => Number(a.costoUnidadBase || 0) - Number(b.costoUnidadBase || 0));
    } else if (filterSort === 'desc') {
      result.sort((a, b) => Number(b.costoUnidadBase || 0) - Number(a.costoUnidadBase || 0));
    }
    return result;
  }, [items, filterProveedor, filterInsumo, filterPresentacion, filterEstado, filterSearch, filterSort]);

  return {
    items,
    loading,
    error,
    filteredItems,
    fetchItems,
    handleToggleActive,
    handleSubmitForm,
    filterProveedor,
    setFilterProveedor: handleSelectProveedor,
    filterInsumo,
    setFilterInsumo: handleSelectInsumo,
    filterPresentacion,
    setFilterPresentacion,
    filterEstado,
    setFilterEstado,
    filterSearch,
    setFilterSearch,
    filterSort,
    setFilterSort,
    clearFilters,
    hasFilters,
    uniqueProveedores,
    uniqueInsumos,
    availableInsumos,
    availablePresentaciones,
    bestPricesMap,
    summaryCard,
    globalMetrics
  };
}
