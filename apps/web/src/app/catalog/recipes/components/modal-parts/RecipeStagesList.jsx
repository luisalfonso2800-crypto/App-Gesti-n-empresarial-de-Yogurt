'use client';

/**
 * @file RecipeStagesList.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Orquestador Maestro-Detalle (Split View) para etapas de producción de recetas (< 130 líneas).
 * @responsibility Conectar RecipeStagesTimeline y RecipeStageEditor con soporte para PackagingWizardModal.
 * @usedBy apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
 * @dependencies react, ../parts/RecipeStagesTimeline, ../parts/RecipeStageEditor, ./PackagingWizardModal, ../parts/recipe-stages.module.css
 */

import React, { useState, useEffect } from 'react';
import { RecipeStagesTimeline } from '../parts/RecipeStagesTimeline';
import { RecipeStageEditor } from '../parts/RecipeStageEditor';
import { PackagingWizardModal } from './PackagingWizardModal';
import { usePresentationsData } from '@/app/catalog/presentations/hooks/usePresentationsData';
import styles from '../parts/recipe-stages.module.css';

export function RecipeStagesList({
  etapas = [],
  supplies = [],
  products = [],
  currentRecipeProductId,
  generateStageSummaryText,
  formatMinutesToDigitalClock,
  onApplyStageTemplate,
  onAddEtapa,
  onUpdateEtapa,
  onRemoveEtapa,
  onMoveEtapa,
  onAddDetalle,
  onUpdateDetalle,
  onRemoveDetalle
}) {
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { presentations } = usePresentationsData();

  useEffect(() => {
    if (selectedStageIndex >= etapas.length && etapas.length > 0) {
      setSelectedStageIndex(etapas.length - 1);
    }
  }, [etapas.length, selectedStageIndex]);

  const handleAddStage = () => {
    const nextIdx = etapas.length;
    if (onAddEtapa) onAddEtapa();
    setSelectedStageIndex(nextIdx);
  };

  const handleApplyTemplate = (type) => {
    if (type === 'ENVASADO_COMERCIAL') {
      setIsWizardOpen(true);
      return;
    }
    const currentLen = etapas.length;
    if (onApplyStageTemplate) onApplyStageTemplate(type);
    setSelectedStageIndex(currentLen);
  };

  const handleWizardGenerateStages = (stages) => {
    const currentLen = etapas.length;
    if (onApplyStageTemplate) onApplyStageTemplate(stages);
    setSelectedStageIndex(currentLen);
  };

  const handleMove = (idx, direction) => {
    if (!onMoveEtapa) return;
    onMoveEtapa(idx, direction);
    setSelectedStageIndex(direction === 'UP' && idx > 0 ? idx - 1 : (direction === 'DOWN' && idx < etapas.length - 1 ? idx + 1 : idx));
  };

  const handleDuplicate = (idx) => {
    const stageToCopy = etapas[idx];
    if (!stageToCopy || !onAddEtapa) return;
    onAddEtapa();
    const newIdx = etapas.length;
    if (onUpdateEtapa) {
      ['tiempoEstandarMin', 'tiempoMinimoMin', 'tiempoMaximoMin', 'tempMinimaGrados', 'tempMaximaGrados', 'instrucciones'].forEach(field => {
        onUpdateEtapa(newIdx, field, stageToCopy[field]);
      });
      onUpdateEtapa(newIdx, 'nombre', `${stageToCopy.nombre || 'Etapa'} (Copia)`);
    }
    setSelectedStageIndex(newIdx);
  };

  const currentStage = etapas[selectedStageIndex];
  const summaryText = currentStage && generateStageSummaryText ? generateStageSummaryText(currentStage, supplies, products) : '';
  const selectedProduct = products.find(p => String(p.id) === String(currentRecipeProductId));
  const isGranel = selectedProduct ? (selectedProduct.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || selectedProduct.presentacion?.nombre?.toUpperCase().includes('GRANEL') || ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(selectedProduct.categoria)) : false;
  const isCommercial = Boolean(selectedProduct && !isGranel);

  return (
    <div className={styles.splitLayout}>
      <RecipeStagesTimeline
        etapas={etapas} selectedIndex={selectedStageIndex} isCommercial={isCommercial}
        onSelectStage={setSelectedStageIndex} onAddEtapa={handleAddStage} onApplyTemplate={handleApplyTemplate}
        onMoveEtapa={handleMove} onRemoveEtapa={onRemoveEtapa}
      />
      <RecipeStageEditor
        etapa={currentStage} stageIndex={selectedStageIndex} totalStagesCount={etapas.length}
        etapas={etapas} supplies={supplies} products={products} currentRecipeProductId={currentRecipeProductId}
        summaryText={summaryText} formatMinutesToDigitalClock={formatMinutesToDigitalClock}
        onUpdateEtapa={onUpdateEtapa} onRemoveEtapa={onRemoveEtapa} onMoveEtapa={handleMove}
        onDuplicateEtapa={handleDuplicate} onAddDetalle={onAddDetalle} onUpdateDetalle={onUpdateDetalle}
        onRemoveDetalle={onRemoveDetalle} onSelectStage={setSelectedStageIndex} onAddEtapa={handleAddStage}
      />
      <PackagingWizardModal
        isOpen={isWizardOpen} presentations={presentations}
        onClose={() => setIsWizardOpen(false)} onGenerateStages={handleWizardGenerateStages}
      />
    </div>
  );
}
