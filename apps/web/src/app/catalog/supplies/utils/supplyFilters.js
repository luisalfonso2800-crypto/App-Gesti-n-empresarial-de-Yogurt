/**
 * @file supplyFilters.js
 * @module catalog/supplies/utils
 * @description Filtra la lista de insumos según criterios multidimensionales (SRP < 80 líneas).
 * @responsibility Evaluar coincidencia de búsqueda, categoría, stock, trazabilidad y estado activo.
 */
import { checkSupplyTraceability } from './supplyTraceability';

export function filterSupplies(items = [], filters = {}) {
  return items.filter((item) => {
    const code = item.codigo || item.code || (item.id ? item.id.substring(0, 8).toUpperCase() : '');
    const searchLower = (filters.search || '').toLowerCase().trim();

    if (searchLower) {
      const matchesSearch =
        (item.nombre || '').toLowerCase().includes(searchLower) ||
        code.toLowerCase().includes(searchLower) ||
        (item.marca || '').toLowerCase().includes(searchLower) ||
        (item.empaque || '').toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.category && item.categoria !== filters.category) {
      return false;
    }

    if (filters.activeStatus) {
      const wantsActive = filters.activeStatus === 'active';
      if (Boolean(item.activo) !== wantsActive) return false;
    }

    const { hasTraceability, stockActual } = checkSupplyTraceability(item);

    if (filters.traceability) {
      if (filters.traceability === 'with_traceability' && !hasTraceability) return false;
      if (filters.traceability === 'without_traceability' && hasTraceability) return false;
    }

    if (filters.stockStatus) {
      const stockMinimo = Number(item.stockMinimo || 0);
      if (filters.stockStatus === 'out_of_stock' && stockActual > 0) return false;
      if (filters.stockStatus === 'low_stock' && (stockActual <= 0 || stockActual > stockMinimo)) return false;
      if (filters.stockStatus === 'in_range' && stockActual <= stockMinimo) return false;
    }

    return true;
  });
}
