"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trophy, 
  Calendar as CalendarIcon, 
  MapPin, 
  Navigation, 
  Clock, 
  Share2, 
  Filter, 
  CheckCircle2, 
  Flame, 
  ChevronRight, 
  Camera, 
  Ticket, 
  Sparkles, 
  Download 
} from "lucide-react";
import { Match } from "@/types";
import { Store } from "@/lib/store";
import { generateMatchAnnouncementWhatsApp } from "@/lib/whatsapp";

export default function CalendarioPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      const data = await Store.getMatches();
      setMatches(data);
      setLoading(false);
    }
    fetchMatches();
  }, []);

  const categories = [
    "Todas",
    "Iniciación / Menores de U8 (U6-U8)",
    "Mini-Básquet (U8-U10)",
    "Infantil (U12-U14)",
    "Juvenil (U16-U18)",
  ];

  const filteredMatches = matches.filter((m) => {
    const matchCat = selectedCategory === "Todas" || m.category === selectedCategory;
    const matchStat =
      selectedStatus === "all" ||
      (selectedStatus === "upcoming" && m.status === "upcoming") ||
      (selectedStatus === "finished" && m.status === "finished");
    return matchCat && matchStat;
  });

  const handleShareWhatsApp = (match: Match) => {
    const text = generateMatchAnnouncementWhatsApp(
      match.opponent,
      match.category,
      match.matchDate,
      match.matchTime,
      match.location,
      match.locationUrl
    );
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-golden-500/15 border border-golden-500/40 text-golden-400 text-xs font-black uppercase tracking-wider">
          <CalendarIcon className="w-4 h-4" />
          <span>Temporada Oficial Guanacaste 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Calendario de <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500">Partidos & Fogueos</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
          Programación oficial de encuentros, clásicos provinciales, sedes y marcadores en vivo de <strong>Golden Sport Academy Santa Cruz</strong>.
        </p>
      </div>

      {/* AFICHE OFICIAL DESTACADO - JORNADA DE PARTIDOS 5 DE SEPTIEMBRE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-2 border-golden-500/50 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Imagen del Afiche */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border-2 border-golden-500 shadow-2xl group">
            <Image
              src="/partidos/IMG-20260827-WA0018.jpg"
              alt="Jornada de Partidos 5 de Septiembre - Gimnasio Municipal de Liberia"
              width={400}
              height={580}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
              <a
                href="/partidos/IMG-20260827-WA0018.jpg"
                download="Jornada_Partidos_Golden_Sport.jpg"
                className="px-4 py-2 rounded-xl bg-golden-500 text-dark-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Afiche HD</span>
              </a>
            </div>
          </div>
        </div>

        {/* Datos Clave de la Jornada */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
          <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500 text-dark-950 text-xs font-black uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>Próxima Jornada Intercantonal</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase">
              <Ticket className="w-3.5 h-3.5" />
              <span>Entrada Gratuita</span>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Gran Jornada de Partidos
            </h2>
            <div className="text-xl sm:text-2xl font-black text-golden-400 tracking-wider">
              ¡EL BALONCESTO NOS UNE!
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-golden-500/30 space-y-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase">Fecha</span>
              <div className="text-sm font-black text-white flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-golden-500" />
                <span>Sábado 5 de Septiembre, 2026</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-golden-500/30 space-y-1">
              <span className="text-[11px] text-gray-400 font-bold uppercase">Lugar / Sede</span>
              <div className="text-sm font-black text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-golden-500" />
                <span>Gimnasio Municipal de Liberia</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Nuestros equipos de <strong>Golden Sport Academy Santa Cruz</strong> se trasladan a Liberia para una fecha completa de partidos desde las <strong>8:00 AM hasta las 2:00 PM</strong> frente a <strong>Golden Sport Academy Liberia</strong> y <strong>Parajeles</strong>. ¡Ven a apoyar a nuestros atletas!
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <a
              href="https://maps.google.com/?q=Gimnasio+Municipal+de+Liberia"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <Navigation className="w-4 h-4" />
              <span>Cómo llegar en Maps</span>
            </a>
            <a
              href="https://waze.com/ul?q=Gimnasio+Municipal+Liberia"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-golden-400 font-bold text-xs uppercase flex items-center gap-2 border border-golden-500/30 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Abrir en Waze</span>
            </a>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-dark-900 border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedStatus === "all"
                  ? "bg-golden-500 text-dark-950 shadow-md font-black"
                  : "bg-dark-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              Todos los Encuentros ({matches.length})
            </button>
            <button
              onClick={() => setSelectedStatus("upcoming")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedStatus === "upcoming"
                  ? "bg-golden-500 text-dark-950 shadow-md font-black"
                  : "bg-dark-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              Próximos ({matches.filter((m) => m.status === "upcoming").length})
            </button>
            <button
              onClick={() => setSelectedStatus("finished")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedStatus === "finished"
                  ? "bg-golden-500 text-dark-950 shadow-md font-black"
                  : "bg-dark-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              Jugados ({matches.filter((m) => m.status === "finished").length})
            </button>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-golden-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-golden-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Categoría: {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          <div className="w-10 h-10 border-2 border-golden-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Cargando cartelera oficial...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="py-16 text-center bg-dark-900 rounded-3xl border border-gray-800 space-y-3">
          <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No hay partidos para este filtro</h3>
          <p className="text-xs text-gray-400">Intente seleccionando otra categoría o estado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => {
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
                className={`rounded-3xl p-6 transition-all space-y-4 flex flex-col justify-between shadow-xl ${
                  isSantaCruzMatch
                    ? "bg-dark-900 border-2 border-golden-500/60 hover:border-golden-400"
                    : "bg-dark-900/90 border border-gray-800 hover:border-golden-500/40"
                }`}
              >
                {/* Header card info */}
                <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500/20 text-golden-400 border border-golden-500/30">
                    {match.category}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Clock className="w-3.5 h-3.5" />
                    {match.matchTime}
                  </span>
                </div>

                {/* Match Title / VS con Nombre Completo: Golden Sport Academy Santa Cruz */}
                <div className="space-y-2 py-2">
                  <div className="text-xs text-golden-400 font-bold uppercase">
                    5 de Septiembre, 2026
                  </div>
                  
                  <div className="text-base font-black text-white">
                    {match.id === "mtc-lib-1" && (
                      <div className="space-y-1">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white text-lg">Golden Sport Academy Santa Cruz ⭐</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-2" && (
                      <div className="space-y-1">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white">Parajeles</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-3" && (
                      <div className="space-y-1">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white">Parajeles (U12 Mixto)</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-4" && (
                      <div className="space-y-1">
                        <div className="text-golden-400">Golden Sport Academy Liberia</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-white">Parajeles (U14 Masc)</div>
                      </div>
                    )}
                    {match.id === "mtc-lib-5" && (
                      <div className="space-y-1">
                        <div className="text-white text-lg">Golden Sport Academy Santa Cruz ⭐</div>
                        <div className="text-xs text-gray-400 font-bold">vs</div>
                        <div className="text-golden-400">Parajeles (U12 Mixto)</div>
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

                {/* Match Summary */}
                {match.summary && (
                  <p className="text-xs text-gray-300 bg-dark-950/70 p-3 rounded-xl border border-gray-800 leading-relaxed italic">
                    "{match.summary}"
                  </p>
                )}

                {/* Location & Buttons */}
                <div className="space-y-2 pt-2 border-t border-gray-800 text-xs text-gray-300">
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-golden-400 shrink-0" />
                    <span className="truncate">{match.location}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      onClick={() => handleShareWhatsApp(match)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                      title="Compartir en WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <Link
                      href="/galeria"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-golden-400 text-xs font-bold border border-golden-500/30 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Fotos</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
