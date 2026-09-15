/**
 * @file PlantToolsModal.jsx
 * @module components/common/tools
 * @description Widget popover de herramientas de planta (Calculadora y Conversor) en TopBar (SRP < 150 líneas).
 * @responsibility Controlar apertura/cierre (clic exterior y tecla Escape) y conmutación de pestañas.
 * @usedBy apps/web/src/components/shell/Header.jsx
 * @dependencies react, lucide-react, ./ToolCalculatorTab, ./ToolConverterTab, ./plant-tools.module.css
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calculator, Scale, X } from 'lucide-react';
import { ToolCalculatorTab } from './ToolCalculatorTab';
import { ToolConverterTab } from './ToolConverterTab';
import styles from './plant-tools.module.css';

export function PlantToolsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calc'); // 'calc' | 'converter'
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={styles.toolsContainer} ref={containerRef}>
      <button
        type="button"
        className={`${styles.toolsTriggerBtn} ${isOpen ? styles.toolsTriggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Herramientas de Planta (Calculadora / Conversor)"
        aria-label="Abrir herramientas de planta"
      >
        <Calculator size={20} />
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog" aria-modal="false">
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <Calculator size={15} color="#182622" />
              <h4 className={styles.title}>Herramientas de Planta</h4>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar panel de herramientas"
            >
              <X size={15} />
            </button>
          </div>

          <div className={styles.tabNav}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'calc' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('calc')}
            >
              <Calculator size={14} /> Calculadora
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'converter' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('converter')}
            >
              <Scale size={14} /> Conversor
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'calc' ? <ToolCalculatorTab /> : <ToolConverterTab />}
          </div>
        </div>
      )}
    </div>
  );
}
