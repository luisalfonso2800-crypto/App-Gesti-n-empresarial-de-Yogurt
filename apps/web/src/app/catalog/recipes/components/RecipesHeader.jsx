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
      <div />
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
