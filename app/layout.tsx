import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Nuestra Boda 💍",
  description: "Te invitamos a celebrar nuestro matrimonio",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#1a1a1a",
  icons: {
    icon: "/wedding-icon.png", // Cambia a PNG y coloca la imagen en public/
  },
  openGraph: {
    title: "Nuestra Boda 💍",
    description: "Te invitamos a celebrar nuestro matrimonio",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
