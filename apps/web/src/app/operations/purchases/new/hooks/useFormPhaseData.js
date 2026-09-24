/**
 * @file useFormPhaseData.js
 * @module operations/purchases/new/hooks
 * @description Hook con la lógica de negocio y estado para el formulario de compras adicionales o directas.
 * @responsibility Manejo de filas de compras LIFO, flete, dropdowns, modales auxiliares y envío a la API.
 * @usedBy apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
 * @dependencies React, apiClient
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { calculateRowFinancials, calculatePurchaseTotals } from '../utils/purchaseCalculations';

export function useFormPhaseData({
  proveedoresDBProp,
  insumosDBProp,
  supplierPrices,
  setPhase,
  showNotification,
  activeOrder,
  refreshOrder,
  router
}) {
  const searchParams = useSearchParams();
  const isDirectPurchase = searchParams.get('mode') === 'direct' || (!activeOrder && searchParams.get('manual') === 'true');

  const [proveedoresDB, setProveedoresDB] = useState(proveedoresDBProp || []);
  const [insumosDB, setInsumosDB] = useState(insumosDBProp || []);
  const [detalles, setDetalles] = useState([]);
  const [flete, setFlete] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState({ rowId: null, type: null });
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [showNewProvModal, setShowNewProvModal] = useState(false);
  const [newProvTargetRow, setNewProvTargetRow] = useState(null);
  const [initialProvData, setInitialProvData] = useState({});

  const [showNewInsumoModal, setShowNewInsumoModal] = useState(false);
  const [newInsumoTargetRow, setNewInsumoTargetRow] = useState(null);
  const [initialSupplyData, setInitialSupplyData] = useState({});

  const containerRef = useRef(null);

  useEffect(() => { setProveedoresDB(proveedoresDBProp || []); }, [proveedoresDBProp]);
  useEffect(() => { setInsumosDB(insumosDBProp || []); }, [insumosDBProp]);

  // Carga inicial del borrador local
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedDraft = localStorage.getItem('manna_direct_purchase_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.detalles && Array.isArray(parsed.detalles)) {
          setDetalles(parsed.detalles);
        }
        if (parsed?.flete !== undefined) {
          setFlete(parsed.flete);
        }
      }
    } catch (err) {
      console.warn('No se pudo restaurar el borrador local de compra directa:', err);
    } finally {
      setDraftLoaded(true);
    }
  }, []);

  // Persistencia automática con debounce cuando cambian detalles o flete
  useEffect(() => {
    if (!draftLoaded || typeof window === 'undefined') return;
    const timeoutId = setTimeout(() => {
      try {
        if (detalles.length === 0 && !flete) {
          localStorage.removeItem('manna_direct_purchase_draft');
        } else {
          localStorage.setItem(
            'manna_direct_purchase_draft',
            JSON.stringify({ detalles, flete, updatedAt: new Date().toISOString() })
          );
        }
      } catch (err) {
        console.warn('Error al persistir borrador local:', err);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [detalles, flete, draftLoaded]);

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      const confirmClear = window.confirm('¿Está seguro de limpiar el borrador actual? Se vaciarán todos los ítems.');
      if (!confirmClear) return;
      localStorage.removeItem('manna_direct_purchase_draft');
    }
    setDetalles([]);
    setFlete('');
    showNotification('Borrador de compra limpiado correctamente.', 'info');
  };

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveDropdown({ rowId: null, type: null });
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const {
    totalSinIvaCompra,
    totalIvaCompra,
    totalCompra,
    totalConFlete
  } = useMemo(() => calculatePurchaseTotals(detalles, flete), [detalles, flete]);

  const addRow = () => {
    const newRow = {
      id: Date.now(),
      proveedor: null,
      provSearch: '',
      insumo: null,
      insumoSearch: '',
      empaque: 'UNIDAD',
      empaqueTipo: 'UNIDAD',
      contenidoNeto: '1',
      unidadMedida: 'kg',
      marca: '',
      empaques: '',
      precioUnitario: '',
      tieneIva: true,
      porcentajeIva: 19,
      precioIncluyeIva: true,
      isUnconfigured: false
    };
    setDetalles(prev => [newRow, ...prev]);
  };

  const addRowFromStock = (supply) => {
    const newRow = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      proveedor: null,
      provSearch: '',
      insumo: supply,
      insumoSearch: supply?.nombre || '',
      empaque: 'UNIDAD',
      empaqueTipo: 'UNIDAD',
      contenidoNeto: '1',
      unidadMedida: supply?.unidadBase || supply?.unidadMedida || '',
      marca: (supply?.marca && supply.marca !== 'N/A') ? supply.marca : '',
      empaques: '',
      precioUnitario: supply?.costoBase ? String(supply.costoBase) : '',
      tieneIva: true,
      porcentajeIva: 19,
      precioIncluyeIva: true,
      isUnconfigured: true
    };
    setDetalles(prev => [newRow, ...prev]);
    showNotification(`Insumo "${supply?.nombre}" agregado. Complete proveedor, empaque y precio.`, 'info');
  };

  const removeRow = (id) => {
    setDetalles(prev => prev.filter(d => d.id !== id));
  };

  const updateDetalle = (id, field, value) => {
    setDetalles(prev => prev.map(d => {
      if (d.id !== id) return d;
      const updated = { ...d, [field]: value };
      const hasProv = Boolean(updated.proveedor?.id);
      const hasQty = (parseInt(updated.empaques, 10) || 0) > 0;
      const hasPrice = (parseInt(updated.precioUnitario, 10) || 0) > 0;
      if (hasProv && hasQty && hasPrice) {
        updated.isUnconfigured = false;
      }
      return updated;
    }));
  };

  const clearInsumo = (rowId) => {
    if (activeDropdown.rowId === rowId && activeDropdown.type === 'insumo') {
      setDropdownSearch('');
    }
    setDetalles(prev => prev.map(d => {
      if (d.id !== rowId) return d;
      return {
        ...d,
        insumo: null,
        insumoSearch: '',
        empaque: 'UNIDAD',
        empaqueTipo: 'UNIDAD',
        contenidoNeto: '1',
        unidadMedida: 'kg',
        marca: '',
        empaques: '',
        precioUnitario: ''
      };
    }));
  };

  const openDropdown = (rowId, type, currentSearch) => {
    setActiveDropdown({ rowId, type });
    setDropdownSearch(currentSearch || '');
  };

  const filteredProveedores = (search) =>
    proveedoresDB.filter(p => p.nombre.toLowerCase().includes((search || '').toLowerCase()));

  const filteredInsumosByRow = (row, search) => {
    let baseList = insumosDB;
    let showingAll = false;

    if (row.proveedor?.id && supplierPrices?.length > 0) {
      const provInsumoIds = supplierPrices
        .filter(sp => sp.idProveedor === row.proveedor.id && sp.activo)
        .map(sp => sp.idInsumo);
      
      const matchedInsumos = insumosDB.filter(i => provInsumoIds.includes(i.id));
      if (matchedInsumos.length > 0) {
        baseList = matchedInsumos;
      } else {
        showingAll = true;
      }
    } else {
      showingAll = true;
    }

    const filtered = baseList.filter(i => i.nombre.toLowerCase().includes((search || '').toLowerCase()));
    return { filtered, showingAll };
  };

  const handleSuccessProv = (p) => {
    if (p) {
      setProveedoresDB(prev => prev.some(existing => existing.id === p.id) ? prev : [...prev, p]);
      if (newProvTargetRow !== null) {
        updateDetalle(newProvTargetRow, 'proveedor', p);
        updateDetalle(newProvTargetRow, 'provSearch', p.nombre);
      }
      setShowNewProvModal(false);
      showNotification('Proveedor registrado exitosamente.', 'success');
    }
  };

  const handleSuccessInsumo = (i) => {
    if (i) {
      setInsumosDB(prev => prev.some(existing => existing.id === i.id) ? prev : [...prev, i]);
      if (newInsumoTargetRow !== null) {
        updateDetalle(newInsumoTargetRow, 'insumo', i);
        updateDetalle(newInsumoTargetRow, 'insumoSearch', i.nombre);
        updateDetalle(newInsumoTargetRow, 'unidadMedida', i.unidadBase || 'kg');
        updateDetalle(newInsumoTargetRow, 'marca', i.marca !== 'N/A' ? i.marca : '');
        if (i.costoBase) {
          updateDetalle(newInsumoTargetRow, 'precioUnitario', i.costoBase);
        }
      }
      setShowNewInsumoModal(false);
      showNotification(`Insumo "${i.nombre}" registrado exitosamente.`, 'success');
    }
  };

  const handleConfirmar = async () => {
    const unconfiguredRows = detalles.filter(d => d.isUnconfigured);
    if (unconfiguredRows.length > 0) {
      showNotification('Hay insumos agregados desde stock que aún están pendientes de completar (proveedor, empaque o precio).', 'error');
      return;
    }

    const filasIncompletas = detalles.filter(d => !d.insumo?.id || parseInt(d.empaques, 10) <= 0 || parseInt(d.precioUnitario, 10) <= 0 || isNaN(parseInt(d.empaques, 10)) || isNaN(parseInt(d.precioUnitario, 10)));
    if (filasIncompletas.length > 0) {
      const ejemplos = filasIncompletas.map((d, idx) => {
        if (!d.insumo?.id) return `Fila ${idx + 1}: falta seleccionar insumo`;
        if (!(parseInt(d.empaques, 10) > 0)) return `Fila ${idx + 1}: cantidad debe ser mayor a 0`;
        if (!(parseInt(d.precioUnitario, 10) > 0)) return `Fila ${idx + 1}: precio debe ser mayor a $0`;
        return null;
      }).filter(Boolean);
      showNotification(`Corrija las filas antes de confirmar: ${ejemplos.join(' | ')}`, 'error');
      return;
    }

    if (!isDirectPurchase && !activeOrder?.id) {
      showNotification('No hay una orden activa. Regrese al checklist y seleccione una lista.', 'error');
      return;
    }

    if (isDirectPurchase) {
      const rowsWithoutProv = detalles.filter(d => !d.proveedor?.id);
      if (rowsWithoutProv.length > 0) {
        showNotification('Para una compra directa, todas las filas deben tener un proveedor seleccionado.', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (isDirectPurchase) {
        const rawF = String(flete).replace(/\D/g, '');
        const fleteNum = parseInt(rawF, 10) || 0;
        
        await apiClient.post('/purchases', {
          esDirecta: true,
          idOrden: activeOrder?.id || null,
          fechaCompra: new Date().toISOString(),
          total: totalCompra,
          totalSinIva: totalSinIvaCompra,
          totalIva: totalIvaCompra,
          fleteGlobal: fleteNum,
          observaciones: 'Compra Directa',
          condicion: 'CONTADO',
          detalles: detalles.map(d => {
            const fin = calculateRowFinancials(d);

            return {
              idInsumo: d.insumo.id,
              idProveedor: d.proveedor?.id || null,
              cantidad: parseInt(d.empaques, 10),
              precioUnitario: parseInt(d.precioUnitario, 10),
              tieneIva: fin.tieneIva,
              porcentajeIva: fin.porcentajeIva,
              precioIncluyeIva: fin.precioIncluyeIva,
              subtotal: fin.subtotal,
              montoIva: Number(fin.montoIva.toFixed(2)),
              subtotalSinIva: Number(fin.subtotalSinIva.toFixed(2))
            };
          })
        });

        if (typeof window !== 'undefined') {
          localStorage.removeItem('manna_direct_purchase_draft');
        }

        showNotification('Compra registrada exitosamente.', 'success');
        router.push('/operations/purchases');
      } else {
        const promesas = detalles.map(d =>
          apiClient.post(`/purchases/orders/${activeOrder.id}/items`, {
            idInsumo: d.insumo.id,
            idProveedor: d.proveedor?.id || null,
            idPresentacion: null,
            cantidad: parseInt(d.empaques, 10),
            precioEstimado: parseInt(d.precioUnitario, 10)
          })
        );

        await Promise.all(promesas);

        if (typeof window !== 'undefined') {
          localStorage.removeItem('manna_direct_purchase_draft');
        }

        showNotification('Ítems incorporados a la orden exitosamente.', 'success');
        
        if (typeof refreshOrder === 'function') {
          await refreshOrder();
        } else {
          setPhase(1);
        }
      }
    } catch (err) {
      console.error('Error detallado del backend:', err, err?.response?.data);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Error al confirmar compras.';
      showNotification(`Error: ${JSON.stringify(msg)}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isDirectPurchase,
    detalles,
    flete,
    setFlete,
    isSubmitting,
    containerRef,
    totalConFlete,
    totalSinIvaCompra,
    totalIvaCompra,
    totalCompra,
    addRow,
    addRowFromStock,
    clearDraft,
    removeRow,
    updateDetalle,
    clearInsumo,
    activeDropdown,
    setActiveDropdown,
    openDropdown,
    dropdownSearch,
    setDropdownSearch,
    filteredProveedores,
    filteredInsumosByRow,
    showNewProvModal,
    setShowNewProvModal,
    setNewProvTargetRow,
    initialProvData,
    setInitialProvData,
    showNewInsumoModal,
    setShowNewInsumoModal,
    setNewInsumoTargetRow,
    initialSupplyData,
    setInitialSupplyData,
    handleSuccessProv,
    handleSuccessInsumo,
    handleConfirmar
  };
}
