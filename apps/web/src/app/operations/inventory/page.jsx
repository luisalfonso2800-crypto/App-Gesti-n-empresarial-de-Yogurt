/**
 * @file page.jsx
 * @module operations/inventory
 * @description Vista principal de bitácora de inventario (Bodega y Cava).
 * @responsibility Gestionar visualización de stock, valorización, historial de movimientos y ajustes globales.
 * @usedBy Next.js router (/operations/inventory)
 * @dependencies react, @/lib/api-client, @/components/ui/Table, @/components/ui/States, @/components/ui/Badge, @/components/ui/Button, lucide-react, ./components/GlobalInventoryAdjustmentModal
 */

'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, AlertCircle, TrendingDown, TrendingUp, DollarSign, PackageOpen, LayoutGrid, RotateCcw } from 'lucide-react';
import { GlobalInventoryAdjustmentModal } from './components/GlobalInventoryAdjustmentModal';
import styles from './inventory.module.css';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('INSUMOS'); // INSUMOS, PRODUCTOS
  const [inventory, setInventory] = useState([]);
  const [finishedProducts, setFinishedProducts] = useState([]);
  const [metadata, setMetadata] = useState({ valorTotalBodega: 0, totalCriticos: 0, totalBajoMinimo: 0, totalReferencias: 0 });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedId, setExpandedId] = useState(null);
  const [movements, setMovements] = useState({});
  const [loadingMovements, setLoadingMovements] = useState(false);

  // Modal Ajuste Global / Saldo Inicial
  const [isGlobalAdjustmentOpen, setIsGlobalAdjustmentOpen] = useState(false);

  // Modal Ajuste Fila
  const [adjustmentModal, setAdjustmentModal] = useState({ open: false, item: null, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'INSUMOS') {
        const response = await apiClient.get('/inventory');
        setInventory(response.data || []);
        setMetadata(response.metadata || { valorTotalBodega: 0, totalCriticos: 0, totalBajoMinimo: 0, totalReferencias: 0 });
      } else if (activeTab === 'PRODUCTOS') {
        const data = await apiClient.get('/inventory/finished-products');
        setFinishedProducts(data || []);
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchMovements = async (id) => {
    setLoadingMovements(true);
    try {
      const data = await apiClient.get(`/inventory/${id}/movements`);
      setMovements(prev => ({ ...prev, [id]: data }));
    } catch (err) {
      console.error('Error al cargar movimientos', err);
    } finally {
      setLoadingMovements(false);
    }
  };

  const handleToggleRow = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!movements[id]) {
        fetchMovements(id);
      }
    }
  };

  const submitAdjustment = async () => {
    if (!adjustmentModal.motivo && ['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO'].includes(adjustmentModal.tipo)) {
      alert('Motivo requerido para salidas o mermas');
      return;
    }
    
    let cantidadAjuste = Number(adjustmentModal.cantidad);
    if (['AJUSTE_NEGATIVO', 'MERMA_DESPERDICIO', 'SALIDA_VENTA'].includes(adjustmentModal.tipo)) {
      cantidadAjuste = -Math.abs(cantidadAjuste);
    } else {
      cantidadAjuste = Math.abs(cantidadAjuste);
    }

    try {
      await apiClient.post('/inventory/adjustments', {
        idInsumo: activeTab === 'INSUMOS' ? adjustmentModal.item.idInsumo : undefined,
        idProducto: activeTab === 'PRODUCTOS' ? adjustmentModal.item.idProducto : undefined,
        cantidadAjuste,
        tipo: adjustmentModal.tipo,
        motivo: adjustmentModal.motivo || 'Ajuste manual'
      });
      setAdjustmentModal({ open: false, item: null, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: '' });
      fetchData(); // reload
      if (expandedId) fetchMovements(expandedId);
    } catch (e) {
      alert('Error guardando ajuste');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerPanel}>
        <div className={styles.headerTopRow}>
          <div className={styles.titleSection}>
            <LayoutGrid size={28} className={styles.titleIcon} />
            <div>
              <h1 className={styles.mainTitle}>Bitácora de Inventario</h1>
              <p className={styles.subTitle}>Control maestro de almacén y cava. Valorización en tiempo real.</p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsGlobalAdjustmentOpen(true)}
          >
            + Saldo Inicial / Ajuste Global
          </Button>
        </div>
        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${activeTab === 'INSUMOS' ? styles.tabActive : ''}`} onClick={() => setActiveTab('INSUMOS')}>
            Bodega (Insumos)
          </button>
          <button className={`${styles.tabBtn} ${activeTab === 'PRODUCTOS' ? styles.tabActive : ''}`} onClick={() => setActiveTab('PRODUCTOS')}>
            Cava (Prod. Terminado)
          </button>
        </div>
      </header>

      {activeTab === 'INSUMOS' && !loading && !error && (
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <p className={styles.kpiLabel}>Valor en Bodega</p>
              <h3 className={styles.kpiValue}>${Number(metadata.valorTotalBodega).toLocaleString('es-CO')}</h3>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <p className={styles.kpiLabel}>Agotados</p>
              <h3 className={styles.kpiValue}>{metadata.totalCriticos} refs</h3>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <TrendingDown size={24} />
            </div>
            <div>
              <p className={styles.kpiLabel}>Bajo Mínimo</p>
              <h3 className={styles.kpiValue}>{metadata.totalBajoMinimo} refs</h3>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : (activeTab === 'INSUMOS' ? inventory : finishedProducts).length === 0 ? (
        <AssistedEmptyState
          icon="📦"
          title={activeTab === 'INSUMOS' ? "Comienza registrando existencias en Bodega" : "No hay existencias de Producto Terminado en Cava"}
          description="Controla el stock disponible en bodega valorizado al costo promedio y registra entradas desde compras o producción."
          actionLabel={activeTab === 'INSUMOS' ? "+ Registrar Compra de Insumos" : "+ Programar Producción"}
          onAction={() => window.location.href = (activeTab === 'INSUMOS' ? '/operations/purchases/new?mode=direct' : '/operations/production')}
          topButtonLabel="Ajuste Global / Saldo Inicial"
        />
      ) : (
        <div className={styles.tableWrapper}>
          <Table>
            <THead>
              <TR>
                <TH>{activeTab === 'INSUMOS' ? 'Insumo / Referencia' : 'Producto Terminado'}</TH>
                <TH>Categoría</TH>
                <TH style={{ textAlign: 'right' }}>Stock Actual</TH>
                {activeTab === 'INSUMOS' && <TH style={{ textAlign: 'center' }}>Semáforo</TH>}
                <TH style={{ textAlign: 'right' }}>Valorización</TH>
                <TH style={{ textAlign: 'center' }}>Acciones</TH>
              </TR>
            </THead>
            <TBody>
              {(activeTab === 'INSUMOS' ? inventory : finishedProducts).map((item) => {
                const id = activeTab === 'INSUMOS' ? item.idInsumo : item.idProducto;
                const name = activeTab === 'INSUMOS' ? item.insumo?.nombre : `${item.producto?.nombre} - ${item.producto?.presentacion?.nombre}`;
                const cat = activeTab === 'INSUMOS' ? item.insumo?.categoria : item.producto?.categoria;
                const unit = activeTab === 'INSUMOS' ? item.insumo?.unidadBase : 'und';
                const status = item.estado || 'OPTIMO'; // OPTIMO, BAJO, CRITICO
                const valor = activeTab === 'INSUMOS' ? item.valorTotal : (Number(item.cantidadActual) * Number(item.costoPromedio || 0));

                return (
                  <React.Fragment key={id}>
                    <TR className={styles.tableRow} onClick={() => handleToggleRow(id)}>
                      <TD>
                        <div className={styles.flexCenter}>
                          {expandedId === id ? <ChevronUp size={16} className={styles.textMuted}/> : <ChevronDown size={16} className={styles.textMuted}/>}
                          <strong className={styles.monoStrong}>{name || id}</strong>
                        </div>
                      </TD>
                      <TD><span className={styles.categoryBadge}>{cat || '-'}</span></TD>
                      <TD style={{ textAlign: 'right' }}>
                        <span className={styles.stockValue}>{Number(item.cantidadActual)}</span> {unit}
                      </TD>
                      {activeTab === 'INSUMOS' && (
                        <TD style={{ textAlign: 'center' }}>
                          {status === 'CRITICO' ? <Badge status="inactive">Agotado</Badge> : status === 'BAJO' ? <Badge status="warning">Bajo Mínimo</Badge> : <Badge status="active">Óptimo</Badge>}
                        </TD>
                      )}
                      <TD style={{ textAlign: 'right', fontWeight: 600 }}>${Number(valor || 0).toLocaleString('es-CO')}</TD>
                      <TD style={{ textAlign: 'center' }}>
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setAdjustmentModal({ open: true, item, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: '' }); }}>
                          Ajustar
                        </Button>
                      </TD>
                    </TR>
                    {expandedId === id && (
                      <TR className={styles.expandedRow}>
                        <TD colSpan={activeTab === 'INSUMOS' ? 6 : 5} style={{ padding: 0 }}>
                          <div className={styles.kardexContainer}>
                            <h4 className={styles.kardexTitle}>Kárdex de Movimientos (Últimos registros)</h4>
                            {loadingMovements && !movements[id] ? (
                              <div className={styles.loadingText}>Cargando historial...</div>
                            ) : (
                              <table className={styles.kardexTable}>
                                <thead>
                                  <tr>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Motivo</th>
                                    <th style={{ textAlign: 'right' }}>Cantidad</th>
                                    <th style={{ textAlign: 'right' }}>Costo Unit.</th>
                                    <th style={{ textAlign: 'right' }}>Stock Restante</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {movements[id] && movements[id].length > 0 ? movements[id].map(mov => (
                                    <tr key={mov.id}>
                                      <td>{new Date(mov.fechaMovimiento).toLocaleString()}</td>
                                      <td>
                                        <Badge status={mov.tipoMovimiento.includes('ENTRADA') || mov.tipoMovimiento.includes('POSITIVO') ? 'active' : 'inactive'}>
                                          {mov.tipoMovimiento.replace('_', ' ')}
                                        </Badge>
                                      </td>
                                      <td>{mov.motivo || '-'}</td>
                                      <td style={{ textAlign: 'right', fontWeight: 500, color: mov.tipoMovimiento.includes('ENTRADA') || mov.tipoMovimiento.includes('POSITIVO') ? '#059669' : '#dc2626' }}>
                                        {mov.tipoMovimiento.includes('ENTRADA') || mov.tipoMovimiento.includes('POSITIVO') ? '+' : '-'}{Number(mov.cantidad)} {unit}
                                      </td>
                                      <td style={{ textAlign: 'right' }}>{mov.costoUnitario ? `$${Number(mov.costoUnitario).toLocaleString('es-CO')}` : '-'}</td>
                                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{mov.stockNuevo !== null ? Number(mov.stockNuevo) : '-'}</td>
                                    </tr>
                                  )) : (
                                    <tr><td colSpan="6" className={styles.emptyText}>No hay movimientos.</td></tr>
                                  )}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </TD>
                      </TR>
                    )}
                  </React.Fragment>
                );
              })}
            </TBody>
          </Table>
        </div>
      )}

      {/* MODAL DE AJUSTE */}
      {adjustmentModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Registrar Ajuste / Merma</h3>
            <p className={styles.modalSub}>
              Ítem: {activeTab === 'INSUMOS' ? adjustmentModal.item?.insumo?.nombre : adjustmentModal.item?.producto?.nombre}
            </p>
            
            <div className={styles.formGroup}>
              <label>Tipo de Ajuste</label>
              <select value={adjustmentModal.tipo} onChange={e => setAdjustmentModal({...adjustmentModal, tipo: e.target.value})} className={styles.input}>
                <option value="AJUSTE_POSITIVO">Ajuste Positivo (+)</option>
                <option value="AJUSTE_NEGATIVO">Ajuste Negativo (-)</option>
                <option value="MERMA_DESPERDICIO">Merma / Desperdicio (-)</option>
                {activeTab === 'PRODUCTOS' && <option value="SALIDA_VENTA">Salida Venta (-)</option>}
                {activeTab === 'PRODUCTOS' && <option value="ENTRADA_PRODUCCION">Entrada Producción (+)</option>}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Cantidad a ajustar (absoluto)</label>
              <input type="number" min="0.01" step="0.01" value={adjustmentModal.cantidad} onChange={e => setAdjustmentModal({...adjustmentModal, cantidad: e.target.value})} className={styles.input} placeholder="0.00" />
            </div>

            <div className={styles.formGroup}>
              <label>Motivo / Documento Origen {(adjustmentModal.tipo === 'AJUSTE_NEGATIVO' || adjustmentModal.tipo === 'MERMA_DESPERDICIO') && <span style={{color: 'red'}}>*</span>}</label>
              <input type="text" value={adjustmentModal.motivo} onChange={e => setAdjustmentModal({...adjustmentModal, motivo: e.target.value})} className={styles.input} placeholder="Ej: Conteo físico, Empaque roto..." />
            </div>

            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setAdjustmentModal({open: false, item: null, tipo: 'AJUSTE_POSITIVO', cantidad: '', motivo: ''})}>Cancelar</Button>
              <Button variant="primary" onClick={submitAdjustment} disabled={!adjustmentModal.cantidad}>Guardar Ajuste</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GLOBAL DE SALDO INICIAL / AJUSTE */}
      <GlobalInventoryAdjustmentModal
        isOpen={isGlobalAdjustmentOpen}
        onClose={() => setIsGlobalAdjustmentOpen(false)}
        onSuccess={() => {
          fetchData();
        }}
      />
    </div>
  );
}
