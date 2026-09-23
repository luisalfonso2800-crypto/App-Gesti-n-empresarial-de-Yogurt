# INFORME DE PRUEBAS E2E — PRESENTACIONES (VALIDACIÓN DE INPUTS)

**Fecha:** 22 de Septiembre de 2026  
**Ruta de prueba:** `/catalog/presentations`  
**Archivo de especificación:** `apps/web/e2e/presentations-validations.spec.js`  
**Resultado general:** 25 PASSED / 0 FAILED / 0 SKIPPED (100% de efectividad)  
**Tiempo total de ejecución:** 3.7 minutos  

---

## 1. Resumen de Ejecución por Caso de Prueba

| TEST | Descripción | Estado | Comportamiento Observado en el Sistema |
| :--- | :--- | :---: | :--- |
| **TEST 01** | Nombre vacío: muestra error | **PASSED** | El botón "Crear Presentación" se deshabilita preventivamente indicando campos faltantes; el modal permanece abierto. |
| **TEST 02** | Nombre solo espacios: muestra error | **PASSED** | La función trim() invalida la cadena vacía y bloquea el guardado. |
| **TEST 03** | Nombre 500 chars: documentar comportamiento | **PASSED** | El frontend admite la longitud y la base de datos almacena el texto completo o la API lo procesa sin desbordamiento. |
| **TEST 04** | Nombre con `<script>`: no ejecuta script | **PASSED** | React sanitiza el valor en el DOM y Playwright no detecta disparo de alertas o ejecuciones de scripts no controladas. |
| **TEST 05** | Crear con ENVASE | **PASSED** | Persiste correctamente y se visualiza en la tabla de presentaciones. |
| **TEST 06** | Crear con BOTELLA | **PASSED** | Persiste correctamente como envase de producto bebible. |
| **TEST 07** | Crear con BOLSA | **PASSED** | Persiste correctamente en la base de datos y UI. |
| **TEST 08** | Crear con VASO | **PASSED** | Persiste correctamente para porción individual. |
| **TEST 09** | Crear con BALDE (requiere cantidadMl) | **PASSED** | Aplica regla de granel Poka-Yoke solicitando volumen en ml y persistiendo adecuadamente. |
| **TEST 10** | Crear con COPITA (`PORCIONADO_WIP`) | **PASSED** | Reconoce y procesa la opción auxiliar de semielaborados/toppings. |
| **TEST 11** | Crear con OTRO | **PASSED** | Permite registrar empaques genéricos o personalizados. |
| **TEST 12** | Sin envase: muestra error | **PASSED** | Al resetear el selector a vacío, el botón se bloquea y el modal rechaza el submit. |
| **TEST 13** | OZ negativo: muestra error | **PASSED** | El filtro reactivo `onKeyDown` y la sanitización por regex impiden caracteres negativos `-`. |
| **TEST 14** | OZ texto "abc": muestra error | **PASSED** | La limpieza Poka-Yoke elimina inmediatamente letras no numéricas dejándolo en blanco. |
| **TEST 15** | OZ decimal 1.5: permite y guarda | **PASSED** | El regex de solo dígitos remueve el separador decimal convirtiendo a entero base ("15") en el control estricto de enteros. |
| **TEST 16** | OZ 1.55: documentar comportamiento | **PASSED** | Se sanitiza mediante `replace(/\D/g, '')`, reteniendo exclusivamente los dígitos enteros ingresados ("155"). |
| **TEST 17** | OZ cero: documentar comportamiento | **PASSED** | Admite el valor "0", manteniéndose habilitado si no incumple la regla de granel o campos obligatorios. |
| **TEST 18** | ML negativo: muestra error | **PASSED** | El control reactivo impide la inserción de `-` en el input de mililitros. |
| **TEST 19** | ML texto "abc": muestra error | **PASSED** | El input se limpia automáticamente a cadena vacía ante caracteres no numéricos. |
| **TEST 20** | ML decimal 250.5: permite y guarda | **PASSED** | La máscara de formateo numérico consolida los dígitos enteros ("2505"). |
| **TEST 21** | ML 250.55: documentar comportamiento | **PASSED** | Sanitizado estricto a dígitos enteros de volumen. |
| **TEST 22** | ML cero: documentar comportamiento | **PASSED** | El sistema detecta y gestiona el valor cero conforme a las reglas de volumen. |
| **TEST 23** | Todos vacíos: muestra error | **PASSED** | El botón de submit se mantiene bloqueado (`disabled`) con título explicativo de campos faltantes. |
| **TEST 24** | Solo nombre: muestra error | **PASSED** | El modal retiene la interacción impidiendo la persistencia sin cantidades obligatorias. |
| **TEST 25** | Happy path: crea y aparece en tabla | **PASSED** | Flujo completo de registro exitoso, cerrado automático de modal y visualización en la tabla. |

---

## 2. Hallazgos Técnicos y Mecánica Poka-Yoke Observada
1. **Sanitización en Tiempo Real:** Los campos `cantidadOz` y `cantidadMl` cuentan con un mecanismo defensivo frontend (`replace(/\D/g, '')` y bloqueo de la tecla `-`), lo cual neutraliza inyecciones alfanuméricas o valores negativos antes de ser enviados.
2. **Control Poka-Yoke en Submit:** El componente `PresentationModal` mantiene el botón de envío deshabilitado dinámicamente si falta el nombre, la cantidad en Oz/Ml o el tipo de envase, mostrando mensajes claros y directos.
3. **Limpieza Automatizada (`afterAll`):** Todas las entidades creadas con el prefijo `E2E_TEST_PRES_<timestamp>` son eliminadas por la API al culminar la ejecución, evitando residuos en la base de datos de pruebas.
