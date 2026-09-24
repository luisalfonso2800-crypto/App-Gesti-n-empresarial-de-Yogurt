/**
 * @file headerModuleTitles.js
 * @module components/shell/parts
 * @description Diccionario y resolución de títulos formales de página para el Header global ERP.
 * @responsibility Mapear rutas base de mayor a menor especificidad para proyectar el título en Header.
 * @usedBy apps/web/src/components/shell/Header.jsx
 */

export function getModuleInfo(pathname = '') {
  if (pathname.startsWith('/operations/purchases/new')) {
    return {
      title: 'Nueva Compra Directa',
      subtitle: 'Ingreso rápido de compras sin checklist previo'
    };
  }
  if (pathname.startsWith('/operations/purchases')) {
    return {
      title: 'Compras',
      subtitle: 'Registro y control de órdenes de adquisición y consolidación de listas'
    };
  }
  if (pathname.startsWith('/operations/inventory')) {
    return {
      title: 'Bitácora de Inventario',
      subtitle: 'Control maestro de almacén y cava. Valorización en tiempo real'
    };
  }
  if (pathname.startsWith('/operations/production')) {
    return {
      title: 'Producción',
      subtitle: 'Planificación y registro de órdenes de fabricación ejecutadas'
    };
  }
  if (pathname.startsWith('/operations/lots')) {
    return {
      title: 'Trazabilidad de Lotes',
      subtitle: 'Monitoreo de caducidad, linaje generacional y existencias FEFO'
    };
  }
  if (pathname.startsWith('/catalog/supplies')) {
    return {
      title: 'Insumos',
      subtitle: 'Catálogo maestro de materias primas, envases y suministros'
    };
  }
  if (pathname.startsWith('/catalog/products')) {
    return {
      title: 'Productos',
      subtitle: 'Catálogo de productos terminados listos para distribución comercial'
    };
  }
  if (pathname.startsWith('/catalog/presentations')) {
    return {
      title: 'Presentaciones',
      subtitle: 'Formatos comerciales y tamaños de empaque final'
    };
  }
  if (pathname.startsWith('/catalog/recipes')) {
    return {
      title: 'Recetas Técnicas',
      subtitle: 'Fórmulas estándar de elaboración con BOM y Etapas'
    };
  }
  if (pathname.startsWith('/catalog/supplier-prices')) {
    return {
      title: 'Precios de Proveedores',
      subtitle: 'Listas maestras de cotización y costos pactados'
    };
  }
  if (pathname.startsWith('/catalog/providers') || pathname.startsWith('/catalog/suppliers')) {
    return {
      title: 'Proveedores',
      subtitle: 'Directorio de fabricantes y distribuidores autorizados'
    };
  }
  if (pathname.startsWith('/commercial/sales')) {
    return {
      title: 'Ventas',
      subtitle: 'Facturación, pedidos y despachos de productos terminados a clientes'
    };
  }
  if (pathname.startsWith('/commercial/clients')) {
    return {
      title: 'Clientes',
      subtitle: 'Directorio comercial de clientes y puntos de distribución'
    };
  }
  if (pathname.startsWith('/commercial/payments')) {
    return {
      title: 'Pagos y Cobros',
      subtitle: 'Gestión y control de cuentas por cobrar y tesorería'
    };
  }
  if (pathname.startsWith('/commercial/expenses')) {
    return {
      title: 'Gastos Operativos',
      subtitle: 'Control y liquidación de costos y egresos del negocio'
    };
  }
  if (pathname.startsWith('/commercial/goals')) {
    return {
      title: 'Rumbo MANNÁ',
      subtitle: 'Metas tangibles, sueños familiares y ritmo de cosecha en tiempo real'
    };
  }
  if (pathname.startsWith('/dashboard')) {
    return {
      title: 'Centro de Comando SCADA',
      subtitle: 'Monitoreo operativo de planta y telemetría en tiempo real'
    };
  }
  return {
    title: 'MANNÁ ERP',
    subtitle: 'Gestión Empresarial y Operaciones de Planta'
  };
}

export function getModuleTitle(pathname = '') {
  return getModuleInfo(pathname).title;
}

