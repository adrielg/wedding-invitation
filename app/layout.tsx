import "./globals.css";
import { 
  Playfair_Display, 
  Inter, 
  Montserrat, 
  Dancing_Script, 
  Roboto,
  Great_Vibes 
} from "next/font/google";

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

export const metadata = {
  title: "Eventos Especiales 🎊",
  description: "Plataforma para gestionar y confirmar asistencia a tus eventos más importantes",
  icons: {
    icon: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎊</text></svg>`,
  },
  openGraph: {
    title: "Eventos Especiales 🎊",
    description: "Plataforma para gestionar y confirmar asistencia a tus eventos más importantes",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a1a1a",
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
