# 08. MANUAL CORPORATIVO DE DISEÑO RESPONSIVO (MAN-UI-002)

> **Documento:** MAN-UI-002  
> **Versión:** 1.0  
> **Fecha:** Septiembre 2026  
> **Autor:** Luis Alfonso Guerrero — AI-Assisted Product Builder  
> **Clasificación:** Documentación Técnica Interna  
> **Aplicable a:** Todo el ecosistema MANNÁ (Web, Desktop, Reportes, Componentes)  
> **Referencia Cruzada:** Vinculado con [`.agents/rules/03-frontend-architecture.md`](file:///.agents/rules/03-frontend-architecture.md) (Reglas 4, 6, 6.2) y [`.agents/rules/04-design-system-manna.md`](file:///.agents/rules/04-design-system-manna.md) (Reglas 16, 35, 36).

---

## 📑 TABLA DE CONTENIDO

1. [Objetivo del Manual](#1-objetivo-del-manual)
2. [Alcance y Aplicabilidad](#2-alcance-y-aplicabilidad)
3. [Definiciones y Terminología](#3-definiciones-y-terminología)
4. [Regla 1: Filosofía Mobile First](#4-regla-1-filosofía-mobile-first)
5. [Regla 2: Breakpoints Oficiales](#5-regla-2-breakpoints-oficiales)
6. [Regla 3: Unidades de Medida](#6-regla-3-unidades-de-medida)
7. [Regla 4: Meta Viewport](#7-regla-4-meta-viewport)
8. [Regla 5: Grid y Layouts](#8-regla-5-grid-y-layouts)
9. [Regla 6: Tipografía Escalable](#9-regla-6-tipografía-escalable)
10. [Regla 7: Componentes Críticos](#10-regla-7-componentes-críticos)
11. [Regla 8: Área Táctil y Accesibilidad](#11-regla-8-área-táctil-y-accesibilidad)
12. [Regla 9: Performance Responsivo](#12-regla-9-performance-responsivo)
13. [Regla 10: Verificación y QA](#13-regla-10-verificación-y-qa)
14. [Anexos Técnicos](#14-anexos)
15. [Aprobación y Control de Cambios](#15-aprobación-y-control-de-cambios)

---

## 1. OBJETIVO DEL MANUAL

### 1.1 Propósito
Establecer las reglas obligatorias de diseño responsivo para todo el ecosistema del ERP Industrial MANNÁ. Este documento garantiza consistencia visual, funcional y de accesibilidad en todos los dispositivos donde se ejecuta el sistema.

### 1.2 Justificación de Negocio
El ERP MANNÁ opera en tres entornos críticos de planta y distribución:
1. **Planta de producción:** Operarios con tablets rugerizadas en piso de planta (registro de batch, control de mermas y silos).
2. **Oficina administrativa:** Contadores y directores en monitores de escritorio (facturación, kárdex y compras).
3. **Móvil (reparto):** Preventistas y despachadores con celulares en campo (rutas, ventas y cobranza directa).

Sin un diseño responsivo consistente, el sistema pierde operatividad en cualquiera de los tres entornos.

### 1.3 Principio Rector
> *"El sistema debe ser 100% funcional en cualquier dispositivo donde se ejecute, sin sacrificar usabilidad, legibilidad ni rendimiento."*

---

## 2. ALCANCE Y APLICABILIDAD

### 2.1 Módulos Afectados
Este manual aplica obligatoriamente a:

| Módulo | Tipo | Dispositivos prioritarios |
| :--- | :--- | :--- |
| **Centro de Mando (SCADA)** | Web / Desktop | Desktop grande, Tablet horizontal |
| **Diseñador de Fórmulas (BOM)** | Web / Desktop | Desktop estándar, Tablet |
| **Piso de Planta y Lotes** | Web / Desktop | Tablet, Desktop |
| **Abastecimiento y Kárdex** | Web | Desktop, Laptop |
| **Ventas y Cartera** | Web / Desktop / Móvil | Móvil (reparto), Desktop |
| **Rumbo MANNÁ** | Web | Desktop |
| **Login / Auth** | Todos | Todos |

### 2.2 Componentes Transversales
- Sidebar / Navegación principal
- Modales y diálogos (`SmartModal`)
- Tablas de datos transaccionales
- Formularios y cuadrículas de entrada
- Notificaciones y toasts
- Canvas interactivos / Gráficas de telemetría (SCADA)

### 2.3 Excepciones
Ninguna. Este manual es de cumplimiento obligatorio para todo el desarrollo frontend del ERP. Las excepciones deben documentarse en un ADR (Architecture Decision Record) aprobado por el Tech Lead.

---

## 3. DEFINICIONES Y TERMINOLOGÍA

| Término | Definición |
| :--- | :--- |
| **Breakpoint** | Punto de quiebre de ancho de pantalla donde cambia la disposición o flujo del layout. |
| **Mobile First** | Enfoque de diseño y codificación CSS que comienza por el móvil y escala mediante `min-width` hacia pantallas mayores. |
| **Viewport** | Área visible de la ventana del navegador. |
| **DPR (Device Pixel Ratio)** | Relación entre píxeles físicos del dispositivo y píxeles CSS independientes. |
| **Responsive** | Capacidad de adaptarse fluidamente a cualquier tamaño de pantalla. |
| **Adaptive** | Diseño con layouts predefinidos por dispositivo (menos flexible). |
| **Fluid** | Layout que escala continuamente mediante funciones matemáticas (`clamp()`, `%`, `fr`) sin saltos abruptos. |
| **Container Query** | Breakpoint basado en el tamaño relativo del contenedor padre (`@container`), no del viewport global. |
| **dvh / dvw** | *Dynamic Viewport Height / Width*: unidades que descuentan automáticamente las barras del navegador móvil. |

---

## 4. REGLA 1: FILOSOFÍA MOBILE FIRST

### 4.1 Declaración de la Regla
> **REGLA 1:** Todo componente CSS debe escribirse comenzando por el estado de móvil pequeño (320px-375px) y escalarse mediante `@media (min-width: ...)` hacia pantallas mayores.

### 4.2 Justificación Técnica
- El 62% del tráfico web global es móvil (StatCounter).
- Los repartidores de MANNÁ usan celulares como herramienta principal de preventa y cobro.
- CSS `min-width` es acumulativo y más predecible que `max-width`.
- Mobile First optimiza los Core Web Vitals (especialmente LCP y CLS en móvil).

### 4.3 Implementación Correcta
```css
/* ✅ CORRECTO - Mobile First */
.componente {
  /* Estilos base: móvil */
  font-size: 1rem;
  padding: 0.5rem;
}

@media (min-width: 768px) {
  .componente {
    padding: 0.75rem;
  }
}

@media (min-width: 1280px) {
  .componente {
    padding: 1rem;
  }
}
```

### 4.4 Implementación Prohibida
```css
/* ❌ PROHIBIDO - Desktop First */
.componente {
  font-size: 1.25rem;
  padding: 1rem;
}

@media (max-width: 1280px) { /* Sobrescribiendo hacia abajo */ }
@media (max-width: 768px) { /* Caos de especificidad */ }
```

### 4.5 Excepción Controlada
Si un componente se concibió con renderizado exclusivo de instrumentación desktop (ej. Canvas SCADA multipanel), se permite Desktop First con aprobación documentada en el ADR del módulo.

---

## 5. REGLA 2: BREAKPOINTS OFICIALES

### 5.1 Declaración de la Regla
> **REGLA 2:** Solo se permiten los 6 breakpoints oficiales definidos en este manual. Queda terminantemente prohibido inventar breakpoints ad-hoc (ej. 992px, 1200px, 1400px).

### 5.2 Tabla Oficial de Breakpoints

| Código | Ancho | Nombre | Dispositivo de Referencia | Uso Operativo |
| :---: | :--- | :--- | :--- | :--- |
| **XS** | 0-374px | Móvil ultra-pequeño | iPhone SE (1ª gen) | Fallback / Legacy |
| **SM** | 375-767px | Móvil estándar | iPhone 14, Galaxy S23 | **Base del diseño (sin media query)** |
| **MD** | 768-1023px | Tablet vertical | iPad Mini, iPad 10" | Planta de producción (piso de planta) |
| **LG** | 1024-1279px | Tablet horizontal / Laptop compacta | iPad Pro, MacBook Air 13" | Supervisión de planta / Administración |
| **XL** | 1280-1535px | Desktop estándar | Monitores 24", Laptops 15" | Oficina contable y despacho comercial |
| **2XL** | 1536-1919px | Desktop grande | Monitores 27", iMac | Gerencia y Centro de Mando |
| **3XL** | 1920px+ | 4K / Ultra-wide | Monitores 4K, pantallas industriales | SCADA y Dashboards tácticos de pared |

### 5.3 Implementación CSS Canónica
```css
/* Base: XS + SM (0-767px) - Estilos raíz sin media query */

/* MD: Tablet vertical (Planta) */
@media (min-width: 768px) { }

/* LG: Tablet horizontal / Laptop compacta */
@media (min-width: 1024px) { }

/* XL: Desktop estándar */
@media (min-width: 1280px) { }

/* 2XL: Desktop grande */
@media (min-width: 1536px) { }

/* 3XL: 4K / Ultra-wide */
@media (min-width: 1920px) { }
```

---

## 6. REGLA 3: UNIDADES DE MEDIDA

### 6.1 Declaración de la Regla
> **REGLA 3:** Toda unidad de medida debe seleccionarse según la tabla oficial. Queda prohibido el uso arbitrario de `px` para tipografías y espaciados principales.

### 6.2 Tabla Oficial de Unidades

| Elemento | Unidad Oficial | Ejemplo Recomendado | Prohibido |
| :--- | :--- | :--- | :--- |
| **Tipografía** | `rem` o `clamp()` | `font-size: 1rem;` | `font-size: 16px;` |
| **Padding** | `rem` o `clamp()` | `padding: 1rem;` | `padding: 16px;` |
| **Margin** | `rem` o `clamp()` | `margin: 0.5rem;` | `margin: 8px;` |
| **Ancho de layout** | `%`, `fr`, `vw` | `width: 100%;` | `width: 800px;` |
| **Alto de viewport** | `dvh` (móvil moderno) | `min-height: 100dvh;` | `height: 100vh;` |
| **Bordes** | `px` | `border: 1px solid;` | `border: 0.0625rem;` |
| **Sombras** | `px` o `rem` | `box-shadow: 0 2px 8px;` | — |
| **Iconos pequeños** | `px` | `width: 16px; height: 16px;` | — |
| **Gaps en grid** | `rem` o `clamp()` | `gap: 1rem;` | `gap: 16px;` |

---

## 7. REGLA 4: META VIEWPORT

### 7.1 Declaración de la Regla
> **REGLA 4:** Todo documento HTML debe incluir el meta viewport obligatorio. Su omisión o restricción de zoom se considera un bug crítico de accesibilidad.

### 7.2 Configuración Oficial en Next.js 15 App Router
En `apps/web/src/app/layout.jsx`:
```javascript
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0, // Garantiza accesibilidad y zoom para operarios
};
```
❌ **PROHIBICIÓN ESTRICTA:** Prohibido usar `user-scalable=no` o `maximum-scale=1.0` (viola estándares WCAG 2.1 AA).

---

## 8. REGLA 5: GRID Y LAYOUTS

### 8.1 Declaración de la Regla
> **REGLA 5:** Todo layout debe construirse con CSS Grid o Flexbox. Queda prohibido el uso de `float`, `position: absolute` para layouts estructurales o frameworks CSS externos no aprobados.

### 8.2 Patrón de Cuadrícula Adaptativa Oficial
```css
.gridModulo {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(0.5rem, 1.2vw, 1.25rem);
  padding: clamp(0.5rem, 2vw, 1.5rem);
}

@media (min-width: 768px) {
  .gridModulo {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .gridModulo {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 9. REGLA 6: TIPOGRAFÍA ESCALABLE

### 9.1 Declaración de la Regla
> **REGLA 6:** La tipografía debe escalar fluidamente. En dispositivos móviles, el tamaño de fuente para campos de entrada e interactivos nunca debe ser inferior a 16px (`1rem`) para prevenir el molesto auto-zoom de Safari en iOS.

---

## 10. REGLA 7: COMPONENTES CRÍTICOS

### 10.1 Tablas de Datos Transaccionales
- **Comportamiento:** En pantallas menores a `1024px`, las tablas deben estar contenidas dentro de un envoltorio con `overflow-x: auto` y `-webkit-overflow-scrolling: touch;`. Nunca romper el viewport hacia los lados.

### 10.2 Modales Poka-Yoke (`SmartModal`)
- **Móvil (SM):** Modal tipo *Bottom Sheet* o pantalla completa (`inset: 0`, fijado al fondo, bordes superiores redondeados y scroll vertical independiente).
- **Tablet / Desktop (MD+):** Modal centrado flotante con overlay oscuro, ancho máximo controlado (`600px` - `900px`) y altura máxima `85dvh`.

### 10.3 Lienzos y Gráficas SCADA
- **Comportamiento:** Los canvas interactivos deben ajustar dinámicamente su resolución interna al `window.devicePixelRatio` del dispositivo para evitar pixelado en pantallas Retina/OLED de tablets.

---

## 11. REGLA 8: ÁREA TÁCTIL Y ACCESIBILIDAD

### 11.1 Declaración de la Regla
> **REGLA 8:** Todo elemento interactivo (botones, inputs, enlaces, chips) debe cumplir con los estándares **WCAG 2.1 AA** con un área táctil mínima de **44×44px** en móvil y tablet.

```css
.btnTouchTarget {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

---

## 12. REGLA 9: PERFORMANCE RESPONSIVO

### 12.1 Declaración de la Regla
> **REGLA 9:** Los recursos pesados, imágenes y módulos analíticos complejos deben cargarse de forma diferida (`next/dynamic`) y optimizada según el factor de forma del dispositivo.

---

## 13. REGLA 10: VERIFICACIÓN Y QA

### 13.1 Declaración de la Regla
> **REGLA 10:** Todo cambio que afecte la interfaz debe validarse en los 4 escenarios críticos:
1. Móvil (375px) — Preventa y despacho.
2. Tablet (768px / 1024px) — Piso de planta.
3. Desktop (1280px / 1440px) — Gestión contable.
4. Cumplimiento de línea límite SRP (`node .agents/scripts/verify-srp.js`).

---

## 14. ANEXOS

### Anexo A: Hoja de Estilos Base Canónica
El archivo base de utilidades responsivas del ecosistema se encuentra centralizado en:
👉 [`apps/web/src/styles/responsive.css`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/styles/responsive.css)

---

## 15. APROBACIÓN Y CONTROL DE CAMBIOS

| Versión | Fecha | Autor | Cambios Realizados |
| :---: | :---: | :---: | :--- |
| **1.0** | Septiembre 2026 | Luis Alfonso Guerrero | Emisión inicial oficial del estándar responsivo MAN-UI-002. |

---
*Fin del Manual Corporativo de Diseño Responsivo MAN-UI-002.*
