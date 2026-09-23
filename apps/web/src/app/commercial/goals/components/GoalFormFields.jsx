'use client';

import React from 'react';
import styles from '../goals.module.css';

/**
 * @file GoalFormFields.jsx
 * @description Campos de formulario para el modal de metas y sueños.
 */
export function GoalFormFields({ formData, handleChange, isPersonal }) {
  return (
    <>
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
    </>
  );
}
