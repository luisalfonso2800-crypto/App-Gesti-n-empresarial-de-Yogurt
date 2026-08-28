# Arquitectura del Sistema

## Aplicaciones

### API
Responsabilidad:
Backend principal del sistema.

Tecnologías previstas:
- Node.js
- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL

### Desktop
Responsabilidad:
Aplicación de escritorio utilizada por el usuario final.

Tecnologías previstas:
- Electron
- React
- TypeScript

## Paquetes compartidos

### contracts
Responsabilidad:
Contratos y tipos compartidos entre aplicaciones.

### shared
Responsabilidad:
Código puro reutilizable que no pertenece a una aplicación específica.

### config
Responsabilidad:
Configuraciones compartidas del proyecto.

## Principio general

El sistema se organiza como un monorepo.

Las aplicaciones contienen responsabilidades ejecutables.

Los paquetes contienen código compartido.

La lógica del negocio se organiza por módulos funcionales y no únicamente por tablas de base de datos.
