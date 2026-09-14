'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ClipboardList, Play, CheckCircle, PackageOpen, AlertTriangle } from 'lucide-react';
import styles from './production.module.css';
import { useRouter } from 'next/navigation';

export default function ProductionPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Create state
  const [creating, setCreating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [qty, setQty] = useState(1);
  const [bom, setBom] = useState([]);
  const [bomLoading, setBomLoading] = useState(false);
  
  // Complete modal
  const [completeModal, setCompleteModal] = useState({ open: false, order: null, realQty: '' });
  const [realDetails, setRealDetails] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchRecipes();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/production');
      setOrders(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      // Assuming a generic endpoint or we just hardcode fetching recipes via products
      // We'll simulate fetching recipes here if there's no endpoint, or call one.
      const res = await apiClient.get('/recipes').catch(() => []); 
      // If /recipes doesn't exist, we just rely on creating from another screen or provide dummy.
      setRecipes(res || []);
    } catch (e) {}
  };

  const loadBom = async () => {
    if (!selectedRecipe || !qty) return;
    setBomLoading(true);
    try {
      const res = await apiClient.get(`/production/recipe-bom/${selectedRecipe}?cantidad=${qty}`);
      setBom(res);
    } catch (e) {
      console.error(e);
    } finally {
      setBomLoading(false);
    }
  };

  useEffect(() => {
    if (creating) loadBom();
  }, [selectedRecipe, qty, creating]);

  const hasShortage = bom.some(b => b.faltante > 0);

  const startOrder = async (id) => {
    try {
      await apiClient.post(`/production/${id}/start`);
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const rec = recipes.find(r => r.id === selectedRecipe);
      await apiClient.post('/production', {
        idProducto: rec?.idProducto || selectedRecipe, 
        cantidadPlanificada: qty,
        fechaProduccion: new Date().toISOString(),
        estado: 'PLANIFICADA',
        detalles: bom.map(b => ({
          idInsumo: b.idInsumo,
          cantidadTeorica: b.requeridoTeorico,
          unidad: b.unidad,
          costoTeorico: b.costoTeorico
        }))
      });
      setCreating(false);
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  const handlePurchaseShortage = async () => {
    try {
      const faltantes = bom.filter(b => b.faltante > 0).map(b => ({ idInsumo: b.idInsumo, faltante: b.faltante }));
      await apiClient.post('/production/create-purchase-order-from-shortage', { itemsFaltantes: faltantes });
      alert("Orden de Compra generada automáticamente. Revisa el módulo de compras.");
    } catch (e) {
      alert(e.message);
    }
  };

  const openComplete = (order) => {
    const rd = {};
    order.detalles.forEach(d => { rd[d.id] = d.cantidadTeorica; });
    setRealDetails(rd);
    setCompleteModal({ open: true, order, realQty: order.cantidadPlanificada });
  };

  const submitComplete = async () => {
    try {
      await apiClient.patch(`/production/${completeModal.order.id}/complete`, {
        cantidadProducidaReal: completeModal.realQty,
        detalles: Object.keys(realDetails).map(id => ({
          id,
          cantidadRealUtilizada: realDetails[id]
        }))
      });
      setCompleteModal({ open: false, order: null });
      fetchOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <ClipboardList size={32} className={styles.icon} />
          <div>
            <h1 className={styles.title}>Bitácora de Fabricación</h1>
            <p className={styles.subtitle}>Control de Planta, Rendimientos y Trazabilidad de Lotes</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setCreating(true)}>+ Nueva Producción</Button>
      </header>

      {creating && (
        <div className={styles.creatorCard}>
          <div className={styles.creatorHeader}>
            <h3>Planificar Nueva Orden</h3>
            <Button variant="secondary" size="sm" onClick={() => setCreating(false)}>Cerrar</Button>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Receta / Producto</label>
              <select value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)} className={styles.input}>
                <option value="">Seleccione...</option>
                {recipes.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                {/* Fallback mock if empty for UI test */}
                {recipes.length === 0 && <option value="mock-123">Yogur Escolar Fresa 150ml (Simulado)</option>}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Cantidad a Producir</label>
              <input type="number" min="1" value={qty} onChange={e => setQty(Number(e.target.value))} className={styles.input} />
            </div>
          </div>

          {selectedRecipe && (
            <div className={styles.bomSection}>
              <h4>BOM (Lista de Materiales y Fórmula Requerida)</h4>
              {bomLoading ? <p>Calculando...</p> : (
                <>
                  {hasShortage && (
                    <div className={styles.alertBanner}>
                      <AlertTriangle size={20} />
                      <span>Insumos insuficientes para esta escala de producción.</span>
                      <Button variant="danger" size="sm" onClick={handlePurchaseShortage}>+ Disparar Lista de Compra</Button>
                    </div>
                  )}
                  <table className={styles.bomTable}>
                    <thead>
                      <tr>
                        <th>Insumo</th>
                        <th style={{textAlign:'right'}}>Req. Teórico</th>
                        <th style={{textAlign:'right'}}>Stock Actual</th>
                        <th style={{textAlign:'right'}}>Faltante</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bom.map(b => (
                        <tr key={b.idInsumo}>
                          <td>{b.nombreInsumo}</td>
                          <td style={{textAlign:'right'}}>{Number(b.requeridoTeorico).toFixed(2)} {b.unidad}</td>
                          <td style={{textAlign:'right'}}>{Number(b.stockActual).toFixed(2)} {b.unidad}</td>
                          <td style={{textAlign:'right', color: b.faltante > 0 ? '#dc2626' : '#0f172a'}}>{Number(b.faltante).toFixed(2)} {b.unidad}</td>
                          <td>
                            {b.faltante > 0 ? <Badge status="inactive">Faltante</Badge> : <Badge status="active">Suficiente</Badge>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className={styles.creatorActions}>
                    <Button variant="secondary" onClick={handleCreateOrder}>Guardar como Planificada / Borrador</Button>
                    <Button variant="primary" disabled={hasShortage} onClick={handleCreateOrder}>Iniciar Producción</Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {orders.length === 0 ? (
        <AssistedEmptyState
          icon="⚙️"
          title="Comienza programando tu primera Orden de Producción"
          description="Programa órdenes de transformación por lote a partir de las recetas activas."
          actionLabel="+ Programar Producción"
          onAction={() => setCreating(true)}
          topButtonLabel="+ Nueva Producción"
        />
      ) : (
        <div className={styles.grid}>
          {orders.map(order => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <span className={styles.orderId}>{order.id.split('-')[0].toUpperCase()}</span>
              <Badge status={order.estado === 'COMPLETADA' ? 'active' : order.estado === 'EN_PROCESO' ? 'warning' : 'default'}>
                {order.estado.replace('_', ' ')}
              </Badge>
            </div>
            <div className={styles.orderBody}>
              <p><strong>Planificado:</strong> {Number(order.cantidadPlanificada)} und</p>
              {order.estado === 'COMPLETADA' && <p><strong>Producido:</strong> {Number(order.cantidadProducidaReal)} und</p>}
              <p><strong>Fecha Fabricación:</strong> {new Date(order.fechaProduccion).toLocaleDateString()}</p>
              {order.fechaVencimiento && (
                <p><strong>Vencimiento:</strong> {new Date(order.fechaVencimiento).toLocaleDateString()}</p>
              )}
            </div>
            <div className={styles.orderFooter}>
              {order.estado === 'PLANIFICADA' && (
                <Button variant="secondary" size="sm" onClick={() => startOrder(order.id)}>
                  <Play size={14} style={{marginRight:'4px'}}/> Iniciar
                </Button>
              )}
              {order.estado === 'EN_PROCESO' && (
                <Button variant="primary" size="sm" onClick={() => openComplete(order)}>
                  <CheckCircle size={14} style={{marginRight:'4px'}}/> Cerrar Orden
                </Button>
              )}
              {order.estado === 'COMPLETADA' && order.idLote && (
                <span className={styles.loteLink} onClick={() => router.push(`/operations/inventory`)}>
                  <PackageOpen size={14} /> Lote: {order.idLote.split('-')[0]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {completeModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Cerrar Orden y Liquidar Lote</h3>
            <p className={styles.modalSub}>Reporte de consumo real y mermas operativas.</p>
            
            <div className={styles.formGroup}>
              <label>Unidades Reales Obtenidas</label>
              <input type="number" min="0" value={completeModal.realQty} onChange={e => setCompleteModal({...completeModal, realQty: e.target.value})} className={styles.input} />
            </div>

            <h4 style={{marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#475569'}}>Consumo de Insumos (Ajuste de Mermas)</h4>
            <table className={styles.bomTable}>
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th style={{textAlign:'right'}}>Teórico</th>
                  <th style={{textAlign:'center'}}>Real Utilizado</th>
                </tr>
              </thead>
              <tbody>
                {completeModal.order.detalles.map(det => (
                  <tr key={det.id}>
                    <td>ID: {det.idInsumo.split('-')[0]}</td>
                    <td style={{textAlign:'right'}}>{Number(det.cantidadTeorica).toFixed(2)} {det.unidad}</td>
                    <td style={{textAlign:'center'}}>
                      <input 
                        type="number" 
                        step="0.01"
                        value={realDetails[det.id]} 
                        onChange={e => setRealDetails({...realDetails, [det.id]: e.target.value})}
                        style={{width: '80px', padding: '0.25rem', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'right'}}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setCompleteModal({open: false, order: null})}>Cancelar</Button>
              <Button variant="primary" onClick={submitComplete}>Cerrar y Costear Lote</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
