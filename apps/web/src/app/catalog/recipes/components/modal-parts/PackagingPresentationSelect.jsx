'use client';

/**
 * @file PackagingPresentationSelect.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Selector de presentación comercial con alerta de redirección si no hay existencias (< 65 líneas).
 * @responsibility Renderizar el selector de presentaciones o la alerta con acceso directo a presentaciones/insumos.
 * @usedBy PackagingWizardModal
 * @dependencies react, ./WizardDependencyAlert, ./packaging-wizard.module.css
 */

import React from 'react';
import { WizardDependencyAlert } from './WizardDependencyAlert';
import styles from './packaging-wizard.module.css';

export function PackagingPresentationSelect({
  presentations = [],
  selectedId,
  onChange
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Presentación Comercial Registrada *</label>
      {presentations.length === 0 ? (
        <WizardDependencyAlert
          title="Sin presentaciones comerciales activas:"
          message="No hay envases ni presentaciones comerciales registradas en el catálogo (excluyendo granel)."
          primaryActionLabel="↗ Registrar Insumos Faltantes"
          primaryActionUrl="/catalog/supplies"
        />
      ) : (
        <select
          className={styles.select}
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
        >
          {presentations.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre} ({p.cantidadOz ? `${p.cantidadOz} oz / ` : ''}{p.cantidadMl || 0} ml) - {p.tipoEnvase}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
