
import { Shell } from "../components/shell/Shell";
import "./globals.css";

export const metadata = {
  title: "Yogurt ERP",
  description: "Sistema de gestión",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
