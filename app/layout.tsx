import "./globals.css";
import { 
  Playfair_Display, 
  Inter, 
  Montserrat, 
  Dancing_Script, 
  Roboto,
  Great_Vibes 
} from "next/font/google";
import type { Metadata, Viewport } from "next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reservá la Fecha",
  description: "Gestión de eventos especiales e invitaciones",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`
        ${playfair.variable} 
        ${inter.variable} 
        ${montserrat.variable} 
        ${dancingScript.variable} 
        ${roboto.variable}
        ${greatVibes.variable}
      `}>
        {children}
      </body>
    </html>
  );
}
