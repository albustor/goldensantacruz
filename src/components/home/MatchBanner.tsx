"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Radio,
  Camera,
  MapPin,
  Calendar,
  ExternalLink,
  Volume2,
  VolumeX,
  Music,
  Edit3,
  Check,
  Plus,
  Minus,
  Sliders,
} from "lucide-react";
import { INITIAL_LIVE_STREAM_CONFIG } from "@/lib/initialData";
import { Store } from "@/lib/store";

const PRESET_CATEGORIES = [
  "Niños Pequeños (Formativo)",
  "Baby Básquet (U6 - U8)",
  "Mini-Básquet (U8 - U10)",
  "Infantil Mixto (U10 - U12)",
  "Categoría U12",
  "Categoría U14",
];

const AUDIO_TRACKS = [
  { id: "himno_hoy", label: "🔥 Canción Oficial del Partido (Bucle)", src: "/audio/golden_lapaz_loop.mp3" },
  { id: "cancha", label: "🏀 Modo Cancha (Bucle)", src: "/audio/modo_cancha.mp3" },
  { id: "beat", label: "⚡ Ritmo Deportivo (Bucle)", src: "/audio/golden-court-loop.mp3" },
  { id: "inst", label: "🎵 Instrumental Épico (Bucle)", src: "/audio/instrumental.mp3" },
];

export default function MatchBanner() {
  const [homeScore, setHomeScore] = useState<number>(
    INITIAL_LIVE_STREAM_CONFIG.scoreboard.homeScore ?? 0
  );
  const [awayScore, setAwayScore] = useState<number>(
    INITIAL_LIVE_STREAM_CONFIG.scoreboard.awayScore ?? 0
  );
  const [homeTeam, setHomeTeam] = useState<string>(
    INITIAL_LIVE_STREAM_CONFIG.scoreboard.homeTeam || "La Paz Community School Tempisque"
  );
  const [awayTeam, setAwayTeam] = useState<string>(
    INITIAL_LIVE_STREAM_CONFIG.scoreboard.awayTeam || "Golden Sport Academy Santa Cruz"
  );
  const [category, setCategory] = useState<string>(
    INITIAL_LIVE_STREAM_CONFIG.category || "Niños Pequeños (Formativo)"
  );
  const [publishedPhotosCount, setPublishedPhotosCount] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(true);

  // Edición rápida en pantalla de la Categoría y Marcador
  const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>("");
  const [savingCategory, setSavingCategory] = useState<boolean>(false);
  const [showQuickScoreControls, setShowQuickScoreControls] = useState<boolean>(false);

  // Audio / Música en Bucle
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [selectedTrackIdx, setSelectedTrackIdx] = useState<number>(0);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const syncLiveMatch = async () => {
      try {
        const res = await fetch("/api/live-sync", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (data?.config?.scoreboard) {
          setHomeScore(data.config.scoreboard.homeScore ?? 0);
          setAwayScore(data.config.scoreboard.awayScore ?? 0);
          if (data.config.scoreboard.homeTeam) setHomeTeam(data.config.scoreboard.homeTeam);
          if (data.config.scoreboard.awayTeam) setAwayTeam(data.config.scoreboard.awayTeam);
        }
        if (data?.config?.category && !isEditingCategory) {
          setCategory(data.config.category);
        }
        if (typeof data?.config?.isLive === "boolean") {
          setIsLive(data.config.isLive);
        }
        if (Array.isArray(data?.publishedPhotos)) {
          setPublishedPhotosCount(data.publishedPhotos.length);
        }
      } catch {
        // Ignorar errores transitorios de red
      }
    };

    syncLiveMatch();
    const interval = setInterval(syncLiveMatch, 4000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isEditingCategory]);

  const toggleMusic = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlayingMusic) {
      el.pause();
      setIsPlayingMusic(false);
    } else {
      try {
        el.volume = 0.55;
        await el.play();
        setIsPlayingMusic(true);
      } catch (err) {
        console.warn("No se pudo iniciar el audio:", err);
      }
    }
  };

  const handleTrackChange = async (idx: number) => {
    setCustomAudioUrl(null);
    setSelectedTrackIdx(idx);
    const el = audioRef.current;
    if (!el) return;
    el.src = AUDIO_TRACKS[idx].src;
    if (isPlayingMusic) {
      try {
        await el.play();
      } catch {}
    }
  };

  const handleUploadCustomMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setCustomAudioUrl(blobUrl);
    setCustomAudioName(file.name);
    const el = audioRef.current;
    if (el) {
      el.src = blobUrl;
      el.loop = true;
      el.volume = 0.65;
      try {
        await el.play();
        setIsPlayingMusic(true);
      } catch {}
    }
  };

  const handleSaveCategory = async (newCat: string) => {
    const clean = newCat.trim();
    if (!clean) return;
    setSavingCategory(true);
    setCategory(clean);
    try {
      await Store.updateLiveStreamConfig({ category: clean });
    } catch {}
    setSavingCategory(false);
    setIsEditingCategory(false);
  };

  const handleQuickScore = async (team: "home" | "away", delta: number) => {
    if (team === "home") {
      const next = Math.max(0, homeScore + delta);
      setHomeScore(next);
      await Store.updateScoreboard({ homeScore: next });
    } else {
      const next = Math.max(0, awayScore + delta);
      setAwayScore(next);
      await Store.updateScoreboard({ awayScore: next });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 relative">
      {/* Reproductor de Audio Nativo en Bucle */}
      <audio
        ref={audioRef}
        src={customAudioUrl || AUDIO_TRACKS[selectedTrackIdx].src}
        loop
        preload="auto"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleUploadCustomMusic}
        className="hidden"
      />

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-950/95 via-dark-900/95 to-emerald-950/60 border-2 border-golden-500/60 p-4 sm:p-7 shadow-[0_16px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        {/* Resplandor decorativo */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-golden-500/15 blur-3xl" />

        {/* Cabecera Superior: Estado En Vivo + Categoría Editable + Música en Bucle */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 mb-4 border-b border-gray-800/90">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 text-xs font-black uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>{isLive ? "🔴 EN VIVO HOY • PARTIDO OFICIAL" : "🏀 JORNADA DE HOY"}</span>
            </div>

            {/* Insignia de Categoría Activa con Botón para Anotar/Cambiar en Pantalla */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-golden-500/20 border border-golden-500/50 text-golden-300 text-xs font-black">
              <span>🏀 Categoría:</span>
              <span className="text-white underline decoration-golden-400/60 underline-offset-2">
                {category}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCustomCategoryInput(category);
                  setIsEditingCategory((v) => !v);
                }}
                className="ml-1 px-2 py-0.5 rounded-full bg-golden-500 text-dark-950 hover:bg-golden-400 text-[10px] font-black uppercase flex items-center gap-1 transition-all"
                title="Anotar o cambiar la categoría que va a jugar"
              >
                <Edit3 className="w-2.5 h-2.5" />
                <span>Anotar Categoría</span>
              </button>
            </div>
          </div>

          {/* Controles de Música en Bucle + Ajuste Rápido de Pizarra */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleMusic}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                isPlayingMusic
                  ? "bg-emerald-500 text-dark-950 border-emerald-300 shadow-lg shadow-emerald-500/30 animate-pulse"
                  : "bg-dark-900 hover:bg-dark-800 text-golden-300 border-golden-500/40"
              }`}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>
                {isPlayingMusic
                  ? `🔊 En Bucle: ${customAudioName ? customAudioName.slice(0, 16) : "ACTIVA"}`
                  : "🎵 Activar Música en Bucle"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full bg-golden-500/20 hover:bg-golden-500/30 border border-golden-500/50 text-golden-300 text-[11px] font-black uppercase flex items-center gap-1 transition-all"
              title="Cargar el archivo de música que estás creando para reproducirlo en bucle"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Cargar Mi Música</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQuickScoreControls((v) => !v)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase border flex items-center gap-1 transition-all ${
                showQuickScoreControls
                  ? "bg-golden-500 text-dark-950 border-golden-300"
                  : "bg-dark-900 text-gray-300 border-gray-700 hover:border-golden-500/40"
              }`}
              title="Mostrar botones +1 / +2 / -1 directamente en la tarjeta"
            >
              <Sliders className="w-3 h-3" />
              <span>{showQuickScoreControls ? "Ocultar +/-" : "Marcador +/-"}</span>
            </button>
          </div>
        </div>

        {/* Panel Desplegable para Anotar la Categoría que va a Jugar */}
        {isEditingCategory && (
          <div className="mb-5 p-4 rounded-2xl bg-dark-950/95 border-2 border-golden-500/60 space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-black uppercase text-golden-400 tracking-wider">
                ✏️ Escribe o selecciona la categoría que está por jugar en cancha:
              </span>
              <button
                type="button"
                onClick={() => setIsEditingCategory(false)}
                className="text-xs text-gray-400 hover:text-white font-bold self-end sm:self-auto"
              >
                Cerrar ✕
              </button>
            </div>

            {/* Botones Rápidos de Categorías */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CATEGORIES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSaveCategory(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    category === preset
                      ? "bg-golden-500 text-dark-950 border-golden-300 font-black"
                      : "bg-dark-900 hover:bg-dark-800 text-gray-200 border-gray-700"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Campo Libre para Escribir Cualquier Categoría */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCategory(customCategoryInput);
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="Escribe aquí la categoría (ej: Niños 6-8 años / Partido 1)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-dark-900 border border-golden-500/50 text-white text-xs font-bold focus:border-golden-400 outline-none"
              />
              <button
                type="submit"
                disabled={savingCategory}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>{savingCategory ? "Guardando..." : "Guardar en Pantalla"}</span>
              </button>
            </form>
          </div>
        )}

        {/* Grilla Central del Enfrentamiento: 1° La Paz Community School Tempisque (Local) vs 2° Golden Sport Academy Santa Cruz (Visita) */}
        <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 sm:gap-6">
          {/* EQUIPO 1 (CASA / LOCAL): La Paz Community School Tempisque */}
          <div className="md:col-span-3 flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-dark-900/90 border border-emerald-500/40 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="w-28 h-16 sm:w-32 sm:h-16 rounded-2xl bg-[#FCFBF9] border-2 border-emerald-500/60 p-2 flex items-center justify-center shadow-md shrink-0">
                  <Image
                    src="/logo-la-paz-tempisque.png"
                    alt="La Paz Community School Tempisque"
                    width={120}
                    height={52}
                    className="object-contain max-h-12 w-auto"
                    priority
                  />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider mb-1">
                    🏠 Equipo Local
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                    {homeTeam}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center px-4 py-2 rounded-2xl bg-dark-950 border border-emerald-500/40 min-w-[86px]">
                <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tighter">
                  {homeScore}
                </span>
                <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">
                  Puntos
                </span>
              </div>
            </div>

            {showQuickScoreControls && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => handleQuickScore("home", 1)}
                  className="py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-black text-xs"
                >
                  +1 Punto
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickScore("home", 2)}
                  className="py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs"
                >
                  +2 Canasta
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickScore("home", -1)}
                  className="py-2 rounded-xl bg-dark-800 hover:bg-dark-700 border border-gray-700 text-gray-300 font-bold text-xs"
                >
                  -1 Corregir
                </button>
              </div>
            )}
          </div>

          {/* CENTRO: VS Simplificado (Solo Marcador para Niños Pequeños) */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center py-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-golden-400 to-amber-600 text-dark-950 font-black text-base flex items-center justify-center shadow-lg shadow-golden-500/30 border-2 border-golden-200">
              VS
            </div>
            <span className="text-[10px] font-black uppercase text-golden-400 tracking-widest mt-1.5">
              Marcador
            </span>
            <span className="text-[9px] text-gray-400 font-bold">En Directo</span>
          </div>

          {/* EQUIPO 2 (VISITA): Golden Sport Academy Santa Cruz */}
          <div className="md:col-span-3 flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-dark-900/90 border border-golden-500/50 shadow-lg">
            <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row-reverse items-center gap-3 text-center sm:text-right">
                <div className="w-16 h-16 sm:w-20 sm:h-16 rounded-2xl bg-dark-950 border-2 border-golden-500 p-1.5 flex items-center justify-center shadow-md shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Golden Sport Academy Santa Cruz"
                    width={60}
                    height={60}
                    className="object-contain max-h-13 w-auto"
                    priority
                  />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-golden-500/20 text-golden-300 border border-golden-500/40 text-[10px] font-black uppercase tracking-wider mb-1">
                    🚌 Equipo Visita
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-golden-400 leading-snug">
                    {awayTeam}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center px-4 py-2 rounded-2xl bg-dark-950 border border-golden-500/50 min-w-[86px]">
                <span className="text-4xl sm:text-5xl font-black font-mono text-golden-400 tracking-tighter drop-shadow-[0_2px_12px_rgba(234,179,8,0.4)]">
                  {awayScore}
                </span>
                <span className="text-[9px] font-extrabold uppercase text-gray-400 tracking-wider">
                  Puntos
                </span>
              </div>
            </div>

            {showQuickScoreControls && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => handleQuickScore("away", 1)}
                  className="py-2 rounded-xl bg-golden-500/20 hover:bg-golden-500/30 border border-golden-500/40 text-golden-300 font-black text-xs"
                >
                  +1 Punto
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickScore("away", 2)}
                  className="py-2 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs"
                >
                  +2 Canasta
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickScore("away", -1)}
                  className="py-2 rounded-xl bg-dark-800 hover:bg-dark-700 border border-gray-700 text-gray-300 font-bold text-xs"
                >
                  -1 Corregir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Barra Inferior: Sede + Botones a Video en Vivo y Fotos en Tiempo Real */}
        <div className="mt-5 pt-4 border-t border-gray-800/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-300 font-medium">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gimnasio La Paz Community School Tempisque</span>
            </span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span>
              Cobertura en vivo por <strong className="text-golden-400">Curiol Studio</strong>
              {publishedPhotosCount > 0 ? ` (${publishedPhotosCount} fotos en vivo)` : ""}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/en-vivo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-golden-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-950/60 transition-all hover:scale-[1.02]"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>🔴 Ver Transmisión y Fotos en Vivo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/en-vivo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-black text-xs uppercase tracking-wider transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>📸 Ver Fotos en Tiempo Real</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
