"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../lib/api-client';
import styles from './page.module.css';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    capitalInsumos: 0,
    capitalCava: 0,
    criticalStock: 0,
    lotesPorVencer: 0,
    ordenesPlanificadas: 0,
    ordenesEnProceso: 0,
    ventasMes: 0,
    margenMes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [
          invResponse, 
          prodResponse, 
          sales, 
          lots,
          production
        ] = await Promise.all([
          apiClient.get('/inventory').catch(() => ({ data: [], metadata: { valorTotalBodega: 0, totalCriticos: 0 } })),
          apiClient.get('/inventory/finished-products').catch(() => ({ data: [], metadata: { valorTotalBodega: 0 } })),
          apiClient.get('/sales').catch(() => []),
          apiClient.get('/lots').catch(() => []),
          apiClient.get('/production').catch(() => [])
        ]);

        const capitalInsumos = invResponse?.metadata?.valorTotalBodega || 0;
        const criticalStock = invResponse?.metadata?.totalCriticos || 0;
        
        const capitalCava = prodResponse?.metadata?.valorTotalBodega || 0;

        const lotesPorVencer = Array.isArray(lots) ? lots.filter(l => {
          if (!l.fechaVencimiento || Number(l.cantidadDisponible) <= 0) return false;
          const days = (new Date(l.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24);
          return days <= 15;
        }).length : 0;

        const ordenesPlanificadas = Array.isArray(production) ? production.filter(p => p.estado === 'PLANIFICADA').length : 0;
        const ordenesEnProceso = Array.isArray(production) ? production.filter(p => p.estado === 'EN_PROCESO').length : 0;

        // Sales current month
        const now = new Date();
        const monthSales = Array.isArray(sales) ? sales.filter(s => {
          const sd = new Date(s.fechaVenta);
          return sd.getMonth() === now.getMonth() && sd.getFullYear() === now.getFullYear();
        }) : [];

        let ventasMes = 0;
        let margenMes = 0;
        monthSales.forEach(s => {
          ventasMes += Number(s.totalVenta);
          s.detalles.forEach(d => {
            margenMes += Number(d.utilidadTotal || 0);
          });
        });

        setMetrics({
          capitalInsumos, capitalCava,
          criticalStock, lotesPorVencer,
          ordenesPlanificadas, ordenesEnProceso,
          ventasMes, margenMes
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const totalCapital = metrics.capitalInsumos + metrics.capitalCava;

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerTitle}>
        <h1 className={styles.title}>Panel Gerencial & Cruce Financiero</h1>
        <p className={styles.subtitle}>Métricas consolidadas de inventario inmovilizado, alertas críticas, planta productiva y facturación.</p>
      </div>

      <div className={styles.metricsGrid}>
        
        {/* Capital Inmovilizado */}
        <div className={styles.metricCard}>
          <h3>Capital Total Inmovilizado</h3>
          <div className={styles.metricValue}>${loading ? '...' : totalCapital.toLocaleString()}</div>
          <div className={styles.metricSub}>
            Insumos: ${loading ? '0' : metrics.capitalInsumos.toLocaleString()} | 
            Cava: ${loading ? '0' : metrics.capitalCava.toLocaleString()}
          </div>
        </div>

        {/* Alertas */}
        <div className={styles.metricCard} style={{ borderColor: (metrics.criticalStock > 0 || metrics.lotesPorVencer > 0) ? '#fca5a5' : '#e5e7eb', backgroundColor: (metrics.criticalStock > 0 || metrics.lotesPorVencer > 0) ? '#fef2f2' : '#ffffff' }}>
          <h3 style={{color: '#9f1239'}}>Alertas Críticas</h3>
          <div className={styles.metricValue} style={{color: '#9f1239'}}>
            {loading ? '...' : (metrics.criticalStock + metrics.lotesPorVencer)}
          </div>
          <div className={styles.metricSub}>
            Insumos Agotados: {metrics.criticalStock} | Lotes por Vencer: {metrics.lotesPorVencer}
          </div>
        </div>

        {/* Planta */}
        <div className={styles.metricCard}>
          <h3>Estado de Planta</h3>
          <div className={styles.metricValue}>{loading ? '...' : (metrics.ordenesEnProceso + metrics.ordenesPlanificadas)}</div>
          <div className={styles.metricSub}>
            En Proceso: {metrics.ordenesEnProceso} | Planificadas: {metrics.ordenesPlanificadas}
          </div>
        </div>

        {/* Ventas */}
        <div className={styles.metricCard}>
          <h3>Ventas del Mes</h3>
          <div className={styles.metricValue}>${loading ? '...' : metrics.ventasMes.toLocaleString()}</div>
          <div className={styles.metricSub}>
            Margen Bruto Estimado: <strong style={{color: metrics.margenMes > 0 ? '#059669' : '#dc2626'}}>${loading ? '0' : metrics.margenMes.toLocaleString()}</strong>
          </div>
        </div>

      </div>

      <div className={styles.quickAccessSection}>
        <h2>Accesos Rápidos del Ecosistema</h2>
        <div className={styles.quickAccessGrid}>
          <Link href="/operations/production" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>🏭</div>
            <span>Fabricación</span>
          </Link>
          <Link href="/operations/lots" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>📦</div>
            <span>Trazabilidad Lotes</span>
          </Link>
          <Link href="/commercial/sales" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>💰</div>
            <span>Despachos y Ventas</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
