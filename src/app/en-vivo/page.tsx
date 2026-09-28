"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Radio, 
  Video, 
  Camera, 
  Eye, 
  Flame, 
  Heart, 
  Star, 
  MessageSquare, 
  Send, 
  Share2, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  Layers, 
  Smartphone,
  ExternalLink,
  Award,
  ChevronRight,
  Info
} from "lucide-react";
import { LiveStreamConfig, LiveScoreboard, LiveCameraConfig, LiveChatMessage } from "@/types";
import { Store } from "@/lib/store";
import { INITIAL_LIVE_STREAM_CONFIG } from "@/lib/initialData";

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

export default function LiveStreamPage() {
  const [config, setConfig] = useState<LiveStreamConfig>(INITIAL_LIVE_STREAM_CONFIG);
  const [selectedCamId, setSelectedCamId] = useState<string>("cam-gopro");
  const [isPipActive, setIsPipActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  
  // Chat input
  const [chatName, setChatName] = useState<string>("");
  const [chatRole, setChatRole] = useState<"padre" | "madre" | "atleta" | "staff" | "aficionado">("padre");
  const [chatMessage, setChatMessage] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLiveConfig();
    const interval = setInterval(loadLiveConfig, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadLiveConfig = async () => {
    const live = await Store.getLiveStreamConfig();
    setConfig(live);
    if (!selectedCamId && live.selectedCameraId) {
      setSelectedCamId(live.selectedCameraId);
    }
  };

  const handleReaction = async (type: "fire" | "clap" | "star" | "basketball") => {
    const emojisMap: Record<string, string> = {
      fire: "🔥",
      clap: "👏",
      star: "⭐",
      basketball: "🏀",
    };

    // Add visual floating emoji
    const newEmoji: FloatingEmoji = {
      id: Date.now() + Math.random(),
      emoji: emojisMap[type],
      x: 30 + Math.random() * 40, // percentage from left
    };

    setFloatingEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 2000);

    const updated = await Store.addLiveReaction(type);
    setConfig(updated);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const author = chatName.trim() || "Familia Golden";
    setIsSendingChat(true);

    try {
      await Store.addLiveChatMessage({
        authorName: author,
        authorRole: chatRole,
        message: chatMessage.trim(),
      });
      setChatMessage("");
      await loadLiveConfig();
      
      // Auto-scroll chat
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🏀 ¡Estamos EN VIVO con Golden Sport Academy Santa Cruz! 🔴\n\nPartido: ${config.title}\nCategoría: ${config.category}\n\n👉 Sigue la transmisión aquí:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const currentCam = config.cameras.find((c) => c.id === selectedCamId) || config.cameras[0];
  const secondaryCam = config.cameras.find((c) => c.id !== selectedCamId) || config.cameras[1];

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 pb-20">
      {/* Floating Emojis Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-24 text-4xl animate-floatUp select-none"
            style={{ left: `${item.x}%` }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* Top Match Header */}
      <div className="bg-gradient-to-b from-dark-900 to-dark-950 border-b border-gray-800 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                  config.isLive
                    ? "bg-red-600 text-white animate-pulse shadow-red-900/50"
                    : "bg-gray-800 text-gray-400 border border-gray-700"
                }`}>
                  {config.isLive ? (
                    <span className="inline-flex items-center gap-0.5">
                      <span>EN VIV</span>
                      <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 ml-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                      </span>
                      <span className="ml-1">AHORA</span>
                    </span>
                  ) : (
                    "⚪ PRÓXIMA TRANSMISIÓN"
                  )}
                </span>

                <span className="px-2.5 py-0.5 rounded-lg bg-golden-500/20 text-golden-400 border border-golden-500/40 text-xs font-black uppercase">
                  {config.category}
                </span>

                <span className="px-2.5 py-0.5 rounded-lg bg-dark-800 text-gray-300 border border-gray-700 text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-golden-400" />
                  <span>{config.location || "Gimnasio Santa Bárbara"}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
                {config.title || "Transmisión Oficial Golden Sport Academy"}
              </h1>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all hover:scale-105"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir en WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Broadcast Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className={`grid grid-cols-1 ${config.chatEnabled !== false ? "lg:grid-cols-3" : "max-w-4xl mx-auto"} gap-6`}>
          
          {/* Left / Center: Video Player OR Arena Scoreboard (2 Cols or Full Width) */}
          <div className={`${config.chatEnabled !== false ? "lg:col-span-2" : "w-full"} space-y-4`}>
            
            {/* IF SCOREBOARD-ONLY MODE (Sin cámaras de video) */}
            {config.broadcastMode === "scoreboard_only" ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-dark-900 via-dark-950 to-dark-900 border-2 border-golden-500/50 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-golden-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Header of Arena Scoreboard */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-golden-400">
                      Tablero Electrónico Digital Oficial
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {config.matchDate} • {config.location || "Sede Santa Bárbara"}
                  </span>
                </div>

                {/* Scoreboard Arena Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  
                  {/* Local Team Box (2 cols) */}
                  <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-dark-950 border-2 border-golden-500/40 text-center space-y-3 shadow-xl relative">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-dark-900 border border-golden-500/40 p-1 flex items-center justify-center">
                        <Image src="/logo.png" alt="Golden" width={28} height={28} className="object-contain" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-golden-400 uppercase tracking-tight">
                        Golden Sport Academy
                      </span>
                    </div>

                    <div className="py-2">
                      <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-golden-400 font-mono tracking-tighter drop-shadow-[0_4px_20px_rgba(234,179,8,0.5)]">
                        {config.scoreboard?.homeScore ?? 0}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mt-1">Puntos Oficiales</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-xs">
                      <span className="text-gray-400 font-bold">Faltas: <strong className="text-red-400 font-mono">{config.scoreboard?.homeFouls ?? 0}</strong></span>
                      {config.scoreboard?.possession === "home" && (
                        <span className="px-2 py-0.5 rounded-full bg-golden-500 text-dark-950 font-black text-[10px] uppercase tracking-wider animate-pulse">
                          🏀 Posesión
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center Match Info (1 col) */}
                  <div className="p-4 rounded-2xl bg-dark-900/80 border border-gray-800 text-center space-y-2">
                    <span className="text-[10px] font-black uppercase text-gray-400 block">Periodo</span>
                    <span className="px-3 py-1 rounded-xl bg-golden-500 text-dark-950 text-sm font-black uppercase block tracking-wider shadow-md">
                      {config.scoreboard?.period || "Q1"}
                    </span>
                    <span className="text-xs font-mono text-golden-400/90 block pt-1">
                      {config.scoreboard?.gameTime || "10:00"}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block">En Directo</span>
                  </div>

                  {/* Away Team Box (2 cols) */}
                  <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-dark-950 border-2 border-gray-700 text-center space-y-3 shadow-xl relative">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-dark-900 border border-gray-700 flex items-center justify-center font-black text-xs text-gray-400">
                        VS
                      </div>
                      <span className="text-xs sm:text-sm font-black text-gray-200 uppercase tracking-tight truncate max-w-[150px]">
                        {config.scoreboard?.awayTeam || config.opponentName || "Rival"}
                      </span>
                    </div>

                    <div className="py-2">
                      <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-200 font-mono tracking-tighter">
                        {config.scoreboard?.awayScore ?? 0}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mt-1">Puntos Rival</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 text-xs">
                      <span className="text-gray-400 font-bold">Faltas: <strong className="text-red-400 font-mono">{config.scoreboard?.awayFouls ?? 0}</strong></span>
                      {config.scoreboard?.possession === "away" && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-black text-[10px] uppercase tracking-wider animate-pulse">
                          🏀 Posesión
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Scoreboard Footer Note */}
                <div className="pt-3 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
                  <span>Actualizado en vivo por la mesa técnica y directiva en cancha.</span>
                  <div className="flex items-center gap-2">
                    <Image src="/curiol-studio-official.png" alt="Curiol Studio" width={22} height={22} className="object-contain" />
                    <span className="text-[10px] font-bold text-golden-400 uppercase">Curiol Studio • Fotografía • Tecnología • Legado</span>
                  </div>
                </div>
              </div>
            ) : (
              /* IF MULTI-CAMERA VIDEO MODE */
              <>
                {/* Camera Switcher Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-dark-900 border border-gray-800">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {config.cameras.map((cam, idx) => {
                      const isActive = selectedCamId === cam.id;
                      return (
                        <button
                          key={cam.id}
                          onClick={() => {
                            setSelectedCamId(cam.id);
                            setIsPipActive(false);
                          }}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                            isActive && !isPipActive
                              ? "bg-golden-500 text-dark-950 shadow-md shadow-golden-500/30 scale-102"
                              : "bg-dark-950 text-gray-300 hover:text-white hover:bg-dark-800 border border-gray-800"
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{cam.shortName || cam.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                            isActive && !isPipActive ? "bg-dark-950 text-golden-400" : "bg-dark-800 text-gray-400"
                          }`}>
                            {cam.deviceModel.includes("GoPro") ? "Cancha" : "Móvil"}
                          </span>
                        </button>
                      );
                    })}

                    {/* PiP Mode Toggle */}
                    <button
                      onClick={() => setIsPipActive(!isPipActive)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isPipActive
                          ? "bg-golden-500 text-dark-950 font-black shadow-md shadow-golden-500/30"
                          : "bg-dark-950 text-gray-400 hover:text-white border border-gray-800"
                      }`}
                      title="Activar Doble Cámara (PiP)"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Doble Cámara (PiP)</span>
                    </button>
                  </div>

                  {/* Resolution / CDN badge */}
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-950 border border-gray-800 text-[11px] text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Bunny CDN 1080p 60fps</span>
                  </div>
                </div>

                {/* Video Player Container */}
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-dark-950 border-2 border-golden-500/30 shadow-2xl group">
                  
                  {/* Main Feed */}
                  {config.isLive ? (
                    <div className="w-full h-full relative bg-dark-950 flex items-center justify-center">
                      {currentCam?.embedUrl ? (
                        <iframe
                          src={currentCam.embedUrl}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full relative bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:16px_16px]" />
                          
                          <div className="relative z-10 space-y-3 max-w-md">
                            <div className="w-16 h-16 rounded-2xl bg-dark-900 border-2 border-golden-500 p-2 mx-auto flex items-center justify-center shadow-lg shadow-golden-500/30 animate-bounce">
                              <Image src="/logo.png" alt="Golden" width={50} height={50} className="object-contain" />
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-wide">
                              Señal en Directo: {currentCam?.name}
                            </h3>
                            <p className="text-xs text-gray-300">
                              Transmitiendo desde el Gimnasio de Santa Bárbara mediante <strong>{currentCam?.deviceModel}</strong> con tecnología Bunny Stream Live CDN.
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              <span>Latencia Ultra Baja • HLS Activo</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Offline / Standby Screen */
                    <div className="w-full h-full bg-gradient-to-b from-dark-900 via-dark-950 to-dark-900 flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className="w-20 h-20 rounded-3xl bg-dark-900 border-2 border-golden-500/50 p-3 flex items-center justify-center shadow-2xl">
                        <Image src="/logo.png" alt="Golden" width={64} height={64} className="object-contain" />
                      </div>
                      <div className="space-y-1 max-w-lg">
                        <h3 className="text-xl font-black text-white uppercase">Próxima Transmisión en Vivo</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          La señal se activará automáticamente cuando comience el encuentro. ¡Acompaña a nuestros atletas desde cualquier lugar con cobertura multi-cámara HD!
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <Link
                          href="/calendario"
                          className="px-4 py-2 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase tracking-wider transition-colors"
                        >
                          Ver Calendario de Partidos
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* PiP Inset Window (Secondary Camera) */}
                  {isPipActive && config.isLive && (
                    <div className="absolute top-4 right-4 w-48 sm:w-60 aspect-video rounded-2xl overflow-hidden bg-dark-900 border-2 border-golden-400 shadow-2xl z-30 transition-all hover:scale-105 cursor-pointer">
                      <div className="relative w-full h-full bg-dark-950 flex flex-col items-center justify-center p-2 text-center">
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-dark-950/90 text-golden-400 font-mono text-[9px] font-bold border border-golden-500/40">
                          {secondaryCam?.shortName}
                        </div>
                        <span className="text-[10px] text-gray-300 font-bold uppercase">{secondaryCam?.deviceModel}</span>
                        <span className="text-[9px] text-gray-500">Cámara 2</span>
                      </div>
                    </div>
                  )}

                  {/* OFFICIAL SCOREBOARD OVERLAY ON VIDEO */}
                  <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <div className="bg-dark-950/90 backdrop-blur-md border border-golden-500/50 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex items-center gap-3 text-white">
                      
                      {/* Home Team */}
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-dark-900 border border-golden-500/40 p-0.5 flex items-center justify-center shrink-0">
                          <Image src="/logo.png" alt="Golden" width={24} height={24} className="object-contain" />
                        </div>
                        <div>
                          <span className="text-[10px] sm:text-xs font-black uppercase text-golden-400 block leading-tight">
                            GOLDEN
                          </span>
                          <span className="text-sm sm:text-lg font-black leading-none block">
                            {config.scoreboard?.homeScore ?? 0}
                          </span>
                        </div>
                      </div>

                      {/* Divider & Period */}
                      <div className="flex flex-col items-center justify-center px-2 border-x border-gray-700">
                        <span className="text-[10px] sm:text-xs font-black text-golden-400 uppercase">
                          {config.scoreboard?.period || "Q1"}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">
                          {config.scoreboard?.gameTime || "10:00"}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-[10px] sm:text-xs font-black uppercase text-gray-300 block leading-tight truncate max-w-[70px] sm:max-w-[90px]">
                            {config.scoreboard?.awayTeam || "RIVAL"}
                          </span>
                          <span className="text-sm sm:text-lg font-black leading-none block">
                            {config.scoreboard?.awayScore ?? 0}
                          </span>
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-dark-900 border border-gray-700 flex items-center justify-center font-black text-gray-400 text-xs shrink-0">
                          VS
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Watermark Sponsor Overlay */}
                  <div className="absolute bottom-3 right-4 z-20 pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 bg-dark-950/80 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-golden-500/30">
                      <Image src="/curiol-studio-official.png" alt="Curiol Studio" width={22} height={22} className="object-contain" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-golden-400">
                        CURIOL STUDIO
                      </span>
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* Interactive Reaction Bar (si está habilitado) */}
            {(config.reactionsEnabled ?? true) && (
              <div className="p-4 rounded-3xl bg-dark-900 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    ¡Apoya a Golden!
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleReaction("fire")}
                    className="px-3.5 py-2 rounded-2xl bg-dark-950 hover:bg-orange-950/50 border border-orange-500/40 text-orange-400 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95 shadow-md"
                  >
                    <span>🔥</span>
                    <span className="font-mono text-white text-xs">{config.reactions?.fire || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction("basketball")}
                    className="px-3.5 py-2 rounded-2xl bg-dark-950 hover:bg-golden-950/50 border border-golden-500/40 text-golden-400 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95 shadow-md"
                  >
                    <span>🏀</span>
                    <span className="font-mono text-white text-xs">{config.reactions?.basketball || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction("clap")}
                    className="px-3.5 py-2 rounded-2xl bg-dark-950 hover:bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95 shadow-md"
                  >
                    <span>👏</span>
                    <span className="font-mono text-white text-xs">{config.reactions?.clap || 0}</span>
                  </button>

                  <button
                    onClick={() => handleReaction("star")}
                    className="px-3.5 py-2 rounded-2xl bg-dark-950 hover:bg-yellow-950/50 border border-yellow-500/40 text-yellow-400 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95 shadow-md"
                  >
                    <span>⭐</span>
                    <span className="font-mono text-white text-xs">{config.reactions?.star || 0}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Technical Information & Features Card */}
            <div className="p-5 rounded-3xl bg-dark-900/60 border border-gray-800/80 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-golden-400 font-black uppercase text-xs">
                <Sparkles className="w-4 h-4" />
                <span>{config.broadcastMode === "scoreboard_only" ? "Marcador Digital en Tiempo Real" : "Cobertura Multi-Cámara Profesional"}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {config.broadcastMode === "scoreboard_only" 
                  ? "Sigue el tanteador, faltas y periodos oficiales del partido en directo sin consumo intensivo de datos, sincronizado al instante por la mesa de control de Golden Sport Academy."
                  : "Golden Sport Academy transmite sus partidos oficiales con un sistema de doble cámara HD: Cámara 1 (GoPro HERO 12) para la visión táctica de la cancha completa y Cámara 2 (DJI Osmo Pocket) para el seguimiento dinámico de las jugadas en movimiento y dirección técnica de la Coach Lenny Monge."
                }
              </p>
            </div>

          </div>

          {/* Right Column: Family Live Chat & Community Wall (1 Col, solo si chatEnabled está activo) */}
          {(config.chatEnabled ?? true) && (
            <div className="space-y-4">
              
              <div className="p-6 rounded-3xl bg-dark-900 border border-golden-500/30 flex flex-col h-[640px] shadow-2xl">
                
                {/* Chat Header */}
                <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-golden-500/20 text-golden-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase">Muro de Familias</h3>
                      <span className="text-[11px] text-gray-400">Comunidad Golden Santa Cruz</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    ● En Línea
                  </span>
                </div>

                {/* Chat Messages List */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 text-xs"
                >
                  {config.chatMessages && config.chatMessages.length > 0 ? (
                    config.chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          msg.authorRole === "staff"
                            ? "bg-golden-500/10 border-golden-500/40"
                            : "bg-dark-950 border-gray-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-white">{msg.authorName}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                              msg.authorRole === "staff"
                                ? "bg-golden-500 text-dark-950"
                                : "bg-dark-800 text-golden-400 border border-golden-500/30"
                            }`}>
                              {msg.authorRole}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 text-gray-500 text-xs">
                      ¡Sé el primero en enviar un mensaje de apoyo al equipo! 🏀
                    </div>
                  )}
                </div>

                {/* Chat Input Form */}
                <form onSubmit={handleSendMessage} className="space-y-2.5 pt-3 border-t border-gray-800">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Tu Nombre / Familia"
                      value={chatName}
                      onChange={(e) => setChatName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs placeholder-gray-500 focus:border-golden-500 outline-none"
                    />
                    <select
                      value={chatRole}
                      onChange={(e: any) => setChatRole(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs focus:border-golden-500 outline-none"
                    >
                      <option value="padre">Papá / Familiar</option>
                      <option value="madre">Mamá / Familiar</option>
                      <option value="atleta">Atleta / Jugador</option>
                      <option value="aficionado">Aficionado</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Escribe un mensaje de apoyo..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs placeholder-gray-500 focus:border-golden-500 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isSendingChat}
                      className="p-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 transition-transform active:scale-95 shadow-md shadow-golden-500/20 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>

              </div>

              {/* Quick Link to Gallery / Photos */}
              <div className="p-5 rounded-3xl bg-dark-900 border border-gray-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-white uppercase">¿Quieres las fotos oficiales en HD?</h4>
                  <p className="text-[11px] text-gray-400">Visita el Álbum Digital de Curiol Studio.</p>
                </div>
                <Link
                  href="/galeria"
                  className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-golden-400 border border-golden-500/30 text-xs font-bold uppercase shrink-0 transition-colors"
                >
                  Ver Álbum
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
