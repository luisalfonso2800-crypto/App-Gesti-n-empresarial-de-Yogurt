// Archivo deprecado en favor de apps/api/prisma/seed-recipes-e2e.js según Regla 07 de Testing.
import { test } from '@playwright/test';

test.describe.skip('Siembra masiva por UI deprecada', () => {
  test('La siembra se realiza vía Prisma Client directo', () => {});
});
