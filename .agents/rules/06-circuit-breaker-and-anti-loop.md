# 06. PROTOCOLO CIRCUIT BREAKER Y PREVENCIÓN DE BUCLES (CIRCUIT BREAKER & ANTI-LOOP)

> **NOTA:** Este módulo establece las directrices operativas de corte de circuito, umbrales preventivos de modularización, aislamiento hermético de capas y prevención de bucles de rastreo recursivo en el agente de IA.

---

### 1. DISYUNTOR DE REINTENTOS DE LÍNEAS (MÁXIMO 2 INTENTOS)

* **Tope Estricto de Intentos:** Si un archivo excede los límites auditados por `verify-srp.js` (>120 líneas en `page.jsx`, >150 líneas en componentes o modales), la IA dispone de un **máximo de 2 intentos consecutivos de edición** para modularizarlo.
* **Prohibición de Micro-Ediciones en Bucle:** Queda terminantemente vetado realizar micro-ediciones consecutivas orientadas a comprimir sintaxis, remover comentarios explicativos, colapsar saltos de línea o forzar código apelmazado para "encajar" artificialmente en 149 líneas.
* **Disyunción Obligatoria y Solicitud de Clarificación:** Al fracasar el segundo intento, la IA DEBE DETENERSE inmediatamente, reportar el componente o vista conflictiva y proponer la extracción formal de un subcomponente atómico en un archivo independiente.

---

### 2. MARGEN PREVENTIVO DE SEGURIDAD (UMBRAL DE 135 LÍNEAS)

* **Zona Segura de Código:** Todo componente o modal funcional debe diseñarse para operar holgadamente en el rango de 70 a 130 líneas.
* **Disparador Preventivo a 135 Líneas:** Si durante una edición o implementación un componente o modal alcanza o supera las **135 líneas**, la directriz mandatoria e inmediata es extraer un subcomponente modular en `components/parts/` o en un componente hermano, en lugar de apurar el margen hasta las 150 líneas.
* **Páginas (`page.jsx`):** Si una página supera las **105 líneas**, se debe evaluar de inmediato la extracción de contenedores o tarjetas auxiliares para mantenerse siempre lejos del límite crítico de 120 líneas.

---

### 3. AISLAMIENTO HERMÉTICO DE FRONTERA (FRONTEND VS BACKEND)

* **Hermetismo de Alcance:** Cuando el alcance de una tarea esté asignado a `apps/web/`, queda terminantemente prohibido explorar, leer, listar, grepear o modificar archivos dentro de `apps/api/` (controladores, servicios, repositorios, modelos Prisma o migraciones).
* **Ausencia de Contratos o Endpoints:** Si la implementación de frontend requiere un endpoint, contrato, parámetro o mutación no documentada en el prompt o en los hooks existentes, la IA NO DEBE emprender expediciones exploratorias en el backend para descubrirlo. Debe plantear la consulta técnica directamente y esperar instrucciones.
* **Inversión de Alcance:** Si la tarea es de backend (`apps/api/`), rige la misma frontera hermética en sentido inverso: queda prohibido alterar archivos de `apps/web/`.

---

### 4. BLOQUEO DE RASTREO RECURSIVO DE HOOKS Y CONSUMO CIEGO

* **Prohibición de Exploración en Árbol Indefinida:** Queda prohibido encadenar lecturas sucesivas de hooks de utilidades, sub-hooks y archivos auxiliares profundos que no formen parte de la modificación directa.
* **Principio de Interfaz y Contrato:** El consumo de datos debe guiarse por la firma de entrada y salida del hook del módulo. No se requiere auditar la implementación interna de toda la cadena de dependencias para conectar una propiedad o componente.
* **Prevención de Agotamiento de Contexto:** Cada llamada a herramientas de lectura debe estar justificada por la necesidad inmediata de escribir o validar el componente objetivo. Si el contexto ya contiene la firma de los métodos o estados, se DEBE proceder a la ejecución sin más lecturas.
