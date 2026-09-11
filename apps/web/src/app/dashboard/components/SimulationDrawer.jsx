'use client';

import React, { useState, useEffect } from 'react';
import styles from './SimulationDrawer.module.css';
import { X, Play, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

/**
 * @file SimulationDrawer.jsx
 * @module Dashboard/Simulation
 * @description Drawer lateral táctico para simulaciones predictivas "what-if" de producción.
 * @responsibility Consultar API de simulación y mostrar balance de requerimientos, costos e ingresos.
 * @usedBy apps/web/src/app/dashboard/page.jsx
 * @dependencies lucide-react, apiClient, CSS Modules
 */
export default function SimulationDrawer({ isOpen, onClose, telemetryData }) {
  const [loading, setLoading] = useState(false);
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState(100);
  const [precioVar, setPrecioVar] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  useEffect(() => {
    if (isOpen && telemetryData?.plant?.productsTelemetry?.length > 0 && !productoId) {
      setProductoId(telemetryData.plant.productsTelemetry[0].idProducto);
    }
  }, [isOpen, telemetryData, productoId]);

  const handleSimulate = async () => {
    if (!productoId || cantidad <= 0) return;
    
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      // Calcular precio simulado si hay variación
      const prodSelect = telemetryData.plant.productsTelemetry.find(p => p.idProducto === productoId);
      let precioSimulado = null;
      if (prodSelect && prodSelect.precioVentaActual && precioVar !== 0) {
        precioSimulado = prodSelect.precioVentaActual * (1 + (precioVar / 100));
      }

      const res = await apiClient.post('/api/v1/dashboard/simulate-batch', {
        productoId,
        cantidadSimulada: Number(cantidad),
        precioSimulado: precioSimulado ? Number(precioSimulado.toFixed(2)) : undefined
      });
      setResultado(res);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al ejecutar la simulación.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : styles.drawerClosed}`}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Settings size={20} /> SIMULADOR TÁCTICO DE PRODUCCIÓN
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>ESCENARIO "WHAT-IF"</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Producto a Producir</label>
              <select className={styles.select} value={productoId} onChange={e => setProductoId(e.target.value)}>
                <option value="">Seleccione un producto</option>
                {telemetryData?.plant?.productsTelemetry?.map(p => (
                  <option key={p.idProducto} value={p.idProducto}>{p.nombre}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Cantidad (Unds)</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  min="1" 
                  value={cantidad === '' ? '' : cantidad} 
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '');
                    setCantidad(v === '' ? '' : Number(v));
                  }} 
                  placeholder="Ej: 100"
                />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label className={styles.label}>Var. Precio Venta (%)</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  value={precioVar} 
                  onChange={e => setPrecioVar(Number(e.target.value) || 0)} 
                  placeholder="Ej: -10 o 10"
                />
              </div>
            </div>

            <button className={styles.btnPri} style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={handleSimulate} disabled={loading}>
              <Play size={16} /> {loading ? 'SIMULANDO...' : 'EJECUTAR SIMULACIÓN'}
            </button>
          </div>

          {error && (
            <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', border: '1px solid #ef4444' }}>
              {error}
            </div>
          )}

          {resultado && (
            <>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>IMPACTO Y RENTABILIDAD PROYECTADA</div>
                <div className={`${styles.viabilityBadge} ${resultado.escenario.esViable ? styles.viable : styles.notViable}`} style={{ marginBottom: '1.5rem' }}>
                  {resultado.escenario.esViable ? <><CheckCircle size={18}/> PRODUCCIÓN FACTIBLE (STOCK OK)</> : <><AlertTriangle size={18}/> QUIEBRE DE STOCK DETECTADO</>}
                </div>
                
                <div className={styles.impactGrid}>
                  <div className={styles.impactCard}>
                    <div className={styles.impactLabel}>Ingreso Proy.</div>
                    <div className={styles.impactValue} style={{ color: '#10b981' }}>{formatCurrency(resultado.escenario.ingresoProyectado)}</div>
                  </div>
                  <div className={styles.impactCard}>
                    <div className={styles.impactLabel}>Costo Lote</div>
                    <div className={styles.impactValue} style={{ color: '#f59e0b' }}>{formatCurrency(resultado.escenario.costoTotalSimulado)}</div>
                  </div>
                  <div className={styles.impactCard}>
                    <div className={styles.impactLabel}>Utilidad Neta</div>
                    <div className={styles.impactValue}>{formatCurrency(resultado.escenario.utilidadProyectada)}</div>
                  </div>
                  <div className={styles.impactCard}>
                    <div className={styles.impactLabel}>Margen Real</div>
                    <div className={styles.impactValue}>{resultado.escenario.margenProyectado}%</div>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>BALANCE DE INSUMOS REQUERIDOS</div>
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Insumo</th>
                      <th>Req.</th>
                      <th>Stock</th>
                      <th>Déficit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.requerimientos.map(req => (
                      <tr key={req.insumoId}>
                        <td>{req.nombre} ({req.unidad})</td>
                        <td>{req.cantidadNecesaria}</td>
                        <td>{req.stockDisponible}</td>
                        <td className={req.deficit > 0 ? styles.deficit : styles.ok}>
                          {req.deficit > 0 ? `-${req.deficit}` : 'OK'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnSec} onClick={onClose}>✕ CERRAR</button>
          {resultado?.escenario?.esViable && (
            <button className={styles.btnPri} onClick={() => alert('Función en desarrollo para siguiente fase')}>
              GENERAR ORDEN DE PRODUCCIÓN
            </button>
          )}
        </div>
      </div>
    </>
  );
}
