import React from "react";
import HeroBackground from "@/components/home/HeroBackground";
import HeroSection from "@/components/home/HeroSection";
import MatchBanner from "@/components/home/MatchBanner";
import ScheduleSection from "@/components/home/ScheduleSection";
import RegistrationSection from "@/components/home/RegistrationSection";
import QuickAccessBanners from "@/components/home/QuickAccessBanners";
import SponsorsSection from "@/components/home/SponsorsSection";
import { Store } from "@/lib/store";

export const revalidate = 0;

export default async function HomePage() {
  const sponsors = await Store.getSponsors();

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      
      {/* 1. HERO CON FOTOGRAFÍA PANORÁMICA NÍTIDA EN MÓVIL Y DESKTOP */}
      <div className="relative min-h-[72vh] sm:min-h-[78vh] lg:min-h-[82vh] flex flex-col justify-between overflow-hidden rounded-b-3xl sm:rounded-b-[2.5rem] border-b border-golden-500/30 shadow-2xl">
        {/* Fondo Panorámico Continuo de Atletas con Viñeta Suave en Bordes */}
        <HeroBackground />

        {/* Hero Rótulo Translúcido Flotante */}
        <HeroSection />
      </div>

      {/* 1.5 FICHA GRÁFICA EN VIVO DEL PARTIDO DE HOY (La Paz Community School Tempisque vs. Golden Sport Academy Santa Cruz) */}
      <div className="-mt-8 sm:-mt-12 relative z-30">
        <MatchBanner />
      </div>

      {/* 2. CALENDARIO OFICIAL DE PARTIDOS */}
      <ScheduleSection />

      {/* 3. Banners de Acceso Rápido & Pilares Institucionales (Cuotas, Galería, Pauta, Línea de Tiempo) */}
      <QuickAccessBanners />

      {/* 3. Pre-Inscripción de Atletas */}
      <RegistrationSection />

      {/* 4. Pauta Publicitaria Oficial & Curiol Studio */}
      <SponsorsSection sponsors={sponsors} />
    </div>
  );
}
