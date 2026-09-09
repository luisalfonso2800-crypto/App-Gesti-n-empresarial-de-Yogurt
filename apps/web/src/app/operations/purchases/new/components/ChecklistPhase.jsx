import React, { useState } from 'react';
import { ChecklistSection } from './ChecklistSection';
import styles from '../new-purchase.module.css';
import { ClockIcon, RotateCcwIcon } from '@/components/ui/icons';

/**
 * @file ChecklistPhase.jsx
 * @module components/ChecklistPhase
 * @description Fase 1 del proceso de compras: Checklist interactivo con soporte de pendientes,
 *              modal de adicion rapida y navegacion a la fase de registro de compras adicionales.
 * @responsibility Mostrar checklist agrupado por proveedor, gestionar pendientes manuales
 *                 y derivar a FormPhase (Registro de Compras Adicionales).
 * @usedBy apps/web/src/app/operations/purchases/new/page.jsx
 * @dependencies ChecklistSection, ClockIcon, RotateCcwIcon, styles
 */
export function ChecklistPhase({ checklistMgr, setPhase, proveedoresDB, activeOrder }) {
  // Lista de insumos no conseguidos / pendientes de reintento
  const [pendingItems, setPendingItems] = useState([]);
  // Resumen de compras ya asentadas en esta sesion
  const [comprasAsentadas, setComprasAsentadas] = useState([]);

  // Modal de adicion rapida de pendiente sin datos comerciales
  const [showAddPendingModal, setShowAddPendingModal] = useState(false);
  const [pendingForm, setPendingForm] = useState({ nombre: '', cantidad: '' });

  /** Fija el orderId en la URL y avanza a la Fase 2 (Registro de Compras Adicionales). */
  const proceedToForm = () => {
    if (activeOrder && activeOrder.id) {
      const url = new URL(window.location);
      if (url.searchParams.get('orderId') !== activeOrder.id) {
        url.searchParams.set('orderId', activeOrder.id);
        window.history.replaceState({}, '', url);
      }
    }
    setPhase(2);
  };

  const { checklistItems, checklistGrouped, setChecklistItems } = checklistMgr;

  /**
   * Agrega un insumo/requerimiento pendiente de forma simple (sin proveedor ni precio),
   * visible en el checklist interactivo y en la version imprimible.
   */
  const handleAddPending = () => {
    const nombre = pendingForm.nombre.trim();
    const cantidad = parseFloat(pendingForm.cantidad) || 1;
    if (!nombre) return;

    const nuevo = {
      _id: Date.now(),
      insumoData: { nombre },
      proveedorData: {},
      priceData: {},
      estadoOperativo: 'PENDIENTE',
      cantidadSolicitada: cantidad,
      precioCompraActual: 0,
      motivoNoConseguido: '',
      detalleMotivoNoConseguido: '',
      esPendienteManual: true
    };
    setChecklistItems(prev => [...prev, nuevo]);
    setPendingForm({ nombre: '', cantidad: '' });
    setShowAddPendingModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Modal de adicion rapida de pendiente */}
      {showAddPendingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitle}>Añadir Pendiente a la Lista</div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Registra un insumo o requerimiento pendiente sin datos comerciales para incluirlo en el checklist imprimible.
            </p>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre del Insumo / Requerimiento *</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Ej: Azúcar morena, Empaques plásticos..."
                value={pendingForm.nombre}
                onChange={e => setPendingForm(prev => ({ ...prev, nombre: e.target.value }))}
                autoFocus
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cantidad Estimada</label>
              <input
                type="number"
                className={styles.input}
                placeholder="Ej: 10"
                min="0"
                step="any"
                value={pendingForm.cantidad}
                onChange={e => setPendingForm(prev => ({ ...prev, cantidad: e.target.value }))}
              />
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setShowAddPendingModal(false)}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={handleAddPending} disabled={!pendingForm.nombre.trim()}>
                Añadir al Checklist
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => window.location.href = '/operations/purchases'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
              background: 'none', border: 'none', color: '#4f46e5',
              cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, padding: 0
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Volver a Compras
          </button>
          <h1 style={{ margin: '0.5rem 0 0 0' }}>Checklist de Compras</h1>

          {activeOrder && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ fontWeight: 600, color: '#1f2937', background: '#f3f4f6', padding: '0.125rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                {activeOrder.codigo}
              </span>
              <span style={{ color: '#4b5563', fontSize: '0.875rem' }}>
                {activeOrder.nombre}
              </span>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600, padding: '0.125rem 0.5rem', borderRadius: '9999px',
                background: activeOrder.estado === 'COMPLETADA' ? '#dcfce7' : activeOrder.estado === 'EN_PROCESO' ? '#dbeafe' : '#fef3c7',
                color: activeOrder.estado === 'COMPLETADA' ? '#166534' : activeOrder.estado === 'EN_PROCESO' ? '#1e40af' : '#92400e'
              }}>
                {activeOrder.estado}
              </span>
            </div>
          )}
        </div>

        <div className={styles.noPrint} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button className={styles.submitBtn} style={{ marginTop: 0, width: 'auto' }} onClick={() => window.print()}>
            Imprimir Checklist
          </button>
          {/* Boton de adicion de pendiente simple */}
          <button
            type="button"
            style={{ marginTop: 0, width: 'auto', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #f59e0b', color: '#b45309', background: '#fffbeb', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setShowAddPendingModal(true)}
          >
            + Añadir Pendiente a la Lista
          </button>
          {/* Boton de navegacion a Registro de Compras Adicionales */}
          <button className={styles.saveBtn} style={{ marginTop: 0, width: 'auto' }} onClick={proceedToForm}>
            + Registrar Compras Adicionales / Imprevistos
          </button>
        </div>
      </div>

      {/* PRINT ONLY TABLE */}
      <div className={styles.printTableContainer}>
        {Object.entries(checklistGrouped).map(([prov, items]) => (
          <div key={`print-${prov}`}>
            <h2 style={{ fontSize: '1.25rem', marginTop: '1rem' }}>Proveedor: {prov}</h2>
            <table className={styles.printTable}>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>[ ]</th>
                  <th>Insumo</th>
                  <th>Marca</th>
                  <th>Presentación</th>
                  <th>Cant.</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={`print-item-${item._id}`}>
                    <td><div className={styles.printCheckbox}></div></td>
                    <td><b>{item.insumoData?.nombre}</b><br/>{item.insumoData?.categoria}</td>
                    <td>{item.insumoData?.marca || '-'}</td>
                    <td>
                      {item.priceData?.presentacionCompra || (item.esPendienteManual ? 'Pendiente' : 'Bulto')} <br/>
                      {item.cantidadSolicitada || 1} {item.insumoData?.unidadBase || item.unidadMedida || 'u'}
                    </td>
                    <td>{item.cantidadSolicitada || ''}</td>
                    <td>{item.esPendienteManual ? 'PENDIENTE MANUAL' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* INTERACTIVE UI */}
      <div className={styles.printArea}>
        {checklistItems.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: '#fff9c4', borderRadius: '8px', border: '1px solid #fbc02d', color: '#f57f17' }}>
            <h3>⚠️ No hay insumos en el carrito de compras</h3>
            <p>Seleccione insumos desde la sección de alertas de inventario, use &quot;Añadir Pendiente&quot; para agregar manualmente, o pase a Registrar Compras Adicionales.</p>
          </div>
        ) : (
          Object.entries(checklistGrouped).map(([prov, items]) => (
            <div key={prov} className={styles.card}>
              <div className={styles.cardTitle}>Proveedor: {prov}</div>
              <ChecklistSection
                items={items}
                checklistMgr={checklistMgr}
                proveedoresDB={proveedoresDB}
                setPendingItems={setPendingItems}
                setComprasAsentadas={setComprasAsentadas}
              />
            </div>
          ))
        )}
      </div>

      {/* Insumos Pendientes / No Conseguidos */}
      {pendingItems.length > 0 && (
        <div className={`${styles.card} ${styles.pendingSection}`}>
          <div className={styles.cardTitle} style={{ color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClockIcon size={20} />
            Insumos Pendientes de Compra (No Conseguidos)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.tablePending} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #fde047', textAlign: 'left', background: '#fef9c3' }}>
                  <th style={{ padding: '0.75rem' }}>Insumo</th>
                  <th style={{ padding: '0.75rem' }}>Proveedor / Presentación</th>
                  <th style={{ padding: '0.75rem' }}>Motivo Registrado</th>
                  <th style={{ padding: '0.75rem' }}>Estado</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingItems.map((pi, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #fef08a' }}>
                    <td style={{ padding: '0.75rem' }}><b>{pi.insumoData?.nombre || pi.nombre}</b><br/><span style={{ fontSize: '0.75rem', color: '#713f12' }}>{pi.insumoData?.categoria || pi.categoria}</span></td>
                    <td style={{ padding: '0.75rem' }}>{pi.proveedorData?.nombre || pi.proveedorNombre || 'N/A'}<br/><span style={{ fontSize: '0.75rem', color: '#713f12' }}>{pi.priceData?.presentacionCompra || 'N/A'}</span></td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: '#991b1b' }}>{pi.motivoNoConseguido}</span>
                      {pi.detalleMotivoNoConseguido && <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#7f1d1d' }}>{pi.detalleMotivoNoConseguido}</div>}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={styles.badgePending}>Pendiente</span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        className={styles.btnReintentar}
                        onClick={() => {
                          const reactivatedItem = { ...pi };
                          delete reactivatedItem.estadoOperativo;
                          delete reactivatedItem.motivoNoConseguido;
                          delete reactivatedItem.detalleMotivoNoConseguido;
                          delete reactivatedItem.fechaRegistro;
                          setChecklistItems(prev => [...prev, reactivatedItem]);
                          setPendingItems(prev => prev.filter((_, i) => i !== idx));
                        }}
                      >
                        <RotateCcwIcon size={16} /> Reintentar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resumen de Compras Asentadas */}
      {comprasAsentadas.length > 0 && (
        <div className={styles.card} style={{ marginTop: '2rem', borderTop: '4px solid #10b981' }}>
          <div className={styles.cardTitle} style={{ color: '#065f46' }}>Resumen de Compras Asentadas en Sesión</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #d1d5db', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Insumo</th>
                  <th style={{ padding: '0.75rem' }}>Proveedor</th>
                  <th style={{ padding: '0.75rem' }}>Marca</th>
                  <th style={{ padding: '0.75rem' }}>Cant. Empaques</th>
                  <th style={{ padding: '0.75rem' }}>Neto a Bodega</th>
                  <th style={{ padding: '0.75rem' }}>Costo Base</th>
                  <th style={{ padding: '0.75rem' }}>Subtotal Pagado</th>
                </tr>
              </thead>
              <tbody>
                {comprasAsentadas.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{c.insumoData?.nombre || c.nombre}</td>
                    <td style={{ padding: '0.75rem' }}>{c.provNombre || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{c.marca}</td>
                    <td style={{ padding: '0.75rem' }}>{c.empaques}</td>
                    <td style={{ padding: '0.75rem' }}>{c.cantidadBaseTotal?.toFixed(2)} {c.unidadEmpaque}</td>
                    <td style={{ padding: '0.75rem' }}>${c.costoBase?.toFixed(2)}</td>
                    <td style={{ padding: '0.75rem' }}>${c.subtotal?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className={styles.submitBtn} style={{ width: 'auto', background: '#3b82f6' }} onClick={() => setComprasAsentadas([])}>
              Cerrar Resumen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
