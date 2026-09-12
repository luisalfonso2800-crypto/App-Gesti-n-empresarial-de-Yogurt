# CREACIÓN DEL MÓDULO GLOBAL NUMBERTOWORDS.JS Y CORRECCIÓN DE RECURSIÓN ('UNDEFINED MILLONES')

DIAGNÓSTICO:
Al ingresar cifras que superan los cientos de millones o alcanzan miles de millones (ej. $2.500.055.555), las funciones locales de conversión lanzan "undefined millones" debido al desbordamiento en el índice del arreglo de centenas y la falta de recursión por ternas. Esta utilidad debe ser global y reutilizable en todos los módulos de compras, ventas y tesorería.

REGLAS DE MÁXIMO AHORRO DE CUOTA:
- Crea el archivo reutilizable en `apps/web/src/utils/numberToWords.js`.
- Modifica `apps/web/src/app/operations/purchases/new/page.jsx` para importar y consumir la utilidad global, purgando cualquier helper local duplicado.
- CERO scripts temporales (`patch*.js`, `fix*.js`) ni subcarpetas temporales.
- Edición atómica y directa.

---

### 1. CREAR UTILITARIO GLOBAL: `apps/web/src/utils/numberToWords.js`

Crea el archivo con soporte recursivo para miles, millones, miles de millones y billones (escala larga hispana):

```javascript
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

  let texto = (CENTENAS[c] ? CENTENAS[c] + ' ' : '');

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
 * Convierte cualquier entero a texto de forma recursiva sin límite de miles de millones.
 */
export function numeroATexto(num) {
  const n = typeof num === 'string' ? Math.floor(Number(num.replace(/\D/g, ''))) : Math.floor(Number(num) || 0);

  if (isNaN(n) || n === 0) return 'cero';
  if (n < 0) return 'menos ' + numeroATexto(Math.abs(n));

  // Billones (10^12)
  if (n >= 1_000_000_000_000) {
    const billones = Math.floor(n / 1_000_000_000_000);
    const resto = n % 1_000_000_000_000;
    const sufijo = billones === 1 ? 'un billón' : `${numeroATexto(billones)} billones`;
    return resto > 0 ? `${sufijo} ${numeroATexto(resto)}` : sufijo;
  }

  // Millones y Miles de Millones (10^6 a 10^11)
  if (n >= 1_000_000) {
    const millones = Math.floor(n / 1_000_000);
    const resto = n % 1_000_000;
    const sufijo = millones === 1 ? 'un millón' : `${numeroATexto(millones)} millones`;
    return resto > 0 ? `${sufijo} ${numeroATexto(resto)}` : sufijo;
  }

  // Miles
  if (n >= 1_000) {
    const miles = Math.floor(n / 1_000);
    const resto = n % 1_000;
    const sufijo = miles === 1 ? 'mil' : `${numeroATexto(miles)} mil`;
    return resto > 0 ? `${sufijo} ${numeroATexto(resto)}` : sufijo;
  }

  return leerCentenas(n);
}

/**
 * Formatea un valor monetario a texto en pesos (ej. 25000 -> "Veinticinco mil pesos").
 */
export function montoATextoPesos(monto) {
  if (monto === null || monto === undefined || monto === '') return '';
  
  const limpio = typeof monto === 'string' ? monto.replace(/\./g, '').replace(/,/g, '.') : monto;
  const num = Math.floor(Number(limpio) || 0);

  if (isNaN(num) || num <= 0) return '';

  const texto = numeroATexto(num);
  return (texto.charAt(0).toUpperCase() + texto.slice(1) + ' pesos').trim();
}