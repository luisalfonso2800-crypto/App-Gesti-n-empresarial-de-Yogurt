/**
 * @file OnboardingWizardWidget.jsx
 * @module components/shell
 * @description Widget de Onboarding guiado en el Header para orientar en la puesta en marcha según la cadena de valor (SRP + CSS Modules).
 * @responsibility Renderizar píldora compacta interactiva con progreso y menú desplegable de 6 pasos con enlaces directos.
 * @usedBy apps/web/src/components/shell/Header.jsx
 * @dependencies react, lucide-react, @/hooks/useOnboardingStatus, ./parts/OnboardingStepItem, ./parts/useOnboardingBulkCheck
 */
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, RotateCw, Compass } from 'lucide-react';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import styles from './onboarding-wizard.module.css';
import OnboardingStepItem, { getProgressClass } from './parts/OnboardingStepItem';
import { useOnboardingBulkCheck } from './parts/useOnboardingBulkCheck';

export function OnboardingWizardWidget() {
  const pathname = usePathname();
  const { data, loading, refreshOnboarding } = useOnboardingStatus();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const hasBulkProduct = useOnboardingBulkCheck(isOpen);

  useEffect(() => {
    refreshOnboarding();
    const handleRefresh = () => refreshOnboarding();
    window.addEventListener('onboarding:refresh', handleRefresh);
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('onboarding:refresh', handleRefresh);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pathname, refreshOnboarding]);

  if (!data && loading) {
    return (
      <div className={styles.onboardingContainer}>
        <div className={`${styles.onboardingTrigger} ${styles.onboardingTriggerLoading}`}>
          <RotateCw size={14} className="animate-spin" />
          <span>Analizando planta...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { currentStep, isCompleted, progressPercentage, completedStepsCount, totalSteps = 6, steps = [] } = data;
  const activeStepObj = steps.find((s) => s.step === currentStep) || steps[0];
  const progressClass = getProgressClass(progressPercentage);

  const activeTitle = currentStep === 4
    ? 'Ficha Comercial y Receta de Base (Tanque)'
    : currentStep === 5
    ? 'Fabricar Primer Lote Comercial (Producto Terminado)'
    : (activeStepObj?.title || '');

  const triggerTitle = isCompleted
    ? 'Planta Operativa - Ver checklist de puesta en marcha'
    : `Paso ${currentStep}/${totalSteps}: ${activeTitle}`;

  return (
    <div className={styles.onboardingContainer} ref={containerRef}>
      <button
        type="button"
        className={`${styles.onboardingTrigger} ${isCompleted ? styles.onboardingCompletedTrigger : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={triggerTitle}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 size={16} color="#059669" />
            <span>Planta Operativa</span>
          </>
        ) : (
          <>
            <Compass size={15} color="#2563eb" />
            <span>Paso {currentStep}/{totalSteps} ({progressPercentage}%)</span>
            <div className={styles.onboardingProgressBarTrack}>
              <div className={`${styles.onboardingProgressBarFill} ${progressClass}`} />
            </div>
          </>
        )}
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className={styles.onboardingDropdown}>
          <div className={styles.onboardingHeader}>
            <div className={styles.onboardingTitle}>
              {isCompleted ? (
                <>
                  <Sparkles size={16} color="#059669" />
                  <span>Cadena de Valor Completa</span>
                </>
              ) : (
                <>
                  <Compass size={16} color="#2563eb" />
                  <span>Puesta en Marcha de Planta</span>
                </>
              )}
            </div>
            <div className={styles.onboardingProgressSummary}>
              {completedStepsCount} de {totalSteps} pasos ({progressPercentage}%)
            </div>
          </div>

          <div className={styles.onboardingBody}>
            {steps.map((stepItem) => (
              <OnboardingStepItem
                key={stepItem.step}
                stepItem={stepItem}
                isCompleted={isCompleted}
                currentStep={currentStep}
                hasBulkProduct={hasBulkProduct}
                productsCount={data.counts?.products || 0}
                onCloseDropdown={() => setIsOpen(false)}
              />
            ))}
          </div>

          <div className={styles.onboardingFooter}>
            <button
              type="button"
              onClick={() => refreshOnboarding()}
              className={styles.btnFooterRefresh}
              title="Actualizar estado del sistema"
            >
              <RotateCw size={12} /> Revalidar diagnóstico
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.btnFooterClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
