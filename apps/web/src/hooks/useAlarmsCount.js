/**
 * @file useAlarmsCount.js
 * @module hooks
 * @description Hook reactivo para consultar el conteo real de alarmas activas del SCADA de planta.
 * @responsibility Consultar GET /api/v1/dashboard/alarms, calcular total de alertas activas y exponer conteo.
 * @usedBy apps/web/src/components/shell/Sidebar.jsx
 * @dependencies react, @/lib/api-client
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export function useAlarmsCount(pollingIntervalMs = 60000) {
  const [totalAlarms, setTotalAlarms] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/dashboard/alarms');
      if (data && data.summary) {
        setTotalAlarms(Number(data.summary.total || 0));
        setCriticalCount(Number(data.summary.critical || 0));
        setWarningCount(Number(data.summary.warning || 0));
      } else if (Array.isArray(data?.alarms)) {
        setTotalAlarms(data.alarms.length);
      } else {
        setTotalAlarms(0);
      }
    } catch (err) {
      console.warn('[useAlarmsCount] No se pudieron sincronizar alarmas SCADA:', err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();

    const interval = setInterval(fetchCount, pollingIntervalMs);

    const handleRefresh = () => {
      fetchCount();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('alarms:refresh', handleRefresh);
      window.addEventListener('focus', handleRefresh);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('alarms:refresh', handleRefresh);
        window.removeEventListener('focus', handleRefresh);
      }
    };
  }, [fetchCount, pollingIntervalMs]);

  return {
    totalAlarms,
    criticalCount,
    warningCount,
    loading,
    refresh: fetchCount,
  };
}
