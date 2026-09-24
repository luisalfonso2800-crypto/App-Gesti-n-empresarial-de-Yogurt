import React from 'react';
import { montoATextoPesos } from '@/utils/numberToWords';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';
import { ProductPricingProjectionsCard } from './ProductPricingProjectionsCard';

export function ProductPricingAndMarginFields({
  isGranel = false,
  showPricingFields = true,
  formData,
  handleChange,
  precioVentaNum = 0,
  margenObjetivoNum = 0,
  costoMaximoPermitido = 0,
  gananciaEsperada = 0,
  isPrecioVentaError = false,
  isMargenObjetivoError = false,
  margenRealCalculado = 0,
  precioSugeridoCalculado = 0
}) {
  if (isGranel && !showPricingFields) {
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
      {/* Columna Izquierda: Precio de Venta y Precio Sugerido */}
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

        {precioSugeridoCalculado > 0 && (
          <div className={styles.suggestedPriceBox}>
            <div>
              <span className={styles.suggestedLabel}>Sugerido: </span>
              <strong className={styles.suggestedValue}>$ {precioSugeridoCalculado.toLocaleString('es-CO')}</strong>
            </div>
            <button
              type="button"
              className={styles.useSuggestedBtn}
              onClick={() => handleChange({ target: { name: 'precioVenta', value: String(precioSugeridoCalculado) } })}
            >
              Usar este precio
            </button>
          </div>
        )}
      </div>

      {/* Columna Derecha: Margen Objetivo y Costo Estimado */}
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
          placeholder="Ej: 30"
          className={`${modalStyles.input} ${isMargenObjetivoError ? styles.inputErrorBorder : ''}`} 
          required 
        />
        {isMargenObjetivoError && (
          <span className={styles.fieldErrorText}>Este campo es requerido</span>
        )}

        <div className={styles.costWrapper}>
          <label className={modalStyles.label}>
            Costo Estimado Artesanal ($)
          </label>
          <input
            name="costoEstimado"
            type="text"
            inputMode="numeric"
            placeholder="Ej: 3.500"
            value={formData.costoEstimado ? String(formData.costoEstimado).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              handleChange({ target: { name: 'costoEstimado', value: raw } });
            }}
            className={modalStyles.input}
          />
          {margenRealCalculado !== undefined && precioVentaNum > 0 && (
            <div className={`${styles.marginFeedback} ${margenRealCalculado >= (Number(formData.margenObjetivo) || 0) ? styles.marginGood : styles.marginBad}`}>
              {margenRealCalculado >= (Number(formData.margenObjetivo) || 0) ? '🟢' : '🟡'} Margen Real: {margenRealCalculado}%
            </div>
          )}
        </div>
      </div>

      <ProductPricingProjectionsCard
        precioVentaNum={precioVentaNum}
        margenObjetivoNum={margenObjetivoNum}
        costoMaximoPermitido={costoMaximoPermitido}
        gananciaEsperada={gananciaEsperada}
      />
    </div>
  );
}
