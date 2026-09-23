/**
 * @file RecipeSelectorFields.jsx
 * @module operations/production/components/modal-parts
 * @description Campos de selección de receta y cantidad para nueva orden de producción.
 * @responsibility Renderizar selector de receta activa y campo numérico de cantidad planificada.
 */

import React from 'react';
import baseStyles from '../production.module.css';
import styles from '../production-modal.module.css';

/**
 * @param {object} props
 * @param {Array} props.recipes - Lista de recetas disponibles
 * @param {string} props.selectedRecipeId - ID de receta seleccionada
 * @param {Function} props.setSelectedRecipeId - Setter del ID de receta
 * @param {number} props.cantidadPlanificada - Cantidad a producir
 * @param {Function} props.setCantidadPlanificada - Setter de cantidad
 */
export function RecipeSelectorFields({ recipes, selectedRecipeId, setSelectedRecipeId, cantidadPlanificada, setCantidadPlanificada }) {
  return (
    <div className={baseStyles.grid2}>
      <div>
        <label className={styles.label}>Receta a Producir</label>
        <select className={baseStyles.select} value={selectedRecipeId} onChange={e => setSelectedRecipeId(e.target.value)} required>
          <option value="">Seleccione una receta...</option>
          {recipes.filter(r => r.activo).map(r => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={styles.label}>Cantidad a Producir (Unidades Finales)</label>
        <input
          className={baseStyles.input}
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={cantidadPlanificada}
          onChange={e => setCantidadPlanificada(e.target.value)}
          required
        />
      </div>
    </div>
  );
}
