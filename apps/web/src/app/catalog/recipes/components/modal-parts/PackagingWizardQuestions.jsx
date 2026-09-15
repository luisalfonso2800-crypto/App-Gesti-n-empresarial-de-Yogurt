'use client';

/**
 * @file PackagingWizardQuestions.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Preguntas operativas y selectores del wizard de envasado comercial (< 130 líneas).
 * @responsibility Renderizar los controles interactivos y subcampos condicionales.
 * @usedBy PackagingWizardModal
 * @dependencies react, ./packaging-wizard.module.css
 */

import React from 'react';
import { PackagingCerealQuestion } from './PackagingCerealQuestion';
import styles from './packaging-wizard.module.css';

const SWEETENER_OPTIONS = ['Azúcar', 'Stevia / Dietético', 'Miel / Natural'];

export function PackagingWizardQuestions({ answers, onChange, cerealRecipes = [], cerealProducts = [] }) {
  return (
    <div className={styles.questionsSection}>
      {/* 1. Jalea o fruta en el fondo */}
      <div className={styles.questionBlock}>
        <div className={styles.questionHeader}>
          <span className={styles.questionLabel}>
            <span className={styles.questionIcon}>🍓</span> ¿Lleva jalea o fruta en el fondo?
          </span>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${answers.hasFruitInBottom ? styles.toggleBtnActiveYes : ''}`}
              onClick={() => onChange('hasFruitInBottom', true)}
            >Sí</button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${!answers.hasFruitInBottom ? styles.toggleBtnActiveNo : ''}`}
              onClick={() => onChange('hasFruitInBottom', false)}
            >No</button>
          </div>
        </div>
        {answers.hasFruitInBottom && (
          <div className={styles.subOptionRow}>
            <span className={styles.subLabel}>Gramaje por vaso (g):</span>
            <input
              type="number" min="1" max="500" className={styles.subInput} value={answers.fruitGrams}
              onChange={(e) => onChange('fruitGrams', Math.max(1, Number(e.target.value) || 0))} placeholder="Ej. 30"
            />
          </div>
        )}
      </div>

      {/* 2. Endulzado del Yogurt */}
      <div className={styles.questionBlock}>
        <div className={styles.questionHeader}>
          <span className={styles.questionLabel}>
            <span className={styles.questionIcon}>🍬</span> ¿Requiere adición de azúcar/endulzante?
          </span>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${answers.hasSugar ? styles.toggleBtnActiveYes : ''}`}
              onClick={() => onChange('hasSugar', true)}
            >Sí</button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${!answers.hasSugar ? styles.toggleBtnActiveNo : ''}`}
              onClick={() => onChange('hasSugar', false)}
            >No</button>
          </div>
        </div>
        {answers.hasSugar && (
          <div className={styles.subOptionRow}>
            <span className={styles.subLabel}>Tipo de endulzante:</span>
            <select
              className={styles.subSelect} value={answers.sweetenerType}
              onChange={(e) => onChange('sweetenerType', e.target.value)}
            >
              {SWEETENER_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 3. Topping / Copita de cereal con validación de dependencias WIP */}
      <PackagingCerealQuestion
        answers={answers}
        onChange={onChange}
        cerealRecipes={cerealRecipes}
        cerealProducts={cerealProducts}
      />

      {/* 4. Pre-armado y sellos de seguridad en envases */}
      <div className={styles.questionBlock}>
        <div className={styles.questionHeader}>
          <span className={styles.questionLabel}>
            <span className={styles.questionIcon}>🏷️</span> ¿Los envases se preparan previamente con etiqueta frontal, sello y adhesivo con logo?
          </span>
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${answers.hasManualLotLabelling ? styles.toggleBtnActiveYes : ''}`}
              onClick={() => onChange('hasManualLotLabelling', true)}
            >Sí</button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${!answers.hasManualLotLabelling ? styles.toggleBtnActiveNo : ''}`}
              onClick={() => onChange('hasManualLotLabelling', false)}
            >No</button>
          </div>
        </div>
      </div>
    </div>
  );
}

