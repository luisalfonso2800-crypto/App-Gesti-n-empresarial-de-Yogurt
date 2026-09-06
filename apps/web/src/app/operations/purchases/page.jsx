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

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/purchases');
      setPurchases(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar compras');
    } finally {
      setLoading(false);
    }
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
        <Button onClick={() => router.push('/operations/purchases/new')}>Nueva Compra</Button>
      </div>
      <ContextBanner title="Concepto Técnico" description="Aquí se documenta la llegada de nuevos insumos a la planta. Registra qué se recibió, cuánto costó y confirma que la cantidad física coincida con la comprada." />

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
