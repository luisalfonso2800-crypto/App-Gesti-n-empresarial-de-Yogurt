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
import { Modal } from '@/components/ui/Modal';
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
  const [expandedRows, setExpandedRows] = useState({});

  const [isMergingMode, setIsMergingMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const [editNameModalOpen, setEditNameModalOpen] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');

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

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
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
    if (!editNameModalOpen || !editNameValue.trim()) return;
    try {
      const nombreFinal = `Lista de Compra - ${editNameValue.trim()} - ${new Date().toLocaleDateString()}`;
      await apiClient.patch(`/purchases/orders/${editNameModalOpen}`, { nombre: nombreFinal });
      showNotification('Nombre actualizado', 'success');
      setEditNameModalOpen(null);
      refreshCart();
      fetchActiveOrders();
    } catch (e) {
      showNotification(e.message || 'Error al actualizar nombre', 'error');
    }
  };

  const executeDelete = async () => {
    if (!deleteModalOpen) return;
    try {
      await apiClient.delete(`/purchases/orders/${deleteModalOpen}`);
      showNotification('Lista eliminada', 'success');
      setActiveOrders(prev => prev.filter(o => o.id !== deleteModalOpen));
      setDeleteModalOpen(null);
      refreshCart();
    } catch (e) {
      showNotification('Error al eliminar lista', 'error');
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
          <Button onClick={() => router.push('/operations/purchases/new?manual=true')}>
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
            {purchases.map((item) => (
              <React.Fragment key={item.id}>
                <TR style={{ cursor: 'pointer', background: expandedRows[item.id] ? '#f9fafb' : 'white' }} onClick={() => toggleRow(item.id)}>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {expandedRows[item.id] ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                      <strong>Lista de Compra - General - {new Date(item.fechaCompra).toLocaleDateString()}</strong>
                    </div>
                  </TD>
                  <TD>{new Date(item.fechaCompra).toLocaleDateString()}</TD>
                  <TD>{item.detalles?.length || 1} ítems</TD>
                  <TD>${Number(item.total).toFixed(2)}</TD>
                  <TD>
                    <Badge status={item.estado === 'COMPLETADO' ? 'active' : 'inactive'}>
                      Finalizada
                    </Badge>
                  </TD>
                </TR>
                {expandedRows[item.id] && (
                  <TR>
                    <TD colSpan="5" style={{ padding: '0', background: '#f8fafc' }}>
                      <div style={{ padding: '1rem 2rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Detalle de la Compra</h4>
                        <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                              <th style={{ padding: '0.5rem' }}>Insumo ID</th>
                              <th style={{ padding: '0.5rem' }}>Presentación</th>
                              <th style={{ padding: '0.5rem' }}>Cant.</th>
                              <th style={{ padding: '0.5rem' }}>Costo Unit.</th>
                              <th style={{ padding: '0.5rem' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.detalles?.map(d => (
                              <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.5rem' }}>{d.idInsumo}</td>
                                <td style={{ padding: '0.5rem' }}>{d.presentacion || 'Empaque'}</td>
                                <td style={{ padding: '0.5rem' }}>{d.cantidad}</td>
                                <td style={{ padding: '0.5rem' }}>${d.precioUnitario}</td>
                                <td style={{ padding: '0.5rem' }}>${d.subtotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TD>
                  </TR>
                )}
              </React.Fragment>
            ))}
          </TBody>
        </Table>
      )}
      
      <Modal isOpen={!!editNameModalOpen} onClose={() => setEditNameModalOpen(null)} title="Editar Nombre de Lista">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Nuevo nombre personalizado:</label>
          <input 
            type="text" 
            value={editNameValue} 
            onChange={(e) => setEditNameValue(e.target.value)}
            placeholder="Ej. Proveedores Locales"
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', width: '100%' }}
          />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setEditNameModalOpen(null)}>Cancelar</Button>
            <Button variant="primary" onClick={handleEditNameSubmit}>Guardar</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteModalOpen} onClose={() => setDeleteModalOpen(null)} title="Eliminar Lista en Ruta">
        <p>¿Estás seguro que deseas eliminar la lista seleccionada? Esta acción borrará la orden activa y no se puede deshacer.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setDeleteModalOpen(null)}>Cancelar</Button>
          <Button variant="danger" onClick={executeDelete}>Eliminar Lista</Button>
        </div>
      </Modal>
    </div>
  );
}
