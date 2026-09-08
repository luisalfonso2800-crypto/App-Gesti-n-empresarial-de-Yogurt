/**
 * @file page.jsx
 * @module operations/production
 * @description Orquestador declarativo para operaciones de producción.
 * @responsibility Renderizar flujo principal < 120 líneas.
 * @usedBy Next.js App Router
 * @dependencies Hooks y Componentes locales.
 */
'use client';
import React from 'react';
import { useProductionData } from './hooks/useProductionData';
import { useProductionForm } from './hooks/useProductionForm';
import { ProductionHeader } from './components/ProductionHeader';
import { ProductionTable } from './components/ProductionTable';
import { ProductionModal } from './components/ProductionModal';

export default function ProductionPage() {
  const { productions, recipes, loading, error, fetchData } = useProductionData();
  const form = useProductionForm({ recipes, onSuccess: fetchData });

  if (form.view !== 'list') {
    return (
      <ProductionModal 
        view={form.view} recipes={recipes}
        selectedRecipeId={form.selectedRecipeId} setSelectedRecipeId={form.setSelectedRecipeId}
        cantidadPlanificada={form.cantidadPlanificada} setCantidadPlanificada={form.setCantidadPlanificada}
        variantGroups={form.variantGroups} selectedVariants={form.selectedVariants}
        handleVariantChange={form.handleVariantChange} bomSimulado={form.bomSimulado}
        completeDetalles={form.completeDetalles} setCompleteDetalles={form.setCompleteDetalles}
        onSubmitCreate={form.handleSubmitCreate} onSubmitComplete={form.handleSubmitComplete}
        onClose={form.handleCloseView}
      />
    );
  }

  return (
    <div>
      <ProductionHeader onNewOrder={form.handleOpenCreate} />
      <ProductionTable 
        productions={productions} 
        loading={loading} 
        error={error} 
        onComplete={form.handleOpenComplete} 
      />
    </div>
  );
}
