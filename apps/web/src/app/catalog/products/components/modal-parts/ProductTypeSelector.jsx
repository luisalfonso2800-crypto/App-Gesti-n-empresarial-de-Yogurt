/**
 * @file ProductTypeSelector.jsx
 * @module catalog/products/components/modal-parts
 * @description Pantalla previa de selección de modo de producto (Comercial vs Base WIP) con tarjetas didácticas.
 * @responsibility Presentar las 2 opciones con explicaciones claras para usuario no técnico (SRP < 100).
 */

import React from 'react';
import styles from '../product-modal.module.css';

export function ProductTypeSelector({ onSelect, currentType = 'COMERCIAL' }) {
  return (
    <div className={styles.typeSelectorOverlay}>
      <div className={styles.typeSelectorHeader}>
        <h4 className={styles.typeSelectorHeaderTitle}>¿Qué tipo de producto deseas registrar?</h4>
        <p className={styles.typeSelectorHeaderSubtitle}>
          Selecciona el destino del producto para configurar automáticamente los campos y el costeo correspondiente.
        </p>
      </div>

      <div className={styles.typeSelectorGrid}>
        {/* Tarjeta 1: Producto Comercial Envasado */}
        <div 
          className={`${styles.typeSelectorCard} ${styles.typeSelectorCardCommercial} ${currentType === 'COMERCIAL' ? styles.typeSelectorCardSelected : ''}`}
          onClick={() => onSelect('COMERCIAL')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect('COMERCIAL'); }}
        >
          <div className={styles.typeSelectorIconWrapper}>
            <span className={styles.typeSelectorIcon}>🥛</span>
          </div>
          <div className={styles.typeSelectorTitle}>Producto Comercial Envasado</div>
          <p className={styles.typeSelectorDescription}>
            Yogur, jalea o postre envasado para vender al público. Tendrá precio de venta, IVA, margen y tarifa mayorista.
          </p>
          <button 
            type="button" 
            className={`${styles.typeSelectorBtn} ${styles.typeSelectorBtnCommercial}`}
            onClick={(e) => { e.stopPropagation(); onSelect('COMERCIAL'); }}
          >
            Elegir Comercial
          </button>
        </div>

        {/* Tarjeta 2: Base Intermedia / Tanque (WIP) */}
        <div 
          className={`${styles.typeSelectorCard} ${styles.typeSelectorCardWip} ${currentType === 'WIP' ? styles.typeSelectorCardSelectedWip : ''}`}
          onClick={() => onSelect('WIP')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect('WIP'); }}
        >
          <div className={styles.typeSelectorIconWrapper}>
            <span className={styles.typeSelectorIcon}>🏭</span>
          </div>
          <div className={styles.typeSelectorTitle}>Base Intermedia / Tanque (WIP)</div>
          <p className={styles.typeSelectorDescription}>
            Producto a granel para usar dentro de la planta (ej: base láctea, jarabe). No tiene precio al público. Se almacena por litros o kilos.
          </p>
          <button 
            type="button" 
            className={`${styles.typeSelectorBtn} ${styles.typeSelectorBtnWip}`}
            onClick={(e) => { e.stopPropagation(); onSelect('WIP'); }}
          >
            Elegir Base WIP
          </button>
        </div>
      </div>
    </div>
  );
}
