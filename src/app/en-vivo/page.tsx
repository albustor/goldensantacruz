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
  const [selectedCamId, setSelectedCamId] = useState<string>("cam-poster");
  const [isPipActive, setIsPipActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Fotos en vivo en tiempo real
  const [tetherBaseUrl, setTetherBaseUrl] = useState<string>(HP_ROJA_TETHER_URL);
  const [sonyPhotos, setSonyPhotos] = useState<SonyTetherPhoto[]>([]);
  const [approvedPhotoIds, setApprovedPhotoIds] = useState<Record<string, boolean>>({});
  const [selectedSonyPhoto, setSelectedSonyPhoto] = useState<SonyTetherPhoto | null>(null);
  const [tetherOnline, setTetherOnline] = useState<boolean>(false);
  const [tetherNodeLabel, setTetherNodeLabel] = useState<string>("Cobertura en Cancha");
  const [simulatingShot, setSimulatingShot] = useState<boolean>(false);
  const [operatorMode, setOperatorMode] = useState<boolean>(false);
  const [sedeProfileId, setSedeProfileId] = useState<string>("la_paz_tempisque_basket_gimnasio");
  const [calibratingSede, setCalibratingSede] = useState<boolean>(false);
  const [calibrationMsg, setCalibrationMsg] = useState<string>("");

  // Control de Cámaras vs Afiche en Espera (Bloqueadas por defecto para que ninguna cámara aparezca caída)
  const [camLiveEnabled, setCamLiveEnabled] = useState<Record<string, boolean>>({
    "cam-gopro": false,
    "cam-gopro2": false,
    "cam-dji": false,
    "cam-phone": false,
  });
  const [camPosterWithSound, setCamPosterWithSound] = useState<Record<string, boolean>>({
    "cam-poster": true,
    "cam-gopro": true,
    "cam-gopro2": true,
    "cam-dji": true,
    "cam-phone": true,
  });
  const [hideAllCameraButtons, setHideAllCameraButtons] = useState<boolean>(false);
  const [posterCleanImageOnly, setPosterCleanImageOnly] = useState<boolean>(false);
  const [showPosterControls, setShowPosterControls] = useState<boolean>(false);
  const [posterStatusText, setPosterStatusText] = useState<string>(
    "⏳ PRONTO INICIARÁ EL PARTIDO • TRANSMISIÓN EN PROCESO"
  );
  const [customPosterBgUrl, setCustomPosterBgUrl] = useState<string>("/Hero_Basketball/1.jpg");
  const posterBgInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTickerIdx, setActiveTickerIdx] = useState<number>(0);

  // Categoría editable en vivo + Música en Bucle (Protegido con Clave de Administrador)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [showAdminPinPrompt, setShowAdminPinPrompt] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>("");
  const [adminPinError, setAdminPinError] = useState<boolean>(false);
  const [pendingAdminAction, setPendingAdminAction] = useState<"category" | "poster_controls" | "upload_music" | null>(null);
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
    if (typeof window !== "undefined" && sessionStorage.getItem("golden_admin_logged") === "true") {
      setIsAdminUnlocked(true);
    }
    const tickerTimer = setInterval(() => {
      setActiveTickerIdx((prev) => (prev + 1) % 4);
    }, 6500);
    return () => clearInterval(tickerTimer);
  }, []);

  const handleRequestAdminAction = (actionType: "category" | "poster_controls" | "upload_music") => {
    if (isAdminUnlocked) {
      if (actionType === "category") {
        setCategoryDraft(config.category || "Niños Pequeños (Formativo)");
        setEditingCategoryLive((v) => !v);
      } else if (actionType === "poster_controls") {
        setShowPosterControls((v) => !v);
      } else if (actionType === "upload_music") {
        bgFileInputRef.current?.click();
      }
      return;
    }
    setPendingAdminAction(actionType);
    setAdminPinInput("");
    setAdminPinError(false);
    setShowAdminPinPrompt(true);
  };

  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = adminPinInput.trim().toLowerCase();
    const settingsPin = (Store.getSettings()?.adminPin || "20261829").toLowerCase();
    if (
      cleanPin === settingsPin ||
      cleanPin === "20261829" ||
      cleanPin === "1726" ||
      cleanPin === "golden2026" ||
      cleanPin === "60602617" ||
      cleanPin === "62806989" ||
      cleanPin === "admin"
    ) {
      setIsAdminUnlocked(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("golden_admin_logged", "true");
      }
      setShowAdminPinPrompt(false);
      setAdminPinError(false);
      if (pendingAdminAction === "category") {
        setCategoryDraft(config.category || "Niños Pequeños (Formativo)");
        setEditingCategoryLive(true);
      } else if (pendingAdminAction === "poster_controls") {
        setShowPosterControls(true);
      } else if (pendingAdminAction === "upload_music") {
        bgFileInputRef.current?.click();
      }
      setPendingAdminAction(null);
    } else {
      setAdminPinError(true);
    }
  };

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

  const handleUploadPosterBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setCustomPosterBgUrl(blobUrl);
  };

  const toggleSingleCamLive = (camKey: string) => {
    setCamLiveEnabled((prev) => ({
      ...prev,
      [camKey]: !prev[camKey],
    }));
  };

  const toggleCamPosterSound = (camKey: string) => {
    setCamPosterWithSound((prev) => {
      const nextVal = !prev[camKey];
      const el = bgAudioRef.current;
      if (selectedCamId === camKey && el) {
        if (!nextVal && isPlayingBgMusic) {
          el.pause();
          setIsPlayingBgMusic(false);
        } else if (nextVal && !isPlayingBgMusic) {
          el.volume = 0.55;
          el.play().then(() => setIsPlayingBgMusic(true)).catch(() => {});
        }
      }
      return {
        ...prev,
        [camKey]: nextVal,
      };
    });
  };

  const disableAllCamerasToPoster = () => {
    setCamLiveEnabled({
      "cam-gopro": false,
      "cam-gopro2": false,
      "cam-dji": false,
      "cam-phone": false,
    });
    setHideAllCameraButtons(true);
    setSelectedCamId("cam-poster");
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
                    onClick={() => handleRequestAdminAction("category")}
                    className="ml-1 px-1.5 py-0.5 rounded bg-golden-500 text-dark-950 hover:bg-golden-400 text-[9px] font-black uppercase flex items-center gap-1"
                    title="Requiere clave de administrador para modificar la categoría"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>{isAdminUnlocked ? "Anotar categoría" : "🔒 Anotar categoría"}</span>
                  </button>
                </div>

                <span className="px-2.5 py-0.5 rounded-lg bg-dark-800 text-gray-300 border border-gray-700 text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-golden-400" />
                  <span>{config.location || "Gimnasio La Paz Community School Tempisque"}</span>
                </span>
              </div>

              {showAdminPinPrompt && (
                <form
                  onSubmit={handleVerifyAdminPin}
                  className="flex flex-wrap items-center gap-2 p-2.5 mt-2 rounded-2xl bg-dark-950 border-2 border-golden-500/60 shadow-xl max-w-xl"
                >
                  <span className="text-xs font-black text-golden-400 uppercase flex items-center gap-1">
                    🔐 Clave de administrador:
                  </span>
                  <input
                    type="password"
                    value={adminPinInput}
                    onChange={(e) => {
                      setAdminPinInput(e.target.value);
                      setAdminPinError(false);
                    }}
                    placeholder="Ingresa la clave de administrador..."
                    autoFocus
                    className="px-3 py-1.5 rounded-xl bg-dark-900 border border-gray-700 focus:border-golden-400 text-white text-xs font-bold outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase"
                  >
                    Desbloquear
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminPinPrompt(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  {adminPinError && (
                    <span className="text-[11px] font-bold text-red-400 w-full">
                      ⚠️ Clave incorrecta. Solo el administrador puede realizar este cambio.
                    </span>
                  )}
                </form>
              )}

              {editingCategoryLive && isAdminUnlocked && (
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
                  <button
                    type="button"
                    onClick={() => setEditingCategoryLive(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-dark-800 text-gray-300 text-xs font-bold"
                  >
                    Cerrar
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
                onClick={() => handleRequestAdminAction("upload_music")}
                className="px-3 py-2 rounded-xl bg-golden-500/20 hover:bg-golden-500/30 border border-golden-500/50 text-golden-300 font-black text-xs uppercase flex items-center gap-1.5"
                title="Cargar archivo de música personalizado (requiere clave de administrador)"
              >
                <Music className="w-3.5 h-3.5" />
                <span>{isAdminUnlocked ? "Cargar música" : "🔒 Cargar música"}</span>
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

      {/* Banner Informativo Limpio de Arquitectura de Campo Activa (Cero IPs ni nombres internos) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <input
          ref={posterBgInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadPosterBg}
          className="hidden"
        />
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-golden-950/75 via-dark-900 to-emerald-950/60 border border-golden-500/45 space-y-3.5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-golden-500/20 border border-golden-500/50 flex items-center justify-center text-golden-400 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-golden-500 text-dark-950 text-[10px] font-black uppercase tracking-wider">
                    Arquitectura de campo activa
                  </span>
                  <span className="text-xs sm:text-sm font-black text-white">
                    Tecnología interactiva en tiempo real • Golden Sport Academy & Curiol Studio
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Vive en tiempo real todo lo que sucede en la cancha: <strong className="text-golden-300">transmisión con sonido ambiente auténtico de gimnasio</strong>, selección interactiva de ángulos, fotografías al instante y <strong className="text-emerald-300">tomas aéreas exclusivas con nuestro dron</strong>.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-dark-950 text-golden-400 border border-golden-500/30">
                🎙️ Sonido ambiente real
              </span>
              <button
                type="button"
                onClick={() => handleRequestAdminAction("poster_controls")}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-dark-950 hover:bg-dark-800 text-gray-300 border border-gray-700 transition-all"
                title="Controlar qué cámaras están activas o dejar solo el afiche + sonido (requiere clave de administrador)"
              >
                ⚙️ {showPosterControls ? "Ocultar control de pantalla" : isAdminUnlocked ? "Control de cámaras / afiche" : "🔒 Control de cámaras / afiche"}
              </button>
            </div>
          </div>

          {/* Píldoras Interactivas de Experiencia en Vivo + Cintillo Dinámico del Convenio */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 border-t border-gray-800/80">
            {[
              {
                idx: 0,
                badge: "🎙️ Sonido ambiente en vivo",
                title: "Emoción 100 % real de cancha",
                desc: "Transmitimos con sonido ambiente directo del gimnasio para que sientas cada jugada, indicación y aplauso como en la gradería.",
              },
              {
                idx: 1,
                badge: "🚁 Atención a las tomas aéreas",
                title: "Vistas exclusivas con nuestro dron",
                desc: "Mantente pendiente durante la jornada: activaremos tomas aéreas y cenitales con nuestro dron sobre el recinto deportivo.",
              },
              {
                idx: 2,
                badge: "⚡ Tecnología interactiva",
                title: "Tú eliges cómo vivir el partido",
                desc: "Alterna ángulos de cámara, sigue el marcador al instante, envía reacciones de apoyo y mira las fotos reveladas en tiempo real.",
              },
              {
                idx: 3,
                badge: "🤝 Convenio Golden × Curiol Studio",
                title: "Espacios publicitarios abiertos",
                desc: "Impulsa tu marca o negocio frente a todas las familias de Guanacaste y apoya directamente el baloncesto formativo infantil.",
              },
            ].map((item) => {
              const isCurrent = activeTickerIdx === item.idx;
              return (
                <button
                  key={item.idx}
                  type="button"
                  onClick={() => setActiveTickerIdx(item.idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isCurrent
                      ? "bg-dark-950/95 border-golden-400 shadow-lg shadow-golden-500/15 scale-[1.01]"
                      : "bg-dark-950/60 border-gray-800/90 hover:border-gray-700 opacity-85 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      isCurrent ? "bg-golden-500 text-dark-950" : "bg-dark-800 text-golden-400"
                    }`}>
                      {item.badge}
                    </span>
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                  </div>
                  <div className="text-xs font-black text-white leading-snug">{item.title}</div>
                  <p className="text-[11px] text-gray-300 leading-tight mt-1">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel de Control de Cámaras y Afiche (Para activar/bloquear cámaras individualmente o dejar solo Afiche + Sonido) */}
        {showPosterControls && (
          <div className="mt-3 p-4 rounded-2xl bg-dark-900 border-2 border-golden-500/50 space-y-3 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2.5">
              <div>
                <h4 className="text-xs font-black uppercase text-golden-400">
                  🎛️ Control de Pantalla Principal, Cámaras y Afiche con Sonido en Bucle
                </h4>
                <p className="text-[11px] text-gray-400">
                  Si una cámara no está transmitiendo, déjala en <strong>«🛡️ En Afiche»</strong> (con o sin sonido). Si ninguna cámara está activa, pulsa <strong>«🚫 Desactivar Todas las Cámaras»</strong> para dejar únicamente tu imagen y el sonido en bucle.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (hideAllCameraButtons) {
                      setHideAllCameraButtons(false);
                    } else {
                      disableAllCamerasToPoster();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase transition-all ${
                    hideAllCameraButtons
                      ? "bg-emerald-500 hover:bg-emerald-400 text-dark-950"
                      : "bg-amber-500 hover:bg-amber-400 text-dark-950"
                  }`}
                >
                  {hideAllCameraButtons
                    ? "📹 Volver a Mostrar Botones de Cámaras"
                    : "🚫 Desactivar Todas las Cámaras (Solo Imagen + Sonido)"}
                </button>
                <button
                  type="button"
                  onClick={() => posterBgInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-dark-950 hover:bg-dark-800 border border-golden-500/50 text-golden-300 font-bold text-xs uppercase"
                >
                  🖼️ Elegir Imagen del Afiche
                </button>
                <button
                  type="button"
                  onClick={() => setPosterCleanImageOnly((v) => !v)}
                  className="px-3 py-1.5 rounded-xl bg-dark-950 hover:bg-dark-800 border border-gray-700 text-gray-200 font-bold text-xs uppercase"
                >
                  {posterCleanImageOnly ? "📊 Mostrar Pizarra sobre Imagen" : "🖼️ Mostrar Solo Mi Imagen + Sonido"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {[
                { id: "cam-gopro", label: "📹 Cámara 1 (Cancha)" },
                { id: "cam-gopro2", label: "📹 Cámara 2 (Aro)" },
                { id: "cam-dji", label: "🔥 Cámara 3 (Lateral)" },
                { id: "cam-phone", label: "🚁 Cámara 4 (Aérea)" },
              ].map((c) => {
                const isOn = !!camLiveEnabled[c.id];
                const hasSound = camPosterWithSound[c.id] !== false;
                return (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col gap-2 transition-all ${
                      isOn
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                        : "bg-dark-950 border-gray-800 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{c.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleSingleCamLive(c.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isOn ? "bg-emerald-500 text-dark-950" : "bg-amber-500/20 border border-amber-400/50 text-amber-300"
                        }`}
                      >
                        {isOn ? "● Video Activo" : "🛡️ En Afiche"}
                      </button>
                    </div>
                    {!isOn && (
                      <button
                        type="button"
                        onClick={() => toggleCamPosterSound(c.id)}
                        className={`w-full py-1 px-2 rounded-lg text-[10px] font-black uppercase border flex items-center justify-center gap-1 ${
                          hasSound
                            ? "bg-golden-500/20 border-golden-500/50 text-golden-300"
                            : "bg-dark-900 border-gray-700 text-gray-400"
                        }`}
                      >
                        <span>{hasSound ? "🔊 Afiche CON Sonido" : "🔇 Afiche SIN Sonido"}</span>
                      </button>
                    )}
                  </div>
                );
              })}

              <select
                value={posterStatusText}
                onChange={(e) => setPosterStatusText(e.target.value)}
                aria-label="Mensaje de estado del afiche"
                className="p-2.5 rounded-xl bg-dark-950 border border-gray-700 text-white text-xs font-bold outline-none"
              >
                <option value="⏳ PRONTO INICIARÁ EL PARTIDO • TRANSMISIÓN EN PROCESO">
                  ⏳ Pronto iniciará el partido
                </option>
                <option value="🔴 PARTIDO EN DESARROLLO • EN VIVO">
                  🔴 Partido en desarrollo
                </option>
                <option value="🏀 ENTRETIEMPO / PREPARANDO SIGUIENTE CATEGORÍA">
                  🏀 Preparando siguiente categoría
                </option>
                <option value="✨ GRACIAS POR ACOMPAÑARNOS • FINAL DEL ENCUENTRO">
                  ✨ Final del encuentro
                </option>
              </select>
            </div>
          </div>
        )}
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
                {/* Selector de Vista: Afiche + Música en Bucle, Cámaras y Galería Fotográfica (Cero nombres internos) */}
                <div className="p-3 sm:p-4 rounded-2xl bg-dark-900 border border-golden-500/30 shadow-xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase text-golden-400 tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4" />
                      <span>Elige la Vista del Partido o Galería Fotográfica en Vivo:</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-dark-950 border border-gray-800 text-[10px] text-gray-300 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Cobertura Oficial Curiol Studio</span>
                      </div>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${hideAllCameraButtons ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-2.5`}>
                    {/* Afiche Oficial + Música en Bucle (Activo por defecto mientras no hay cámaras) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCamId("cam-poster");
                        setIsPipActive(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedCamId === "cam-poster"
                          ? "bg-gradient-to-r from-amber-400 via-golden-500 to-yellow-500 text-dark-950 border-golden-200 font-black shadow-lg shadow-golden-500/40 scale-[1.01]"
                          : "bg-dark-950 text-golden-300 hover:text-white hover:bg-dark-850 border-golden-500/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🎬</span>
                        <div>
                          <div className="text-xs font-black uppercase tracking-tight">
                            Afiche + Sonido
                          </div>
                          <div className={`text-[10px] ${selectedCamId === "cam-poster" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                            ▶ Música en Bucle
                          </div>
                        </div>
                      </div>
                      {selectedCamId === "cam-poster" ? (
                        <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                          ● ACTIVO
                        </span>
                      ) : (
                        <span className="text-[10px] text-golden-400 font-bold uppercase">Ver →</span>
                      )}
                    </button>

                    {!hideAllCameraButtons && (
                      <>
                        {/* Cámara 1: Cancha Completa */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCamId("cam-gopro");
                            setIsPipActive(false);
                            if (camPosterWithSound["cam-gopro"] === false && isPlayingBgMusic && bgAudioRef.current) {
                              bgAudioRef.current.pause();
                              setIsPlayingBgMusic(false);
                            }
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
                                Cámara 1 (Cancha)
                              </div>
                              <div className={`text-[10px] ${selectedCamId === "cam-gopro" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                                {camLiveEnabled["cam-gopro"] ? "Vista Panorámica" : "⏳ Pronto iniciará"}
                              </div>
                            </div>
                          </div>
                          {selectedCamId === "cam-gopro" ? (
                            <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                              ● VISTA
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Ver →</span>
                          )}
                        </button>

                        {/* Cámara 2: Bajo el Aro */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCamId("cam-gopro2");
                            setIsPipActive(false);
                            if (camPosterWithSound["cam-gopro2"] === false && isPlayingBgMusic && bgAudioRef.current) {
                              bgAudioRef.current.pause();
                              setIsPlayingBgMusic(false);
                            }
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
                                Cámara 2 (Aro)
                              </div>
                              <div className={`text-[10px] ${selectedCamId === "cam-gopro2" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                                {camLiveEnabled["cam-gopro2"] ? "Ángulo Alterno" : "⏳ Pronto iniciará"}
                              </div>
                            </div>
                          </div>
                          {selectedCamId === "cam-gopro2" ? (
                            <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                              ● VISTA
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Ver →</span>
                          )}
                        </button>

                        {/* Cámara 3: Seguimiento Lateral */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCamId("cam-dji");
                            setIsPipActive(false);
                            if (camPosterWithSound["cam-dji"] === false && isPlayingBgMusic && bgAudioRef.current) {
                              bgAudioRef.current.pause();
                              setIsPlayingBgMusic(false);
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                            selectedCamId === "cam-dji"
                              ? "bg-gradient-to-r from-golden-400 via-golden-500 to-amber-500 text-dark-950 border-golden-300 font-black shadow-lg shadow-golden-500/30 scale-[1.01]"
                              : "bg-dark-950 text-gray-300 hover:text-white hover:bg-dark-850 border-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">🔥</span>
                            <div>
                              <div className="text-xs font-black uppercase tracking-tight">
                                Cámara 3 (Lateral)
                              </div>
                              <div className={`text-[10px] ${selectedCamId === "cam-dji" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                                {camLiveEnabled["cam-dji"] ? "Bajo el Aro / Lateral" : "⏳ Pronto iniciará"}
                              </div>
                            </div>
                          </div>
                          {selectedCamId === "cam-dji" ? (
                            <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                              ● VISTA
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Ver →</span>
                          )}
                        </button>

                        {/* Cámara 4: Vista Aérea & Cenital */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCamId("cam-phone");
                            setIsPipActive(false);
                            if (camPosterWithSound["cam-phone"] === false && isPlayingBgMusic && bgAudioRef.current) {
                              bgAudioRef.current.pause();
                              setIsPlayingBgMusic(false);
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                            selectedCamId === "cam-phone"
                              ? "bg-gradient-to-r from-golden-400 via-golden-500 to-amber-500 text-dark-950 border-golden-300 font-black shadow-lg shadow-golden-500/30 scale-[1.01]"
                              : "bg-dark-950 text-gray-300 hover:text-white hover:bg-dark-850 border-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">🚁</span>
                            <div>
                              <div className="text-xs font-black uppercase tracking-tight">
                                Cámara 4 (Aérea)
                              </div>
                              <div className={`text-[10px] ${selectedCamId === "cam-phone" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                                {camLiveEnabled["cam-phone"] ? "Vista Aérea / Cenital" : "⏳ Pronto iniciará"}
                              </div>
                            </div>
                          </div>
                          {selectedCamId === "cam-phone" ? (
                            <span className="px-2 py-0.5 rounded-lg bg-dark-950 text-golden-400 text-[9px] font-black uppercase tracking-wider animate-pulse">
                              ● VISTA
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Ver →</span>
                          )}
                        </button>
                      </>
                    )}

                    {/* Galería Fotográfica en Tiempo Real */}
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
                            Fotografías en Vivo
                          </div>
                          <div className={`text-[10px] ${selectedCamId === "cam-sony-photos" ? "text-dark-900 font-bold" : "text-emerald-400"}`}>
                            Galería Instantánea ({sonyPhotos.filter((p) => p.published_live || approvedPhotoIds[p.base_id || p.id || p.filename]).length})
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

                {/* Si está activa la Galería Fotográfica en Tiempo Real */}
                {selectedCamId === "cam-sony-photos" ? (
                  <div className="rounded-3xl bg-dark-900 border-2 border-emerald-500/40 shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-gray-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-wide">
                            Galería Fotográfica en Tiempo Real • Curiol Studio
                          </h3>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Las mejores fotografías capturadas en cancha durante el partido se publican aquí en tiempo real.
                        </p>
                      </div>
                    </div>

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
                        </div>

                        {/* Tira de Miniaturas en Tiempo Real */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Fotografías del partido en directo:</span>
                            <span className="text-emerald-400 font-bold">
                              Publicadas: {sonyPhotos.filter((p) => p.published_live || approvedPhotoIds[p.base_id || p.id || p.filename]).length}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                            {sonyPhotos
                              .filter((p) => p.published_live || approvedPhotoIds[p.base_id || p.id || p.filename])
                              .slice(0, 24)
                              .map((p) => {
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
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-14 text-center space-y-3">
                        <div className="text-4xl">📸</div>
                        <h4 className="text-base font-black text-white uppercase">
                          Pronto Iniciará la Galería Fotográfica en Vivo
                        </h4>
                        <p className="text-xs text-gray-400 max-w-md mx-auto">
                          En cuanto comience el encuentro en el Gimnasio La Paz Community School Tempisque, aquí aparecerán de forma instantánea las fotografías oficiales capturadas por Curiol Studio.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                /* Video Player Container (Si la cámara seleccionada no está activa, muestra siempre el Afiche Oficial + Música en Bucle, CERO pantallas caídas) */
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-dark-950 border-2 border-golden-500/40 shadow-2xl group">
                  
                  {selectedCamId !== "cam-poster" && camLiveEnabled[selectedCamId] ? (
                    <div className="w-full h-full relative bg-dark-950 flex items-center justify-center">
                      <iframe
                        src={`${tetherBaseUrl}/cam_view/${selectedCamId === "cam-gopro2" ? "gopro2" : selectedCamId === "cam-dji" ? "osmo" : selectedCamId === "cam-phone" ? "dron" : "gopro"}`}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    /* AFICHE OFICIAL EN VIVO + FLECHA DE SONIDO EN BUCLE EN PANTALLA PRINCIPAL */
                    <div className="w-full h-full relative bg-dark-950 flex flex-col items-center justify-between p-4 sm:p-8 text-center overflow-hidden">
                      {/* Imagen de Fondo del Afiche Personalizable */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={customPosterBgUrl}
                        alt="Fondo Afiche Oficial"
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                          posterCleanImageOnly ? "opacity-95 scale-100" : "opacity-35 scale-105"
                        }`}
                      />
                      {!posterCleanImageOnly && (
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-dark-950/75" />
                      )}

                      {/* Parte Superior del Afiche: Mensaje "Pronto iniciará el partido" + Categoría */}
                      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-1">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-950/90 border border-amber-400/70 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                          <span>
                            {selectedCamId !== "cam-poster"
                              ? "⏳ PRONTO INICIARÁ EL PARTIDO • SEÑAL DE CÁMARA EN PROCESO"
                              : posterStatusText}
                          </span>
                        </span>

                        <span className="px-3.5 py-1.5 rounded-full bg-golden-500 text-dark-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg">
                          🏀 {config.category || "Niños Pequeños (Formativo)"}
                        </span>
                      </div>

                      {/* Parte Central del Afiche: 1° La Paz Community School Tempisque vs 2° Golden Sport Academy Santa Cruz (Ocultable si elige "Solo Mi Imagen + Sonido") */}
                      {!posterCleanImageOnly ? (
                        <div className="relative z-10 w-full max-w-4xl my-auto py-2">
                          <div className="grid grid-cols-1 sm:grid-cols-7 items-center gap-3 sm:gap-5 bg-dark-950/85 backdrop-blur-md border-2 border-golden-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl">
                            {/* 1° Local: La Paz Community School Tempisque */}
                            <div className="sm:col-span-3 flex items-center justify-between sm:justify-center gap-3">
                              <div className="w-24 h-14 sm:w-28 sm:h-16 rounded-2xl bg-[#FCFBF9] border-2 border-emerald-500 p-1.5 flex items-center justify-center shadow-lg shrink-0">
                                <Image
                                  src="/logo-la-paz-tempisque.png"
                                  alt="La Paz Community School Tempisque"
                                  width={110}
                                  height={48}
                                  className="object-contain max-h-12 w-auto"
                                />
                              </div>
                              <div className="text-left">
                                <span className="text-[10px] font-black uppercase text-emerald-400 block">
                                  🏠 Equipo Local
                                </span>
                                <span className="text-xs sm:text-sm font-black text-white leading-tight block">
                                  {config.scoreboard?.homeTeam || "La Paz Community School Tempisque"}
                                </span>
                                <span className="text-2xl sm:text-4xl font-black font-mono text-emerald-400 leading-none mt-1 block">
                                  {config.scoreboard?.homeScore ?? 0}
                                </span>
                              </div>
                            </div>

                            {/* VS Central */}
                            <div className="sm:col-span-1 flex flex-col items-center justify-center">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-golden-400 to-amber-600 text-dark-950 font-black text-sm flex items-center justify-center shadow-lg border border-golden-200">
                                VS
                              </div>
                            </div>

                            {/* 2° Visita: Golden Sport Academy Santa Cruz */}
                            <div className="sm:col-span-3 flex flex-row-reverse sm:flex-row items-center justify-between sm:justify-center gap-3">
                              <div className="text-right">
                                <span className="text-[10px] font-black uppercase text-golden-400 block">
                                  🚌 Equipo Visita
                                </span>
                                <span className="text-xs sm:text-sm font-black text-golden-400 leading-tight block">
                                  {config.scoreboard?.awayTeam || "Golden Sport Academy Santa Cruz"}
                                </span>
                                <span className="text-2xl sm:text-4xl font-black font-mono text-golden-400 leading-none mt-1 block">
                                  {config.scoreboard?.awayScore ?? 0}
                                </span>
                              </div>
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-dark-900 border-2 border-golden-500 p-1.5 flex items-center justify-center shadow-lg shrink-0">
                                <Image
                                  src="/logo.png"
                                  alt="Golden Sport Academy Santa Cruz"
                                  width={54}
                                  height={54}
                                  className="object-contain max-h-12 w-auto"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="my-auto" />
                      )}

                      {/* Parte Inferior del Afiche: FLECHA DE SONIDO EN BUCLE (▶ / ⏸) + Opción Con/Sin Sonido */}
                      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pb-1">
                        {camPosterWithSound[selectedCamId] !== false ? (
                          <button
                            type="button"
                            onClick={toggleBgMusic}
                            className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-3 border-2 shadow-2xl transition-all hover:scale-105 ${
                              isPlayingBgMusic
                                ? "bg-emerald-500 text-dark-950 border-emerald-200 shadow-emerald-500/40"
                                : "bg-gradient-to-r from-golden-400 via-golden-500 to-amber-500 text-dark-950 border-golden-200 shadow-golden-500/40"
                            }`}
                          >
                            <span className="w-8 h-8 rounded-xl bg-dark-950 text-golden-400 flex items-center justify-center text-base font-black shadow-md">
                              {isPlayingBgMusic ? "⏸" : "▶"}
                            </span>
                            <div className="text-left">
                              <span className="block leading-tight">
                                {isPlayingBgMusic
                                  ? "🔊 SONIDO EN BUCLE ACTIVO (Toca para Pausar)"
                                  : "▶ REPRODUCIR SONIDO EN BUCLE DEL PARTIDO"}
                              </span>
                              <span className="text-[10px] font-bold opacity-85 block">
                                🔁 {customBgMusicName || "Canción Oficial La Paz vs. Golden (En Bucle)"}
                              </span>
                            </div>
                          </button>
                        ) : (
                          <div className="px-4 py-2 rounded-2xl bg-dark-950/90 border border-gray-700 text-gray-300 text-xs font-bold flex items-center gap-2">
                            <VolumeX className="w-4 h-4 text-gray-400" />
                            <span>🔇 Afiche en Modo Silencioso</span>
                            <button
                              type="button"
                              onClick={() => toggleCamPosterSound(selectedCamId)}
                              className="ml-2 px-2.5 py-1 rounded-lg bg-golden-500 text-dark-950 font-black text-[10px] uppercase"
                            >
                              Activar Sonido ▶
                            </button>
                          </div>
                        )}
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

                  {/* OFFICIAL SCOREBOARD OVERLAY ON VIDEO (Solo cuando hay cámara de video activa o modo imagen limpia, para no encimar el Afiche) */}
                  {(config.scoreboardVisible ?? true) && ((selectedCamId !== "cam-poster" && camLiveEnabled[selectedCamId]) || posterCleanImageOnly) && (
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

            {/* CONVENIO OFICIAL DE ESPACIOS PUBLICITARIOS: GOLDEN SPORT ACADEMY × CURIOL STUDIO */}
            <div className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border-2 border-golden-500/45 p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-golden-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-golden-400">
                    Convenio oficial • Golden Sport Academy & Curiol Studio
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">
                  🤝 Espacios publicitarios abiertos para marcas y comercios
                </span>
              </div>

              {/* Grid de Alianza Estratégica y Pauta Comercial en Vivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Aliado Tecnológico Oficial: Curiol Studio */}
                <div className="p-4 rounded-2xl bg-dark-950 border border-golden-500/50 flex flex-col justify-between gap-3 shadow-lg group hover:border-golden-400 transition-all">
                  <div className="flex items-center gap-4">
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
                        <span className="px-2 py-0.5 rounded bg-golden-500 text-dark-950 text-[9px] font-black uppercase">
                          Convenio oficial
                        </span>
                        <span className="text-[10px] font-bold text-gray-300">Producción & Tecnología</span>
                      </div>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">
                        Golden Sport Academy × Curiol Studio
                      </h4>
                      <p className="text-[11px] text-gray-300 leading-tight">
                        Alianza estratégica para llevar las jornadas formativas en tiempo real a todas las familias de Santa Cruz y Guanacaste, con fotografía instantánea y cobertura multicámara.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-gray-800/80 text-[10px] text-center font-bold text-golden-300">
                    <span className="px-2 py-1 rounded-lg bg-dark-900 border border-gray-800">📺 Pantalla en vivo</span>
                    <span className="px-2 py-1 rounded-lg bg-dark-900 border border-gray-800">📸 Galería en directo</span>
                    <span className="px-2 py-1 rounded-lg bg-dark-900 border border-gray-800">🏀 Apoyo formativo</span>
                  </div>
                </div>

                {/* Llamado a Nuevos Patrocinadores bajo el Convenio */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-golden-950/45 via-dark-950 to-emerald-950/35 border border-golden-500/40 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black uppercase">
                        Espacios publicitarios disponibles hoy
                      </span>
                      <span className="text-[10px] text-golden-300 font-bold">
                        • Tarifas especiales de convenio
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                      ¿Tienes una empresa, comercio o consultorio? Anúnciate en nuestras transmisiones en vivo
                    </h4>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      Posiciona tu marca en tiempo real en la pantalla principal, en las fotografías instantáneas y en el muro de familias bajo el convenio <strong className="text-golden-300">Golden Sport Academy & Curiol Studio</strong>, impulsando directamente el deporte infantil.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href="https://wa.me/50660602617?text=Hola%20Alberto%20Bustos%20(Curiol%20Studio),%20deseo%20información%20sobre%20los%20espacios%20publicitarios%20bajo%20el%20convenio%20entre%20Golden%20Sport%20Academy%20y%20Curiol%20Studio"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Reservar espacio por WhatsApp (6060-2617)</span>
                    </a>
                    <Link
                      href="/patrocinadores"
                      className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-golden-400 border border-golden-500/30 text-[11px] font-bold uppercase transition-colors"
                    >
                      Ver beneficios del convenio →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Experiencia Interactiva, Sonido Ambiente de Cancha y Tomas Aéreas con Dron */}
            <div className="p-5 sm:p-6 rounded-3xl bg-dark-900/80 border border-golden-500/30 space-y-3 text-xs shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-golden-400 font-black uppercase text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Experiencia interactiva en tiempo real • Sonido ambiente de cancha y dron aéreo</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  🚁 Atención a las tomas aéreas
                </span>
              </div>
              <p className="text-gray-200 leading-relaxed">
                Disfruta una transmisión diseñada para vivir el partido desde adentro: operamos <strong className="text-golden-300">exclusivamente con sonido ambiente real de cancha</strong> (acompañado por nuestra música oficial en bucle durante la previa y descansos) para que escuches cada jugada, el aliento de las familias y la energía de los niños en tiempo real. Puedes alternar libremente entre las vistas disponibles, revisar las fotografías profesionales reveladas al instante y <strong className="text-emerald-300">mantenerte muy pendiente de las tomas aéreas y cenitales con nuestro dron</strong> durante la jornada.
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
