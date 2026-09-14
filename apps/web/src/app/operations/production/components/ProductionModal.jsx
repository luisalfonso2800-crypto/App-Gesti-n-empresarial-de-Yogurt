/**
 * @file ProductionModal.jsx
 * @module operations/production/components
 * @description Orquestador modular de órdenes de producción (SRP < 150 líneas, cero inline styles).
 * @responsibility Delegar la creación o cierre de órdenes de producción a sus subcomponentes especializados.
 * @usedBy apps/web/src/app/operations/production/page.jsx
 * @dependencies react, ./modal-parts/ProductionCreateForm, ./modal-parts/ProductionCompleteForm
 */

import React from 'react';
import { ProductionCreateForm } from './modal-parts/ProductionCreateForm';
import { ProductionCompleteForm } from './modal-parts/ProductionCompleteForm';

export function ProductionModal({
  view,
  recipes = [],
  selectedRecipeId = '',
  setSelectedRecipeId,
  selectedRecipe = null,
  cantidadPlanificada = 1,
  setCantidadPlanificada,
  fechaProduccion = '',
  setFechaProduccion,
  fechaVencimiento = '',
  setFechaVencimiento,
  completeFechaVencimiento = '',
  setCompleteFechaVencimiento,
  variantGroups = [],
  selectedVariants = {},
  handleVariantChange,
  bomSimulado = [],
  completeDetalles = [],
  setCompleteDetalles,
  onSubmitCreate,
  onSubmitComplete,
  onClose,
  availableParentLots = [],
  selectedParentLotId = '',
  setSelectedParentLotId,
  selectedParentLot = null,
  currentWipItem = null,
  parentLotsLoading = false,
  completeSelectedParentLotId = '',
  setCompleteSelectedParentLotId
}) {
  if (view === 'create') {
    return (
      <ProductionCreateForm
        recipes={recipes}
        selectedRecipeId={selectedRecipeId}
        setSelectedRecipeId={setSelectedRecipeId}
        selectedRecipe={selectedRecipe}
        cantidadPlanificada={cantidadPlanificada}
        setCantidadPlanificada={setCantidadPlanificada}
        fechaProduccion={fechaProduccion}
        setFechaProduccion={setFechaProduccion}
        fechaVencimiento={fechaVencimiento}
        setFechaVencimiento={setFechaVencimiento}
        variantGroups={variantGroups}
        selectedVariants={selectedVariants}
        handleVariantChange={handleVariantChange}
        bomSimulado={bomSimulado}
        onSubmitCreate={onSubmitCreate}
        onClose={onClose}
        availableParentLots={availableParentLots}
        selectedParentLotId={selectedParentLotId}
        setSelectedParentLotId={setSelectedParentLotId}
        selectedParentLot={selectedParentLot}
        currentWipItem={currentWipItem}
        parentLotsLoading={parentLotsLoading}
      />
    );
  }

  if (view === 'complete') {
    return (
      <ProductionCompleteForm
        completeFechaVencimiento={completeFechaVencimiento}
        setCompleteFechaVencimiento={setCompleteFechaVencimiento}
        completeDetalles={completeDetalles}
        setCompleteDetalles={setCompleteDetalles}
        availableParentLots={availableParentLots}
        completeSelectedParentLotId={completeSelectedParentLotId}
        setCompleteSelectedParentLotId={setCompleteSelectedParentLotId}
        onSubmitComplete={onSubmitComplete}
        onClose={onClose}
      />
    );
  }

  return null;
}
