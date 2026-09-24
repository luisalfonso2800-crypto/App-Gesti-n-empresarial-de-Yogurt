/**
 * @file ProductPricingProjectionsCard.jsx
 * @module catalog/products/components/modal-parts
 * @description Tarjeta de desglose y proyecciones financieras de precio y margen (SRP < 100).
 * @usedBy ProductPricingAndMarginFields.jsx
 */

import React from 'react';
import styles from '../product-modal.module.css';

export function ProductPricingProjectionsCard({
  precioVentaNum = 0,
  margenObjetivoNum = 0,
  costoMaximoPermitido = 0,
  gananciaEsperada = 0
}) {
  return (
    <div className={styles.projectionCard}>
      <div className={styles.projectionGuideText}>
        💡 <strong>Margen Objetivo:</strong> Ganancia bruta esperada sobre la venta. El costo total de receta (ingredientes + envase) no debe superar el tope admisible para garantizar la utilidad del negocio.
      </div>

      {Boolean(precioVentaNum > 0) && (
        <div className={margenObjetivoNum > 0 ? styles.projectionMetricsBoxGreen : styles.projectionMetricsBoxAmber}>
          <div className={styles.projectionMetricsGrid}>
            <div>
              <span className={styles.projectionMetricLabel}>Precio Venta</span>
              <strong className={styles.projectionMetricValue}>$ {precioVentaNum.toLocaleString('es-CO')}</strong>
            </div>
            <div>
              <span className={styles.projectionMetricLabel}>Costo Máx. Receta</span>
              <strong className={styles.projectionMetricValue}>$ {costoMaximoPermitido.toLocaleString('es-CO')}</strong>
            </div>
            <div>
              <span className={styles.projectionMetricLabel}>Ganancia Esperada</span>
              <strong className={margenObjetivoNum > 0 ? styles.projectionMetricGainGreen : styles.projectionMetricGainAmber}>
                $ {gananciaEsperada.toLocaleString('es-CO')} ({margenObjetivoNum}%)
              </strong>
            </div>
          </div>

          <div className={margenObjetivoNum > 0 ? styles.projectionExplanationGreen : styles.projectionExplanationAmber}>
            {margenObjetivoNum > 0 ? (
              `✦ Para un valor de venta de $ ${precioVentaNum.toLocaleString('es-CO')}, se espera que el costo sea máx. $ ${costoMaximoPermitido.toLocaleString('es-CO')} para una ganancia de $ ${gananciaEsperada.toLocaleString('es-CO')}/und.`
            ) : (
              `⚠️ Con margen de 0%, se espera que el costo sea de $ ${precioVentaNum.toLocaleString('es-CO')} y la ganancia sea de $ 0 (venta al costo exacto de producción).`
            )}
          </div>
        </div>
      )}
    </div>
  );
}
