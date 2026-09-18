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
  const [isOffline, setIsOffline] = useState(false);

  /**
   * Consulta el endpoint de estado de onboarding en el backend.
   * Manejo defensivo con try/catch para evitar caídas si el backend está fuera de línea.
   */
  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/system/onboarding-status');
      setData(res);
      setIsOffline(false);
    } catch (err) {
      console.warn('[useOnboardingStatus] No se pudo consultar el estado de onboarding:', err?.message);
      const msg = err?.message || '';
      const isConnectionIssue =
        msg.toLowerCase().includes('failed to fetch') ||
        msg.toLowerCase().includes('network') ||
        msg.toLowerCase().includes('conexión') ||
        err?.status === 0;

      setIsOffline(Boolean(isConnectionIssue));
      setError(msg || 'Error al cargar estado de onboarding');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    const handleRefresh = () => {
      fetchStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('onboarding:refresh', handleRefresh);
      window.addEventListener('onboarding-refresh', handleRefresh);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('onboarding:refresh', handleRefresh);
        window.removeEventListener('onboarding-refresh', handleRefresh);
      }
    };
  }, [fetchStatus]);

  return {
    data,
    loading,
    error,
    isOffline,
    retry: fetchStatus,
    refreshOnboarding: fetchStatus,
  };
}
