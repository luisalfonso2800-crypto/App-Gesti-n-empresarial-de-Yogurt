/**
 * @file ProductionBomSection.jsx
 * @module operations/production/components
 * @description Sección de desglose de lista de materiales BOM, balance financiero y acciones de guardado.
 * @responsibility Renderizar métricas financieras, alerta de insumos faltantes, tabla BOM y botones de acción.
 * @usedBy apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx
 * @dependencies react, @/components/ui/Button, lucide-react, @/lib/formatters
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { ProductionFinancialSummary } from './ProductionFinancialSummary';
import { ProductionBomTable } from './ProductionBomTable';
import styles from '../production.module.css';

export function ProductionBomSection({
  costoTotalLote,
  costoUnitarioPorLitro,
  costoFaltanteTotal,
  unidadRendimiento,
  tiempoProceso,
  loteSugerido,
  bomLoading,
  hasShortage,
  enrichedBom,
  handlePurchaseShortage,
  handleCreateOrder,
  onClose
}) {
  return (
    <div className={styles.bomSection}>
      <ProductionFinancialSummary
        costoTotal={costoTotalLote}
        costoUnitario={costoUnitarioPorLitro}
        unidad={unidadRendimiento === 'Litros' ? 'L' : unidadRendimiento}
        tiempoProceso={tiempoProceso}
        loteSugerido={loteSugerido}
      />

      <h4>BOM (Lista de Materiales y Fórmula Requerida)</h4>
      {bomLoading ? <p>Calculando...</p> : (
        <>
          {hasShortage && (
            <div className={styles.alertBanner}>
              <div className={styles.alertContent}>
                <AlertTriangle size={20} />
                <span>
                  Insumos insuficientes para esta escala de producción. Compra estimada requerida:{' '}
                  <span className={styles.alertShortageCost}>
                    {formatCurrency(costoFaltanteTotal)}
                  </span>
                </span>
              </div>
              <Button variant="danger" size="sm" onClick={handlePurchaseShortage}>
                + Disparar Lista de Compra
              </Button>
            </div>
          )}
          <ProductionBomTable items={enrichedBom} />
          <div className={styles.formFooterActions}>
            <button type="button" onClick={onClose} className={styles.btnSecondaryNeutral}>
              Cancelar Formulario
            </button>
            <button type="button" onClick={() => handleCreateOrder('PLANIFICADA')} className={styles.btnSecondary}>
              Guardar como Planificada
            </button>
            <button type="button" disabled={hasShortage} onClick={() => handleCreateOrder('EN_PROCESO')} className={styles.btnPrimaryCorp}>
              Iniciar Fabricación Inmediata
            </button>
          </div>
        </>
      )}
    </div>
  );
}
