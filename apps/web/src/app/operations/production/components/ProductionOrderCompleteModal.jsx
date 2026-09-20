/**
 * @file ProductionOrderCompleteModal.jsx
 * @module operations/production/components
 * @description Modal homologado a Design System MANNÁ para liquidar producción y calcular mermas.
 */
import React, { useState } from 'react';
import { CheckCircle2, Check, Scale, FlaskConical, Calendar } from 'lucide-react';
import SmartModal from '@/components/ui/SmartModal';
import styles from '../production.module.css';

const fmt = (val, unit = '') => {
  const n = Number(val) || 0;
  const s = n % 1 === 0 ? Math.round(n).toLocaleString('es-CO') : n.toLocaleString('es-CO', { maximumFractionDigits: 2 });
  return unit ? `${s} ${unit}` : s;
};
const toDateVal = (d) => d.toISOString().split('T')[0];
const hoyStr = toDateVal(new Date());
const calcDef = (days) => toDateVal(new Date(Date.now() + days * 86400000));
const calcDiff = (str) => (!str ? 0 : Math.max(0, Math.round((new Date(`${str}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000)));

export default function ProductionOrderCompleteModal({ completeModal, setCompleteModal, realDetails, setRealDetails, submitComplete }) {
  const [reserveActive, setReserveActive] = useState(false);
  const [inoculoQty, setInoculoQty] = useState('');
  const order = completeModal.order;
  const uMed = order?.receta?.unidadRendimiento || order?.receta?.unidadMedida || 'Litros';
  const prodName = order?.receta?.nombre || order?.producto?.nombre || 'Producto Terminado';
  const volTotal = Number(completeModal.realQty) || 0;
  const inoculoNum = Number(inoculoQty) || 0;
  const loteHijoCode = `INOC-${order?.id?.slice(0, 6).toUpperCase() || 'LOTE'}`;
  const diasVida = order?.producto?.diasVidaUtil || order?.receta?.diasVidaUtil || 21;
  const [fechaVenc, setFechaVenc] = useState(() => calcDef(diasVida));
  const [fechaVencInoc, setFechaVencInoc] = useState(() => calcDef(14));
  const cat = (order?.producto?.categoria || order?.receta?.producto?.categoria || '').toUpperCase();
  const isWipBase = cat === 'BASES_LACTEAS' || cat === 'INTERMEDIO_WIP';
  const isInvalidReserve = isWipBase && reserveActive && (inoculoNum <= 0 || inoculoNum > volTotal);
  const isFullInoculum = isWipBase && reserveActive && volTotal > 0 && inoculoNum === volTotal;
  const volPrincipal = Math.max(0, volTotal - (isWipBase && reserveActive ? inoculoNum : 0));

  const handleClose = () => {
    setReserveActive(false); setInoculoQty('');
    setCompleteModal({ open: false, order: null, realQty: '', reservaInoculo: null });
  };

  const handleConfirm = () => {
    const orderId = order?.id || completeModal?.order?.id;
    if (!orderId) return;
    const reservaPayload = isWipBase && reserveActive && inoculoNum > 0 ? { activo: true, cantidad: inoculoNum, codigoLoteHijo: loteHijoCode, fechaVencimiento: fechaVencInoc } : null;
    setCompleteModal(prev => ({ ...prev, reservaInoculo: reservaPayload }));
    submitComplete(reservaPayload, fechaVenc, orderId);
  };

  return (
    <SmartModal isOpen={Boolean(completeModal.open)} onClose={handleClose} title={`Finalizar y Liquidar: ${prodName}`} isDirty={false} isSubmitting={false}>
      <div className={styles.liquidationBanner}>
        <CheckCircle2 size={16} color="#166534" />
        <span>Al liquidar, se descontarán automáticamente los insumos de bodega y se registrará el lote en cava/tanque.</span>
      </div>

      <div className={styles.volumeFieldGroup}>
        <label className={styles.volumeLabel}>Volumen Real Obtenido ({uMed})</label>
        <input type="number" min="0.1" step="0.1" value={completeModal.realQty} onChange={(e) => setCompleteModal(prev => ({ ...prev, realQty: e.target.value }))} className={styles.inputTableQty} />
        {diasVida > 0 && (
          <div className={styles.expiryBox}>
            <label className={styles.expiryLabel}><Calendar size={14} /> Fecha de Vencimiento:</label>
            <div className={styles.expiryRowContainer}>
              <input type="date" className={styles.expiryDateInput} value={fechaVenc} min={hoyStr} onChange={(e) => setFechaVenc(e.target.value)} />
              <span className={styles.daysBadge}>⏱️ {calcDiff(fechaVenc)} días de vida útil</span>
            </div>
          </div>
        )}
      </div>

      {isWipBase && (
        <div className={styles.inoculumCard}>
          <div className={styles.inoculumHeaderRow}>
            <label className={styles.inoculumToggleLabel}>
              <input type="checkbox" checked={reserveActive} onChange={(e) => { setReserveActive(e.target.checked); if (!e.target.checked) setInoculoQty(''); }} />
              <FlaskConical size={16} /> Reservar fracción para próximo cultivo iniciador (Inóculo)
            </label>
          </div>
          {reserveActive && (
            <div>
              <div className={styles.inoculumInputRow}>
                <input type="number" min="0.1" step="0.1" value={inoculoQty} onChange={(e) => setInoculoQty(e.target.value)} placeholder="0.0" className={styles.inputTableQty} />
                <span className={styles.infoGridLabel}>{uMed} a reservar</span>
              </div>
              <div className={styles.inoculumExpiryGroup}>
                <label className={styles.expiryLabelSub}><Calendar size={13} /> Caducidad Cepa / Inóculo:</label>
                <div className={styles.expiryRowContainer}>
                  <input type="date" className={styles.expiryDateInputCompact} value={fechaVencInoc} min={hoyStr} onChange={(e) => setFechaVencInoc(e.target.value)} />
                  <span className={styles.daysBadgeInoculum}>🧫 {calcDiff(fechaVencInoc)} días de vida útil</span>
                </div>
              </div>
              {isInvalidReserve ? (
                <div className={styles.pokaYokeAlert}>La reserva debe ser mayor a 0 y menor o igual al volumen total ({volTotal} {uMed}).</div>
              ) : (
                <div className={styles.splitBalanceGrid}>
                  <span className={styles.splitBalanceBadge}>Disponible para Venta: {fmt(volPrincipal, uMed)}</span>
                  <span className={`${styles.splitBalanceBadge} ${styles.splitBalanceHighlight}`}>Iniciador: {fmt(inoculoNum, uMed)} ({loteHijoCode})</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <h4 className={styles.consumoTitle}>Consumo Real de Insumos vs Teórico</h4>
      <table className={styles.liquidationTable}>
        <thead>
          <tr><th className={styles.colText}>📦 Insumo</th><th className={styles.colNumber}>📐 Teórico</th><th className={styles.colStatus}>⚖️ Real Utilizado</th><th className={styles.colNumber}>📊 Desviación</th></tr>
        </thead>
        <tbody>
          {order?.detalles?.map((det) => {
            const teorico = Number(det.cantidadTeorica) || 0;
            const initVal = det.cantidadTeorica != null ? Math.round(Number(det.cantidadTeorica) * 100) / 100 : '';
            const realVal = realDetails[det.id] !== undefined ? realDetails[det.id] : initVal;
            const diff = Math.round(((Number(realVal) || 0) - teorico) * 100) / 100;
            const mermaPct = teorico > 0 ? ((diff / teorico) * 100).toFixed(1) : 0;
            return (
              <tr key={det.id}>
                <td className={styles.colText}><div className={styles.insumoName}>{det.insumo?.nombre || det.productoIntermedio?.nombre || 'Insumo'}</div></td>
                <td className={styles.colNumber}>{fmt(teorico, det.unidad)}</td>
                <td className={styles.colStatus}><input type="number" min="0" step="0.01" value={realVal ?? ''} onChange={(e) => setRealDetails({ ...realDetails, [det.id]: e.target.value })} className={styles.inputTableQty} /></td>
                <td className={styles.colNumber}>{diff > 0 ? <span className={styles.badgeExceso}>+{diff} (+{mermaPct}%)</span> : diff < 0 ? <span className={styles.badgeAhorro}>{diff} ({mermaPct}%)</span> : <span className={styles.badgeExact}>0% (Exacto)</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.modalActions}>
        <button type="button" className={styles.btnMannaSecondary} onClick={handleClose}>Cancelar</button>
        <button type="button" className={styles.btnMannaPrimary} onClick={handleConfirm} disabled={!volTotal || !order?.id || isInvalidReserve}><Check size={16} className={styles.iconSpaced} /> Confirmar Liquidación y Entrada a Stock</button>
      </div>
    </SmartModal>
  );
}
