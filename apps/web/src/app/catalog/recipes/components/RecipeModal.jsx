/**
 * @file RecipeModal.jsx
 * @module catalog/recipes/components
 * @description Editor ergonómico para crear/editar recetas técnicas con flujo visual causa-efecto, paleta MANNÁ y semáforo financiero.
 * @responsibility Formulario de cabecera con producto como campo protagónico, unidad bloqueada, empty state asistido y prevención Poka-Yoke.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/components/ui/ContextBanner, @/lib/formatters, IngredientsFormSection, styles local
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContextBanner } from '@/components/ui/ContextBanner';
import { formatCurrency } from '@/lib/formatters';
import { IngredientsFormSection } from './IngredientsFormSection';
import styles from '../recipes.module.css';

/**
 * Genera dinámicamente un párrafo descriptivo en lenguaje natural de planta para una etapa.
 * @param {Object} etapa - Datos de la etapa (tiempos, temperaturas, instrucciones, detalles)
 * @param {Array} supplies - Catálogo de insumos
 * @param {Array} products - Catálogo de productos
 * @returns {string} Síntesis en lenguaje natural de planta
 */
export function generateStageSummaryText(etapa, supplies = [], products = []) {
  if (!etapa) return '';

  // 1. Insumos y bases agregados
  const activeDetails = etapa.detalles?.filter(d => d.activo !== false) || [];
  let insumosPart = '';

  if (activeDetails.length === 0) {
    insumosPart = 'Fase de proceso térmico/espera sin adición de materiales físicos';
  } else {
    const itemsList = activeDetails.map(det => {
      let nombreItem = '';
      if (det.idProductoIntermedio) {
        const prod = products.find(p => String(p.id) === String(det.idProductoIntermedio));
        nombreItem = prod ? prod.nombre : 'BASE INTERMEDIA (WIP)';
      } else if (det.idInsumo) {
        const ins = supplies.find(s => String(s.id) === String(det.idInsumo));
        nombreItem = ins ? ins.nombre : 'INSUMO';
      } else {
        nombreItem = 'MATERIAL';
      }

      const cantNum = Number(det.cantidadRequerida) || 0;
      const cantFormateada = cantNum.toLocaleString('es-CO', { maximumFractionDigits: 4 });
      const unidad = det.unidad || '';

      return `${cantFormateada} ${unidad} de ${nombreItem}`.trim();
    });

    insumosPart = `Adición de: ${itemsList.join(', ')}`;
  }

  // 2. Temperaturas
  let tempPart = '';
  const tempMin = etapa.tempMinimaGrados !== '' && etapa.tempMinimaGrados !== null && etapa.tempMinimaGrados !== undefined ? Number(etapa.tempMinimaGrados) : null;
  const tempMax = etapa.tempMaximaGrados !== '' && etapa.tempMaximaGrados !== null && etapa.tempMaximaGrados !== undefined ? Number(etapa.tempMaximaGrados) : null;

  if (tempMin !== null && tempMax !== null && (tempMin > 0 || tempMax > 0)) {
    if (tempMin === tempMax) {
      tempPart = `a temperatura de ${tempMin}°C`;
    } else {
      tempPart = `manteniendo temperatura entre ${tempMin}°C y ${tempMax}°C`;
    }
  } else if (tempMin !== null && tempMin > 0) {
    tempPart = `a temperatura de ${tempMin}°C`;
  } else if (tempMax !== null && tempMax > 0) {
    tempPart = `a temperatura máxima de ${tempMax}°C`;
  }

  // 3. Tiempos y Conversión Horaria
  let tiempoPart = '';
  const tiempoEst = Number(etapa.tiempoEstandarMin) || 0;
  const tMin = Number(etapa.tiempoMinimoMin) || 0;
  const tMax = Number(etapa.tiempoMaximoMin) || 0;

  if (tiempoEst > 0) {
    let conversion = '';
    if (tiempoEst >= 60) {
      const horas = tiempoEst / 60;
      const horasFormatted = Number.isInteger(horas) ? horas : horas.toFixed(1);
      const sufijoHora = horas === 1 ? 'hora' : 'horas';
      conversion = ` (${horasFormatted} ${sufijoHora})`;
    }

    tiempoPart = `durante ${tiempoEst} min${conversion}`;
  }

  if (tMin > 0 || tMax > 0) {
    const rangoStr = `rango admisible: ${tMin} a ${tMax} min`;
    tiempoPart = tiempoPart ? `${tiempoPart} (${rangoStr})` : `en ${rangoStr}`;
  }

  // 4. Instrucción
  let instruccionPart = '';
  if (etapa.instrucciones && etapa.instrucciones.trim()) {
    instruccionPart = `para: ${etapa.instrucciones.trim()}`;
  }

  // Ensamblar componentes con fluidez natural
  const clauses = [insumosPart];
  if (tempPart) clauses.push(tempPart);
  if (tiempoPart) clauses.push(tiempoPart);
  if (instruccionPart) clauses.push(instruccionPart);

  let sentence = clauses.join(', ');
  if (!sentence.endsWith('.')) {
    sentence += '.';
  }

  return sentence;
}

/**
 * Convierte minutos numéricos en formato digital tipo reloj 00:00 h con desglose contextual.
 * @param {number|string} val - Minutos a convertir
 * @returns {string} Texto formateado con icono de reloj
 */
export function formatMinutesToDigitalClock(val) {
  const totalMins = Math.max(0, Math.floor(Number(val) || 0));
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const hh = hours.toString().padStart(2, '0');
  const mm = mins.toString().padStart(2, '0');

  if (totalMins === 0) {
    return `${hh}:${mm} h`;
  }
  if (hours === 0) {
    return `${hh}:${mm} h (${mins} min)`;
  }
  if (mins === 0) {
    return `${hh}:${mm} h (${hours} h)`;
  }
  return `${hh}:${mm} h (${hours} h ${mins} min)`;
}

export function RecipeModal({ 
  formData, products = [], supplies = [], onClose, onSubmit, onChange,
  onApplyStageTemplate, onAddEtapa, onUpdateEtapa, onRemoveEtapa, onMoveEtapa,
  onAddDetalle, onUpdateDetalle, onRemoveDetalle, calculateCost
}) {
  // Estado para acordeón exclusivo (índice de la etapa expandida; -1 si todas están colapsadas)
  const [expandedStageIndex, setExpandedStageIndex] = useState(0);

  // Estado para mostrar panel de lectura continua "Finalizar y Resumir Proceso"
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);

  // Estado para el modal de auditoría técnica "Hoja de Ruta Operativa de Planta"
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Estado de envío en curso
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para revelación progresiva del campo de observaciones
  const [showNotes, setShowNotes] = useState(Boolean(formData.observaciones && formData.observaciones.trim()));

  // Asegurar que si hay observaciones se active el campo al abrir
  useEffect(() => {
    if (formData.observaciones && formData.observaciones.trim()) {
      setShowNotes(true);
    }
  }, [formData.observaciones]);

  // Conteo de insumos y bases intermedias para el balance general de materiales
  let totalMateriasPrimas = 0;
  let totalBasesWip = 0;

  formData.etapas?.forEach(etapa => {
    etapa.detalles?.forEach(det => {
      if (det.activo !== false) {
        if (det.idProductoIntermedio) {
          totalBasesWip += 1;
        } else if (det.idInsumo) {
          totalMateriasPrimas += 1;
        }
      }
    });
  });

  const activeStages = formData.etapas?.filter(e => e.activo !== false) || [];
  const activeStagesCount = activeStages.length;

  const totalCost = calculateCost();
  const rendimientoNum = parseFloat(formData.rendimientoBase) || 0;
  const costPerUnit = rendimientoNum > 0 ? (totalCost / rendimientoNum) : 0;

  // Guardia Poka-Yoke: Secuencia de Planta (Base a Granel ➔ Producto Comercial Envasado)
  const hasBulkProduct = products.some(p => 
    p.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || 
    p.presentacion?.nombre?.toUpperCase().includes('GRANEL') ||
    ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(p.categoria)
  );

  const selectedProduct = products.find(p => String(p.id) === String(formData.idProducto));
  const isSelectedProductBulk = selectedProduct ? (
    selectedProduct.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || 
    selectedProduct.presentacion?.nombre?.toUpperCase().includes('GRANEL') ||
    ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(selectedProduct.categoria)
  ) : false;

  const isCommercialWithoutBulk = selectedProduct && !isSelectedProductBulk && !hasBulkProduct;
  const isCommercialProduct = selectedProduct && !isSelectedProductBulk;

  // Detección Poka-Yoke de Empaque Obligatorio en Productos Comerciales
  const hasPackagingItem = formData.etapas?.some(etapa => {
    if (etapa.activo === false) return false;
    return etapa.detalles?.some(det => {
      if (det.activo === false) return false;
      if (det.tipoInsumo === 'EMPAQUE_BASE' || det.tipoInsumo === 'EMPAQUE_COMPLEMENTO') {
        return true;
      }
      if (det.idInsumo) {
        const ins = supplies.find(s => s.id === det.idInsumo);
        if (ins) {
          const cat = (ins.categoria || '').toUpperCase();
          const subcat = (ins.subcategoria || '').toUpperCase();
          const nom = (ins.nombre || '').toUpperCase();
          return cat.includes('EMPAQUE') || subcat.includes('ENVASE') || subcat.includes('TAPA') || nom.includes('VASO') || nom.includes('BOTELLA') || nom.includes('TAPA');
        }
      }
      return false;
    });
  });

  const isMissingCommercialPackaging = isCommercialProduct && !hasPackagingItem;

  // Parámetros financieros del producto para el semáforo de costo en tiempo real
  const precioVentaNum = Number(selectedProduct?.precioVenta) || 0;
  const margenObjetivoNum = Number(selectedProduct?.margenObjetivo) || 0;
  const costoTopePermitido = precioVentaNum > 0 && margenObjetivoNum > 0
    ? Math.round(precioVentaNum * (1 - (margenObjetivoNum / 100)))
    : 0;

  const isInternoOrBulk = precioVentaNum === 0 || isSelectedProductBulk;
  const canSubmit = !isCommercialWithoutBulk && !isMissingCommercialPackaging;

  let submitTooltip = '';
  if (isCommercialWithoutBulk) {
    submitTooltip = 'Debe existir al menos un producto base a granel en el catálogo para formular productos terminados';
  } else if (isMissingCommercialPackaging) {
    submitTooltip = 'Debe agregar al menos un insumo de empaque primario (vaso, botella o tapa) a la receta';
  }

  // Cálculo del tiempo total acumulado de fabricación en minutos de las etapas activas
  const totalProductionTimeMins = activeStages.reduce((acc, stg) => acc + (Number(stg.tiempoEstandarMin) || 0), 0);

  const handleApplyTemplate = (type) => {
    const currentCount = formData.etapas?.length || 0;
    if (onApplyStageTemplate) {
      onApplyStageTemplate(type);
    } else if (onAddEtapa) {
      onAddEtapa(type);
    }
    // Abre en edición la primera de las nuevas etapas añadidas
    setExpandedStageIndex(currentCount);
    setShowSummaryPanel(false);
  };

  const handleAddNewStage = () => {
    const nextIndex = formData.etapas?.length || 0;
    if (onAddEtapa) {
      onAddEtapa();
    }
    // Abre la recién creada al final
    setExpandedStageIndex(nextIndex);
    setShowSummaryPanel(false);
  };

  const handleToggleSummarize = () => {
    if (showSummaryPanel) {
      setShowSummaryPanel(false);
      setExpandedStageIndex(0);
    } else {
      setShowSummaryPanel(true);
      setExpandedStageIndex(-1);
    }
  };

  // Validación y apertura del modal de auditoría técnica "Hoja de Ruta Operativa de Planta"
  const handleOpenSummaryModal = () => {
    if (!formData.idProducto) {
      alert('Debe seleccionar el producto a fabricar antes de finalizar y resumir la receta.');
      return;
    }
    if (!formData.rendimientoBase || Number(formData.rendimientoBase) <= 0) {
      alert('Debe ingresar una cantidad de rendimiento base mayor a cero.');
      return;
    }
    if (isCommercialWithoutBulk) {
      alert('Debe existir al menos un producto base a granel en el catálogo para formular productos terminados.');
      return;
    }
    if (isMissingCommercialPackaging) {
      alert('Debe agregar al menos un insumo de empaque primario (vaso, botella o tapa) a la receta.');
      return;
    }
    setShowSummaryModal(true);
  };

  // Manejo de confirmación para cancelar desde el header principal
  const handleHeaderCancel = () => {
    const hasDataEntered = Boolean(formData.idProducto || formData.nombre || formData.rendimientoBase || (formData.etapas && formData.etapas.length > 0));
    if (hasDataEntered) {
      const confirmLeave = window.confirm('¿Deseas salir del editor de recetas? Se perderán los cambios no guardados.');
      if (!confirmLeave) return;
    }
    onClose();
  };

  // Confirmación destructiva de descarte total dentro del modal de resumen
  const handleDiscardCompleteRecipe = () => {
    const confirmed = window.confirm(
      '⚠️ Atención: Si cancelas se descartará todo el proceso formulado y se perderán los datos ingresados.\n\n¿Estás seguro de que deseas descartar la receta completa y salir?'
    );
    if (confirmed) {
      setShowSummaryModal(false);
      onClose();
    }
  };

  // Envío final desde el modal de resumen
  const handleConfirmPublish = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSubmit(e);
      setShowSummaryModal(false);
    } catch (err) {
      console.error('Error al publicar receta:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Botonera Superior Fija: Acciones clave accesibles inmediatamente sin scroll */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>{formData.id ? 'Editar Receta Técnica' : 'Nueva Receta Técnica'}</h1>
          <span className={styles.subtitle}>Formulación estandarizada y hoja de ruta de fabricación</span>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <button 
            type="button" 
            className={styles.cancelBtn} 
            onClick={handleHeaderCancel}
            style={{
              backgroundColor: '#F7F4EE',
              border: '1px solid #D6D3D1',
              color: '#182622',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className={styles.saveBtn}
            onClick={handleOpenSummaryModal}
            disabled={!canSubmit || !formData.idProducto || Number(formData.rendimientoBase) <= 0}
            title={submitTooltip || (!formData.idProducto ? 'Seleccione un producto a fabricar' : Number(formData.rendimientoBase) <= 0 ? 'Indique el rendimiento base' : 'Revisar hoja de ruta de planta antes de publicar')}
            style={{
              backgroundColor: (canSubmit && formData.idProducto && Number(formData.rendimientoBase) > 0) ? '#182622' : '#A8A29E',
              color: '#FFFFFF',
              border: '1px solid #182622',
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: (canSubmit && formData.idProducto && Number(formData.rendimientoBase) > 0) ? 'pointer' : 'not-allowed',
              opacity: (canSubmit && formData.idProducto && Number(formData.rendimientoBase) > 0) ? 1 : 0.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>📋</span> Finalizar y Resumir
          </button>
        </div>
      </div>

      <ContextBanner
        title="Concepto Técnico"
        description="Instrucciones paso a paso para fabricar los productos. Permite formular tanto materias primas compradas como bases semielaboradas (WIP) producidas en planta."
      />

      <form onSubmit={onSubmit} className={styles.editorContainer}>
        {/* Cabecera Ergonómica (Flujo Causa -> Efecto) */}
        <div>
          <h2 className={styles.sectionTitle}>Cabecera de Receta</h2>
          <div className={styles.grid2}>
            {/* Columna 1: Causa Protagónica (Producto a fabricar y Nombre resultante) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className={styles.label}>PRODUCTO A FABRICAR *</label>
                <select 
                  className={styles.select} 
                  name="idProducto" 
                  value={formData.idProducto} 
                  onChange={onChange} 
                  required
                >
                  <option value="">Seleccione el producto a fabricar...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} ({p.presentacion?.nombre || 'A GRANEL'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.label}>NOMBRE TÉCNICO DE LA RECETA *</label>
                <input 
                  className={styles.input} 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={onChange} 
                  required 
                  placeholder="Ej: Fórmula Maestra - Yogur Tradicional Fresa 1L" 
                />
              </div>
            </div>

            {/* Columna 2: Efecto Operativo (Rendimiento Base y Unidad Bloqueada) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className={styles.label}>CANTIDAD RENDIMIENTO BASE *</label>
                  <input 
                    className={styles.input} 
                    type="number" 
                    step="0.01" 
                    min="0.01" 
                    name="rendimientoBase" 
                    value={formData.rendimientoBase} 
                    placeholder="Ej: 100" 
                    onChange={onChange} 
                    required 
                  />
                </div>
                <div>
                  <label className={styles.label}>UNIDAD DE MEDIDA</label>
                  <input 
                    className={styles.readOnlyInput} 
                    name="unidadRendimiento" 
                    value={formData.unidadRendimiento || 'Litros'} 
                    readOnly 
                    tabIndex={-1} 
                  />
                  <span style={{ fontSize: '0.72rem', color: '#78716C', fontStyle: 'italic', marginTop: '0.25rem', display: 'block' }}>
                    Definida por la presentación del producto
                  </span>
                </div>
              </div>
            </div>

            {/* Compactación de Observaciones Técnicas (Revelación Progresiva) */}
            <div style={{ gridColumn: '1 / -1', marginTop: '0.25rem' }}>
              {!showNotes ? (
                <button
                  type="button"
                  onClick={() => setShowNotes(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#78716C',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>📝 + Agregar notas u observaciones técnicas de planta</span>
                </button>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className={styles.label} style={{ margin: 0 }}>OBSERVACIONES TÉCNICAS O NOTAS DE PLANTA</label>
                    <button
                      type="button"
                      onClick={() => setShowNotes(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#78716C',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Ocultar campo
                    </button>
                  </div>
                  <input 
                    className={styles.input} 
                    name="observaciones" 
                    value={formData.observaciones || ''} 
                    onChange={onChange} 
                    placeholder="Notas operativas, especificaciones de textura, temperatura de envasado, etc. (Opcional)" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner Poka-Yoke: Bloqueo y orientación para productos comerciales sin base previa */}
        {isCommercialWithoutBulk && (
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1E40AF',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            fontSize: '0.85rem',
            lineHeight: '1.4'
          }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              ⚠️ <strong>Secuencia de Planta:</strong> Estás formulando un producto comercial envasado. Para una elaboración láctea estándar, debes registrar primero el producto base (ej. &apos;Base Blanca de Yogurt&apos; con presentación A GRANEL) antes de formular el producto envasado.
            </div>
            <Link
              href="/catalog/products"
              style={{
                backgroundColor: '#182622',
                color: '#FFFFFF',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                whiteSpace: 'nowrap'
              }}
            >
              + Registrar Producto A GRANEL
            </Link>
          </div>
        )}

        {/* Alerta Poka-Yoke de Empaque Obligatorio en Productos Comerciales */}
        {isMissingCommercialPackaging && (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FCD34D',
            color: '#92400E',
            padding: '0.6rem 0.85rem',
            borderRadius: '6px',
            fontSize: '0.76rem',
            marginBottom: '0.75rem',
            lineHeight: '1.4'
          }}>
            ⚠️ <strong>Atención de Planta:</strong> Este producto requiere al menos un insumo de empaque primario (vaso, botella o tapa) para poder guardarse y descontarse de bodega.
          </div>
        )}

        {/* Sección de Etapas de Producción */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <h2 className={styles.sectionTitle} style={{ border: 'none', margin: 0, padding: 0 }}>Etapas de Producción</h2>
            
            {/* Desduplicación de Botones: si hay 0 etapas solo se muestra '+ Agregar Etapa Manual' */}
            {activeStagesCount === 0 ? (
              <button
                type="button"
                onClick={handleAddNewStage}
                className={styles.addStageBtn}
              >
                + Agregar Etapa Manual
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('BASE_TANQUE')}
                  className={styles.templateBtn}
                  title="Cargar etapas estándar de preparación de base en tanque"
                >
                  🥛 Tanque
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('ENVASADO_COMERCIAL')}
                  className={styles.templateBtn}
                  title="Cargar etapas estándar de mezcla, dosificación y sellado"
                >
                  🍓 Envasado
                </button>
                <button
                  type="button"
                  onClick={handleAddNewStage}
                  className={styles.addStageBtn}
                  title="Inserta una nueva etapa arriba del listado"
                >
                  + Agregar Etapa
                </button>
                <button
                  type="button"
                  onClick={handleToggleSummarize}
                  className={styles.summarizeBtn}
                  title="Colapsa todas las etapas y activa la vista de Hoja de Ruta de Planta"
                >
                  📋 {showSummaryPanel ? 'Editar Etapas' : 'Hoja de Ruta de Planta'}
                </button>
              </div>
            )}
          </div>
          
          {/* Empty State Asistido exclusivo cuando NO hay etapas */}
          {activeStagesCount === 0 ? (
            <div className={styles.emptyStateCard}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.5rem' }}>📋</span>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#182622', margin: '0 0 0.25rem 0' }}>
                No hay etapas configuradas en esta receta
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#78716C', margin: '0 0 1rem 0' }}>
                Usa una de las plantillas rápidas de un solo clic para cargar los tiempos y temperaturas estándar de planta, o agrega una etapa manualmente.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => handleApplyTemplate('BASE_TANQUE')} className={styles.templateBtn}>
                  🥛 Cargar Etapas de Tanque (Pasteurización + Fermentación)
                </button>
                <button type="button" onClick={() => handleApplyTemplate('ENVASADO_COMERCIAL')} className={styles.templateBtn}>
                  🍓 Cargar Etapas de Envasado (Mezcla + Dosificación)
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Panel de Narrativa Continua: Hoja de Ruta Operativa de Planta */}
              {showSummaryPanel && (
                <div style={{
                  backgroundColor: '#F7F4EE',
                  border: '1px solid #CAD5B5',
                  borderRadius: '8px',
                  padding: '1.1rem 1.25rem',
                  marginBottom: '1rem',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>📜</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#182622' }}>
                        Hoja de Ruta Operativa de Planta
                      </h3>
                      <span style={{ fontSize: '0.74rem', color: '#78716C', fontStyle: 'italic' }}>
                        Protocolo paso a paso para la elaboración del lote en piso de producción
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {formData.etapas?.map((etapa, idx) => {
                      if (etapa.activo === false) return null;
                      const summary = generateStageSummaryText(etapa, supplies, products);
                      return (
                        <div 
                          key={idx} 
                          style={{ 
                            fontSize: '0.8rem', 
                            lineHeight: '1.45', 
                            color: '#182622',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E5DFD5',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '6px'
                          }}
                        >
                          <strong style={{ color: '#182622' }}>Paso {etapa.orden} ({etapa.nombre || 'Etapa sin nombre'}):</strong> {summary}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Acordeón Exclusivo: solo una etapa abierta en edición a la vez */}
              {formData.etapas?.map((etapa, eIdx) => {
                if (etapa.activo === false) return null;
                const isExpanded = expandedStageIndex === eIdx;
                const summaryText = generateStageSummaryText(etapa, supplies, products);

                // Si está colapsada: franja delgada (~45px) con badges y resumen
                if (!isExpanded) {
                  return (
                    <div 
                      key={eIdx} 
                      className={styles.collapsedStageRow}
                      onClick={() => {
                        setExpandedStageIndex(eIdx);
                        setShowSummaryPanel(false);
                      }}
                      title="Haz clic para desplegar y editar esta etapa"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#182622', whiteSpace: 'nowrap' }}>
                          Etapa {etapa.orden}: {etapa.nombre || 'Etapa sin nombre'}
                        </span>
                        
                        {/* Badges de Tiempo y Temperatura */}
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexShrink: 0 }}>
                          {Number(etapa.tiempoEstandarMin) > 0 && (
                            <span className={styles.collapsedBadge}>
                              ⏱️ {etapa.tiempoEstandarMin}m
                            </span>
                          )}
                          {(Number(etapa.tempMinimaGrados) > 0 || Number(etapa.tempMaximaGrados) > 0) && (
                            <span className={styles.collapsedBadge}>
                              🌡️ {etapa.tempMinimaGrados}°C - {etapa.tempMaximaGrados}°C
                            </span>
                          )}
                        </div>

                        {/* Síntesis textual de la etapa comprimida */}
                        <span style={{
                          fontSize: '0.74rem',
                          color: '#78716C',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginLeft: '0.25rem'
                        }}>
                          {summaryText}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                        {/* Botones de reordenamiento cronológico */}
                        {onMoveEtapa && (
                          <div style={{ display: 'inline-flex', gap: '0.2rem' }}>
                            <button
                              type="button"
                              disabled={eIdx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveEtapa(eIdx, 'UP');
                                if (expandedStageIndex === eIdx) setExpandedStageIndex(eIdx - 1);
                              }}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #D6D3D1',
                                color: '#182622',
                                padding: '0.2rem 0.45rem',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: eIdx === 0 ? 'not-allowed' : 'pointer',
                                opacity: eIdx === 0 ? 0.35 : 1
                              }}
                              title="Subir etapa (ejecutar antes)"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={eIdx === (formData.etapas?.length || 1) - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveEtapa(eIdx, 'DOWN');
                                if (expandedStageIndex === eIdx) setExpandedStageIndex(eIdx + 1);
                              }}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #D6D3D1',
                                color: '#182622',
                                padding: '0.2rem 0.45rem',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: eIdx === (formData.etapas?.length || 1) - 1 ? 'not-allowed' : 'pointer',
                                opacity: eIdx === (formData.etapas?.length || 1) - 1 ? 0.35 : 1
                              }}
                              title="Bajar etapa (ejecutar después)"
                            >
                              ▼
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedStageIndex(eIdx);
                            setShowSummaryPanel(false);
                          }}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #D6D3D1',
                            color: '#182622',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveEtapa(eIdx);
                          }}
                          style={{
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                          title="Eliminar etapa"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                }

                // Etapa Expandida: renderiza controles completos, BOM y cápsula
                return (
                  <div key={eIdx} className={styles.stageCard}>
                    <div className={styles.stageHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3>Etapa {etapa.orden}: {etapa.nombre || 'Nueva Etapa'}</h3>
                        <span style={{ fontSize: '0.7rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                          En Edición
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {/* Botones de reordenamiento cronológico en etapa abierta */}
                        {onMoveEtapa && (
                          <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                            <button
                              type="button"
                              disabled={eIdx === 0}
                              onClick={() => {
                                onMoveEtapa(eIdx, 'UP');
                                setExpandedStageIndex(eIdx - 1);
                              }}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #D6D3D1',
                                color: '#182622',
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: eIdx === 0 ? 'not-allowed' : 'pointer',
                                opacity: eIdx === 0 ? 0.35 : 1
                              }}
                              title="Subir etapa (ejecutar antes)"
                            >
                              ▲ Subir
                            </button>
                            <button
                              type="button"
                              disabled={eIdx === (formData.etapas?.length || 1) - 1}
                              onClick={() => {
                                onMoveEtapa(eIdx, 'DOWN');
                                setExpandedStageIndex(eIdx + 1);
                              }}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #D6D3D1',
                                color: '#182622',
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                cursor: eIdx === (formData.etapas?.length || 1) - 1 ? 'not-allowed' : 'pointer',
                                opacity: eIdx === (formData.etapas?.length || 1) - 1 ? 0.35 : 1
                              }}
                              title="Bajar etapa (ejecutar después)"
                            >
                              ▼ Bajar
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedStageIndex(-1)}
                          style={{
                            backgroundColor: '#F7F4EE',
                            border: '1px solid #D6D3D1',
                            color: '#182622',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                          title="Contraer esta etapa"
                        >
                          Plegar ▲
                        </button>
                        <button 
                          type="button" 
                          onClick={() => onRemoveEtapa(eIdx)}
                          style={{
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Eliminar Etapa
                        </button>
                      </div>
                    </div>
                    <div className={styles.grid3}>
                      <div>
                        <label className={styles.label}>Nombre Fase</label>
                        <input className={styles.input} value={etapa.nombre} onChange={e => onUpdateEtapa(eIdx, 'nombre', e.target.value)} required />
                      </div>
                      <div>
                        <label className={styles.label}>Tiempo Estándar (Min)</label>
                        <input 
                          className={styles.input} 
                          type="number" 
                          min="0" 
                          value={etapa.tiempoEstandarMin === 0 || etapa.tiempoEstandarMin === '0' ? '' : (etapa.tiempoEstandarMin ?? '')} 
                          onChange={e => onUpdateEtapa(eIdx, 'tiempoEstandarMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} 
                          placeholder="0"
                        />
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          color: '#182622',
                          backgroundColor: '#F7F4EE',
                          border: '1px solid #E5DFD5',
                          borderRadius: '4px',
                          padding: '0.15rem 0.45rem',
                          marginTop: '0.25rem',
                          width: 'fit-content'
                        }}
                        title="Equivalencia en horas y minutos"
                        >
                          ⏱️ {formatMinutesToDigitalClock(etapa.tiempoEstandarMin)}
                        </div>
                      </div>
                      <div>
                        <label className={styles.label}>T. Min / Max (Min)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <input 
                              className={styles.input} 
                              type="number" 
                              min="0" 
                              value={etapa.tiempoMinimoMin === 0 || etapa.tiempoMinimoMin === '0' ? '' : (etapa.tiempoMinimoMin ?? '')} 
                              onChange={e => onUpdateEtapa(eIdx, 'tiempoMinimoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} 
                              placeholder="Mín: 0"
                            />
                            <div 
                              style={{ 
                                backgroundColor: '#F7F4EE', 
                                border: '1px solid #E5DFD5', 
                                color: '#182622', 
                                fontSize: '0.68rem', 
                                fontWeight: 600, 
                                padding: '0.12rem 0.35rem', 
                                borderRadius: '4px',
                                marginTop: '0.25rem',
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              title="Equivalencia tiempo mínimo"
                            >
                              ⏱️ {formatMinutesToDigitalClock(etapa.tiempoMinimoMin)}
                            </div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <input 
                              className={styles.input} 
                              type="number" 
                              min="0" 
                              value={etapa.tiempoMaximoMin === 0 || etapa.tiempoMaximoMin === '0' ? '' : (etapa.tiempoMaximoMin ?? '')} 
                              onChange={e => onUpdateEtapa(eIdx, 'tiempoMaximoMin', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)} 
                              placeholder="Máx: 0"
                            />
                            <div 
                              style={{ 
                                backgroundColor: '#F7F4EE', 
                                border: '1px solid #E5DFD5', 
                                color: '#182622', 
                                fontSize: '0.68rem', 
                                fontWeight: 600, 
                                padding: '0.12rem 0.35rem', 
                                borderRadius: '4px',
                                marginTop: '0.25rem',
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              title="Equivalencia tiempo máximo"
                            >
                              ⏱️ {formatMinutesToDigitalClock(etapa.tiempoMaximoMin)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className={styles.label}>Temp. Mínima (°C)</label>
                        <input className={styles.input} type="number" step="0.1" value={etapa.tempMinimaGrados || 0} onChange={e => onUpdateEtapa(eIdx, 'tempMinimaGrados', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div>
                        <label className={styles.label}>Temp. Máxima (°C)</label>
                        <input className={styles.input} type="number" step="0.1" value={etapa.tempMaximaGrados || 0} onChange={e => onUpdateEtapa(eIdx, 'tempMaximaGrados', parseFloat(e.target.value) || 0)} />
                      </div>
                      <div>
                        <label className={styles.label}>Instrucciones</label>
                        <input className={styles.input} value={etapa.instrucciones || ''} onChange={e => onUpdateEtapa(eIdx, 'instrucciones', e.target.value)} />
                      </div>
                    </div>

                    <IngredientsFormSection 
                      etapa={etapa} 
                      etapaIndex={eIdx}
                      supplies={supplies}
                      products={products}
                      currentRecipeProductId={formData.idProducto}
                      onAdd={onAddDetalle}
                      onUpdate={onUpdateDetalle}
                      onRemove={onRemoveDetalle}
                    />

                    {/* Cápsula Reactiva de Retroalimentación Textual en Lenguaje de Planta */}
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.65rem 0.95rem',
                      backgroundColor: '#F7F4EE',
                      border: '1px solid #E5DFD5',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      boxSizing: 'border-box'
                    }}>
                      <span style={{ fontSize: '1rem', lineHeight: '1.2' }}>📋</span>
                      <div style={{ fontSize: '0.76rem', color: '#182622', lineHeight: '1.45' }}>
                        <strong style={{ color: '#182622', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                          Lectura de Operación en Planta:
                        </strong>
                        <div style={{ marginTop: '0.15rem' }}>
                          {summaryText}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Balance General de Materiales y Costos (Barra Horizontal Compacta) */}
        <div className={styles.balanceBar}>
          {/* Lado Izquierdo: Resumen de insumos y rendimiento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <strong style={{ fontSize: '0.9rem', color: '#182622', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Balance General de Materiales y Costos
            </strong>
            <div style={{ fontSize: '0.8rem', color: '#57534E', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span>
                <strong>Rendimiento:</strong> {formData.rendimientoBase || 0} {formData.unidadRendimiento || 'Litros'}
              </span>
              <span>•</span>
              <span>
                <strong>Composición:</strong> {totalMateriasPrimas} materias primas/empaques
                {totalBasesWip > 0 ? ` + ${totalBasesWip} bases WIP` : ''}
              </span>
              <span>•</span>
              <span>
                <strong>Etapas activas:</strong> {activeStagesCount}
              </span>
            </div>
          </div>

          {/* Lado Derecho: Valores destacados y Semáforo Financiero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#78716C', textTransform: 'uppercase', fontWeight: 600 }}>
                Costo Unitario Proyectado
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#182622' }}>
                {formatCurrency(costPerUnit)} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/ {formData.unidadRendimiento || 'Und'}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right', borderLeft: '1px solid #D6D3D1', paddingLeft: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#78716C', textTransform: 'uppercase', fontWeight: 600 }}>
                Costo Total Batch
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534' }}>
                {formatCurrency(totalCost)}
              </div>
            </div>

            {/* Semáforo Financiero Compacto */}
            {selectedProduct && (
              <div style={{ flexShrink: 0 }}>
                {isInternoOrBulk ? (
                  <span style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#1E40AF',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    ⚙️ Costo Interno
                  </span>
                ) : costoTopePermitido > 0 && costPerUnit <= costoTopePermitido ? (
                  <span style={{
                    backgroundColor: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    color: '#166534',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    🟢 Rentable (Tope: {formatCurrency(costoTopePermitido)})
                  </span>
                ) : costoTopePermitido > 0 && costPerUnit > costoTopePermitido ? (
                  <span style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#991B1B',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    🔴 Sobrecosto (+{formatCurrency(costPerUnit - costoTopePermitido)})
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Modal de Auditoría Técnica: Hoja de Ruta Operativa de Planta (SmartModal) */}
      {showSummaryModal && (
        <div 
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setShowSummaryModal(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="summary-modal-title"
        >
          <div className={styles.summaryModalCard}>
            {/* Header del Modal */}
            <div className={styles.summaryModalHeader}>
              <div>
                <h2 id="summary-modal-title" className={styles.summaryModalTitle}>
                  <span>📜</span> Hoja de Ruta Operativa de Planta
                </h2>
                <p className={styles.summaryModalSubtitle}>
                  Protocolo paso a paso para la elaboración del lote en piso de producción
                  {selectedProduct ? ` — ${selectedProduct.nombre} (${formData.rendimientoBase} ${formData.unidadRendimiento || 'Und'})` : ''}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowSummaryModal(false)}
                disabled={isSubmitting}
                className={styles.summaryModalCloseBtn}
                title="Cerrar y volver a edición"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo del Modal con Scroll Suave */}
            <div className={styles.summaryModalBody}>
              {/* Ficha Técnica de Cabecera */}
              <div className={styles.summaryTechHeaderCard}>
                <div>
                  <div className={styles.summaryTechFieldLabel}>Producto a Elaborar</div>
                  <div className={styles.summaryTechFieldValue}>
                    {selectedProduct?.nombre || 'No seleccionado'}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#78716C' }}>
                    {selectedProduct?.presentacion?.nombre || 'A GRANEL'}
                  </span>
                </div>

                <div>
                  <div className={styles.summaryTechFieldLabel}>Rendimiento Esperado</div>
                  <div className={styles.summaryTechFieldValue} style={{ color: '#166534' }}>
                    {formData.rendimientoBase || '0'} {formData.unidadRendimiento || 'Und'}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#78716C' }}>
                    Por lote de producción
                  </span>
                </div>

                <div>
                  <div className={styles.summaryTechFieldLabel}>Tiempo Acumulado Estimado</div>
                  <div className={styles.summaryTechFieldValue} style={{ color: '#182622' }}>
                    ⏱️ {formatMinutesToDigitalClock(totalProductionTimeMins)}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#78716C' }}>
                    {activeStagesCount} {activeStagesCount === 1 ? 'etapa activa' : 'etapas activas'}
                  </span>
                </div>
              </div>

              {/* Secuencia Narrativa Cronológica de Etapas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.76rem', color: '#78716C', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.025em' }}>
                  Secuencia Cronológica de Proceso (Paso a Paso)
                </div>

                {activeStagesCount === 0 ? (
                  <div style={{ 
                    backgroundColor: '#FEF2F2', 
                    border: '1px solid #FECACA', 
                    borderRadius: '8px', 
                    padding: '1rem', 
                    textAlign: 'center', 
                    color: '#991B1B', 
                    fontSize: '0.85rem' 
                  }}>
                    ⚠️ No hay etapas registradas en esta receta. Regrese al editor para añadir etapas.
                  </div>
                ) : (
                  activeStages.map((etapa, idx) => {
                    const narrative = generateStageSummaryText(etapa, supplies, products);
                    const tEst = Number(etapa.tiempoEstandarMin) || 0;
                    const tempMin = etapa.tempMinimaGrados !== '' && etapa.tempMinimaGrados !== null && etapa.tempMinimaGrados !== undefined ? Number(etapa.tempMinimaGrados) : null;
                    const tempMax = etapa.tempMaximaGrados !== '' && etapa.tempMaximaGrados !== null && etapa.tempMaximaGrados !== undefined ? Number(etapa.tempMaximaGrados) : null;

                    return (
                      <div key={idx} className={styles.summaryStageCard}>
                        <div className={styles.summaryStageHead}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className={styles.summaryStageStepBadge}>
                              Paso {etapa.orden || idx + 1}
                            </span>
                            <span className={styles.summaryStageTitle}>
                              {etapa.nombre || 'Etapa sin denominación'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                            {tEst > 0 && (
                              <span className={styles.collapsedBadge} style={{ backgroundColor: '#F7F4EE' }}>
                                ⏱️ {tEst}m
                              </span>
                            )}
                            {(tempMin !== null || tempMax !== null) && (
                              <span className={styles.collapsedBadge} style={{ backgroundColor: '#F7F4EE' }}>
                                🌡️ {tempMin ?? 0}°C - {tempMax ?? 0}°C
                              </span>
                            )}
                          </div>
                        </div>

                        <p className={styles.summaryStageText}>
                          {narrative}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Balance Resumido de Costos y Rentabilidad al pie del cuerpo */}
              <div className={styles.balanceBar} style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '1.25rem' }}>💰</div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#78716C', textTransform: 'uppercase', fontWeight: 700 }}>
                      Balance Económico Proyectado
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#57534E' }}>
                      Costeo dinámico basado en materias primas y bases WIP
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#78716C', textTransform: 'uppercase', fontWeight: 600 }}>
                      Costo Unitario
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#182622' }}>
                      {formatCurrency(costPerUnit)} <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>/ {formData.unidadRendimiento || 'Und'}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', borderLeft: '1px solid #D6D3D1', paddingLeft: '1.25rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#78716C', textTransform: 'uppercase', fontWeight: 600 }}>
                      Costo Total Lote
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#166534' }}>
                      {formatCurrency(totalCost)}
                    </div>
                  </div>

                  {/* Badge de Rentabilidad */}
                  {selectedProduct && (
                    <div style={{ flexShrink: 0 }}>
                      {isInternoOrBulk ? (
                        <span style={{
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          color: '#1E40AF',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          ⚙️ Costo Interno
                        </span>
                      ) : costoTopePermitido > 0 && costPerUnit <= costoTopePermitido ? (
                        <span style={{
                          backgroundColor: '#DCFCE7',
                          border: '1px solid #86EFAC',
                          color: '#166534',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          🟢 Rentable (Tope: {formatCurrency(costoTopePermitido)})
                        </span>
                      ) : costoTopePermitido > 0 && costPerUnit > costoTopePermitido ? (
                        <span style={{
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FECACA',
                          color: '#991B1B',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          🔴 Sobrecosto (+{formatCurrency(costPerUnit - costoTopePermitido)})
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pie de Acciones (Footer) */}
            <div className={styles.summaryModalFooter}>
              {/* Izquierda: Descartar Receta Completa */}
              <button 
                type="button" 
                onClick={handleDiscardCompleteRecipe}
                disabled={isSubmitting}
                className={styles.btnDiscardRecipe}
                title="Descarta la receta completa y sale del editor sin guardar"
              >
                <span>✕</span> Descartar Receta Completa
              </button>

              {/* Derecha: Corregir / Seguir Editando y Guardar y Publicar Receta */}
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={() => setShowSummaryModal(false)}
                  disabled={isSubmitting}
                  className={styles.btnContinueEditing}
                  title="Cerrar resumen y volver al formulario para realizar ajustes"
                >
                  <span>✏️</span> Corregir / Seguir Editando
                </button>

                <button 
                  type="button" 
                  onClick={handleConfirmPublish}
                  disabled={isSubmitting || !canSubmit}
                  className={styles.btnPublishRecipe}
                  title="Confirma y publica la receta en la base de datos"
                >
                  {isSubmitting ? (
                    <>Guardando...</>
                  ) : (
                    <><span>✓</span> Guardar y Publicar Receta</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

