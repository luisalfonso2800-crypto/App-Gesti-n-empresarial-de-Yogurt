/**
 * @file OnboardingWizardWidget.jsx
 * @module components/shell
 * @description Widget de Onboarding guiado en el Header para orientar en la puesta en marcha según la cadena de valor.
 * @responsibility Renderizar píldora compacta interactiva con progreso y menú desplegable de 6 pasos con enlaces directos.
 * @usedBy apps/web/src/components/shell/Header.jsx
 * @dependencies react, next/link, lucide-react, @/hooks/useOnboardingStatus
 */
'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  RotateCw, 
  Compass,
  Check
} from 'lucide-react';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { apiClient } from '@/lib/api-client';
import styles from './onboarding-wizard.module.css';

export function OnboardingWizardWidget() {
  const { data, loading, refreshOnboarding } = useOnboardingStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [hasBulkProduct, setHasBulkProduct] = useState(true);
  const containerRef = useRef(null);

  // Consultar si existe al menos un producto a granel registrado
  useEffect(() => {
    let isMounted = true;
    const checkBulk = async () => {
      try {
        const prods = await apiClient.get('/products');
        if (isMounted && Array.isArray(prods)) {
          const bulkExists = prods.some(p => 
            p.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || 
            p.presentacion?.nombre?.toUpperCase().includes('GRANEL') ||
            ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(p.categoria) ||
            p.canalVenta === 'USO_INTERNO' ||
            (Number(p.precioVenta) === 0 && p.categoria !== 'LACTEOS')
          );
          setHasBulkProduct(bulkExists);
        }
      } catch (e) {
        // En caso de error, mantener estado seguro
        console.error('Error al verificar productos a granel en onboarding:', e);
      }
    };
    checkBulk();

    const handleRefresh = () => {
      checkBulk();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('onboarding-refresh', handleRefresh);
    }

    return () => { 
      isMounted = false; 
      if (typeof window !== 'undefined') {
        window.removeEventListener('onboarding-refresh', handleRefresh);
      }
    };
  }, [isOpen]);

  // Cerrar al hacer clic fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Si no hay datos aún y está cargando por primera vez
  if (!data && loading) {
    return (
      <div className={styles.onboardingContainer}>
        <div className={styles.onboardingTrigger} style={{ opacity: 0.6, cursor: 'wait' }}>
          <RotateCw size={14} className="animate-spin" />
          <span>Analizando planta...</span>
        </div>
      </div>
    );
  }

  // Si falló o no hay datos, ocultar silenciosamente o mostrar indicador discreto sin romper UI
  if (!data) {
    return null;
  }

  const {
    currentStep,
    isCompleted,
    progressPercentage,
    completedStepsCount,
    totalSteps = 6,
    steps = []
  } = data;

  // Paso activo actual
  const activeStepObj = steps.find((s) => s.step === currentStep) || steps[0];

  return (
    <div className={styles.onboardingContainer} ref={containerRef}>
      {/* Botón / Píldora interactiva */}
      <button
        type="button"
        className={`${styles.onboardingTrigger} ${isCompleted ? styles.onboardingCompletedTrigger : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isCompleted ? 'Planta Operativa - Ver checklist de puesta en marcha' : `Paso ${currentStep}/${totalSteps}: ${activeStepObj?.title}`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 size={16} color="#059669" />
            <span>Planta Operativa</span>
          </>
        ) : (
          <>
            <Compass size={15} color="#2563eb" />
            <span>
              Paso {currentStep}/{totalSteps} ({progressPercentage}%)
            </span>
            <div className={styles.onboardingProgressBarTrack}>
              <div 
                className={styles.onboardingProgressBarFill} 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
          </>
        )}
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Menú Desplegable (Dropdown Guía) */}
      {isOpen && (
        <div className={styles.onboardingDropdown}>
          {/* Encabezado */}
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

          {/* Lista de Pasos */}
          <div className={styles.onboardingBody}>
            {steps.map((stepItem) => {
              const isCurrent = !isCompleted && stepItem.step === currentStep;
              const isDone = stepItem.completed;

              return (
                <div
                  key={stepItem.step}
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
                      <span className={`${styles.stepTitle} ${isCurrent ? styles.stepTitleActive : ''}`}>
                        {stepItem.title}
                      </span>
                      {stepItem.step === 4 ? (
                        <>
                          <span className={styles.stepDetail} title="Secuencia: 1° Base en Tanque (A Granel) ➔ 2° Producto Envasado Comercial">
                            Secuencia: 1° Base en Tanque (A Granel) ➔ 2° Producto Envasado Comercial
                          </span>
                          {data.counts?.products > 0 && !hasBulkProduct && (
                            <span style={{ fontSize: '0.66rem', color: '#b45309', fontWeight: '500', marginTop: '1px' }}>
                              ⚠️ Pendiente: Base láctea a granel requerida para enlazar fórmulas secundarias.
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.stepDetail}>
                          {stepItem.detail}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Enlace o acción directa */}
                  {stepItem.route && (() => {
                    let targetRoute = stepItem.route;
                    if (stepItem.step === 4) {
                      targetRoute = !hasBulkProduct 
                        ? '/catalog/products?crear=base-intermedia' 
                        : '/catalog/recipes?crear=receta';
                    }

                    const handleActionClick = () => {
                      setIsOpen(false);
                      if (stepItem.step === 4 && hasBulkProduct && typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('open-recipe-modal'));
                      }
                    };

                    return (
                      <Link
                        href={targetRoute}
                        className={styles.stepActionBtn}
                        onClick={handleActionClick}
                        title={`Ir a ${stepItem.title}`}
                      >
                        <span>{isCurrent ? 'Completar' : 'Ver'}</span>
                        <ArrowRight size={12} />
                      </Link>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {/* Pie del Dropdown */}
          <div className={styles.onboardingFooter}>
            <button
              type="button"
              onClick={() => refreshOnboarding()}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#6b7280',
                fontSize: '0.72rem',
                padding: 0
              }}
              title="Actualizar estado del sistema"
            >
              <RotateCw size={12} /> Revalidar diagnóstico
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#4f46e5',
                fontWeight: 600,
                fontSize: '0.72rem',
                padding: 0
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
