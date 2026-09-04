"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../lib/api-client';
import styles from './page.module.css';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    criticalStock: 0,
    recentPurchases: 0,
    todaySales: 0,
    activeLots: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Fetch all necessary data concurrently
        const [inventory, purchases, sales, lots] = await Promise.all([
          apiClient.get('/inventory').catch(() => []),
          apiClient.get('/purchases').catch(() => []),
          apiClient.get('/sales').catch(() => []),
          apiClient.get('/lots').catch(() => [])
        ]);

        // Calculate metrics
        // 1. Critical stock: stock <= 10 (or based on minStock if available)
        const criticalStockCount = Array.isArray(inventory) ? inventory.filter(item => item.cantidadActual <= (item.insumo?.stockMinimo || 10)).length : 0;
        
        // 2. Recent purchases (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentPurchasesCount = Array.isArray(purchases) ? purchases.filter(p => new Date(p.fechaCompra) >= sevenDaysAgo).length : 0;

        // 3. Today's sales
        const today = new Date();
        const todaySalesCount = Array.isArray(sales) ? sales.filter(s => {
          const saleDate = new Date(s.fechaVenta);
          return saleDate.getDate() === today.getDate() &&
                 saleDate.getMonth() === today.getMonth() &&
                 saleDate.getFullYear() === today.getFullYear();
        }).length : 0;

        // 4. Active lots
        const activeLotsCount = Array.isArray(lots) ? lots.filter(l => l.estado === 'DISPONIBLE' || l.estado === 'EN_PROCESO' || l.estado === 'ACTIVO').length : 0;

        setMetrics({
          criticalStock: criticalStockCount,
          recentPurchases: recentPurchasesCount,
          todaySales: todaySalesCount,
          activeLots: activeLotsCount
        });
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerTitle}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Panel de control central con indicadores clave de rendimiento (KPIs), métricas operativas y balance financiero en tiempo real.</p>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Stock Crítico</h3>
          <div className={styles.metricValue}>{loading ? '...' : metrics.criticalStock}</div>
          <p>Insumos con bajo inventario</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Compras Recientes</h3>
          <div className={styles.metricValue}>{loading ? '...' : metrics.recentPurchases}</div>
          <p>Últimos 7 días</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Ventas de Hoy</h3>
          <div className={styles.metricValue}>{loading ? '...' : metrics.todaySales}</div>
          <p>Transacciones del día</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Lotes Activos</h3>
          <div className={styles.metricValue}>{loading ? '...' : metrics.activeLots}</div>
          <p>En producción o maduración</p>
        </div>
      </div>

      <div className={styles.quickAccessSection}>
        <h2>Accesos Rápidos</h2>
        <div className={styles.quickAccessGrid}>
          <Link href="/operations/purchases" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>🛒</div>
            <span>Registrar Compra</span>
          </Link>
          <Link href="/operations/production" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>🏭</div>
            <span>Registrar Producción</span>
          </Link>
          <Link href="/commercial/sales" className={styles.quickAccessCard}>
            <div className={styles.quickAccessIcon}>💰</div>
            <span>Nueva Venta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
