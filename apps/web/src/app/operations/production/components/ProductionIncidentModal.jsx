/**
 * @file ProductionIncidentModal.jsx
 * @module operations/production/components
 * @description Modal Poka-Yoke para auditoría de incidentes y registro de paro de lote en planta.
 * @responsibility Capturar motivo técnico, volumen rescatado vs perdido y notas de operario.
 * @usedBy apps/web/src/app/operations/production/components/ProductionOrderCard.jsx
 */
import React, { useState } from 'react';
import { AlertTriangle, AlertOctagon } from 'lucide-react';
import SmartModal from '@/components/ui/SmartModal';
import styles from '../production.module.css';

const MOTIVOS = [
  { value: '', label: 'Seleccione un motivo...' },
  { value: 'DERRAME_ACCIDENTAL', label: 'Derrame accidental en tanque/línea' },
  { value: 'FALLA_TERMICA_ELECTRICA', label: 'Falla térmica / corte eléctrico' },
  { value: 'CONTAMINACION_CULTIVO', label: 'Contaminación o pérdida de cultivo' },
  { value: 'ERROR_DOSIFICACION', label: 'Error de dosificación o formulación' },
  { value: 'OTRO', label: 'Otro imprevisto operativo' }
];

export default function ProductionIncidentModal({ isOpen, onClose, order, onReportIncident }) {
  const [motivo, setMotivo] = useState('');
  const [volumenRescatado, setVolumenRescatado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planificado = Number(order?.cantidadPlanificada) || 0;
  const unidadMedida = order?.receta?.unidadRendimiento || order?.receta?.unidadMedida || 'Litros';
  const rescatadoNum = Number(volumenRescatado) || 0;
  const mermaEstimada = Math.max(0, planificado - rescatadoNum);
  const isFormValid = Boolean(motivo && observaciones.trim().length >= 5);

  const handleClose = () => {
    if (isSubmitting) return;
    setMotivo('');
    setVolumenRescatado('');
    setObservaciones('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onReportIncident({
        idProduccion: order.id,
        motivo,
        volumenRescatado: rescatadoNum,
        volumenPerdido: mermaEstimada,
        unidad: unidadMedida,
        observaciones: observaciones.trim()
      });
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SmartModal
      isOpen={Boolean(isOpen)}
      onClose={handleClose}
      title="⚠ Reportar Incidencia / Paro de Lote"
      isDirty={Boolean(motivo || volumenRescatado || observaciones)}
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.incidentWarningBanner}>
          <AlertOctagon size={18} />
          <span><strong>Atención:</strong> Se registrará el cese del lote y se liquidará con merma operativa.</span>
        </div>
        <div className={styles.incidentFieldGroup}>
          <label className={styles.incidentFieldLabel}>Motivo Técnico <span className={styles.incidentFieldLabelReq}>*</span></label>
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className={styles.incidentSelect}>
            {MOTIVOS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div className={styles.incidentGrid2}>
          <div className={styles.incidentFieldGroup}>
            <label className={styles.incidentFieldLabel}>Volumen Rescatado ({unidadMedida})</label>
            <input type="number" min="0" step="0.1" value={volumenRescatado} onChange={(e) => setVolumenRescatado(e.target.value)} className={styles.incidentInput} placeholder="0.0" />
          </div>
          <div className={styles.incidentFieldGroup}>
            <label className={styles.incidentFieldLabel}>Merma No Recuperable</label>
            <input type="text" readOnly value={`${mermaEstimada.toFixed(1)} ${unidadMedida}`} className={styles.incidentInput} title="Planificado menos rescatado" />
          </div>
        </div>
        <div className={styles.incidentFieldGroup}>
          <label className={styles.incidentFieldLabel}>Observaciones Técnicas <span className={styles.incidentFieldLabelReq}>*</span></label>
          <textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className={styles.incidentTextarea} placeholder="Describa la causa raíz del paro..." />
        </div>
        <div className={styles.modalActions}>
          <button type="button" onClick={handleClose} disabled={isSubmitting} className={styles.btnSecondaryNeutral}>Cancelar</button>
          <button type="submit" disabled={!isFormValid || isSubmitting} className={styles.btnRegisterStop}>
            <AlertTriangle size={15} className={styles.iconSpaced} />
            {isSubmitting ? 'Registrando...' : 'Registrar Paro de Lote'}
          </button>
        </div>
      </form>
    </SmartModal>
  );
}
