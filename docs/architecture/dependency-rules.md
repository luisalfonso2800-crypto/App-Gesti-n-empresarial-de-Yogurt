# Reglas de Dependencia

## Backend

La dirección principal de las dependencias es:

Presentation
↓
Application / Service
↓
Business Rules / Domain
↓
Persistence

Reglas:

- Los controladores no acceden directamente a Prisma.
- Los controladores no contienen lógica de negocio.
- Los servicios no deben contener responsabilidades de interfaz HTTP.
- La lógica de persistencia debe permanecer separada de la lógica de aplicación.
- El dominio no debe depender de React, Electron, Prisma o HTTP.

## Frontend

La dirección principal es:

Page
↓
Feature Components
↓
Feature Logic
↓
Feature API
↓
HTTP Client

Reglas:

- Los componentes globales no dependen de features.
- Una feature puede utilizar componentes globales.
- La lógica específica de una feature permanece dentro de esa feature.
- El código solo se mueve a shared cuando existe reutilización real.

## Regla general

Ninguna dependencia debe invertirse sin una decisión arquitectónica explícita.
