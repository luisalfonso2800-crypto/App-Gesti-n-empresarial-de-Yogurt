/**
 * @file useOnboardingStatus.js
 * @module hooks
 * @description Hook para consultar el estado del onboarding guiado de la planta y permitir revalidación manual.
 * @responsibility Consultar GET /api/v1/system/onboarding-status, manejar estados de carga/error y exponer mutate/refresh.
 * @usedBy apps/web/src/components/shell/Header.jsx, apps/web/src/components/shell/OnboardingWizardWidget.jsx
 * @dependencies react, @/lib/api-client
 */
'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export function useOnboardingStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Consulta el endpoint de estado de onboarding en el backend.
   * Manejo defensivo con try/catch para evitar pantallas rotas si el backend no responde.
   */
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/system/onboarding-status');
      setData(res);
    } catch (err) {
      console.error('Error fetching onboarding status:', err);
      setError(err?.message || 'Error al cargar estado de onboarding');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    data,
    loading,
    error,
    refreshOnboarding: fetchStatus,
  };
}
