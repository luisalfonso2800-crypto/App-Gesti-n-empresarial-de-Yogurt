/**
 * @file ChecklistPrintTable.jsx
 * @module operations/purchases/new/parts
 * @description Vista tabular optimizada exclusivamente para impresión física del checklist.
 * @responsibility Agrupar insumos por proveedor con casillas de verificación y datos comerciales.
 * @usedBy apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function ChecklistPrintTable({ checklistGrouped }) {
  return (
    <div className={styles.printTableContainer}>
      {Object.entries(checklistGrouped).map(([prov, items]) => (
        <div key={`print-${prov}`}>
          <h2 className={styles.printProvTitle}>Proveedor: {prov}</h2>
          <table className={styles.printTable}>
            <thead>
              <tr>
                <th className={styles.thCheckWidth}>[ ]</th>
                <th>Insumo</th>
                <th>Marca</th>
                <th>Presentación</th>
                <th>Cant.</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={`print-item-${item._id}`}>
                  <td><div className={styles.printCheckbox}></div></td>
                  <td><b>{item.insumoData?.nombre}</b><br/>{item.insumoData?.categoria}</td>
                  <td>{item.insumoData?.marca || '-'}</td>
                  <td>
                    {item.priceData?.presentacionCompra || (item.esPendienteManual ? 'Pendiente' : 'Bulto')} <br/>
                    {item.cantidadSolicitada || 1} {item.insumoData?.unidadBase || item.unidadMedida || 'u'}
                  </td>
                  <td>{item.cantidadSolicitada || ''}</td>
                  <td>{item.esPendienteManual ? 'PENDIENTE MANUAL' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
