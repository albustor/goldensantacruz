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
  Info,
  Phone,
  Megaphone,
  Music,
  Edit3,
  Check
} from "lucide-react";
import { LiveStreamConfig, LiveScoreboard, LiveCameraConfig, LiveChatMessage } from "@/types";
import { Store } from "@/lib/store";
import { INITIAL_LIVE_STREAM_CONFIG } from "@/lib/initialData";

// FLAG DE BLOQUEO TEMPORAL DEL MÓDULO DE TRANSMISIÓN EN VIVO
// Estado: ACTIVADO para transmisión de partidos oficiales
const IS_LIVE_STREAM_BLOCKED = false;

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

interface SonyTetherPhoto {
  id?: string;
  base_id?: string;
  filename: string;
  webp_filename?: string;
  timestamp: string;
  size?: number;
  webp_size?: number;
  size_kb?: number;
  url: string;
  thumb_url?: string;
  preview_url?: string;
  full_url?: string;
  source?: string;
  raw_in_nas?: boolean;
  ai_edited?: boolean;
  ai_profile?: string;
  ai_summary?: string;
  selector_clasificacion?: string;
  selector_diagnostico?: string;
  published_live?: boolean;
  exif?: {
    camera?: string;
    lens?: string;
    focal?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
    orientation?: string;
  };
}

const BUNNY_LIVE_EMBED_URL = "https://player.mediadelivery.net/live/799801/01a1a8ce-8ae3-7f1f-bcc5-d051a51a0850";
const HP_ROJA_HTTPS_TUNNEL_URL = "https://link-gnu-eat-ivory.trycloudflare.com";
const HP_ROJA_TETHER_URL = "http://192.168.0.13:3060";
const HP_ROJA_WEBRTC_GOPRO = `${HP_ROJA_HTTPS_TUNNEL_URL}/cam_view/gopro`;
const HP_ROJA_WEBRTC_OSMO = `${HP_ROJA_HTTPS_TUNNEL_URL}/cam_view/osmo`;
const HP_ROJA_WEBRTC_DRON = `${HP_ROJA_HTTPS_TUNNEL_URL}/cam_view/dron`;

export default function LiveStreamPage() {
  const [config, setConfig] = useState<LiveStreamConfig>(INITIAL_LIVE_STREAM_CONFIG);
  const [selectedCamId, setSelectedCamId] = useState<string>("cam-phone");
  const [isPipActive, setIsPipActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Fotos en vivo desde Cámara Sony α7 III + Nikon -> Router DIGI -> Servidor HP Roja (:2121 FTP / :3060 HTTP)
  const [tetherBaseUrl, setTetherBaseUrl] = useState<string>(HP_ROJA_TETHER_URL);
  const [sonyPhotos, setSonyPhotos] = useState<SonyTetherPhoto[]>([]);
  const [approvedPhotoIds, setApprovedPhotoIds] = useState<Record<string, boolean>>({});
  const [selectedSonyPhoto, setSelectedSonyPhoto] = useState<SonyTetherPhoto | null>(null);
  const [tetherOnline, setTetherOnline] = useState<boolean>(false);
  const [tetherNodeLabel, setTetherNodeLabel] = useState<string>("HP Roja (192.168.2.12:2121)");
  const [simulatingShot, setSimulatingShot] = useState<boolean>(false);
  const [operatorMode, setOperatorMode] = useState<boolean>(true);
  const [sedeProfileId, setSedeProfileId] = useState<string>("la_paz_tempisque_basket_gimnasio");
  const [calibratingSede, setCalibratingSede] = useState<boolean>(false);
  const [calibrationMsg, setCalibrationMsg] = useState<string>("");

  // Categoría editable en vivo + Música en Bucle
  const [editingCategoryLive, setEditingCategoryLive] = useState<boolean>(false);
  const [categoryDraft, setCategoryDraft] = useState<string>("");
  const [isPlayingBgMusic, setIsPlayingBgMusic] = useState<boolean>(false);
  const [customBgMusicUrl, setCustomBgMusicUrl] = useState<string | null>(null);
  const [customBgMusicName, setCustomBgMusicName] = useState<string>("");
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Chat input
  const [chatName, setChatName] = useState<string>("");
  const [chatRole, setChatRole] = useState<"padre" | "madre" | "atleta" | "staff" | "aficionado">("padre");
  const [chatMessage, setChatMessage] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (IS_LIVE_STREAM_BLOCKED) return;
    loadLiveConfig();
    const interval = setInterval(loadLiveConfig, 4000);
    return () => clearInterval(interval);
  }, []);

  // Conexión en tiempo real al Servidor HP Roja (:3060 HTTP / :2121 FTP desde Sony α7 III vía Router DIGI)
  useEffect(() => {
    if (IS_LIVE_STREAM_BLOCKED || typeof window === "undefined") return;

    const savedApproved = localStorage.getItem("curiol_live_approved_photos_v1");
    if (savedApproved) {
      try {
        setApprovedPhotoIds(JSON.parse(savedApproved));
      } catch {}
    }

    let isMounted = true;
    let activeBase = HP_ROJA_TETHER_URL;

    const fetchSonyPhotos = async () => {
      let dynamicTunnel = HP_ROJA_HTTPS_TUNNEL_URL;
      let cloudPhotos: SonyTetherPhoto[] = [];
      try {
        const syncRes = await fetch("/api/live-sync", { cache: "no-store" });
        if (syncRes.ok) {
          const syncData = await syncRes.json();
          if (syncData?.tunnelUrl) {
            dynamicTunnel = String(syncData.tunnelUrl).trim();
          }
          if (Array.isArray(syncData?.publishedPhotos)) {
            cloudPhotos = syncData.publishedPhotos;
          }
        }
      } catch {}

      const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
      const candidates = isHttps
        ? [
            { url: dynamicTunnel, label: "HP Roja HTTPS (192.168.2.12:2121)" },
          ]
        : [
            { url: HP_ROJA_TETHER_URL, label: "HP Roja (192.168.0.13:2121)" },
            { url: "http://192.168.2.12:3060", label: "HP Roja DIGI (192.168.2.12:2121)" },
            { url: dynamicTunnel, label: "HP Roja HTTPS (192.168.2.12:2121)" },
            { url: `http://${window.location.hostname || "localhost"}:3060`, label: `Servidor Local (${window.location.hostname || "localhost"}:2121)` },
          ];

      for (const cand of candidates) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 1800);
        try {
          const res = await fetch(`${cand.url}/api/photos`, { signal: ctrl.signal });
          clearTimeout(timer);
          if (res.ok) {
            const list: SonyTetherPhoto[] = await res.json();
            if (!isMounted) return;
            if (Array.isArray(list) && (list.length > 0 || cand.url === candidates[candidates.length - 1].url)) {
              activeBase = cand.url;
              setTetherBaseUrl(cand.url);
              setTetherNodeLabel(cand.label);
              setTetherOnline(true);
              setSonyPhotos(list);
              setSelectedSonyPhoto((prev) => prev || list[0] || null);
              // Sincronización automática hacia la nube cuando la HP Roja está activa en el gimnasio
              const pubList = list.filter((p) => p.published_live);
              if (pubList.length > cloudPhotos.length) {
                const newestPub = pubList[0];
                if (newestPub) {
                  fetch("/api/live-sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "publish_photo",
                      photo: {
                        ...newestPub,
                        url: `${cand.url}${newestPub.url || ""}`,
                        preview_url: `${cand.url}${newestPub.preview_url || newestPub.url || ""}`,
                        thumb_url: `${cand.url}${newestPub.thumb_url || newestPub.url || ""}`,
                        published_live: true,
                      },
                    }),
                  }).catch(() => {});
                }
              }
              return;
            }
          }
        } catch {
          clearTimeout(timer);
        }
      }
      if (isMounted) {
        if (cloudPhotos.length > 0) {
          setTetherOnline(true);
          setTetherNodeLabel("Nube Curiol Studio (En Vivo)");
          setSonyPhotos(cloudPhotos);
          setSelectedSonyPhoto((prev) => prev || cloudPhotos[0] || null);
        } else {
          setTetherOnline(false);
        }
      }
    };

    fetchSonyPhotos();
    const photoPoll = setInterval(fetchSonyPhotos, 2500);

    let es: EventSource | null = null;
    try {
      es = new EventSource(`${activeBase}/api/stream`);
      es.onmessage = (ev) => {
        try {
          const newPhoto: SonyTetherPhoto = JSON.parse(ev.data);
          const newKey = newPhoto?.base_id || newPhoto?.id || newPhoto?.filename;
          if (newPhoto && newKey) {
            setTetherOnline(true);
            setSonyPhotos((prev) => {
              const filtered = prev.filter((p) => (p.base_id || p.id || p.filename) !== newKey);
              return [newPhoto, ...filtered];
            });
            setSelectedSonyPhoto(newPhoto);
          }
        } catch {}
      };
    } catch {}

    return () => {
      isMounted = false;
      clearInterval(photoPoll);
      if (es) es.close();
    };
  }, []);

  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      if (ev.data && ev.data.type === "CURIOL_AUDIO_ACTIVE") {
        ["quad-cam-gopro", "quad-cam-gopro2", "quad-cam-osmo", "quad-cam-dron"].forEach((id) => {
          const el = document.getElementById(id) as HTMLIFrameElement | null;
          if (el && el.contentWindow) {
            el.contentWindow.postMessage({ type: "CURIOL_MUTE_UNLESS", activeCam: ev.data.camId }, "*");
          }
        });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (IS_LIVE_STREAM_BLOCKED) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 animate-fadeIn">
        <div className="max-w-xl w-full text-center space-y-6 p-8 sm:p-10 rounded-3xl bg-dark-900 border-2 border-golden-500/40 shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 rounded-3xl bg-dark-950 border-2 border-golden-500/50 p-3 mx-auto flex items-center justify-center shadow-lg shadow-golden-500/20">
            <Image src="/logo.png" alt="Golden Sport Academy" width={64} height={64} className="object-contain" priority />
          </div>

          <div className="space-y-2.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-black uppercase tracking-wider border border-golden-500/30">
              <Radio className="w-3.5 h-3.5 text-golden-400" />
              <span>Transmisiones en Pausa Técnica</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Señal en Mantenimiento
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
              El módulo de transmisión multi-cámara en directo se encuentra temporalmente en pausa para optimización técnica. Puedes consultar la programación de partidos y las fotografías oficiales de la academia.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/calendario"
              className="px-5 py-2.5 rounded-2xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-golden-500/20 transition-all hover:scale-105"
            >
              📅 Calendario de Partidos
            </Link>
            <Link
              href="/galeria"
              className="px-5 py-2.5 rounded-2xl bg-dark-800 hover:bg-dark-700 text-golden-300 font-bold text-xs uppercase tracking-wider border border-golden-500/40 transition-all hover:scale-105"
            >
              📸 Galería de Fotografías
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-2xl bg-dark-950 hover:bg-dark-850 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider border border-gray-800 transition-all"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const loadLiveConfig = async () => {
    const live = await Store.getLiveStreamConfig();
    let needsUpdate = false;
    if (!live.isLive) {
      live.isLive = true;
      needsUpdate = true;
    }
    if (Array.isArray(live.cameras)) {
      live.cameras = live.cameras.map((cam) => {
        if (cam.id === "cam-gopro" && (!cam.embedUrl || cam.embedUrl !== HP_ROJA_WEBRTC_GOPRO)) {
          needsUpdate = true;
          return {
            ...cam,
            name: "Cámara 1: Cancha Completa (GoPro HERO13 Black)",
            shortName: "GoPro HERO13 Cancha",
            deviceModel: "GoPro HERO13 Black • Router DIGI → HP Roja (192.168.2.12:1935)",
            streamType: "bunny_stream",
            bunnyLibraryId: "799801",
            bunnyVideoId: "01a1a8ce-8ae3-7f1f-bcc5-d051a51a0850",
            rtmpServer: "rtmp://192.168.2.12:1935/live",
            streamKey: "gopro",
            hlsUrl: BUNNY_LIVE_EMBED_URL,
            embedUrl: HP_ROJA_WEBRTC_GOPRO,
            isActive: true,
            status: "live",
          };
        }
        if (cam.id === "cam-dji" && (cam.embedUrl !== HP_ROJA_WEBRTC_OSMO || !cam.deviceModel.includes("192.168.2.12"))) {
          needsUpdate = true;
          return {
            ...cam,
            name: "Cámara 2: Jugadas Bajo el Aro (DJI Osmo Pocket 2)",
            shortName: "DJI Osmo Pocket 2",
            deviceModel: "DJI Osmo Pocket 2 • Router DIGI → HP Roja (192.168.2.12:1935)",
            rtmpServer: "rtmp://192.168.2.12:1935/live",
            streamKey: "osmo",
            embedUrl: HP_ROJA_WEBRTC_OSMO,
            isActive: true,
            status: "live",
          };
        }
        if (cam.id === "cam-phone" && (cam.embedUrl !== HP_ROJA_WEBRTC_DRON || !cam.deviceModel.includes("192.168.2.12"))) {
          needsUpdate = true;
          return {
            ...cam,
            name: "Cámara 3: Vista Aérea & Cenital (Dron DJI Air 3S)",
            shortName: "Dron DJI Air 3S",
            deviceModel: "DJI Air 3S • Router DIGI → HP Roja (192.168.2.12:1935)",
            role: "Vista Aérea / Cenital",
            rtmpServer: "rtmp://192.168.2.12:1935/live",
            streamKey: "dron",
            embedUrl: HP_ROJA_WEBRTC_DRON,
            isActive: true,
            status: "live",
          };
        }
        return cam;
      });
    }
    if (needsUpdate) {
      await Store.updateLiveStreamConfig(live);
    }
    setConfig(live);
    if (!selectedCamId && live.selectedCameraId) {
      setSelectedCamId(live.selectedCameraId);
    }
  };

  const toggleApprovePhoto = async (photoId: string) => {
    const nextVal = !approvedPhotoIds[photoId];
    setApprovedPhotoIds((prev) => {
      const next = { ...prev, [photoId]: nextVal };
      if (typeof window !== "undefined") {
        localStorage.setItem("curiol_live_approved_photos_v1", JSON.stringify(next));
      }
      return next;
    });
    if (tetherBaseUrl) {
      try {
        await fetch(`${tetherBaseUrl}/api/publish_live`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photo_id: photoId, published: nextVal }),
        });
      } catch {}
    }
    const targetPhoto = sonyPhotos.find((p) => (p.base_id || p.id || p.filename) === photoId);
    if (targetPhoto) {
      try {
        await fetch("/api/live-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            nextVal
              ? {
                  action: "publish_photo",
                  photo: {
                    ...targetPhoto,
                    published_live: true,
                  },
                }
              : {
                  action: "unpublish_photo",
                  base_id: photoId,
                }
          ),
        });
      } catch {}
    }
    setSonyPhotos((prev) =>
      prev.map((p) =>
        (p.base_id || p.id || p.filename) === photoId ? { ...p, published_live: nextVal } : p
      )
    );
  };

  const toggleBgMusic = async () => {
    const el = bgAudioRef.current;
    if (!el) return;
    if (isPlayingBgMusic) {
      el.pause();
      setIsPlayingBgMusic(false);
    } else {
      try {
        el.volume = 0.55;
        await el.play();
        setIsPlayingBgMusic(true);
      } catch {}
    }
  };

  const handleUploadBgMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setCustomBgMusicUrl(blobUrl);
    setCustomBgMusicName(file.name);
    const el = bgAudioRef.current;
    if (el) {
      el.src = blobUrl;
      el.loop = true;
      el.volume = 0.65;
      try {
        await el.play();
        setIsPlayingBgMusic(true);
      } catch {}
    }
  };

  const handleSaveLiveCategory = async (newCat: string) => {
    const clean = newCat.trim();
    if (!clean) return;
    const updated = await Store.updateLiveStreamConfig({ category: clean });
    setConfig(updated);
    setEditingCategoryLive(false);
  };

  const handleCalibrateSede = async (targetSedeId: string) => {
    if (!tetherBaseUrl) return;
    setCalibratingSede(true);
    setSedeProfileId(targetSedeId);
    setCalibrationMsg("");
    try {
      const res = await fetch(`${tetherBaseUrl}/api/calibrate_sede`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sede_id: targetSedeId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCalibrationMsg(data.msg || "Perfil calibrado con muestras del gimnasio.");
      }
    } catch {
      setCalibrationMsg("Perfil aplicado localmente.");
    } finally {
      setCalibratingSede(false);
    }
  };

  const handleSimulateSonyShot = async () => {
    if (!tetherBaseUrl) return;
    setSimulatingShot(true);
    try {
      const res = await fetch(`${tetherBaseUrl}/api/simulate`, { method: "POST" });
      if (res.ok) {
        const photo: SonyTetherPhoto = await res.json();
        const pKey = photo.base_id || photo.id || photo.filename;
        setTetherOnline(true);
        setSonyPhotos((prev) => [photo, ...prev.filter((p) => (p.base_id || p.id || p.filename) !== pKey)]);
        setSelectedSonyPhoto(photo);
      }
    } catch {} finally {
      setSimulatingShot(false);
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

  const activeCameras = (config.cameras || []).filter(c => c.isActive !== false);
  const targetCam = (config.cameras || []).find((c) => c.id === selectedCamId);
  const currentCam = (targetCam && targetCam.isActive !== false)
    ? targetCam
    : (activeCameras[0] || config.cameras?.[0]);
  const secondaryCam = activeCameras.find((c) => c.id !== currentCam?.id) || (config.cameras || []).find((c) => c.id !== currentCam?.id) || config.cameras?.[1];

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
        <audio
          ref={bgAudioRef}
          src={customBgMusicUrl || "/audio/golden_lapaz_loop.mp3"}
          loop
          preload="auto"
        />
        <input
          ref={bgFileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleUploadBgMusic}
          className="hidden"
        />
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

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-golden-500/20 text-golden-400 border border-golden-500/40 text-xs font-black uppercase">
                  <span>🏀 {config.category}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryDraft(config.category || "Niños Pequeños (Formativo)");
                      setEditingCategoryLive((v) => !v);
                    }}
                    className="ml-1 px-1.5 py-0.5 rounded bg-golden-500 text-dark-950 hover:bg-golden-400 text-[9px] font-black uppercase flex items-center gap-1"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Anotar Categoría</span>
                  </button>
                </div>

                <span className="px-2.5 py-0.5 rounded-lg bg-dark-800 text-gray-300 border border-gray-700 text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-golden-400" />
                  <span>{config.location || "Gimnasio La Paz Community School Tempisque"}</span>
                </span>
              </div>

              {editingCategoryLive && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveLiveCategory(categoryDraft);
                  }}
                  className="flex flex-wrap items-center gap-2 pt-2"
                >
                  <input
                    type="text"
                    value={categoryDraft}
                    onChange={(e) => setCategoryDraft(e.target.value)}
                    placeholder="Escribe la categoría que va a jugar..."
                    className="px-3 py-1.5 rounded-xl bg-dark-950 border border-golden-500 text-white text-xs font-bold outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Guardar</span>
                  </button>
                </form>
              )}

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
                {config.title || "La Paz Community School Tempisque vs. Golden Sport Academy Santa Cruz"}
              </h1>
            </div>

            {/* Quick Music & Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleBgMusic}
                className={`px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                  isPlayingBgMusic
                    ? "bg-emerald-500 text-dark-950 border-emerald-300 shadow-lg animate-pulse"
                    : "bg-dark-900 hover:bg-dark-800 text-golden-300 border-golden-500/40"
                }`}
              >
                {isPlayingBgMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{isPlayingBgMusic ? `🔊 ${customBgMusicName ? customBgMusicName.slice(0, 14) : "En Bucle"}` : "🎵 Música en Bucle"}</span>
              </button>

              <button
                type="button"
                onClick={() => bgFileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-golden-500/20 hover:bg-golden-500/30 border border-golden-500/50 text-golden-300 font-black text-xs uppercase flex items-center gap-1.5"
                title="Cargar archivo de música personalizado para reproducir en bucle"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Cargar Música</span>
              </button>

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

      {/* Banner Informativo de Arquitectura Multicámara (Router DIGI -> Servidor HP Roja) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-golden-950/70 via-dark-900 to-golden-950/50 border border-golden-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-golden-500/20 border border-golden-500/50 flex items-center justify-center text-golden-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-golden-500 text-dark-950 text-[10px] font-black uppercase tracking-wider">
                  Arquitectura de Campo Activa
                </span>
                <span className="text-xs font-bold text-gray-200">
                  Router DIGI EX50 (192.168.2.1) → HP Roja (192.168.2.12) • OBS 1.6 Mbps → CDN En Vivo
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                3 cámaras locales en 5 GHz (GoPro HERO13 Black, DJI Osmo Pocket 2 y Dron DJI Air 3S) → MediaMTX (:1935) + OBS Studio (1.600 kbps) + Sony α7 III en 2.4 GHz (FTP :2121).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-dark-950 text-golden-400 border border-golden-500/30">
              📡 CDN En Vivo Activo
            </span>
            <span className={`text-[11px] font-mono px-3 py-1.5 rounded-xl border ${
              tetherOnline
                ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                : "bg-dark-950 text-gray-400 border-gray-800"
            }`}>
              📸 {tetherOnline ? `${tetherNodeLabel} (${sonyPhotos.length} fotos)` : "Esperando Sony FTP :2121"}
            </span>
          </div>
        </div>
      </div>

      {/* PIZARRA OFICIAL EN VIVO SIMPLIFICADA: 1° La Paz Community School Tempisque (Local) vs. 2° Golden Sport Academy Santa Cruz (Visita) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-dark-950 via-dark-900 to-emerald-950/50 border-2 border-golden-500/50 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4">
            {/* 1° EQUIPO LOCAL: La Paz Community School Tempisque */}
            <div className="md:col-span-3 flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-dark-950/90 border border-emerald-500/40">
              <div className="flex items-center gap-3">
                <div className="w-24 h-14 sm:w-28 sm:h-14 rounded-xl bg-[#FCFBF9] border-2 border-emerald-500/60 p-1.5 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo-la-paz-tempisque.png"
                    alt="La Paz Community School Tempisque"
                    width={110}
                    height={46}
                    className="object-contain max-h-11 w-auto"
                    priority
                  />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase tracking-wider mb-0.5">
                    🏠 Equipo Local
                  </span>
                  <h2 className="text-xs sm:text-sm font-black text-white leading-tight">
                    {config.scoreboard?.homeTeam || "La Paz Community School Tempisque"}
                  </h2>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-2xl bg-dark-900 border border-emerald-500/40 text-center min-w-[74px]">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tighter block">
                  {config.scoreboard?.homeScore ?? 0}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400">Puntos</span>
              </div>
            </div>

            {/* CENTRO: VS Simplificado */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-golden-400 to-amber-600 text-dark-950 font-black text-sm flex items-center justify-center shadow-md border border-golden-200">
                VS
              </div>
              <span className="text-[9px] font-black uppercase text-red-400 tracking-widest mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                En Juego
              </span>
            </div>

            {/* 2° EQUIPO VISITA: Golden Sport Academy Santa Cruz */}
            <div className="md:col-span-3 flex flex-row-reverse items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-dark-950/90 border border-golden-500/50">
              <div className="flex flex-row-reverse items-center gap-3 text-right">
                <div className="w-14 h-14 sm:w-16 sm:h-14 rounded-xl bg-dark-900 border-2 border-golden-500 p-1 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Golden Sport Academy Santa Cruz"
                    width={52}
                    height={52}
                    className="object-contain max-h-12 w-auto"
                    priority
                  />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded bg-golden-500/20 text-golden-300 border border-golden-500/40 text-[9px] font-black uppercase tracking-wider mb-0.5">
                    🚌 Equipo Visita
                  </span>
                  <h2 className="text-xs sm:text-sm font-black text-golden-400 leading-tight">
                    {config.scoreboard?.awayTeam || "Golden Sport Academy Santa Cruz"}
                  </h2>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-2xl bg-dark-900 border border-golden-500/50 text-center min-w-[74px]">
                <span className="text-3xl sm:text-4xl font-black font-mono text-golden-400 tracking-tighter block">
                  {config.scoreboard?.awayScore ?? 0}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400">Puntos</span>
              </div>
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

                {/* Scoreboard Arena Grid Simplificado (Niños Pequeños: Solo Puntos, 1° La Paz Community School Tempisque vs 2° Golden Sport Academy Santa Cruz) */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  
                  {/* 1° Local Team Box: La Paz Community School Tempisque (2 cols) */}
                  <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-dark-950 border-2 border-emerald-500/40 text-center space-y-3 shadow-xl relative">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-28 h-14 rounded-xl bg-[#FCFBF9] border-2 border-emerald-500/50 p-1.5 flex items-center justify-center">
                        <Image src="/logo-la-paz-tempisque.png" alt="La Paz Community School Tempisque" width={110} height={44} className="object-contain max-h-11 w-auto" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                        {config.scoreboard?.homeTeam || "La Paz Community School Tempisque"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                        🏠 Equipo Local
                      </span>
                    </div>

                    <div className="py-2">
                      <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-emerald-400 font-mono tracking-tighter">
                        {config.scoreboard?.homeScore ?? 0}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mt-1">Puntos</span>
                    </div>
                  </div>

                  {/* Center Match Info (1 col - Sin cuartos, solo Marcador En Directo) */}
                  <div className="p-4 rounded-2xl bg-dark-900/80 border border-gray-800 text-center space-y-2">
                    <span className="px-3 py-1.5 rounded-xl bg-golden-500 text-dark-950 text-sm font-black uppercase block tracking-wider shadow-md">
                      VS
                    </span>
                    <span className="text-xs font-bold text-emerald-400 block pt-1">
                      🔴 En Juego
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Marcador en Vivo</span>
                  </div>

                  {/* 2° Away Team Box: Golden Sport Academy Santa Cruz (2 cols) */}
                  <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-dark-950 border-2 border-golden-500/50 text-center space-y-3 shadow-xl relative">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-16 h-14 rounded-xl bg-dark-900 border-2 border-golden-500 p-1 flex items-center justify-center">
                        <Image src="/logo.png" alt="Golden Sport Academy Santa Cruz" width={48} height={48} className="object-contain max-h-12 w-auto" />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-golden-400 uppercase tracking-tight">
                        {config.scoreboard?.awayTeam || "Golden Sport Academy Santa Cruz"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-golden-500/20 text-golden-300 text-[10px] font-black uppercase">
                        🚌 Equipo Visita
                      </span>
                    </div>

                    <div className="py-2">
                      <span className="text-6xl sm:text-7xl lg:text-8xl font-black text-golden-400 font-mono tracking-tighter drop-shadow-[0_4px_20px_rgba(234,179,8,0.5)]">
                        {config.scoreboard?.awayScore ?? 0}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mt-1">Puntos</span>
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
                {/* Selector Multicámara de 4 Entradas (GoPro HERO 3 + DJI Osmo Pocket 2 + Dron DJI Air 3S + Sony α7 III Fotos en Vivo) */}
                <div className="p-3 sm:p-4 rounded-2xl bg-dark-900 border border-golden-500/30 shadow-xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase text-golden-400 tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4" />
                      <span>Elige la Cámara o Cascada Fotográfica (Router DIGI → HP Roja):</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-dark-950 border border-gray-800 text-[10px] text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>HD 1080p • MediaMTX + CDN</span>
                      </div>
                      <a
                        href={`${tetherBaseUrl}/tableta`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-0.5 rounded-lg bg-golden-500/20 hover:bg-golden-500/30 border border-golden-500/40 text-golden-300 text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <span>Visor Tableta HP Roja (:3060)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                    {/* Mosaico 2x2: Las 4 Cámaras en Simultáneo */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCamId("cam-quad");
                        setIsPipActive(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedCamId === "cam-quad"
                          ? "bg-gradient-to-r from-amber-400 via-golden-500 to-yellow-500 text-dark-950 border-golden-200 font-black shadow-lg shadow-golden-500/40 scale-[1.01]"
                          : "bg-dark-950 text-golden-300 hover:text-white hover:bg-dark-850 border-golden-500/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🎛️</span>
                        <div>
                          <div className="text-xs font-black uppercase tracking-tight">
                            Mosaico 4 Cámaras (2×2)
                          </div>
                          <div className={`text-[10px] ${selectedCamId === "cam-quad" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                            4 Señales + Audio 1-Toque
                          </div>
                        </div>
                      </div>
                      {selectedCamId === "cam-quad" ? (
                        <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          ● 2×2
                        </span>
                      ) : (
                        <span className="text-[10px] text-golden-400 font-bold uppercase">4× →</span>
                      )}
                    </button>

                    {/* Cámara 1: Cancha Completa (GoPro #1) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCamId("cam-gopro");
                        setIsPipActive(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedCamId === "cam-gopro"
                          ? "bg-gradient-to-r from-golden-400 via-golden-500 to-amber-500 text-dark-950 border-golden-300 font-black shadow-lg shadow-golden-500/30 scale-[1.01]"
                          : "bg-dark-950 text-gray-300 hover:text-white hover:bg-dark-850 border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">📹</span>
                        <div>
                          <div className="text-xs font-black uppercase tracking-tight">
                            GoPro #1 (HERO13)
                          </div>
                          <div className={`text-[10px] ${selectedCamId === "cam-gopro" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                            Cancha Completa • /live/gopro
                          </div>
                        </div>
                      </div>
                      {selectedCamId === "cam-gopro" ? (
                        <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          ● ACTIVA
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Ver →</span>
                      )}
                    </button>

                    {/* Cámara 2: GoPro #2 (Aro / Alterna) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCamId("cam-gopro2");
                        setIsPipActive(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedCamId === "cam-gopro2"
                          ? "bg-gradient-to-r from-golden-400 via-golden-500 to-amber-500 text-dark-950 border-golden-300 font-black shadow-lg shadow-golden-500/30 scale-[1.01]"
                          : "bg-dark-950 text-gray-300 hover:text-white hover:bg-dark-850 border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">📹</span>
                        <div>
                          <div className="text-xs font-black uppercase tracking-tight">
                            GoPro #2 (Aro)
                          </div>
                          <div className={`text-[10px] ${selectedCamId === "cam-gopro2" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                            Ángulo Alterno • /live/gopro2
                          </div>
                        </div>
                      </div>
                      {selectedCamId === "cam-gopro2" ? (
                        <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          ● ACTIVA
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Ver →</span>
                      )}
                    </button>

                    {/* Cámara 2: Bajo el Aro (DJI Osmo Pocket 2) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCamId("cam-dji");
                        setIsPipActive(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedCamId !== "cam-sony-photos" && currentCam?.id === "cam-dji"
                          ? "bg-gradient-to-r from-golden-400 via-golden-500 to-amber-500 text-dark-950 border-golden-300 font-black shadow-lg shadow-golden-500/30 scale-[1.01]"
                          : "bg-dark-950 text-gray-300 hover:text-white hover:bg-dark-850 border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🔥</span>
                        <div>
                          <div className="text-xs font-black uppercase tracking-tight">
                            DJI Osmo Pocket 2
                          </div>
                          <div className={`text-[10px] ${selectedCamId !== "cam-sony-photos" && currentCam?.id === "cam-dji" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                            Bajo el Aro / Lateral
                          </div>
                        </div>
                      </div>
                      {selectedCamId !== "cam-sony-photos" && currentCam?.id === "cam-dji" ? (
                        <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          ● ACTIVA
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Ver →</span>
                      )}
                    </button>

                    {/* Cámara 3: Vista Aérea & Cenital (Dron DJI Air 3S) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCamId("cam-phone");
                        setIsPipActive(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedCamId !== "cam-sony-photos" && currentCam?.id === "cam-phone"
                          ? "bg-gradient-to-r from-golden-400 via-golden-500 to-amber-500 text-dark-950 border-golden-300 font-black shadow-lg shadow-golden-500/30 scale-[1.01]"
                          : "bg-dark-950 text-gray-300 hover:text-white hover:bg-dark-850 border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🚁</span>
                        <div>
                          <div className="text-xs font-black uppercase tracking-tight">
                            Dron DJI Air 3S
                          </div>
                          <div className={`text-[10px] ${selectedCamId !== "cam-sony-photos" && currentCam?.id === "cam-phone" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                            Vista Aérea / Cenital
                          </div>
                        </div>
                      </div>
                      {selectedCamId !== "cam-sony-photos" && currentCam?.id === "cam-phone" ? (
                        <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          ● ACTIVA
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-bold uppercase">Ver →</span>
                      )}
                    </button>

                    {/* Cámara 4: Cascada Fotográfica Sony α7 III + Nikon -> Router DIGI -> HP Roja (:2121 / :3060) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCamId("cam-sony-photos");
                        setIsPipActive(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedCamId === "cam-sony-photos"
                          ? "bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-dark-950 border-emerald-300 font-black shadow-lg shadow-emerald-500/30 scale-[1.01]"
                          : "bg-dark-950 text-gray-300 hover:text-white hover:bg-dark-850 border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">📸</span>
                        <div>
                          <div className="text-xs font-black uppercase tracking-tight">
                            Sony α7 III + Nikon D7500
                          </div>
                          <div className={`text-[10px] ${selectedCamId === "cam-sony-photos" ? "text-dark-900 font-bold" : "text-emerald-400"}`}>
                            Fotos IA en Vivo ({sonyPhotos.filter((p) => p.published_live || approvedPhotoIds[p.base_id || p.id || p.filename]).length} pub / {sonyPhotos.length} total)
                          </div>
                        </div>
                      </div>
                      {selectedCamId === "cam-sony-photos" ? (
                        <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-emerald-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          ● EN VIVO
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Abrir →</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Si está activa la Cascada Fotográfica Sony α7 III + Nikon -> HP Roja (:3060) */}
                {selectedCamId === "cam-sony-photos" ? (
                  <div className="rounded-3xl bg-dark-900 border-2 border-emerald-500/40 shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-wide">
                            Fotografía en Vivo IA • Sony α7 III + Nikon D7500 → {tetherNodeLabel}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Cada disparo `.JPG` pasa por el <strong>Selector + Editor IA (8-bit)</strong> en la HP Roja con el perfil <strong>«La Paz Tempisque Basket - Gimnasio»</strong> antes de publicarse.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setOperatorMode((v) => !v)}
                          className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider border transition-all ${
                            operatorMode
                              ? "bg-amber-500/20 text-amber-300 border-amber-400/50"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-400/50"
                          }`}
                        >
                          {operatorMode ? "🎛️ Vista Mesa de Control (David / Todas)" : "👁️ Vista Público (Solo Publicadas)"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCalibrateSede(sedeProfileId)}
                          disabled={calibratingSede}
                          className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg"
                          title="Analiza las primeras 3 a 5 fotos tomadas al llegar a La Paz Tempisque Basket - Gimnasio y ajusta automáticamente color, luz y enfoque"
                        >
                          {calibratingSede ? "Calibrando..." : "🎯 Calibrar Muestras: La Paz Tempisque Basket - Gimnasio"}
                        </button>
                        <button
                          type="button"
                          onClick={handleSimulateSonyShot}
                          disabled={simulatingShot}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50"
                        >
                          {simulatingShot ? "Enviando..." : "⚡ Simular Disparo"}
                        </button>
                        <a
                          href={`${tetherBaseUrl}/tableta`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-dark-950 hover:bg-dark-800 border border-gray-700 text-gray-200 font-bold text-xs flex items-center gap-1.5"
                          title="Abrir Consola Táctil Unificada de David (:3060/tableta)"
                        >
                          <span>📱 Tableta David :3060</span>
                          <ExternalLink className="w-3.5 h-3.5 text-golden-400" />
                        </a>
                        <a
                          href={`${tetherBaseUrl.replace(':3060', ':3050')}/?project=00_Ingesta_Tether_Live`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 font-bold text-xs flex items-center gap-1.5"
                          title="Abrir Editor Fotográfico Completo (:3050) para recortar, enderezar o retocar fotos"
                        >
                          <span>🎨 Editor :3050</span>
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        </a>
                      </div>
                    </div>

                    {calibrationMsg && (
                      <div className="px-3.5 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-between">
                        <span>✨ {calibrationMsg}</span>
                        <button type="button" onClick={() => setCalibrationMsg("")} className="text-cyan-400 hover:text-white font-bold">✕</button>
                      </div>
                    )}

                    {selectedSonyPhoto ? (
                      <div className="space-y-4">
                        {/* Visor Principal de la Última Fotografía */}
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-dark-950 border border-gray-800 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={(selectedSonyPhoto as any).webp_data_url || `${tetherBaseUrl}${selectedSonyPhoto.preview_url || selectedSonyPhoto.url}`}
                            alt={selectedSonyPhoto.filename}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 bg-dark-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-800 text-xs">
                            <span className="font-mono font-bold text-emerald-400">{selectedSonyPhoto.webp_filename || selectedSonyPhoto.filename}</span>
                            <span className="text-gray-300 font-semibold">• {selectedSonyPhoto.exif?.camera || "Sony α7 III / Nikon D7500"}</span>
                            <span className="text-gray-400">• {selectedSonyPhoto.timestamp}</span>
                            {selectedSonyPhoto.selector_clasificacion && (
                              <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase border ${
                                selectedSonyPhoto.selector_clasificacion === "5_ESTRELLAS_CAMARA"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-400"
                                  : selectedSonyPhoto.selector_clasificacion === "ELITE_DIRECTA"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400"
                                  : selectedSonyPhoto.selector_clasificacion === "DESCARTE"
                                  ? "bg-red-500/20 text-red-300 border-red-400"
                                  : "bg-blue-500/20 text-blue-300 border-blue-400"
                              }`} title={selectedSonyPhoto.selector_diagnostico || ""}>
                                {selectedSonyPhoto.selector_clasificacion === "5_ESTRELLAS_CAMARA"
                                  ? "⭐ 5★ Cámara"
                                  : selectedSonyPhoto.selector_clasificacion === "ELITE_DIRECTA"
                                  ? "🎯 Élite Nítida"
                                  : selectedSonyPhoto.selector_clasificacion === "DESCARTE"
                                  ? "🗑️ Descarte IA"
                                  : "🔧 Rescate Óptico"}
                              </span>
                            )}
                            {selectedSonyPhoto.ai_edited !== false && (
                              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-[10px]">
                                ✨ WebP Editada IA ({selectedSonyPhoto.webp_size ? `${Math.round(selectedSonyPhoto.webp_size / 1024)} KB · ` : ""}La Paz Tempisque Basket - Gimnasio)
                              </span>
                            )}
                            {selectedSonyPhoto.exif?.lens && (
                              <span className="text-golden-400 font-mono">
                                • {selectedSonyPhoto.exif.focal || ""} {selectedSonyPhoto.exif.aperture || ""} {selectedSonyPhoto.exif.shutter || ""} {selectedSonyPhoto.exif.iso || ""}
                              </span>
                            )}
                          </div>

                          {/* Botones de 1 Toque para David (Publicar en Vivo / Descargar JPG) */}
                          <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleApprovePhoto(selectedSonyPhoto.base_id || selectedSonyPhoto.id || selectedSonyPhoto.filename)}
                              className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all ${
                                (selectedSonyPhoto.published_live || approvedPhotoIds[selectedSonyPhoto.base_id || selectedSonyPhoto.id || selectedSonyPhoto.filename])
                                  ? "bg-emerald-500 text-dark-950 border border-emerald-300"
                                  : "bg-dark-950/90 hover:bg-dark-900 text-white border border-golden-500/50"
                              }`}
                            >
                              {(selectedSonyPhoto.published_live || approvedPhotoIds[selectedSonyPhoto.base_id || selectedSonyPhoto.id || selectedSonyPhoto.filename])
                                ? "✓ Publicada en Vivo (David)"
                                : "☆ Publicar Foto en Vivo (1 Toque)"}
                            </button>
                            <a
                              href={`${tetherBaseUrl}${selectedSonyPhoto.full_url || selectedSonyPhoto.url}`}
                              download={selectedSonyPhoto.filename}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg"
                            >
                              ⬇ JPG Editado IA
                            </a>
                          </div>
                        </div>

                        {/* Tira de Miniaturas en Tiempo Real */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>
                              {operatorMode
                                ? `Mesa de Control David — Todas las fotos recibidas en HP Roja (${sonyPhotos.length}):`
                                : `Galería Pública del Partido — Fotos seleccionadas y editadas por IA (${sonyPhotos.filter((p) => p.published_live || approvedPhotoIds[p.base_id || p.id || p.filename]).length}):`}
                            </span>
                            <span className="text-emerald-400 font-bold">
                              Publicadas al Público: {sonyPhotos.filter((p) => p.published_live || approvedPhotoIds[p.base_id || p.id || p.filename]).length}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                            {(operatorMode
                              ? sonyPhotos
                              : sonyPhotos.filter((p) => p.published_live || approvedPhotoIds[p.base_id || p.id || p.filename])
                            ).slice(0, 24).map((p) => {
                              const pKey = p.base_id || p.id || p.filename;
                              const activeKey = selectedSonyPhoto?.base_id || selectedSonyPhoto?.id || selectedSonyPhoto?.filename;
                              return (
                              <button
                                key={pKey}
                                type="button"
                                onClick={() => setSelectedSonyPhoto(p)}
                                className={`relative aspect-[3/2] rounded-xl overflow-hidden border-2 transition-all ${
                                  activeKey === pKey
                                    ? "border-emerald-400 scale-[1.02] shadow-lg"
                                    : approvedPhotoIds[pKey]
                                    ? "border-golden-400"
                                    : "border-gray-800 opacity-80 hover:opacity-100"
                                }`}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={(p as any).webp_data_url || `${tetherBaseUrl}${p.thumb_url || p.url}`}
                                  alt={p.filename}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                {approvedPhotoIds[pKey] && (
                                  <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-dark-950 font-black text-[9px]">
                                    ✓
                                  </span>
                                )}
                                <span className="absolute bottom-0 inset-x-0 bg-dark-950/80 text-[9px] font-mono text-gray-200 truncate px-1 py-0.5">
                                  {p.filename}
                                </span>
                              </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center space-y-3">
                        <div className="text-4xl">📸</div>
                        <h4 className="text-base font-black text-white uppercase">
                          Listo para recibir disparos de la Sony α7 III en la HP Roja
                        </h4>
                        <p className="text-xs text-gray-400 max-w-md mx-auto">
                          Dispara con la cámara Sony conectada al Router DIGI (FTP 192.168.0.12 / 192.168.2.50 puerto 2121) o pulsa el botón <strong>«⚡ Simular Disparo Sony»</strong> arriba para probar la cascada en vivo.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                /* Video Player Container */
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-dark-950 border-2 border-golden-500/30 shadow-2xl group">
                  
                  {/* Main Feed */}
                  {config.isLive ? (
                    <div className="w-full h-full relative bg-dark-950 flex items-center justify-center">
                      {selectedCamId === "cam-quad" ? (
                        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-1.5 bg-dark-950 p-1.5 absolute inset-0">
                          <iframe
                            id="quad-cam-gopro"
                            src={`${tetherBaseUrl}/cam_view/gopro`}
                            className="w-full h-full border border-golden-500/40 rounded-xl"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            allowFullScreen
                          />
                          <iframe
                            id="quad-cam-gopro2"
                            src={`${tetherBaseUrl}/cam_view/gopro2`}
                            className="w-full h-full border border-golden-500/40 rounded-xl"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            allowFullScreen
                          />
                          <iframe
                            id="quad-cam-osmo"
                            src={`${tetherBaseUrl}/cam_view/osmo`}
                            className="w-full h-full border border-amber-500/40 rounded-xl"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            allowFullScreen
                          />
                          <iframe
                            id="quad-cam-dron"
                            src={`${tetherBaseUrl}/cam_view/dron`}
                            className="w-full h-full border border-cyan-500/40 rounded-xl"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                            allowFullScreen
                          />
                        </div>
                      ) : currentCam ? (
                        <iframe
                          src={`${tetherBaseUrl}/cam_view/${selectedCamId === "cam-gopro2" ? "gopro2" : selectedCamId === "cam-dji" ? "osmo" : selectedCamId === "cam-phone" ? "dron" : "gopro"}`}
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
                              Señal en Directo: La Paz Community School Tempisque vs. Golden Sport Academy
                            </h3>
                            <p className="text-xs text-gray-300">
                              Transmitiendo desde el Gimnasio La Paz Community School Tempisque con tecnología Bunny Stream Live CDN.
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
                        <span className="text-[9px] text-gray-500">Cámara Secundaria</span>
                      </div>
                    </div>
                  )}

                  {/* OFFICIAL SCOREBOARD OVERLAY ON VIDEO (Simplificado: 1° La Paz Community School Tempisque vs 2° Golden Sport Academy Santa Cruz, sin cuartos) */}
                  {(config.scoreboardVisible ?? true) && (
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <div className="bg-dark-950/90 backdrop-blur-md border border-golden-500/50 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center gap-2.5 sm:gap-3 text-white">
                        
                        {/* 1° Home Team: La Paz Community School Tempisque */}
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-7 sm:w-12 sm:h-8 rounded-lg bg-[#FCFBF9] border border-emerald-500/50 p-0.5 flex items-center justify-center shrink-0">
                            <Image src="/logo-la-paz-tempisque.png" alt="La Paz" width={40} height={24} className="object-contain max-h-6 w-auto" />
                          </div>
                          <div>
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-400 block leading-tight">
                              LA PAZ
                            </span>
                            <span className="text-sm sm:text-lg font-black font-mono leading-none block">
                              {config.scoreboard?.homeScore ?? 0}
                            </span>
                          </div>
                        </div>

                        {/* Divider VS */}
                        <div className="flex flex-col items-center justify-center px-2 border-x border-gray-700">
                          <span className="text-[10px] font-black text-golden-400 uppercase">
                            VS
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mt-0.5" />
                        </div>

                        {/* 2° Away Team: Golden Sport Academy Santa Cruz */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-golden-400 block leading-tight">
                              GOLDEN
                            </span>
                            <span className="text-sm sm:text-lg font-black font-mono leading-none block">
                              {config.scoreboard?.awayScore ?? 0}
                            </span>
                          </div>
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-dark-900 border border-golden-500/50 p-0.5 flex items-center justify-center shrink-0">
                            <Image src="/logo.png" alt="Golden" width={24} height={24} className="object-contain" />
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Watermark Sponsor Overlay (Condicional: sponsorsVisible) */}
                  {(config.sponsorsVisible ?? true) && (
                    <div className="absolute bottom-3 right-4 z-20 pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 bg-dark-950/80 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-golden-500/30">
                        <Image src="/curiol-studio-official.png" alt="Curiol Studio" width={22} height={22} className="object-contain" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-golden-400">
                          CURIOL STUDIO
                        </span>
                      </div>
                    </div>
                  )}

                </div>
                )}
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

            {/* CINTILLA OFICIAL DE PATROCINADORES Y PAUTA EN VIVO */}
            <div className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border-2 border-golden-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-golden-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-golden-400">
                    Patrocinadores Oficiales & Pauta Publicitaria
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  Transmitido en Vivo por Curiol Studio
                </span>
              </div>

              {/* Grid de Patrocinador Oro y Pauta Abierta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Patrocinador Oficial Oro: Curiol Studio */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-golden-500/50 flex items-center gap-4 shadow-lg group hover:border-golden-400 transition-all">
                  <div className="w-24 sm:w-28 h-14 rounded-xl bg-dark-900 border border-golden-500/40 p-2 flex items-center justify-center shrink-0">
                    <Image
                      src="/curiol-studio-official.png"
                      alt="Curiol Studio"
                      width={110}
                      height={40}
                      className="object-contain max-h-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.2 rounded bg-golden-500 text-dark-950 text-[9px] font-black uppercase">
                        Patrocinador Oro
                      </span>
                      <span className="text-[10px] font-bold text-gray-300">Oficial</span>
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">Curiol Studio</h4>
                    <p className="text-[11px] text-gray-400 leading-tight">
                      Fotografía deportiva de autor, cobertura de partidos y tecnología phygital.
                    </p>
                  </div>
                </div>

                {/* Llamado a Nuevos Patrocinadores / Pauta en Vivo */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-golden-950/40 via-dark-950 to-dark-900 border border-golden-500/30 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black uppercase">
                        Espacio de Pauta Disponible
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">
                      ¿Deseas pautar tu negocio durante las transmisiones?
                    </h4>
                    <p className="text-[11px] text-gray-300 leading-tight">
                      Llega a todas las familias de Santa Cruz y Guanacaste que apoyan al equipo.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href="https://wa.me/50660602617?text=Hola%20Alberto%20Bustos%20(Curiol%20Studio),%20deseo%20información%20para%20pautar%20mi%20negocio%20en%20las%20transmisiones%20en%20vivo%20de%20Golden%20Sport%20Academy"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Pautar con Curiol Studio (6060-2617)</span>
                    </a>
                    <Link
                      href="/patrocinadores"
                      className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-golden-400 border border-golden-500/30 text-[11px] font-bold uppercase transition-colors"
                    >
                      Tarifas y Planes →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

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
