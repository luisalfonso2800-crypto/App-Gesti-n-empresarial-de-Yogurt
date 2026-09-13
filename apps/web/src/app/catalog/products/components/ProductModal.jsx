/**
 * @file ProductModal.jsx
 * @module catalog/products/components
 * @description Modal de administración de atributos del producto (CSS Modules + Summary).
 * @responsibility Formulario para los valores comerciales del producto con validación Poka-Yoke.
 * @usedBy apps/web/src/app/catalog/products/page.jsx
 * @dependencies SmartModal, SmartSelect, CurrencySmartInput, StrictNumberInput
 */
import React, { useRef, useEffect } from 'react';
import SmartModal, { SubmitButton } from '@/components/ui/SmartModal';
import SmartSelect from '@/components/ui/inputs/SmartSelect';
import { cleanCurrency, formatCurrency } from '@/lib/formatters';
import { PRESETS } from '@/lib/presetImages';
import styles from '@/components/ui/SmartModal.module.css';
import { montoATextoPesos } from '@/utils/numberToWords';

// Categorías exclusivas para bases líquidas/semielaboradas en planta
const CATEGORIAS_WIP = [
  { id: 'BASES_LACTEAS', label: 'Bases Lácteas (Yogur base blanco, leche cultivada en tanque)' },
  { id: 'DULCES_JALEAS', label: 'Dulces y Jaleas (Fruta cocida, jaleas en marmita)' },
  { id: 'INSUMO_BASE_WIP', label: 'Otras Premezclas de Planta (Jarabes, estabilizantes, no lácteos)' }
];

// Textos didácticos Poka-Yoke de orientación de planta según categoría WIP
const HINTS_CATEGORIA_WIP = {
  BASES_LACTEAS: {
    icon: '🥛',
    text: 'Yogur natural base, leche fermentada o base para yogur griego antes de filtrar o saborizar. Se almacena por litros en tanques o cavas.'
  },
  DULCES_JALEAS: {
    icon: '🍓',
    text: 'Preparados artesanales de fruta (fresa, mora, melocotón, maracuyá) cocinados en paila o marmita para mezclar o fondear el yogur.'
  },
  INSUMO_BASE_WIP: {
    icon: '⚙️',
    text: 'Premezclas líquidas intermedias que no sean leche ni dulce (ej. jarabes invertidos, mezclas de féculas o neutros).'
  }
};

// Categorías exclusivas para productos envasados de venta comercial
const CATEGORIAS_COMERCIALES = [
  { id: 'LACTEOS', label: 'Lácteos Terminados (Comercial)' },
  { id: 'POSTRES', label: 'Postres y Otros' },
  { id: 'BEBIDAS', label: 'Bebidas' }
];

// Opciones de canales de venta con etiquetas de planta sin ambigüedad
const CANALES_VENTA = [
  { id: 'USO_INTERNO', label: 'Solo Planta / Transformación (Uso interno)' },
  { id: 'MIXTO', label: 'Mixto (Base de Planta + Venta Directa)' },
  { id: 'B2B', label: 'Tiendas y Mayoristas (B2B)' },
  { id: 'B2C', label: 'Mostrador y Cliente Final (B2C)' },
  { id: 'AMBOS', label: 'Comercial Completo (Mayoristas + Mostrador)' }
];

// Micro-textos didácticos Poka-Yoke de impacto según Canal de Venta seleccionado
const HINTS_CANAL_VENTA = {
  USO_INTERNO: {
    icon: '🏭',
    text: 'Exclusivo para consumo interno de planta. No genera precio al público y se utiliza como ingrediente en las recetas de producción.'
  },
  MIXTO: {
    icon: '🔄',
    text: 'Doble propósito: sirve como base para elaborar otros productos en planta y también permite despachos o venta directa a granel.'
  },
  B2B: {
    icon: '🏬',
    text: 'Orientado a despachos por volumen para tiendas, distribuidores o clientes mayoristas.'
  },
  B2C: {
    icon: '🛒',
    text: 'Orientado a venta unitaria directa al consumidor final en punto de venta o mostrador.'
  },
  AMBOS: {
    icon: '🌐',
    text: 'Habilitado tanto para pedidos mayoristas (B2B) como para venta directa en mostrador (B2C).'
  }
};

export function ProductModal({ 
  isOpen, onClose, editingItem, formData, handleChange, handleSubmit, 
  presentations = [], isSubmitting, errorMsg, isBaseIntermedia = false 
}) {
  const fileInputRef = useRef(null);

  // Identificar si la presentación seleccionada es A GRANEL
  const selectedPres = presentations.find(p => String(p.id) === String(formData.idPresentacion));
  const isGranel = selectedPres?.tipoEnvase === 'TANQUE_GRANEL' || selectedPres?.nombre?.toUpperCase().includes('GRANEL');

  // Determinar catálogo de categorías según tipo de presentación (WIP vs Comercial)
  const availableCategories = isGranel ? CATEGORIAS_WIP : CATEGORIAS_COMERCIALES;

  // Adaptación reactiva al seleccionar presentación: sincronizar categoría, canal y campos según corresponda
  useEffect(() => {
    if (!isOpen) return;

    if (isGranel) {
      if (!formData.categoria || ['LACTEOS', 'POSTRES', 'BEBIDAS'].includes(formData.categoria)) {
        handleChange({ target: { name: 'categoria', value: 'INSUMO_BASE_WIP' } });
      }
      if (formData.canalVenta !== 'USO_INTERNO' && formData.canalVenta !== 'MIXTO') {
        handleChange({ target: { name: 'canalVenta', value: 'USO_INTERNO' } });
      }
      if (formData.precioVenta !== 0 && formData.precioVenta !== '0') {
        handleChange({ target: { name: 'precioVenta', value: 0 } });
      }
      if (formData.margenObjetivo !== 0 && formData.margenObjetivo !== '0') {
        handleChange({ target: { name: 'margenObjetivo', value: 0 } });
      }
    } else {
      // Si la presentación es comercial y la categoría quedó en una de WIP, reajustar a comercial por defecto
      if (!formData.categoria || ['INSUMO_BASE_WIP', 'BASES_LACTEAS', 'DULCES_JALEAS'].includes(formData.categoria)) {
        handleChange({ target: { name: 'categoria', value: 'LACTEOS' } });
      }
      if (formData.canalVenta === 'USO_INTERNO') {
        handleChange({ target: { name: 'canalVenta', value: 'AMBOS' } });
      }
    }
  }, [isGranel, isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['nombre', 'descripcion', 'observaciones'].includes(name)) {
      handleChange({ target: { name, value: value.toUpperCase() } });
    } else {
      handleChange(e);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FBF9F5';
        ctx.fillRect(0, 0, 400, 400);

        const scale = Math.min(400 / img.width, 400 / img.height);
        const x = (400 / 2) - (img.width / 2) * scale;
        const y = (400 / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        handleChange({ target: { name: 'imagenUrl', value: dataUrl } });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const isDirty = !!formData.nombre || !!formData.idPresentacion;

  const onSubmit = (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    const pc = isGranel ? 0 : cleanCurrency(formData.precioVenta);
    const mO = isGranel ? 0 : Number(formData.margenObjetivo);
    const { presentacion, ...restFormData } = formData;
    handleSubmit(e, {
      ...restFormData,
      idPresentacion: String(formData.idPresentacion || presentacion?.id || ''),
      nombre: (formData.nombre || '').trim().toUpperCase(),
      descripcion: (formData.descripcion || '').trim().toUpperCase(),
      observaciones: (formData.observaciones || '').trim().toUpperCase(),
      canalVenta: isGranel ? (formData.canalVenta || 'USO_INTERNO') : formData.canalVenta,
      precioVenta: pc,
      margenObjetivo: mO
    });
  };

  const getPresentationName = () => {
    if (!formData.idPresentacion) return 'desconocida';
    const pres = presentations.find(p => String(p.id) === String(formData.idPresentacion));
    return pres ? pres.nombre : 'desconocida';
  };

  const missingFields = [];
  if (!formData.nombre?.trim()) missingFields.push('Nombre');
  if (!formData.idPresentacion) missingFields.push('Presentación');
  if (!formData.categoria) missingFields.push('Categoría');
  if (!formData.canalVenta) missingFields.push('Canal de venta');
  if (!formData.descripcion?.trim()) missingFields.push('Descripción');
  if (!isGranel) {
    if (!formData.precioVenta && formData.precioVenta !== 0) missingFields.push('Precio de venta');
    if (formData.margenObjetivo === '' || formData.margenObjetivo === null || formData.margenObjetivo === undefined) missingFields.push('Margen objetivo');
  }

  const isSubmitDisabled = missingFields.length > 0 || isSubmitting;
  const submitTitle = missingFields.length > 0
    ? `Complete los campos obligatorios: ${missingFields.join(', ')}`
    : '';

  // Cálculo reactivo de costo máximo y ganancia según margen objetivo
  const precioVentaNum = Number(String(formData.precioVenta || '').replace(/\D/g, '')) || 0;
  const margenObjetivoNum = Number(formData.margenObjetivo) || 0;

  const costoMaximoPermitido = precioVentaNum > 0 && margenObjetivoNum > 0
    ? Math.round(precioVentaNum * (1 - (margenObjetivoNum / 100)))
    : 0;

  const gananciaEsperada = precioVentaNum > 0 && margenObjetivoNum > 0
    ? precioVentaNum - costoMaximoPermitido
    : 0;

  return (
    <SmartModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingItem ? 'Editar Producto' : 'Nuevo Producto'}
      isDirty={isDirty}
      isSubmitting={isSubmitting}
    >
      {errorMsg && (
        <div style={{
          marginBottom: '1rem',
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#B91C1C',
          padding: '0.6rem 0.85rem',
          borderRadius: '6px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className={styles.twoColumns}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre <span style={{color: '#e11d48'}}>*</span></label>
            <input 
              name="nombre" 
              value={formData.nombre ?? ''} 
              onChange={handleInputChange} 
              placeholder="Ej: YOGURT FRESA"
              className={styles.input} 
              style={{ textTransform: 'uppercase' }}
              required 
            />
          </div>
          
          <div>
            <SmartSelect
              label="Presentación"
              name="idPresentacion"
              value={formData.idPresentacion ?? ''}
              onChange={handleChange}
              options={presentations.map(p => ({ id: p.id, label: p.nombre }))}
              required
              placeholder="Seleccione presentación"
            />
          </div>

          {/* TARJETA INFORMATIVA UNIFICADA A ANCHO COMPLETO (WIP / A GRANEL) */}
          {isGranel && (
            <div style={{
              gridColumn: '1 / -1',
              width: '100%',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '0.65rem 0.95rem',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{isBaseIntermedia ? '🥛' : '💡'}</span>
              <div style={{ fontSize: '0.76rem', color: '#1E40AF', lineHeight: '1.35' }}>
                <strong>{isBaseIntermedia ? 'Paso Clave: Crear Producto Base (A Granel):' : 'Producto Semielaborado / Base en Tanque:'}</strong>{' '}
                {isBaseIntermedia
                  ? "Registra aquí la base láctea (ej. 'Base Blanca de Yogurt' o 'Jalea Frutos Rojos') que se elaborará en tanque o marmita. Este producto semielaborado quedará en inventario a granel y servirá como insumo para preparar todos los yogures y postres terminados de la planta."
                  : "Este producto se formulará y fabricará a granel (litros/kilos) en tanque o marmita. Una vez producido, su stock quedará disponible automáticamente como ingrediente base para elaborar los yogures, jaleas y postres comerciales de la planta."}
              </div>
            </div>
          )}
        </div>

        <div className={styles.twoColumns}>
          <div>
            <SmartSelect
              label="Categoría"
              name="categoria"
              value={formData.categoria ?? ''}
              onChange={handleChange}
              options={availableCategories}
              required
              placeholder="Seleccione categoría"
            />
            {isGranel && HINTS_CATEGORIA_WIP[formData.categoria] && (
              <div style={{
                width: '100%',
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                marginTop: '0.45rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.45rem',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>
                  {HINTS_CATEGORIA_WIP[formData.categoria].icon}
                </span>
                <span style={{ fontSize: '0.73rem', color: '#334155', lineHeight: '1.35' }}>
                  <strong>Aplica para:</strong> {HINTS_CATEGORIA_WIP[formData.categoria].text}
                </span>
              </div>
            )}
          </div>
          <div>
            <SmartSelect
              label="Canal de Venta"
              name="canalVenta"
              value={formData.canalVenta ?? ''}
              onChange={handleChange}
              options={CANALES_VENTA}
              required
              placeholder="Seleccione destino del producto..."
            />
            {formData.canalVenta && HINTS_CANAL_VENTA[formData.canalVenta] && (
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#334155',
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                marginTop: '0.35rem',
                lineHeight: '1.3',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.4rem'
              }}>
                <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{HINTS_CANAL_VENTA[formData.canalVenta].icon}</span>
                <span>{HINTS_CANAL_VENTA[formData.canalVenta].text}</span>
              </div>
            )}
          </div>

          {/* Micro-texto explicativo de Semielaborado (WIP) a ancho completo */}
          {(isGranel || ['INSUMO_BASE_WIP', 'BASES_LACTEAS', 'DULCES_JALEAS'].includes(formData.categoria)) && (
            <div style={{
              gridColumn: '1 / -1',
              color: '#475569',
              fontSize: '0.74rem',
              lineHeight: '1.35',
              fontStyle: 'italic',
              marginTop: '0.15rem'
            }}>
              💡 <strong>¿Qué es un Semielaborado (WIP - Work in Process)?</strong> Es un producto intermedio elaborado dentro de la planta (ej. Base Blanca de yogur, jalea casera de frutos) que no se comercializa de forma directa al público, sino que se almacena temporalmente a granel (litros/kilos) para ser consumido como materia prima en las recetas de envasado final.
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Imagen del Producto (URL o Preset)</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem', alignItems: 'center' }}>
            {PRESETS.map(preset => (
              <img 
                key={preset.id} 
                src={preset.url} 
                alt={preset.name}
                title={preset.name}
                onClick={() => handleChange({ target: { name: 'imagenUrl', value: preset.url } })}
                style={{ 
                  width: '40px', height: '40px', cursor: 'pointer', borderRadius: '4px', border: formData.imagenUrl === preset.url ? '2px solid #1C3F35' : '1px solid #ccc' 
                }}
              />
            ))}
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#F7F4EE', border: '1px solid #D97706', borderRadius: '4px', cursor: 'pointer', color: '#1C3F35', fontWeight: '500' }}
            >
              📁 Subir Imagen desde el Equipo
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              name="imagenUrl" 
              value={formData.imagenUrl ?? ''} 
              onChange={handleChange} 
              placeholder="https://... o clic en preset/subir"
              className={styles.input} 
              style={{ flex: 1 }}
            />
            {formData.imagenUrl && (
              <img src={formData.imagenUrl} alt="Preview" style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#FBF9F5', border: '2px solid #D97706' }} />
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Descripción <span style={{color: '#e11d48'}}>*</span></label>
          <input 
            name="descripcion" 
            value={formData.descripcion ?? ''} 
            onChange={handleInputChange} 
            className={styles.input} 
            style={{ textTransform: 'uppercase' }}
            required 
          />
        </div>

        {/* RENDERIZADO CONDICIONAL SEGÚN PRESENTACIÓN (WIP/A GRANEL vs COMERCIAL) */}
        {isGranel ? (
          /* Tarjeta de Costeo Operativo de Planta para Productos a Granel / Semielaborados */
          <div style={{
            gridColumn: '1 / -1',
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            marginTop: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#0F172A', fontWeight: '700', fontSize: '0.8rem' }}>
              <span>🏭</span> Base Láctea en Tanque (Para Consumo Interno)
            </div>
            <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.75rem', color: '#475569', lineHeight: '1.4' }}>
              Este producto se almacena por litros en marmita/cava y no tiene precio de venta al público porque no está envasado. Su costo se liquidará automáticamente según la leche y los fermentos que consuma la orden de fabricación.
            </p>
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '6px',
              padding: '0.6rem 0.85rem',
              fontSize: '0.73rem',
              color: '#1E40AF',
              lineHeight: '1.4'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>
                💡 ¿También comercializas este yogur natural al cliente final?
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.15rem' }}>
                <li style={{ marginBottom: '0.2rem' }}>
                  Guarda primero este registro a granel para acumular los litros de base elaborados en planta.
                </li>
                <li>
                  Luego crea otro producto llamado por ejemplo <em>&quot;Yogurt Natural 1 Litro&quot;</em> con su respectiva presentación en botella, donde sí podrás fijar el precio de venta.
                </li>
              </ol>
            </div>
          </div>
        ) : (
          /* Fila y Tarjeta de Proyección Financiera para Productos Terminados Comerciales */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.85rem' }}>
            {/* Columna Izquierda: Precio de Venta */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Precio de Venta ($) <span style={{color: '#e11d48'}}>*</span></label>
              <input
                name="precioVenta"
                type="text"
                inputMode="numeric"
                min="0"
                placeholder="0"
                value={formData.precioVenta ? String(formData.precioVenta).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  handleChange({ target: { name: 'precioVenta', value: raw } });
                }}
                onKeyDown={(e) => {
                  if (e.key === '-') e.preventDefault();
                }}
                className={styles.input}
                required
              />
              {Boolean(formData.precioVenta && parseInt(String(formData.precioVenta).replace(/\D/g, ''), 10) > 0) && (
                <span style={{ fontSize: '0.75rem', color: '#065F46', marginTop: '0.25rem', display: 'block', fontWeight: '600' }}>
                  ✦ {montoATextoPesos(parseInt(String(formData.precioVenta).replace(/\D/g, ''), 10))}
                </span>
              )}
            </div>

            {/* Columna Derecha: Margen Objetivo */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Margen Objetivo (%) <span style={{color: '#e11d48'}}>*</span></label>
              <input 
                type="number"
                step="5"
                min="0"
                max="100"
                name="margenObjetivo" 
                value={formData.margenObjetivo ?? ''} 
                onChange={handleChange} 
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const current = Number(formData.margenObjetivo) || 0;
                    const next = Math.min(100, Math.floor(current / 5) * 5 + 5);
                    handleChange({ target: { name: 'margenObjetivo', value: next } });
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const current = Number(formData.margenObjetivo) || 0;
                    const next = Math.max(0, Math.ceil(current / 5) * 5 - 5);
                    handleChange({ target: { name: 'margenObjetivo', value: next } });
                  }
                }}
                placeholder="Ej: 30"
                className={styles.input} 
                required 
              />
            </div>

            {/* TARJETA DE PROYECCIÓN FINANCIERA (ANCHO COMPLETO) */}
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginTop: '0.25rem'
            }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: '1.35', marginBottom: precioVentaNum > 0 ? '0.65rem' : '0' }}>
                💡 <strong>Margen Objetivo:</strong> Ganancia bruta esperada sobre la venta. El costo total de receta (ingredientes + envase) no debe superar el tope admisible para garantizar la utilidad del negocio.
              </div>

              {Boolean(precioVentaNum > 0) && (
                <div style={{
                  backgroundColor: margenObjetivoNum > 0 ? '#F0FDF4' : '#FFFBEB',
                  border: `1px solid ${margenObjetivoNum > 0 ? '#BBF7D0' : '#FDE68A'}`,
                  borderRadius: '6px',
                  padding: '0.55rem 0.85rem'
                }}>
                  {/* Tira Métrica de 3 Valores */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', marginBottom: '0.45rem' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Precio Venta</span>
                      <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>$ {precioVentaNum.toLocaleString('es-CO')}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Costo Máx. Receta</span>
                      <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>$ {costoMaximoPermitido.toLocaleString('es-CO')}</strong>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.66rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Ganancia Esperada</span>
                      <strong style={{ fontSize: '0.88rem', color: margenObjetivoNum > 0 ? '#166534' : '#B45309' }}>
                        $ {gananciaEsperada.toLocaleString('es-CO')} ({margenObjetivoNum}%)
                      </strong>
                    </div>
                  </div>

                  {/* Resumen explicativo dinámico */}
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    color: margenObjetivoNum > 0 ? '#166534' : '#B45309',
                    borderTop: `1px solid ${margenObjetivoNum > 0 ? '#DCFCE7' : '#FEF3C7'}`,
                    paddingTop: '0.35rem',
                    textAlign: 'center'
                  }}>
                    {margenObjetivoNum > 0 ? (
                      `✦ Para un valor de venta de $ ${precioVentaNum.toLocaleString('es-CO')}, se espera que el costo sea máx. $ ${costoMaximoPermitido.toLocaleString('es-CO')} para una ganancia de $ ${gananciaEsperada.toLocaleString('es-CO')}/und.`
                    ) : (
                      `⚠️ Con margen de 0%, se espera que el costo sea de $ ${precioVentaNum.toLocaleString('es-CO')} y la ganancia sea de $ 0 (venta al costo exacto de producción).`
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.inputGroup}>
          <label className={styles.label}>Observaciones</label>
          <input 
            name="observaciones" 
            value={formData.observaciones ?? ''} 
            onChange={handleInputChange} 
            className={styles.input} 
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}>
          <input 
            type="checkbox" 
            name="activo" 
            checked={formData.activo} 
            onChange={handleChange}
          />
          <span style={{ fontSize: '0.875rem', color: '#1c1917' }}>Producto Activo</span>
        </label>

        {formData.nombre && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', fontSize: '0.76rem', color: '#166534' }}>
            <strong>Resumen:</strong> Se {editingItem ? 'actualizará' : 'creará'} el producto <strong>{formData.nombre}</strong>{formData.idPresentacion ? <> (en presentación <strong>{getPresentationName()}</strong>)</> : null}{formData.canalVenta ? <>, destinado al canal <strong>{formData.canalVenta}</strong></> : null}{precioVentaNum > 0 ? <>, con precio sugerido de <strong>{formatCurrency(formData.precioVenta)}</strong></> : null}.
          </div>
        )}

        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={onClose}
            className={styles.btnCancel}
          >
            Cancelar
          </button>
          <SubmitButton 
            isSubmitting={isSubmitting} 
            text="Guardar Producto"
            disabled={isSubmitDisabled}
            title={submitTitle}
            style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          />
        </div>
      </form>
    </SmartModal>
  );
}
