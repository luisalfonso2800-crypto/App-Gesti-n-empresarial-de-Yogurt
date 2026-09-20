/**
 * @file ProductionHistoryTable.jsx
 * @module operations/production/components
 * @description Tabla de datos compacta tipo hoja de cálculo para auditoría y trazabilidad de lotes liquidados.
 * @responsibility Presentar tabla densa de lotes concluidos con filtro de búsqueda rápida y navegación.
 * @usedBy apps/web/src/app/operations/production/components/ProductionOrdersGrid.jsx
 */
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, PackageOpen, ExternalLink } from 'lucide-react';
import styles from '../production.module.css';

export default function ProductionHistoryTable({ orders = [] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [canalFilter, setCanalFilter] = useState('');

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return orders.filter((o) => {
      const prod = (o.producto?.nombre || o.receta?.nombre || '').toLowerCase();
      const lote = (o.idLote || '').toLowerCase();
      const matchesText = !term || prod.includes(term) || lote.includes(term);
      const canal = o.canalVenta || o.producto?.canalVenta || 'SOLO_PLANTA';
      const matchesCanal = !canalFilter || canal === canalFilter;
      return matchesText && matchesCanal;
    });
  }, [orders, searchTerm, canalFilter]);

  return (
    <div className={styles.historyTableContainer}>
      <div className={styles.historyTableHeaderBar}>
        <div className={styles.historyFiltersGroup}>
          <div className={styles.historySearchWrapper}>
            <Search size={15} className={styles.historySearchIcon} />
            <input
              type="text"
              className={styles.historySearchInput}
              placeholder="Buscar por lote o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className={styles.historyFilterSelect}
            value={canalFilter}
            onChange={(e) => setCanalFilter(e.target.value)}
            aria-label="Filtrar por canal de venta"
          >
            <option value="">Todos los Canales</option>
            <option value="SOLO_PLANTA">🏭 Solo Planta</option>
            <option value="MIXTO">🔄 Mixto</option>
            <option value="COMERCIAL">🏪 Comercial (B2B/B2C)</option>
          </select>
        </div>
        <span className={styles.historyCountBadge}>
          Mostrando {filtered.length} de {orders.length} lotes procesados
        </span>
      </div>

      <div className={styles.historyTableResponsive}>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Lote Fabricado</th>
              <th>Producto / Fórmula</th>
              <th>Canal</th>
              <th>Inóculo Origen</th>
              <th className={styles.thRight}>Total Obtenido</th>
              <th className={styles.thRight}>Destino Cava</th>
              <th className={styles.thRight}>Reserva WIP (Inóculo)</th>
              <th className={styles.thCenter}>Estado</th>
              <th className={styles.thCenter}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const nombre = order.producto?.nombre || order.receta?.nombre || 'YOGURT BASE';
              const rawUnit = (order.unidadMedida || order.receta?.unidadRendimiento || order.receta?.unidadMedida || order.receta?.unidad || order.unidad || '').toLowerCase();
              const esUnidad = rawUnit.includes('und') || rawUnit.includes('unidad') || order.producto?.categoria === 'LACTEOS' || Boolean(order.producto?.presentacionId);
              const uMed = esUnidad ? 'und' : (rawUnit.includes('kg') ? 'Kg' : 'L');
              const fecha = order.fechaProduccion ? new Date(order.fechaProduccion).toLocaleDateString('es-CO') : 'Sin fecha';
              const codLote = order.idLote ? order.idLote.split('-')[0].toUpperCase() : '-';
              const lotePrincipal = order.lotes?.[0];
              const loteHijoInoculo = lotePrincipal?.lotesHijos?.[0] || order.lotes?.find((l) => l.idLotePadre || l.tipoLote === 'SEMIELABORADO_WIP');
              const cantInoculo = Number(loteHijoInoculo?.cantidadInicial || order.reservaInoculo?.cantidad || 0);
              const cantTotal = Number(order.cantidadProducidaReal || order.cantidadReal || lotePrincipal?.cantidadInicial || order.cantidadPlanificada || 0);
              const cantCava = Math.max(0, cantTotal - (loteHijoInoculo ? 0 : cantInoculo));
              const codInoc = loteHijoInoculo?.id ? loteHijoInoculo.id.split('-')[0].toUpperCase() : (order.reservaInoculo?.codigoLoteHijo || null);
              const esSemielaborado = order.inoculoOrigenTipo === 'SEMIELABORADO' || Boolean(order.loteInoculoOrigen || order.codigoLoteInoculo || order.loteIniciador?.codigoLote || order.iniciadorLote || order.codigoInoculoMadre);
              const labelInoculo = order.inoculoOrigenLabel || (esSemielaborado ? (order.loteInoculoOrigen || order.codigoLoteInoculo || order.codigoInoculoMadre || 'Semielaborado') : 'Comercial');
              const inoculoFormatted = esSemielaborado ? (String(labelInoculo).split('-')[0].toUpperCase()) : null;
              const canal = order.canalVenta || order.producto?.canalVenta || 'SOLO_PLANTA';
              const canalBadge = canal === 'COMERCIAL' ? '🏪 Comercial' : canal === 'MIXTO' ? '🔄 Mixto' : '🏭 Planta';

              return (
                <tr key={order.id} className={styles.historyTableRow}>
                  <td className={styles.historyCellMuted}>{fecha}</td>
                  <td className={styles.historyCellMono}>{codLote}</td>
                  <td className={styles.historyCellStrong}>{nombre}</td>
                  <td className={styles.historyCellMuted}><span className={styles.historyBadgeComercial}>{canalBadge}</span></td>
                  <td>{esSemielaborado ? <span className={styles.historyBadgeInoculo}>🧫 {inoculoFormatted}</span> : <span className={styles.historyBadgeComercial}>⚗ Comercial</span>}</td>
                  <td className={`${styles.thRight} ${styles.historyCellStrong}`}>{cantTotal} {uMed}</td>
                  <td className={`${styles.thRight} ${styles.historyCellCava}`}>{cantCava} {uMed}</td>
                  <td className={`${styles.thRight} ${styles.historyCellWip}`}>{cantInoculo > 0 ? `${cantInoculo} ${uMed} ${codInoc ? `(${codInoc})` : ''}` : '-'}</td>
                  <td className={styles.thCenter}><span className={styles.historyBadgeLiquidado}>✔ Liquidado</span></td>
                  <td className={styles.thCenter}>
                    <button type="button" className={styles.historyBtnLink} onClick={() => router.push('/operations/lots')} title="Ver trazabilidad del lote">
                      <PackageOpen size={13} /> Ver Lote <ExternalLink size={11} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

