"use client";

import React from "react";
import { Target, HeartHandshake, Trophy } from "lucide-react";

export default function InfoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-black text-golden-400 uppercase tracking-widest bg-golden-500/10 px-3 py-1 rounded-full border border-golden-500/20">
          Pase Informativo Institucional
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          ¿Por qué elegir <span className="text-golden-500">Golden Sport Academy</span>?
        </h2>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
          Brindamos a los atletas de Santa Cruz una formación deportiva integral que combina destreza física, fundamentos tácticos y formación en valores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-dark-800/80 border border-gray-800 hover:border-golden-500/40 transition-all space-y-4 group">
          <div className="w-14 h-14 rounded-2xl bg-golden-500/10 border border-golden-500/30 flex items-center justify-center text-golden-400 group-hover:scale-110 transition-transform">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase">
            Fundamentos y Técnica Individual
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Enseñanza progresiva de tiro, control de balón, visión perimetral, desplazamiento defensivo y toma de decisiones en cancha desde edades tempranas.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-dark-800/80 border border-gray-800 hover:border-golden-500/40 transition-all space-y-4 group">
          <div className="w-14 h-14 rounded-2xl bg-golden-500/10 border border-golden-500/30 flex items-center justify-center text-golden-400 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase">
            Disciplina, Respeto y Valores
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            El deporte es nuestra herramienta para formar líderes y ciudadanos ejemplares: puntualidad, compañerismo, resiliencia y juego limpio.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-dark-800/80 border border-gray-800 hover:border-golden-500/40 transition-all space-y-4 group">
          <div className="w-14 h-14 rounded-2xl bg-golden-500/10 border border-golden-500/30 flex items-center justify-center text-golden-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase">
            Competencia y Fogueos Oficiales
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Participación activa en torneos cantonales, Liga Menor de Guanacaste y fogueos interprovinciales para desarrollar el espíritu competitivo.
          </p>
        </div>
      </div>
    </section>
  );
}
