TAREA:
Incorporar la regla mandatoria de confirmaciones textuales y ayudas en lenguaje natural (Poka-Yoke) en el archivo de reglas del proyecto (AGENTS.md)

OBJETIVO:
Actualizar el archivo de directrices globales (`AGENTS.md` o el archivo normativo raíz de reglas) para estandarizar de forma obligatoria que todo formulario, modal o tabla del sistema incluya confirmaciones contextuales en tiempo real y en lenguaje natural legible para el operador, eliminando ambigüedades operativas en dinero, stock, empaques y documentos.

FUENTE DE VERDAD:
- `AGENTS.md` (o archivo de reglas operativas raíz del proyecto)

REGLA DE CONSULTA:
Lee únicamente el archivo de reglas principal (`AGENTS.md`). No explores código fuente de backend ni componentes frontend.

ALCANCE:

LEER:
- `AGENTS.md`

CREAR:
- ningún archivo.

MODIFICAR:
- `AGENTS.md`

NO MODIFICAR:
- ningún archivo en `apps/api/` ni `apps/web/`.
- ningún archivo `.css`, `.json` ni `.prisma`.

INSTRUCCIONES:

1. Ubica en `AGENTS.md` la sección de directrices de UI/UX, diseño MANNÁ o reglas de formularios y modales.
2. Agrega o expande la sección bajo el título:
   `### Regla Mandatoria de Confirmaciones Textuales y Ayuda al Operador (Poka-Yoke MANNÁ)`
3. Estipula explícitamente los siguientes 5 pilares obligatorios para cualquier modal, pantalla o vista de captura:

   a) **Conversión de Dinero a Letras:**
      - Todo campo monetario (costo base, precio venta, flete, subtotal, total) debe proyectar en tiempo real su equivalencia en palabras mediante `montoATextoPesos` (ej. `✦ Treinta y siete mil ochenta pesos`).
      - Nunca iniciar campos numéricos con `0` clavado; usar `placeholder="0"` y cadena vacía.

   b) **Stock Mínimo y Umbrales Técnicos:**
      - Debajo del input de stock mínimo debe existir siempre un texto en cursiva que pluralice la unidad y mencione nombre y marca:
        *"El stock mínimo de [NOMBRE] [de la marca MARCA] es de [CANTIDAD CON MILES] [UNIDADES/GRAMOS/LITROS/ONZAS]."*

   c) **Cálculo de Empaque y Contenido (Compras/Ingresos):**
      - Desglose aritmético visible junto o debajo del ingreso neto:
        `([CANTIDAD] [EMPAQUES] × [CONTENIDO] [UNIDAD])` (ej. `12 bolsas × 900 ml = 10.800 ml`).
      - Cápsula resumen en lenguaje natural al pie de la fila explicando la transacción en palabras humanas antes de guardar.

   d) **Puntuación Numérica y Documentos:**
      - Cantidades técnicas y stock: separador de miles con punto (`10.800 ml`).
      - Cédulas: puntos de miles (`1.020.345.678`).
      - NIT (DIAN): puntos de miles, guion y Dígito de Verificación (`900.123.456-7`).
      - Teléfonos/Celulares: continuos o con espacios, nunca con puntuación monetaria ni puntos de miles.

   e) **Catálogo Fijo de Unidades y Empaques:**
      - Unidades soportadas sin excepción: `kg`, `g`, `L`, `ml`, `oz`, `und`.
      - Empaques estandarizados: `UNIDAD`, `ENVASE`, `BOLSA`, `CAJA`, `BULTO`, `BOTELLA`, `BIDÓN`, `CANASTILLA`, `OTRO`.

NO HACER:
- No borrar ni sobreescribir las reglas arquitectónicas ni operativas previas de `AGENTS.md`.
- No alterar la configuración de Git ni ejecutar `git checkout`.
- No crear archivos temporales (`temp*.md`, `patch*.txt`).

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- `AGENTS.md` contiene la sección completa y detallada de confirmaciones textuales y reglas de datos.
- El documento mantiene formato Markdown limpio y coherente con el resto del archivo.

VERIFICACIÓN:
Comprueba la correcta redacción y estructura visual en Markdown del archivo modificado.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Archivo modificado:
- Sección añadida:
- Estado: