/**
 * @file ProductBasicFields.jsx
 * @module catalog/products/components/modal-parts
 * @description Campos de identificación básica de producto (Nombre, Presentación, Categoría y Canal de venta).
 * @responsibility Renderizar los selectores y tarjetas didácticas de categoría y canal de venta según presentación WIP o comercial.
 * @usedBy apps/web/src/app/catalog/products/components/ProductModal.jsx
 * @dependencies react, SmartSelect, ../../SmartModal.module.css, ../product-modal.module.css
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import modalStyles from '@/components/ui/SmartModal.module.css';
import styles from '../product-modal.module.css';
import { ProductPresentationSelector } from './ProductPresentationSelector';
import { ProductInventoryIdentityFields } from './ProductInventoryIdentityFields';

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
  isPresentacionError = false,
  isWipMode = false,
  onClose
}) {
  const router = useRouter();

  const handleIrACrearPresentacion = () => {
    const tipoUso = isWipMode ? 'SEMIELABORADO' : 'COMERCIAL';
    if (onClose) onClose();
    router.push(`/catalog/presentations?crear=true&tipoUso=${tipoUso}`);
  };

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
        
        <ProductPresentationSelector
          presentations={presentations}
          formData={formData}
          handleChange={handleChange}
          isPresentacionError={isPresentacionError}
          onQuickCreate={handleIrACrearPresentacion}
        />

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
      </div>

      <ProductInventoryIdentityFields
        formData={formData}
        handleInputChange={handleInputChange}
        handleChange={handleChange}
        isGranel={isGranel}
      />
    </>
  );
}
