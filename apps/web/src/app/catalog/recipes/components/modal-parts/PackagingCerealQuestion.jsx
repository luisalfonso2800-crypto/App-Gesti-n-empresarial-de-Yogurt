'use client';

/**
 * @file PackagingCerealQuestion.jsx
 * @module catalog/recipes/components/modal-parts
 * @description Pregunta de empaque para cereal/topping con validación inteligente de dependencias (< 90 líneas).
 * @responsibility Validar si existe receta de cereal/topping formulada y presentar selector o banner de asistencia.
 * @usedBy PackagingWizardQuestions
 * @dependencies react, ./packaging-wizard.module.css
 */

import React from 'react';
import { WizardDependencyAlert } from './WizardDependencyAlert';
import styles from './packaging-wizard.module.css';

export function PackagingCerealQuestion({ answers, onChange, cerealRecipes = [], cerealProducts = [] }) {
  const hasCerealRecipes = cerealRecipes.length > 0;
  const hasCerealProducts = cerealProducts.length > 0;

  // Si hay producto de cereal pero no receta, redirigir a crear receta de ese producto (Caso 2)
  // Si no hay producto de cereal en catálogo, redirigir a crear producto con categoría INSUMO_BASE_WIP (Caso 1)
  const alertTitle = !hasCerealProducts
    ? 'Producto de cereal no registrado:'
    : 'Ruta de trabajo requerida:';

  const alertMessage = !hasCerealProducts
    ? 'Aún no has registrado el producto de cereal/topping en el catálogo. Primero crea el producto semielaborado (WIP).'
    : 'Existe el producto de cereal registrado, pero aún no has formulado su receta de porcionado (WIP).';

  const primaryLabel = !hasCerealProducts
    ? '↗ Registrar Producto de Cereal'
    : '↗ Formular Receta de Cereal';

  const primaryUrl = !hasCerealProducts
    ? '/catalog/products?action=new&category=TOPPING_CEREAL'
    : `/catalog/recipes?action=new&productId=${cerealProducts[0]?.id}`;

  return (
    <div className={styles.questionBlock}>
      <div className={styles.questionHeader}>
        <span className={styles.questionLabel}>
          <span className={styles.questionIcon}>🥣</span> Topping / Copita de cereal
        </span>
        <div className={styles.toggleGroup}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${answers.hasDomeOrSpoon ? styles.toggleBtnActiveYes : ''}`}
            onClick={() => {
              onChange('hasDomeOrSpoon', true);
              if (hasCerealRecipes && !answers.cerealRecipeId) {
                onChange('cerealRecipeId', cerealRecipes[0].id);
              }
            }}
          >
            Sí
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${!answers.hasDomeOrSpoon ? styles.toggleBtnActiveNo : ''}`}
            onClick={() => {
              onChange('hasDomeOrSpoon', false);
              onChange('cerealRecipeId', null);
            }}
          >
            No
          </button>
        </div>
      </div>

      {answers.hasDomeOrSpoon && (
        <div className={styles.dependencyContainer}>
          {hasCerealRecipes ? (
            <div className={styles.subOptionRow}>
              <span className={styles.subLabel}>Receta de Cereal (WIP):</span>
              <select
                className={styles.subSelect}
                value={answers.cerealRecipeId || ''}
                onChange={(e) => onChange('cerealRecipeId', e.target.value)}
              >
                {cerealRecipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} {r.producto?.nombre ? `(${r.producto.nombre})` : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <WizardDependencyAlert
              title={alertTitle}
              message={alertMessage}
              secondaryActionLabel="Desmarcar opción"
              onSecondaryAction={() => {
                onChange('hasDomeOrSpoon', false);
                onChange('cerealRecipeId', null);
              }}
              primaryActionLabel={primaryLabel}
              primaryActionUrl={primaryUrl}
            />
          )}
        </div>
      )}
    </div>
  );
}
