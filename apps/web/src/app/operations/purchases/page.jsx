'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './purchases.module.css';
import { ContextBanner } from '../../../components/ui/ContextBanner';

export default function PurchasesPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeOrders, setActiveOrders] = useState([]);

  const fetchPurchases = async () => {
    setLoading(true);
    
    try {
      const data = await apiClient.get('/purchases');
      setPurchases(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar compras históricas');
    }

    try {
      const orders = await apiClient.get('/purchases/orders/active');
      setActiveOrders(orders || []);
    } catch (err) {
      console.warn('Advertencia: No se pudieron cargar las órdenes activas', err);
      setActiveOrders([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Compras</h1>
          <p className={styles.subtitle}>Registro y control de órdenes de adquisición de insumos a proveedores externos.</p>
        </div>
        <Button onClick={() => router.push('/operations/purchases/new?manual=true')}>Nueva Compra</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Aquí se documenta la llegada de nuevos insumos a la planta. Registra qué se recibió, cuánto costó y confirma que la cantidad física coincida con la comprada." />

      {/* Listas de Compra Preparadas / En Ruta */}
      {activeOrders.length > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#166534', marginBottom: '1rem' }}>Listas de Compra Preparadas / En Ruta</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {activeOrders.map(order => {
              const totalItems = order.items.length;
              const completedItems = order.items.filter(i => i.estadoItem !== 'PENDIENTE').length;
              
              return (
                <div key={order.id} style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '250px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#374151' }}>{order.codigo}</span>
                    <Badge status="active">{order.estado}</Badge>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 500 }}>{order.nombre}</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
                    Progreso: {completedItems} / {totalItems} ítems procesados
                  </div>
                  <Button variant="secondary" onClick={() => router.push(`/operations/purchases/new?orderId=${order.id}`)} style={{ width: '100%' }}>
                    Abrir Checklist Operativo
                  </Button>
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
        <EmptyState title="No hay compras" description="Registra la primera compra" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Proveedor (ID)</TH>
              <TH>Fecha</TH>
              <TH>Total</TH>
              <TH>Estado</TH>
            </TR>
          </THead>
          <TBody>
            {purchases.map((item) => (
              <TR key={item.id}>
                <TD>{item.idProveedor}</TD>
                <TD>{new Date(item.fechaCompra).toLocaleDateString()}</TD>
                <TD>${Number(item.total).toFixed(2)}</TD>
                <TD>
                  <Badge status={item.estado === 'COMPLETADO' ? 'active' : 'inactive'}>
                    {item.estado}
                  </Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
