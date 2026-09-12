/**
 * @file numberToWords.js
 * @module utils/numberToWords
 * @description Utilidad global para convertir números a texto en español (pesos colombianos).
 * @responsibility Transformar montos numéricos (incluyendo miles de millones) a texto sin errores de desbordamiento.
 * @usedBy apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
 * @dependencies Ninguna
 */

const UNIDADES = [
  '', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
  'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés',
  'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
];

const DECENAS = [
  '', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
];

const CENTENAS = [
  '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
  'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
];

function leerCentenas(n) {
  if (n === 0) return '';
  if (n === 100) return 'cien';

  const c = Math.floor(n / 100);
  const r = n % 100;

  let texto = CENTENAS[c] ? CENTENAS[c] + ' ' : '';

  if (r > 0) {
    if (r < 30) {
      texto += UNIDADES[r];
    } else {
      const d = Math.floor(r / 10);
      const u = r % 10;
      texto += DECENAS[d] + (u > 0 ? ' y ' + UNIDADES[u] : '');
    }
  }

  return texto.trim();
}

/**
 * Convierte cualquier número entero positivo a texto en español recursivamente.
 * Soporta miles, millones, miles de millones y billones.
 */
export function numeroATexto(num) {
  const n = typeof num === 'string' ? Math.floor(Number(num.replace(/\D/g, ''))) : Math.floor(num);

  if (isNaN(n) || n === 0) return 'cero';

  if (n >= 1000000000000) {
    const billones = Math.floor(n / 1000000000000);
    const resto = n % 1000000000000;
    const sufijo = billones === 1 ? 'un billón' : `${numeroATexto(billones)} billones`;
    return resto > 0 ? `${sufijo} ${numeroATexto(resto)}` : sufijo;
  }

  if (n >= 1000000) {
    const millones = Math.floor(n / 1000000);
    const resto = n % 1000000;
    const sufijo = millones === 1 ? 'un millón' : `${numeroATexto(millones)} millones`;
    return resto > 0 ? `${sufijo} ${numeroATexto(resto)}` : sufijo;
  }

  if (n >= 1000) {
    const miles = Math.floor(n / 1000);
    const resto = n % 1000;
    const sufijo = miles === 1 ? 'mil' : `${numeroATexto(miles)} mil`;
    return resto > 0 ? `${sufijo} ${numeroATexto(resto)}` : sufijo;
  }

  return leerCentenas(n);
}

/**
 * Formatea a moneda en letras (ej: "dos mil quinientos millones ... pesos")
 */
export function montoATextoPesos(monto) {
  const limpio = typeof monto === 'string' ? monto.replace(/\./g, '').replace(/,/g, '.') : monto;
  const num = Number(limpio);

  if (isNaN(num) || num <= 0) return 'Cero pesos';

  const texto = numeroATexto(Math.floor(num));
  const capitalizado = texto.charAt(0).toUpperCase() + texto.slice(1);

  return `${capitalizado} pesos`;
}
