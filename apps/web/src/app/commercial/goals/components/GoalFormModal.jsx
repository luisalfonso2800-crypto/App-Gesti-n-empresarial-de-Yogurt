'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GoalFormFields } from './GoalFormFields';
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
 * @description Modal de creación y edición de metas y sueños (< 110 líneas).
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
          <GoalFormFields formData={formData} handleChange={handleChange} isPersonal={isPersonal} />

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
