import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../new-purchase.module.css';
import { TrashIcon } from '@/components/ui/icons';
import { apiClient } from '@/lib/api-client';
import { montoATextoPesos } from '@/utils/numberToWords';
import { SupplierModal } from '@/components/catalog/SupplierModal';
import { SupplyModal } from '@/components/catalog/SupplyModal';

/**
 * @file FormPhase.jsx
 * @module components/FormPhase
 * @description Registro de Compras Adicionales (En Ruta) — Fase 2 del proceso de compras.
 * @responsibility Permitir el registro de compras imprevistas multi-proveedor con
 *                 selección o alta rápida de proveedor/insumo por fila, orden LIFO,
 *                 barra sticky superior y confirmación atómica hacia la orden activa.
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies TrashIcon, apiClient, styles
 */
export function FormPhase({
  proveedoresDB: proveedoresDBProp,
  insumosDB: insumosDBProp,
  supplierPrices,
  setPhase,
  showNotification,
  activeOrder,
  refreshOrder,
  router
}) {
  const searchParams = useSearchParams();
  const isDirectPurchase = searchParams.get('mode') === 'direct' || (!activeOrder && searchParams.get('manual') === 'true');

  // Catálogo local de proveedores e insumos (se expande si se crean nuevos al vuelo)
  const [proveedoresDB, setProveedoresDB] = useState(proveedoresDBProp || []);
  const [insumosDB, setInsumosDB] = useState(insumosDBProp || []);

  // LIFO: cada fila nueva se inserta al inicio del array
  const [detalles, setDetalles] = useState([]);

  // Flete global adicional (costo de transporte de la jornada)
  const [flete, setFlete] = useState('');
  // Estado de envío para deshabilitar el botón durante la petición
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown activo por fila: { rowId, type: 'proveedor' | 'insumo' }
  const [activeDropdown, setActiveDropdown] = useState({ rowId: null, type: null });
  const [dropdownSearch, setDropdownSearch] = useState('');

  // Modal de nuevo proveedor al vuelo
  const [showNewProvModal, setShowNewProvModal] = useState(false);
  const [newProvTargetRow, setNewProvTargetRow] = useState(null);
  const [initialProvData, setInitialProvData] = useState({});

  // Modal de nuevo insumo al vuelo
  const [showNewInsumoModal, setShowNewInsumoModal] = useState(false);
  const [newInsumoTargetRow, setNewInsumoTargetRow] = useState(null);
  const [initialSupplyData, setInitialSupplyData] = useState({});

  const containerRef = useRef(null);

  // Sincroniza props si el parent recarga los catálogos
  useEffect(() => { setProveedoresDB(proveedoresDBProp || []); }, [proveedoresDBProp]);
  useEffect(() => { setInsumosDB(insumosDBProp || []); }, [insumosDBProp]);

  // Cierra dropdowns al hacer click fuera del contenedor
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveDropdown({ rowId: null, type: null });
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Totales calculados en tiempo real
  const totalCompra = detalles.reduce((acc, d) => acc + ((parseInt(d.empaques, 10) || 0) * (parseInt(d.precioUnitario, 10) || 0)), 0);
  const rawFlete = String(flete).replace(/\D/g, '');
  const totalConFlete = totalCompra + (parseInt(rawFlete, 10) || 0);

  /** Crea una fila vacía y la inserta al INICIO (LIFO) */
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
      precioUnitario: ''
    };
    setDetalles(prev => [newRow, ...prev]);
  };

  const removeRow = (id) => {
    setDetalles(prev => prev.filter(d => d.id !== id));
  };

  const updateDetalle = (id, field, value) => {
    setDetalles(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  // Apertura de dropdown con búsqueda
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
    } else if (row.proveedor?.id) {
      showingAll = true;
    } else {
      showingAll = true;
    }

    const filtered = baseList.filter(i => i.nombre.toLowerCase().includes((search || '').toLowerCase()));
    return { filtered, showingAll };
  };

  // ---- Callbacks de éxito para Modales Centralizados ----
  const handleSuccessProv = (p) => {
    if (p) {
      // Evitar duplicados si ya existe
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
      // Evitar duplicados si ya existe
      setInsumosDB(prev => prev.some(existing => existing.id === i.id) ? prev : [...prev, i]);
      // Selecciona automáticamente el insumo recién creado en la fila activa
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

  // ---- Confirmar e Incorporar a la Orden / Guardar Compra Directa ----
  const handleConfirmar = async () => {
    // Validación estricta: solo filas con insumo, cantidad > 0 y precioUnitario > 0
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
        const totalDetalles = detalles.reduce((sum, d) => sum + (parseInt(d.empaques, 10) * parseInt(d.precioUnitario, 10)), 0);
        const rawF = String(flete).replace(/\D/g, '');
        
        await apiClient.post('/purchases', {
          esDirecta: true,
          idOrden: activeOrder?.id || null,
          fechaCompra: new Date().toISOString(),
          total: totalDetalles,
          fleteGlobal: parseInt(rawF, 10) || 0,
          observaciones: 'Compra Directa',
          condicion: 'CONTADO',
          detalles: detalles.map(d => ({
            idInsumo: d.insumo.id,
            idProveedor: d.proveedor?.id || null,
            cantidad: parseInt(d.empaques, 10),
            precioUnitario: parseInt(d.precioUnitario, 10),
            subtotal: parseInt(d.empaques, 10) * parseInt(d.precioUnitario, 10),
            presentacion: d.empaque || 'N/A',
            empaques: parseInt(d.empaques, 10),
            contenidoBase: parseFloat(d.contenidoNeto) || 1,
            unidadEmpaque: d.unidadMedida || 'Unidad',
            cantidadBaseTotal: parseInt(d.empaques, 10) * (parseFloat(d.contenidoNeto) || 1),
            costoBase: parseInt(d.precioUnitario, 10) / (parseFloat(d.contenidoNeto) || 1),
            marca: d.marca || ''
          }))
        });

        showNotification('Compra registrada exitosamente.', 'success');
        router.push('/operations/purchases');
      } else {
        // Incorpora cada fila como ítem a la orden activa existente usando el endpoint de adición
        // Contrato: POST /purchases/orders/:id/items → { idInsumo, idProveedor, idPresentacion, cantidad, precioEstimado }
        const promesas = detalles.map(d =>
          apiClient.post(`/purchases/orders/${activeOrder.id}/items`, {
            idInsumo: d.insumo.id,
            idProveedor: d.proveedor?.id || null,
            idPresentacion: null,             // No aplica en compras adicionales en ruta
            cantidad: parseInt(d.empaques, 10),
            precioEstimado: parseInt(d.precioUnitario, 10)
          })
        );

        await Promise.all(promesas);

        showNotification('Ítems incorporados a la orden exitosamente.', 'success');
        
        // Llama a la recarga explícita del orquestador si se pasa por props
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

  const generatedId = activeOrder?.codigo || 'En curso';

  return (
    <div className={styles.container} ref={containerRef}>

      {/* Modal Alta Rápida de Proveedor centralizado */}
      <SupplierModal 
        isOpen={showNewProvModal} 
        onClose={() => setShowNewProvModal(false)}
        onSuccess={handleSuccessProv}
        initialData={initialProvData}
      />

      {/* Modal Alta Rápida de Insumo centralizado */}
      <SupplyModal 
        isOpen={showNewInsumoModal} 
        onClose={() => setShowNewInsumoModal(false)}
        onSuccess={handleSuccessInsumo}
        initialData={initialSupplyData}
      />

      {/* BARRA SUPERIOR STICKY */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: '#fff', borderBottom: '2px solid #e5e7eb',
        padding: '0.75rem 1.5rem', display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', gap: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}>
        <button 
          type="button" 
          onClick={() => isDirectPurchase ? router.push('/operations/purchases') : setPhase(1)} 
          className={styles.cancelBtn} 
          style={{ 
            margin: 0, 
            border: '1px solid #d1d5db', 
            background: '#fafaf9', 
            color: '#374151',
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.borderColor = '#fbbf24'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fafaf9'; e.currentTarget.style.borderColor = '#d1d5db'; }}
        >
          {isDirectPurchase ? '← Volver a Compras' : '← Volver a Checklist'}
        </button>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, flex: 1 }}>
          {isDirectPurchase ? 'Nueva Compra Directa' : `Registro de Compras Adicionales (En Ruta) — ${generatedId}`}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ fontWeight: 700, color: '#166534', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
            Total: ${totalConFlete.toLocaleString('es-CO')}
          </div>
          {totalConFlete > 0 && (
            <div style={{ fontSize: '0.8rem', color: '#059669', fontStyle: 'italic', fontWeight: 'normal' }}>
              ✦ {montoATextoPesos(totalConFlete)}
            </div>
          )}
        </div>
        <button type="button" className={styles.addBtn} onClick={addRow} style={{ margin: 0, whiteSpace: 'nowrap' }}>
          + Añadir Fila
        </button>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleConfirmar}
          disabled={isSubmitting || detalles.length === 0}
          style={{ 
            margin: 0, 
            whiteSpace: 'nowrap',
            ...(detalles.length === 0 ? { cursor: 'not-allowed', opacity: 0.5, filter: 'grayscale(100%)' } : {})
          }}
        >
          {isSubmitting ? (isDirectPurchase ? 'Guardando...' : 'Confirmando...') : (isDirectPurchase ? 'Guardar y Registrar Compra' : 'Confirmar e Incorporar a la Orden')}
        </button>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Flete global */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.25rem' }}>
          {/* FILA 1: Label + Input numérico + Valor en letras al frente */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#182622', whiteSpace: 'nowrap' }}>
              Flete / Costo adicional global ($):
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={flete}
              onChange={e => {
                let val = e.target.value.replace(/\D/g, '');
                if (val !== '') {
                  val = parseInt(val, 10).toLocaleString('es-CO');
                }
                setFlete(val);
              }}
              style={{
                width: '140px',
                padding: '0.4rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #D6D3D1',
                fontSize: '0.88rem',
                fontWeight: '600',
                color: '#182622',
                backgroundColor: '#FFFFFF',
                textAlign: 'right',
                outline: 'none'
              }}
            />

            {/* Valor en letras posicionado al frente como pill táctico */}
            {flete !== '' && Number(flete.replace(/\D/g, '')) > 0 && (
              <span style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                color: '#182622',
                backgroundColor: '#F7F4EE',
                border: '1px solid #CAD5B5',
                padding: '0.32rem 0.65rem',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}>
                <span style={{ color: '#10B981', fontSize: '0.7rem' }}>✦</span>
                {montoATextoPesos(flete)}
              </span>
            )}
          </div>

          {/* FILA 2: Descripción y contexto */}
          <span style={{ fontSize: '0.72rem', color: '#78716C', fontStyle: 'italic', paddingLeft: '0.1rem' }}>
            Transportes, domicilios o lo que costó ir a buscar estos productos
          </span>
        </div>

        {/* Estado vacío */}
        {detalles.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', background: '#f9fafb', borderRadius: '8px', border: '2px dashed #d1d5db', color: '#6b7280' }}>
            <p style={{ margin: 0 }}>No hay filas de compra registradas.<br/>Pulse <b>+ Añadir Fila</b> para comenzar.</p>
          </div>
        )}

        {/* Lista LIFO de filas de compra (última agregada arriba) */}
        {detalles.map((row, idx) => {
          const isProvDropOpen = activeDropdown.rowId === row.id && activeDropdown.type === 'proveedor';
          const isInsumoDropOpen = activeDropdown.rowId === row.id && activeDropdown.type === 'insumo';

          return (
            <div
              key={row.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5DFD5',
                borderLeft: idx === 0 ? '4px solid #10B981' : '1px solid #E5DFD5',
                padding: '1rem 1.25rem',
                marginBottom: '1rem',
                boxShadow: '0 2px 5px rgba(24, 38, 34, 0.04)',
                position: 'relative',
                transition: 'border-color 0.2s ease'
              }}
            >
              {/* CABECERA SUPERIOR DE LA TARJETA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {idx === 0 && (
                    <span style={{
                      backgroundColor: '#ECFDF5',
                      color: '#065F46',
                      border: '1px solid #A7F3D0',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      letterSpacing: '0.04em'
                    }}>
                      ✦ ÚLTIMA ADICIÓN
                    </span>
                  )}
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#78716C' }}>
                    ÍTEM #{idx + 1}
                  </span>
                </div>

                {/* Botón eliminar fila */}
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#A8A29E',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'color 0.15s, background-color 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#A8A29E'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                  title="Eliminar este ítem"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>

              {/* LÍNEA 1: ESPECIFICACIÓN DEL INSUMO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1fr 1.2fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                {/* Proveedor */}
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#182622', marginBottom: '0.25rem' }}>
                    Proveedor
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Colanta, Disar..."
                    value={isProvDropOpen ? dropdownSearch : (row.proveedor?.nombre || row.provSearch || '')}
                    onFocus={() => openDropdown(row.id, 'proveedor', row.proveedor?.nombre || row.provSearch || '')}
                    onChange={e => {
                      setDropdownSearch(e.target.value);
                      if (row.proveedor) updateDetalle(row.id, 'proveedor', null);
                      updateDetalle(row.id, 'provSearch', e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.45rem 2rem 0.45rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.82rem',
                      color: '#182622',
                      backgroundColor: '#FAFAF9'
                    }}
                  />
                  {(row.proveedor || row.provSearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        updateDetalle(row.id, 'proveedor', null);
                        updateDetalle(row.id, 'provSearch', '');
                      }}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-20%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        fontSize: '1rem',
                        padding: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1
                      }}
                      title="Limpiar proveedor"
                    >
                      ✕
                    </button>
                  )}
                  {isProvDropOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownAction} onClick={() => {
                        setNewProvTargetRow(row.id);
                        setInitialProvData({ nombre: dropdownSearch });
                        setShowNewProvModal(true);
                        setActiveDropdown({ rowId: null, type: null });
                      }}>
                        + Nuevo Proveedor
                      </div>
                      {filteredProveedores(dropdownSearch).map(p => (
                        <div key={p.id} className={styles.dropdownItem} onClick={() => {
                          updateDetalle(row.id, 'proveedor', p);
                          updateDetalle(row.id, 'provSearch', p.nombre);
                          setActiveDropdown({ rowId: null, type: null });
                        }}>
                          {p.nombre}
                        </div>
                      ))}
                      {filteredProveedores(dropdownSearch).length === 0 && (
                        <div style={{ padding: '0.5rem', color: '#9ca3af', fontSize: '0.8rem' }}>Sin resultados</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Insumo */}
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: '700', color: '#182622' }}>
                      Insumo <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    {row.insumo && (
                      <span style={{ fontSize: '0.62rem', color: '#78716C' }}>
                        Unidad: {row.insumo.unidadBase || 'ml'} | Mín: {row.insumo.stockMinimo || 0}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar insumo..."
                    value={isInsumoDropOpen ? dropdownSearch : (row.insumo?.nombre || row.insumoSearch || '')}
                    onFocus={() => openDropdown(row.id, 'insumo', row.insumo?.nombre || row.insumoSearch || '')}
                    onChange={e => {
                      setDropdownSearch(e.target.value);
                      if (row.insumo) updateDetalle(row.id, 'insumo', null);
                      updateDetalle(row.id, 'insumoSearch', e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.82rem',
                      color: '#182622'
                    }}
                  />
                  {isInsumoDropOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownAction} onClick={() => {
                        setNewInsumoTargetRow(row.id);
                        setInitialSupplyData({ nombre: dropdownSearch });
                        setShowNewInsumoModal(true);
                        setActiveDropdown({ rowId: null, type: null });
                      }}>
                        + Nuevo Insumo
                      </div>
                      {(() => {
                        const { filtered, showingAll } = filteredInsumosByRow(row, dropdownSearch);
                        return (
                          <>
                            {showingAll && row.proveedor?.id && (
                              <div style={{ padding: '0.5rem', fontSize: '0.72rem', color: '#9ca3af', fontStyle: 'italic', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                Mostrando todos los insumos (sin cotización previa para este proveedor)
                              </div>
                            )}
                            {filtered.map(i => (
                              <div key={i.id} className={styles.dropdownItem} onClick={() => {
                                updateDetalle(row.id, 'insumo', i);
                                updateDetalle(row.id, 'insumoSearch', i.nombre);
                                updateDetalle(row.id, 'unidadMedida', i.unidadBase || 'kg');
                                if (i.marca && i.marca !== 'N/A') {
                                  updateDetalle(row.id, 'marca', i.marca);
                                }
                                
                                let preloaded = false;
                                if (row.proveedor?.id && supplierPrices?.length > 0) {
                                  const tarifa = supplierPrices.find(sp => sp.idProveedor === row.proveedor.id && sp.idInsumo === i.id && sp.activo);
                                  if (tarifa) {
                                    const pParts = (tarifa.presentacionCompra || '').split(' ');
                                    let matchEmpaque = pParts[0]?.toUpperCase() || 'OTRO';
                                    const allowedEmpaques = ['UNIDAD', 'BOLSA', 'CAJA', 'BULTO', 'BOTELLA', 'BIDÓN', 'CANASTILLA', 'ENVASE'];
                                    
                                    // Fix specific mapping rules
                                    if (matchEmpaque === 'PAQUETE') matchEmpaque = 'BOLSA / PAQUETE';
                                    else if (matchEmpaque === 'SACO') matchEmpaque = 'BULTO / SACO';
                                    else if (matchEmpaque === 'FRASCO') matchEmpaque = 'BOTELLA / FRASCO';
                                    else if (matchEmpaque === 'GARRAFA') matchEmpaque = 'BIDÓN / GARRAFA';
                                    else if (matchEmpaque === 'BOLSA') matchEmpaque = 'BOLSA / PAQUETE';
                                    else if (matchEmpaque === 'BULTO') matchEmpaque = 'BULTO / SACO';
                                    else if (matchEmpaque === 'BOTELLA') matchEmpaque = 'BOTELLA / FRASCO';
                                    else if (matchEmpaque === 'BIDÓN') matchEmpaque = 'BIDÓN / GARRAFA';
                                    else if (!allowedEmpaques.includes(matchEmpaque)) matchEmpaque = 'OTRO';

                                    updateDetalle(row.id, 'empaqueTipo', matchEmpaque);
                                    updateDetalle(row.id, 'empaque', matchEmpaque === 'OTRO' ? pParts[0]?.toUpperCase() : (tarifa.presentacionCompra || 'UNIDAD').toUpperCase());
                                    updateDetalle(row.id, 'contenidoNeto', tarifa.cantidadEquivalenteBase || 1);
                                    updateDetalle(row.id, 'unidadMedida', tarifa.unidadPresentacion || i.unidadBase || 'kg');
                                    updateDetalle(row.id, 'precioUnitario', tarifa.precioCompra || 0);
                                    preloaded = true;
                                  }
                                }
                                
                                if (!preloaded && i.costoBase) {
                                  updateDetalle(row.id, 'precioUnitario', i.costoBase);
                                }
                                setActiveDropdown({ rowId: null, type: null });
                              }}>
                                {i.nombre} <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>({i.unidadBase})</span>
                              </div>
                            ))}
                            {filtered.length === 0 && (
                              <div style={{ padding: '0.5rem', color: '#9ca3af', fontSize: '0.8rem' }}>Sin resultados</div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Marca */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#182622', marginBottom: '0.25rem' }}>
                    Marca
                  </label>
                  <input
                    type="text"
                    placeholder="Marca del producto..."
                    value={row.marca || ''}
                    onChange={e => {
                      const val = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase();
                      updateDetalle(row.id, 'marca', val);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.82rem',
                      color: '#182622',
                      textTransform: 'uppercase'
                    }}
                  />
                </div>

                {/* Empaque y Presentación combinada */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#182622', marginBottom: '0.25rem' }}>
                    Empaque / Contenido por unidad
                  </label>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <select
                      value={row.empaqueTipo || 'UNIDAD'}
                      onChange={e => {
                        const tipo = e.target.value;
                        updateDetalle(row.id, 'empaqueTipo', tipo);
                        if (tipo === 'UNIDAD') {
                          updateDetalle(row.id, 'contenidoNeto', '1');
                          updateDetalle(row.id, 'empaque', 'UNIDAD');
                        } else if (tipo !== 'OTRO') {
                          updateDetalle(row.id, 'empaque', tipo);
                        } else {
                          updateDetalle(row.id, 'empaque', '');
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.4rem',
                        borderRadius: '6px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.75rem',
                        color: '#182622',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <option value="UNIDAD">UNIDAD</option>
                      <option value="BOLSA / PAQUETE">BOLSA</option>
                      <option value="CAJA">CAJA</option>
                      <option value="BULTO / SACO">BULTO</option>
                      <option value="BOTELLA / FRASCO">BOTELLA</option>
                      <option value="BIDÓN / GARRAFA">BIDÓN</option>
                      <option value="CANASTILLA">CANASTILLA</option>
                      <option value="ENVASE">ENVASE</option>
                      <option value="OTRO">OTRO</option>
                    </select>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Contenido c/u"
                      value={row.contenidoNeto ? row.contenidoNeto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : ''}
                      disabled={row.empaqueTipo === 'UNIDAD'}
                      onChange={e => {
                        let raw = e.target.value.replace(/[^0-9.]/g, '');
                        if ((raw.match(/\./g) || []).length > 1) raw = raw.replace(/\.+$/, '');
                        updateDetalle(row.id, 'contenidoNeto', raw);
                      }}
                      style={{
                        width: '65px',
                        padding: '0.45rem 0.4rem',
                        borderRadius: '6px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.82rem',
                        textAlign: 'right',
                        backgroundColor: row.empaqueTipo === 'UNIDAD' ? '#f3f4f6' : '#FFFFFF'
                      }}
                    />
                    <select
                      value={row.unidadMedida || 'kg'}
                      disabled={row.empaqueTipo === 'UNIDAD'}
                      onChange={e => updateDetalle(row.id, 'unidadMedida', e.target.value)}
                      style={{
                        width: '55px',
                        padding: '0.45rem 0.2rem',
                        borderRadius: '6px',
                        border: '1px solid #D6D3D1',
                        fontSize: '0.75rem',
                        backgroundColor: row.empaqueTipo === 'UNIDAD' ? '#f3f4f6' : '#FAFAF9'
                      }}
                    >
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="oz">oz</option>
                      <option value="Unidades">und</option>
                    </select>
                  </div>
                  {row.empaqueTipo === 'OTRO' && (
                    <input type="text" style={{ marginTop: '0.25rem', textTransform: 'uppercase', width: '100%', padding: '0.45rem 0.6rem', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.82rem' }} placeholder="Especifique empaque" value={row.empaque || ''} onChange={e => updateDetalle(row.id, 'empaque', e.target.value.toUpperCase())} />
                  )}
                </div>
              </div>

              {/* LÍNEA 2: TRANSACCIÓN ECONÓMICA Y CÁLCULOS EN VIVO */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '130px 240px 1fr',
                gap: '1.25rem',
                alignItems: 'flex-start',
                backgroundColor: '#F7F4EE',
                padding: '0.85rem 1.25rem',
                borderRadius: '6px',
                border: '1px solid #EFEAE1'
              }}>
                {/* 1. Cantidad de Empaques */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#182622',
                    marginBottom: '0.35rem',
                    minHeight: '1rem',
                    lineHeight: '1rem'
                  }}>
                    Cant. Empaques
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={row.empaques ? row.empaques.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
                    onChange={e => {
                      let raw = e.target.value.replace(/\D/g, '');
                      updateDetalle(row.id, 'empaques', raw);
                    }}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: '#182622',
                      backgroundColor: '#FFFFFF',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* 2. Precio Unitario con conversión inline limpia */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    color: '#182622',
                    marginBottom: '0.35rem',
                    minHeight: '1rem',
                    lineHeight: '1rem'
                  }}>
                    Precio Unitario ($)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={row.precioUnitario ? row.precioUnitario.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
                    onChange={e => {
                      let raw = e.target.value.replace(/\D/g, '');
                      updateDetalle(row.id, 'precioUnitario', raw);
                    }}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #D6D3D1',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: '#182622',
                      backgroundColor: '#FFFFFF',
                      textAlign: 'right',
                      boxSizing: 'border-box'
                    }}
                  />
                  {row.precioUnitario && parseInt(row.precioUnitario, 10) > 0 && (
                    <span style={{
                      fontSize: '0.68rem',
                      color: '#065F46',
                      fontWeight: '600',
                      marginTop: '0.35rem',
                      lineHeight: 1.2
                    }}>
                      ✦ {montoATextoPesos(parseInt(row.precioUnitario, 10) || 0)}
                    </span>
                  )}
                </div>

                {/* 3. Panel Separado: Ingreso Neto y Subtotal */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  gap: '3rem',
                  paddingLeft: '1.5rem',
                  borderLeft: '1px solid #E5DFD5',
                  minHeight: '48px'
                }}>
                  {/* Ingreso Neto */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'block',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      color: '#78716C',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.25rem'
                    }}>
                      Ingreso Neto
                    </span>
                    <strong style={{ fontSize: '1.05rem', color: '#182622', fontWeight: '800' }}>
                      {Math.round((parseInt(row.empaques, 10) || 0) * (parseFloat(row.contenidoNeto) || 0)).toLocaleString('es-CO')} {row.unidadMedida === 'Unidades' ? 'und' : (row.unidadMedida || 'ml')}
                    </strong>
                    <span style={{ display: 'block', fontSize: '0.70rem', color: '#78716C', marginTop: '2px' }}>
                      {row.empaques && row.contenidoNeto 
                        ? `(${row.empaques} ${row.empaque?.toLowerCase() || 'empaques'} × ${Number(row.contenidoNeto).toLocaleString('es-CO')} ${row.unidadMedida || 'ml'})` 
                        : ''}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'block',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      color: '#78716C',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.25rem'
                    }}>
                      Subtotal
                    </span>
                    <strong style={{ fontSize: '1.25rem', color: '#182622', fontWeight: '900', lineHeight: 1 }}>
                      ${((parseInt(row.empaques, 10) || 0) * (parseInt(row.precioUnitario, 10) || 0)).toLocaleString('es-CO')}
                    </strong>
                    {((parseInt(row.empaques, 10) || 0) * (parseInt(row.precioUnitario, 10) || 0)) > 0 && (
                      <span style={{
                        display: 'block',
                        fontSize: '0.68rem',
                        color: '#065F46',
                        fontWeight: '600',
                        marginTop: '0.35rem'
                      }}>
                        ✦ {montoATextoPesos(((parseInt(row.empaques, 10) || 0) * (parseInt(row.precioUnitario, 10) || 0)))}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {row.insumo && (parseInt(row.empaques, 10) || 0) > 0 && (
                <div style={{
                  marginTop: '0.85rem',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: '#F7F4EE',
                  borderRadius: '6px',
                  border: '1px solid #E5DFD5',
                  fontSize: '0.76rem',
                  color: '#182622'
                }}>
                  ✦ <strong>Resumen:</strong> Comprando <strong>{row.empaques || 0} {row.empaque?.toLowerCase() || 'unidades'}</strong> de <strong>{Number(row.contenidoNeto || 1).toLocaleString('es-CO')} {row.unidadMedida || 'ml'}</strong> cada una. Ingresarán <strong>{Number(((parseInt(row.empaques, 10) || 0) * (parseFloat(row.contenidoNeto) || 1))).toLocaleString('es-CO')} {row.unidadMedida || 'ml'}</strong> de <em>{row.insumo.nombre || 'insumo'}</em> a bodega por <strong>${((parseInt(row.empaques, 10) || 0) * (parseInt(row.precioUnitario, 10) || 0)).toLocaleString('es-CO')}</strong>.
                </div>
              )}
            </div>
          );
        })}

        {/* Resumen final */}
        {detalles.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5DFD5',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            marginTop: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
          }}>
            {/* Desglose rápido */}
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#78716C' }}>
              <span>Ítems registrados: <strong style={{ color: '#182622' }}>{detalles.length}</strong></span>
              <span>Flete global: <strong style={{ color: '#182622' }}>${(parseInt(String(flete).replace(/\D/g, ''), 10) || 0).toLocaleString('es-CO')}</strong></span>
            </div>

            {/* Gran Total */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#78716C' }}>TOTAL COMPRA:</span>
                <strong style={{ fontSize: '1.4rem', fontWeight: '900', color: '#182622' }}>
                  ${totalConFlete.toLocaleString('es-CO')}
                </strong>
              </div>
              {totalConFlete > 0 && (
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#065F46', marginTop: '0.15rem' }}>
                  ✦ {montoATextoPesos(totalConFlete)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
