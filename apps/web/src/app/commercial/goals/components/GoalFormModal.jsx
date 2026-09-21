'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '../goals.module.css';

const INITIAL_FORM = {
  titulo: '',
  descripcion: '',
  ambito: 'EMPRESARIAL',
  categoriaSueno: 'EXPANSION_PLANTA',
  tipoMetrica: 'VENTAS_TOTALES',
  estrategiaAsignacion: 'MANUAL',
  porcentajeFlujo: '10',
  ordenPrioridad: '1',
  valorObjetivo: '',
  fechaInicio: new Date().toISOString().substring(0, 10),
  fechaFin: '',
  observaciones: ''
};

function buildFormState(goal) {
  if (!goal) return INITIAL_FORM;
  return {
    titulo: goal.titulo || '',
    descripcion: goal.descripcion || '',
    ambito: goal.ambito || 'EMPRESARIAL',
    categoriaSueno: goal.categoriaSueno || 'EXPANSION_PLANTA',
    tipoMetrica: goal.tipoMetrica || 'VENTAS_TOTALES',
    estrategiaAsignacion: goal.estrategiaAsignacion || 'MANUAL',
    porcentajeFlujo: goal.porcentajeFlujo != null ? String(goal.porcentajeFlujo) : '10',
    ordenPrioridad: goal.ordenPrioridad != null ? String(goal.ordenPrioridad) : '1',
    valorObjetivo: goal.valorObjetivo != null ? String(goal.valorObjetivo) : '',
    fechaInicio: goal.fechaInicio ? new Date(goal.fechaInicio).toISOString().substring(0, 10) : '',
    fechaFin: goal.fechaFin ? new Date(goal.fechaFin).toISOString().substring(0, 10) : '',
    observaciones: goal.observaciones || ''
  };
}

/**
 * @file GoalFormModal.jsx
 * @description Modal de creación y edición de metas y sueños (< 125 líneas).
 */
export function GoalFormModal({ isOpen, onClose, onSubmit, goalToEdit }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(buildFormState(goalToEdit));
    }
  }, [isOpen, goalToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.valorObjetivo || !formData.fechaFin) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        valorObjetivo: Number(formData.valorObjetivo),
        porcentajeFlujo: Number(formData.porcentajeFlujo || 0),
        ordenPrioridad: Number(formData.ordenPrioridad || 1)
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPersonal = formData.ambito === 'PERSONAL_FAMILIAR';

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {goalToEdit ? '✏️ Editar Meta o Sueño' : '🌱 Sembrar Nueva Meta o Sueño'}
          </h2>
          <button type="button" className={styles.closeModalBtn} onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Ámbito</label>
              <select name="ambito" value={formData.ambito} onChange={handleChange} className={styles.formSelect}>
                <option value="EMPRESARIAL">Objetivo Empresarial</option>
                <option value="PERSONAL_FAMILIAR">Sueño Personal / Familiar</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Categoría</label>
              <select name="categoriaSueno" value={formData.categoriaSueno} onChange={handleChange} className={styles.formSelect}>
                <option value="EXPANSION_PLANTA">Expansión Planta</option>
                <option value="CAPITAL_TRABAJO">Capital Trabajo</option>
                <option value="CASA_CAMPESTRE">Casa Campestre</option>
                <option value="CAMIONETA_TRABAJO">Camioneta</option>
                <option value="BIENESTAR_FAMILIAR">Familia</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>

          {isPersonal && (
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Estrategia de Asignación</label>
                <select name="estrategiaAsignacion" value={formData.estrategiaAsignacion} onChange={handleChange} className={styles.formSelect}>
                  <option value="MANUAL">🏺 Alcancía Manual</option>
                  <option value="PORCENTAJE">📊 % de Flujo (Ventas/Recaudo)</option>
                  <option value="CASCADA">🌊 Cascada por Prioridad</option>
                </select>
              </div>
              {formData.estrategiaAsignacion === 'PORCENTAJE' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>% de Flujo (1-100%)</label>
                  <input type="number" min="1" max="100" name="porcentajeFlujo" value={formData.porcentajeFlujo} onChange={handleChange} required className={styles.formInput} />
                </div>
              )}
              {formData.estrategiaAsignacion === 'CASCADA' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Turno Prioridad (1, 2...)</label>
                  <input type="number" min="1" name="ordenPrioridad" value={formData.ordenPrioridad} onChange={handleChange} required className={styles.formInput} />
                </div>
              )}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>¿Qué queremos conseguir? (Título)</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej. Línea de Enfriamiento" required className={styles.formInput} />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Métrica</label>
              <select name="tipoMetrica" value={formData.tipoMetrica} onChange={handleChange} className={styles.formSelect}>
                <option value="VENTAS_TOTALES">Ventas ($)</option>
                <option value="RECAUDO_CARTERA">Recaudo ($)</option>
                <option value="PRODUCCION_LITROS">Producción (Lts)</option>
                <option value="CONTROL_GASTOS">Gastos ($)</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Objetivo ($ o Lts)</label>
              <input type="number" name="valorObjetivo" value={formData.valorObjetivo} onChange={handleChange} placeholder="15000000" required className={styles.formInput} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fecha Inicio</label>
              <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required className={styles.formInput} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fecha Límite</label>
              <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required className={styles.formInput} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Recompensa / Propósito Emocional</label>
            <input name="observaciones" value={formData.observaciones} onChange={handleChange} placeholder="Estabilidad y descanso familiar" className={styles.formInput} />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : goalToEdit ? 'Guardar Cambios' : 'Sembrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
