# Evolución Arquitectónica

## Regla principal

Ningún archivo, carpeta, capa o patrón arquitectónico se crea únicamente por anticipación.

Todo elemento nuevo debe responder a:

1. Una responsabilidad concreta.
2. Una necesidad identificable.
3. Una regla definida por la arquitectura.
4. Una ubicación clara dentro del sistema.

## Estructura inicial de un módulo backend

Un módulo backend puede comenzar con:

module-name/
├── dto/
├── module-name.controller.ts
├── module-name.service.ts
├── module-name.repository.ts
└── module-name.module.ts

No deben crearse capas adicionales sin necesidad real.

## Crear una carpeta domain/

Crear domain/ cuando existan reglas de negocio que:

- Sean independientes de HTTP.
- Sean independientes de NestJS.
- Sean independientes de Prisma.
- Tengan comportamiento o validación propia.
- Necesiten reutilización dentro del dominio.

## Crear application/

Crear application/ cuando el módulo tenga múltiples casos de uso claramente independientes.

Ejemplos:

- create
- update
- cancel
- execute
- calculate

## Crear events/

Crear events/ únicamente cuando una operación produzca efectos en varias responsabilidades independientes.

## Crear value-objects/

Crear value-objects/ únicamente cuando un concepto:

- tenga significado propio;
- tenga validación propia;
- sea reutilizable;
- no tenga identidad independiente.

## Crear código compartido

Un elemento no debe moverse a shared por una posible reutilización futura.

Debe existir una necesidad real de reutilización.

## Prohibiciones

No crear:

- carpetas vacías por simetría;
- abstracciones sin responsabilidad;
- factories sin necesidad;
- strategies sin variaciones reales;
- mappers innecesarios;
- value objects decorativos;
- eventos anticipados;
- capas únicamente para aparentar complejidad.

## Modificación arquitectónica

Cuando una necesidad no esté contemplada:

1. Identificar la nueva responsabilidad.
2. Evaluar si pertenece a un módulo existente.
3. Determinar su ubicación.
4. Documentar la decisión.
5. Implementar el cambio.

La arquitectura no se modifica silenciosamente.
