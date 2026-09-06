"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

// 20 FOTOGRAFÍAS OFICIALES DE ACCIÓN Y JUEGO REAL (CURIOL STUDIO - GOLDEN SPORT ACADEMY)
export const HERO_BG_PHOTOS = [
  { 
    url: "/Hero_Basketball/1.jpg", 
    title: "Velocidad & Pase en Transición Ofensiva", 
    tag: "Acción en Partido #007",
    shotType: "Juego en Movimiento"
  },
  { 
    url: "/Hero_Basketball/2.jpg", 
    title: "Duelo Aéreo por el Rebote en la Pintura", 
    tag: "Salto & Rebote #033",
    shotType: "Lucha en el Tablero"
  },
  { 
    url: "/Hero_Basketball/3.jpg", 
    title: "Penetración Ofensiva con Balón Protegido", 
    tag: "Ataque al Aro #069",
    shotType: "Conducción en Carrera"
  },
  { 
    url: "/Hero_Basketball/4.jpg", 
    title: "Disputa Técnica 1 vs 1 en el Perímetro", 
    tag: "Defensa & Presión #034",
    shotType: "Duelo Individual"
  },
  { 
    url: "/Hero_Basketball/5.jpg", 
    title: "Despliegue Táctico y Dinamismo de Equipo", 
    tag: "Transición Colectiva #138",
    shotType: "Plano Abierto de Juego"
  },
  { 
    url: "/Hero_Basketball/6.jpg", 
    title: "Ataque al Aro con Oposición Defensiva", 
    tag: "Penetración Intensa #045",
    shotType: "Acción Bajo el Aro"
  },
  { 
    url: "/Hero_Basketball/7.jpg", 
    title: "Armado de Juego y Conducción de Balón", 
    tag: "Visión de Cancha #002",
    shotType: "Control del Base"
  },
  { 
    url: "/Hero_Basketball/8.jpg", 
    title: "Presión Defensiva en Primera Línea", 
    tag: "Intensidad Defensiva #074",
    shotType: "Marcaje Activo"
  },
  { 
    url: "/Hero_Basketball/9.jpg", 
    title: "Reagrupación Táctica y Movimiento sin Balón", 
    tag: "Estrategia de Equipo #076",
    shotType: "Juego Colectivo"
  },
  { 
    url: "/Hero_Basketball/10.jpg", 
    title: "Búsqueda y Ejecución de Línea de Pase", 
    tag: "Pase Preciso #005",
    shotType: "Técnica de Pase"
  },
  { 
    url: "/Hero_Basketball/11.jpg", 
    title: "Acción Intensa y Fuerza en la Cancha", 
    tag: "Duelo en Pintura #043",
    shotType: "Contacto Limpio"
  },
  { 
    url: "/Hero_Basketball/12.jpg", 
    title: "Suspensión y Lanzamiento a Canasta", 
    tag: "Tiro al Aro #099",
    shotType: "Mecánica de Tiro"
  },
  { 
    url: "/Hero_Basketball/13.jpg", 
    title: "Drible en Velocidad con Cambio de Ritmo", 
    tag: "Manejo de Balón #024",
    shotType: "Dribling Ofensivo"
  },
  { 
    url: "/Hero_Basketball/14.jpg", 
    title: "Definición Rápida ante la Oposición", 
    tag: "Bandeja al Aro #067",
    shotType: "Definición Rápida"
  },
  { 
    url: "/Hero_Basketball/15.jpg", 
    title: "Desplazamiento Lateral y Cobertura", 
    tag: "Postura Defensiva #003",
    shotType: "Desplazamiento Táctico"
  },
  { 
    url: "/Hero_Basketball/16.jpg", 
    title: "Control de Posesión en Media Cancha", 
    tag: "Equilibrio & Pausa #026",
    shotType: "Dominio de Balón"
  },
  { 
    url: "/Hero_Basketball/17.jpg", 
    title: "Lucha por el Balón Suelto en la Pintura", 
    tag: "Rebote Ofensivo #075",
    shotType: "Lucha Aérea"
  },
  { 
    url: "/Hero_Basketball/18.jpg", 
    title: "Posición Defensiva Activa y Alerta", 
    tag: "Concentración #047",
    shotType: "Muro Defensivo"
  },
  { 
    url: "/Hero_Basketball/19.jpg", 
    title: "Transición Rápida Defensa a Ataque", 
    tag: "Salida Rápida #048",
    shotType: "Velocidad de Juego"
  },
  { 
    url: "/Hero_Basketball/20.jpg", 
    title: "Salida en Contragolpe y Acompañamiento", 
    tag: "Contrataque #028",
    shotType: "Aceleración en Duela"
  }
];

export default function HeroBackground() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev === HERO_BG_PHOTOS.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextPhoto = () => {
    setCurrentIdx((prev) => (prev === HERO_BG_PHOTOS.length - 1 ? 0 : prev + 1));
  };

  const prevPhoto = () => {
    setCurrentIdx((prev) => (prev === 0 ? HERO_BG_PHOTOS.length - 1 : prev - 1));
  };

  const current = HERO_BG_PHOTOS[currentIdx];

  return (
    <>
      {/* 1. Fondo Panorámico Continuo con pausa al pasar el mouse */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="absolute inset-0 z-0 bg-dark-950 overflow-hidden pointer-events-auto"
      >
        {HERO_BG_PHOTOS.map((photo, idx) => (
          <div
            key={`detail-${photo.url}`}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === currentIdx
                ? "opacity-95 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center select-none"
              quality={90}
            />
          </div>
        ))}

        {/* Viñeta Suave en Bordes, Laterales y Base */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/25 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-b from-transparent via-dark-950/80 to-dark-950 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/50 via-transparent to-dark-950/50 pointer-events-none" />
      </div>

      {/* 2. Controles de Foto Flotantes con Identificador del Tipo de Plano y Estado de Pausa */}
      <div className="relative z-30 pt-20 pr-4 sm:pr-8 flex justify-end items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5 bg-dark-950/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-golden-500/40 shadow-xl shadow-black/80">
          <div className="text-right hidden sm:block border-r border-gray-700/80 pr-2.5">
            <span className="text-[10px] font-black uppercase text-golden-400 block leading-tight flex items-center gap-1 justify-end">
              <span>🏀 {current.tag}</span>
              {isPaused && <span className="text-[8px] px-1 bg-golden-500/30 text-golden-300 rounded">Pausado</span>}
            </span>
            <span className="text-[9px] text-gray-400 block leading-tight">
              {current.shotType}
            </span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded-full text-gray-300 hover:text-golden-400 hover:bg-dark-800 transition-colors"
            title={isPaused ? "Reanudar rotación" : "Pausar rotación"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-golden-400" /> : <Pause className="w-3.5 h-3.5 text-gray-400" />}
          </button>

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
