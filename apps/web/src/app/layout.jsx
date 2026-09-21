/**
 * @file layout.jsx
 * @module app/layout
 * @description Raíz de la aplicación Next.js, ahora integra proveedores globales de Contexto.
 * @responsibility Envolver la app con CartProvider y NotificationProvider para acceso global.
 * @usedBy Next.js App Router
 * @dependencies @/context/CartContext, @/context/NotificationContext, @/components/shell/Shell
 */
import { Shell } from "@/components/shell/Shell";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { PrivacyProvider } from "@/context/PrivacyContext";
import "./globals.css";

export const metadata = {
  title: "Yogurt ERP",
  description: "Sistema de gestión",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <PrivacyProvider>
          <NotificationProvider>
            <CartProvider>
              <Shell>{children}</Shell>
            </CartProvider>
          </NotificationProvider>
        </PrivacyProvider>
      </body>
    </html>
  );
}
