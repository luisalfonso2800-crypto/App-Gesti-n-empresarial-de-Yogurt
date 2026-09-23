/**
 * @file BomSimuladoTable.jsx
 * @module operations/production/components/modal-parts
 * @description Tabla de BOM (Lista de Materiales) escalonado con disponibilidad de stock.
 * @responsibility Visualizar materias primas requeridas vs. stock actual para la orden de producción.
 */

import React from 'react';
import baseStyles from '../production.module.css';
import styles from '../production-modal.module.css';

/**
 * @param {object} props
 * @param {Array} props.bomSimulado - Lista de items BOM con disponibilidad calculada
 */
export function BomSimuladoTable({ bomSimulado }) {
  return (
    <div>
      <h3 className={baseStyles.sectionTitle}>BOM (Lista de Materiales) Escalonado y Disponibilidad</h3>
      <table className={baseStyles.bomTable}>
        <thead>
          <tr>
            <th>Etapa</th>
            <th>Insumo / Semielaborado</th>
            <th>Requerido (Teórico)</th>
            <th>Stock Actual</th>
            <th>Faltante</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {bomSimulado.map((b, i) => (
            <tr key={i} className={b.ok ? baseStyles.okRow : baseStyles.missingRow}>
              <td>{b.etapa}</td>
              <td>
                <strong>{b.nombreInsumo}</strong>
                {b.esProductoIntermedio && <span className={styles.bomWipBadge}>WIP</span>}
              </td>
              <td>{Number(b.requeridoTeorico).toFixed(2)} {b.unidad}</td>
              <td>{Number(b.stockActual).toFixed(2)} {b.unidad}</td>
              <td className={b.faltante > 0 ? baseStyles.missingText : ''}>{Number(b.faltante).toFixed(2)}</td>
              <td className={b.ok ? baseStyles.okText : baseStyles.missingText}>{b.ok ? 'OK' : 'FALTANTE'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
