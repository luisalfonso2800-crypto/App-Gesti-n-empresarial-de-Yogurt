# Comandos Útiles del Proyecto

Aquí tienes la lista de los comandos principales para gestionar la base de datos y levantar los servidores. Todos los comandos deben ejecutarse desde la raíz del proyecto (`C:\Proyects\App-Gesti-n-empresarial-de-Yogurt`).

---

## 🖥️ 1. Levantar los Servidores

Para trabajar localmente, abre dos terminales distintas y ejecuta un comando en cada una:

**Terminal 1 (Backend - Puerto 3000):**
```bash
pnpm run start:api:dev
```

**Terminal 2 (Frontend Web - Puerto 3001):**
```bash
pnpm --filter web run dev --turbo
```

---

## 🗄️ 2. Gestión de Base de Datos (Prisma)

Estos comandos son para administrar tu PostgreSQL usando Prisma.

### Crear / Actualizar las tablas en la Base de Datos
*Usa esto la primera vez que configuras el proyecto o cada vez que hagas un cambio en el archivo `schema.prisma`.*
```bash
pnpm --filter api exec prisma db push
pnpm --filter api exec prisma generate
```

### Sembrar (Llenar) la Base de Datos con datos de prueba
*Este script limpia las tablas existentes y carga datos ficticios iniciales para poder probar la aplicación.*
```bash
pnpm --filter api run db:seed:test
```

### Vaciar la Base de Datos
*Úsalo si solo quieres eliminar todos los registros de las tablas sin eliminar la estructura de la base de datos.*
```bash
pnpm --filter api run db:clean:test
```

---

## 📦 3. Instalación de Dependencias
*Solo necesitas correr esto la primera vez o cuando alguien agregue nuevas librerías al proyecto.*
```bash
pnpm install
```
