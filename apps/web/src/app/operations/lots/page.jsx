/**
 * @file page.jsx
 * @module operations/lots
 * @description Vista principal de trazabilidad de lotes en cava (SRP <120 líneas, 0 inline styles).
 * @responsibility Monitoreo de existencias FEFO, fechas de vencimiento y acciones de descarte.
 * @usedBy Next.js router (/operations/lots)
 * @dependencies React, @/components/ui/Table, @/components/ui/States, @/components/ui/AssistedEmptyState, @/components/ui/Badge, @/components/ui/Button, lucide-react, ./lots.module.css, ./hooks/useLotsData
 */
'use client';

import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Package, RefreshCw, Trash2 } from 'lucide-react';
import styles from './lots.module.css';
import { useLotsData } from './hooks/useLotsData';

export default function LotsPage() {
  const { lots, loading, error, fetchLots, handleDiscard, getStatus } = useLotsData();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <Package size={32} className={styles.icon} />
          <div>
            <h1 className={styles.title}>Trazabilidad de Lotes (Cava)</h1>
            <p className={styles.subtitle}>Monitoreo de caducidad y existencias FEFO (Primero en Vencer, Primero en Salir)</p>
          </div>
        </div>
        <Button variant="secondary" onClick={fetchLots}><RefreshCw size={16}/> Actualizar</Button>
      </header>

      {lots.length === 0 ? (
        <AssistedEmptyState
          icon="🏷️"
          title="No hay lotes con existencias en Cava"
          description="Rastrea la trazabilidad sanitaria, fechas de elaboración y vencimiento por lote producidos en planta."
          topButtonLabel="Actualizar"
        />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Lote / ID</TH>
              <TH>Producto / Tipo</TH>
              <TH>Fabricación</TH>
              <TH>Vencimiento</TH>
              <TH className={styles.textRight}>Unidades Restantes</TH>
              <TH className={styles.textRight}>Costo U.</TH>
              <TH>Estado (FEFO)</TH>
              <TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {lots.map(lote => {
              const status = getStatus(lote.fechaVencimiento);
              const isVencido = status.days <= 0;
              const isInoculo = lote.tipoLote === 'SEMIELABORADO_WIP' || Boolean(lote.idLotePadre);
              const codPadre = lote.lotePadre?.id ? lote.lotePadre.id.split('-')[0].toUpperCase() : null;
              const uMed = lote.unidad || (isInoculo ? 'Litros' : 'UND');
              const costoFormateado = `$ ${Math.round(Number(lote.costoUnitario) || 0).toLocaleString('es-CO')}`;

              return (
                <TR key={lote.id}>
                  <TD><span className={styles.monoStrong}>{lote.id.split('-')[0].toUpperCase()}</span></TD>
                  <TD>
                    <div>{lote.producto ? lote.producto.nombre : 'Insumo Interno'}</div>
                    {isInoculo && (
                      <span className={styles.badgeInoculum}>
                        🧫 INICIADOR {codPadre ? <span className={styles.badgePadreTag}>(Hijo de {codPadre})</span> : null}
                      </span>
                    )}
                  </TD>
                  <TD>{new Date(lote.fechaProduccion).toLocaleDateString()}</TD>
                  <TD>
                    <span className={isVencido ? styles.textDanger : ''}>
                      {lote.fechaVencimiento ? new Date(lote.fechaVencimiento).toLocaleDateString() : '-'}
                    </span>
                  </TD>
                  <TD className={styles.textRight}>
                    <strong>{Number(lote.cantidadDisponible)}</strong> / {Number(lote.cantidadInicial)} {uMed}
                  </TD>
                  <TD className={styles.textRight}>{costoFormateado}</TD>
                  <TD>
                    <Badge status={status.color}>{status.text} {status.days !== undefined ? `(${status.days}d)` : ''}</Badge>
                  </TD>
                  <TD>
                    {Number(lote.cantidadDisponible) > 0 && (
                      <Button variant="danger" size="sm" onClick={() => handleDiscard(lote.id, lote.cantidadDisponible)}>
                        <Trash2 size={14} className={styles.btnIcon} /> Descartar
                      </Button>
                    )}
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}

