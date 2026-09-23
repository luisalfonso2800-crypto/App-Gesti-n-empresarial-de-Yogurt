/**
 * @file RecipesHeader.jsx
 * @module catalog/recipes/components
 * @description Cabecera de la vista de recetas.
 * @responsibility Mostrar título, subtítulo, y botón de acción.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/components/ui/Button, styles local
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from '../recipes.module.css';

export function RecipesHeader({ onNewRecipe, canCreate = true, disabledTooltip = '' }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <h1 className={styles.title}>Recetas Técnicas</h1>
        <p className={styles.subtitle}>Fórmulas estándar de elaboración con BOM (Lista de Materiales y Fórmula) y Etapas (Ruta de proceso).</p>
      </div>
      <Button 
        onClick={() => { if (canCreate) onNewRecipe(null); }}
        disabled={!canCreate}
        title={!canCreate ? disabledTooltip : 'Registrar nueva receta'}
        className={canCreate ? styles.btnNewRecipeHeader : styles.btnNewRecipeHeaderDisabled}
      >
        + Nueva Receta
      </Button>
    </div>
  );
}
