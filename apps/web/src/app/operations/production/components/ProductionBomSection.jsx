/**
 * @file ProductionBomSection.jsx
 * @module operations/production/components
 * @description Sección de desglose de lista de materiales BOM, balance financiero y acciones de guardado.
 * @responsibility Renderizar métricas financieras, alerta de insumos faltantes, tabla BOM y botones de acción.
 * @usedBy apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx
 * @dependencies react, @/components/ui/Button, lucide-react, @/lib/formatters
 */
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { X, CalendarClock, Play } from 'lucide-react';
import { ProductionFinancialSummary } from './ProductionFinancialSummary';
import { ProductionBomTable } from './ProductionBomTable';
import { ProductionMrpShortageAlert } from './ProductionMrpShortageAlert';
import styles from '../production.module.css';

export function ProductionBomSection({
  costoTotalLote,
  costoUnitarioPorLitro,
  costoFaltanteTotal,
  unidadRendimiento,
  tiempoProceso,
  loteSugerido,
  bomLoading,
  enrichedBom = [],
  handlePurchaseShortage,
  handleCreateOrder,
  qty = 1,
  onClose
}) {
  const router = useRouter();
  const isInvalidQty = !qty || Number(qty) <= 0;

  const { faltantesWip, faltantesCompra } = useMemo(() => {
    const isWip = (item) => Boolean(
      item.esProductoIntermedio ||
      item.idProductoIntermedio ||
      item.tipo === 'WIP' ||
      item.tipo === 'INOCULO_WIP' ||
      item.categoria === 'BASES_LACTEAS'
    );
    return {
      faltantesWip: enrichedBom.filter(item => Number(item.faltante) > 0 && isWip(item)),
      faltantesCompra: enrichedBom.filter(item => Number(item.faltante) > 0 && !isWip(item))
    };
  }, [enrichedBom]);

  const hasAnyShortage = faltantesCompra.length > 0 || faltantesWip.length > 0;

  const handleGoToPurchases = () => {
    if (handlePurchaseShortage) {
      handlePurchaseShortage();
      return;
    }
    const payload = encodeURIComponent(
      JSON.stringify(faltantesCompra.map(i => ({ id: i.idInsumo || i.id, faltante: i.faltante })))
    );
    if (onClose) onClose();
    router.push(`/operations/purchases/new?shortages=${payload}`);
  };

  const handleGoToProduction = () => {
    const target = faltantesWip[0];
    const targetId = target?.idProductoIntermedio || target?.idInsumo || target?.id;
    const targetQty = target?.faltante || 1;
    if (onClose) onClose();
    router.push(`/operations/production?action=new&productId=${targetId}&qty=${targetQty}`);
  };

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
          <ProductionMrpShortageAlert
            faltantesCompra={faltantesCompra}
            faltantesWip={faltantesWip}
            costoFaltanteTotal={costoFaltanteTotal}
            onGoToPurchases={handleGoToPurchases}
            onGoToProduction={handleGoToProduction}
          />
          <ProductionBomTable items={enrichedBom} />
          <div className={styles.formFooterActions}>
            <button type="button" onClick={onClose} className={styles.btnSecondaryNeutral}>
              <X size={15} />
              Cancelar Formulario
            </button>
            <button 
              type="button" 
              disabled={isInvalidQty}
              onClick={() => handleCreateOrder('PLANIFICADA')} 
              className={styles.btnSecondary}
            >
              <CalendarClock size={15} />
              Guardar como Planificada
            </button>
            <button 
              type="button" 
              disabled={hasAnyShortage || isInvalidQty} 
              onClick={() => handleCreateOrder('EN_PROCESO')} 
              className={styles.btnPrimaryCorp}
              title={hasAnyShortage ? '⚠️ Faltan insumos en bodega para iniciar el lote inmediatamente' : isInvalidQty ? '⚠️ Ingrese una cantidad válida mayor a 0' : 'Iniciar Fabricación'}
            >
              <Play size={15} fill="currentColor" />
              Iniciar Fabricación Inmediata
            </button>
          </div>
          {hasAnyShortage && (
            <p className={styles.shortageWarningNotice}>
              ⚠️ Faltan insumos en bodega para iniciar el lote inmediatamente
            </p>
          )}
        </>
      )}
    </div>
  );
}
