/**
 * @file ProductionMrpShortageAlert.jsx
 * @module operations/production/components
 * @description Alerta dinámica e inteligente de abastecimiento MRP para materias primas y semielaborados WIP.
 * @responsibility Renderizar banners de compra o producción según la naturaleza del faltante.
 * @usedBy apps/web/src/app/operations/production/components/ProductionBomSection.jsx
 * @dependencies react, lucide-react, @/components/ui/Button, @/lib/formatters, ../production.module.css
 */
import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Factory } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import styles from '../production.module.css';

export function ProductionMrpShortageAlert({
  faltantesCompra = [],
  faltantesWip = [],
  costoFaltanteTotal = 0,
  onGoToPurchases,
  onGoToProduction
}) {
  if (faltantesCompra.length > 0) {
    return (
      <div className={styles.alertBanner}>
        <div className={styles.alertContent}>
          <AlertTriangle size={20} />
          <span>
            Faltan materias primas en bodega. Se requiere orden de compra:{' '}
            <span className={styles.alertShortageCost}>{formatCurrency(costoFaltanteTotal)}</span>
          </span>
        </div>
        <Button variant="danger" size="sm" onClick={onGoToPurchases}>
          🛒 Generar Borrador de Compra
        </Button>
      </div>
    );
  }

  if (faltantesWip.length > 0) {
    return (
      <div className={styles.alertBannerAmber}>
        <div className={styles.alertContent}>
          <Factory size={20} />
          <span>Inóculo / Base WIP insuficiente en cava. Se requiere fabricar semielaborado.</span>
        </div>
        <button type="button" onClick={onGoToProduction} className={styles.btnAmberWarning}>
          🏭 Producir Semielaborado Faltante
        </button>
      </div>
    );
  }

  return null;
}
