import React from 'react';
import Link from 'next/link';
import { Leaf, ArrowRight, Compass, LayoutDashboard } from 'lucide-react';
import { OnboardingHeroCard } from './OnboardingHeroCard';
import styles from './onboarding-hero.module.css';

/**
 * @file OnboardingHeroState.jsx
 * @description Centro de Puesta en Marcha Interactivo cuando el Dashboard está en estado inicial.
 */
export function OnboardingHeroState({
  onboardingData,
  onSwitchMode,
  currentMode = 'wizard'
}) {
  if (!onboardingData) return null;

  const {
    currentStep = 1,
    isCompleted = false,
    progressPercentage = 0,
    completedStepsCount = 0,
    totalSteps = 6,
    steps = []
  } = onboardingData;

  const activeStepObj = steps.find(s => s.step === currentStep) || steps[0] || {
    step: 1,
    title: 'Configurar Presentaciones',
    route: '/catalog/presentations'
  };

  return (
    <div className={styles.heroContainer}>
      {/* Barra de alternancia de modo */}
      <div className={styles.viewSwitchBar}>
        <div className={styles.viewSwitchNotice}>
          <Compass size={16} />
          <span>Vista adaptada: Centro de Puesta en Marcha Inicial</span>
        </div>
        <div className={styles.viewToggleButtons}>
          <button
            type="button"
            className={`${styles.switchBtn} ${currentMode === 'wizard' ? styles.switchBtnActive : ''}`}
            onClick={() => onSwitchMode('wizard')}
          >
            Modo Asistente
          </button>
          <button
            type="button"
            className={`${styles.switchBtn} ${currentMode === 'dashboard' ? styles.switchBtnActive : ''}`}
            onClick={() => onSwitchMode('dashboard')}
          >
            Modo Dashboard Tradicional
          </button>
        </div>
      </div>

      {/* Banner Principal */}
      <div className={styles.bannerCard}>
        <div className={styles.bannerTop}>
          <div className={styles.bannerBrandGroup}>
            <Leaf size={32} className={styles.bannerLeafIcon} />
            <div>
              <h2 className={styles.bannerTitle}>Configuración Inicial de Planta MANNÁ</h2>
              <p className={styles.bannerDescription}>
                Para habilitar la telemetría, balance financiero y monitoreo de silos en tiempo real, completemos los pasos básicos de configuración según la cadena de valor.
              </p>
            </div>
          </div>

          <div className={styles.bannerProgressBox}>
            <span className={styles.progressLabel}>
              {completedStepsCount} de {totalSteps} pasos
            </span>
            <div className={styles.progressBarBg}>
              <div
                className={styles.progressBarFill}
                data-percentage={Math.round(progressPercentage / 10) * 10}
              />
            </div>
            <span className={styles.progressPercentText}>{progressPercentage}% completado</span>
          </div>
        </div>

        {/* Paso Activo Destacado (CTA) */}
        {!isCompleted && activeStepObj && (
          <div className={styles.ctaBox}>
            <div className={styles.ctaInfo}>
              <span className={styles.ctaTag}>Siguiente paso sugerido</span>
              <span className={styles.ctaTitle}>
                Paso {activeStepObj.step}: {activeStepObj.title}
              </span>
            </div>
            {activeStepObj.route && (
              <Link href={activeStepObj.route} className={styles.ctaBtn}>
                <span>Paso {activeStepObj.step}: Iniciar Ahora</span>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Cuadrícula de Pasos */}
      <div>
        <div className={styles.stepsSectionTitle}>Cadena de Puesta en Marcha</div>
        <div className={styles.stepsGrid}>
          {steps.map(step => (
            <OnboardingHeroCard
              key={step.step}
              step={step}
              isCurrent={!isCompleted && step.step === currentStep}
              isDone={step.completed}
              onboardingStatus={onboardingData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
