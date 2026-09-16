import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import styles from './onboarding-hero.module.css';

/**
 * @file OnboardingHeroCard.jsx
 * @description Tarjeta individual de paso para el centro de onboarding en el Dashboard.
 */
export function OnboardingHeroCard({ step, isCurrent, isDone, onOpenRecipeModal }) {
  const getBadgeClass = () => {
    if (isDone) return styles.stepBadgeDone;
    if (isCurrent) return styles.stepBadgeActive;
    return styles.stepBadgePending;
  };

  const getStatusTag = () => {
    if (isDone) return <span className={`${styles.stepStatusTag} ${styles.statusDone}`}>Completado</span>;
    if (isCurrent) return <span className={`${styles.stepStatusTag} ${styles.statusActive}`}>En curso</span>;
    return <span className={`${styles.stepStatusTag} ${styles.statusPending}`}>Pendiente</span>;
  };

  const handleClick = () => {
    if (step.step === 4 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-recipe-modal'));
    }
    if (onOpenRecipeModal) onOpenRecipeModal();
  };

  return (
    <div className={`${styles.stepCard} ${isCurrent ? styles.stepCardActive : ''} ${isDone ? styles.stepCardDone : ''}`}>
      <div className={styles.stepCardHeader}>
        <div className={`${styles.stepBadge} ${getBadgeClass()}`}>
          {isDone ? <Check size={14} strokeWidth={3} /> : step.step}
        </div>
        <div className={styles.stepTexts}>
          <h4 className={styles.stepCardTitle}>{step.title}</h4>
          <span className={styles.stepCardDetail}>{step.detail}</span>
        </div>
      </div>

      <div className={styles.stepCardFooter}>
        {getStatusTag()}
        {step.route && (
          <Link href={step.route} onClick={handleClick} className={styles.stepLinkBtn}>
            <span>{isCurrent ? 'Completar' : 'Ir'}</span>
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}
