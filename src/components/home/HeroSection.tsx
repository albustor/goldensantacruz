"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Camera, 
  Info, 
  ChevronDown,
  Flame 
} from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative z-10 flex-1 flex flex-col justify-between pt-4 sm:pt-6 pb-4 sm:pb-6">
      
      {/* 1. LOGO OFICIAL FLOTANDO SOBRE LA FOTO EN GRANDE (A LA IZQUIERDA) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="max-w-xs relative z-20 flex flex-col items-start space-y-3">
          
          {/* Logo con Halo Dorado y Efecto Hover 3D */}
          <div className="group relative inline-block cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-golden-500/30 via-amber-500/40 to-golden-400/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />

            <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-3xl bg-dark-950/70 border-2 border-golden-500/50 p-3.5 backdrop-blur-xl shadow-2xl shadow-black/90 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 group-hover:border-golden-400">
              <Image
                src="/logo.png"
                alt="Golden Sport Academy Santa Cruz"
                width={160}
                height={160}
                className="object-contain filter drop-shadow-[0_10px_25px_rgba(234,179,8,0.4)] group-hover:brightness-110 transition-all duration-300"
                priority
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-950/80 border border-golden-500/40 text-golden-400 text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-md">
              <Flame className="w-3.5 h-3.5 text-golden-400 animate-pulse" />
              <span>Escuela Formativa Oficial</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. RÓTULO TRANSLÚCIDO FLOTANTE EN LA BASE SOBRE LA FOTO */}
      <div className="relative z-20 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-auto pt-6">
        <div className="rounded-3xl bg-dark-950/65 backdrop-blur-xl border-2 border-golden-500/40 p-4 sm:p-5 text-center space-y-2.5 shadow-2xl shadow-black/90">
          
          {/* Título Oficial en Dos Líneas */}
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
              Golden Sport Academy
            </h1>
            <div className="text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500 drop-shadow-md">
              SANTA CRUZ
            </div>
          </div>

          {/* Botones de Acción Directa */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <a
              href="#inscripcion"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-golden-400 via-golden-500 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-golden-500/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <span>Inscribir a mi Hijo(a)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <Link
              href="/informacion"
              className="px-4 py-2.5 rounded-2xl bg-dark-900/90 hover:bg-dark-800 text-golden-300 font-bold text-xs uppercase tracking-wider border border-golden-500/40 flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Info className="w-3.5 h-3.5 text-golden-400" />
              <span>Conocer Información del Proyecto</span>
            </Link>

            <Link
              href="/galeria"
              className="px-4 py-2.5 rounded-2xl bg-dark-900/90 hover:bg-dark-800 text-white font-bold text-xs uppercase tracking-wider border border-gray-700 flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Camera className="w-3.5 h-3.5 text-golden-400" />
              <span>Fotografías</span>
            </Link>
          </div>
        </div>

        {/* Indicador de Desplazamiento Hacia Abajo */}
        <div className="flex justify-center pt-2.5">
          <span className="flex items-center gap-1 text-[11px] font-bold text-golden-400/80 animate-bounce">
            <span>Desplázate para ver partidos e inscripciones</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
