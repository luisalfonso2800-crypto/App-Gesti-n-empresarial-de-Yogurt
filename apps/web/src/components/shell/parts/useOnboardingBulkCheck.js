/**
 * @file useOnboardingBulkCheck.js
 * @module components/shell/parts
 * @description Hook auxiliar para detectar si la planta cuenta con productos a granel/WIP registrados.
 * @responsibility Consultar y escuchar eventos de refresco de productos a granel para el paso de recetas.
 * @usedBy apps/web/src/components/shell/OnboardingWizardWidget.jsx
 * @dependencies react, @/lib/api-client
 */
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useOnboardingBulkCheck(isOpen) {
  const [hasBulkProduct, setHasBulkProduct] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkBulk = async () => {
      try {
        const prods = await apiClient.get('/products');
        if (isMounted && Array.isArray(prods)) {
          const bulkExists = prods.some(p => 
            p.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || 
            p.presentacion?.nombre?.toUpperCase().includes('GRANEL') ||
            ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(p.categoria) ||
            p.canalVenta === 'USO_INTERNO' ||
            (Number(p.precioVenta) === 0 && p.categoria !== 'LACTEOS')
          );
          setHasBulkProduct(bulkExists);
        }
      } catch (e) {
        console.error('Error al verificar productos a granel en onboarding:', e);
      }
    };
    checkBulk();

    const handleRefresh = () => {
      checkBulk();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('onboarding:refresh', handleRefresh);
      window.addEventListener('onboarding-refresh', handleRefresh);
    }

    return () => { 
      isMounted = false; 
      if (typeof window !== 'undefined') {
        window.removeEventListener('onboarding:refresh', handleRefresh);
        window.removeEventListener('onboarding-refresh', handleRefresh);
      }
    };
  }, [isOpen]);

  return hasBulkProduct;
}
