/**
 * @file RecipeModal.jsx
 * @module catalog/recipes/components
 * @description Orquestador modular del editor de recetas técnicas (SRP < 150 líneas, cero inline styles).
 * @responsibility Orquestar cabecera, etapas, balance y modal de auditoría técnica "Hoja de Ruta Operativa de Planta".
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/components/ui/ContextBanner, modal-parts/*, ./recipeHelpers, ./recipe-modal.module.css
 */

import React, { useState } from 'react';
import { ContextBanner } from '@/components/ui/ContextBanner';
import { RecipeHeaderFields } from './modal-parts/RecipeHeaderFields';
import { RecipeStagesList } from './modal-parts/RecipeStagesList';
import { RecipeBalanceFooter } from './modal-parts/RecipeBalanceFooter';
import { RecipeOperationalSummaryModal } from './modal-parts/RecipeOperationalSummaryModal';
import { generateStageSummaryText, formatMinutesToDigitalClock } from './recipeHelpers';
import styles from './recipe-modal.module.css';

export { generateStageSummaryText, formatMinutesToDigitalClock };

export function RecipeModal({ 
  formData, products = [], supplies = [], onClose, onSubmit, onChange,
  onApplyStageTemplate, onAddEtapa, onUpdateEtapa, onRemoveEtapa, onMoveEtapa,
  onAddDetalle, onUpdateDetalle, onRemoveDetalle, calculateCost, getCostRollup
}) {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Conteo de insumos y bases intermedias
  let totalMateriasPrimas = 0;
  let totalBasesWip = 0;
  formData.etapas?.forEach(etapa => {
    etapa.detalles?.forEach(det => {
      if (det.activo !== false) {
        if (det.idProductoIntermedio) totalBasesWip += 1;
        else if (det.idInsumo) totalMateriasPrimas += 1;
      }
    });
  });

  const activeStages = formData.etapas?.filter(e => e.activo !== false) || [];
  const activeStagesCount = activeStages.length;
  const totalProductionTimeMins = activeStages.reduce((acc, stg) => acc + (Number(stg.tiempoEstandarMin) || 0), 0);
  const rollup = getCostRollup ? getCostRollup() : {
    totalCost: calculateCost ? calculateCost() : 0,
    costRawSupplies: 0,
    costWipBases: 0,
    costPerUnit: 0,
    hasWipFallback: false
  };
  const totalCost = rollup.totalCost;
  const rendimientoNum = parseFloat(formData.rendimientoBase) || 0;
  const costPerUnit = rollup.costPerUnit || (rendimientoNum > 0 ? (totalCost / rendimientoNum) : 0);

  // Detección Poka-Yoke de dependencias y empaque
  const hasBulkProduct = products.some(p => p.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || p.presentacion?.nombre?.toUpperCase().includes('GRANEL') || ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(p.categoria));
  const selectedProduct = products.find(p => String(p.id) === String(formData.idProducto));
  const isSelectedProductBulk = selectedProduct ? (selectedProduct.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || selectedProduct.presentacion?.nombre?.toUpperCase().includes('GRANEL') || ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(selectedProduct.categoria)) : false;
  const isCommercialWithoutBulk = Boolean(selectedProduct && !isSelectedProductBulk && !hasBulkProduct);
  const isCommercialProduct = Boolean(selectedProduct && !isSelectedProductBulk);

  const hasPackagingItem = formData.etapas?.some(etapa => etapa.activo !== false && etapa.detalles?.some(det => {
    if (det.activo === false) return false;
    if (det.tipoInsumo === 'EMPAQUE_BASE' || det.tipoInsumo === 'EMPAQUE_COMPLEMENTO') return true;
    if (det.idInsumo) {
      const ins = supplies.find(s => s.id === det.idInsumo);
      if (ins) {
        const nom = `${ins.categoria || ''} ${ins.subcategoria || ''} ${ins.nombre || ''}`.toUpperCase();
        return nom.includes('EMPAQUE') || nom.includes('ENVASE') || nom.includes('TAPA') || nom.includes('VASO') || nom.includes('BOTELLA');
      }
    }
    return false;
  }));
  const isMissingCommercialPackaging = Boolean(isCommercialProduct && !hasPackagingItem);

  const precioVentaNum = Number(selectedProduct?.precioVenta) || 0;
  const margenObjetivoNum = Number(selectedProduct?.margenObjetivo) || 0;
  const costoTopePermitido = precioVentaNum > 0 && margenObjetivoNum > 0 ? Math.round(precioVentaNum * (1 - (margenObjetivoNum / 100))) : 0;
  const isInternoOrBulk = precioVentaNum === 0 || isSelectedProductBulk;
  const canSubmit = !isCommercialWithoutBulk && !isMissingCommercialPackaging;

  const handleOpenSummaryModal = () => {
    if (!formData.idProducto) return alert('Debe seleccionar el producto a fabricar.');
    if (!formData.rendimientoBase || Number(formData.rendimientoBase) <= 0) return alert('Debe ingresar un rendimiento base mayor a cero.');
    if (isCommercialWithoutBulk) return alert('Debe existir al menos un producto base a granel en el catálogo.');
    if (isMissingCommercialPackaging) return alert('Debe agregar al menos un insumo de empaque primario a la receta.');
    setShowSummaryModal(true);
  };

  const handleHeaderCancel = () => {
    const dirty = Boolean(formData.idProducto || formData.nombre || formData.rendimientoBase || (formData.etapas && formData.etapas.length > 0));
    if (dirty && !window.confirm('¿Deseas salir del editor de recetas? Se perderán los cambios no guardados.')) return;
    onClose();
  };

  const handleDiscardCompleteRecipe = () => {
    if (window.confirm('⚠️ Atención: Si cancelas se descartará todo el proceso formulado y se perderán los datos ingresados.\n\n¿Deseas descartar la receta completa?')) {
      setShowSummaryModal(false);
      onClose();
    }
  };

  const handleConfirmPublish = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSubmit(e);
      setShowSummaryModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonReady = canSubmit && formData.idProducto && Number(formData.rendimientoBase) > 0;

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>{formData.id ? 'Editar Receta Técnica' : 'Nueva Receta Técnica'}</h1>
          <span className={styles.subtitle}>Formulación estandarizada y hoja de ruta de fabricación</span>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.btnCancelHeader} onClick={handleHeaderCancel}>Cancelar</button>
          <button type="button" className={`${styles.btnSummarizeHeader} ${isButtonReady ? styles.btnSummarizeHeaderEnabled : styles.btnSummarizeHeaderDisabled}`} onClick={handleOpenSummaryModal} disabled={!isButtonReady}>
            <span>📋</span> Finalizar y Resumir
          </button>
        </div>
      </div>
      <ContextBanner title="Concepto Técnico" description="Instrucciones paso a paso para fabricar los productos. Permite formular materias primas y bases semielaboradas (WIP)." />
      <form onSubmit={onSubmit} className={styles.editorContainer}>
        <RecipeHeaderFields formData={formData} products={products} onChange={onChange} isCommercialWithoutBulk={isCommercialWithoutBulk} isMissingCommercialPackaging={isMissingCommercialPackaging} />
        <RecipeStagesList etapas={formData.etapas || []} supplies={supplies} products={products} currentRecipeProductId={formData.idProducto} generateStageSummaryText={generateStageSummaryText} formatMinutesToDigitalClock={formatMinutesToDigitalClock} onApplyStageTemplate={onApplyStageTemplate} onAddEtapa={onAddEtapa} onUpdateEtapa={onUpdateEtapa} onRemoveEtapa={onRemoveEtapa} onMoveEtapa={onMoveEtapa} onAddDetalle={onAddDetalle} onUpdateDetalle={onUpdateDetalle} onRemoveDetalle={onRemoveDetalle} />
        <RecipeBalanceFooter formData={formData} totalMateriasPrimas={totalMateriasPrimas} totalBasesWip={totalBasesWip} activeStagesCount={activeStagesCount} costPerUnit={costPerUnit} totalCost={totalCost} costRawSupplies={rollup.costRawSupplies || 0} costWipBases={rollup.costWipBases || 0} hasWipFallback={rollup.hasWipFallback || false} selectedProduct={selectedProduct} isInternoOrBulk={isInternoOrBulk} costoTopePermitido={costoTopePermitido} />
      </form>
      <RecipeOperationalSummaryModal isOpen={showSummaryModal} isSubmitting={isSubmitting} formData={formData} selectedProduct={selectedProduct} activeStages={activeStages} totalProductionTimeMins={totalProductionTimeMins} costPerUnit={costPerUnit} totalCost={totalCost} isInternoOrBulk={isInternoOrBulk} costoTopePermitido={costoTopePermitido} canSubmit={canSubmit} supplies={supplies} products={products} generateStageSummaryText={generateStageSummaryText} formatMinutesToDigitalClock={formatMinutesToDigitalClock} onClose={() => setShowSummaryModal(false)} onDiscard={handleDiscardCompleteRecipe} onPublish={handleConfirmPublish} />
    </div>
  );
}
