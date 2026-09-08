'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './inventory.module.css';
import { ContextBanner } from '../../../components/ui/ContextBanner';


export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/inventory');
      setInventory(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Inventario</h1>
          <p className={styles.subtitle}>Control de existencias físicas disponibles en bodega, movimientos y alertas de reabastecimiento.</p>
        </div>
      </div>
      <ContextBanner title="Concepto Técnico" description="Muestra la cantidad real de materiales y productos almacenados en este momento, y calcula cuánto dinero representa ese inventario guardado en bodega." />


      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : inventory.length === 0 ? (
        <EmptyState title="No hay inventario" description="No hay niveles de stock registrados" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Insumo (ID)</TH>
              <TH>Cantidad Actual</TH>
              <TH>Fecha Actualización</TH>
            </TR>
          </THead>
          <TBody>
            {inventory.map((item) => (
              <TR key={item.id}>
                <TD>{item.idInsumo}</TD>
                <TD>{Number(item.cantidadActual).toFixed(2)}</TD>
                <TD>{new Date(item.fechaActualizacion).toLocaleString()}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
