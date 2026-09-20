/**
 * @file OnboardingStepItem.jsx
 * @module components/shell/parts
 * @description Renglón individual de paso para el checklist guiado de Onboarding.
 * @responsibility Renderizar el estado, descripción, alerta de base láctea y botón de acción de cada paso.
 * @usedBy apps/web/src/components/shell/OnboardingWizardWidget.jsx
 * @dependencies react, next/link, lucide-react
 */
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import styles from '../onboarding-wizard.module.css';

export function getProgressClass(percentage) {
  if (percentage >= 100) return styles.progress100;
  if (percentage >= 83) return styles.progress83;
  if (percentage >= 67) return styles.progress67;
  if (percentage >= 50) return styles.progress50;
  if (percentage >= 33) return styles.progress33;
  if (percentage >= 17) return styles.progress17;
  return styles.progress0;
}

export default function OnboardingStepItem({
  stepItem,
  isCompleted,
  currentStep,
  hasBulkProduct,
  productsCount,
  onCloseDropdown
}) {
  const isCurrent = !isCompleted && stepItem.step === currentStep;
  const isDone = stepItem.completed;

  let targetRoute = stepItem.route;
  let actionButtonText = isCurrent ? 'Completar' : 'Ver';

  if (stepItem.step === 2 && stepItem.route === '/catalog/suppliers') {
    actionButtonText = 'Registrar Proveedor →';
  } else if (stepItem.step === 4) {
    targetRoute = !hasBulkProduct 
      ? '/catalog/products?crear=base-intermedia' 
      : '/catalog/recipes?crear=receta';
  } else if (stepItem.step === 5) {
    targetRoute = '/operations/production?action=new';
  }

  const handleActionClick = () => {
    onCloseDropdown();
    if (stepItem.step === 4 && hasBulkProduct && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-recipe-modal'));
    }
  };

  let stepTitle = stepItem.title;
  let stepTooltip = stepItem.title;

  if (stepItem.step === 4) {
    stepTitle = 'Ficha Comercial y Receta de Base (Tanque)';
    stepTooltip = '1° Semielaborado a granel (Tanque WIP) requerido antes de ensamblar productos comerciales';
  } else if (stepItem.step === 5) {
    stepTitle = 'Fabricar Primer Lote Comercial (Producto Terminado)';
    stepTooltip = '2° Ensamblar la base con envases y presentación para poder pasar a la venta final';
  }

  return (
    <div
      className={`${styles.stepItem} ${isCurrent ? styles.stepItemActive : ''} ${isDone ? styles.stepItemDone : ''}`}
    >
      <div className={styles.stepLeft}>
        <div
          className={`${styles.stepNumberBadge} ${
            isDone
              ? styles.stepNumberDone
              : isCurrent
              ? styles.stepNumberActive
              : styles.stepNumberPending
          }`}
        >
          {isDone ? <Check size={12} strokeWidth={3} /> : stepItem.step}
        </div>
        <div className={styles.stepTextContainer}>
          <span
            className={`${styles.stepTitle} ${isCurrent ? styles.stepTitleActive : ''}`}
            title={stepTooltip}
          >
            {stepTitle}
          </span>
          {stepItem.step === 4 ? (
            <>
              <span
                className={styles.stepDetail}
                title="Secuencia recomendada: Si elaboras tu propio yogurt desde la leche cruda, registra primero la Base a Granel. Si compras la base ya hecha, pasa directo al Producto Comercial."
              >
                Secuencia: 1° Base a Granel si fabricas en planta, 2° Producto Comercial
              </span>
              {productsCount > 0 && !hasBulkProduct && (
                <span className={styles.warningPendingText}>
                  ⚠️ Pendiente: Base láctea a granel requerida para enlazar fórmulas secundarias.
                </span>
              )}
            </>
          ) : stepItem.step === 5 ? (
            <span
              className={styles.stepDetail}
              title="Requiere ensamblar la base con envases y presentación para habilitar el Paso 6 de Ventas"
            >
              2° Ensamble de base + envases para venta final ({stepItem.detail})
            </span>
          ) : (
            <span className={styles.stepDetail}>
              {stepItem.detail}
            </span>
          )}
        </div>
      </div>

      {stepItem.route && (
        <Link
          href={targetRoute}
          className={styles.stepActionBtn}
          onClick={handleActionClick}
          title={`Ir a ${stepItem.title}`}
        >
          <span>{actionButtonText}</span>
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}
