import React from "react";
import HeroBackground from "@/components/home/HeroBackground";
import HeroSection from "@/components/home/HeroSection";
import ScheduleSection from "@/components/home/ScheduleSection";
import RegistrationSection from "@/components/home/RegistrationSection";
import QuickAccessBanners from "@/components/home/QuickAccessBanners";
import SponsorsSection from "@/components/home/SponsorsSection";
import { Store } from "@/lib/store";

export const revalidate = 0;

export default async function HomePage() {
  const sponsors = await Store.getSponsors();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. ZONA CONTINUA SUPERIOR CON FOTOGRAFÍA EN FONDO EXTENDIDO & TARJETAS TRANSLÚCIDAS */}
      <div className="relative min-h-[160vh] lg:min-h-[175vh] flex flex-col justify-between space-y-12 sm:space-y-16 pb-12">
        {/* Fondo Panorámico Continuo de Atletas con Viñeta Suave en Bordes */}
        <HeroBackground />

        {/* Hero Rótulo Translúcido Flotante */}
        <HeroSection />

        {/* Calendario de Partidos Translúcido Flotando Directamente sobre la Fotografía */}
        <ScheduleSection />
      </div>

      {/* 2. Banners de Acceso Rápido & Pilares Institucionales (Cuotas, Becas, Pauta, Línea de Tiempo) */}
      <QuickAccessBanners />

      {/* 3. Pre-Inscripción de Atletas */}
      <RegistrationSection />

      {/* 4. Pauta Publicitaria Oficial & Curiol Studio */}
      <SponsorsSection sponsors={sponsors} />
    </div>
  );
}
