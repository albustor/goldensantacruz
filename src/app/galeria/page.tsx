"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  Upload,
  Heart,
  Calendar,
  User,
  Sparkles,
  Plus,
  Users,
  ShoppingBag,
  TreeDeciduous,
  Search,
  X,
  FolderHeart,
  ArrowLeft,
  Lock,
  Unlock,
  ChevronRight,
  Trash2,
  Download,
  CheckCircle2,
} from "lucide-react";
import { GalleryAlbum, GalleryPhoto, SystemSettings } from "@/types";
import { Store } from "@/lib/store";
import { INITIAL_ALBUMS } from "@/lib/initialData";
import PhotoUploadModal from "@/components/galeria/PhotoUploadModal";
import PhotoLightboxModal from "@/components/galeria/PhotoLightboxModal";
import PhotoPurchaseModal from "@/components/galeria/PhotoPurchaseModal";
import SouvenirStoreBanner from "@/components/galeria/SouvenirStoreBanner";

function formatFullDate(dateStr: string): string {
  if (!dateStr) return "Fecha";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
      ];
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${day} de ${monthNames[monthIdx] || ""}, ${parts[0]}`;
    }
  } catch (e) {}
  return dateStr;
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return "Fecha";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const day = parts[2];
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"];
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${day} ${monthNames[monthIdx] || ""}`;
    }
  } catch (e) {}
  return dateStr;
}

function GaleriaContent() {
  const searchParams = useSearchParams();
  const urlAlbum = searchParams.get("album");
  const urlTab = searchParams.get("tab");

  const [albums, setAlbums] = useState<GalleryAlbum[]>(INITIAL_ALBUMS);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activeTab, setActiveTab] = useState<"community" | "pro_studio">("pro_studio");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [syncProgress, setSyncProgress] = useState<{ loaded: number; total: number; isDone: boolean } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const convertToJpegBlob = (url: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
        } catch (e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleSavePhotoDirectly = async (photo: GalleryPhoto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(photo.id);
    try {
      const cleanTitle = (photo.title || "foto_golden_sport")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .toLowerCase();
      const filename = `${cleanTitle}.jpg`;

      const blob = await convertToJpegBlob(photo.photoUrl);

      if (!blob) {
        fallbackDirectDownload(photo.photoUrl, filename);
        setDownloadingId(null);
        showToast("✅ ¡Foto descargada!");
        return;
      }

      const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

      if (isIOS && typeof navigator !== "undefined" && navigator.canShare) {
        try {
          const file = new File([blob], filename, { type: "image/jpeg", lastModified: Date.now() });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: photo.title || "Golden Sport Academy",
            });
            setDownloadingId(null);
            showToast("✅ ¡Foto guardada en tu carrete!");
            return;
          }
        } catch (shareErr: any) {
          if (shareErr?.name === "AbortError") {
            setDownloadingId(null);
            return;
          }
        }
      }

      const blobUrl = URL.createObjectURL(blob);
      fallbackDirectDownload(blobUrl, filename);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      setDownloadingId(null);
      showToast("✅ ¡Foto guardada en tu galería!");
    } catch (err) {
      console.error("Error al guardar foto:", err);
      fallbackDirectDownload(photo.photoUrl, "foto_golden_sport.jpg");
      setDownloadingId(null);
      showToast("✅ ¡Foto descargada!");
    }
  };

  const fallbackDirectDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 250);
  };

  // Modales
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<GalleryPhoto | null>(null);
  const [selectedPhotoForPurchase, setSelectedPhotoForPurchase] = useState<GalleryPhoto | null>(null);

  // Soporte de Deep-Link directo desde el Árbol de Guanacaste
  useEffect(() => {
    if (urlTab === "pro_studio" || urlTab === "community") {
      setActiveTab(urlTab);
    }
    if (urlAlbum) {
      if (urlAlbum === "liberia" || urlAlbum.includes("liberia")) {
        setSelectedAlbumId("alb-curiol-liberia-2026");
        setActiveTab("pro_studio");
      } else {
        setSelectedAlbumId(urlAlbum);
      }
    }
  }, [urlAlbum, urlTab]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aData, sData] = await Promise.all([
        Store.getAlbums(),
        Promise.resolve(Store.getSettings()),
      ]);
      const validAlbums = Array.isArray(aData) && aData.length > 0 ? aData : INITIAL_ALBUMS;
      setAlbums(validAlbums);
      setSettings(sData as unknown as SystemSettings);

      // Carga progresiva: metadatos instantáneos (<800ms) + streaming fluido de imágenes HD
      await Store.loadGalleryPhotosProgressive((updatedPhotos, progress) => {
        setPhotos(updatedPhotos.filter((p) => p.isApproved));
        if (progress) {
          setSyncProgress(progress);
        }
      });
    } catch (err) {
      console.error("Error al cargar datos de galería:", err);
      setAlbums(INITIAL_ALBUMS);
    }
  };

  const handleLike = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await Store.likeGalleryPhoto(photoId);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
  };

  const handleDeletePhoto = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("¿Estás seguro de que deseas eliminar esta fotografía permanentemente?")) {
      await Store.deleteGalleryPhoto(photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (selectedPhotoForView?.id === photoId) {
        setSelectedPhotoForView(null);
      }
      await loadData();
    }
  };

  // SEPARACIÓN ESTRICTA DE ÁLBUMES SEGÚN PESTAÑA:
  // Pestaña "community": Álbumes de familias/colectivos exclusivamente
  // Pestaña "pro_studio": Álbumes oficiales Curiol Studio exclusivamente
  const effectiveAlbums = (albums && albums.length > 0) ? albums : INITIAL_ALBUMS;

  const displayedAlbums = effectiveAlbums.filter((a) => {
    if (a.id === "alb-3" || !a.title || a.title === "Fotografía Oficial") return false;

    if (activeTab === "community") {
      return a.albumType === "community";
    } else {
      return a.albumType === "pro_studio" || !a.albumType;
    }
  });

  const selectedAlbum = effectiveAlbums.find((a) => a.id === selectedAlbumId);

  // Fotos del álbum seleccionado: filtradas estrictamente por el álbum actual
  const currentPhotos = selectedAlbum
    ? photos
        .filter((p) => {
          if (p.albumId !== selectedAlbum.id) return false;

          const matchesSearch =
            !searchQuery.trim() ||
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.uploaderName?.toLowerCase().includes(searchQuery.toLowerCase());

          return matchesSearch;
        })
        .sort((a, b) => {
          const timeA = new Date(a.createdAt || a.uploadedAt || 0).getTime();
          const timeB = new Date(b.createdAt || b.uploadedAt || 0).getTime();
          if (timeA !== timeB && !isNaN(timeA) && !isNaN(timeB)) {
            return timeA - timeB;
          }
          return (a.title || "").localeCompare(b.title || "", undefined, { numeric: true, sensitivity: "base" });
        })
    : [];

  const arbolUrl =
    settings?.arbolGuanacasteUrl ||
    "https://www.curiol.studio/linea-de-tiempo/golden-academy-santa-cruz";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* 1. HEADER */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/15 border border-golden-500/30 text-golden-400 text-xs font-black uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          <span>Galería Fotográfica Oficial</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Álbum &{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500">
            Recuerdos Deportivos
          </span>
        </h1>
      </div>

      {/* 2. SELECTOR PRINCIPAL DE PESTAÑAS */}
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex p-1.5 rounded-2xl bg-dark-900 border-2 border-golden-500/40 shadow-2xl max-w-xl w-full">
          <button
            onClick={() => { setActiveTab("pro_studio"); setSelectedAlbumId(null); }}
            className={`flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "pro_studio"
                ? "bg-gradient-to-r from-golden-400 to-amber-500 text-dark-950 shadow-lg scale-[1.02]"
                : "text-gray-400 hover:text-white hover:bg-dark-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-dark-950" />
            <span>🏀 Fotos Oficiales ({photos.filter(p => p.photoType === "pro_studio" || p.uploaderRole === "staff" || p.uploaderName?.includes("Curiol")).length})</span>
          </button>
          <button
            onClick={() => { setActiveTab("community"); setSelectedAlbumId(null); }}
            className={`flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "community"
                ? "bg-gradient-to-r from-golden-400 to-amber-500 text-dark-950 shadow-lg scale-[1.02]"
                : "text-gray-400 hover:text-white hover:bg-dark-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👨‍👩‍👧 Fotos de Familias ({photos.filter(p => p.photoType === "community" || p.uploaderRole === "padre" || !p.uploaderName?.includes("Curiol")).length})</span>
          </button>
        </div>

        {/* Guía Visual Amigable para Papás */}
        <div className="w-full max-w-xl p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-dark-900 to-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-3 shadow-lg">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-[11px] sm:text-xs text-gray-200 leading-snug">
            <strong className="text-emerald-400 font-black uppercase">¿Cómo guardar las fotos gratis?</strong> Toca el botón verde <strong className="text-white bg-emerald-700/80 px-2 py-0.5 rounded font-black inline-flex items-center gap-1">📥 Guardar en mi Teléfono</strong> en cualquier foto para guardarla directamente en tu galería o carrete.
          </p>
        </div>
      </div>

      {/* BARRA DE SINCRONIZACIÓN PROGRESIVA PARA DISPOSITIVOS MÓVILES */}
      {syncProgress && !syncProgress.isDone && syncProgress.loaded < syncProgress.total && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-golden-500/15 via-dark-900 to-golden-500/15 border border-golden-500/40 text-xs text-golden-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-golden-400 animate-spin shrink-0" />
            <span className="font-semibold">
              Sincronizando galería fotográfica en alta resolución: <strong className="text-white">{syncProgress.loaded} de {syncProgress.total} fotos</strong> listas en tu dispositivo.
            </span>
          </div>
          <div className="w-full sm:w-44 bg-dark-950 rounded-full h-2.5 overflow-hidden border border-golden-500/30 shrink-0 p-0.5">
            <div
              className="bg-gradient-to-r from-golden-400 to-amber-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(5, Math.round((syncProgress.loaded / syncProgress.total) * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. LISTADO DE ÁLBUMES ESPECÍFICOS SEGÚN LA PESTAÑA */}
      {!selectedAlbumId ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-golden-400" />
                <span>
                  {activeTab === "community"
                    ? "Álbumes Colectivos de Familias"
                    : "Álbumes Oficiales de Partidos y Eventos"}
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                {activeTab === "community"
                  ? "Selecciona un álbum familiar para ver o subir fotos de las gradas."
                  : "Cobertura fotográfica oficial en alta definición para jugadores y familias."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-golden-400 font-bold">
                {displayedAlbums.length} {displayedAlbums.length === 1 ? 'álbum registrado' : 'álbumes registrados'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedAlbums.map((album) => {
              const isLiberia = album.id === "alb-curiol-liberia-2026" || album.id === "alb-comunidad-liberia-2026" || album.id === "alb-1" || album.title?.toLowerCase().includes("liberia");
              const isYiyo = album.id === "alb-1789690146392" || album.id.includes("yiyo") || album.title?.toLowerCase().includes("yiyo");

              // Filtrar fotos que pertenecen estrictamente a este álbum
              const albumPics = photos.filter((p) => p.albumId === album.id);
              const photoCount = albumPics.length;

              const isTodayAlbum = album.isOpenForUploads;
              const dynamicCover = albumPics.find((p) => Boolean(p.photoUrl) && !p.photoUrl.includes("Fotos_Equipo"))?.photoUrl;
              const coverPhoto =
                dynamicCover ||
                (album.coverPhotoUrl && !album.coverPhotoUrl.includes("Fotos_Equipo")
                  ? album.coverPhotoUrl
                  : null) ||
                (album.id === "alb-curiol-liberia-2026"
                  ? "/photos/partidos/liberia_portada.webp"
                  : album.id === "alb-comunidad-liberia-2026"
                  ? "/Hero_Basketball/1.jpg"
                  : album.id === "alb-2"
                  ? "/photos/uniforme/GoldenAcademy_StaCruz_001.jpg"
                  : "/photos/partidos/liberia_portada.webp");
              const recentUploads = albumPics.slice(0, 3);

              return (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className={`group rounded-3xl overflow-hidden bg-dark-900 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:-translate-y-1.5 ${
                    isTodayAlbum
                      ? "border-golden-500 shadow-golden-500/20 hover:border-golden-400"
                      : "border-gray-800 hover:border-gray-700 opacity-95"
                  }`}
                >
                  {/* Foto de Portada */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-950">
                    <img
                      src={coverPhoto}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />

                    {/* Badge Estado */}
                    <div className="absolute top-3 left-3">
                      {isTodayAlbum ? (
                        <span className="px-3 py-1 rounded-full bg-golden-500 text-dark-950 text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg animate-pulse">
                          <Unlock className="w-3 h-3" />
                          <span>Álbum Activo Hoy</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-dark-950/90 text-gray-400 text-[10px] font-bold uppercase flex items-center gap-1 border border-gray-700">
                          <Lock className="w-3 h-3" />
                          <span>Concluido</span>
                        </span>
                      )}
                    </div>

                    {/* Badge Cantidad de Fotos Instantáneo */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-golden-300 text-[10px] font-black border border-white/20">
                      📸 {photoCount} {activeTab === "community" ? "fotos de familias" : "fotos oficiales"}
                    </div>

                    {/* Miniaturas en vivo si hay fotos */}
                    {recentUploads.length > 0 && (
                      <div className="absolute bottom-3 left-3 flex items-center -space-x-2">
                        {recentUploads.map((p, idx) => (
                          <div
                            key={p.id || idx}
                            className="w-8 h-8 rounded-full border-2 border-dark-950 overflow-hidden shadow-md bg-dark-800"
                          >
                            <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {photoCount > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-dark-950 bg-golden-500 text-dark-950 text-[9px] font-black flex items-center justify-center shadow-md">
                            +{photoCount - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info del Álbum */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span className="font-bold text-golden-400 uppercase">
                          📅 {formatFullDate(album.eventDate)}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-dark-800 text-gray-300 font-bold border border-gray-700">
                          {album.category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-golden-400 transition-colors leading-snug">
                        {album.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {album.description ||
                          (activeTab === "community"
                            ? `Fotos familiares y recuerdos subidos por papás del encuentro del ${formatShortDate(album.eventDate)}.`
                            : `Cobertura fotográfica oficial en alta definición realizada para Golden Sport Academy.`)}
                      </p>
                    </div>

                    {/* Botón de Entrada */}
                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                      <span className="text-xs font-black text-golden-400 uppercase flex items-center gap-1.5 group-hover:underline">
                        <span>
                          {activeTab === "community"
                            ? (isTodayAlbum ? "Entrar & Subir Fotos" : `Ver ${photoCount} Fotos de Familias`)
                            : `Ver ${photoCount} Fotos Oficiales`}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </span>

                      {isTodayAlbum && activeTab === "community" && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          ● Abierto para papás
                        </span>
                      )}

                      {activeTab === "pro_studio" && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <TreeDeciduous className="w-3 h-3 text-emerald-400" />
                          <span>Hito Árbol Guanacaste</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BANNER MINIMALISTA DE CURIOL STUDIO Y CONVENIO AL PIE DE LOS ÁLBUMES */}
          {activeTab === "pro_studio" && (
            <SouvenirStoreBanner arbolUrl={arbolUrl} />
          )}
        </div>
      ) : (
        /* 5. VISTA DETALLADA DENTRO DEL ÁLBUM SELECCIONADO */
        <div className="space-y-6">
          {/* Volver */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setSelectedAlbumId(null);
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-900 hover:bg-dark-800 text-gray-300 hover:text-white text-xs font-bold uppercase border border-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-golden-400" />
              <span>← Volver a los Álbumes</span>
            </button>

            {/* Banner del Álbum Seleccionado */}
            {selectedAlbum && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-2 border-golden-500/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-golden-500 text-dark-950 text-[10px] font-black uppercase">
                      {selectedAlbum.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      📅 {formatFullDate(selectedAlbum.eventDate)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-dark-950 text-golden-300 text-[10px] font-black border border-golden-500/40">
                      📸 {currentPhotos.length} {activeTab === "community" ? "fotos de familias" : "fotos oficiales"}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {selectedAlbum.title}
                  </h2>

                  <p className="text-xs text-gray-300 max-w-xl">
                    {activeTab === "community"
                      ? "Álbum familiar colectivo. Las fotos que subas aquí se guardan con perfil familiar para compartir con la comunidad."
                      : "Galería oficial de partidos y eventos especiales. Toca el botón verde en cualquier foto para guardarla gratis en tu teléfono."}
                  </p>
                </div>

                {/* Acciones del Banner */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {selectedAlbum.isOpenForUploads && activeTab === "community" && (
                    <button
                      onClick={() => setIsUploadOpen(true)}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl flex items-center gap-2.5 shrink-0 transition-transform hover:scale-105 active:scale-95"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Subir Fotos a este Álbum</span>
                    </button>
                  )}

                  {/* Enlace al Punto Nodo en el Árbol de Guanacaste */}
                  {activeTab === "pro_studio" && (
                    <a
                      href={arbolUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
                    >
                      <TreeDeciduous className="w-4 h-4 text-emerald-400" />
                      <span>Punto Nodo en Árbol de Guanacaste ↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Buscador de fotos en este álbum */}
          <div className="p-3.5 rounded-2xl bg-dark-900 border border-gray-800 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-3.5 h-3.5 text-golden-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título o número de foto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-7 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-golden-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <span className="text-xs text-golden-400 font-bold">
              {currentPhotos.length} fotos listas
            </span>
          </div>

          {/* Grilla de Fotos */}
          {currentPhotos.length === 0 ? (
            <div className="text-center py-16 space-y-3 rounded-3xl bg-dark-900 border border-gray-800">
              <Camera className="w-10 h-10 text-gray-600 mx-auto" />
              <h3 className="text-sm font-bold text-white uppercase">
                Aún no hay fotos en este álbum
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                {activeTab === "community"
                  ? "¡Sé el primer papá o mamá en subir fotos de este encuentro!"
                  : "Pronto se publicarán nuevas fotografías oficiales de Curiol Studio."}
              </p>
              {activeTab === "community" && selectedAlbum?.isOpenForUploads && (
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-golden-500 text-dark-950 font-black text-xs uppercase inline-flex items-center gap-1.5 shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir la Primera Foto</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoForView(photo)}
                  className="group rounded-3xl overflow-hidden bg-dark-900 border-2 border-gray-800 hover:border-golden-500/80 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
                >
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark-950">
                    {photo.photoUrl ? (
                      <img
                        src={photo.photoUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-dark-900 animate-pulse flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <Sparkles className="w-6 h-6 text-golden-400 animate-spin" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cargando foto HD...</span>
                      </div>
                    )}

                    {/* Badge Categoría */}
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-lg bg-dark-950/85 backdrop-blur-md text-white text-[10px] font-black uppercase border border-white/20">
                        {photo.category}
                      </span>
                    </div>

                    {/* Marca de Agua */}
                    <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 shadow-md">
                      <img
                        src="/curiol-studio-transparent.png"
                        alt="Curiol Studio"
                        className="h-4 w-4 rounded-full object-contain drop-shadow"
                      />
                      <span className="text-gray-400 text-[9px] font-thin">|</span>
                      <div className="flex flex-col text-left leading-none">
                        <span className="text-[7px] font-black tracking-widest text-white/95 uppercase">
                          GOLDEN SPORT
                        </span>
                        <span className="text-[6px] font-black tracking-widest text-golden-400 uppercase">
                          SANTA CRUZ
                        </span>
                      </div>
                    </div>

                    {/* Autoría */}
                    <div className="absolute bottom-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-dark-950/90 backdrop-blur-sm text-[9px] font-bold text-golden-300 uppercase tracking-wider border border-golden-500/30">
                      📸 {photo.photoType === "pro_studio" ? "Curiol Studio Pro" : `Familia: ${photo.uploaderName}`}
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(photo.id, e)}
                      className="absolute bottom-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full bg-dark-950/90 backdrop-blur-md text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 border border-white/20 transition-transform active:scale-125 shadow-md"
                      title="Me gusta"
                    >
                      <Heart className="w-3.5 h-3.5 fill-red-400" />
                      <span>{photo.likesCount}</span>
                    </button>
                  </div>

                  {/* Info + BOTÓN GIGANTE Y DIRECTO DE GUARDAR EN TELÉFONO */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-dark-900">
                    <div className="space-y-1">
                      <h3 className="font-black text-sm text-white group-hover:text-golden-400 transition-colors line-clamp-1">
                        {photo.title}
                      </h3>
                      {photo.caption && (
                        <p className="text-[11px] text-gray-400 line-clamp-1">
                          {photo.caption}
                        </p>
                      )}
                    </div>

                    {/* BOTÓN GIGANTE DE DESCARGA DIRECTA A 1 CLIC */}
                    <div className="pt-2 border-t border-gray-800">
                      <button
                        type="button"
                        onClick={(e) => handleSavePhotoDirectly(photo, e)}
                        disabled={downloadingId === photo.id}
                        className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition-all transform active:scale-95 disabled:opacity-60 border border-emerald-400/30"
                        title="Guardar directamente en la galería de fotos de tu teléfono"
                      >
                        <Download className="w-4 h-4 text-white shrink-0" />
                        <span>{downloadingId === photo.id ? "Guardando en tu teléfono..." : "📥 Guardar en mi Teléfono"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Banner de Tienda y Explicación de Calidad al fondo del álbum */}
          {activeTab === "pro_studio" && (
            <div className="pt-6">
              <SouvenirStoreBanner />
            </div>
          )}
        </div>
      )}

      {/* FLOATING TOAST DE CONFIRMACIÓN */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-2xl shadow-black/80 flex items-center gap-2.5 animate-bounce border-2 border-white/20">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALES */}
      {isUploadOpen && (
        <PhotoUploadModal
          isOpen={isUploadOpen}
          targetAlbum={selectedAlbum}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={() => {
            setIsUploadOpen(false);
            loadData();
          }}
        />
      )}

      {selectedPhotoForView && (
        <PhotoLightboxModal
          photo={selectedPhotoForView}
          photos={currentPhotos.length > 0 ? currentPhotos : photos}
          onClose={() => setSelectedPhotoForView(null)}
          onNavigate={(nextPhoto) => setSelectedPhotoForView(nextPhoto)}
          onLike={(e) => handleLike(selectedPhotoForView.id, e)}
          onDelete={(photo) => handleDeletePhoto(photo.id)}
          onOpenBuy={(photo) => {
            setSelectedPhotoForView(null);
            setSelectedPhotoForPurchase(photo);
          }}
        />
      )}

      {selectedPhotoForPurchase && (
        <PhotoPurchaseModal
          photo={selectedPhotoForPurchase}
          onClose={() => setSelectedPhotoForPurchase(null)}
        />
      )}
    </div>
  );
}

export default function GaleriaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-8 h-8 text-golden-400 animate-spin" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Cargando Galería Golden Sport Academy...
        </p>
      </div>
    }>
      <GaleriaContent />
    </Suspense>
  );
}
