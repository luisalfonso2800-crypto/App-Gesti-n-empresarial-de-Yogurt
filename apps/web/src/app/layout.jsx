/**
 * @file layout.jsx
 * @module app/layout
 * @description Raíz de la aplicación Next.js, integra proveedores globales y Splash de bienvenida MANNÁ.
 * @responsibility Envolver la app con CartProvider, NotificationProvider y Canvas Welcome Splash.
 * @usedBy Next.js App Router
 * @dependencies @/context/CartContext, @/context/NotificationContext, @/components/shell/Shell, @/components/ui/MannaWelcomeSplash
 */
import { Shell } from "@/components/shell/Shell";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { PrivacyProvider } from "@/context/PrivacyContext";
import { InvoiceConfigProvider } from "@/context/InvoiceConfigContext";
import MannaWelcomeSplash from "@/components/ui/MannaWelcomeSplash";
import "./globals.css";

export const metadata = {
  title: "MANNÁ — Gestión Empresarial de Yogurt",
  description: "Sistema Integral de Manufactura Láctea, Trazabilidad Sanitaria y Centro de Mando Táctico",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <InvoiceConfigProvider>
          <PrivacyProvider>
            <NotificationProvider>
              <CartProvider>
                <MannaWelcomeSplash />
                <Shell>{children}</Shell>
              </CartProvider>
            </NotificationProvider>
          </PrivacyProvider>
        </InvoiceConfigProvider>
      </body>
    </html>
  );
}
