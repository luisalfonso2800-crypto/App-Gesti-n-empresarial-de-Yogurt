'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { formatScada } from '@/lib/formatters';
import { LoadingState, ErrorState } from '@/components/ui/States';
import SmartModal from '@/components/ui/SmartModal';
import AnalogGauge from './components/AnalogGauge';
import OscilloscopeCanvas from './components/OscilloscopeCanvas';
import RadarSweepCanvas from './components/RadarSweepCanvas';
import LiquidSilosCanvas from './components/LiquidSilosCanvas';
import ProductAvatar from '@/components/ui/ProductAvatar';
import StrictNumberInput from '@/components/ui/inputs/StrictNumberInput';
import { resolveProductImage } from '@/lib/presetImages';
import { Activity, ShieldAlert, Database, Clock, Settings, PackageX, MoreVertical, ShoppingCart, Tag, Package, CreditCard, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  
  // Múltiplexor de Canales
  const [activeChannel, setActiveChannel] = useState('ALL'); // ALL, FINANCE, PLANT, SUPPLY
  const [isAutoScan, setIsAutoScan] = useState(true);
  const autoScanRef = useRef(isAutoScan);
  
  const [modalState, setModalState] = useState({ isOpen: false, title: '', content: null });

  // Simulator State
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simProduct, setSimProduct] = useState('');
  const [simLiters, setSimLiters] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchTelemetry = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/dashboard/full-telemetry');
        if (mounted) {
          setTelemetry(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Error de conexión SCADA multiplexor');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTelemetry();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    autoScanRef.current = isAutoScan;
  }, [isAutoScan]);

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

  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const productsLen = telemetry?.plant?.productsTelemetry?.length || 0;

  useEffect(() => {
    if (!productsLen) return;
    const prodInterval = setInterval(() => {
      if (autoScanRef.current) {
        setActiveProductIndex(prev => (prev + 1) % productsLen);
      }
    }, 8000);
    return () => clearInterval(prodInterval);
  }, [productsLen, isAutoScan]);

  const handleInteraction = () => {
    if (isAutoScan) setIsAutoScan(false);
  };

  const selectChannel = (ch) => {
    setActiveChannel(ch);
    setIsAutoScan(false);
  };

  const openModal = (title, content) => {
    handleInteraction();
    setModalState({ isOpen: true, title, content });
  };
  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!telemetry) return null;

  const { financial, plant, supply } = telemetry;
  
  const formatScada = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val || 0);

  // --- DRILL DOWN ACTIONS ---
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
            {supply.rawMaterialsList.map(rm => (
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
            {plant.finishedProductsList.map(fp => (
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

  const handleCarteraClick = () => {
    openModal('Cartera Pendiente por Cliente', (
      <div className={styles.modalContent}>
        {financial.debtors.length === 0 ? (
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

  // --- SIMULATOR LOGIC ---
  const selectedProdInfo = plant.productsTelemetry.find(p => p.idProducto === simProduct);
  let simUnits = 0;
  let simCost = 0;
  let simSales = 0;
  let simProfit = 0;
  let simProfitMargin = 0;
  
  // Fake inventory checks for demonstration
  const rawMilkAvailable = 500; // Simulated
  let milkRequired = 0;

  if (selectedProdInfo && simLiters) {
    const liters = parseFloat(simLiters) || 0;
    // Assuming 1L yields 1 unit of 1000g, or 10 units of 100g. We will use a mock multiplier based on category
    const multiplier = selectedProdInfo.categoria.toLowerCase().includes('mini') ? 10 : (selectedProdInfo.nombre.includes('500') ? 2 : 1);
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
              {plant.productsTelemetry.map(p => (
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
                  router.push('/operations/production'); // redirecciona
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

  // --- RENDER CHANNELS ---
  const renderChannelAll = () => (
    <div className={styles.mainTacticalGrid} onClick={handleInteraction}>
      {/* CUADRANTE 1: FEFO + Órdenes */}
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>
          <span><ShieldAlert size={12} style={{marginRight: 4, verticalAlign: 'text-bottom'}}/> RADAR TÁCTICO FEFO</span>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.65rem' }}>
            <span>ÓRDENES: <strong style={{color: '#1C3F35'}}>{plant.activeOrdersCount}</strong></span>
            <span>RNDM: <strong style={{color: '#D97706'}}>{plant.yieldEfficiencyPercentage}%</strong></span>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }} onClick={() => openModal('Detalle de Riesgos', <p>Abrir vista completa de lotes.</p>)}>
           <RadarSweepCanvas radarLots={plant.radarLots} />
        </div>
      </div>

      {/* CUADRANTE 2: Telemetría Producto con Avatar Expandido */}
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>TELEMETRÍA PRODUCTOS</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {(() => {
            const prod = plant.productsTelemetry[activeProductIndex];
            if (!prod) return null;
            return (
              <div key={prod.idProducto} className={styles.monitorGrid} onClick={() => openProductDrillDown(prod)} style={{ flex: 1, margin: 0, padding: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', gridColumn: '1 / -1', marginBottom: '0.25rem' }}>
                  <ProductAvatar 
                    src={resolveProductImage(prod)} 
                    alt={prod.nombre} 
                    name={prod.nombre}
                    fluid={true}
                    style={{ maxWidth: '70px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                  />
                  <div className={styles.productNameInfo}>
                    <span className={styles.prodName} style={{ fontSize: '1.15rem', lineHeight: '1.2' }}>{prod.nombre}</span>
                    <span className={styles.prodCat}>{prod.categoria}</span>
                  </div>
                </div>
                <div className={styles.meterItem}>
                  <span className={styles.meterLabel}>Stock</span>
                  <span className={styles.meterValue} style={{ color: '#1C3F35', fontSize: '1.25rem' }}>{prod.stockCava}</span>
                </div>
                <div className={styles.meterItem}>
                  <span className={styles.meterLabel}>Costo</span>
                  <span className={styles.meterValue} style={{ color: '#D97706', fontSize: '1.25rem' }}>{formatScada(prod.costoUnitario)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                   <AnalogGauge value={prod.margenPorcentaje} label="MARGEN %" />
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* CUADRANTE 3: Silos e Insumos */}
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>
          <span><Database size={12} style={{marginRight: 4, verticalAlign: 'text-bottom'}}/> SILOS & INSUMOS</span>
        </div>
        <div style={{ display: 'flex', flex: 1, minHeight: 0, gap: '1rem' }}>
          <div onClick={handleSiloMateriaClick} style={{ cursor: 'pointer', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
             <LiquidSilosCanvas rawMaterialsValue={supply.rawMaterialsValue} finishedProductsValue={plant.finishedProductsValue} />
          </div>
          <div style={{ width: '40%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className={styles.cardHeader} style={{ color: '#B91C1C', fontSize: '0.65rem', marginBottom: '0.2rem' }}>PUNTO REORDEN</div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {supply.criticalSupplies.length === 0 ? (
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

      {/* CUADRANTE 4: Osciloscopio Flujo Caja */}
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>
          <span><Activity size={12} style={{marginRight: 4, verticalAlign: 'text-bottom'}}/> FLUJO DE CAJA</span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', minHeight: 0 }} onClick={handleCarteraClick}>
          <OscilloscopeCanvas trendSales={financial.trendSales} trendExpenses={financial.trendExpenses} />
        </div>
      </div>
    </div>
  );

  const renderChannelFinance = () => (
    <div className={styles.mainTacticalGrid} style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }} onClick={handleInteraction}>
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>FLUJO DE CAJA TÁCTICO (MES ACTUAL)</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }} onClick={handleCarteraClick}>
          <OscilloscopeCanvas trendSales={financial.trendSales} trendExpenses={financial.trendExpenses} />
        </div>
      </div>
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>CARTERA POR COBRAR (TOP CLIENTES)</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {financial.debtors.length === 0 ? (
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
  );

  const renderChannelPlant = () => (
    <div className={styles.mainTacticalGrid} style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }} onClick={handleInteraction}>
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>RADAR DE LOTES (FEFO)</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
           <RadarSweepCanvas radarLots={plant.radarLots} />
        </div>
      </div>
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>TELEMETRÍA DE PRODUCCIÓN</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {(() => {
            const prod = plant.productsTelemetry[activeProductIndex];
            if (!prod) return null;
            return (
              <div key={prod.idProducto} className={styles.monitorGrid} style={{ flex: 1, margin: 0, padding: '0.25rem', display: 'flex', flexDirection: 'column' }}>
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
                    <span className={styles.prodCat}>{prod.categoria}</span>
                    <span style={{ fontSize: '0.85rem', color: '#1C3F35', marginTop: '0.5rem' }}>Stock Cava: {prod.stockCava} und</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid #E8E2D7', paddingTop: '1rem', marginTop: 'auto' }}>
                   <AnalogGauge value={prod.margenPorcentaje} label="MARGEN %" />
                   <div style={{ textAlign: 'center' }}>
                     <div style={{ fontSize: '0.75rem', color: '#78716C' }}>ÓRDENES PROCESO</div>
                     <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#D97706' }}>{plant.activeOrdersCount}</div>
                   </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );

  const renderChannelSupply = () => (
    <div className={styles.mainTacticalGrid} style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }} onClick={handleInteraction}>
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>NIVELES DE SILOS Y CAVA</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 0 }}>
           <LiquidSilosCanvas rawMaterialsValue={supply.rawMaterialsValue} finishedProductsValue={plant.finishedProductsValue} />
        </div>
      </div>
      <div className={styles.tacticalCard}>
        <div className={styles.cardHeader}>INSUMOS CRÍTICOS (PUNTO DE REORDEN)</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {supply.criticalSupplies.length === 0 ? (
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
  );

  return (
    <div className={styles.dashboardContainer}>
      
      {/* HEADER TÁCTICO */}
      <header className={styles.scadaHeader}>
        <div className={styles.titleGroup}>
          <h1 className={styles.scadaTitle}>SCADA MULTIPLEXOR</h1>
          <span className={styles.scadaSubtitle}>por Canales Tácticos</span>
        </div>

        <nav className={styles.channelNavigation} aria-label="Selector de Canales">
          {/* Botón de Estado / Auto-Scan con LED */}
          <button
            type="button"
            onClick={() => setIsAutoScan(!isAutoScan)}
            className={`${styles.scanToggleBtn} ${isAutoScan ? styles.scanActive : styles.scanPaused}`}
            title={isAutoScan ? "Pausar rotación automática" : "Reanudar auto-escaneo"}
          >
            <span className={styles.statusLed} />
            {isAutoScan ? "AUTO-SCAN 10s" : "PAUSADO / MANUAL"}
          </button>

          {/* Segmented Control de Canales */}
          <div className={styles.segmentedControl}>
            <button
              type="button"
              onClick={() => { setActiveChannel('ALL'); setIsAutoScan(false); }}
              className={`${styles.channelTab} ${activeChannel === 'ALL' ? styles.channelTabActive : ''}`}
            >
              PANORAMA 4X
            </button>

            <button
              type="button"
              onClick={() => { setActiveChannel('FINANCE'); setIsAutoScan(false); }}
              className={`${styles.channelTab} ${activeChannel === 'FINANCE' ? styles.channelTabActive : ''}`}
            >
              <span className={styles.channelCode}>CH-01</span> FINANZAS
            </button>

            <button
              type="button"
              onClick={() => { setActiveChannel('PLANT'); setIsAutoScan(false); }}
              className={`${styles.channelTab} ${activeChannel === 'PLANT' ? styles.channelTabActive : ''}`}
            >
              <span className={styles.channelCode}>CH-02</span> PLANTA / FEFO
            </button>

            <button
              type="button"
              onClick={() => { setActiveChannel('SUPPLY'); setIsAutoScan(false); }}
              className={`${styles.channelTab} ${activeChannel === 'SUPPLY' ? styles.channelTabActive : ''}`}
            >
              <span className={styles.channelCode}>CH-03</span> SUMINISTROS
            </button>
          </div>
        </nav>

        {/* Simulador y Reloj del Sistema */}
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

      {/* CINTA TÁCTICA DE ACCESOS RÁPIDOS */}
      <section className={styles.quickAccessGrid} aria-label="Accesos Rápidos Operativos">
        <Link className={styles.actionCard} href="/operations/purchases">
          <div className={styles.cardIconWrapper}>
            <ShoppingCart className={styles.actionCardIcon} size={18}/>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.actionCardCategory}>MÓDULO</span>
            <strong className={styles.actionCardTitle}>Compras</strong>
          </div>
        </Link>

        <Link className={styles.actionCard} href="/catalog/supplier-prices">
          <div className={styles.cardIconWrapper}>
            <Tag className={styles.actionCardIcon} size={18}/>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.actionCardCategory}>INSUMOS</span>
            <strong className={styles.actionCardTitle}>Precios Proveedor</strong>
          </div>
        </Link>

        <Link className={styles.actionCard} href="/catalog/products">
          <div className={styles.cardIconWrapper}>
            <Package className={styles.actionCardIcon} size={18}/>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.actionCardCategory}>CATÁLOGO</span>
            <strong className={styles.actionCardTitle}>Productos</strong>
          </div>
        </Link>

        <Link className={styles.actionCard} href="/commercial/payments">
          <div className={styles.cardIconWrapper}>
            <CreditCard className={styles.actionCardIcon} size={18}/>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.actionCardCategory}>TESORERÍA</span>
            <strong className={styles.actionCardTitle}>Pagos y Cobros</strong>
          </div>
        </Link>

        <Link className={styles.actionCard} href="/commercial/sales">
          <div className={styles.cardIconWrapper}>
            <TrendingUp className={styles.actionCardIcon} size={18}/>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.actionCardCategory}>COMERCIAL</span>
            <strong className={styles.actionCardTitle}>Ventas</strong>
          </div>
        </Link>
      </section>

      <div className={styles.kpiStrip}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>VENTAS MES</div>
          <div className={styles.kpiValue} style={{ color: '#1C3F35' }}>{formatScada(financial.salesCurrentMonth)}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>GASTOS OP.</div>
          <div className={styles.kpiValue} style={{ color: '#B91C1C' }}>{formatScada(financial.expensesCurrentMonth)}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>UTILIDAD NETA</div>
          <div className={styles.kpiValue} style={{ color: financial.netProfitCurrentMonth >= 0 ? '#1C3F35' : '#B91C1C' }}>
            {formatScada(financial.netProfitCurrentMonth)}
          </div>
        </div>
        <div className={styles.kpiCard} style={{ cursor: 'pointer', borderLeft: '3px solid #D97706' }} onClick={handleCarteraClick}>
          <div className={styles.kpiLabel}>POR COBRAR (Clic Ver)</div>
          <div className={styles.kpiValue} style={{ color: '#D97706' }}>{formatScada(financial.accountsReceivable)}</div>
        </div>
      </div>

      {activeChannel === 'ALL' && renderChannelAll()}
      {activeChannel === 'FINANCE' && renderChannelFinance()}
      {activeChannel === 'PLANT' && renderChannelPlant()}
      {activeChannel === 'SUPPLY' && renderChannelSupply()}

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
