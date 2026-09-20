/**
 * @file RecipeModal.jsx
 * @module catalog/recipes/components
 * @description Orquestador modular del editor de recetas técnicas (SRP < 150 líneas, cero inline styles).
 */
import React, { useState } from 'react';
import { RecipeHeaderFields } from './modal-parts/RecipeHeaderFields';
import { RecipeStagesList } from './modal-parts/RecipeStagesList';
import { RecipeBalanceFooter } from './modal-parts/RecipeBalanceFooter';
import { RecipeOperationalSummaryModal } from './modal-parts/RecipeOperationalSummaryModal';
import { RecipeExitConfirmModal } from './modal-parts/RecipeExitConfirmModal';
import { generateStageSummaryText, formatMinutesToDigitalClock, validateRecipeSubmission, getPackagingPhysicalLimit } from './recipeHelpers';
import styles from './recipe-modal.module.css';

export { generateStageSummaryText, formatMinutesToDigitalClock, getPackagingPhysicalLimit };

export function RecipeModal({ 
  formData, products = [], supplies = [], onClose, onSubmit, onChange,
  onApplyStageTemplate, onAddEtapa, onUpdateEtapa, onRemoveEtapa, onMoveEtapa,
  onAddDetalle, onUpdateDetalle, onRemoveDetalle, calculateCost, getCostRollup
}) {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false), [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false), [isSubmitting, setIsSubmitting] = useState(false), [validationError, setValidationError] = useState('');
  let totalMateriasPrimas = 0, totalBasesWip = 0;
  formData.etapas?.forEach(e => e.detalles?.forEach(d => {
    if (d.activo !== false) { if (d.idProductoIntermedio) totalBasesWip++; else if (d.idInsumo) totalMateriasPrimas++; }
  }));

  const activeStages = formData.etapas?.filter(e => e.activo !== false) || [], activeStagesCount = activeStages.length;
  const totalProductionTimeMins = activeStages.reduce((acc, stg) => acc + (Number(stg.tiempoEstandarMin) || 0), 0);
  const rollup = getCostRollup ? getCostRollup() : { totalCost: calculateCost ? calculateCost() : 0, costRawSupplies: 0, costWipBases: 0, costPerUnit: 0, hasWipFallback: false };
  const totalCost = rollup.totalCost, rendimientoNum = parseFloat(formData.rendimientoBase) || 0;
  const costPerUnit = rollup.costPerUnit || (rendimientoNum > 0 ? (totalCost / rendimientoNum) : 0);

  const isBulkType = p => p?.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || p?.presentacion?.nombre?.toUpperCase().includes('GRANEL') || ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(p?.categoria);
  const hasBulkProduct = products.some(isBulkType);
  const selectedProduct = products.find(p => String(p.id) === String(formData.idProducto));
  const isSelectedProductBulk = isBulkType(selectedProduct);
  const isCommercialWithoutBulk = Boolean(selectedProduct && !isSelectedProductBulk && !hasBulkProduct);
  const isCommercialProduct = Boolean(selectedProduct && !isSelectedProductBulk);

  const hasPackagingItem = formData.etapas?.some(e => e.activo !== false && e.detalles?.some(d => {
    if (d.activo === false) return false;
    if (d.tipoInsumo === 'EMPAQUE_BASE' || d.tipoInsumo === 'EMPAQUE_COMPLEMENTO') return true;
    const ins = d.idInsumo ? supplies.find(s => s.id === d.idInsumo) : null;
    const nom = ins ? `${ins.categoria || ''} ${ins.subcategoria || ''} ${ins.nombre || ''}`.toUpperCase() : '';
    return ['EMPAQUE', 'ENVASE', 'TAPA', 'VASO', 'BOTELLA'].some(k => nom.includes(k));
  }));
  const isMissingCommercialPackaging = Boolean(isCommercialProduct && !hasPackagingItem);

  const hasCapacityOverflow = formData.etapas?.some(e => e.activo !== false && e.detalles?.some(d => {
    if (d.activo === false) return false;
    const isLiquid = ['l', 'litros'].includes(String(d.unidad || '').toLowerCase()) || Boolean(d.idProductoIntermedio);
    const limit = getPackagingPhysicalLimit(selectedProduct, formData.rendimientoBase);
    return limit && limit.maxLitrosPermitidos > 0 && isLiquid && Number(d.cantidadRequerida || 0) > limit.maxLitrosPermitidos;
  }));
  const precioVentaNum = Number(selectedProduct?.precioVenta) || 0, margenObjetivoNum = Number(selectedProduct?.margenObjetivo) || 0;
  const costoTopePermitido = precioVentaNum > 0 && margenObjetivoNum > 0 ? Math.round(precioVentaNum * (1 - (margenObjetivoNum / 100))) : 0;
  const isInternoOrBulk = precioVentaNum === 0 || isSelectedProductBulk;
  const canSubmit = !isCommercialWithoutBulk && !isMissingCommercialPackaging && !hasCapacityOverflow;
  const handleOpenSummaryModal = () => {
    const err = validateRecipeSubmission(formData, isCommercialWithoutBulk, isMissingCommercialPackaging, selectedProduct);
    if (err) return setValidationError(err);
    setValidationError('');
    setShowSummaryModal(true);
  };
  const handleHeaderCancel = () => {
    if (formData.idProducto || formData.nombre || formData.rendimientoBase || (formData.etapas && formData.etapas.length > 0)) setShowExitConfirm(true);
    else onClose();
  };

  const handleConfirmPublish = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSubmit(e);
      setShowSummaryModal(false);
    } catch (err) {
      const userMsg = err?.message || 'Error al guardar la receta técnica';
      setValidationError(userMsg);
      setShowSummaryModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonReady = canSubmit && formData.idProducto && Number(formData.rendimientoBase) > 0;
  const isHeaderComplete = Boolean(
    (formData.idProducto || formData.productoId) &&
    formData.nombre?.trim() &&
    Number(formData.cantidadBase || formData.rendimientoBase) > 0 &&
    (formData.unidadMedida || formData.unidadRendimiento)?.trim()
  );

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>{formData.id ? 'Editar Receta Técnica' : 'Nueva Receta Técnica'}</h1>
          <span className={styles.subtitle}>Formulación estandarizada y hoja de ruta de fabricación</span>
        </div>
      </div>
      {validationError && (
        <div className={styles.recipeErrorBanner}><span>⚠️</span><span>{validationError}</span></div>
      )}

      <form onSubmit={onSubmit} className={styles.editorContainer}>
        <RecipeHeaderFields
          formData={formData} products={products} onChange={onChange}
          onApplyStageTemplate={onApplyStageTemplate} isCommercialWithoutBulk={isCommercialWithoutBulk}
          isMissingCommercialPackaging={isMissingCommercialPackaging} isCollapsed={isHeaderCollapsed}
          onToggleCollapse={() => setIsHeaderCollapsed(prev => !prev)}
        />
        {!isHeaderComplete ? (
          <div className={styles.headerGatePlaceholder}>
            <div className={styles.headerGateIcon}>🔒</div>
            <h4 className={styles.headerGateTitle}>Paso 1: Completa la información básica</h4>
            <p className={styles.headerGateText}>Ingresa el producto, nombre técnico, cantidad base y unidad de medida para habilitar las etapas y el costeo.</p>
          </div>
        ) : (
          <>
            <div onClickCapture={() => { if (!isHeaderCollapsed && formData.nombre) setIsHeaderCollapsed(true); }}>
              <RecipeStagesList etapas={formData.etapas || []} supplies={supplies} products={products} currentRecipeProductId={formData.idProducto} rendimientoBase={formData.rendimientoBase} generateStageSummaryText={generateStageSummaryText} formatMinutesToDigitalClock={formatMinutesToDigitalClock} onApplyStageTemplate={onApplyStageTemplate} onAddEtapa={onAddEtapa} onUpdateEtapa={onUpdateEtapa} onRemoveEtapa={onRemoveEtapa} onMoveEtapa={onMoveEtapa} onAddDetalle={onAddDetalle} onUpdateDetalle={onUpdateDetalle} onRemoveDetalle={onRemoveDetalle} />
            </div>
            <RecipeBalanceFooter
              formData={formData} totalMateriasPrimas={totalMateriasPrimas} totalBasesWip={totalBasesWip}
              activeStagesCount={activeStagesCount} costPerUnit={costPerUnit} totalCost={totalCost}
              costRawSupplies={rollup.costRawSupplies || 0} costWipBases={rollup.costWipBases || 0}
              hasWipFallback={rollup.hasWipFallback || false} selectedProduct={selectedProduct} isInternoOrBulk={isInternoOrBulk}
              costoTopePermitido={costoTopePermitido} onCancel={handleHeaderCancel} onSummarize={handleOpenSummaryModal} isButtonReady={isButtonReady}
            />
          </>
        )}
      </form>
      <RecipeOperationalSummaryModal
        isOpen={showSummaryModal} isSubmitting={isSubmitting} formData={formData} selectedProduct={selectedProduct}
        activeStages={activeStages} totalProductionTimeMins={totalProductionTimeMins} costPerUnit={costPerUnit} totalCost={totalCost}
        isInternoOrBulk={isInternoOrBulk} costoTopePermitido={costoTopePermitido} canSubmit={canSubmit} supplies={supplies} products={products}
        generateStageSummaryText={generateStageSummaryText} formatMinutesToDigitalClock={formatMinutesToDigitalClock}
        onClose={() => setShowSummaryModal(false)} onDiscard={() => { setShowSummaryModal(false); onClose(); }} onPublish={handleConfirmPublish}
      />
      <RecipeExitConfirmModal isOpen={showExitConfirm} onClose={() => setShowExitConfirm(false)} onConfirmExit={() => { setShowExitConfirm(false); onClose(); }} />
    </div>
  );
}

