'use client';

/**
 * @file PackagingWizardModal.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Configurador modal interactivo para etapas de envasado comercial (< 100 líneas).
 * @responsibility Orquestar la selección de envase y delegar el cuestionario a PackagingWizardQuestions.
 * @usedBy RecipeStagesList
 * @dependencies react, @/components/ui/SmartModal, ./PackagingWizardQuestions, ../recipeHelpers, ./packaging-wizard.module.css
 */

import React, { useState, useEffect, useMemo } from 'react';
import SmartModal from '@/components/ui/SmartModal';
import { PackagingPresentationSelect } from './PackagingPresentationSelect';
import { PackagingWizardQuestions } from './PackagingWizardQuestions';
import { generatePackagingStagesFromWizard } from '../recipeHelpers';
import { useRecipesData } from '../../hooks/useRecipesData';
import styles from './packaging-wizard.module.css';

export function PackagingWizardModal({
  isOpen,
  presentations = [],
  onClose,
  onGenerateStages
}) {
  const { items: allRecipes = [], products: allProducts = [] } = useRecipesData();

  const commercialPresentations = presentations.filter(p => {
    if (p.activo === false) return false;
    const envase = (p.tipoEnvase || '').toUpperCase();
    const nombre = (p.nombre || '').toUpperCase();
    return envase !== 'TANQUE_GRANEL' && !nombre.includes('A GRANEL') && !nombre.includes('TANQUE');
  });

  const cerealProducts = useMemo(() => {
    return allProducts.filter(p => {
      if (p.activo === false) return false;
      if (p.categoria === 'TOPPING_CEREAL') return true;
      const text = `${p.nombre || ''} ${p.categoria || ''}`.toUpperCase();
      return text.includes('CEREAL') || text.includes('GRANOLA') || text.includes('TOPPING');
    });
  }, [allProducts]);

  const cerealRecipes = useMemo(() => {
    return allRecipes.filter(r => {
      if (r.activo === false) return false;
      if (r.producto?.categoria === 'TOPPING_CEREAL') return true;
      const text = `${r.nombre || ''} ${r.producto?.nombre || ''} ${r.producto?.categoria || ''}`.toUpperCase();
      return text.includes('CEREAL') || text.includes('GRANOLA') || text.includes('TOPPING');
    });
  }, [allRecipes]);

  const [selectedPresId, setSelectedPresId] = useState('');
  const [answers, setAnswers] = useState({
    hasFruitInBottom: true,
    fruitGrams: 30,
    hasSugar: false,
    sweetenerType: 'Azúcar',
    hasDomeOrSpoon: false,
    cerealRecipeId: null,
    hasManualLotLabelling: true
  });

  useEffect(() => {
    if (isOpen && commercialPresentations.length > 0 && !selectedPresId) {
      setSelectedPresId(commercialPresentations[0].id);
    }
  }, [isOpen, commercialPresentations, selectedPresId]);

  if (!isOpen) return null;

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    const selectedPres = commercialPresentations.find(p => String(p.id) === String(selectedPresId));
    const stages = generatePackagingStagesFromWizard({
      presentation: selectedPres,
      ...answers
    });
    if (onGenerateStages) onGenerateStages(stages);
    onClose();
  };

  return (
    <SmartModal isOpen={isOpen} onClose={onClose} title="Configurador de Envasado Comercial">
      <div className={styles.wizardContainer}>
        <p className={styles.introText}>
          Configure el flujo de planta para dosificación, jalea, endulzado y sellado del producto comercial.
        </p>

        <PackagingPresentationSelect
          presentations={commercialPresentations}
          selectedId={selectedPresId}
          onChange={setSelectedPresId}
        />

        <PackagingWizardQuestions
          answers={answers}
          onChange={handleAnswerChange}
          cerealRecipes={cerealRecipes}
          cerealProducts={cerealProducts}
        />

        <div className={styles.actions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button
            type="button"
            className={styles.btnSubmit}
            disabled={commercialPresentations.length === 0}
            onClick={handleGenerate}
          >
            Generar Etapas de Envasado
          </button>
        </div>
      </div>
    </SmartModal>
  );
}

