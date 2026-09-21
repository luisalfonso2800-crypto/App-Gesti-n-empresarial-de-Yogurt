'use client';

/**
 * @file page.jsx
 * @module dashboard
 * @description Orquestador de página para el Dashboard SCADA y Centro de Operaciones MANNÁ.
 * @responsibility Cargar telemetría remota, gestionar canal de alarmas y delegar la vista operativa.
 * @usedBy Next.js App Router (/dashboard)
 * @dependencies react, next/navigation, @/lib/api-client, @/hooks/useOnboardingStatus, ./components/DashboardOperationalView
 */
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { DashboardOperationalView } from './components/DashboardOperationalView';

function DashboardContent() {
  const { data: onboardingData } = useOnboardingStatus();
  const [onboardingViewMode, setOnboardingViewMode] = useState('auto');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showAlarmsOverlay, setShowAlarmsOverlay] = useState(false);
  const [alarmsData, setAlarmsData] = useState({ summary: { total: 0, critical: 0, warning: 0 }, alarms: [] });
  const [alarmsLoading, setAlarmsLoading] = useState(false);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  const [acknowledgedIds, setAcknowledgedIds] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('manna_ack_alarms');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const fetchTelemetry = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/dashboard/full-telemetry');
      setTelemetry(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error de conexión SCADA multiplexor');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlarms = useCallback(async () => {
    try {
      setAlarmsLoading(true);
      const data = await apiClient.get('/dashboard/alarms');
      setAlarmsData(data);
    } catch (e) {
      console.warn('[SCADA] Error cargando alarmas:', e.message);
    } finally {
      setAlarmsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  useEffect(() => {
    if (searchParams?.get('channel') === 'ALARMS') setShowAlarmsOverlay(true);
  }, [searchParams]);

  useEffect(() => {
    if (showAlarmsOverlay) fetchAlarms();
  }, [showAlarmsOverlay, fetchAlarms]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toTimeString().split(' ')[0]), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCloseAlarms = () => {
    setShowAlarmsOverlay(false);
    router.replace('/dashboard');
  };

  const handleAcknowledge = (alarmId, e) => {
    e.stopPropagation();
    setAcknowledgedIds(prev => {
      if (prev.includes(alarmId)) return prev;
      const next = [...prev, alarmId];
      if (typeof window !== 'undefined') sessionStorage.setItem('manna_ack_alarms', JSON.stringify(next));
      return next;
    });
  };

  const handleResolveAlarm = (alarm) => {
    setShowAlarmsOverlay(false);
    router.replace('/dashboard');
    if (alarm.channel?.includes('SUMINISTROS') || alarm.entityType === 'Insumo') {
      const insumo = alarm.metadata?.insumo || alarm.title?.split(':')[1]?.trim() || '';
      const q = new URLSearchParams();
      if (insumo) q.set('search', insumo);
      if (alarm.entityId) q.set('insumoId', alarm.entityId);
      router.push(`/catalog/supplier-prices?${q.toString()}`);
    } else if (alarm.channel?.includes('FEFO') || alarm.channel?.includes('CAVA') || alarm.entityType === 'Lote') {
      router.push('/operations/lots');
    } else if (alarm.channel?.includes('TESORERÍA') || alarm.entityType === 'Venta') {
      router.push('/commercial/payments');
    } else if (alarm.channel?.includes('PLANTA') || alarm.entityType === 'DetalleProduccion') {
      router.push('/operations/production');
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchTelemetry} />;
  if (!telemetry) return null;

  return (
    <DashboardOperationalView
      telemetry={telemetry}
      onboardingData={onboardingData}
      showAlarmsOverlay={showAlarmsOverlay}
      onCloseAlarms={handleCloseAlarms}
      alarmsData={alarmsData}
      alarmsLoading={alarmsLoading}
      acknowledgedIds={acknowledgedIds}
      onAcknowledge={handleAcknowledge}
      onResolveAlarm={handleResolveAlarm}
      currentTime={currentTime}
      onboardingViewMode={onboardingViewMode}
      setOnboardingViewMode={setOnboardingViewMode}
    />
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardContent />
    </Suspense>
  );
}
