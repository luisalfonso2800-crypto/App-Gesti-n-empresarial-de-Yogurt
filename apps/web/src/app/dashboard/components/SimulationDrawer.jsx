'use client';

import React, { useState, useEffect } from 'react';
import styles from './SimulationDrawer.module.css';
import { X, Play, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { SimulationResultSection } from './SimulationResultSection';

/**
 * @file SimulationDrawer.jsx
 * @module Dashboard/Simulation
 * @description Drawer lateral táctico para simulaciones predictivas "what-if" de producción (SRP < 150 líneas).
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

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : styles.drawerClosed}`}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Settings size={20} />
            <span>SIMULADOR PREDICTIVO "WHAT-IF"</span>
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
            
            <div className={styles.formRowFlex}>
              <div className={`${styles.formGroup} ${styles.formGroupFlex}`}>
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
              <div className={`${styles.formGroup} ${styles.formGroupFlex}`}>
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

            <button className={`${styles.btnPri} ${styles.btnSimulateFull}`} onClick={handleSimulate} disabled={loading}>
              <Play size={16} /> {loading ? 'SIMULANDO...' : 'EJECUTAR SIMULACIÓN'}
            </button>
          </div>

          {error && (
            <div className={styles.errorMessageBanner}>
              {error}
            </div>
          )}

          <SimulationResultSection resultado={resultado} formatCurrency={formatCurrency} />
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
