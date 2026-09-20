/**
 * @file SalesCreditScheduler.jsx
 * @module commercial/sales/components
 * @description Subcomponente modular para control interactivo de crédito y fechas de cobro (SRP < 150 líneas).
 * @responsibility Selección rápida de quincena/fin de mes, desplazamiento ±1 día y feedback en lenguaje natural.
 * @usedBy apps/web/src/app/commercial/sales/components/SaleModal.jsx
 * @dependencies react, @/utils/numberToWords, @/components/ui/SmartModal.module.css
 */
import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from './sale-modal.module.css';

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const toLocalDateString = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseDateSafe = (s) => {
  if (!s) return new Date();
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export function SalesCreditScheduler({
  formData, handleChange, hasSubmitted = false, isFechaLimiteMissing = false
}) {
  if (formData.tipoPago !== 'CREDITO') return null;

  const rawClean = formData.valorPagado ? String(formData.valorPagado).replace(/\D/g, '') : '';
  const cleanNumericVal = rawClean ? parseInt(rawClean, 10) : 0;

  const setFechaDate = (d) => handleChange({ target: { name: 'fechaLimitePago', value: toLocalDateString(d) } });

  const handleQuincena = () => {
    const d = new Date();
    if (d.getDate() >= 15) d.setMonth(d.getMonth() + 1);
    d.setDate(15);
    setFechaDate(d);
  };

  const handleFinMes = () => {
    const d = new Date();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    setFechaDate(new Date(d.getFullYear(), d.getDate() >= lastDay - 1 ? d.getMonth() + 2 : d.getMonth() + 1, 0));
  };

  const handleAddDays = (days) => {
    const base = formData.fechaLimitePago ? parseDateSafe(formData.fechaLimitePago) : new Date();
    base.setDate(base.getDate() + days);
    setFechaDate(base);
  };

  const computeExplanation = () => {
    if (!formData.fechaLimitePago) return null;
    const target = parseDateSafe(formData.fechaLimitePago);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    const label = diffDays < 0 ? `Venció hace ${Math.abs(diffDays)} días` : diffDays === 0 ? 'Vence hoy mismo' : `Faltan ${diffDays} días para el cobro`;
    return `Vence el ${DIAS_SEMANA[target.getDay()]}, ${target.getDate()} de ${MESES[target.getMonth()]} de ${target.getFullYear()} (${label})`;
  };

  const explanation = computeExplanation();

  return (
    <div className={styles.creditSchedulerContainer}>
      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Valor Pagado (Abono Inicial)</label>
          <input
            name="valorPagado"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={rawClean ? rawClean.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
            onChange={(e) => handleChange({ target: { name: 'valorPagado', value: e.target.value.replace(/\D/g, '') } })}
            className={modalStyles.input}
          />
          {cleanNumericVal > 0 && <span className={styles.productPriceWords}>✦ {montoATextoPesos(cleanNumericVal)}</span>}
        </div>

        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>Fecha Límite <span className={styles.requiredAsterisk}>*</span></label>
          <div className={styles.datePickerWithArrows}>
            <button type="button" onClick={() => handleAddDays(-1)} className={styles.btnDateArrow} title="Restar 1 día">◄</button>
            <input 
              name="fechaLimitePago" 
              type="date" 
              value={formData.fechaLimitePago ?? ''} 
              onChange={handleChange} 
              className={`${modalStyles.input} ${hasSubmitted && isFechaLimiteMissing ? styles.inputErrorBorder : ''}`} 
              required 
            />
            <button type="button" onClick={() => handleAddDays(1)} className={styles.btnDateArrow} title="Sumar 1 día">►</button>
          </div>
          {hasSubmitted && isFechaLimiteMissing && <span className={styles.fieldErrorText}>La fecha límite de pago es obligatoria</span>}
        </div>
      </div>

      <div className={styles.creditQuickButtonsRow}>
        <span className={styles.quickButtonsLabel}>Plazos rápidos:</span>
        <button type="button" onClick={handleQuincena} className={styles.btnQuickCredit}>15 de mes</button>
        <button type="button" onClick={handleFinMes} className={styles.btnQuickCredit}>Fin de mes (30)</button>
        <button type="button" onClick={() => handleAddDays(8)} className={styles.btnQuickCredit}>+8 días</button>
        <button type="button" onClick={() => handleAddDays(15)} className={styles.btnQuickCredit}>+15 días</button>
      </div>

      {explanation && <div className={styles.creditExplanationBadge}>🗓️ <span>{explanation}</span></div>}
    </div>
  );
}

export default SalesCreditScheduler;
