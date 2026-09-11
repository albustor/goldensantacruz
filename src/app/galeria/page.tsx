"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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

export default function GaleriaPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(INITIAL_ALBUMS);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activeTab, setActiveTab] = useState<"community" | "pro_studio">("community");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [syncProgress, setSyncProgress] = useState<{ loaded: number; total: number; isDone: boolean } | null>(null);

  // Modales
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<GalleryPhoto | null>(null);
  const [selectedPhotoForPurchase, setSelectedPhotoForPurchase] = useState<GalleryPhoto | null>(null);

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
  // Pestaña "community": Únicamente álbumes de familias/colectivos
  // Pestaña "pro_studio": Únicamente álbumes oficiales Curiol Studio
  const effectiveAlbums = (albums && albums.length > 0) ? albums : INITIAL_ALBUMS;

  const displayedAlbums = effectiveAlbums.filter((a) => {
    const isCommunity = 
      a.albumType === "community" || 
      a.id.includes("comunidad") ||
      a.createdBy?.toLowerCase().includes("papá") || 
      a.createdBy?.toLowerCase().includes("familia") || 
      a.title?.toLowerCase().includes("familiar") || 
      a.title?.toLowerCase().includes("colectivo");

    if (activeTab === "community") {
      return isCommunity;
    } else {
      return !isCommunity;
    }
  });

  const selectedAlbum = effectiveAlbums.find((a) => a.id === selectedAlbumId);

  // Fotos del álbum seleccionado: estrictamente filtradas por el tipo de pestaña activa y ordenadas ascendentemente
  const currentPhotos = selectedAlbum
    ? photos
        .filter((p) => {
          const isProTab = activeTab === "pro_studio";
          const isProPhoto = p.photoType === "pro_studio" || p.uploaderRole === "staff" || p.uploaderName?.toLowerCase().includes("curiol");
          const isCommPhoto = p.photoType === "community" || p.uploaderRole === "padre" || (!p.photoType && !p.uploaderRole && !p.uploaderName?.toLowerCase().includes("curiol"));

          const matchesTab = isProTab ? isProPhoto : isCommPhoto;
          if (!matchesTab) return false;

          let matchesAlbum = false;
          if (isProTab) {
            if (selectedAlbum.id === "alb-curiol-liberia-2026" || selectedAlbum.title?.toLowerCase().includes("liberia")) {
              matchesAlbum = p.albumId === "alb-curiol-liberia-2026" || p.albumId === "alb-1" || p.eventDate === "2026-09-05" || p.title?.toLowerCase().includes("liberia");
            } else {
              matchesAlbum = p.albumId === selectedAlbum.id;
            }
          } else {
            if (selectedAlbum.id === "alb-comunidad-liberia-2026" || selectedAlbum.title?.toLowerCase().includes("liberia")) {
              matchesAlbum = p.albumId === "alb-comunidad-liberia-2026" || p.albumId === "alb-1" || p.eventDate === "2026-09-05";
            } else {
              matchesAlbum = p.albumId === selectedAlbum.id;
            }
          }

          const matchesSearch =
            !searchQuery.trim() ||
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.uploaderName?.toLowerCase().includes(searchQuery.toLowerCase());

          return matchesAlbum && matchesSearch;
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
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-dark-900 border border-gray-800 shadow-xl max-w-xl w-full">
          <button
            onClick={() => { setActiveTab("community"); setSelectedAlbumId(null); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "community"
                ? "bg-golden-500 text-dark-950 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-dark-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Fotos de Familias & Papás</span>
          </button>
          <button
            onClick={() => { setActiveTab("pro_studio"); setSelectedAlbumId(null); }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "pro_studio"
                ? "bg-golden-500 text-dark-950 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-dark-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Curiol Studio Pro</span>
          </button>
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

      {/* 3. LISTADO DE ÁLBUMES ESPECÍFICOS SEGÚN LA PESTAÑA (DIRECTAMENTE ARRIBA) */}
      {!selectedAlbumId ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-golden-400" />
                <span>
                  {activeTab === "community"
                    ? "Álbumes Colectivos de Familias"
                    : "Álbumes Oficiales Curiol Studio"}
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                {activeTab === "community"
                  ? "Selecciona un álbum familiar para ver o subir fotos de las gradas."
                  : "Galería oficial de partidos y eventos especiales cubiertos por Curiol Studio."}
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

              // Filtrar fotos que pertenecen estrictamente a este tipo de pestaña y álbum
              const albumPics = photos.filter((p) => {
                const isProTab = activeTab === "pro_studio";
                const isProPhoto = p.photoType === "pro_studio" || p.uploaderRole === "staff" || p.uploaderName?.toLowerCase().includes("curiol");
                const isCommPhoto = p.photoType === "community" || p.uploaderRole === "padre" || (!p.photoType && !p.uploaderRole && !p.uploaderName?.toLowerCase().includes("curiol"));

                const matchesTab = isProTab ? isProPhoto : isCommPhoto;
                if (!matchesTab) return false;

                let matchesAlbum = false;
                if (isProTab) {
                  if (album.id === "alb-curiol-liberia-2026" || album.title?.toLowerCase().includes("liberia")) {
                    matchesAlbum = p.albumId === "alb-curiol-liberia-2026" || p.albumId === "alb-1" || p.eventDate === "2026-09-05" || p.title?.toLowerCase().includes("liberia");
                  } else {
                    matchesAlbum = p.albumId === album.id;
                  }
                } else {
                  if (album.id === "alb-comunidad-liberia-2026" || album.title?.toLowerCase().includes("liberia")) {
                    matchesAlbum = p.albumId === "alb-comunidad-liberia-2026" || p.albumId === "alb-1" || p.eventDate === "2026-09-05";
                  } else {
                    matchesAlbum = p.albumId === album.id;
                  }
                }

                return matchesAlbum;
              });
              
              // Conteo instantáneo 0ms sin retraso visual
              const defaultCount = album.id === "alb-curiol-liberia-2026" ? 152 : album.id === "alb-comunidad-liberia-2026" ? 0 : (album.photoCount || 0);
              const photoCount = albumPics.length > 0 ? albumPics.length : defaultCount;

              const isTodayAlbum = album.isOpenForUploads;
              const coverPhoto = album.coverPhotoUrl || albumPics[0]?.photoUrl || "/Hero_Basketball/1.jpg";
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
                            : `Cobertura fotográfica oficial en alta definición realizada por Curiol Studio.`)}
                      </p>
                    </div>

                    {/* Botón de Entrada */}
                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                      {isTodayAlbum ? (
                        <span className="text-xs font-black text-golden-400 uppercase flex items-center gap-1.5 group-hover:underline">
                          <span>{activeTab === "community" ? "Entrar & Subir Fotos" : "Ver Galería Oficial"}</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 group-hover:text-white">
                          <span>Ver Fotografías</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      )}

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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-800 text-gray-300 hover:text-white text-xs font-bold uppercase border border-gray-800 transition-colors"
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
                      📸 {currentPhotos.length > 0 ? currentPhotos.length : (selectedAlbum.id === "alb-curiol-liberia-2026" ? 152 : 0)} {activeTab === "community" ? "fotos de familias" : "fotos oficiales"}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {selectedAlbum.title}
                  </h2>

                  <p className="text-xs text-gray-300 max-w-xl">
                    {activeTab === "community"
                      ? "Álbum familiar colectivo. Las fotos que subas aquí se guardan con perfil familiar para compartir con la comunidad."
                      : "Galería oficial de partidos y eventos especiales cubiertos por Curiol Studio."}
                  </p>
                </div>

                {/* Acción de Subida para Papás */}
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
            )}
          </div>

          {/* Buscador de fotos en este álbum */}
          <div className="p-3.5 rounded-2xl bg-dark-900 border border-gray-800 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-3.5 h-3.5 text-golden-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título o familiar..."
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
            <span className="text-xs text-gray-400">
              {currentPhotos.length} fotos encontradas
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {currentPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhotoForView(photo)}
                  className="group rounded-2xl overflow-hidden bg-dark-900 border border-gray-800 hover:border-golden-500/60 shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
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
                      <span className="px-2 py-0.5 rounded-md bg-dark-950/85 backdrop-blur-md text-white text-[9px] font-black uppercase border border-white/20">
                        {photo.category}
                      </span>
                    </div>

                    {/* Marca de Agua */}
                    <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none flex items-center gap-1.5 bg-black/50 backdrop-blur-[3px] px-2.5 py-1 rounded-xl border border-white/20 shadow-md">
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
                    <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-dark-950/85 backdrop-blur-sm text-[8px] font-bold text-golden-300 uppercase tracking-wider border border-golden-500/30">
                      📸 {photo.photoType === "pro_studio" ? "Curiol Studio Pro" : `Familia: ${photo.uploaderName}`}
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(photo.id, e)}
                      className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded-full bg-dark-950/85 backdrop-blur-md text-red-400 hover:text-red-300 text-[11px] font-bold flex items-center gap-1 border border-white/20 transition-transform active:scale-125 shadow-md"
                      title="Me gusta"
                    >
                      <Heart className="w-3 h-3 fill-red-400" />
                      <span>{photo.likesCount}</span>
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <h3 className="font-black text-xs sm:text-sm text-white group-hover:text-golden-400 transition-colors line-clamp-1">
                        {photo.title}
                      </h3>
                      {photo.caption && (
                        <p className="text-[11px] text-gray-400 line-clamp-1">
                          {photo.caption}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-golden-500" />
                        <span className="truncate max-w-[140px]">{photo.uploaderName}</span>
                      </span>

                      <span className="text-[10px] text-gray-400 font-semibold">
                        📅 {formatShortDate(photo.eventDate || "")}
                      </span>
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
