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
        style={{
          backgroundColor: canCreate ? '#182622' : '#A8A29E',
          borderColor: canCreate ? '#182622' : '#A8A29E',
          color: '#FFFFFF',
          fontWeight: '700',
          borderRadius: '8px',
          padding: '0.65rem 1.4rem',
          boxShadow: canCreate ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
          opacity: canCreate ? 1 : 0.5,
          cursor: canCreate ? 'pointer' : 'not-allowed'
        }}
      >
        + Nueva Receta
      </Button>
    </div>
  );
}
