'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Package, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import styles from './lots.module.css';

export default function LotsPage() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/lots');
      setLots(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async (id, qty) => {
    const qtyToDiscard = prompt(`Cantidad a dar de baja por vencimiento (max ${qty}):`, qty);
    if (!qtyToDiscard || isNaN(qtyToDiscard) || Number(qtyToDiscard) <= 0 || Number(qtyToDiscard) > qty) return;
    
    try {
      await apiClient.post(`/lots/${id}/discard`, { cantidad: Number(qtyToDiscard), motivo: 'Vencimiento en Cava' });
      alert("Lote dado de baja exitosamente.");
      fetchLots();
    } catch (e) {
      alert(e.message);
    }
  };

  const getStatus = (vencimiento) => {
    if (!vencimiento) return { text: 'Sin Vencimiento', color: 'default' };
    const days = Math.ceil((new Date(vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return { text: 'Vencido', color: 'danger', days };
    if (days <= 15) return { text: 'Próximo a Vencer', color: 'warning', days };
    return { text: 'Óptimo', color: 'active', days };
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <Package size={32} className={styles.icon} />
          <div>
            <h1 className={styles.title}>Trazabilidad de Lotes (Cava)</h1>
            <p className={styles.subtitle}>Monitoreo de caducidad y existencias FEFO/PEPS</p>
          </div>
        </div>
        <Button variant="secondary" onClick={fetchLots}><RefreshCw size={16}/> Actualizar</Button>
      </header>

      <Table>
        <THead>
          <TR>
            <TH>Lote / ID</TH>
            <TH>Producto</TH>
            <TH>Fabricación</TH>
            <TH>Vencimiento</TH>
            <TH style={{textAlign:'right'}}>Unidades Restantes</TH>
            <TH style={{textAlign:'right'}}>Costo U.</TH>
            <TH>Estado (FEFO)</TH>
            <TH>Acciones</TH>
          </TR>
        </THead>
        <TBody>
          {lots.map(lote => {
            const status = getStatus(lote.fechaVencimiento);
            const isVencido = status.days <= 0;
            return (
              <TR key={lote.id}>
                <TD><span className={styles.monoStrong}>{lote.id.split('-')[0].toUpperCase()}</span></TD>
                <TD>{lote.producto ? lote.producto.nombre : 'Insumo'}</TD>
                <TD>{new Date(lote.fechaProduccion).toLocaleDateString()}</TD>
                <TD>
                  <span className={isVencido ? styles.textDanger : ''}>
                    {lote.fechaVencimiento ? new Date(lote.fechaVencimiento).toLocaleDateString() : '-'}
                  </span>
                </TD>
                <TD style={{textAlign:'right'}}>
                  <strong>{Number(lote.cantidadDisponible)}</strong> / {Number(lote.cantidadInicial)}
                </TD>
                <TD style={{textAlign:'right'}}>${Number(lote.costoUnitario || 0).toLocaleString()}</TD>
                <TD>
                  <Badge status={status.color}>{status.text} {status.days !== undefined ? `(${status.days}d)` : ''}</Badge>
                </TD>
                <TD>
                  {Number(lote.cantidadDisponible) > 0 && (
                     <Button variant="danger" size="sm" onClick={() => handleDiscard(lote.id, lote.cantidadDisponible)}>
                       <Trash2 size={14} style={{marginRight:'4px'}}/> Descartar
                     </Button>
                  )}
                </TD>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
}
