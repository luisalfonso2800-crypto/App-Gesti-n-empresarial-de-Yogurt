import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../new-purchase.module.css';
import { TrashIcon } from '@/components/ui/icons';
import { apiClient } from '@/lib/api-client';

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
  const [flete, setFlete] = useState(0);
  // Estado de envío para deshabilitar el botón durante la petición
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown activo por fila: { rowId, type: 'proveedor' | 'insumo' }
  const [activeDropdown, setActiveDropdown] = useState({ rowId: null, type: null });
  const [dropdownSearch, setDropdownSearch] = useState('');

  // Modal de nuevo proveedor al vuelo
  const [showNewProvModal, setShowNewProvModal] = useState(false);
  const [newProvForm, setNewProvForm] = useState({ nombre: '', nitCedula: '', telefono: '', personaContacto: '' });
  const [newProvTargetRow, setNewProvTargetRow] = useState(null);
  const [savingProv, setSavingProv] = useState(false);

  // Modal de nuevo insumo al vuelo
  const [showNewInsumoModal, setShowNewInsumoModal] = useState(false);
  const [newInsumoForm, setNewInsumoForm] = useState({ nombre: '', categoria: 'MATERIA_PRIMA', subcategoria: '', marca: '', unidadBase: 'kg', stockMinimo: '' });
  const [newInsumoTargetRow, setNewInsumoTargetRow] = useState(null);
  const [savingInsumo, setSavingInsumo] = useState(false);

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
  const totalCompra = detalles.reduce((acc, d) => acc + ((parseFloat(d.empaques) || 0) * (parseFloat(d.precioUnitario) || 0)), 0);
  const totalConFlete = totalCompra + (parseFloat(flete) || 0);

  /** Crea una fila vacía y la inserta al INICIO (LIFO) */
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      proveedor: null,
      provSearch: '',
      insumo: null,
      insumoSearch: '',
      empaque: 'Unidad',
      contenidoNeto: '',
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

  const filteredInsumos = (search) =>
    insumosDB.filter(i => i.nombre.toLowerCase().includes((search || '').toLowerCase()));

  // ---- Alta rápida de Proveedor al vuelo ----
  const handleCreateProv = async () => {
    if (!newProvForm.nombre.trim()) {
      showNotification('El nombre del proveedor es obligatorio.', 'error');
      return;
    }
    setSavingProv(true);
    try {
      const p = await apiClient.post('/suppliers', {
        nombre: newProvForm.nombre.trim(),
        nitCedula: newProvForm.nitCedula.trim() || 'N/A',
        nombreContacto: newProvForm.personaContacto.trim() || null,
        telefono: newProvForm.telefono.trim() || null,
        activo: true
      });
      if (p) {
        setProveedoresDB(prev => [...prev, p]);
        if (newProvTargetRow !== null) {
          updateDetalle(newProvTargetRow, 'proveedor', p);
          updateDetalle(newProvTargetRow, 'provSearch', p.nombre);
        }
        setShowNewProvModal(false);
        setNewProvForm({ nombre: '', nitCedula: '', telefono: '', personaContacto: '' });
        showNotification('Proveedor registrado exitosamente.', 'success');
      }
    } catch (err) {
      showNotification('Error al registrar proveedor.', 'error');
    } finally {
      setSavingProv(false);
    }
  };

  // ---- Alta rápida de Insumo al vuelo ----
  const handleCreateInsumo = async () => {
    if (!newInsumoForm.nombre.trim()) {
      showNotification('El nombre del insumo es obligatorio.', 'error');
      return;
    }
    setSavingInsumo(true);
    try {
      // Payload alineado exactamente con el schema de Prisma para Insumo
      const payload = {
        nombre: newInsumoForm.nombre.trim(),
        categoria: newInsumoForm.categoria,
        subcategoria: newInsumoForm.subcategoria || 'N/A',
        marca: newInsumoForm.marca || 'N/A',
        unidadBase: newInsumoForm.unidadBase,
        stockMinimo: parseFloat(newInsumoForm.stockMinimo) || 0
      };
      const i = await apiClient.post('/supplies', payload);
      if (i) {
        setInsumosDB(prev => [...prev, i]);
        // Selecciona automáticamente el insumo recién creado en la fila activa
        if (newInsumoTargetRow !== null) {
          updateDetalle(newInsumoTargetRow, 'insumo', i);
          updateDetalle(newInsumoTargetRow, 'insumoSearch', i.nombre);
          updateDetalle(newInsumoTargetRow, 'unidadMedida', i.unidadBase || 'kg');
        }
        setShowNewInsumoModal(false);
        setNewInsumoForm({ nombre: '', categoria: 'MATERIA_PRIMA', subcategoria: '', marca: '', unidadBase: 'kg', stockMinimo: '' });
        showNotification(`Insumo "${i.nombre}" registrado y seleccionado.`, 'success');
      }
    } catch (err) {
      const serverError = err?.response?.data?.message || err?.response?.data?.error || err?.message;
      console.error('Detalle error insumo:', err?.response?.data);
      showNotification(`Error al registrar insumo: ${JSON.stringify(serverError)}`, 'error');
    } finally {
      setSavingInsumo(false);
    }
  };

  // ---- Confirmar e Incorporar a la Orden / Guardar Compra Directa ----
  const handleConfirmar = async () => {
    // Validación estricta: solo filas con insumo, cantidad > 0 y precioUnitario > 0
    const filasIncompletas = detalles.filter(d => !d.insumo?.id || parseFloat(d.empaques) <= 0 || parseFloat(d.precioUnitario) <= 0 || isNaN(parseFloat(d.empaques)) || isNaN(parseFloat(d.precioUnitario)));
    if (filasIncompletas.length > 0) {
      const ejemplos = filasIncompletas.map((d, idx) => {
        if (!d.insumo?.id) return `Fila ${idx + 1}: falta seleccionar insumo`;
        if (!(parseFloat(d.empaques) > 0)) return `Fila ${idx + 1}: cantidad debe ser mayor a 0`;
        if (!(parseFloat(d.precioUnitario) > 0)) return `Fila ${idx + 1}: precio debe ser mayor a $0`;
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
        // Agrupar detalles por proveedor para crear compras reales (POST /purchases)
        const grouped = detalles.reduce((acc, row) => {
          const provId = row.proveedor.id;
          if (!acc[provId]) acc[provId] = [];
          acc[provId].push(row);
          return acc;
        }, {});

        const promesas = Object.keys(grouped).map(provId => {
          const rows = grouped[provId];
          const subtotalProv = rows.reduce((sum, d) => sum + (parseFloat(d.empaques) * parseFloat(d.precioUnitario)), 0);
          // Si hay varios proveedores, dividimos el flete (o se lo asignamos todo al primero, lo más justo es dividirlo proporcionalmente o simplemente sumarlo al primero). Aquí lo sumamos dividido para simplicidad, pero lo correcto según el backend es enviarlo global. Como el backend no divide fletes, pasamos el flete solo al primero o fraccionado.
          // Para simplificar, enviaremos el flete global en la primera compra de la lista.
          const fleteProporcional = (parseFloat(flete) || 0) / Object.keys(grouped).length;
          
          return apiClient.post('/purchases', {
            idProveedor: provId,
            idOrden: activeOrder?.id || null,
            fechaCompra: new Date().toISOString(),
            total: subtotalProv + fleteProporcional,
            observaciones: 'Compra Directa',
            condicion: 'CONTADO',
            detalles: rows.map(d => ({
              idInsumo: d.insumo.id,
              cantidad: parseFloat(d.empaques), // empaques es la cantidad que compró
              precioUnitario: parseFloat(d.precioUnitario),
              subtotal: parseFloat(d.empaques) * parseFloat(d.precioUnitario),
              presentacion: d.empaque || 'N/A',
              empaques: parseFloat(d.empaques),
              contenidoBase: parseFloat(d.contenidoNeto) || 1,
              unidadEmpaque: d.unidadMedida || 'Unidad',
              cantidadBaseTotal: parseFloat(d.empaques) * (parseFloat(d.contenidoNeto) || 1),
              costoBase: parseFloat(d.precioUnitario) / (parseFloat(d.contenidoNeto) || 1),
              marca: d.marca || ''
            }))
          });
        });

        await Promise.all(promesas);
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
            cantidad: parseFloat(d.empaques),
            precioEstimado: parseFloat(d.precioUnitario)
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

      {/* Modal Alta Rápida de Proveedor */}
      {showNewProvModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitle}>Nuevo Proveedor</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre / Razón Social *</label>
              <input type="text" className={styles.input} value={newProvForm.nombre}
                onChange={e => setNewProvForm(p => ({ ...p, nombre: e.target.value }))} autoFocus />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>NIT / Cédula (opcional)</label>
              <input type="text" className={styles.input} placeholder="Opcional" value={newProvForm.nitCedula}
                onChange={e => setNewProvForm(p => ({ ...p, nitCedula: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Teléfono</label>
              <input type="text" className={styles.input} value={newProvForm.telefono}
                onChange={e => setNewProvForm(p => ({ ...p, telefono: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Persona de Contacto</label>
              <input type="text" className={styles.input} value={newProvForm.personaContacto}
                onChange={e => setNewProvForm(p => ({ ...p, personaContacto: e.target.value }))} />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowNewProvModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={handleCreateProv} disabled={savingProv}>
                {savingProv ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alta Rápida de Insumo */}
      {showNewInsumoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitle}>Nuevo Insumo</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre del Insumo *</label>
              <input type="text" className={styles.input} value={newInsumoForm.nombre}
                onChange={e => setNewInsumoForm(p => ({ ...p, nombre: e.target.value }))} autoFocus />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Categoría</label>
              <select className={styles.select} value={newInsumoForm.categoria}
                onChange={e => setNewInsumoForm(p => ({ ...p, categoria: e.target.value }))}>
                <option value="MATERIA_PRIMA">Materia Prima</option>
                <option value="EMPAQUE">Empaque</option>
                <option value="LIMPIEZA">Limpieza</option>
                <option value="INSUMO_GENERAL">Insumo General</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Unidad Base</label>
              <select className={styles.select} value={newInsumoForm.unidadBase}
                onChange={e => setNewInsumoForm(p => ({ ...p, unidadBase: e.target.value }))}>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="Unidades">Unidades</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Stock Mínimo</label>
              <input type="number" className={styles.input} min="0" step="any" value={newInsumoForm.stockMinimo}
                onChange={e => setNewInsumoForm(p => ({ ...p, stockMinimo: e.target.value }))} />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowNewInsumoModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={handleCreateInsumo} disabled={savingInsumo}>
                {savingInsumo ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR STICKY */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: '#fff', borderBottom: '2px solid #e5e7eb',
        padding: '0.75rem 1.5rem', display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', gap: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}>
        <button type="button" onClick={() => isDirectPurchase ? router.push('/operations/purchases') : setPhase(1)} className={styles.cancelBtn} style={{ margin: 0 }}>
          {isDirectPurchase ? '← Volver a Compras' : '← Volver a Checklist'}
        </button>
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, flex: 1 }}>
          {isDirectPurchase ? 'Nueva Compra Directa' : `Registro de Compras Adicionales (En Ruta) — ${generatedId}`}
        </h2>
        <div style={{ fontWeight: 700, color: '#166534', fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
          Total: ${totalConFlete.toFixed(2)}
        </div>
        <button type="button" className={styles.addBtn} onClick={addRow} style={{ margin: 0, whiteSpace: 'nowrap' }}>
          + Añadir Fila
        </button>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleConfirmar}
          disabled={isSubmitting || detalles.length === 0}
          style={{ margin: 0, whiteSpace: 'nowrap' }}
        >
          {isSubmitting ? (isDirectPurchase ? 'Guardando...' : 'Confirmando...') : (isDirectPurchase ? 'Guardar y Registrar Compra' : 'Confirmar e Incorporar a la Orden')}
        </button>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Flete global */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <label className={styles.label} style={{ margin: 0, whiteSpace: 'nowrap' }}>Flete / Costo adicional global ($):</label>
          <input type="number" step="any" className={styles.input} style={{ width: '140px' }} value={flete}
            onChange={e => setFlete(parseFloat(e.target.value) || 0)} />
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
          const subtotal = (row.empaques || 0) * (row.precioUnitario || 0);

          return (
            <div key={row.id} style={{
              background: idx === 0 ? '#f0fdf4' : '#fff',
              border: `1px solid ${idx === 0 ? '#86efac' : '#e5e7eb'}`,
              borderRadius: '8px', padding: '1rem', marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                  {idx === 0 ? '⬆ Última adición' : `Fila #${idx + 1}`}
                </span>
                <button type="button" className={styles.removeBtn} onClick={() => removeRow(row.id)}>
                  <TrashIcon size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'start' }}>

                {/* Selector de Proveedor por fila */}
                <div style={{ position: 'relative' }}>
                  <label className={styles.label}>Proveedor</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Buscar proveedor..."
                    value={isProvDropOpen ? dropdownSearch : (row.proveedor?.nombre || row.provSearch || '')}
                    onFocus={() => openDropdown(row.id, 'proveedor', row.proveedor?.nombre || row.provSearch || '')}
                    onChange={e => {
                      setDropdownSearch(e.target.value);
                      if (row.proveedor) updateDetalle(row.id, 'proveedor', null);
                      updateDetalle(row.id, 'provSearch', e.target.value);
                    }}
                  />
                  {isProvDropOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownAction} onClick={() => {
                        setNewProvTargetRow(row.id);
                        setNewProvForm({ nombre: dropdownSearch, nitCedula: '', telefono: '', personaContacto: '' });
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

                {/* Selector de Insumo por fila */}
                <div style={{ position: 'relative' }}>
                  <label className={styles.label}>Insumo *</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Buscar insumo..."
                    value={isInsumoDropOpen ? dropdownSearch : (row.insumo?.nombre || row.insumoSearch || '')}
                    onFocus={() => openDropdown(row.id, 'insumo', row.insumo?.nombre || row.insumoSearch || '')}
                    onChange={e => {
                      setDropdownSearch(e.target.value);
                      if (row.insumo) updateDetalle(row.id, 'insumo', null);
                      updateDetalle(row.id, 'insumoSearch', e.target.value);
                    }}
                  />
                  {isInsumoDropOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownAction} onClick={() => {
                        setNewInsumoTargetRow(row.id);
                        setNewInsumoForm({ nombre: dropdownSearch, categoria: 'MATERIA_PRIMA', subcategoria: '', marca: '', unidadBase: 'kg', stockMinimo: '' });
                        setShowNewInsumoModal(true);
                        setActiveDropdown({ rowId: null, type: null });
                      }}>
                        + Nuevo Insumo
                      </div>
                      {filteredInsumos(dropdownSearch).map(i => (
                        <div key={i.id} className={styles.dropdownItem} onClick={() => {
                          updateDetalle(row.id, 'insumo', i);
                          updateDetalle(row.id, 'insumoSearch', i.nombre);
                          updateDetalle(row.id, 'unidadMedida', i.unidadBase || 'kg');
                          setActiveDropdown({ rowId: null, type: null });
                        }}>
                          {i.nombre} <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>({i.unidadBase})</span>
                        </div>
                      ))}
                      {filteredInsumos(dropdownSearch).length === 0 && (
                        <div style={{ padding: '0.5rem', color: '#9ca3af', fontSize: '0.8rem' }}>Sin resultados</div>
                      )}
                    </div>
                  )}
                  {row.insumo && (
                    <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                      Unidad: {row.insumo.unidadBase} | Stock mín: {row.insumo.stockMinimo || 0}
                    </span>
                  )}
                </div>

                {/* Empaque / Presentación */}
                <div>
                  <label className={styles.label}>Empaque</label>
                  <input type="text" className={styles.input} placeholder="Bulto, Saco..." value={row.empaque}
                    onChange={e => updateDetalle(row.id, 'empaque', e.target.value)} />
                </div>

                {/* Contenido por empaque + unidad */}
                <div>
                  <label className={styles.label}>Contenido x Empaque</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <input type="number" step="any" className={styles.input} placeholder="0" value={row.contenidoNeto}
                      onChange={e => updateDetalle(row.id, 'contenidoNeto', e.target.value)}
                      style={{ flex: 1 }} />
                    <select className={styles.select} value={row.unidadMedida}
                      onChange={e => updateDetalle(row.id, 'unidadMedida', e.target.value)} style={{ width: '60px' }}>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="Unidades">u</option>
                    </select>
                  </div>
                </div>

                {/* Marca */}
                <div>
                  <label className={styles.label}>Marca</label>
                  <input type="text" className={styles.input} placeholder="Opcional" value={row.marca}
                    onChange={e => updateDetalle(row.id, 'marca', e.target.value)} />
                </div>

                {/* Cantidad de empaques */}
                <div>
                  <label className={styles.label}>Cant. Empaques</label>
                  <input type="number" min="0" step="any" className={styles.input} placeholder="0" value={row.empaques}
                    onChange={e => updateDetalle(row.id, 'empaques', e.target.value)} />
                </div>

                {/* Precio unitario real pagado */}
                <div>
                  <label className={styles.label}>Precio Unitario ($)</label>
                  <input type="number" step="any" className={styles.input} placeholder="0.00" value={row.precioUnitario}
                    onChange={e => updateDetalle(row.id, 'precioUnitario', e.target.value)} />
                </div>

                {/* Resumen de fila */}
                <div style={{ background: '#f3f4f6', borderRadius: '6px', padding: '0.5rem', fontSize: '0.8rem' }}>
                  <div>Ingreso: <b>{((parseFloat(row.empaques) || 0) * (parseFloat(row.contenidoNeto) || 0)).toFixed(2)} {row.unidadMedida}</b></div>
                  <div>Subtotal: <b>${((parseFloat(row.empaques) || 0) * (parseFloat(row.precioUnitario) || 0)).toFixed(2)}</b></div>
                </div>

              </div>
            </div>
          );
        })}

        {/* Resumen final */}
        {detalles.length > 0 && (
          <div className={styles.summary} style={{ marginTop: '1rem' }}>
            Total Compras Adicionales: ${totalConFlete.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
