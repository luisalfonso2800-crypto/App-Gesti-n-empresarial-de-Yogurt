/**
 * @file page.jsx
 * @module operations/lots
 * @description Vista principal de trazabilidad de lotes en cava (SRP <120 líneas, 0 inline styles).
 */
'use client';

import React, { useState, useMemo } from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { AssistedEmptyState } from '@/components/ui/AssistedEmptyState';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Package, RefreshCw, Trash2 } from 'lucide-react';
import styles from './lots.module.css';
import { useLotsData } from './hooks/useLotsData';

function renderGenBadge(gen) {
  const g = Number(gen) || 0;
  if (g === 0) return <span className={styles.badgeF0}>F0 (Madre)</span>;
  if (g >= 4) return <span className={styles.badgeF4}>F4 (Fin de Línea)</span>;
  return <span className={styles.badgeF13}>Pase {g}/4 (F{g})</span>;
}

export default function LotsPage() {
  const { lots, loading, error, fetchLots, handleDiscard, getStatus } = useLotsData();
  const [tab, setTab] = useState('EXISTENCIA');

  const { counts, displayedLots } = useMemo(() => {
    const act = lots.filter(l => Number(l.cantidadDisponible) > 0);
    const cep = lots.filter(l => (l.tipoLote === 'SEMIELABORADO_WIP' || Boolean(l.idLotePadre)) && Number(l.cantidadDisponible) > 0);
    const ago = lots.filter(l => Number(l.cantidadDisponible) <= 0 || l.estado === 'AGOTADO' || l.estado === 'DESCARTADO');
    const filtered = tab === 'EXISTENCIA' ? act : tab === 'CEPAS' ? cep : tab === 'AGOTADOS' ? ago : lots;
    return { counts: { act: act.length, cep: cep.length, ago: ago.length, all: lots.length }, displayedLots: filtered };
  }, [lots, tab]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <Package size={32} className={styles.icon} />
          <div>
            <h1 className={styles.title}>Trazabilidad de Lotes (Cava)</h1>
            <p className={styles.subtitle}>Monitoreo de caducidad, linaje generacional y existencias FEFO</p>
          </div>
        </div>
        <Button variant="secondary" onClick={fetchLots}><RefreshCw size={16}/> Actualizar</Button>
      </header>

      <div className={styles.tabsBar}>
        <button type="button" className={`${styles.tabBtn} ${tab === 'EXISTENCIA' ? styles.tabBtnActive : ''}`} onClick={() => setTab('EXISTENCIA')}>🟢 En Existencia ({counts.act})</button>
        <button type="button" className={`${styles.tabBtn} ${tab === 'CEPAS' ? styles.tabBtnActive : ''}`} onClick={() => setTab('CEPAS')}>🧫 Cepas Disponibles ({counts.cep})</button>
        <button type="button" className={`${styles.tabBtn} ${tab === 'AGOTADOS' ? styles.tabBtnActive : ''}`} onClick={() => setTab('AGOTADOS')}>📁 Archivo / Agotados ({counts.ago})</button>
        <button type="button" className={`${styles.tabBtn} ${tab === 'TODOS' ? styles.tabBtnActive : ''}`} onClick={() => setTab('TODOS')}>Ver Todos ({counts.all})</button>
      </div>

      {displayedLots.length === 0 ? (
        <AssistedEmptyState icon="🏷️" title="No hay lotes en esta categoría" description="Monitorea las existencias, cepas vivas y lotes históricos de la planta." topButtonLabel="Actualizar" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Lote / ID</TH><TH>Linaje</TH><TH>Producto / Tipo</TH><TH>Fabricación</TH><TH>Vencimiento</TH>
              <TH className={styles.textRight}>Unidades Restantes</TH><TH className={styles.textRight}>Costo U.</TH><TH>Estado (FEFO)</TH><TH>Acciones</TH>
            </TR>
          </THead>
          <TBody>
            {displayedLots.map(lote => {
              const status = getStatus(lote.fechaVencimiento);
              const isInoculo = lote.tipoLote === 'SEMIELABORADO_WIP' || Boolean(lote.idLotePadre);
              const rawUMed = (lote.unidad || '').trim();
              const uMed = (rawUMed.toLowerCase() === 'ml' && lote.tipoLote !== 'SEMIELABORADO_WIP') ? 'UND' : (lote.unidad || (isInoculo ? 'Litros' : 'UND'));
              const costoFormateado = `$ ${Math.round(Number(lote.costoUnitario) || 0).toLocaleString('es-CO')}`;
              const codLote = lote.codigoLote || lote.id.split('-')[0].toUpperCase();
              const linajeNodes = Array.isArray(lote.linaje) && lote.linaje.length > 0 ? lote.linaje : ['COMERCIAL'];
              const saldoPositivo = Number(lote.cantidadDisponible) > 0;

              return (
                <TR key={lote.id}>
                  <TD>
                    <span className={styles.monoStrong}>{codLote}</span>
                    <div className={styles.lineageBreadcrumb}>
                      {linajeNodes.map((nodo, idx) => (
                        <React.Fragment key={idx}>
                          <span className={styles.lineageNode}>{nodo}</span>
                          <span className={styles.lineageArrow}>➔</span>
                        </React.Fragment>
                      ))}
                      <span className={`${styles.lineageNode} ${styles.lineageCurrent}`}>{codLote}</span>
                    </div>
                  </TD>
                  <TD>{renderGenBadge(lote.generacion)}</TD>
                  <TD><div>{lote.producto ? lote.producto.nombre : 'Insumo Interno'}</div>{isInoculo && <span className={styles.badgeInoculum}>🧫 INICIADOR</span>}</TD>
                  <TD>{new Date(lote.fechaProduccion).toLocaleDateString()}</TD>
                  <TD><span className={status.days <= 0 ? styles.textDanger : ''}>{lote.fechaVencimiento ? new Date(lote.fechaVencimiento).toLocaleDateString() : '-'}</span></TD>
                  <TD className={styles.textRight}><strong>{Number(lote.cantidadDisponible)}</strong> / {Number(lote.cantidadInicial)} {uMed}</TD>
                  <TD className={styles.textRight}>{costoFormateado}</TD>
                  <TD><Badge status={status.color}>{status.text} {status.days !== undefined ? `(${status.days}d)` : ''}</Badge></TD>
                  <TD>{saldoPositivo ? (<Button variant="danger" size="sm" onClick={() => handleDiscard(lote.id, lote.cantidadDisponible)}><Trash2 size={14} className={styles.btnIcon} /> Descartar</Button>) : (<span className={styles.textMutedSm}>Agotado</span>)}</TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}
    </div>
  );
}

