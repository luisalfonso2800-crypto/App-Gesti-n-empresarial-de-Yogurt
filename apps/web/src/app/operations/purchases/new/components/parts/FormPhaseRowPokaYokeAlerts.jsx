/**
 * @file FormPhaseRowPokaYokeAlerts.jsx
 * @module operations/purchases/new/parts
 * @description Advertencias Poka-Yoke e impacto en inventario (<100 líneas, SRP).
 * @usedBy apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowPackaging.jsx
 * @dependencies React, ../../new-purchase.module.css
 */
import React from 'react';
import styles from '../../new-purchase.module.css';

export default function FormPhaseRowPokaYokeAlerts({ row }) {
  const uBase = (row.insumo?.unidadBase || '').toLowerCase();
  const esMedible = ['kg', 'g', 'l', 'ml'].includes(uBase);
  const esUnidad = (row.empaqueTipo === 'UNIDAD' || row.empaque === 'UNIDAD');
  const esContenidoUno = parseFloat(row.contenidoNeto || '1') === 1;

  const emp = (row.empaque || row.empaqueTipo || '').toUpperCase();
  const esMultiEmpaque = ['BOLSA', 'BULTO', 'CAJA', 'BIDÓN', 'CANASTILLA', 'ENVASE'].some(k => emp.includes(k));
  const cont = parseFloat(row.contenidoNeto || '0');

  const empaquesNum = parseInt(row.empaques, 10) || 0;
  const contNetoNum = parseFloat(row.contenidoNeto) || 1;
  const totalNeto = empaquesNum * contNetoNum;
  const u = row.unidadMedida || row.insumo?.unidadBase || 'und';

  return (
    <>
      {/* Capa 3: Advertencia UNIDAD con Contenido = 1 en insumos pesables o medibles */}
      {esMedible && esUnidad && esContenidoUno && (
        <div className={styles.pokaYokeAlert}>
          <div className={styles.pokaYokeAlertMain}>
            <span>⚠️ El insumo se mide en <strong>{row.insumo.unidadBase}</strong>. ¿Seguro que ingresarás solo 1 {row.insumo.unidadBase} por empaque?</span>
            {empaquesNum > 0 ? (
              <span className={styles.pokaYokeAlertPreview}>
                ✦ Impacto actual: Comprando {empaquesNum} empaque(s) entrarán solo <strong>+{Number(totalNeto).toLocaleString('es-CO')} {u}</strong> a bodega.
              </span>
            ) : (
              <span className={styles.pokaYokeAlertPreview}>
                ✦ Tip: Si es una bolsa o frasco, ingresa el contenido neto (ej. 500 g o 1000 ml).
              </span>
            )}
          </div>
        </div>
      )}

      {/* Capa 5: Advertencia Empaque ≠ UNIDAD con Contenido = 1 */}
      {esMultiEmpaque && cont === 1 && (
        <div className={styles.pokaYokeAlert}>
          <div className={styles.pokaYokeAlertMain}>
            <span>⚠️ ¿Un(a) <strong>{row.empaque || row.empaqueTipo}</strong> contiene solo 1 {row.unidadMedida || 'und'}? Verifica el contenido neto por empaque.</span>
            {empaquesNum > 0 ? (
              <span className={styles.pokaYokeAlertPreview}>
                ✦ Ingreso a bodega: {empaquesNum} {row.empaque?.toLowerCase() || 'empaque(s)'} × 1 {u} = <strong>+{Number(totalNeto).toLocaleString('es-CO')} {u}</strong>.
              </span>
            ) : (
              <span className={styles.pokaYokeAlertPreview}>
                ✦ Tip: Especifica cuántos {u} contiene realmente cada {row.empaque?.toLowerCase() || 'empaque'}.
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
