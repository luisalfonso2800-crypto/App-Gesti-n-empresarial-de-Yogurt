// SVG data URIs
const SVG_VASO_ESCOLAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FBF9F5"/><path d="M20,20 L80,20 L70,80 L30,80 Z" fill="none" stroke="%231C3F35" stroke-width="4"/><path d="M35,80 L40,30 M65,80 L60,30" fill="none" stroke="%23D97706" stroke-width="2"/><rect x="15" y="10" width="70" height="10" rx="3" fill="%23D97706"/></svg>`;
const SVG_BOTELLA_1L = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FBF9F5"/><path d="M35,15 L65,15 L65,25 L75,35 L75,90 L25,90 L25,35 L35,25 Z" fill="none" stroke="%231C3F35" stroke-width="4"/><rect x="30" y="45" width="40" height="25" fill="%23D97706" opacity="0.8"/></svg>`;
const SVG_VASO_GRIEGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FBF9F5"/><path d="M15,25 L85,25 L70,85 L30,85 Z" fill="none" stroke="%231C3F35" stroke-width="4"/><path d="M10,25 L90,25" fill="none" stroke="%23D97706" stroke-width="6"/></svg>`;
const SVG_FRASCO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FBF9F5"/><rect x="25" y="30" width="50" height="60" rx="10" fill="none" stroke="%231C3F35" stroke-width="4"/><rect x="20" y="15" width="60" height="15" rx="2" fill="%23D97706"/><circle cx="50" cy="60" r="15" fill="%23D97706" opacity="0.8"/></svg>`;
const SVG_TANQUE_MARMITA = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23FBF9F5"/><rect x="22" y="25" width="56" height="50" rx="8" fill="none" stroke="%231C3F35" stroke-width="4"/><path d="M22,45 L78,45" fill="none" stroke="%23D97706" stroke-width="3"/><path d="M50,15 L50,25 M38,15 L62,15" stroke="%231C3F35" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="58" r="7" fill="%23D97706" opacity="0.85"/><path d="M30,75 L25,90 M70,75 L75,90" stroke="%231C3F35" stroke-width="4" stroke-linecap="round"/></svg>`;

export const PRESETS = [
  { id: 'PRESET_VASO_3_5', name: 'Vaso Escolar 3.5oz', url: SVG_VASO_ESCOLAR },
  { id: 'PRESET_BOTELLA_1L', name: 'Botella 1 Litro', url: SVG_BOTELLA_1L },
  { id: 'PRESET_VASO_500G', name: 'Vaso Griego 500g', url: SVG_VASO_GRIEGO },
  { id: 'PRESET_FRASCO_VIDRIO', name: 'Frasco Vidrio 250g', url: SVG_FRASCO },
  { id: 'PRESET_TANQUE_GRANEL', name: 'Tanque / Marmita Industrial (Granel)', url: SVG_TANQUE_MARMITA }
];

export function resolveProductImage(producto) {
  if (producto?.imagenUrl) return producto.imagenUrl;
  if (producto?.presentacion?.imagenUrl) return producto.presentacion.imagenUrl;
  
  // Fallbacks if no URL is provided but we can guess by name
  const name = (producto?.nombre || '').toLowerCase();
  if (name.includes('escolar')) return SVG_VASO_ESCOLAR;
  if (name.includes('1l') || name.includes('1 litro')) return SVG_BOTELLA_1L;
  if (name.includes('griego') || name.includes('500g')) return SVG_VASO_GRIEGO;
  
  return SVG_BOTELLA_1L;
}
