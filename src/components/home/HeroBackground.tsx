"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 10 FOTOGRAFÍAS PURAMENTE CONCEPTUALES DE BÁSQUETBOL (PLANOS DETALLE, MACRO, SIN ROSTROS NI PERSONAS)
export const HERO_BG_PHOTOS = [
  { 
    url: "/Hero_Basketball/1.jpg", 
    title: "Macro Extremo de Cuero & Costuras del Balón", 
    tag: "Textura & Grano Oficial",
    shotType: "Macro Extremo"
  },
  { 
    url: "/Hero_Basketball/2.jpg", 
    title: "Plano Detalle - Manos Infantiles Sosteniendo el Balón", 
    tag: "Manos & Balón Semillero",
    shotType: "Plano Detalle"
  },
  { 
    url: "/Hero_Basketball/3.jpg", 
    title: "Balón en el Aro & Red en Movimiento", 
    tag: "Tiro Limpio al Aro",
    shotType: "Primerísimo Plano"
  },
  { 
    url: "/Hero_Basketball/4.jpg", 
    title: "Balón Picando con Efecto de Barrido en Duela", 
    tag: "Bote a Velocidad",
    shotType: "Efecto de Movimiento"
  },
  { 
    url: "/Hero_Basketball/5.jpg", 
    title: "Tenis de Básquetbol & Balón en la Cancha", 
    tag: "Calzado de Básquetbol & Balón",
    shotType: "Plano a Ras de Suelo"
  },
  { 
    url: "/Hero_Basketball/6.jpg", 
    title: "Contrapicada de Aro & Tablero Iluminado", 
    tag: "Aro & Luces de Estadio",
    shotType: "Contrapicada"
  },
  { 
    url: "/Hero_Basketball/7.jpg", 
    title: "Plano Detalle - Mano Infantil Dribleando el Balón", 
    tag: "Drible Infantil & Reflejo",
    shotType: "Acción Dinámica"
  },
  { 
    url: "/Hero_Basketball/8.jpg", 
    title: "Balón en la Línea de Tiro Libre", 
    tag: "Línea de Tiro Libre",
    shotType: "Plano de Enfoque"
  },
  { 
    url: "/Hero_Basketball/9.jpg", 
    title: "Manos de Niños Unidos sobre el Balón", 
    tag: "Unión & Trabajo en Equipo",
    shotType: "Plano de Manos en Equipo"
  },
  { 
    url: "/Hero_Basketball/10.jpg", 
    title: "Aro & Tablero al Atardecer Dorado", 
    tag: "Aro al Atardecer",
    shotType: "Contraluz Dorado"
  }
];

export default function HeroBackground() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev === HERO_BG_PHOTOS.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextPhoto = () => {
    setCurrentIdx((prev) => (prev === HERO_BG_PHOTOS.length - 1 ? 0 : prev + 1));
  };

  const prevPhoto = () => {
    setCurrentIdx((prev) => (prev === 0 ? HERO_BG_PHOTOS.length - 1 : prev - 1));
  };

  const current = HERO_BG_PHOTOS[currentIdx];

  return (
    <>
      {/* 1. Fondo Panorámico Continuo con las 10 Fotos Conceptuales Locales */}
      <div className="absolute inset-0 z-0 bg-dark-950 overflow-hidden pointer-events-none">
        {HERO_BG_PHOTOS.map((photo, idx) => (
          <div
            key={`detail-${photo.url}`}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out transform ${
              idx === currentIdx
                ? "opacity-90 scale-100"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
            style={{
              backgroundImage: `url(${photo.url})`,
            }}
          />
        ))}

        {/* Viñeta Suave en Bordes, Laterales y Base */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/25 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-b from-transparent via-dark-950/80 to-dark-950 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/50 via-transparent to-dark-950/50 pointer-events-none" />
      </div>

      {/* 2. Controles de Foto Flotantes con Identificador del Tipo de Plano */}
      <div className="relative z-30 pt-20 pr-4 sm:pr-8 flex justify-end items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5 bg-dark-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-golden-500/40 shadow-xl shadow-black/80">
          <div className="text-right hidden sm:block border-r border-gray-700/80 pr-2.5">
            <span className="text-[10px] font-black uppercase text-golden-400 block leading-tight">
              🏀 {current.tag}
            </span>
            <span className="text-[9px] text-gray-400 block leading-tight">
              {current.shotType}
            </span>
          </div>

          <button
            onClick={prevPhoto}
            className="p-1 rounded-full text-gray-300 hover:text-golden-400 hover:bg-dark-800 transition-colors"
            title="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-bold text-golden-300">
            {currentIdx + 1} / {HERO_BG_PHOTOS.length}
          </span>
          <button
            onClick={nextPhoto}
            className="p-1 rounded-full text-gray-300 hover:text-golden-400 hover:bg-dark-800 transition-colors"
            title="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
