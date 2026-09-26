# 06 - Approved Module Pattern

The standard architectural pattern for modules in this project consists of:
- **Module** (`entity.module.js`): Configures imports (like `DatabaseModule`), controllers, providers (Service, Repository), and exports the service.
- **Controller** (`entity.controller.js`): Handles HTTP routing using decorators (`@Get`, `@Post`, etc.) and `@Bind()` for parameter binding.
- **Service** (`entity.service.js`): Contains business logic, depends on the Repository.
- **Repository** (`entity.repository.js`): Encapsulates Prisma Client calls, depends on `PrismaService`.
- **DTOs** (`dto/create-entity.dto.js`, `dto/update-entity.dto.js`): Data transfer objects, optionally using `class-validator`.

Files are in JavaScript, utilizing `@nestjs/common` decorators and Babel plugins for dependency injection (e.g. `@Dependencies(PrismaService)`).
