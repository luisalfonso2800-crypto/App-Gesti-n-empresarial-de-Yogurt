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

export function RecipesHeader({ onNewRecipe }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <h1 className={styles.title}>Recetas Técnicas (V2)</h1>
        <p className={styles.subtitle}>Fórmulas estándar de elaboración con BOM y Etapas (Ruta de proceso).</p>
      </div>
      <Button onClick={() => onNewRecipe(null)}>Nueva Receta</Button>
    </div>
  );
}
