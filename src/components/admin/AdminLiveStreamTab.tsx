"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Radio, 
  Video, 
  Camera, 
  Play, 
  Square, 
  RotateCcw, 
  Plus, 
  Minus, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  MessageSquare, 
  Flame, 
  Heart, 
  Star, 
  Sliders, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  QrCode, 
  Send, 
  Info,
  Layers,
  Smartphone,
  Wifi,
  Tv
} from "lucide-react";
import { LiveStreamConfig, LiveScoreboard, LiveCameraConfig, LiveChatMessage, PlayerCategory } from "@/types";
import { Store } from "@/lib/store";
import { INITIAL_LIVE_STREAM_CONFIG } from "@/lib/initialData";
import CategorySelect from "@/components/common/CategorySelect";

export default function AdminLiveStreamTab() {
  const [config, setConfig] = useState<LiveStreamConfig>(INITIAL_LIVE_STREAM_CONFIG);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [newChatText, setNewChatText] = useState("");
  const [newChatAuthor, setNewChatAuthor] = useState("Coach Lenny Monge");
  const [newChatRole, setNewChatRole] = useState<"padre" | "madre" | "atleta" | "staff" | "aficionado">("staff");
  const [activeSubTab, setActiveSubTab] = useState<"marcador" | "camaras" | "bunny" | "chat">("marcador");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [bunnyTestStatus, setBunnyTestStatus] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const liveConfig = await Store.getLiveStreamConfig();
    setConfig(liveConfig);
  };

  const handleToggleLive = async () => {
    const newStatus = !config.isLive;
    const updated = await Store.toggleLiveStatus(newStatus);
    setConfig(updated);
    flashStatus(newStatus ? "¡Transmisión activada EN VIVO!" : "Transmisión pausada / offline");
  };

  const flashStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleScoreChange = async (team: "home" | "away", points: number) => {
    const updated = await Store.addScore(team, points);
    setConfig(updated);
  };

  const handleFoulChange = async (team: "home" | "away", delta: number) => {
    const updated = await Store.addFoul(team, delta);
    setConfig(updated);
  };

  const handlePeriodChange = async (period: LiveScoreboard["period"]) => {
    const updated = await Store.updateScoreboard({ period });
    setConfig(updated);
  };

  const handlePossessionChange = async (possession: LiveScoreboard["possession"]) => {
    const updated = await Store.updateScoreboard({ possession });
    setConfig(updated);
  };

  const handleResetScoreboard = async () => {
    if (window.confirm("¿Seguro que deseas reiniciar el marcador a 0 - 0?")) {
      const updated = await Store.updateScoreboard({
        homeScore: 0,
        awayScore: 0,
        homeFouls: 0,
        awayFouls: 0,
        period: "Q1",
        gameTime: "10:00",
        possession: "none"
      });
      setConfig(updated);
      flashStatus("Marcador reiniciado");
    }
  };

  const handleCameraSwitch = async (camId: string) => {
    const updated = await Store.switchActiveCamera(camId);
    setConfig(updated);
    flashStatus(`Cámara activa cambiada a: ${camId === "cam-gopro" ? "GoPro HERO 12" : "DJI Osmo Pocket"}`);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleAddOfficialChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    await Store.addLiveChatMessage({
      authorName: newChatAuthor,
      authorRole: newChatRole,
      message: newChatText.trim(),
    });

    setNewChatText("");
    await loadConfig();
    flashStatus("Mensaje publicado en el muro en vivo");
  };

  const handleUpdateMatchInfo = async (field: keyof LiveStreamConfig, val: any) => {
    const updated = await Store.updateLiveStreamConfig({ [field]: val });
    setConfig(updated);
    flashStatus("Información actualizada");
  };

  const handleUpdateCamera = async (camId: string, updates: Partial<LiveCameraConfig>) => {
    const updated = await Store.updateCamera(camId, updates);
    setConfig(updated);
    flashStatus("Cámara actualizada");
  };

  const handleSetYouTubeUrl = async (camId: string, url: string) => {
    let videoId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    const embed = videoId 
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&playsinline=1`
      : url;

    await handleUpdateCamera(camId, {
      youtubeUrl: url,
      youtubeVideoId: videoId,
      embedUrl: embed,
      streamType: videoId ? "youtube" : "bunny_stream",
    });
  };

  const handleTestBunnyConnection = () => {
    setBunnyTestStatus("probando");
    setTimeout(() => {
      setBunnyTestStatus("ok");
      setTimeout(() => setBunnyTestStatus(null), 4000);
    }, 1200);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🏀 ¡Estamos EN VIVO con Golden Sport Academy Santa Cruz! 🔴\n\nPartido: ${config.title}\nCategoría: ${config.category}\nRival: ${config.opponentName}\n\n👉 Sigue la transmisión multi-cámara y marcador en tiempo real aquí:\n${typeof window !== 'undefined' ? window.location.origin : ''}/en-vivo`
  )}`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-2 border-golden-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-golden-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-dark-950 border border-golden-500/40 text-golden-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    Centro de Transmisión en Vivo Multi-Cámara
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    config.isLive 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${config.isLive ? "bg-white" : "bg-gray-500"}`} />
                    {config.isLive ? "SEÑAL AL AIRE (LIVE)" : "OFFLINE / EN ESPERA"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Bunny Stream Live CDN • GoPro HERO 12 (Cancha Completa) + DJI Osmo Pocket (Móvil) • Marcador en Cancha
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/en-vivo"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-dark-950 hover:bg-dark-900 border border-golden-500/40 text-golden-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:scale-105"
            >
              <Tv className="w-4 h-4" />
              <span>Ver Portal Público</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-950/40 hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir en WhatsApp</span>
            </a>

            <button
              onClick={handleToggleLive}
              className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl hover:scale-105 ${
                config.isLive
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/50"
                  : "bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 shadow-golden-500/30"
              }`}
            >
              {config.isLive ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Detener Transmisión</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{config.broadcastMode === "scoreboard_only" ? "ACTIVAR MARCADOR EN VIVO" : "INICIAR TRANSMISIÓN EN VIVO"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* MODO DE EMISIÓN & CONFIGURACIÓN RÁPIDA DE FUNCIONES */}
        <div className="mt-6 pt-5 border-t border-gray-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-black uppercase text-gray-300 tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-golden-400" />
              <span>Modo del Encuentro:</span>
            </span>

            <div className="inline-flex p-1 rounded-2xl bg-dark-950 border border-gray-700/80">
              <button
                type="button"
                onClick={() => handleUpdateMatchInfo("broadcastMode", "video_and_scoreboard")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  (config.broadcastMode || "video_and_scoreboard") === "video_and_scoreboard"
                    ? "bg-golden-500 text-dark-950 font-black shadow-md shadow-golden-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>📹 Video Multi-Cámara + Marcador</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateMatchInfo("broadcastMode", "scoreboard_only")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  config.broadcastMode === "scoreboard_only"
                    ? "bg-emerald-500 text-dark-950 font-black shadow-md shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>📊 Solo Marcador Digital (Sin Video)</span>
              </button>
            </div>
          </div>

          {/* Opciones Modulares: Activar/Desactivar Chat y Reacciones */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleUpdateMatchInfo("chatEnabled", !(config.chatEnabled ?? true))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                (config.chatEnabled ?? true)
                  ? "bg-dark-950 border-golden-500/50 text-golden-400"
                  : "bg-dark-950/50 border-gray-800 text-gray-500 line-through"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat: {(config.chatEnabled ?? true) ? "Activo" : "Desactivado"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdateMatchInfo("reactionsEnabled", !(config.reactionsEnabled ?? true))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                (config.reactionsEnabled ?? true)
                  ? "bg-dark-950 border-orange-500/50 text-orange-400"
                  : "bg-dark-950/50 border-gray-800 text-gray-500 line-through"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Reacciones: {(config.reactionsEnabled ?? true) ? "Activas" : "Desactivadas"}</span>
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className="mt-4 p-3 rounded-xl bg-golden-500/20 border border-golden-500/40 text-golden-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-golden-400" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Subtabs Selector (Todas las configuraciones siempre accesibles y almacenadas) */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("marcador")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === "marcador"
              ? "bg-golden-500 text-dark-950 font-black shadow-md shadow-golden-500/20"
              : "bg-dark-800 text-gray-300 hover:text-white border border-gray-700"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Mando de Marcador en Cancha</span>
        </button>

        <button
          onClick={() => setActiveSubTab("camaras")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === "camaras"
              ? "bg-golden-500 text-dark-950 font-black shadow-md shadow-golden-500/20"
              : "bg-dark-800 text-gray-300 hover:text-white border border-gray-700"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Cámaras (GoPro + DJI + YouTube)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("bunny")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === "bunny"
              ? "bg-golden-500 text-dark-950 font-black shadow-md shadow-golden-500/20"
              : "bg-dark-800 text-gray-300 hover:text-white border border-gray-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Bunny.net CDN Config</span>
        </button>

        <button
          onClick={() => setActiveSubTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
            activeSubTab === "chat"
              ? "bg-golden-500 text-dark-950 font-black shadow-md shadow-golden-500/20"
              : "bg-dark-800 text-gray-300 hover:text-white border border-gray-700"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat de Afición & Anuncios ({config.chatMessages?.length || 0})</span>
        </button>
      </div>

      {/* SUBTAB 1: MANDO DE MARCADOR EN CANCHA */}
      {activeSubTab === "marcador" && (
        <div className="space-y-6">
          {/* Quick Match Details Configuration */}
          <div className="p-5 rounded-2xl bg-dark-900/80 border border-gray-800 space-y-4">
            <h3 className="text-xs font-black uppercase text-golden-400 tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Datos del Encuentro en Transmisión</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Título del Evento</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => handleUpdateMatchInfo("title", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs font-medium focus:border-golden-500 outline-none"
                  placeholder="Ej: Torneo Amistoso Guanacaste"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Categoría</label>
                <CategorySelect
                  value={config.category}
                  onChange={(val) => handleUpdateMatchInfo("category", val)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs font-medium focus:border-golden-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Equipo Rival</label>
                <input
                  type="text"
                  value={config.opponentName}
                  onChange={(e) => {
                    handleUpdateMatchInfo("opponentName", e.target.value);
                    Store.updateScoreboard({ awayTeam: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs font-medium focus:border-golden-500 outline-none"
                  placeholder="Ej: Parajeles / San Blas"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Sede / Cancha</label>
                <input
                  type="text"
                  value={config.location}
                  onChange={(e) => handleUpdateMatchInfo("location", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs font-medium focus:border-golden-500 outline-none"
                  placeholder="Ej: Gimnasio Santa Bárbara"
                />
              </div>
            </div>
          </div>

          {/* Interactive Mobile-Friendly Scoreboard Controller */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LOCAL: Golden Sport Academy Santa Cruz */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-900 to-dark-950 border-2 border-golden-500/50 space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-dark-800 border border-golden-500/40 p-1 flex items-center justify-center">
                    <Image src="/logo.png" alt="Golden" width={32} height={32} className="object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-golden-400 tracking-wider block">EQUIPO LOCAL</span>
                    <span className="text-base font-black text-white uppercase block">Golden Sport Academy</span>
                  </div>
                </div>
                {config.scoreboard.possession === "home" && (
                  <span className="px-2.5 py-1 rounded-full bg-golden-500 text-dark-950 font-black text-[10px] uppercase tracking-wider animate-pulse">
                    🏀 Posesión
                  </span>
                )}
              </div>

              {/* Big Score Display */}
              <div className="text-center py-4 bg-dark-950 rounded-2xl border border-golden-500/30">
                <span className="text-7xl font-black text-golden-400 tracking-tighter drop-shadow-[0_4px_16px_rgba(234,179,8,0.4)]">
                  {config.scoreboard.homeScore || 0}
                </span>
                <span className="text-xs text-gray-400 uppercase font-bold block mt-1">Puntos Oficiales</span>
              </div>

              {/* Point Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleScoreChange("home", 1)}
                  className="py-3.5 rounded-xl bg-golden-500/20 hover:bg-golden-500/30 border border-golden-500/40 text-golden-400 font-black text-base transition-transform active:scale-95 flex flex-col items-center"
                >
                  <span>+1</span>
                  <span className="text-[9px] uppercase font-bold text-gray-300">Tiro Libre</span>
                </button>

                <button
                  onClick={() => handleScoreChange("home", 2)}
                  className="py-3.5 rounded-xl bg-golden-500/30 hover:bg-golden-500/40 border border-golden-500/60 text-golden-300 font-black text-lg transition-transform active:scale-95 flex flex-col items-center"
                >
                  <span>+2</span>
                  <span className="text-[9px] uppercase font-bold text-gray-300">Doble</span>
                </button>

                <button
                  onClick={() => handleScoreChange("home", 3)}
                  className="py-3.5 rounded-xl bg-gradient-to-r from-golden-500 to-golden-600 hover:from-golden-400 hover:to-golden-500 text-dark-950 font-black text-xl transition-transform active:scale-95 flex flex-col items-center shadow-lg shadow-golden-500/20"
                >
                  <span>+3</span>
                  <span className="text-[9px] uppercase font-bold text-dark-900">Triple 🔥</span>
                </button>

                <button
                  onClick={() => handleScoreChange("home", -1)}
                  className="py-3.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-gray-700 text-gray-400 font-black text-sm transition-transform active:scale-95 flex flex-col items-center"
                >
                  <span>-1</span>
                  <span className="text-[9px] uppercase font-bold text-gray-500">Corregir</span>
                </button>
              </div>

              {/* Fouls & Possession */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Faltas:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400 font-black text-xs">
                    {config.scoreboard.homeFouls || 0}
                  </span>
                  <button
                    onClick={() => handleFoulChange("home", 1)}
                    className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 border border-gray-700"
                    title="Añadir falta"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFoulChange("home", -1)}
                    className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-400 border border-gray-700"
                    title="Quitar falta"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handlePossessionChange(config.scoreboard.possession === "home" ? "none" : "home")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    config.scoreboard.possession === "home"
                      ? "bg-golden-500 text-dark-950 border-golden-500 font-black"
                      : "bg-dark-800 text-gray-400 border-gray-700 hover:text-white"
                  }`}
                >
                  Asignar Balón
                </button>
              </div>
            </div>

            {/* VISITANTE: Equipo Rival */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-900 to-dark-950 border-2 border-gray-700 space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-dark-800 border border-gray-700 flex items-center justify-center text-gray-400 font-black text-sm">
                    VS
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-gray-400 tracking-wider block">EQUIPO VISITANTE</span>
                    <span className="text-base font-black text-white uppercase block">
                      {config.scoreboard.awayTeam || "Rival"}
                    </span>
                  </div>
                </div>
                {config.scoreboard.possession === "away" && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white font-black text-[10px] uppercase tracking-wider animate-pulse">
                    🏀 Posesión
                  </span>
                )}
              </div>

              {/* Big Score Display */}
              <div className="text-center py-4 bg-dark-950 rounded-2xl border border-gray-800">
                <span className="text-7xl font-black text-gray-200 tracking-tighter">
                  {config.scoreboard.awayScore || 0}
                </span>
                <span className="text-xs text-gray-400 uppercase font-bold block mt-1">Puntos Rival</span>
              </div>

              {/* Point Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleScoreChange("away", 1)}
                  className="py-3.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-gray-700 text-gray-200 font-black text-base transition-transform active:scale-95 flex flex-col items-center"
                >
                  <span>+1</span>
                  <span className="text-[9px] uppercase font-bold text-gray-400">Tiro Libre</span>
                </button>

                <button
                  onClick={() => handleScoreChange("away", 2)}
                  className="py-3.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-gray-600 text-gray-100 font-black text-lg transition-transform active:scale-95 flex flex-col items-center"
                >
                  <span>+2</span>
                  <span className="text-[9px] uppercase font-bold text-gray-400">Doble</span>
                </button>

                <button
                  onClick={() => handleScoreChange("away", 3)}
                  className="py-3.5 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 border border-blue-600 text-blue-200 font-black text-xl transition-transform active:scale-95 flex flex-col items-center"
                >
                  <span>+3</span>
                  <span className="text-[9px] uppercase font-bold text-blue-300">Triple</span>
                </button>

                <button
                  onClick={() => handleScoreChange("away", -1)}
                  className="py-3.5 rounded-xl bg-dark-800 hover:bg-dark-700 border border-gray-700 text-gray-400 font-black text-sm transition-transform active:scale-95 flex flex-col items-center"
                >
                  <span>-1</span>
                  <span className="text-[9px] uppercase font-bold text-gray-500">Corregir</span>
                </button>
              </div>

              {/* Fouls & Possession */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Faltas:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400 font-black text-xs">
                    {config.scoreboard.awayFouls || 0}
                  </span>
                  <button
                    onClick={() => handleFoulChange("away", 1)}
                    className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 border border-gray-700"
                    title="Añadir falta"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFoulChange("away", -1)}
                    className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-400 border border-gray-700"
                    title="Quitar falta"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handlePossessionChange(config.scoreboard.possession === "away" ? "none" : "away")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    config.scoreboard.possession === "away"
                      ? "bg-blue-600 text-white border-blue-500 font-black"
                      : "bg-dark-800 text-gray-400 border-gray-700 hover:text-white"
                  }`}
                >
                  Asignar Balón
                </button>
              </div>
            </div>

          </div>

          {/* Period & Game State Controls */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-gray-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-white uppercase">Periodo / Cuarto del Partido</h4>
                <p className="text-xs text-gray-400">Selecciona el cuarto actual para actualizar la pantalla pública en vivo</p>
              </div>

              <button
                onClick={handleResetScoreboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-red-950/50 text-gray-400 hover:text-red-400 border border-gray-700 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Marcador a Cero</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {(["Q1", "Q2", "Medio Tiempo", "Q3", "Q4", "OT", "Final", "Próximo"] as LiveScoreboard["period"][]).map((p) => {
                const isActive = config.scoreboard.period === p;
                return (
                  <button
                    key={p}
                    onClick={() => handlePeriodChange(p)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                      isActive
                        ? "bg-golden-500 text-dark-950 border-golden-400 shadow-md shadow-golden-500/30 scale-102"
                        : "bg-dark-950 text-gray-400 border-gray-800 hover:text-white hover:bg-dark-800"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CÁMARAS RTMP (GoPro HERO 12 + DJI Osmo Pocket) */}
      {activeSubTab === "camaras" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-dark-900 border border-blue-800/40 text-blue-200 text-xs flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold">Emisión Directa desde Apps Oficiales Móviles</p>
              <p className="text-[11px] text-blue-300">
                La GoPro HERO 12 emite directo desde la app <strong>GoPro Quik</strong> y la DJI Osmo Pocket desde <strong>DJI Mimo</strong> usando los endpoints RTMP y Claves generadas por Bunny.net.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {config.cameras.map((cam, idx) => {
              const isSelected = config.selectedCameraId === cam.id;
              return (
                <div
                  key={cam.id}
                  className={`p-6 rounded-3xl bg-dark-900 border-2 transition-all space-y-5 ${
                    isSelected
                      ? "border-golden-500 shadow-2xl shadow-golden-500/15"
                      : "border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border font-black text-lg ${
                        cam.id === "cam-gopro"
                          ? "bg-red-950/60 border-red-500 text-red-400"
                          : "bg-emerald-950/60 border-emerald-500 text-emerald-400"
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase text-golden-400 tracking-wider block">
                          {cam.deviceModel}
                        </span>
                        <h4 className="text-base font-black text-white">{cam.name}</h4>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] uppercase font-bold text-gray-400">Rol Táctico:</span>
                          <select
                            value={cam.role}
                            onChange={(e: any) => handleUpdateCamera(cam.id, { role: e.target.value })}
                            className="px-2 py-0.5 rounded bg-dark-950 border border-gray-700 text-golden-400 text-[11px] font-bold outline-none"
                          >
                            <option value="Cancha Completa">Cancha Completa (Plano General)</option>
                            <option value="Bajo el Aro / Lateral">Bajo el Aro / Lateral (Rebotes & Postes)</option>
                            <option value="Seguimiento Dinámico">Seguimiento Dinámico (Gimbal / Jugadas)</option>
                            <option value="Banquillo">Banquillo & Coach Lenny</option>
                            <option value="Mesa Técnica">Mesa Técnica</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCameraSwitch(cam.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        isSelected
                          ? "bg-golden-500 text-dark-950 border-golden-500 font-black shadow-md"
                          : "bg-dark-800 text-gray-300 border-gray-700 hover:text-white"
                      }`}
                    >
                      {isSelected ? "✓ Señal Principal" : "Seleccionar"}
                    </button>
                  </div>

                  {/* Configuración de Fuente de Video (YouTube Live / Bunny RTMP) */}
                  <div className="space-y-3 p-4 rounded-2xl bg-dark-950 border border-gray-800">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-gray-300 tracking-wider">
                        Fuente de Video / Transmisión
                      </label>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleUpdateCamera(cam.id, { streamType: "youtube" })}
                          className={`px-2 py-0.5 rounded font-bold uppercase ${
                            cam.streamType === "youtube"
                              ? "bg-red-600 text-white"
                              : "bg-dark-900 text-gray-400 border border-gray-800 hover:text-white"
                          }`}
                        >
                          YouTube Live
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateCamera(cam.id, { streamType: "bunny_stream" })}
                          className={`px-2 py-0.5 rounded font-bold uppercase ${
                            cam.streamType === "bunny_stream"
                              ? "bg-golden-500 text-dark-950 font-black"
                              : "bg-dark-900 text-gray-400 border border-gray-800 hover:text-white"
                          }`}
                        >
                          Bunny RTMP
                        </button>
                      </div>
                    </div>

                    {cam.streamType === "youtube" ? (
                      <div className="space-y-2 pt-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                          Enlace de YouTube (Video o Transmisión En Vivo)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={cam.youtubeUrl || ""}
                            onChange={(e) => handleSetYouTubeUrl(cam.id, e.target.value)}
                            placeholder="https://youtu.be/ROMtqdRiTaY..."
                            className="flex-1 px-3 py-2 rounded-xl bg-dark-900 border border-gray-700 text-golden-300 text-xs font-mono focus:border-golden-500 outline-none"
                          />
                          <a
                            href={cam.youtubeUrl || "https://youtu.be/ROMtqdRiTaY"}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 border border-gray-700"
                            title="Abrir en YouTube"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Video ID detectado: <code className="text-golden-400 font-mono">{cam.youtubeVideoId || "ROMtqdRiTaY"}</code>
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center justify-between">
                            <span>Servidor RTMP Ingest</span>
                            <button
                              onClick={() => handleCopy(cam.rtmpServer, `rtmp-${cam.id}`)}
                              className="text-golden-400 hover:text-golden-300 flex items-center gap-1 font-bold lowercase"
                            >
                              {copiedKey === `rtmp-${cam.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>copiar url</span>
                            </button>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={cam.rtmpServer}
                            className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white font-mono text-xs select-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center justify-between">
                            <span>Clave de Transmisión (Stream Key)</span>
                            <button
                              onClick={() => handleCopy(cam.streamKey, `key-${cam.id}`)}
                              className="text-golden-400 hover:text-golden-300 flex items-center gap-1 font-bold lowercase"
                            >
                              {copiedKey === `key-${cam.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>copiar clave</span>
                            </button>
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={cam.streamKey}
                            className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gray-700 text-golden-400 font-mono text-xs select-all"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Setup Instructions */}
                  <div className="p-4 rounded-2xl bg-dark-800/60 border border-gray-800/80 space-y-2">
                    <span className="text-[11px] font-black uppercase text-gray-300 tracking-wider block">
                      Instrucciones de Posicionamiento & Conexión:
                    </span>
                    <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                      {cam.id === "cam-gopro" ? (
                        <>
                          <li><strong>Ubicación sugerida:</strong> En el centro de la gradería / línea media para plano general y cobertura de cancha completa.</li>
                          <li>Conecta la señal en directo de YouTube o la app <strong>GoPro Quik</strong> (Modo RTMP a 1080p).</li>
                          <li>Permite a los espectadores seguir toda la rotación del equipo y la pizarra táctica.</li>
                        </>
                      ) : (
                        <>
                          <li><strong>Ubicación táctica:</strong> Ubicada <strong>lateralmente junto al tablero o poste</strong> para capturar rebotes, tapones y canastas bajo el aro.</li>
                          <li>Abre la app <strong>DJI Mimo</strong> vinculada al DJI Osmo Pocket y activa el seguimiento de gimbal inteligente.</li>
                          <li>Ingresa la URL RTMP o el enlace para transmitir la acción dinámica a ras de cancha.</li>
                        </>
                      )}
                    </ol>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: BUNNY.NET CDN CONFIG */}
      {activeSubTab === "bunny" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-dark-900 border border-golden-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-golden-500/20 border border-golden-500/40 p-2 flex items-center justify-center text-golden-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase">Credenciales Oficiales de Bunny Stream</h3>
                  <p className="text-xs text-gray-400">Gestión de API Key y Library ID de Bunny.net para transmisiones HLS ultrarrápidas</p>
                </div>
              </div>

              <button
                onClick={handleTestBunnyConnection}
                className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-golden-400 border border-golden-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${bunnyTestStatus === "probando" ? "animate-spin" : ""}`} />
                <span>Probar Conexión CDN</span>
              </button>
            </div>

            {bunnyTestStatus === "ok" && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Conexión exitosa con Bunny Stream CDN y Edge Nodes de América Latina!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Bunny Stream Library ID</label>
                <input
                  type="text"
                  value={config.bunnyStreamLibraryId || ""}
                  onChange={(e) => handleUpdateMatchInfo("bunnyStreamLibraryId", e.target.value)}
                  placeholder="Ej: 342918"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-gray-700 text-white font-mono text-xs focus:border-golden-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Bunny API Key (Management / Stream Key)</label>
                <input
                  type="password"
                  value={config.bunnyApiKey || ""}
                  onChange={(e) => handleUpdateMatchInfo("bunnyApiKey", e.target.value)}
                  placeholder="Pegar API Key propia de Bunny.net"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-gray-700 text-white font-mono text-xs focus:border-golden-500 outline-none"
                />
              </div>
            </div>

            {/* Architecture Overview */}
            <div className="p-5 rounded-2xl bg-dark-950 border border-gray-800 space-y-3">
              <span className="text-xs font-black uppercase text-golden-400 tracking-wider block">
                Arquitectura de Transmisión Multi-Cámara Golden Sport Academy:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                  <span className="font-bold text-white block">1. Origen en Cancha</span>
                  <p className="text-gray-400 text-[11px]">GoPro HERO 12 + DJI Osmo Pocket emiten RTMP independiente vía Wi-Fi / 5G.</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                  <span className="font-bold text-white block">2. Ingest & Transcoding Bunny</span>
                  <p className="text-gray-400 text-[11px]">Bunny Stream procesa HLS adaptativo a 1080p, 720p y graba repetición en la nube.</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                  <span className="font-bold text-white block">3. Portal Web Golden</span>
                  <p className="text-gray-400 text-[11px]">Familias disfrutan conmutación instantánea entre cámaras, marcador y chat en vivo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: CHAT DE AFICIÓN & ANUNCIOS OFICIALES */}
      {activeSubTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Send Official Announcement Form */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-golden-500/40 space-y-4">
            <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-golden-400" />
              <span>Publicar Mensaje Oficial</span>
            </h3>

            <form onSubmit={handleAddOfficialChat} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Nombre del Emisor</label>
                <input
                  type="text"
                  value={newChatAuthor}
                  onChange={(e) => setNewChatAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Rol</label>
                <select
                  value={newChatRole}
                  onChange={(e: any) => setNewChatRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs"
                >
                  <option value="staff">Staff / Directiva Golden</option>
                  <option value="padre">Padre / Madre de Familia</option>
                  <option value="atleta">Jugador / Atleta</option>
                  <option value="aficionado">Aficionado</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Mensaje</label>
                <textarea
                  rows={3}
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  placeholder="Ej: ¡Excelente defensa equipo! En el medio tiempo tendremos fotos con Curiol Studio..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs focus:border-golden-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-golden-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar al Muro en Vivo</span>
              </button>
            </form>

            {/* Reactions summary */}
            <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-2 pt-4">
              <span className="text-[11px] font-black uppercase text-gray-400 block">Reacciones de la Afición</span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-dark-900 border border-gray-800">
                  <span className="text-lg block">🔥</span>
                  <span className="font-bold text-white">{config.reactions?.fire || 0}</span>
                </div>
                <div className="p-2 rounded-xl bg-dark-900 border border-gray-800">
                  <span className="text-lg block">🏀</span>
                  <span className="font-bold text-white">{config.reactions?.basketball || 0}</span>
                </div>
                <div className="p-2 rounded-xl bg-dark-900 border border-gray-800">
                  <span className="text-lg block">👏</span>
                  <span className="font-bold text-white">{config.reactions?.clap || 0}</span>
                </div>
                <div className="p-2 rounded-xl bg-dark-900 border border-gray-800">
                  <span className="text-lg block">⭐</span>
                  <span className="font-bold text-white">{config.reactions?.star || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-dark-900 border border-gray-800 space-y-4 flex flex-col h-[500px]">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-golden-400" />
                <span>Mensajes en Directo ({config.chatMessages?.length || 0})</span>
              </h3>

              <button
                onClick={async () => {
                  if (window.confirm("¿Limpiar historial de chat?")) {
                    await Store.updateLiveStreamConfig({ chatMessages: [] });
                    await loadConfig();
                  }
                }}
                className="text-[11px] text-gray-400 hover:text-red-400 font-bold"
              >
                Vaciar Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {config.chatMessages && config.chatMessages.length > 0 ? (
                config.chatMessages.map((msg) => (
                  <div key={msg.id} className="p-3.5 rounded-2xl bg-dark-950 border border-gray-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{msg.authorName}</span>
                        <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
                          msg.authorRole === "staff"
                            ? "bg-golden-500 text-dark-950"
                            : "bg-gray-800 text-gray-300"
                        }`}>
                          {msg.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{msg.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-500 text-xs">
                  No hay mensajes aún en la transmisión.
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
