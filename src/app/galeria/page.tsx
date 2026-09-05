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
  FolderHeart
} from "lucide-react";
import { GalleryAlbum, GalleryPhoto, PlayerCategory, SystemSettings } from "@/types";
import { Store } from "@/lib/store";
import PhotoUploadModal from "@/components/galeria/PhotoUploadModal";
import PhotoLightboxModal from "@/components/galeria/PhotoLightboxModal";
import PhotoPurchaseModal from "@/components/galeria/PhotoPurchaseModal";
import SouvenirStoreBanner from "@/components/galeria/SouvenirStoreBanner";

// Función auxiliar para formatear fechas cortas (ej: 05 Sep, 27 Ago)
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
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("all");
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

  // Filtrado de fotos según pestaña, álbum, categoría y buscador
  const currentPhotos = photos.filter((p) => {
    const matchesTab = activeTab === "pro_studio" ? p.photoType === "pro_studio" : p.photoType === "community";
    
    // Si se seleccionó un álbum específico, buscar por albumId o por eventDate del álbum
    const selectedAlbum = albums.find((a) => a.id === selectedAlbumId);
    const matchesAlbum =
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
              setSelectedAlbumId("all");
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
              setSelectedAlbumId("all");
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

      {/* 3. AVISO MINIMALISTA DEL ÁLBUM DEL DÍA SEGÚN LA SECCIÓN */}
      {activeTab === "community" ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-dark-900/90 border border-golden-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-golden-400 uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Álbum Colaborativo Familiar</span>
            </div>
            <p className="text-xs text-gray-300">
              Sube fotos desde tu celular. Si Lenny, Alberto o un padre ya inició el álbum de la fecha, tus fotos se sumarán automáticamente a ese mismo álbum del día.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 shrink-0 transition-transform hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Foto del Día</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-dark-900 border border-golden-500/30 text-xs text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-9 h-9 rounded-xl bg-golden-500/20 text-golden-400 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
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

      {/* 4. SELECTOR DE ÁLBUMES POR ÍCONOS MINIMALISTAS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span className="font-black text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <FolderHeart className="w-3.5 h-3.5 text-golden-400" />
            <span>Álbumes Oficiales & Eventos</span>
          </span>
          <span className="text-[11px]">
            {currentPhotos.length} fotos encontradas
          </span>
        </div>

        {/* Carril Horizontal de Íconos de Álbumes */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {/* Botón Icono "Todas las fotos" */}
          <button
            onClick={() => setSelectedAlbumId("all")}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl min-w-[80px] max-w-[100px] transition-all ${
              selectedAlbumId === "all"
                ? "bg-golden-500/20 text-golden-400 ring-2 ring-golden-400 scale-105"
                : "bg-dark-900 text-gray-400 hover:text-white border border-gray-800"
            }`}
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm shadow-md ${
              selectedAlbumId === "all"
                ? "bg-golden-500 text-dark-950 font-black"
                : "bg-dark-800 text-gray-300 border border-gray-700"
            }`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight text-center">
              Todas
            </span>
          </button>

          {/* Íconos de Álbumes Específicos */}
          {albums.map((album) => {
            const albumPhotos = photos.filter((p) => p.albumId === album.id || p.eventDate === album.eventDate);
            const isSelected = selectedAlbumId === album.id;
            const coverPhoto = album.coverPhotoUrl || albumPhotos[0]?.photoUrl;

            return (
              <button
                key={album.id}
                onClick={() => setSelectedAlbumId(album.id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl min-w-[95px] max-w-[130px] transition-all relative ${
                  isSelected
                    ? "bg-golden-500/20 text-golden-400 ring-2 ring-golden-400 scale-105"
                    : "bg-dark-900 text-gray-400 hover:text-white border border-gray-800"
                }`}
                title={`${album.title} (${album.eventDate})`}
              >
                {/* Miniatura / Avatar Circular del Álbum */}
                <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center relative shadow-md ${
                  isSelected ? "border-2 border-golden-400" : "border border-gray-700 bg-dark-800"
                }`}>
                  {coverPhoto ? (
                    <img
                      src={coverPhoto}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-5 h-5 text-golden-400" />
                  )}
                  {/* Badge de cantidad */}
                  <span className="absolute bottom-0 right-0 bg-dark-950/90 text-golden-300 text-[9px] font-bold px-1.5 rounded-full border border-golden-500/40">
                    {albumPhotos.length}
                  </span>
                </div>

                {/* Nombre del Álbum */}
                <span className="text-[10px] font-black uppercase tracking-tight line-clamp-2 text-center leading-tight">
                  {album.title}
                </span>
              </button>
            );
          })}

          {/* Botón "+ Nuevo Álbum / Subir" */}
          {activeTab === "community" && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl min-w-[70px] bg-dark-900/60 hover:bg-dark-800 text-golden-400 border border-dashed border-golden-500/40 hover:border-golden-400 transition-all"
              title="Subir foto o crear álbum de hoy"
            >
              <div className="w-11 h-11 rounded-full border-2 border-dashed border-golden-400/60 flex items-center justify-center bg-golden-500/10">
                <Plus className="w-5 h-5 text-golden-400" />
              </div>
              <span className="text-[10px] font-bold uppercase text-golden-400">
                + Foto
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Indicador de Álbum Activo Seleccionado */}
      {selectedAlbumId !== "all" && (() => {
        const activeAlbum = albums.find((a) => a.id === selectedAlbumId);
        if (!activeAlbum) return null;
        return (
          <div className="p-3 px-4 rounded-2xl bg-dark-900/95 border border-golden-500/40 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-golden-500 text-dark-950 font-black uppercase text-[10px]">
                Álbum Activo
              </span>
              <strong className="text-white font-black">{activeAlbum.title}</strong>
              <span className="text-gray-400 text-[11px]">({formatShortDate(activeAlbum.eventDate)} • {activeAlbum.category})</span>
            </div>
            <button
              onClick={() => setSelectedAlbumId("all")}
              className="text-golden-400 hover:text-golden-300 font-bold text-[11px] underline"
            >
              Ver todas las fotos
            </button>
          </div>
        );
      })()}

      {/* 5. BUSCADOR & FILTRO POR CATEGORÍA */}
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

      {/* 6. GRILLA DE FOTOGRAFÍAS */}
      {currentPhotos.length === 0 ? (
        <div className="text-center py-16 space-y-3 rounded-3xl bg-dark-900 border border-gray-800">
          <Camera className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase">
            No hay fotos para este filtro
          </h3>
          <p className="text-xs text-gray-400">
            {activeTab === "community"
              ? "¡Sé el primer papá o mamá en subir fotos de este encuentro!"
              : "Pronto se publicarán nuevas fotografías oficiales de Curiol Studio."}
          </p>
          {activeTab === "community" && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-golden-500 text-dark-950 font-black text-xs uppercase inline-flex items-center gap-1.5 shadow-md"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Foto del Día</span>
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
                    className="h-3.5 w-auto object-contain drop-shadow"
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

      {/* MODALES */}
      {isUploadOpen && (
        <PhotoUploadModal
          isOpen={isUploadOpen}
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
