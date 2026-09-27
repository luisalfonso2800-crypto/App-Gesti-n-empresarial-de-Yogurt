/**
 * @file LotMobileCard.jsx
 * @module operations/lots/components
 * @description Tarjeta táctil de lote para vista móvil (< 768px) bajo estándar MAN-UI-002 (SRP < 150 líneas).
 * @responsibility Renderizar información de lote en formato card amigable al tacto en planta.
 * @usedBy apps/web/src/app/operations/lots/components/LotsHistoryTable.jsx
 * @dependencies react, lucide-react, @/components/ui/Badge, @/components/ui/Button, ../lots.module.css
 */
'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2, Calendar, DollarSign, Package } from 'lucide-react';
import styles from '../lots.module.css';

function renderGenBadge(gen) {
  const g = Number(gen) || 0;
  if (g === 0) return <span className={styles.badgeF0}>F0 (Madre)</span>;
  if (g >= 4) return <span className={styles.badgeF4}>F4 (Fin de Línea)</span>;
  return <span className={styles.badgeF13}>Pase {g}/4 (F{g})</span>;
}

export function LotMobileCard({
  lote,
  status,
  isInoculo,
  uMed,
  costoFormateado,
  codLote,
  linajeNodes,
  saldoPositivo,
  onOpenDiscard
}) {
  return (
    <div className={styles.mobileCard}>
      {/* Header: Código + Linaje Badge */}
      <div className={styles.mobileCardHeader}>
        <div className={styles.mobileCardTitleRow}>
          <span className={styles.monoStrong}>{codLote}</span>
          <div className={styles.mobileCardGenWrapper}>
            {renderGenBadge(lote.generacion)}
          </div>
        </div>
        <div className={styles.mobileCardStatusBadge}>
          <Badge status={status.color}>
            {status.text} {status.days !== undefined ? `(${status.days}d)` : ''}
          </Badge>
        </div>
      </div>

      {/* Producto & Inóculo */}
      <div className={styles.mobileCardProductRow}>
        <span className={styles.mobileCardProductName}>
          {lote.producto ? lote.producto.nombre : 'Insumo Interno'}
        </span>
        {isInoculo && <span className={styles.badgeInoculum}>🧫 INICIADOR</span>}
      </div>

      {/* Linaje Breadcrumbs */}
      {linajeNodes && linajeNodes.length > 0 && (
        <div className={styles.lineageBreadcrumbMobile}>
          {linajeNodes.map((nodo, idx) => (
            <React.Fragment key={idx}>
              <span className={styles.lineageNode}>{nodo}</span>
              <span className={styles.lineageArrow}>➔</span>
            </React.Fragment>
          ))}
          <span className={`${styles.lineageNode} ${styles.lineageCurrent}`}>{codLote}</span>
        </div>
      )}

      {/* Grid de Datos: Fechas, Cantidades y Costo */}
      <div className={styles.mobileCardGrid}>
        <div className={styles.mobileCardDataCol}>
          <span className={styles.mobileDataLabel}>
            <Calendar size={13} className={styles.inlineIcon} /> Fabricación:
          </span>
          <span className={styles.mobileDataVal}>
            {new Date(lote.fechaProduccion).toLocaleDateString()}
          </span>
        </div>
        <div className={styles.mobileCardDataCol}>
          <span className={styles.mobileDataLabel}>
            <Calendar size={13} className={styles.inlineIcon} /> Vencimiento:
          </span>
          <span className={`${styles.mobileDataVal} ${status.days <= 0 ? styles.textDanger : ''}`}>
            {lote.fechaVencimiento ? new Date(lote.fechaVencimiento).toLocaleDateString() : '-'}
          </span>
        </div>
        <div className={styles.mobileCardDataCol}>
          <span className={styles.mobileDataLabel}>
            <Package size={13} className={styles.inlineIcon} /> Existencia:
          </span>
          <span className={styles.mobileDataValBold}>
            {Number(lote.cantidadDisponible)} / {Number(lote.cantidadInicial)} {uMed}
          </span>
        </div>
        <div className={styles.mobileCardDataCol}>
          <span className={styles.mobileDataLabel}>
            <DollarSign size={13} className={styles.inlineIcon} /> Costo U.:
          </span>
          <span className={styles.mobileDataVal}>
            {costoFormateado}
          </span>
        </div>
      </div>

      {/* Footer Acciones */}
      <div className={styles.mobileCardFooter}>
        {saldoPositivo ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onOpenDiscard(lote)}
            className={styles.mobileActionBtn}
          >
            <Trash2 size={15} className={styles.btnIcon} /> Dar de baja por vencimiento
          </Button>
        ) : (
          <span className={styles.textMutedSm}>Lote Agotado en Cava</span>
        )}
      </div>
    </div>
  );
}
