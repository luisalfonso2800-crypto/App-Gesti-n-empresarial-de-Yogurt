# Backend Bootstrap Technical Review

**Fecha de ejecución:** 2026-08-28  
**Estado:** READY FOR BACKEND BOOTSTRAP  
**Alcance:** Auditoría, simplificación y validación técnica del backend bootstrap en `apps/api` (NestJS + JavaScript).

---

## 1. Configuración revisada

Se ha realizado una auditoría exhaustiva e inspección técnica de todos los archivos y configuraciones del bootstrap en `apps/api/`:

- `apps/api/package.json`
- `apps/api/index.js`
- `apps/api/src/main.js`
- `apps/api/src/app.module.js`
- `apps/api/src/app.controller.js`
- `apps/api/src/app.service.js`
- `apps/api/src/app.controller.spec.js`
- `apps/api/test/app.e2e-spec.js`
- `apps/api/test/jest-e2e.json`
- `apps/api/jest.config.js`
- `apps/api/.babelrc.json`
- `apps/api/babel.config.json` *(eliminado tras detectar duplicidad)*
- `apps/api/jsconfig.json`
- `apps/api/nest-cli.json`
- `apps/api/nodemon.json`

---

## 2. Componentes necesarios

| Componente | Justificación Técnica |
| :--- | :--- |
| **`@babel/core`** | Núcleo de transformación necesario para transpilar decoradores de NestJS y sintaxis moderna de JavaScript. |
| **`@babel/plugin-proposal-decorators`** | **Imprescindible**. NestJS con JavaScript utiliza decoradores legacy (`@Module`, `@Controller`, `@Injectable`, `@Get`, `@Dependencies`). Sin este plugin en modo `{ "legacy": true }`, Node.js falla con `SyntaxError` al intentar parsear la sintaxis de decoradores. |
| **`@babel/preset-env`** | Permite usar módulos ES (`import`/`export`) y ajusta las transformaciones al runtime activo (`node: "current"`). |
| **`@babel/register` + `index.js`** | Proporciona transpilación *just-in-time* (en memoria) en el arranque. Evita la necesidad de un proceso de compilación `build`/`dist` durante el desarrollo local, permitiendo ejecutar `node index.js` directamente. |
| **`babel-jest`** | Reutiliza la configuración de Babel para que Jest pueda ejecutar las pruebas unitarias y E2E escritas con módulos ES y decoradores. |
| **`apps/api/.babelrc.json`** | Configuración relativa a los archivos (*file-relative configuration*). En una estructura monorepo (PNPM workspace), `.babelrc.json` garantiza que tanto Jest como `@babel/register` resuelvan correctamente los plugins y presets independientemente de si se ejecutan desde la raíz o dentro del subdirectorio `apps/api`. |
| **`apps/api/nodemon.json`** | Monitorea cambios en `src/` y reinicia `node index.js`. Es ligero, directo y no introduce la sobrecarga del watch de TypeScript. |
| **`apps/api/jsconfig.json`** | Configura el Language Server / IDE (VS Code, etc.) con `"experimentalDecorators": true`, eliminando falsos errores de sintaxis y habilitando autocompletado e IntelliSense sobre código JavaScript. |
| **`apps/api/nest-cli.json`** | Configurado con `"language": "js"` y `"sourceRoot": "src"`, asegurando que cualquier generador de NestJS cree archivos JavaScript en vez de TypeScript. |

---

## 3. Componentes innecesarios o redundantes

1. **`babel.config.json` (Redundante y conflictivo en monorepo)**:
   - Existía simultáneamente con `.babelrc.json` conteniendo la misma configuración.
   - En monorepos, `babel.config.json` en un subpaquete no es cargado automáticamente por `babel-jest` cuando el proceso se invoca desde la raíz o con resolución contextual estándar a menos que se configure `rootMode`, mientras que `.babelrc.json` funciona de manera nativa y predecible. Mantener ambos era redundante y confuso.
2. **`@babel/node` (Innecesario)**:
   - No es necesario ni está presente en las dependencias. La combinación de `node index.js` con `@babel/register` es más liviana, no requiere wrappers de CLI adicionales y es más predecible.
3. **`@babel/plugin-transform-runtime` y `@babel/runtime` (Innecesarios)**:
   - No aportan beneficio para un backend en Node.js moderno (Node 20+ / Node 24), ya que las funciones del lenguaje (como `async`/`await`, `Promise`, generadores) son nativas en el motor V8. Introducirlos solo añadiría capas y peso innecesario.

---

## 4. Problemas técnicos detectados

1. **Duplicidad de configuración de Babel**:
   - Existencia paralela de `apps/api/.babelrc.json` y `apps/api/babel.config.json`.
2. **Ausencia de dependencias de build innecesarias**:
   - Se verificó que el proyecto no contiene scripts de TypeScript ni compiladores cruzados pesados (como `ts-node`, `tsc`, etc.), manteniendo el enfoque JavaScript limpio.

---

## 5. Simplificaciones realizadas

- **Eliminación del archivo redundante**: Se eliminó `apps/api/babel.config.json`, consolidando la configuración de Babel únicamente en `apps/api/.babelrc.json`.
- **Mantenimiento del flujo de desarrollo mínimo**: Se preservó la arquitectura basada en `node index.js` + `@babel/register`, evitando agregar pasos de compilación complejos (`build`/`dist`) innecesarios para esta etapa.

---

## 6. Configuración final

### `apps/api/.babelrc.json`
```json
{
  "presets": [
    ["@babel/preset-env", { "targets": { "node": "current" } }]
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```

### `apps/api/index.js`
```javascript
require('@babel/register');
require('./src/main');
```

### `apps/api/nodemon.json`
```json
{
  "watch": ["src"],
  "ext": "js",
  "ignore": ["src/**/*.spec.js"],
  "exec": "node index.js"
}
```

### `apps/api/jsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES6",
    "experimentalDecorators": true
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### `apps/api/nest-cli.json`
```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "language": "js",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
```

### `apps/api/jest.config.js`
```javascript
/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json'],
  rootDir: 'src',
  testRegex: '.spec.js$',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

module.exports = config;
```

---

## 7. Dependencias finales

En `apps/api/package.json`:

```json
{
  "name": "api",
  "version": "0.0.1",
  "description": "Yogurt Management System API",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "format": "prettier --write \"**/*.js\"",
    "start": "node index.js",
    "start:dev": "nodemon",
    "test": "jest",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.11",
    "@nestjs/core": "^11.0.11",
    "@nestjs/platform-express": "^11.0.11",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.2"
  },
  "devDependencies": {
    "@babel/core": "^7.26.9",
    "@babel/plugin-proposal-decorators": "^7.25.9",
    "@babel/preset-env": "^7.26.9",
    "@babel/register": "^7.25.9",
    "@nestjs/testing": "^11.0.11",
    "babel-jest": "^29.7.0",
    "jest": "^29.7.0",
    "nodemon": "^3.1.9",
    "prettier": "^3.5.3",
    "supertest": "^7.0.0"
  }
}
```

---

## 8. Validación de pruebas

### Unit tests
Ejecutado con `pnpm test` (invocando `jest` en `apps/api`):
- **Resultado**: `PASS src/app.controller.spec.js` (1 suite aprobada, 1 test unitario aprobado).

### E2E tests
Ejecutado con `pnpm test:e2e` (invocando `jest --config ./test/jest-e2e.json` en `apps/api`):
- **Resultado**: `PASS test/app.e2e-spec.js` (1 suite aprobada, 1 test E2E sobre endpoint raíz `/` con Supertest aprobado).

---

## 9. Validación del arranque

- **Necesidad**: Se verificó la instanciación e inicialización del contenedor de NestJS mediante `@babel/register` y `NestFactory` para asegurar que el ciclo de arranque sea funcional sin dejar procesos colgados.
- **Mecanismo de verificación**: Se ejecutó un comando Node autocontenido y auto-terminable que instancia la aplicación, compila el módulo raíz `AppModule` y la cierra inmediatamente:
  ```bash
  node -e "require('@babel/register'); const { NestFactory } = require('@nestjs/core'); const { AppModule } = require('./src/app.module'); (async () => { const app = await NestFactory.create(AppModule, { logger: false }); console.log('BOOTSTRAP_SUCCESS'); await app.close(); process.exit(0); })()"
  ```
- **Resultado**: `BOOTSTRAP_SUCCESS` (código de salida 0).
- **Procesos persistentes**: No quedó ningún servidor HTTP ni proceso en segundo plano en ejecución.

---

## 10. Riesgos o advertencias pendientes

1. **Inyección de dependencias en JavaScript**:
   - En JavaScript vanilla con decoradores, NestJS no infiere tipos de constructor en tiempo de ejecución (a diferencia de TypeScript con `emitDecoratorMetadata`). Por ello, es obligatorio el uso del decorador `@Dependencies(AppService)` en los controladores/servicios cuando se inyecten dependencias. Esto ya está correctamente aplicado en el ejemplo actual `AppController`.
2. **Sin riesgos de configuración detectados**: La configuración actual es mínima, estable y limpia.

---

## 11. Impacto sobre la arquitectura existente

- **Decisiones de dominio**: Intactas (sin cambios).
- **Modelo de datos**: Intacto (sin cambios).
- **Límites de módulos**: Intactos (sin cambios).
- **Arquitectura funcional**: Intacta (sin cambios).
- No se han agregado módulos de negocio, entidades ni esquemas.
- No se ha instalado Prisma ni PostgreSQL.

---

## 12. Estado final

**READY FOR BACKEND BOOTSTRAP**
