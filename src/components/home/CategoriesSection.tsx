"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Camera } from "lucide-react";

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-black text-golden-400 uppercase tracking-widest bg-golden-500/10 px-3 py-1 rounded-full border border-golden-500/20">
          Nuestras Categorías Oficiales
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Formación Deportiva desde <span className="text-golden-500">Menores de U8 hasta Juvenil</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
          Programas adaptados a cada etapa del desarrollo infantil y juvenil en Santa Bárbara de Santa Cruz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Menores U8 */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-golden-500/40 hover:border-golden-500 transition-all space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500 text-dark-900">
              Menores de U8 (4 - 7 años)
            </span>
            <span className="text-2xl">🧸</span>
          </div>
          <h3 className="text-xl font-black text-white">Iniciación & Semillero U8</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Estimulación temprana de la psicomotricidad, familiarización lúdica con el balón, coordinación ojo-mano, equilibrio y primeros botes.
          </p>
          <div className="pt-2 text-xs font-semibold text-golden-400">
            Sábados 8:30 AM & Martes 4:00 PM • Santa Bárbara
          </div>
        </div>

        {/* Card 2: Mini U8-U10 */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-gray-800 hover:border-golden-500/50 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500/20 text-golden-400">
              Edades 8 - 10 años
            </span>
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-xl font-black text-white">Mini-Básquetbol (U8 - U10)</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Fundamentos de bote con ambas manos, pases precisos, mecánicas iniciales de tiro y aprendizaje de juego cooperativo.
          </p>
          <div className="pt-2 text-xs font-semibold text-golden-400">
            Martes y Jueves 4:30 PM • Santa Bárbara
          </div>
        </div>

        {/* Card 3: Infantil U12-U14 */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-gray-800 hover:border-golden-500/50 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500/20 text-golden-400">
              Edades 11 - 14 años
            </span>
            <span className="text-2xl">🏀</span>
          </div>
          <h3 className="text-xl font-black text-white">Infantil (U12 - U14)</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Perfeccionamiento técnico individual, tiro en suspensión, desmarque sin balón, defensa 1 contra 1 y transición rápida.
          </p>
          <div className="pt-2 text-xs font-semibold text-golden-400">
            Lunes, Miércoles y Viernes 4:30 PM
          </div>
        </div>

        {/* Card 4: Juvenil U16-U18 */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-gray-800 hover:border-golden-500/50 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500/20 text-golden-400">
              Edades 15 - 18 años
            </span>
            <span className="text-2xl">🔥</span>
          </div>
          <h3 className="text-xl font-black text-white">Juvenil (U16 - U18)</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Entrenamiento de alta exigencia, acondicionamiento físico, esquemas tácticos de juego y fogueos intercantonales.
          </p>
          <div className="pt-2 text-xs font-semibold text-golden-400">
            Lunes a Viernes 5:30 PM
          </div>
        </div>

        {/* Card 5: Clínicas de Tiro */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-golden-500/30 hover:border-golden-500/60 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300">
              Especialización
            </span>
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-black text-white">Clínicas de Tecnificación & Tiro</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Talleres intensivos de biomecánica del tiro, toma de decisiones y clínica de fundamentos avanzados para todos los niveles.
          </p>
          <div className="pt-2 text-xs font-semibold text-amber-300">
            Sábados por la tarde (Convocatoria periódica)
          </div>
        </div>

        {/* Card 6: Golden Studio Fotografía */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-golden-950/50 to-dark-900 border-2 border-golden-500/60 transition-all space-y-3 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500 text-dark-900 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                Golden Studio
              </span>
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="text-xl font-black text-white mt-2">Cobertura Fotográfica</h3>
            <p className="text-xs text-gray-300 leading-relaxed mt-1">
              Sesiones oficiales con marcas de patrocinadores para recuerdos familiares, cuadros e imanes de nevera.
            </p>
          </div>
          <Link
            href="/patrocinadores"
            className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase shadow-md"
          >
            Ver Fotos y Patrocinios
          </Link>
        </div>
      </div>
    </section>
  );
}
