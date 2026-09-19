import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

export function ProductPricingAndMarginFields({
  isGranel = false,
  formData,
  handleChange,
  precioVentaNum = 0,
  margenObjetivoNum = 0,
  costoMaximoPermitido = 0,
  gananciaEsperada = 0,
  isPrecioVentaError = false,
  isMargenObjetivoError = false
}) {
  if (isGranel) {
    return (
      <div className={styles.bulkCostingCard}>
        <div className={styles.bulkCostingHeader}>
          <span>🏭</span> Base Láctea en Tanque (Para Consumo Interno)
        </div>
        <p className={styles.bulkCostingText}>
          Este producto se almacena por litros en marmita/cava y no tiene precio de venta al público porque no está envasado. Su costo se liquidará automáticamente según la leche y los fermentos que consuma la orden de fabricación.
        </p>
        <div className={styles.bulkCostingGuideBox}>
          <div className={styles.bulkCostingGuideTitle}>
            💡 ¿También comercializas este yogur natural al cliente final?
          </div>
          <ol className={styles.bulkCostingGuideList}>
            <li>Guarda primero este registro a granel para acumular los litros de base elaborados en planta.</li>
            <li>Luego crea otro producto llamado por ejemplo <em>&quot;Yogurt Natural 1 Litro&quot;</em> con su respectiva presentación en botella, donde sí podrás fijar el precio de venta.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.commercialPricingGrid}>
      {/* Columna Izquierda: Precio de Venta */}
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Precio de Venta ($) <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input
          name="precioVenta"
          type="text"
          inputMode="numeric"
          min="0"
          placeholder="0"
          value={formData.precioVenta ? String(formData.precioVenta).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '');
            handleChange({ target: { name: 'precioVenta', value: raw } });
          }}
          onKeyDown={(e) => {
            if (e.key === '-') e.preventDefault();
          }}
          className={`${modalStyles.input} ${isPrecioVentaError ? styles.inputErrorBorder : ''}`}
          required
        />
        {isPrecioVentaError && (
          <span className={styles.fieldErrorText}>Este campo es requerido</span>
        )}
        {Boolean(formData.precioVenta && parseInt(String(formData.precioVenta).replace(/\D/g, ''), 10) > 0) && (
          <span className={styles.currencyInWordsText}>
            ✦ {montoATextoPesos(parseInt(String(formData.precioVenta).replace(/\D/g, ''), 10))}
          </span>
        )}
      </div>

      {/* Columna Derecha: Margen Objetivo */}
      <div className={modalStyles.inputGroup}>
        <label className={modalStyles.label}>
          Margen Objetivo (%) <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input 
          type="number"
          step="5"
          min="0"
          max="100"
          name="margenObjetivo" 
          value={formData.margenObjetivo ?? ''} 
          onChange={handleChange} 
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              const current = Number(formData.margenObjetivo) || 0;
              handleChange({ target: { name: 'margenObjetivo', value: Math.min(100, Math.floor(current / 5) * 5 + 5) } });
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              const current = Number(formData.margenObjetivo) || 0;
              handleChange({ target: { name: 'margenObjetivo', value: Math.max(0, Math.ceil(current / 5) * 5 - 5) } });
            }
          }}
          placeholder="Ej: 30"
          className={`${modalStyles.input} ${isMargenObjetivoError ? styles.inputErrorBorder : ''}`} 
          required 
        />
        {isMargenObjetivoError && (
          <span className={styles.fieldErrorText}>Este campo es requerido</span>
        )}
      </div>

      {/* Tarjeta de Proyección Financiera */}
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
    </div>
  );
}
