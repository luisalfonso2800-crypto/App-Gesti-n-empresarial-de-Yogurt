/**
 * @file ProductionOrderCreator.jsx
 * @module operations/production/components
 * @description Panel interactivo para planificar una nueva orden de producción y calcular BOM en vivo.
 * @responsibility Renderizar selectores de receta, escala, contexto y delegar sección BOM.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 */
import React, { useMemo } from 'react';
import Link from 'next/link';
import { AlertCircle, ClipboardList, X } from 'lucide-react';
import { ProductionBomSection } from './ProductionBomSection';
import {
  calculateProductionFinances,
  calculateRecipeProcessTime,
  generateSuggestedLotCode
} from '../utils/productionCosting';
import styles from '../production.module.css';

export default function ProductionOrderCreator({
  recipes, selectedRecipe, setSelectedRecipe, qty, setQty, bom, bomLoading,
  hasShortage, handlePurchaseShortage, handleCreateOrder, orphanProducts = [], onClose
}) {
  const currentRecipe = recipes.find(r => String(r.id) === String(selectedRecipe));
  const rendimientoBase = Number(currentRecipe?.rendimientoBase) || 0;
  const unidadRendimiento = currentRecipe?.unidadRendimiento || 'Litros';
  const scaleFactor = rendimientoBase > 0 && Number(qty) > 0 ? (Number(qty) / rendimientoBase).toFixed(2) : null;
  const { costoTotalLote, costoUnitarioPorLitro, costoFaltanteTotal, enrichedBom } = useMemo(
    () => calculateProductionFinances(bom, qty), [bom, qty]
  );
  const tiempoProceso = useMemo(() => calculateRecipeProcessTime(currentRecipe), [currentRecipe]);
  const loteSugerido = useMemo(() => generateSuggestedLotCode(new Date(), 1), []);

  return (
    <div className={styles.creatorCard}>
      <div className={styles.smartModalHeader}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerIconBadge}>
            <ClipboardList color="#4ADE80" size={20} />
          </div>
          <div>
            <h3 className={styles.smartModalTitle}>Planificar Orden de Fabricación</h3>
            <p className={styles.smartModalSubtitle}>
              Configura el bache a producir, verifica el BOM en bodega y genera la trazabilidad del lote.
            </p>
          </div>
        </div>
        {onClose && (
          <button type="button" className={styles.smartModalCloseBtn} onClick={onClose} aria-label="Cerrar modal" title="Cerrar">
            <X size={18} />
          </button>
        )}
      </div>
      
      <div className={styles.controlInputPanel}>
        <div className={styles.parametersHeaderRow}>
          <span className={styles.controlInputTitle}>Parámetros de Entrada</span>
          <span className={styles.controlInputBadge}>Zona de Configuración Activa</span>
        </div>
        <div className={styles.parametersBodyGrid}>
          <div className={styles.inputsRow}>
            <div className={styles.formGroup}>
              <label>Receta / Producto</label>
              <select 
                value={selectedRecipe} 
                onChange={e => setSelectedRecipe(e.target.value)} 
                className={styles.selectProminent}
              >
                <option value="">Seleccione una receta activa...</option>
                {recipes.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                {recipes.length === 0 && <option value="mock-123">Yogur Escolar Fresa 150ml (Simulado)</option>}
              </select>
              {orphanProducts.length > 0 && (
                <div className={styles.orphanRecipeSelectNotice}>
                  <AlertCircle size={14} />
                  <span>
                    Hay {orphanProducts.length} producto(s) sin receta. <Link href="/catalog/recipes">Configurar</Link>
                  </span>
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Cantidad ({unidadRendimiento})</label>
              <input 
                type="number" 
                min="1" 
                value={qty} 
                onChange={e => setQty(Number(e.target.value))} 
                className={styles.inputProminent}
                placeholder="Ej: 100"
              />
            </div>
          </div>
          <div className={styles.imageColumn}>
            {currentRecipe?.producto?.imagenUrl || currentRecipe?.imagenUrl ? (
              <img 
                src={currentRecipe?.producto?.imagenUrl || currentRecipe?.imagenUrl} 
                alt={currentRecipe?.nombre || 'Producto'} 
                className={styles.productImagePreviewLarge} 
              />
            ) : (
              <div className={styles.productImagePlaceholderLarge}>🥛</div>
            )}
          </div>
        </div>
      </div>

      {currentRecipe && (
        <div className={styles.recipeContextCard}>
          <div className={styles.recipeContextDetail}>
            <span>✦ Receta: <strong className={styles.recipeContextHighlight}>{currentRecipe.nombre}</strong></span>
            <span>— Rendimiento base: <strong className={styles.recipeContextHighlight}>{rendimientoBase} {unidadRendimiento}</strong></span>
          </div>
          {scaleFactor && (
            <span className={styles.scaleFactorBadge} title="Multiplicador de insumos aplicado al BOM">
              Proporción: {scaleFactor}x Lote Base
            </span>
          )}
        </div>
      )}

      {selectedRecipe && (
        <ProductionBomSection
          costoTotalLote={costoTotalLote}
          costoUnitarioPorLitro={costoUnitarioPorLitro}
          costoFaltanteTotal={costoFaltanteTotal}
          unidadRendimiento={unidadRendimiento}
          tiempoProceso={tiempoProceso}
          loteSugerido={loteSugerido}
          bomLoading={bomLoading}
          hasShortage={hasShortage}
          enrichedBom={enrichedBom}
          handlePurchaseShortage={handlePurchaseShortage}
          handleCreateOrder={handleCreateOrder}
          onClose={onClose}
        />
      )}
    </div>
  );
}
