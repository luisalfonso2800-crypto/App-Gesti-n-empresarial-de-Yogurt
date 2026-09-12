/**
 * @file page.jsx
 * @module operations/purchases
 * @description Orquestador principal del módulo de compras, historial y gestión de listas.
 * @responsibility Consolidar listas activas, historial de compras finalizadas y permitir reconexión a Fase 2. Fusión con checkboxes.
 * @usedBy Next.js App Router
 * @dependencies Hooks, lucide-react
 */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/States';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import styles from './purchases.module.css';
import { ContextBanner } from '@/components/ui/ContextBanner';
import { ListPlus, ShoppingCart, Pencil, Trash2, GitMerge, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useCart } from '@/context/CartContext';

export default function PurchasesPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { refreshCart, lastUpdated } = useCart();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeOrders, setActiveOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [isMergingMode, setIsMergingMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [editNameModalOpen, setEditNameModalOpen] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [editNameError, setEditNameError] = useState(null);
  const [isSubmittingEditName, setIsSubmittingEditName] = useState(false);

  const [groupedPurchases, setGroupedPurchases] = useState([]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/purchases');
      setPurchases(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar compras históricas');
    }
    setLoading(false);
  };

  const fetchActiveOrders = async () => {
    try {
      const orders = await apiClient.get('/purchases/orders/active');
      setActiveOrders(orders || []);
    } catch (err) {
      console.warn('Advertencia: No se pudieron cargar las órdenes activas', err);
      setActiveOrders([]);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    fetchActiveOrders();
  }, [lastUpdated]);

  useEffect(() => {
    const grouped = [];
    const orderMap = new Map();

    purchases.forEach(compra => {
      if (compra.idOrden) {
        if (!orderMap.has(compra.idOrden)) {
          orderMap.set(compra.idOrden, {
            id: compra.idOrden,
            isGrouped: true,
            orden: compra.orden,
            fechaCompra: compra.fechaCompra,
            total: 0,
            compras: [],
            detalles: []
          });
        }
        const group = orderMap.get(compra.idOrden);
        group.total += Number(compra.total);
        group.compras.push(compra);
        const mappedDetalles = (compra.detalles || []).map(d => ({ ...d, proveedor: d.proveedor || compra.proveedor }));
        group.detalles.push(...mappedDetalles);
        if (new Date(compra.fechaCompra) > new Date(group.fechaCompra)) {
          group.fechaCompra = compra.fechaCompra;
        }
      } else {
        grouped.push({
          id: compra.id,
          isGrouped: false,
          fechaCompra: compra.fechaCompra,
          total: Number(compra.total),
          detalles: (compra.detalles || []).map(d => ({ ...d, proveedor: d.proveedor || compra.proveedor })),
          compra: compra
        });
      }
    });

    grouped.push(...Array.from(orderMap.values()));
    grouped.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));

    setGroupedPurchases(grouped);
  }, [purchases]);

  const toggleRow = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleToggleMergeSelection = (id) => {
    setSelectedForMerge(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const executeMerge = async () => {
    if (selectedForMerge.length < 2) return;
    try {
      const resp = await apiClient.post('/purchases/orders/merge', { sourceOrderIds: selectedForMerge });
      showNotification(`Listas fusionadas exitosamente en ${resp.newOrder?.codigo}`, 'success');
      setIsMergingMode(false);
      setSelectedForMerge([]);
      refreshCart();
      fetchActiveOrders();
    } catch (e) {
      showNotification(e.message || 'Error al fusionar', 'error');
    }
  };
  
  const handleEditNameSubmit = async () => {
    if (!editNameModalOpen || !editNameValue.trim() || isSubmittingEditName) return;
    setIsSubmittingEditName(true);
    setEditNameError(null);
    try {
      const nombreFinal = `Lista de Compra - ${editNameValue.trim().toUpperCase()} - ${new Date().toLocaleDateString()}`;
      await apiClient.patch(`/purchases/orders/${editNameModalOpen}`, { nombre: nombreFinal });
      showNotification('Nombre actualizado', 'success');
      setEditNameModalOpen(null);
      setEditNameValue('');
      refreshCart();
      fetchActiveOrders();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al actualizar nombre';
      setEditNameError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmittingEditName(false);
    }
  };

  const executeDelete = async () => {
    if (!deleteModalOpen || isSubmittingDelete) return;
    setIsSubmittingDelete(true);
    setDeleteError(null);
    try {
      await apiClient.delete(`/purchases/orders/${deleteModalOpen}`);
      showNotification('Lista eliminada', 'success');
      setActiveOrders(prev => prev.filter(o => o.id !== deleteModalOpen));
      setDeleteModalOpen(null);
      refreshCart();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Error al eliminar lista';
      setDeleteError(msg);
      showNotification(msg, 'error');
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Compras</h1>
          <p className={styles.subtitle}>Registro y control de órdenes de adquisición y consolidación de listas.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={() => router.push('/catalog/supplier-prices')} variant="secondary">
            <ListPlus size={16} style={{ marginRight: '0.5rem' }}/>
            Crear / Gestionar Lista
          </Button>
          <Button onClick={() => router.push('/operations/purchases/new?mode=direct')}>
            <ShoppingCart size={16} style={{ marginRight: '0.5rem' }}/>
            Nueva Compra Directa
          </Button>
        </div>
      </div>
      <ContextBanner title="Concepto Técnico" description="Aquí se documenta la llegada de insumos. Registra listas en ruta, consolida compras finalizadas y permite unificar órdenes." />

      {activeOrders.length > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#166534' }}>Listas Preparadas / En Ruta</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {isMergingMode && selectedForMerge.length >= 2 && (
                 <Button variant="primary" onClick={executeMerge}>Confirmar Fusión</Button>
              )}
              {isMergingMode && (
                 <Button variant="secondary" onClick={() => { setIsMergingMode(false); setSelectedForMerge([]); }}>Cancelar Fusión</Button>
              )}
              {!isMergingMode && (
                 <Button variant="secondary" onClick={() => setIsMergingMode(true)}>
                   <GitMerge size={16} style={{ marginRight: '0.5rem' }}/> Fusionar Seleccionadas
                 </Button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {activeOrders.map(order => {
              const totalItems = order.items.length;
              const completedItems = order.items.filter(i => i.estadoItem !== 'PENDIENTE').length;
              
              return (
                <div key={order.id} style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '300px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {isMergingMode && (
                    <input 
                      type="checkbox" 
                      style={{ marginTop: '0.25rem', width: '1.25rem', height: '1.25rem' }}
                      checked={selectedForMerge.includes(order.id)}
                      onChange={() => handleToggleMergeSelection(order.id)}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: '#374151' }}>{order.codigo}</span>
                      <Badge status="active">{order.estado}</Badge>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 500 }}>{order.nombre}</span>
                        <button title="Editar Nombre" onClick={() => { setEditNameValue(order.nombre); setEditNameModalOpen(order.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}><Pencil size={14}/></button>
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
                      Progreso: {completedItems} / {totalItems} ítems procesados
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="primary" onClick={() => router.push(`/operations/purchases/new?orderId=${order.id}`)} style={{ flex: 1 }}>
                        <Eye size={16} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> 
                        Ver Lista
                      </Button>
                      <Button variant="danger" title="Eliminar Lista" onClick={() => setDeleteModalOpen(order.id)}>
                        <Trash2 size={16}/>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : purchases.length === 0 ? (
        <EmptyState title="No hay compras finalizadas" description="Registra la primera compra" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Lista / Identificador</TH>
              <TH>Fecha</TH>
              <TH>Ítems</TH>
              <TH>Total ($)</TH>
              <TH>Estado</TH>
            </TR>
          </THead>
          <TBody>
            {groupedPurchases.map((group) => {
              const orden = group.orden;
              const title = group.isGrouped && orden ? `${orden.codigo} - ${orden.nombre}` : `Compra Directa - ${new Date(group.fechaCompra).toLocaleDateString()}`;
              
              let conseguidosCount = group.detalles.length;
              let faltantesCount = 0;
              let isCompleted = true;

              if (group.isGrouped && orden) {
                // Determine completion state correctly
                const totalItems = orden.items ? orden.items.length : 0;
                
                // Un ítem "conseguido" es uno cuyo estado sea 'COMPRADO', o si ya está en la cuenta de detalles.
                // Usualmente, contamos los ítems creados en los detalles:
                faltantesCount = Math.max(0, totalItems - conseguidosCount);
                if (faltantesCount > 0) {
                  isCompleted = false;
                }
              }

              return (
              <React.Fragment key={group.id}>
                <TR style={{ cursor: 'pointer', background: expandedId === group.id ? '#f9fafb' : 'white' }} onClick={() => toggleRow(group.id)}>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {expandedId === group.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                      <strong>{title}</strong>
                    </div>
                  </TD>
                  <TD>{new Date(group.fechaCompra).toLocaleDateString()}</TD>
                  <TD>
                    <span style={{ color: '#059669', fontWeight: 600 }}>{conseguidosCount} conseguidos</span>
                    {faltantesCount > 0 && (
                      <span style={{ color: '#e11d48', fontWeight: 600, marginLeft: '0.5rem' }}>
                        / {faltantesCount} faltantes
                      </span>
                    )}
                  </TD>
                  <TD>${Number(group.total).toLocaleString('es-CO')}</TD>
                  <TD>
                    <Badge status={isCompleted ? 'active' : 'warning'}>
                      {isCompleted ? 'Completada' : 'En Ruta / Parcial'}
                    </Badge>
                  </TD>
                </TR>
                {expandedId === group.id && (
                  <TR>
                    <TD colSpan="5" style={{ padding: '0', background: '#f8fafc' }}>
                      <div style={{ padding: '1rem 2rem' }}>
                        {!isCompleted && (
                          <div style={{ background: '#fffbeb', padding: '0.75rem', borderRadius: '4px', border: '1px solid #fde68a', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ color: '#b45309', fontSize: '0.875rem' }}>
                              ⚠️ Esta lista de compra aún tiene insumos pendientes por conseguir o comprar. Puedes continuar el checklist para completarlos o descartarlos.
                            </span>
                            <Button variant="secondary" onClick={() => router.push(`/operations/purchases/new?orderId=${group.id}`)}>
                              Completar Lista
                            </Button>
                          </div>
                        )}
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Detalle de la Compra</h4>
                        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                              <th style={{ padding: '0.5rem' }}>Insumo</th>
                              <th style={{ padding: '0.5rem' }}>Presentación / Marca</th>
                              <th style={{ padding: '0.5rem' }}>Proveedor</th>
                              <th style={{ padding: '0.5rem' }}>Cant. Neta</th>
                              <th style={{ padding: '0.5rem' }}>Costo Unit.</th>
                              <th style={{ padding: '0.5rem' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.detalles && group.detalles.length > 0 ? (
                              group.detalles.map((d, idx) => (
                                <tr key={d.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '0.5rem' }}>{d.insumo?.nombre || d.idInsumo}</td>
                                  <td style={{ padding: '0.5rem' }}>{d.presentacion || d.insumo?.marca || 'Empaque'}</td>
                                  <td style={{ padding: '0.5rem' }}>{d.proveedor?.nombre || d.idProveedor}</td>
                                  <td style={{ padding: '0.5rem' }}>{Number(d.cantidad)}</td>
                                  <td style={{ padding: '0.5rem' }}>${Number(d.precioUnitario).toLocaleString('es-CO')}</td>
                                  <td style={{ padding: '0.5rem' }}>${Number(d.subtotal).toLocaleString('es-CO')}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                                  No hay detalles disponibles para esta compra.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.875rem', gap: '0.25rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                            <span style={{ color: '#64748b' }}>Subtotal Ítems:</span>
                            <span>${Number(group.detalles.reduce((acc, d) => acc + Number(d.subtotal), 0)).toLocaleString('es-CO')}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px' }}>
                            <span style={{ color: '#64748b' }}>Flete Global:</span>
                            <span>${Number(group.total - group.detalles.reduce((acc, d) => acc + Number(d.subtotal), 0)).toLocaleString('es-CO')}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '250px', fontWeight: 600, borderTop: '1px solid #e2e8f0', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
                            <span>Total Compra:</span>
                            <span>${Number(group.total).toLocaleString('es-CO')}</span>
                          </div>
                        </div>

                      </div>
                    </TD>
                  </TR>
                )}
              </React.Fragment>
              );
            })}
          </TBody>
        </Table>
      )}
      
      <SmartModal 
        isOpen={!!editNameModalOpen} 
        onClose={() => { setEditNameModalOpen(null); setEditNameError(null); }} 
        title="EDITAR NOMBRE DE LISTA"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {editNameError && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#B91C1C',
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              ⚠️ {editNameError}
            </div>
          )}

          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>NUEVO NOMBRE PERSONALIZADO:</label>
          <input 
            type="text" 
            value={editNameValue} 
            onChange={(e) => {
              setEditNameValue(e.target.value.toUpperCase());
              setEditNameError(null);
            }}
            placeholder="EJ. PROVEEDORES LOCALES"
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid #d1d5db', 
              width: '100%',
              textTransform: 'uppercase'
            }}
          />

          {/* Resumen Poka-Yoke */}
          {editNameValue.trim() && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.76rem',
              lineHeight: 1.4
            }}>
              <strong>Acción a realizar:</strong> Se renombrará la orden a:{' '}
              <code>LISTA DE COMPRA - {editNameValue.trim().toUpperCase()} - {new Date().toLocaleDateString()}</code>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => { setEditNameModalOpen(null); setEditNameError(null); }}>Cancelar</Button>
            <SubmitButton
              onClick={handleEditNameSubmit}
              loading={isSubmittingEditName}
              disabled={!editNameValue.trim() || isSubmittingEditName}
              missingFields={!editNameValue.trim() ? ['Nuevo nombre personalizado'] : []}
            >
              Guardar Nombre
            </SubmitButton>
          </div>
        </div>
      </SmartModal>

      <SmartModal 
        isOpen={!!deleteModalOpen} 
        onClose={() => { setDeleteModalOpen(null); setDeleteError(null); }} 
        title="ELIMINAR LISTA EN RUTA"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          {deleteError && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#B91C1C',
              padding: '0.6rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              ⚠️ {deleteError}
            </div>
          )}

          <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>
            ¿Estás seguro que deseas eliminar la lista seleccionada? Esta acción borrará la orden activa y no se puede deshacer.
          </p>

          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.76rem',
            lineHeight: 1.4
          }}>
            <strong>Advertencia Poka-Yoke:</strong> Se eliminará permanentemente la orden de compra en ruta. Los ítems asociados no consolidados se descartarán.
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => { setDeleteModalOpen(null); setDeleteError(null); }}>Cancelar</Button>
            <SubmitButton 
              variant="danger" 
              onClick={executeDelete}
              loading={isSubmittingDelete}
              disabled={isSubmittingDelete}
            >
              Eliminar Lista
            </SubmitButton>
          </div>
        </div>
      </SmartModal>
    </div>
  );
}
