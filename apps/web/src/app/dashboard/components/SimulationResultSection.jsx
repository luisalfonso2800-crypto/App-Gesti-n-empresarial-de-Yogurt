'use client';
import React from 'react';
import styles from './SimulationDrawer.module.css';
import { AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * @file SimulationResultSection.jsx
 * @description Subcomponente para renderizar la rentabilidad proyectada y tabla de requerimientos en SimulationDrawer (< 100 líneas).
 */
export function SimulationResultSection({ resultado, formatCurrency }) {
  if (!resultado) return null;

  return (
    <>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>IMPACTO Y RENTABILIDAD PROYECTADA</div>
        <div className={`${styles.viabilityBadge} ${resultado.escenario.esViable ? styles.viable : styles.notViable} ${styles.viabilityMarginBottom}`}>
          {resultado.escenario.esViable ? <><CheckCircle size={18}/> PRODUCCIÓN FACTIBLE (STOCK OK)</> : <><AlertTriangle size={18}/> QUIEBRE DE STOCK DETECTADO</>}
        </div>
        
        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>
            <div className={styles.impactLabel}>Ingreso Proy.</div>
            <div className={`${styles.impactValue} ${styles.impactValueGreen}`}>{formatCurrency(resultado.escenario.ingresoProyectado)}</div>
          </div>
          <div className={styles.impactCard}>
            <div className={styles.impactLabel}>Costo Lote</div>
            <div className={`${styles.impactValue} ${styles.impactValueAmber}`}>{formatCurrency(resultado.escenario.costoTotalSimulado)}</div>
          </div>
          <div className={styles.impactCard}>
            <div className={styles.impactLabel}>Utilidad Neta</div>
            <div className={styles.impactValue}>{formatCurrency(resultado.escenario.utilidadProyectada)}</div>
          </div>
          <div className={styles.impactCard}>
            <div className={styles.impactLabel}>Margen Real</div>
            <div className={styles.impactValue}>{resultado.escenario.margenProyectado}%</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>BALANCE DE INSUMOS REQUERIDOS</div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Req.</th>
              <th>Stock</th>
              <th>Déficit</th>
            </tr>
          </thead>
          <tbody>
            {resultado.requerimientos.map(req => (
              <tr key={req.insumoId}>
                <td>{req.nombre} ({req.unidad})</td>
                <td>{req.cantidadNecesaria}</td>
                <td>{req.stockDisponible}</td>
                <td className={req.deficit > 0 ? styles.deficit : styles.ok}>
                  {req.deficit > 0 ? `-${req.deficit}` : 'OK'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
