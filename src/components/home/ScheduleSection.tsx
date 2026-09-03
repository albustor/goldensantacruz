"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  Flame, 
  Clock, 
  MapPin, 
  Ticket, 
  ExternalLink 
} from "lucide-react";
import { Match } from "@/types";
import { Store } from "@/lib/store";

export default function ScheduleSection() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    async function load() {
      const data = await Store.getMatches();
      setMatches(data);
    }
    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      {/* Tarjeta Ultra-Translúcida con Efecto Vidrio sobre el Fondo Conceptual */}
      <div className="rounded-3xl bg-dark-950/45 backdrop-blur-md border-2 border-golden-500/40 p-6 sm:p-10 shadow-2xl shadow-black/90 space-y-8">
        
        {/* Cabecera de la Jornada Oficial */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-golden-500/25">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500 text-dark-950 text-xs font-black uppercase shadow-md">
                <Flame className="w-3.5 h-3.5" />
                <span>Jornada Oficial de Partidos</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase backdrop-blur-md">
                <Ticket className="w-3.5 h-3.5" />
                <span>Entrada Gratuita</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
              Cartelera de <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500">Partidos & Fogueos</span>
            </h2>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-gray-200 font-medium">
              <span className="flex items-center gap-1 text-golden-400 font-bold">
                <Calendar className="w-4 h-4" />
                <span>Sábado 5 de Septiembre</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-golden-500" />
                <span>Gimnasio Municipal de Liberia</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://maps.google.com/?q=Gimnasio+Municipal+de+Liberia"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-2xl bg-dark-900/90 hover:bg-dark-800 text-golden-300 font-bold text-xs uppercase border border-golden-500/30 flex items-center gap-1.5 transition-colors shadow-md"
            >
              <MapPin className="w-4 h-4 text-golden-400" />
              <span>Ver Ubicación</span>
            </a>

            <Link
              href="/calendario"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-golden-400 via-golden-500 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl shadow-golden-500/30 transition-all hover:scale-105 shrink-0"
            >
              <span>Ver Cartelera Completa ({matches.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grid de Partidos de la Jornada Oficial */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.slice(0, 6).map((match) => {
            const isSantaCruzMatch = 
              match.summary?.includes("Santa Cruz") || 
              match.opponent?.includes("Santa Cruz") ||
              match.id === "mtc-lib-1" ||
              match.id === "mtc-lib-5" ||
              match.id === "mtc-lib-6" ||
              match.id === "mtc-lib-7";

            return (
              <div
                key={match.id}
                className={`p-5 rounded-2xl backdrop-blur-sm transition-all space-y-3 flex flex-col justify-between shadow-xl ${
                  isSantaCruzMatch
                    ? "bg-dark-950/65 border-2 border-golden-500/60 hover:border-golden-400"
                    : "bg-dark-950/45 border border-golden-500/25 hover:border-golden-500/50"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-black">
                    <span className="px-2.5 py-0.5 rounded-full bg-golden-500/20 text-golden-300 border border-golden-500/30">
                      {match.category}
                    </span>
                    <span className="flex items-center gap-1 text-white bg-dark-900/90 px-2.5 py-0.5 rounded-full border border-gray-700 font-bold">
                      <Clock className="w-3 h-3 text-golden-400" />
                      {match.matchTime}
                    </span>
                  </div>

                  {/* Enfrentamiento con Nombre Completo: Golden Sport Academy Santa Cruz */}
                  <div className="text-sm font-black text-white pt-1">
                    {match.id === "mtc-lib-1" && (
                      <div className="space-y-0.5">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white text-base">Golden Sport Academy Santa Cruz ⭐</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-2" && (
                      <div className="space-y-0.5">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white">Parajeles</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-3" && (
                      <div className="space-y-0.5">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white">Parajeles</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-4" && (
                      <div className="space-y-0.5">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white">Parajeles</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-5" && (
                      <div className="space-y-0.5">
                        <div className="text-white text-base">Golden Sport Academy Santa Cruz ⭐</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-golden-400">Parajeles</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-6" && (
                      <div className="space-y-0.5">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white text-base">Golden Sport Academy Santa Cruz (Fem) ⭐</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-7" && (
                      <div className="space-y-0.5">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white text-base">Golden Sport Academy Santa Cruz (Mixto) ⭐</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-300">
                  <span className="flex items-center gap-1 text-gray-300">
                    <MapPin className="w-3 h-3 text-golden-500 shrink-0" />
                    <span>Gimnasio Municipal de Liberia</span>
                  </span>
                  <span className="font-bold text-golden-400 text-[10px] uppercase">
                    5 Sept 2026
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lema & Pie de la Jornada */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏀</span>
            <span className="text-sm font-black text-golden-300 uppercase tracking-wide">
              ¡El baloncesto nos une!
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Organiza: Golden Sport Academy Santa Cruz • Sede: Gimnasio Municipal de Liberia
          </div>
        </div>

      </div>
    </section>
  );
}
