/**
 * @file LotsHistoryTable.jsx
 * @module operations/lots/components
 * @description Vista dual responsiva para la bitácora de lotes (Tabla Desktop + Tarjetas Móviles) (SRP < 140 líneas).
 * @responsibility Renderizar tabla desktop o tarjetas móviles y barra de paginación.
 * @usedBy apps/web/src/app/operations/lots/page.jsx
 * @dependencies react, @/components/ui/Table, @/components/ui/Badge, @/components/ui/Button, lucide-react
 */
'use client';

import React from 'react';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { LotMobileCard } from './LotMobileCard';
import { LotsPagination } from './LotsPagination';
import styles from '../lots.module.css';

function renderGenBadge(gen) {
  const g = Number(gen) || 0;
  if (g === 0) return <span className={styles.badgeF0}>F0 (Madre)</span>;
  if (g >= 4) return <span className={styles.badgeF4}>F4 (Fin de Línea)</span>;
  return <span className={styles.badgeF13}>Pase {g}/4 (F{g})</span>;
}

export function LotsHistoryTable({
  paginatedLots = [],
  totalLotsCount = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  onPageChange,
  getStatus,
  onOpenDiscard
}) {
  return (
    <div className={styles.tableAndMobileWrapper}>
      {/* 1. Vista Móvil (< 768px): Tarjetas táctiles */}
      <div className={styles.mobileCardsContainer}>
        {paginatedLots.map((lote) => {
          const status = getStatus(lote.fechaVencimiento);
          const isInoculo = lote.tipoLote === 'SEMIELABORADO_WIP' || Boolean(lote.idLotePadre);
          const rawUMed = (lote.unidad || '').trim();
          const uMed = (rawUMed.toLowerCase() === 'ml' && lote.tipoLote !== 'SEMIELABORADO_WIP') ? 'UND' : (lote.unidad || (isInoculo ? 'Litros' : 'UND'));
          const costoFormateado = `$ ${Math.round(Number(lote.costoUnitario) || 0).toLocaleString('es-CO')}`;
          const codLote = lote.codigoLote || (lote.id ? lote.id.split('-')[0].toUpperCase() : 'N/A');
          const linajeNodes = Array.isArray(lote.linaje) && lote.linaje.length > 0 ? lote.linaje : ['COMERCIAL'];
          const saldoPositivo = Number(lote.cantidadDisponible) > 0;

          return (
            <LotMobileCard
              key={lote.id}
              lote={lote}
              status={status}
              isInoculo={isInoculo}
              uMed={uMed}
              costoFormateado={costoFormateado}
              codLote={codLote}
              linajeNodes={linajeNodes}
              saldoPositivo={saldoPositivo}
              onOpenDiscard={onOpenDiscard}
            />
          );
        })}
      </div>

      {/* 2. Vista Desktop (>= 768px): Tabla tabular MANNÁ */}
      <div className={styles.desktopTableContainer}>
        <Table>
          <THead>
            <TR>
              <TH>Lote / ID</TH>
              <TH>Linaje</TH>
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
            {paginatedLots.map((lote) => {
              const status = getStatus(lote.fechaVencimiento);
              const isInoculo = lote.tipoLote === 'SEMIELABORADO_WIP' || Boolean(lote.idLotePadre);
              const rawUMed = (lote.unidad || '').trim();
              const uMed = (rawUMed.toLowerCase() === 'ml' && lote.tipoLote !== 'SEMIELABORADO_WIP') ? 'UND' : (lote.unidad || (isInoculo ? 'Litros' : 'UND'));
              const costoFormateado = `$ ${Math.round(Number(lote.costoUnitario) || 0).toLocaleString('es-CO')}`;
              const codLote = lote.codigoLote || (lote.id ? lote.id.split('-')[0].toUpperCase() : 'N/A');
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
                  <TD>
                    <div>{lote.producto ? lote.producto.nombre : 'Insumo Interno'}</div>
                    {isInoculo && <span className={styles.badgeInoculum}>🧫 INICIADOR</span>}
                  </TD>
                  <TD>{new Date(lote.fechaProduccion).toLocaleDateString()}</TD>
                  <TD>
                    <span className={status.days <= 0 ? styles.textDanger : ''}>
                      {lote.fechaVencimiento ? new Date(lote.fechaVencimiento).toLocaleDateString() : '-'}
                    </span>
                  </TD>
                  <TD className={styles.textRight}>
                    <strong>{Number(lote.cantidadDisponible)}</strong> / {Number(lote.cantidadInicial)} {uMed}
                  </TD>
                  <TD className={styles.textRight}>{costoFormateado}</TD>
                  <TD>
                    <Badge status={status.color}>
                      {status.text} {status.days !== undefined ? `(${status.days}d)` : ''}
                    </Badge>
                  </TD>
                  <TD>
                    {saldoPositivo ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onOpenDiscard(lote)}
                      >
                        <Trash2 size={14} className={styles.btnIcon} /> Descartar
                      </Button>
                    ) : (
                      <span className={styles.textMutedSm}>Agotado</span>
                    )}
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>

      {/* 3. Paginación */}
      <LotsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalLotsCount}
        itemsPerPage={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
