'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/States';
import styles from './lots.module.css';
import { ContextBanner } from '../../../components/ui/ContextBanner';


export default function LotsPage() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLots = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/lots');
      setLots(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar lotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Lotes</h1>
          <p className={styles.subtitle}>Trazabilidad de producción con fechas de fabricación, vencimiento y control de calidad.</p>
        </div>
      </div>
      <ContextBanner title="Concepto Técnico" description="Permite hacer seguimiento de calidad. Asigna un código único a cada producción para controlar fechas de vencimiento y rastrear exactamente cuándo se fabricó." />


      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : lots.length === 0 ? (
        <EmptyState title="No hay lotes" description="No hay lotes registrados" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Tipo</TH>
              <TH>Producción (ID)</TH>
              <TH>Fecha Producción</TH>
              <TH>Vencimiento</TH>
              <TH>Disponible</TH>
              <TH>Estado</TH>
            </TR>
          </THead>
          <TBody>
            {lots.map((item) => (
              <TR key={item.id}>
                <TD>{item.tipoLote}</TD>
                <TD>{item.idProduccion}</TD>
                <TD>{new Date(item.fechaProduccion).toLocaleDateString()}</TD>
                <TD>{item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString() : '-'}</TD>
                <TD>{Number(item.cantidadDisponible).toFixed(2)} {item.unidad}</TD>
                <TD>
                  <Badge status={item.estado === 'DISPONIBLE' ? 'active' : 'inactive'}>
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
