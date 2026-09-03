import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export const metadata: Metadata = {
  title: "Golden Sport Academy Santa Cruz | Academia de Baloncesto",
  description:
    "Academia y equipo de baloncesto de Santa Cruz, Guanacaste. Formación deportiva de alto rendimiento, categorías formativas, calendario de partidos, álbum compartido de fotos y portal administrativo.",
  keywords: [
    "Golden Sport Academy",
    "Santa Cruz Guanacaste",
    "Baloncesto Costa Rica",
    "Básquetbol Guanacaste",
    "Academia de Baloncesto",
    "Golden Basketball",
    "Torneo de Baloncesto Santa Cruz"
  ],
  authors: [{ name: "Golden Sport Academy Santa Cruz" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-dark-900 text-gray-100 min-h-screen flex flex-col antialiased selection:bg-golden-500 selection:text-dark-900">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
