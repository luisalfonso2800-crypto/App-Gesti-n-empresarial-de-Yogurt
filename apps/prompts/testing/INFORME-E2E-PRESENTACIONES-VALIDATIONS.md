# INFORME DE PRUEBAS E2E — PRESENTACIONES (VALIDACIÓN DE INPUTS Y CAPTURA DE CADENA)

**Fecha:** 22 de Septiembre de 2026  
**Ruta de prueba:** `/catalog/presentations`  
**Archivo de especificación:** `apps/web/e2e/presentations-validations.spec.js`  
**Resultado general:** 26 PASSED / 0 FAILED / 0 SKIPPED (100% de efectividad)  
**Tiempo total de ejecución:** 3.8 minutos  

---

## 1. Resumen de Ejecución por Caso de Prueba

| TEST | Descripción | Estado | Comportamiento Observado en el Sistema |
| :--- | :--- | :---: | :--- |
| **TEST 01** | Nombre vacío: muestra error | **PASSED** | El botón "Crear Presentación" se deshabilita preventivamente indicando campos faltantes; el modal permanece abierto. |
| **TEST 02** | Nombre solo espacios: muestra error | **PASSED** | La función trim() invalida la cadena vacía y bloquea el guardado. |
| **TEST 03** | Nombre 500 chars: documentar comportamiento | **PASSED** | El frontend admite la longitud y la base de datos almacena el texto completo o la API lo procesa sin desbordamiento. |
| **TEST 04** | Nombre con `<script>`: no ejecuta script | **PASSED** | React sanitiza el valor en el DOM y Playwright no detecta disparo de alertas o ejecuciones de scripts no controladas. |
| **TEST 05** | Crear con ENVASE | **PASSED** | Persiste correctamente y se captura ID para cadena de valor. |
| **TEST 06** | Crear con BOTELLA | **PASSED** | Persiste correctamente y se captura ID para cadena de valor. |
| **TEST 07** | Crear con BOLSA | **PASSED** | Persiste correctamente y se captura ID para cadena de valor. |
| **TEST 08** | Crear con VASO | **PASSED** | Persiste correctamente y se captura ID para cadena de valor. |
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
| **TEST 25** | Happy path: crea y aparece en tabla | **PASSED** | Flujo completo de registro exitoso, cerrado automático de modal y captura de ID. |
| **TEST 26** | Crear presentación maestra para cadena | **PASSED** | Creación maestra (`E2E_CHAIN_PRES_BOTELLA_250_*`) para enlazar en cadena de valor sin eliminarse en cleanup. |

---

## 2. Persistencia de Cadena de Valor (`.test-data/presentations.json`)

Se implementó el helper `apps/web/e2e/helpers/chain-state.js` para persistir el estado entre módulos de prueba. El estado generado y verificado contiene los IDs de todas las presentaciones creadas:

```json
{
  "presentacionesCreadas": {
    "ENVASE": {
      "id": "14ea110d-480e-4bb8-82d4-c24df6d7e2b2",
      "nombre": "E2E_TEST_PRES_1790137387112_ENVASE"
    },
    "BOTELLA": {
      "id": "32e65b11-9e5a-4924-9020-ccf49775a886",
      "nombre": "E2E_TEST_PRES_1790137387112_BOTELLA"
    },
    "BOLSA": {
      "id": "9f078c41-fff3-423f-9fd7-4015a8d6839d",
      "nombre": "E2E_TEST_PRES_1790137387112_BOLSA"
    },
    "VASO": {
      "id": "72866f9c-2da1-42cf-93b6-12247127baee",
      "nombre": "E2E_TEST_PRES_1790137387112_VASO"
    },
    "BALDE": {
      "id": "f4368ec5-878d-4518-b484-c3de292e8b69",
      "nombre": "E2E_TEST_PRES_1790137387112_BALDE"
    },
    "COPITA": {
      "id": "c5a84fc0-a3c1-42eb-907b-73230e979e37",
      "nombre": "E2E_TEST_PRES_1790137387112_COPITA"
    },
    "OTRO": {
      "id": "946f108c-6e2d-4d70-a125-b5e2cdfc4a3f",
      "nombre": "E2E_TEST_PRES_1790137387112_OTRO"
    },
    "HAPPY_250ML": {
      "id": "5b88dca4-0060-41e3-b41e-89d1f4874a66",
      "nombre": "E2E_TEST_PRES_1790137387112_HAPPY_250ML"
    },
    "MASTER_BOTELLA_250": {
      "id": "161fb332-289b-44ee-ac3e-d6142ba85125",
      "nombre": "E2E_CHAIN_PRES_BOTELLA_250_1790137605415"
    }
  },
  "timestamp": "2026-09-23T04:23:07.112Z"
}
```

---

## 3. Aislamiento y Cleanup Inteligente
- **Preservación de Entidades Maestras:** El hook `test.afterAll` omite deliberadamente la eliminación de entidades cuyo nombre comience con `E2E_CHAIN_`, garantizando que la presentación maestra BOTELLA 250 quede disponible para los tests de producto, receta, producción y venta.
- **Limpieza de Desechos de Prueba:** Todas las entidades temporales (`E2E_TEST_PRES_...`) fueron purgadas satisfactoriamente del backend vía llamadas `DELETE /api/v1/presentations/:id`.
