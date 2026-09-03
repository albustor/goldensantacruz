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
  ShieldCheck, 
  Filter, 
  Eye, 
  Plus, 
  Users, 
  Award,
  Layers,
  ShoppingBag,
  Info,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { GalleryAlbum, GalleryPhoto, PlayerCategory } from "@/types";
import { Store } from "@/lib/store";
import PhotoUploadModal from "@/components/galeria/PhotoUploadModal";
import PhotoLightboxModal from "@/components/galeria/PhotoLightboxModal";
import PhotoPurchaseModal from "@/components/galeria/PhotoPurchaseModal";
import SouvenirStoreBanner from "@/components/galeria/SouvenirStoreBanner";

export default function GaleriaPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activeTab, setActiveTab] = useState<"community" | "pro_studio">("community"); // Papás primero
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modales
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<GalleryPhoto | null>(null);
  const [selectedPhotoForPurchase, setSelectedPhotoForPurchase] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [aData, pData] = await Promise.all([
      Store.getAlbums(),
      Store.getGalleryPhotos(),
    ]);
    setAlbums(aData);
    setPhotos(pData.filter((p) => p.isApproved));
  };

  const handleLike = async (photoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await Store.likeGalleryPhoto(photoId);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
  };

  // Filtrado de fotos por pestaña activa (Papás vs Pro)
  const currentPhotos = photos.filter((p) => {
    const matchesTab = activeTab === "pro_studio" ? p.photoType === "pro_studio" : p.photoType === "community";
    const matchesAlbum = selectedAlbumId === "all" || p.albumId === selectedAlbumId;
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesTab && matchesAlbum && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Header Principal & Explicación Pedagógica del Web App */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-golden-500/15 border border-golden-500/40 text-golden-400 text-xs font-black uppercase tracking-wider">
          <Camera className="w-4 h-4" />
          <span>Galería Fotográfica Oficial • Golden Sport Academy Santa Cruz</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Álbum & <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500">Recuerdos Deportivos</span>
        </h1>

        {/* Explicación de la Web App para Papás y Familias */}
        <div className="p-4 sm:p-5 rounded-2xl bg-dark-900/90 border border-golden-500/30 text-left space-y-2 shadow-lg">
          <div className="flex items-center gap-2 text-golden-400 font-bold text-xs sm:text-sm uppercase">
            <Smartphone className="w-4 h-4 text-golden-500 shrink-0" />
            <span>¿Cómo funciona esta Galería Web App?</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Esta Web App permite que <strong>papá, mamá o familiares suban directamente desde su celular</strong> las fotos y videos que tomen a sus hijos durante los entrenamientos en la cancha de Santa Bárbara y en los partidos de <strong>Golden Sport Academy Santa Cruz</strong>. Todas las fotos quedan protegidas con la marca de agua institucional.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sube fotos desde tu teléfono sin instalar apps</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-golden-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fotografías profesionales en partidos oficiales por Curiol Studio</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. DOS PESTAÑAS GRANDES CENTRADAS */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 rounded-3xl bg-dark-900 border-2 border-golden-500/40 max-w-2xl w-full shadow-2xl">
          {/* Pestaña 1: Papás y Familias */}
          <button
            onClick={() => {
              setActiveTab("community");
              setSelectedAlbumId("all");
            }}
            className={`py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 ${
              activeTab === "community"
                ? "bg-gradient-to-r from-golden-400 to-golden-600 text-dark-950 shadow-lg shadow-golden-500/30 scale-102"
                : "text-gray-300 hover:text-golden-400 hover:bg-dark-800"
            }`}
          >
            <Users className="w-5 h-5" />
            <div className="text-left">
              <span className="block leading-tight">Álbum de Familias & Papás</span>
              <span className={`text-[10px] font-normal block ${activeTab === "community" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                Fotos de los papás en los partidos
              </span>
            </div>
          </button>

          {/* Pestaña 2: Curiol Studio Pro */}
          <button
            onClick={() => {
              setActiveTab("pro_studio");
              setSelectedAlbumId("all");
            }}
            className={`py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 ${
              activeTab === "pro_studio"
                ? "bg-gradient-to-r from-golden-400 to-golden-600 text-dark-950 shadow-lg shadow-golden-500/30 scale-102"
                : "text-gray-300 hover:text-golden-400 hover:bg-dark-800"
            }`}
          >
            <Camera className="w-5 h-5" />
            <div className="text-left">
              <span className="block leading-tight">Curiol Studio Pro</span>
              <span className={`text-[10px] font-normal block ${activeTab === "pro_studio" ? "text-dark-900 font-bold" : "text-gray-400"}`}>
                Retratos en Partidos Oficiales & Recuerdos
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. BANNER DE ACCIÓN SEGÚN PESTAÑA */}
      {activeTab === "community" ? (
        /* Call to Action para Papás */
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-golden-950/40 border-2 border-golden-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-golden-500/20 text-golden-400 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Álbum Colaborativo de Papás</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase">
              ¿Tomaste fotos en el último partido o entrenamiento?
            </h3>
            <p className="text-xs text-gray-300 max-w-xl">
              Sube tus fotos desde el celular. Se agregarán automáticamente al álbum del encuentro con la marca de agua oficial de <strong>Golden Sport Academy Santa Cruz</strong>.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-golden-500/25 flex items-center gap-2 shrink-0 transition-transform hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Fotos de mi Celular</span>
          </button>
        </div>
      ) : (
        /* Banner Tienda Recuerdos Curiol Studio */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-dark-900 border border-golden-500/30 text-xs text-gray-300 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-golden-500/20 text-golden-400 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-white block uppercase text-xs">Fotografía Profesional por Curiol Studio en Partidos Oficiales</strong>
              <span>Cobertura fotográfica profesional en partidos oficiales y encuentros programados de Golden Sport Academy Santa Cruz. Puedes encargar impresiones en imanes para nevera, retablos de madera o cuadros canvas.</span>
            </div>
          </div>
          <SouvenirStoreBanner />
        </div>
      )}

      {/* 4. FILTROS RÁPIDOS POR FECHA / EVENTO */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-gray-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-gray-400 uppercase flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-golden-500" />
            <span>Eventos:</span>
          </span>
          <button
            onClick={() => setSelectedAlbumId("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-colors ${
              selectedAlbumId === "all"
                ? "bg-golden-500 text-dark-950 shadow font-black"
                : "bg-dark-800 text-gray-300 hover:bg-dark-700"
            }`}
          >
            Todos ({photos.filter(p => activeTab === "pro_studio" ? p.photoType === "pro_studio" : p.photoType === "community").length})
          </button>
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => setSelectedAlbumId(album.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedAlbumId === album.id
                  ? "bg-golden-500 text-dark-950 shadow font-black"
                  : "bg-dark-800 text-gray-300 hover:bg-dark-700"
              }`}
            >
              📅 {album.eventDate}: {album.title}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 font-semibold">
          Mostrando <strong>{currentPhotos.length}</strong> fotos
        </span>
      </div>

      {/* 5. GRILLA DE FOTOGRAFÍAS CON MARCA DE AGUA BLANCA TRANSLÚCIDA: GOLDEN SPORT ACADEMY SANTA CRUZ */}
      {currentPhotos.length === 0 ? (
        <div className="text-center py-16 space-y-3 rounded-3xl bg-dark-900 border border-gray-800">
          <Camera className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase">
            No hay fotos en esta sección aún
          </h3>
          <p className="text-xs text-gray-400">
            {activeTab === "community"
              ? "¡Sé el primer papá o mamá en subir fotos de este encuentro!"
              : "Pronto Curiol Studio publicará nuevas fotografías profesionales de los partidos oficiales."}
          </p>
          {activeTab === "community" && (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-golden-500 text-dark-950 font-black text-xs uppercase inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Foto Ahora</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {currentPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoForView(photo)}
              className="group rounded-3xl overflow-hidden bg-dark-900 border-2 border-gray-800 hover:border-golden-500/60 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              {/* Imagen con Aspect Ratio y Marca de Agua en Superior Derecha */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark-950">
                <img
                  src={photo.photoUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge Superior Izquierdo: Categoría */}
                <div className="absolute top-3 left-3 flex gap-2 z-10">
                  <span className="px-2.5 py-1 rounded-lg bg-dark-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase border border-white/20">
                    {photo.category}
                  </span>
                </div>

                {/* MARCA DE AGUA OFICIAL: LOGO GOLDEN SPORT ACADEMY SANTA CRUZ EN BLANCO TRANSLÚCIDO */}
                <div className="absolute top-3 right-3 z-10 pointer-events-none flex items-center gap-1.5 bg-black/40 backdrop-blur-[2px] px-2.5 py-1 rounded-xl border border-white/15">
                  <img
                    src="/logo.png"
                    alt="Golden Sport Academy Santa Cruz Watermark"
                    className="w-5 h-5 object-contain brightness-0 invert opacity-80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  />
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[8px] font-black tracking-widest text-white/90 uppercase">
                      GOLDEN SPORT ACADEMY
                    </span>
                    <span className="text-[7px] font-black tracking-widest text-golden-400 uppercase">
                      SANTA CRUZ
                    </span>
                  </div>
                </div>

                {/* Sello Inferior: Autoría */}
                <div className="absolute bottom-2 left-2 z-10 px-2.5 py-0.5 rounded-lg bg-dark-950/85 backdrop-blur-sm text-[9px] font-bold text-golden-300 uppercase tracking-wider border border-golden-500/30">
                  📸 {photo.photoType === "pro_studio" ? "Curiol Studio • Partidos Oficiales" : `Familia: ${photo.uploaderName}`}
                </div>

                {/* Like Button en Esquina Inferior Derecha */}
                <button
                  onClick={(e) => handleLike(photo.id, e)}
                  className="absolute bottom-2 right-2 z-10 px-2.5 py-1 rounded-full bg-dark-950/85 backdrop-blur-md text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 border border-white/20 transition-transform active:scale-125 shadow-md"
                  title="Me gusta"
                >
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                  <span>{photo.likesCount}</span>
                </button>
              </div>

              {/* Información y Acciones */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-black text-sm text-white group-hover:text-golden-400 transition-colors line-clamp-1">
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-golden-500" />
                    <span className="truncate max-w-[130px]">{photo.uploaderName}</span>
                  </span>

                  {/* Si es foto de estudio con venta de recuerdos */}
                  {photo.photoType === "pro_studio" ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhotoForPurchase(photo);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-[10px] uppercase flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Encargar Recuerdo</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-500">
                      📅 {photo.eventDate || "Partido"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALES */}
      {/* 1. Modal de Subida de Fotos para Papás */}
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

      {/* 2. Lightbox Visor a Pantalla Completa con Marca de Agua */}
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

      {/* 3. Modal de Compra de Recuerdos (Curiol Studio) */}
      {selectedPhotoForPurchase && (
        <PhotoPurchaseModal
          photo={selectedPhotoForPurchase}
          onClose={() => setSelectedPhotoForPurchase(null)}
        />
      )}
    </div>
  );
}
