"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Camera, 
  Upload, 
  Heart, 
  Calendar, 
  User, 
  Sparkles, 
  Filter, 
  Plus, 
  Users, 
  ShoppingBag, 
  TreeDeciduous, 
  ExternalLink, 
  Search, 
  X,
  Layers,
  CheckCircle2,
  FolderHeart,
  ArrowLeft,
  Lock,
  Unlock,
  ChevronRight
} from "lucide-react";
import { GalleryAlbum, GalleryPhoto, PlayerCategory, SystemSettings } from "@/types";
import { Store } from "@/lib/store";
import PhotoUploadModal from "@/components/galeria/PhotoUploadModal";
import PhotoLightboxModal from "@/components/galeria/PhotoLightboxModal";
import PhotoPurchaseModal from "@/components/galeria/PhotoPurchaseModal";
import SouvenirStoreBanner from "@/components/galeria/SouvenirStoreBanner";

// Función auxiliar para formatear fechas completas (ej: 5 de Septiembre, 2026)
function formatFullDate(dateStr: string): string {
  if (!dateStr) return "Fecha";
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const monthIdx = parseInt(parts[1], 10) - 1;
      return `${day} de ${monthNames[monthIdx] || ""}, ${parts[0]}`;
    }
  } catch (e) {}
  return dateStr;
}

// Función auxiliar para formatear fechas cortas (ej: 05 Sep)
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
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activeTab, setActiveTab] = useState<"community" | "pro_studio">("community");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modales
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<GalleryPhoto | null>(null);
  const [selectedPhotoForPurchase, setSelectedPhotoForPurchase] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [aData, pData, sData, cData] = await Promise.all([
      Store.getAlbums(),
      Store.getGalleryPhotos(),
      Store.getSettings(),
      Store.getCategories(),
    ]);
    setAlbums(aData);
    setPhotos(pData.filter((p) => p.isApproved));
    setSettings(sData);
    setCategories(cData);
  };

  const handleLike = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await Store.likeGalleryPhoto(photoId);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
  };

  const selectedAlbum = albums.find((a) => a.id === selectedAlbumId);

  // Filtrado de fotos según pestaña, álbum, categoría y buscador
  const currentPhotos = photos.filter((p) => {
    const matchesTab = activeTab === "pro_studio" ? p.photoType === "pro_studio" : p.photoType === "community";
    
    // Si se seleccionó un álbum específico, buscar por albumId o por eventDate del álbum
    const matchesAlbum =
      !selectedAlbumId ||
      selectedAlbumId === "all" ||
      p.albumId === selectedAlbumId ||
      (selectedAlbum && p.eventDate === selectedAlbum.eventDate);

    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = 
      !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uploaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesAlbum && matchesCategory && matchesSearch;
  });

  const arbolUrl = settings?.arbolGuanacasteUrl || "https://www.curiol.studio/linea-de-tiempo/golden-academy-santa-cruz";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. HEADER MINIMALISTA */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/15 border border-golden-500/30 text-golden-400 text-xs font-black uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          <span>Galería Fotográfica Oficial</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Álbum & <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500">Recuerdos Deportivos</span>
        </h1>
      </div>

      {/* 2. SELECTOR PRINCIPAL EN DOS SECCIONES (MINIMALISTA) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-dark-900 border border-gray-800 shadow-xl max-w-xl w-full">
          <button
            onClick={() => {
              setActiveTab("community");
              setSelectedAlbumId(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "community"
                ? "bg-golden-500 text-dark-950 shadow-md font-black"
                : "text-gray-400 hover:text-white hover:bg-dark-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Fotos de Familias & Papás</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("pro_studio");
              setSelectedAlbumId(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === "pro_studio"
                ? "bg-golden-500 text-dark-950 shadow-md font-black"
                : "text-gray-400 hover:text-white hover:bg-dark-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Curiol Studio Pro</span>
          </button>
        </div>
      </div>

      {/* 3. BANNER INFORMATIVO SEGÚN PESTAÑA */}
      {activeTab === "pro_studio" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-dark-900 border border-golden-500/30 text-xs text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-dark-950 border border-golden-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
                <Image
                  src="/curiol-studio-transparent.png"
                  alt="Curiol Studio"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <strong className="text-white block uppercase text-xs">Fotografía Profesional por Curiol Studio</strong>
                <span>Cobertura en partidos oficiales. Puedes encargar recuerdos impresos (imanes para nevera, retablos o cuadros canvas).</span>
              </div>
            </div>

            <a
              href={arbolUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <TreeDeciduous className="w-3.5 h-3.5" />
              <span>Árbol de Guanacaste ↗</span>
            </a>
          </div>

          <SouvenirStoreBanner />
        </div>
      )}

      {/* 4. VISTA NIVEL 1: LISTADO DE ÁLBUMES OFICIALES (VISTA PRINCIPAL) */}
      {!selectedAlbumId ? (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <FolderHeart className="w-5 h-5 text-golden-400" />
                <span>Álbumes Oficiales & Eventos</span>
              </h2>
              <p className="text-xs text-gray-400">
                Selecciona un álbum para explorar sus fotografías o para subir las fotos del día.
              </p>
            </div>
            <span className="text-xs text-golden-400 font-bold">
              {albums.length} álbumes registrados
            </span>
          </div>

          {/* Grilla de Carpetas / Álbumes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {albums.map((album) => {
              const albumPhotos = photos.filter(
                (p) => p.albumId === album.id || p.eventDate === album.eventDate
              );
              const isTodayAlbum = album.eventDate === "2026-09-05" || album.isOpenForUploads;
              const coverPhoto = album.coverPhotoUrl || albumPhotos[0]?.photoUrl || "/Hero_Basketball/1.jpg";

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
                  {/* Foto de Portada con Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-dark-950">
                    <img
                      src={coverPhoto}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

                    {/* Badge Estado del Álbum */}
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

                    {/* Badge Conteo de Fotos */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-golden-300 text-[10px] font-black border border-white/20">
                      📸 {albumPhotos.length} fotos
                    </div>

                    {/* Título sobre portada */}
                    <div className="absolute bottom-3 left-3 right-3 space-y-1">
                      <span className="text-[10px] font-bold text-golden-400 uppercase tracking-wider block">
                        📅 {formatFullDate(album.eventDate)}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-golden-400 transition-colors leading-snug">
                        {album.title}
                      </h3>
                    </div>
                  </div>

                  {/* Cuerpo y Acción */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-dark-800 text-gray-300 text-[10px] font-bold uppercase border border-gray-700">
                        {album.category}
                      </span>
                      <p className="text-xs text-gray-300 line-clamp-2">
                        {album.description || `Fotografías oficiales y momentos familiares del evento realizado el ${formatShortDate(album.eventDate)}.`}
                      </p>
                    </div>

                    {/* Botón de Entrada */}
                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                      {isTodayAlbum ? (
                        <span className="text-xs font-black text-golden-400 uppercase flex items-center gap-1.5 group-hover:underline">
                          <span>Entrar & Subir Fotos</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1 group-hover:text-white">
                          <span>Ver Fotografías</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      )}

                      {isTodayAlbum && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          ● Abierto para papás
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 5. VISTA NIVEL 2: DENTRO DEL ÁLBUM SELECCIONADO */
        <div className="space-y-6 animate-fadeIn">
          {/* Botón Volver y Cabecera del Álbum */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setSelectedAlbumId(null);
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-800 text-gray-300 hover:text-white text-xs font-bold uppercase border border-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-golden-400" />
              <span>← Volver a todos los Álbumes</span>
            </button>

            {/* Banner Destacado del Álbum Seleccionado */}
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
                    {selectedAlbum.isOpenForUploads ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        <span>Habilitado para Subir Fotos</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md bg-gray-800 text-gray-400 border border-gray-700 text-[10px] font-bold uppercase flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Álbum Concluido (Solo Lectura)</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {selectedAlbum.title}
                  </h2>

                  <p className="text-xs text-gray-300 max-w-xl">
                    {selectedAlbum.isOpenForUploads
                      ? "Álbum oficial activo del día. Papás, mamás y familiares pueden subir directamente las fotos de los partidos y momentos del evento."
                      : "Álbum histórico cerrado para nuevas subidas. Explora la galería oficial de recuerdos en alta resolución."}
                  </p>
                </div>

                {/* Acción de Subida: HABILITADA SOLO EN EL ÁLBUM DEL DÍA */}
                {selectedAlbum.isOpenForUploads ? (
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl flex items-center gap-2.5 shrink-0 transition-transform hover:scale-105 active:scale-95"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Subir Fotos a este Álbum</span>
                  </button>
                ) : (
                  <div className="px-4 py-2.5 rounded-xl bg-dark-950 border border-gray-800 text-gray-400 text-xs text-center shrink-0 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span>Subidas cerradas para este evento</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 6. BUSCADOR & FILTRO POR CATEGORÍA DENTRO DEL ÁLBUM */}
          <div className="p-3.5 rounded-2xl bg-dark-900 border border-gray-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Buscador */}
            <div className="relative w-full sm:max-w-xs">
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

            {/* Filtro por Categoría */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-golden-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-golden-500"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 7. GRILLA DE FOTOGRAFÍAS DENTRO DEL ÁLBUM */}
          {currentPhotos.length === 0 ? (
            <div className="text-center py-16 space-y-3 rounded-3xl bg-dark-900 border border-gray-800">
              <Camera className="w-10 h-10 text-gray-600 mx-auto" />
              <h3 className="text-sm font-bold text-white uppercase">
                Aún no hay fotos registradas en este álbum
              </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                {selectedAlbum?.isOpenForUploads
                  ? "¡Sé el primer papá o mamá en subir fotos de la jornada de hoy!"
                  : "No se encontraron fotos para el filtro seleccionado."}
              </p>
              {selectedAlbum?.isOpenForUploads && (
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
                  {/* Imagen con Aspect Ratio y Marca de Agua */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark-950">
                    <img
                      src={photo.photoUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge Categoría */}
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-dark-950/85 backdrop-blur-md text-white text-[9px] font-black uppercase border border-white/20">
                        {photo.category}
                      </span>
                    </div>

                    {/* MARCA DE AGUA OFICIAL: CURIOL STUDIO TRANSPARENTE */}
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

                    {/* Sello Inferior: Autoría */}
                    <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-dark-950/85 backdrop-blur-sm text-[8px] font-bold text-golden-300 uppercase tracking-wider border border-golden-500/30">
                      📸 {photo.photoType === "pro_studio" ? "Curiol Studio" : `Familia: ${photo.uploaderName}`}
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

                  {/* Información y Acciones */}
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
                        <span className="truncate max-w-[120px]">{photo.uploaderName}</span>
                      </span>

                      {photo.photoType === "pro_studio" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhotoForPurchase(photo);
                          }}
                          className="px-2 py-0.5 rounded-md bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-[9px] uppercase flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                        >
                          <ShoppingBag className="w-2.5 h-2.5" />
                          <span>Encargar</span>
                        </button>
                      ) : (
                        <span className="text-[9px] text-gray-500">
                          📅 {formatShortDate(photo.eventDate || "")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
          onClose={() => setSelectedPhotoForView(null)}
          onLike={(e) => handleLike(selectedPhotoForView.id, e)}
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
