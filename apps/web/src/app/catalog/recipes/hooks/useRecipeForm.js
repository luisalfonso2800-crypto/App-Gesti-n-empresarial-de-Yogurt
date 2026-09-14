/**
 * @file useRecipeForm.js
 * @module catalog/recipes/hooks
 * @description Estado y manejo del formulario/modal de recetas con sincronización reactiva, soporte dual Insumo/WIP y plantillas de etapas.
 * @responsibility Controlar la creación y edición de la receta técnica, gestionar etapas automáticas, detalles y costeo dinámico.
 * @usedBy apps/web/src/app/catalog/recipes/page.jsx
 * @dependencies @/lib/api-client
 */

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function useRecipeForm({ supplies = [], products = [], prices = [], onSaveSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    idProducto: '',
    rendimientoBase: '',
    unidadRendimiento: 'Litros',
    observaciones: '',
    activo: true,
    etapas: []
  });

  const handleOpenEditor = async (item) => {
    if (item) {
      try {
        const fullItem = await apiClient.get(`/recipes/${item.id}/bom`);
        // Asegurar que cada detalle preserve su idInsumo o idProductoIntermedio intacto
        setFormData({
          ...fullItem,
          rendimientoBase: fullItem.rendimientoBase ?? ''
        });
      } catch (err) {
        alert('Error al cargar la receta: ' + err.message);
        return;
      }
    } else {
      setFormData({
        nombre: '',
        idProducto: '',
        rendimientoBase: '',
        unidadRendimiento: 'Litros',
        observaciones: '',
        activo: true,
        etapas: []
      });
    }
    setIsEditing(true);
  };

  const handleCloseEditor = () => setIsEditing(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Sincronización reactiva del producto destino: sugiere nombre y ajusta unidad de rendimiento
    if (name === 'idProducto') {
      const selectedProd = products.find(p => String(p.id) === String(value));
      const isGranel = selectedProd ? (
        selectedProd.presentacion?.tipoEnvase === 'TANQUE_GRANEL' ||
        selectedProd.presentacion?.nombre?.toUpperCase().includes('GRANEL') ||
        ['BASES_LACTEAS', 'INSUMO_BASE_WIP', 'DULCES_JALEAS'].includes(selectedProd.categoria)
      ) : false;

      setFormData(prev => {
        const autoNombre = selectedProd ? `Fórmula - ${selectedProd.nombre}` : '';
        const shouldUpdateNombre = !prev.nombre || prev.nombre.startsWith('Fórmula - ');
        return {
          ...prev,
          idProducto: value,
          nombre: shouldUpdateNombre ? autoNombre : prev.nombre,
          unidadRendimiento: isGranel ? 'Litros' : 'Unidades'
        };
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : (name === 'rendimientoBase' && value === '')
          ? ''
          : type === 'number'
            ? (value === '' ? '' : parseFloat(value) || 0)
            : value
    }));
  };

  // Plantillas rápidas de etapas en 1 clic (Base en Tanque vs Envasado Comercial)
  const applyStageTemplate = (templateType) => {
    let templateEtapas = [];
    if (templateType === 'BASE_TANQUE') {
      templateEtapas = [
        {
          nombre: 'Pasteurización y Acondicionamiento',
          orden: 1,
          tempMinimaGrados: 85,
          tempMaximaGrados: 90,
          tiempoEstandarMin: 30,
          tiempoMinimoMin: 25,
          tiempoMaximoMin: 35,
          instrucciones: 'Calentamiento y homogenización de base láctea',
          activo: true,
          detalles: []
        },
        {
          nombre: 'Inoculación e Incubación',
          orden: 2,
          tempMinimaGrados: 42,
          tempMaximaGrados: 44,
          tiempoEstandarMin: 480,
          tiempoMinimoMin: 420,
          tiempoMaximoMin: 540,
          instrucciones: 'Sembrado de cultivo láctico y fermentación controlada',
          activo: true,
          detalles: []
        }
      ];
    } else if (templateType === 'ENVASADO_COMERCIAL') {
      templateEtapas = [
        {
          nombre: 'Mezcla y Saborizado',
          orden: 1,
          tiempoEstandarMin: 20,
          tiempoMinimoMin: 15,
          tiempoMaximoMin: 30,
          tempMinimaGrados: 4,
          tempMaximaGrados: 10,
          instrucciones: 'Adición de mermelada/fruta y estabilizantes en frío',
          activo: true,
          detalles: []
        },
        {
          nombre: 'Dosificación, Sellado y Rotulado',
          orden: 2,
          tiempoEstandarMin: 40,
          tiempoMinimoMin: 30,
          tiempoMaximoMin: 60,
          tempMinimaGrados: 4,
          tempMaximaGrados: 6,
          instrucciones: 'Envasado en recipientes primarios, termosellado y tapado',
          activo: true,
          detalles: []
        }
      ];
    }

    if (templateEtapas.length === 0) return;

    setFormData(prev => {
      const currentEtapas = prev.etapas || [];
      const startOrder = currentEtapas.length + 1;
      const mappedNewStages = templateEtapas.map((stg, idx) => ({
        ...stg,
        orden: startOrder + idx
      }));

      return {
        ...prev,
        etapas: [...currentEtapas, ...mappedNewStages]
      };
    });
  };

  const addEtapa = (templateType) => {
    if (templateType && typeof templateType === 'string') {
      applyStageTemplate(templateType);
      return;
    }

    setFormData(prev => {
      const nuevoOrden = (prev.etapas?.length || 0) + 1;
      const nuevaEtapa = {
        nombre: `Etapa ${nuevoOrden}`,
        orden: nuevoOrden,
        tiempoMinimoMin: '',
        tiempoEstandarMin: '',
        tiempoMaximoMin: '',
        tempMinimaGrados: '',
        tempMaximaGrados: '',
        instrucciones: '',
        activo: true,
        detalles: []
      };

      const updatedEtapas = [...(prev.etapas || []), nuevaEtapa];
      updatedEtapas.forEach((e, i) => { e.orden = i + 1; });

      return {
        ...prev,
        etapas: updatedEtapas
      };
    });
  };

  const updateEtapa = (index, field, value) => {
    const newEtapas = [...formData.etapas];
    newEtapas[index] = { ...newEtapas[index], [field]: value };
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const removeEtapa = (index) => {
    setFormData(prev => {
      const filtered = prev.etapas.filter((_, i) => i !== index);
      const reindexed = filtered.map((e, idx) => ({
        ...e,
        orden: idx + 1
      }));
      return {
        ...prev,
        etapas: reindexed
      };
    });
  };

  const moveStage = (index, direction) => {
    setFormData(prev => {
      const etapasCopy = [...(prev.etapas || [])];
      const targetIndex = direction === 'UP' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= etapasCopy.length) return prev;

      const temp = etapasCopy[index];
      etapasCopy[index] = etapasCopy[targetIndex];
      etapasCopy[targetIndex] = temp;

      // Re-mapear orden: idx + 1 en todo el arreglo
      const reindexed = etapasCopy.map((e, idx) => ({
        ...e,
        orden: idx + 1
      }));

      return {
        ...prev,
        etapas: reindexed
      };
    });
  };

  const addDetalle = (etapaIndex) => {
    const newEtapas = [...formData.etapas];
    newEtapas[etapaIndex].detalles.push({
      idInsumo: null,
      idProductoIntermedio: null,
      cantidadRequerida: '',
      unidad: '',
      mermaPorcentaje: 0,
      esOpcional: false,
      grupoVariante: 'NINGUNO',
      tipoInsumo: 'BASE',
      activo: true
    });
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const updateDetalle = (etapaIndex, detalleIndex, field, value) => {
    const newEtapas = [...formData.etapas];
    const currentDet = newEtapas[etapaIndex].detalles[detalleIndex];
    let det = { ...currentDet };

    if (field === 'resourceSelector') {
      // Manejar el selector agrupado con prefijo 'INS:' o 'PROD:'
      if (!value) {
        det.idInsumo = null;
        det.idProductoIntermedio = null;
        det.unidad = '';
      } else if (value.startsWith('INS:')) {
        const insumoId = value.replace('INS:', '');
        const ins = supplies.find(s => s.id === insumoId);
        det.idInsumo = insumoId;
        det.idProductoIntermedio = null;
        det.unidad = ins ? ins.unidadBase : 'Unidades';

        // Detección automática de insumos de empaque vs materias primas
        const cat = (ins?.categoria || '').toUpperCase();
        const subcat = (ins?.subcategoria || '').toUpperCase();
        const nom = (ins?.nombre || '').toUpperCase();
        const isPackaging = cat.includes('EMPAQUE') || subcat.includes('ENVASE') || subcat.includes('TAPA') || nom.includes('VASO') || nom.includes('BOTELLA') || nom.includes('TAPA') || nom.includes('CÚPULA') || nom.includes('CUPULA') || nom.includes('ETIQUETA');

        if (isPackaging) {
          det.tipoInsumo = 'EMPAQUE_BASE';
        } else if (det.tipoInsumo === 'INTERMEDIO_WIP' || det.tipoInsumo === 'EMPAQUE_BASE') {
          det.tipoInsumo = 'BASE';
        }
      } else if (value.startsWith('PROD:')) {
        const prodId = value.replace('PROD:', '');
        det.idProductoIntermedio = prodId;
        det.idInsumo = null;
        det.unidad = 'Litros';
        det.tipoInsumo = 'INTERMEDIO_WIP';
      }
    } else {
      det[field] = value;
    }

    newEtapas[etapaIndex].detalles[detalleIndex] = det;
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const removeDetalle = (etapaIndex, detalleIndex) => {
    const newEtapas = [...formData.etapas];
    newEtapas[etapaIndex].detalles.splice(detalleIndex, 1);
    setFormData(prev => ({ ...prev, etapas: newEtapas }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sanitizar el payload para asegurar que cada ingrediente viaje con idInsumo / idProductoIntermedio normalizados
      const sanitizedPayload = {
        ...formData,
        rendimientoBase: Number(formData.rendimientoBase) || 0,
        etapas: formData.etapas?.map(etapa => ({
          ...etapa,
          orden: Number(etapa.orden) || 1,
          tiempoMinimoMin: Number(etapa.tiempoMinimoMin) || 0,
          tiempoEstandarMin: Number(etapa.tiempoEstandarMin) || 0,
          tiempoMaximoMin: Number(etapa.tiempoMaximoMin) || 0,
          tempMinimaGrados: Number(etapa.tempMinimaGrados) || 0,
          tempMaximaGrados: Number(etapa.tempMaximaGrados) || 0,
          detalles: etapa.detalles?.map(det => ({
            ...det,
            idInsumo: det.idInsumo || null,
            idProductoIntermedio: det.idProductoIntermedio || null,
            cantidadRequerida: Number(det.cantidadRequerida) || 0,
            mermaPorcentaje: Number(det.mermaPorcentaje) || 0,
            esOpcional: Boolean(det.esOpcional),
            tipoInsumo: det.tipoInsumo || (det.idProductoIntermedio ? 'INTERMEDIO_WIP' : 'BASE')
          }))
        }))
      };

      if (formData.id) {
        await apiClient.patch(`/recipes/${formData.id}`, sanitizedPayload);
      } else {
        await apiClient.post('/recipes', sanitizedPayload);
      }
      handleCloseEditor();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };

  // Cálculo de costos dinámico con soporte dual: Insumos y Productos Intermedios / WIP
  const calculateCost = () => {
    let total = 0;
    // Mapa rápido de precios de insumos
    const priceMap = prices.reduce((acc, p) => ({ ...acc, [p.idInsumo]: p.costoUnidadBase }), {});

    formData.etapas?.forEach(etapa => {
      etapa.detalles?.forEach(det => {
        if (!det.esOpcional && det.activo !== false) {
          const req = parseFloat(det.cantidadRequerida) || 0;
          const merma = parseFloat(det.mermaPorcentaje) || 0;
          const totalReq = req * (1 + (merma / 100));

          let unitCost = 0;
          if (det.idProductoIntermedio) {
            // Resolver costo unitario para producto semielaborado (costoBase o costoPromedio del inventario)
            const prod = products.find(p => p.id === det.idProductoIntermedio);
            if (prod) {
              unitCost = Number(prod.costoBase ?? prod.inventario?.costoPromedio ?? prod.inventarioProducto?.costoPromedio ?? 0);
            }
          } else if (det.idInsumo) {
            // Resolver costo unitario para insumo desde precio proveedor o costoBase
            const insumoRecord = supplies.find(s => s.id === det.idInsumo);
            const priceFromMap = parseFloat(priceMap[det.idInsumo]);
            unitCost = !isNaN(priceFromMap) && priceFromMap > 0
              ? priceFromMap
              : Number(insumoRecord?.costoBase || 0);
          }

          total += (totalReq * unitCost);
        }
      });
    });

    return total;
  };

  return {
    isEditing,
    formData,
    handleOpenEditor,
    handleCloseEditor,
    handleChange,
    applyStageTemplate,
    addEtapa,
    updateEtapa,
    removeEtapa,
    moveStage,
    addDetalle,
    updateDetalle,
    removeDetalle,
    handleSubmit,
    calculateCost
  };
}
