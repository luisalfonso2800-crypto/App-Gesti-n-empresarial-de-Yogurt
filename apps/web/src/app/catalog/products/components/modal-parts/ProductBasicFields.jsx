/**
 * @file ProductBasicFields.jsx
 * @module catalog/products/components/modal-parts
 * @description Campos de identificación básica de producto (Nombre, Presentación, Categoría y Canal de venta).
 * @responsibility Renderizar los selectores y tarjetas didácticas de categoría y canal de venta según presentación WIP o comercial.
 * @usedBy apps/web/src/app/catalog/products/components/ProductModal.jsx
 * @dependencies react, SmartSelect, ../../SmartModal.module.css, ../product-modal.module.css
 */

import React from 'react';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';

export function ProductBasicFields({
  formData,
  handleInputChange,
  handleChange,
  presentations = [],
  availableCategories = [],
  canalesVenta = [],
  hintsCategoriaWip = {},
  hintsCanalVenta = {},
  isGranel = false,
  isBaseIntermedia = false,
  isNombreError = false,
  isPresentacionError = false
}) {
  return (
    <>
      <div className={modalStyles.twoColumns}>
        <div className={modalStyles.inputGroup}>
          <label className={modalStyles.label}>
            Nombre <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input 
            name="nombre" 
            value={formData.nombre ?? ''} 
            onChange={handleInputChange} 
            placeholder="Ej: YOGURT FRESA"
            className={`${modalStyles.input} ${styles.uppercaseInput} ${isNombreError ? styles.inputErrorBorder : ''}`} 
            required 
          />
          {isNombreError && (
            <span className={styles.fieldErrorText}>Este campo es requerido</span>
          )}
        </div>
        
        <div>
          <SmartSelect
            label="Presentación"
            name="idPresentacion"
            value={formData.idPresentacion ?? ''}
            onChange={handleChange}
            options={presentations.map(p => ({ id: p.id, label: p.nombre }))}
            required
            placeholder="Seleccione presentación"
            className={isPresentacionError ? styles.inputErrorBorder : ''}
          />
          {isPresentacionError && (
            <span className={styles.fieldErrorText}>Este campo es requerido</span>
          )}
        </div>

        {/* Tarjeta Informativa WIP / A Granel */}
        {isGranel && (
          <div className={styles.wipNoticeCard}>
            <span className={styles.wipNoticeIcon}>{isBaseIntermedia ? '🥛' : '💡'}</span>
            <div className={styles.wipNoticeContent}>
              <strong>{isBaseIntermedia ? 'Paso Clave: Crear Producto Base (A Granel):' : 'Producto Semielaborado / Base en Tanque:'}</strong>{' '}
              {isBaseIntermedia
                ? "Registra aquí la base láctea (ej. 'Base Blanca de Yogurt' o 'Jalea Frutos Rojos') que se elaborará en tanque o marmita. Este producto semielaborado quedará en inventario a granel y servirá como insumo para preparar todos los yogures y postres terminados de la planta."
                : "Este producto se formulará y fabricará a granel (litros/kilos) en tanque o marmita. Una vez producido, su stock quedará disponible automáticamente como ingrediente base para elaborar los yogures, jaleas y postres comerciales de la planta."}
            </div>
          </div>
        )}
      </div>

      <div className={modalStyles.twoColumns}>
        <div>
          <SmartSelect
            label="Categoría"
            name="categoria"
            value={formData.categoria ?? ''}
            onChange={handleChange}
            options={availableCategories}
            required
            placeholder="Seleccione categoría"
          />
          {isGranel && hintsCategoriaWip[formData.categoria] && (
            <div className={styles.wipHintBox}>
              <span className={styles.wipHintIcon}>
                {hintsCategoriaWip[formData.categoria].icon}
              </span>
              <span className={styles.wipHintText}>
                <strong>Aplica para:</strong> {hintsCategoriaWip[formData.categoria].text}
              </span>
            </div>
          )}
        </div>

        <div>
          <SmartSelect
            label="Canal de Venta"
            name="canalVenta"
            value={formData.canalVenta ?? ''}
            onChange={handleChange}
            options={canalesVenta}
            required
            placeholder="Seleccione destino del producto..."
          />
          {formData.canalVenta && hintsCanalVenta[formData.canalVenta] && (
            <div className={styles.canalHintBox}>
              <span className={styles.canalHintIcon}>{hintsCanalVenta[formData.canalVenta].icon}</span>
              <span>{hintsCanalVenta[formData.canalVenta].text}</span>
            </div>
          )}
        </div>

        {/* Micro-texto explicativo de Semielaborado (WIP) */}
        {(isGranel || ['INSUMO_BASE_WIP', 'BASES_LACTEAS', 'DULCES_JALEAS', 'TOPPING_CEREAL'].includes(formData.categoria)) && (
          <div className={styles.wipConceptText}>
            💡 <strong>¿Qué es un Semielaborado (WIP - Work in Process)?</strong> Es un producto intermedio elaborado dentro de la planta (ej. Base Blanca de yogur, jalea casera de frutos) que no se comercializa de forma directa al público, sino que se almacena temporalmente a granel (litros/kilos) para ser consumido como materia prima en las recetas de envasado final.
          </div>
        )}
      </div>
    </>
  );
}
