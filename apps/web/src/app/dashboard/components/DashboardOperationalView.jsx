'use client';

/**
 * @file DashboardOperationalView.jsx
 * @module dashboard/components
 * @description Orquestador visual de telemetría SCADA, canales tácticos, simulador y alarmas de planta.
 * @responsibility Renderizar cuadrantes tácticos (FEFO, finanzas, silos, flujo caja), simulador de batch y modal de alarmas.
 * @usedBy apps/web/src/app/dashboard/page.jsx
 * @dependencies react, @/lib/api-client, lucide-react, ./Dashboard.module.css
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SmartModal from '@/components/ui/SmartModal';
import AnalogGauge from './AnalogGauge';
import OscilloscopeCanvas from './OscilloscopeCanvas';
import RadarSweepCanvas from './RadarSweepCanvas';
import LiquidSilosCanvas from './LiquidSilosCanvas';
import ProductAvatar from '@/components/ui/ProductAvatar';
import StrictNumberInput from '@/components/ui/inputs/StrictNumberInput';
import { resolveProductImage } from '@/lib/presetImages';
import { apiClient } from '@/lib/api-client';
import { Activity, ShieldAlert, Database } from 'lucide-react';
import { OnboardingHeroState } from '@/components/dashboard/OnboardingHeroState';
import { DashboardQuickAccessStrip } from './DashboardQuickAccessStrip';
import styles from '../Dashboard.module.css';

export function DashboardOperationalView({
  telemetry,
  onboardingData,
  showAlarmsOverlay,
  onCloseAlarms,
  alarmsData,
  alarmsLoading,
  acknowledgedIds,
  onAcknowledge,
  onResolveAlarm,
  currentTime,
  onboardingViewMode,
  setOnboardingViewMode
}) {
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState('ALL');
  const [isAutoScan, setIsAutoScan] = useState(true);
  const autoScanRef = useRef(isAutoScan);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', content: null });
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;
    apiClient.get('/production')
      .then(res => {
        if (!isMounted || !Array.isArray(res)) return;
        const inProcess = res.filter(o => o.estado === 'EN_PROCESO' || o.estado === 'PLANIFICADA');
        setActiveOrders(inProcess);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const wipValue = useMemo(() => {
    return activeOrders.reduce((sum, order) => {
      const detailsCost = (order.detalles || []).reduce((dSum, d) => {
        const cost = Number(d.costoReal || d.costoTeorico || 0);
        return dSum + (cost > 0 ? cost : Number(d.cantidadTeorica || d.cantidadRealUtilizada || 0) * 3500);
      }, 0);
      const orderBaseCost = detailsCost > 0 ? detailsCost : Number(order.cantidadPlanificada || 0) * 4500;
      return sum + orderBaseCost;
    }, 0);
  }, [activeOrders]);

  // Simulador
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simProduct, setSimProduct] = useState('');
  const [simLiters, setSimLiters] = useState('');

  const [pauseSecondsLeft, setPauseSecondsLeft] = useState(0);

  useEffect(() => {
    autoScanRef.current = isAutoScan;
  }, [isAutoScan]);

  // Rotación automática cada 10s cuando autoScan está activo
  useEffect(() => {
    const channels = ['ALL', 'FINANCE', 'PLANT', 'SUPPLY'];
    const interval = setInterval(() => {
      if (autoScanRef.current) {
        setActiveChannel(prev => {
          const idx = channels.indexOf(prev);
          return channels[(idx + 1) % channels.length];
        });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Cuenta regresiva de 5 minutos (300s) cuando se pausa
  useEffect(() => {
    if (isAutoScan || pauseSecondsLeft <= 0) return;
    const timer = setInterval(() => {
      setPauseSecondsLeft(prev => {
        if (prev <= 1) {
          setIsAutoScan(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAutoScan, pauseSecondsLeft]);

  const [currentProductIdx, setCurrentProductIdx] = useState(0);
  const [isProductAutoPlay, setIsProductAutoPlay] = useState(true);

  const productList = useMemo(() => {
    if (telemetry?.plant?.productsTelemetry && telemetry.plant.productsTelemetry.length > 0) {
      return telemetry.plant.productsTelemetry;
    }
    return [];
  }, [telemetry]);

  const totalProducts = productList.length;
  const currentProduct = productList[currentProductIdx] || null;

  useEffect(() => {
    if (!isProductAutoPlay || totalProducts <= 1) return;
    const interval = setInterval(() => {
      setCurrentProductIdx((prev) => (prev + 1) % totalProducts);
    }, 6000);
    return () => clearInterval(interval);
  }, [isProductAutoPlay, totalProducts]);

  const handlePrevProduct = (e) => {
    e.stopPropagation();
    setIsProductAutoPlay(false);
    setCurrentProductIdx((prev) => (prev === 0 ? totalProducts - 1 : prev - 1));
  };

  const handleNextProduct = (e) => {
    e.stopPropagation();
    setIsProductAutoPlay(false);
    setCurrentProductIdx((prev) => (prev + 1) % totalProducts);
  };

  const handleToggleAutoPlay = (e) => {
    e.stopPropagation();
    setIsProductAutoPlay((prev) => !prev);
  };

  const handleToggleAutoScan = () => {
    if (isAutoScan) {
      setIsAutoScan(false);
      setPauseSecondsLeft(300); // 5 minutos de pausa
    } else {
      setIsAutoScan(true);
      setPauseSecondsLeft(0);
    }
  };

  const handleInteraction = () => {
    if (isAutoScan) {
      setIsAutoScan(false);
      setPauseSecondsLeft(300); // Pausar por 5 minutos ante interacción del usuario
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const openModal = (title, content) => {
    handleInteraction();
    setModalState({ isOpen: true, title, content });
  };
  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const { financial, plant, supply } = telemetry || {};
  const formatScada = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val || 0);

  const handleSiloMateriaClick = () => {
    openModal('Stock de Materia Prima', (
      <div className={styles.modalContent}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Cant.</th>
              <th>Costo U.</th>
              <th>Total Inmovilizado</th>
            </tr>
          </thead>
          <tbody>
            {(supply?.rawMaterialsList || []).map(rm => (
              <tr key={rm.id}>
                <td>{rm.nombre}</td>
                <td>{rm.cantidad} {rm.unidadBase}</td>
                <td>{formatScada(rm.costoUnitario)}</td>
                <td style={{ fontWeight: 'bold' }}>{formatScada(rm.costoTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <Link href="/commercial/purchases">
            <button className={styles.primaryBtn}>Ir a Compras</button>
          </Link>
        </div>
      </div>
    ));
  };

  const handleSiloCavaClick = () => {
    openModal('Stock de Producto Terminado', (
      <div className={styles.modalContent}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant. Disp.</th>
              <th>Costo Prom.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {(plant?.finishedProductsList || []).map(fp => (
              <tr key={fp.id}>
                <td>{fp.nombre}</td>
                <td>{fp.cantidad} und</td>
                <td>{formatScada(fp.costoPromedio)}</td>
                <td style={{ fontWeight: 'bold' }}>{formatScada(fp.costoTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <Link href="/commercial/sales">
            <button className={styles.successBtn}>Despachar</button>
          </Link>
        </div>
      </div>
    ));
  };

  const handleSiloWipClick = () => {
    openModal('Producto en Proceso (WIP en Planta)', (
      <div className={styles.modalContent}>
        {activeOrders.length === 0 ? (
          <p style={{ color: '#78716C', padding: '1rem 0' }}>No hay órdenes en fermentación o proceso activo en este momento.</p>
        ) : (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Lote / Orden</th>
                <th>Producto</th>
                <th>Cant. Planificada</th>
                <th>Estado</th>
                <th>Costo Inmovilizado</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map(order => {
                const orderCost = (order.detalles || []).reduce((dSum, d) => {
                  const cost = Number(d.costoReal || d.costoTeorico || 0);
                  return dSum + (cost > 0 ? cost : Number(d.cantidadTeorica || d.cantidadRealUtilizada || 0) * 3500);
                }, 0) || Number(order.cantidadPlanificada || 0) * 4500;

                return (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.idLote || order.id.slice(0, 8)}</td>
                    <td>{order.producto?.nombre || 'Elaboración Láctea'}</td>
                    <td>{order.cantidadPlanificada} {order.unidadCantidadProducida || 'L'}</td>
                    <td>
                      <span style={{
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: order.estado === 'EN_PROCESO' ? '#EDE9FE' : '#FEF3C7',
                        color: order.estado === 'EN_PROCESO' ? '#6D28D9' : '#D97706'
                      }}>
                        {order.estado === 'EN_PROCESO' ? 'EN PROCESO' : 'PLANIFICADA'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold', color: '#6D28D9' }}>{formatScada(orderCost)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <Link href="/operations/production">
            <button className={styles.primaryBtn}>Ir a Bitácora de Planta</button>
          </Link>
        </div>
      </div>
    ));
  };

  const handleSiloSelect = (siloId) => {
    if (siloId === 'RAW') handleSiloMateriaClick();
    else if (siloId === 'WIP') handleSiloWipClick();
    else if (siloId === 'CAVA') handleSiloCavaClick();
  };

  const handleCarteraClick = () => {
    openModal('Cartera Pendiente por Cliente', (
      <div className={styles.modalContent}>
        {(financial?.debtors || []).length === 0 ? (
          <p>No hay cuentas por cobrar actualmente.</p>
        ) : (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Días Crédito</th>
                <th>Saldo Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {financial.debtors.map(d => (
                <tr key={d.id}>
                  <td>{d.cliente}</td>
                  <td>{d.telefono || 'N/A'}</td>
                  <td>{d.diasCredito}</td>
                  <td style={{ fontWeight: 'bold', color: '#B91C1C' }}>{formatScada(d.saldoPendiente)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button className={styles.darkBtn}>Registrar Cobro</button>
        </div>
      </div>
    ));
  };

  const openProductDrillDown = (prod) => {
    openModal('Ficha Técnica de Producto', (
      <div className={styles.modalContent}>
        <h3 style={{ marginTop: 0, color: '#1C3F35', fontFamily: 'var(--font-serif, serif)' }}>{prod.nombre} ({prod.categoria})</h3>
        <p><strong>Costo Total Unitario:</strong> {formatScada(prod.costoUnitario)}</p>

        <h4 style={{ borderBottom: '1px solid #E8E2D7', paddingBottom: '4px' }}>Desglose de Formulación</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Leche Cruda:</span> <span>{formatScada(prod.costBreakdown?.leche)}</span></li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fruta/Sabor:</span> <span>{formatScada(prod.costBreakdown?.fruta)}</span></li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cultivo:</span> <span>{formatScada(prod.costBreakdown?.cultivo)}</span></li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Envase/Etiqueta:</span> <span>{formatScada(prod.costBreakdown?.envase)}</span></li>
        </ul>

        <h4 style={{ borderBottom: '1px solid #E8E2D7', paddingBottom: '4px' }}>Márgenes Estimados</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Venta Minorista:</span> <strong>{prod.margenPorcentaje}%</strong></li>
          <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Venta Directa:</span> <strong>{Number(prod.margenPorcentaje) + 15}%</strong></li>
        </ul>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            className={styles.primaryBtn}
            onClick={() => { closeModal(); setSimProduct(prod.idProducto); setSimModalOpen(true); }}
          >
            Simular Lote de este Producto
          </button>
        </div>
      </div>
    ));
  };

  // Simulación
  const selectedProdInfo = plant?.productsTelemetry?.find(p => p.idProducto === simProduct);
  let simUnits = 0;
  let simCost = 0;
  let simSales = 0;
  let simProfit = 0;
  let simProfitMargin = 0;
  const rawMilkAvailable = 500;
  let milkRequired = 0;

  if (selectedProdInfo && simLiters) {
    const liters = parseFloat(simLiters) || 0;
    const multiplier = selectedProdInfo.categoria?.toLowerCase().includes('mini') ? 10 : (selectedProdInfo.nombre.includes('500') ? 2 : 1);
    simUnits = Math.floor(liters * multiplier);
    simCost = simUnits * selectedProdInfo.costoUnitario;
    simSales = simUnits * selectedProdInfo.precioVenta;
    simProfit = simSales - simCost;
    simProfitMargin = simSales > 0 ? ((simProfit / simSales) * 100).toFixed(1) : 0;
    milkRequired = liters;
  }

  const renderSimulatorModal = () => (
    <SmartModal isOpen={simModalOpen} onClose={() => setSimModalOpen(false)} title="Simulador Táctico de Producción" isDirty={false}>
      <div className={styles.modalContent}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label className={styles.formLabel}>Producto a Simular</label>
            <select className={styles.formSelect} value={simProduct} onChange={e => setSimProduct(e.target.value)}>
              <option value="">Seleccione un producto...</option>
              {(plant?.productsTelemetry || []).map(p => (
                <option key={p.idProducto} value={p.idProducto}>{p.nombre} ({p.categoria})</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className={styles.formLabel}>Litros a Procesar (L)</label>
            <StrictNumberInput
              value={simLiters}
              onChange={setSimLiters}
              placeholder="0"
              className={styles.formInput}
            />
          </div>
        </div>

        {selectedProdInfo && simLiters && (
          <div className={styles.simResults}>
            <div className={styles.simGrid}>
              <div className={styles.simCard}>
                <span className={styles.simLabel}>Unidades Estimadas</span>
                <span className={styles.simValue}>{simUnits} und</span>
              </div>
              <div className={styles.simCard}>
                <span className={styles.simLabel}>Costo Proyectado</span>
                <span className={styles.simValue} style={{ color: '#B91C1C' }}>{formatScada(simCost)}</span>
              </div>
              <div className={styles.simCard}>
                <span className={styles.simLabel}>Facturación Bruta</span>
                <span className={styles.simValue} style={{ color: '#10B981' }}>{formatScada(simSales)}</span>
              </div>
              <div className={styles.simCard}>
                <span className={styles.simLabel}>Utilidad (Margen)</span>
                <span className={styles.simValue} style={{ color: '#1C3F35' }}>{formatScada(simProfit)} ({simProfitMargin}%)</span>
              </div>
            </div>

            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#44403C' }}>Requerimientos de Insumos</h4>
            <table className={styles.dataTable}>
              <tbody>
                <tr>
                  <td>Leche Cruda</td>
                  <td>{milkRequired} L</td>
                  <td style={{ color: milkRequired <= rawMilkAvailable ? '#10B981' : '#B91C1C', fontWeight: 'bold' }}>
                    {milkRequired <= rawMilkAvailable ? '✓ Stock Suficiente' : '✗ Faltante'}
                  </td>
                </tr>
                <tr>
                  <td>Envases</td>
                  <td>{simUnits} und</td>
                  <td style={{ color: '#10B981', fontWeight: 'bold' }}>✓ Stock Suficiente</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  setSimModalOpen(false);
                  router.push('/operations/production');
                }}
              >
                Crear Orden de Producción Real con estos Parámetros
              </button>
            </div>
          </div>
        )}
      </div>
    </SmartModal>
  );

  const pendingAlarmsCount = (alarmsData?.alarms || []).filter(
    (a) => !acknowledgedIds.includes(a.id)
  ).length;

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.scadaHeader}>
        <div className={styles.titleGroup}>
          <h1 className={styles.scadaTitle}>SCADA MULTIPLEXOR</h1>
          <span className={styles.scadaSubtitle}>por Canales Tácticos</span>
        </div>

        <nav className={styles.channelNavigation} aria-label="Selector de Canales">
          <button
            type="button"
            onClick={handleToggleAutoScan}
            className={`${styles.scanToggleBtn} ${isAutoScan ? styles.scanActive : styles.scanPaused}`}
            title={isAutoScan ? "Pausar rotación automática por 5 minutos" : "Reanudar auto-escaneo inmediato"}
          >
            <span className={styles.statusLed} />
            {isAutoScan ? "AUTO-SCAN 10s" : `PAUSA ${formatCountdown(pauseSecondsLeft)}`}
          </button>

          <div className={styles.segmentedControl}>
            <button
              type="button"
              onClick={() => { setActiveChannel('ALL'); handleInteraction(); }}
              className={`${styles.channelTab} ${activeChannel === 'ALL' ? styles.channelTabActive : ''}`}
            >
              PANORAMA 4X
            </button>

            <button
              type="button"
              onClick={() => { setActiveChannel('FINANCE'); handleInteraction(); }}
              className={`${styles.channelTab} ${activeChannel === 'FINANCE' ? styles.channelTabActive : ''}`}
            >
              <span className={styles.channelCode}>CH-01</span> FINANZAS
            </button>

            <button
              type="button"
              onClick={() => { setActiveChannel('PLANT'); handleInteraction(); }}
              className={`${styles.channelTab} ${activeChannel === 'PLANT' ? styles.channelTabActive : ''}`}
            >
              <span className={styles.channelCode}>CH-02</span> PLANTA / FEFO
            </button>

            <button
              type="button"
              onClick={() => { setActiveChannel('SUPPLY'); handleInteraction(); }}
              className={`${styles.channelTab} ${activeChannel === 'SUPPLY' ? styles.channelTabActive : ''}`}
            >
              <span className={styles.channelCode}>CH-03</span> SUMINISTROS
            </button>
          </div>
        </nav>

        <div className={styles.headerRightActions}>
          <button
            type="button"
            onClick={() => setSimModalOpen(true)}
            className={styles.simButton}
          >
            <span className={styles.simIcon}>⚙</span> SIMULAR PRODUCCIÓN
          </button>
          <div className={styles.systemClock}>
            <span className={styles.clockIcon}>🕒</span> {currentTime || '00:00:00'}
          </div>
        </div>
      </header>

      {showAlarmsOverlay && (
        <div className={styles.alarmBackdrop} onClick={onCloseAlarms}>
          <div className={styles.alarmModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.alarmHeader}>
              <div className={styles.alarmHeaderTitle}>
                <span className={styles.alarmHeaderBadge}>SISTEMA SCADA</span>
                <h3>Matriz de Alarmas Críticas ({pendingAlarmsCount} pendientes)</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {alarmsData.summary.critical > 0 && <span style={{ fontSize: '0.65rem', background: '#EF4444', color: '#fff', borderRadius: '999px', padding: '0.1rem 0.4rem', fontWeight: 800 }}>🔴 {alarmsData.summary.critical} Críticas</span>}
                  {alarmsData.summary.warning > 0 && <span style={{ fontSize: '0.65rem', background: '#F59E0B', color: '#fff', borderRadius: '999px', padding: '0.1rem 0.4rem', fontWeight: 800 }}>⚠️ {alarmsData.summary.warning} Advertencias</span>}
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseAlarms}
                className={styles.closeAlarmBtn}
              >
                ✕ Cerrar
              </button>
            </div>

            <div className={styles.alarmBody}>
              {alarmsLoading && (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#78716C', fontSize: '0.85rem' }}>
                  Cargando alarmas desde el sistema...
                </div>
              )}
              {!alarmsLoading && alarmsData.alarms.length === 0 && (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#4ADE80', fontWeight: 700, fontSize: '0.85rem' }}>
                  ✅ Sin alarmas activas. Todos los sistemas operativos.
                </div>
              )}
              {!alarmsLoading && alarmsData.alarms.map((alarm) => {
                const isCritical = alarm.level === 'CRITICAL';
                const isAck = acknowledgedIds.includes(alarm.id);
                const triggeredTime = new Date(alarm.triggeredAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                return (
                  <div
                    key={alarm.id}
                    className={`${styles.alarmItem} ${isCritical ? styles.alarmCritical : styles.alarmWarning} ${isAck ? styles.alarmAcknowledged : ''}`}
                  >
                    <div className={styles.alarmStatusDot} />

                    <div className={styles.alarmDetails}>
                      <div className={styles.alarmMeta}>
                        <span className={styles.alarmLevel}>
                          {isCritical ? 'CRÍTICA' : 'ADVERTENCIA'}
                        </span>
                        <span className={styles.alarmChannel}>{alarm.channel}</span>
                        <span className={styles.alarmTime}>{triggeredTime}</span>
                      </div>
                      <strong className={styles.alarmMsg}>{alarm.title}</strong>
                      <p className={styles.alarmDesc}>{alarm.detail}</p>
                      <p className={styles.alarmAction}><strong>Acción:</strong> {alarm.action}</p>
                    </div>

                    <div className={styles.alarmActionsCluster}>
                      <button
                        type="button"
                        onClick={() => onResolveAlarm(alarm)}
                        className={styles.resolveButton}
                        title="Ir al módulo operativo correspondiente"
                      >
                        Gestionar ↗
                      </button>
                      <button
                        type="button"
                        onClick={(e) => onAcknowledge(alarm.id, e)}
                        disabled={isAck}
                        className={`${styles.ackButton} ${isAck ? styles.ackButtonDone : ''}`}
                      >
                        {isAck ? '✓ Atendida' : 'Reconocer'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.alarmFooter}>
              <span>Protocolo de contingencia MANNÁ v1.0</span>
              <button type="button" onClick={onCloseAlarms} className={styles.dismissAllBtn}>
                Volver a Monitoreo
              </button>
            </div>
          </div>
        </div>
      )}

      <DashboardQuickAccessStrip onboardingData={onboardingData} />

      <div className={styles.kpiStrip}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>VENTAS MES</div>
          <div className={styles.kpiValue} style={{ color: '#1C3F35' }}>{formatScada(financial?.salesCurrentMonth)}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>GASTOS OP.</div>
          <div className={styles.kpiValue} style={{ color: '#B91C1C' }}>{formatScada(financial?.expensesCurrentMonth)}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>UTILIDAD DEVENGADA</div>
          <div className={styles.kpiValue} style={{ color: (financial?.netProfitCurrentMonth || 0) >= 0 ? '#1C3F35' : '#B91C1C' }}>
            {formatScada(financial?.netProfitCurrentMonth)}
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>CAJA LÍQUIDA REAL</div>
          <div className={styles.kpiValue} style={{ color: (financial?.flujoCajaReal || 0) >= 0 ? '#1C3F35' : '#B91C1C' }}>
            {formatScada(financial?.flujoCajaReal)}
          </div>
        </div>
        <div className={styles.kpiCard} style={{ cursor: 'pointer', borderLeft: '3px solid #D97706' }} onClick={handleCarteraClick}>
          <div className={styles.kpiLabel}>POR COBRAR (Clic Ver)</div>
          <div className={styles.kpiValue} style={{ color: '#D97706' }}>{formatScada(financial?.accountsReceivable)}</div>
        </div>
      </div>

      {(() => {
        const isCompleted = onboardingData?.isCompleted || onboardingData?.progressPercentage === 100;
        const isStoredCompleted = typeof window !== 'undefined' && localStorage.getItem('onboarding_completed') === 'true';

        if (isCompleted && !isStoredCompleted && typeof window !== 'undefined') {
          localStorage.setItem('onboarding_completed', 'true');
        }

        const isOnboardingIncomplete = !isCompleted && !isStoredCompleted;
        const hasZeroActivity = (financial?.salesCurrentMonth === 0 || !financial?.salesCurrentMonth) &&
                                (plant?.totalInventoryLiters === 0 || !plant?.totalInventoryLiters);
        const shouldShowHero = onboardingViewMode === 'wizard' || (onboardingViewMode === 'auto' && isOnboardingIncomplete && hasZeroActivity);

        if (shouldShowHero && onboardingData && !isCompleted && !isStoredCompleted) {
          return (
            <OnboardingHeroState
              onboardingData={onboardingData}
              currentMode={onboardingViewMode === 'auto' ? 'wizard' : onboardingViewMode}
              onSwitchMode={(mode) => {
                if (mode === 'dashboard') {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('onboarding_completed', 'true');
                  }
                }
                setOnboardingViewMode(mode);
              }}
            />
          );
        }

        return (
          <>
            {onboardingData && !isCompleted && !isStoredCompleted && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setOnboardingViewMode('wizard')}
                  className={styles.simButton}
                >
                  🌱 Ver Centro de Puesta en Marcha
                </button>
              </div>
            )}
            {activeChannel === 'ALL' && (
              <div className={styles.mainTacticalGrid} onClick={handleInteraction}>
                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>
                    <span><ShieldAlert size={12} style={{marginRight: 4, verticalAlign: 'text-bottom'}}/> RADAR TÁCTICO FEFO</span>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.65rem' }}>
                      <span>ÓRDENES: <strong style={{color: '#1C3F35'}}>{plant?.activeOrdersCount || 0}</strong></span>
                      <span>RNDM: <strong style={{color: '#D97706'}}>{plant?.yieldEfficiencyPercentage || 0}%</strong></span>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }} onClick={() => openModal('Detalle de Riesgos', <p>Abrir vista completa de lotes.</p>)}>
                     <RadarSweepCanvas radarLots={plant?.radarLots || []} />
                  </div>
                </div>

                <div className={styles.productTelemetryCard}>
                  <div className={styles.productTelemetryHeader}>
                    <div className={styles.telemetryTitleGroup}>
                      <span className={styles.telemetrySectionTag}>TELEMETRÍA PRODUCTOS</span>
                      {currentProduct?.classification && (
                        <span
                          className={styles.boxMatrixBadge}
                          data-type={currentProduct.classification.type}
                        >
                          {currentProduct.classification.label}
                        </span>
                      )}
                    </div>

                    <div className={styles.productNavControls}>
                      <button
                        type="button"
                        className={styles.productNavBtn}
                        onClick={handlePrevProduct}
                        title="Producto anterior"
                      >
                        ◀
                      </button>
                      <span className={styles.productNavCounter}>
                        {totalProducts > 0 ? `${currentProductIdx + 1} / ${totalProducts}` : '0 / 0'}
                      </span>
                      <button
                        type="button"
                        className={styles.productNavBtn}
                        onClick={handleNextProduct}
                        title="Producto siguiente"
                      >
                        ▶
                      </button>
                      <button
                        type="button"
                        className={`${styles.productNavBtn} ${isProductAutoPlay ? styles.productNavBtnActive : ''}`}
                        onClick={handleToggleAutoPlay}
                        title={isProductAutoPlay ? "Pausar rotación automática" : "Reanudar rotación automática"}
                      >
                        {isProductAutoPlay ? '⏸' : '▶'}
                      </button>
                    </div>
                  </div>

                  {currentProduct ? (
                    <div className={styles.productTelemetryBody} onClick={() => openProductDrillDown(currentProduct)} style={{cursor:'pointer'}}>
                      <div className={styles.productMainRow}>
                        <div className={styles.productImageWrapper}>
                          <ProductAvatar
                            src={resolveProductImage(currentProduct)}
                            alt={currentProduct.nombre}
                            name={currentProduct.nombre}
                            fluid={true}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        <div className={styles.productInfoCol}>
                          <h3 className={styles.productNameTitle}>{currentProduct.nombre}</h3>
                          <span className={styles.productCategoryTag}>
                            {currentProduct.categoria?.nombre || currentProduct.categoria || 'LÁCTEOS'}
                          </span>
                          <div className={styles.productMetricNumbers}>
                            <div className={styles.metricItem}>
                              <span className={styles.metricLabel}>STOCK CAVA</span>
                              <strong className={styles.metricValue}>{Number(currentProduct.stockCava || currentProduct.stockActual || 0)} unds</strong>
                            </div>
                            <div className={styles.metricItem}>
                              <span className={styles.metricLabel}>COSTO BASE</span>
                              <strong className={styles.metricValue}>${Number(currentProduct.costoUnitario || currentProduct.costo || 0).toLocaleString()}</strong>
                            </div>
                            <div className={styles.metricItem}>
                              <span className={styles.metricLabel}>PRECIO VENTA</span>
                              <strong className={styles.metricValue}>${Number(currentProduct.precioVenta || 0).toLocaleString()}</strong>
                            </div>
                          </div>
                        </div>

                        <div className={styles.productRadialWrapper}>
                          <div className={styles.radialGaugeContainer}>
                            <svg viewBox="0 0 100 55" className={styles.gaugeSvg}>
                              <path
                                d="M 10 50 A 40 40 0 0 1 90 50"
                                fill="none"
                                stroke="#E5DFD5"
                                strokeWidth="8"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 10 50 A 40 40 0 0 1 90 50"
                                fill="none"
                                stroke={Number(currentProduct.margenPorcentaje || currentProduct.margen || 0) >= 30 ? '#10B981' : Number(currentProduct.margenPorcentaje || currentProduct.margen || 0) >= 15 ? '#F59E0B' : '#EF4444'}
                                strokeWidth="8"
                                strokeDasharray="125.6"
                                strokeDashoffset={125.6 - (125.6 * Math.min(100, Math.max(0, Number(currentProduct.margenPorcentaje || currentProduct.margen || 0)))) / 100}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className={styles.gaugeText}>
                              <strong>{Math.round(currentProduct.margenPorcentaje || currentProduct.margen || 0)}%</strong>
                              <span>MARGEN</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={styles.productForecastBar}>
                        <span>Ventas: <strong>{currentProduct.forecast?.velocidadDiaria || 0.4} und/día</strong></span>
                        <span>Demanda 7d: <strong>{currentProduct.forecast?.demandaProyectada7d || 3} unds</strong></span>
                        <span>Cobertura: <strong>{currentProduct.forecast?.diasCobertura || 99} días</strong></span>
                        <span
                          className={styles.trendBadge}
                          data-trend={currentProduct.forecast?.tendencia || 'ESTABLE'}
                        >
                          {currentProduct.forecast?.tendencia === 'ALZA' ? '▲ Alta Rotación' : currentProduct.forecast?.tendencia === 'BAJA' ? '▼ Demanda Lenta' : '● Demanda Estable'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.productEmptyState}>
                      <span>No hay productos activos para telemetría</span>
                    </div>
                  )}
                </div>

                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>
                    <span><Database size={12} style={{marginRight: 4, verticalAlign: 'text-bottom'}}/> SILOS & INSUMOS</span>
                  </div>
                  <div className={styles.silosCardBody}>
                    <div className={styles.silosCanvasContainer}>
                       <LiquidSilosCanvas
                         rawMaterialsValue={supply?.rawMaterialsValue || 0}
                         wipValue={wipValue || 0}
                         finishedProductsValue={plant?.finishedProductsValue || 0}
                         onSiloClick={handleSiloSelect}
                       />
                    </div>
                    <div className={styles.reorderContainer}>
                      <div className={styles.cardHeader} style={{ color: '#B91C1C', fontSize: '0.65rem', marginBottom: '0.2rem' }}>PUNTO REORDEN</div>
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {(supply?.criticalSupplies || []).length === 0 ? (
                          <div style={{ color: '#1C3F35', fontSize: '0.75rem' }}>Niveles OK.</div>
                        ) : (
                          supply.criticalSupplies.map(cs => (
                            <div key={cs.id} className={styles.alertItem} style={{ padding: '0.25rem 0', fontSize: '0.75rem' }}>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cs.insumo}</span>
                              <span style={{ fontWeight: 'bold' }}>{cs.actual}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>
                    <span><Activity size={12} style={{marginRight: 4, verticalAlign: 'text-bottom'}}/> FLUJO DE CAJA</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', minHeight: 0 }} onClick={handleCarteraClick}>
                    <OscilloscopeCanvas trendSales={financial?.trendSales || []} trendExpenses={financial?.trendExpenses || []} />
                  </div>
                </div>
              </div>
            )}
            {activeChannel === 'FINANCE' && (
              <div className={styles.mainTacticalGrid} style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }} onClick={handleInteraction}>
                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>FLUJO DE CAJA TÁCTICO (MES ACTUAL)</div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }} onClick={handleCarteraClick}>
                    <OscilloscopeCanvas trendSales={financial?.trendSales || []} trendExpenses={financial?.trendExpenses || []} />
                  </div>
                </div>
                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>CARTERA POR COBRAR (TOP CLIENTES)</div>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {(financial?.debtors || []).length === 0 ? (
                      <div style={{ color: '#1C3F35', fontSize: '0.9rem', padding: '1rem' }}>Cuentas sanas. No hay deudas pendientes.</div>
                    ) : (
                      <table className={styles.dataTable}>
                        <thead><tr><th>Cliente</th><th>Días</th><th>Saldo</th></tr></thead>
                        <tbody>
                          {financial.debtors.map(d => (
                            <tr key={d.id}>
                              <td>{d.cliente}</td>
                              <td>{d.diasCredito}</td>
                              <td style={{fontWeight:'bold',color:'#B91C1C'}}>{formatScada(d.saldoPendiente)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeChannel === 'PLANT' && (
              <div className={styles.mainTacticalGrid} style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }} onClick={handleInteraction}>
                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>RADAR DE LOTES (FEFO)</div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
                     <RadarSweepCanvas radarLots={plant?.radarLots || []} />
                  </div>
                </div>
                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>TELEMETRÍA DE PRODUCCIÓN</div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {(() => {
                      const prod = currentProduct || plant?.productsTelemetry?.[currentProductIdx] || plant?.productsTelemetry?.[0] || null;
                      if (!prod) {
                        return (
                          <div style={{ padding: '1rem', color: '#78716C', textAlign: 'center', margin: 'auto' }}>
                            No hay productos activos para telemetría
                          </div>
                        );
                      }
                      return (
                        <div key={prod.idProducto || 'plant-prod'} className={styles.monitorGrid} style={{ flex: 1, margin: 0, padding: '0.25rem', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <ProductAvatar
                              src={resolveProductImage(prod)}
                              alt={prod.nombre}
                              name={prod.nombre}
                              fluid={true}
                              style={{ maxWidth: '100px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                            />
                            <div className={styles.productNameInfo}>
                              <span className={styles.prodName} style={{ fontSize: '1.25rem' }}>{prod.nombre}</span>
                              <span className={styles.prodCat}>{prod.categoria?.nombre || prod.categoria || 'LÁCTEOS'}</span>
                              <span style={{ fontSize: '0.85rem', color: '#1C3F35', marginTop: '0.5rem' }}>Stock Cava: {prod.stockCava ?? 0} und</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #E8E2D7', paddingTop: '1rem', marginTop: 'auto' }}>
                             <AnalogGauge value={prod.margenPorcentaje ?? 0} label="MARGEN %" />
                             <div style={{ textAlign: 'center' }}>
                               <div style={{ fontSize: '0.75rem', color: '#78716C' }}>ÓRDENES PROCESO</div>
                               <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#D97706' }}>{plant?.activeOrdersCount ?? 0}</div>
                             </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
            {activeChannel === 'SUPPLY' && (
              <div className={styles.mainTacticalGrid} style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }} onClick={handleInteraction}>
                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>NIVELES DE SILOS Y CAVA</div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
                     <LiquidSilosCanvas
                       rawMaterialsValue={supply?.rawMaterialsValue || 0}
                       wipValue={wipValue || 0}
                       finishedProductsValue={plant?.finishedProductsValue || 0}
                       onSiloClick={handleSiloSelect}
                     />
                  </div>
                </div>
                <div className={styles.tacticalCard}>
                  <div className={styles.cardHeader}>INSUMOS CRÍTICOS (PUNTO DE REORDEN)</div>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {(supply?.criticalSupplies || []).length === 0 ? (
                      <div style={{ color: '#1C3F35', fontSize: '0.9rem', padding: '1rem' }}>Niveles OK. No hay alertas críticas.</div>
                    ) : (
                      <table className={styles.dataTable}>
                        <thead><tr><th>Insumo</th><th>Actual/Min</th><th>Proveedor (Ult. Precio)</th></tr></thead>
                        <tbody>
                          {supply.criticalSupplies.map(cs => (
                            <tr key={cs.id} className={styles.alertItem} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td>{cs.insumo}</td>
                              <td style={{ fontWeight: 'bold' }}>{cs.actual} / {cs.minimo}</td>
                              <td>{cs.proveedorSugerido} <br/><span style={{fontSize:'0.7rem', color:'#78716C'}}>{formatScada(cs.lastPrice)}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}

      <SmartModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        isDirty={false}
        isSubmitting={false}
      >
        {modalState.content}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E8E2D7' }}>
          <button type="button" onClick={closeModal} className={styles.darkBtn}>Entendido</button>
        </div>
      </SmartModal>

      {renderSimulatorModal()}
    </div>
  );
}
