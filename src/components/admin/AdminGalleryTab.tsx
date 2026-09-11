"use client";

import React, { useState, useEffect } from "react";
import { 
  Camera, 
  Trash2, 
  Heart, 
  Calendar, 
  Upload, 
  Edit3, 
  Plus, 
  CheckCircle2, 
  X,
  Lock,
  Unlock,
  Tag,
  TreeDeciduous,
  ExternalLink,
  Users,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Filter,
  Eye,
  FolderHeart
} from "lucide-react";
import { GalleryAlbum, GalleryPhoto, PlayerCategory } from "@/types";
import { Store } from "@/lib/store";
import CategorySelect from "@/components/common/CategorySelect";
import CategoryManagerModal from "@/components/admin/CategoryManagerModal";

interface Props {
  photos: GalleryPhoto[];
  onRefresh: () => void;
}

export default function AdminGalleryTab({ photos, onRefresh }: Props) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);

  // Accordion state for photo gallery grid (collapsible)
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "community" | "pro_studio">("all");

  // Edit album state
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [editAlbumForm, setEditAlbumForm] = useState({
    title: "",
    eventDate: "",
    category: "Iniciación / Menores de U8 (U6-U8)",
    description: "",
  });

  // Create album state
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false);
  const [newAlbumForm, setNewAlbumForm] = useState({
    title: "",
    eventDate: new Date().toISOString().split("T")[0],
    category: "Iniciación / Menores de U8 (U6-U8)",
    description: "",
    albumType: "pro_studio" as "pro_studio" | "community",
  });

  // Upload photo state (Admin / Curiol Studio)
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [uploadPhotoForm, setUploadPhotoForm] = useState({
    albumId: "",
    title: "",
    category: "Iniciación / Menores de U8 (U6-U8)",
    uploaderName: "Curiol Studio Oficial",
    photoType: "pro_studio" as "pro_studio" | "community",
    caption: "",
    previewUrls: [] as string[],
    priceDigital: 2500,
    pricePrint: 3500,
  });

  useEffect(() => {
    loadAlbums();
    loadCategories();
  }, []);

  const loadAlbums = async () => {
    const data = await Store.getAlbums();
    setAlbums(data);
  };

  const loadCategories = async () => {
    const cats = await Store.getCategories();
    setCategories(cats);
  };

  const handleOpenEditAlbum = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setEditAlbumForm({
      title: album.title,
      eventDate: album.eventDate,
      category: album.category || "Iniciación / Menores de U8 (U6-U8)",
      description: album.description || "",
    });
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum || !editAlbumForm.title) return;

    await Store.updateAlbum({
      ...editingAlbum,
      title: editAlbumForm.title,
      eventDate: editAlbumForm.eventDate,
      category: editAlbumForm.category,
      description: editAlbumForm.description,
    });
    setEditingAlbum(null);
    loadAlbums();
    onRefresh();
  };

  const handleDeleteAlbum = async (albumId: string, title: string) => {
    if (confirm(`¿Eliminar el álbum "${title}" y desvincular sus fotos?`)) {
      await Store.deleteAlbum(albumId);
      loadAlbums();
      onRefresh();
    }
  };

  const handleToggleUploads = async (albumId: string, currentStatus?: boolean) => {
    await Store.toggleAlbumUploads(albumId, !currentStatus);
    loadAlbums();
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumForm.title) return;

    await Store.addAlbum({
      title: newAlbumForm.title,
      eventDate: newAlbumForm.eventDate,
      category: newAlbumForm.category,
      description: newAlbumForm.description,
      createdBy: newAlbumForm.albumType === "pro_studio" ? "Curiol Studio Oficial" : "Familias & Papás",
      isOpenForUploads: true,
    });

    setIsAddAlbumOpen(false);
    setNewAlbumForm({
      title: "",
      eventDate: new Date().toISOString().split("T")[0],
      category: "Iniciación / Menores de U8 (U6-U8)",
      description: "",
      albumType: "pro_studio",
    });
    loadAlbums();
    onRefresh();
  };

  const handleOpenUploadPhoto = (albumId?: string, defaultType: "pro_studio" | "community" = "pro_studio") => {
    const targetAlbum = albums.find(a => a.id === albumId) || albums[0];
    setUploadPhotoForm({
      albumId: targetAlbum ? targetAlbum.id : "",
      title: targetAlbum ? `Fotografía Oficial • ${targetAlbum.title}` : "",
      category: targetAlbum?.category || categories[0] || "Iniciación / Menores de U8 (U6-U8)",
      uploaderName: defaultType === "pro_studio" ? "Curiol Studio Oficial" : "Familias / Papás",
      photoType: defaultType,
      caption: "",
      previewUrls: [],
      priceDigital: 2500,
      pricePrint: 3500,
    });
    setIsUploadPhotoOpen(true);
  };

  const handleSavePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadPhotoForm.previewUrls.length === 0) {
      alert("Por favor selecciona una o más fotografías para subir.");
      return;
    }
    const targetAlbum = albums.find(a => a.id === uploadPhotoForm.albumId);
    const eventDate = targetAlbum ? targetAlbum.eventDate : new Date().toISOString().split("T")[0];

    for (let i = 0; i < uploadPhotoForm.previewUrls.length; i++) {
      const url = uploadPhotoForm.previewUrls[i];
      const baseTitle = uploadPhotoForm.title || (targetAlbum ? targetAlbum.title : "Foto Oficial");
      const finalTitle = uploadPhotoForm.previewUrls.length > 1 ? `${baseTitle} #${i + 1}` : baseTitle;

      await Store.addGalleryPhoto({
        albumId: uploadPhotoForm.albumId,
        eventDate: eventDate,
        title: finalTitle,
        category: uploadPhotoForm.category as PlayerCategory,
        photoUrl: url,
        caption: uploadPhotoForm.caption,
        uploaderName: uploadPhotoForm.uploaderName || (uploadPhotoForm.photoType === "pro_studio" ? "Curiol Studio" : "Familia"),
        photoType: uploadPhotoForm.photoType,
        isApproved: true,
        watermarkTag: "Curiol Studio Santa Cruz",
        priceDigital: uploadPhotoForm.photoType === "pro_studio" ? uploadPhotoForm.priceDigital : undefined,
        pricePrint: uploadPhotoForm.photoType === "pro_studio" ? uploadPhotoForm.pricePrint : undefined,
      });
    }

    setIsUploadPhotoOpen(false);
    onRefresh();
    alert(`¡${uploadPhotoForm.previewUrls.length} ${uploadPhotoForm.previewUrls.length === 1 ? 'fotografía subida' : 'fotografías subidas'} y publicadas con éxito en el álbum!`);
  };

  const handleDeletePhoto = async (id: string, title: string) => {
    if (confirm(`¿Eliminar la fotografía "${title}"?`)) {
      await Store.deleteGalleryPhoto(id);
      onRefresh();
    }
  };

  // Separa álbumes entre colectivos y Curiol Studio
  const communityAlbums = albums.filter(a => 
    a.createdBy?.toLowerCase().includes("papá") || 
    a.createdBy?.toLowerCase().includes("familia") ||
    a.title.toLowerCase().includes("colectivo") ||
    a.title.toLowerCase().includes("familiar")
  );
  
  const proStudioAlbums = albums.filter(a => !communityAlbums.some(ca => ca.id === a.id));

  // Filtrado de fotos para la cuadrícula
  const filteredPhotos = photos.filter(p => {
    if (filterType === "community") return p.photoType === "community";
    if (filterType === "pro_studio") return p.photoType === "pro_studio";
    return true;
  });

  const communityPhotosCount = photos.filter(p => p.photoType === "community").length;
  const proPhotosCount = photos.filter(p => p.photoType === "pro_studio").length;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ⚠️ ALERTA OBLIGATORIA: ATLETAS SIN AUTORIZACIÓN FOTOGRÁFICA */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-950/90 via-rose-950/80 to-red-950/90 border-2 border-red-500/70 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
            <span className="text-lg">🚫</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-red-400 tracking-wider block">
              Control Estricto de Privacidad & Consentimiento
            </span>
            <h4 className="text-sm font-black text-white uppercase">
              2 Atletas No Deben Aparecer en Fotografías ni Videos
            </h4>
            <p className="text-xs text-rose-200">
              Verificar antes de publicar en redes sociales o galerías: <strong>David Galagarza Villarreal</strong> y <strong>Lucía Padilla Gutiérrez</strong>.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase shadow shrink-0">
          Protección Activa
        </span>
      </div>

      {/* BANNER DE VINCULACIÓN AL ÁRBOL DE GUANACASTE */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-dark-800 to-dark-800 border-2 border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
            <TreeDeciduous className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
              Ecosistema Central Curiol Studio
            </span>
            <h3 className="text-base font-black text-white uppercase">
              Árbol de Guanacaste • Línea de Tiempo Histórica
            </h3>
            <p className="text-xs text-gray-300">
              Al finalizar cada jornada, consolida el material y accede a la línea de tiempo oficial en Curiol Studio.
            </p>
          </div>
        </div>

        <a
          href="https://www.curiol.studio/linea-de-tiempo/golden-academy-santa-cruz"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shrink-0 transition-transform hover:scale-105"
        >
          <span>Abrir Árbol de Guanacaste ↗</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 1. LÍNEA 1: ÁLBUM COLECTIVO DE LAS FAMILIAS (FOTOS INICIALES DE PAPÁS) */}
      <div className="p-6 rounded-3xl bg-dark-800/95 border-2 border-amber-500/40 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-700/80 pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase">
              <Users className="w-3 h-3" />
              <span>Línea Colectiva • Aportes de la Comunidad</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase">
              Álbum Colectivo de Familias & Papás
            </h3>
            <p className="text-xs text-gray-300">
              Espacio donde las familias y papás suben sus fotos iniciales desde las gradas en cada partido.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenUploadPhoto(undefined, "community")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-black text-xs uppercase tracking-wider shadow-md shrink-0 transition-transform hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              <span>+ Subir Foto Colectiva</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Álbumes Colectivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(communityAlbums.length > 0 ? communityAlbums : [albums[0]]).filter(Boolean).map((album) => {
            const count = photos.filter((p) => (p.albumId === album.id || p.eventDate === album.eventDate) && p.photoType === "community").length;

            return (
              <div
                key={album.id}
                className="p-4 rounded-2xl bg-dark-900 border border-amber-500/30 space-y-3 flex flex-col justify-between shadow-md"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-400">📅 {album.eventDate}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {album.category || "General"}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">{album.title} (Colectivo)</h4>
                  <p className="text-[10px] text-gray-400">
                    {count} fotos de familias • Creado por: {album.createdBy || "Familias & Papás"}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenUploadPhoto(album.id, "community")}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-dark-950 font-black text-xs flex items-center gap-1 shadow-sm"
                      title="Subir fotos a este álbum colectivo"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Foto</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditAlbum(album)}
                      className="px-2 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 font-bold text-xs flex items-center gap-1 border border-gray-700"
                      title="Editar título, fecha y categoría"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleUploads(album.id, album.isOpenForUploads)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      album.isOpenForUploads
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {album.isOpenForUploads ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{album.isOpenForUploads ? "Abierto" : "Cerrado"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. LÍNEA 2: CONTROL DE ÁLBUM DEL DÍA & COBERTURA OFICIAL CURIOL STUDIO */}
      <div className="p-6 rounded-3xl bg-dark-800/95 border-2 border-golden-500/50 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-700/80 pb-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-golden-500/20 text-golden-300 text-[10px] font-black uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Control de Álbum del Día • Curiol Studio</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase">
              Álbumes Oficiales & Galería de Partidos ({albums.length})
            </h3>
            <p className="text-xs text-gray-300">
              Panel para subir la fotografía oficial de partidos de Curiol Studio, fijar álbumes y gestionar eventos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCatManagerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-200 font-bold text-xs uppercase border border-gray-600 shadow-md shrink-0"
              title="Administrar categorías"
            >
              <Tag className="w-3.5 h-3.5 text-golden-400" />
              <span>Gestionar Categorías</span>
            </button>

            <button
              onClick={() => setIsAddAlbumOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-golden-300 font-bold text-xs uppercase border border-golden-500/40 shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Álbum</span>
            </button>

            <button
              onClick={() => handleOpenUploadPhoto(undefined, "pro_studio")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs uppercase tracking-wider shadow-lg shrink-0 transition-transform hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Galería Curiol Studio</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Álbumes Oficiales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => {
            const count = photos.filter((p) => p.albumId === album.id || p.eventDate === album.eventDate).length;
            const isToday = album.eventDate === "2026-09-05" || album.isOpenForUploads;

            return (
              <div
                key={album.id}
                className={`p-4 rounded-2xl bg-dark-900 border space-y-3 flex flex-col justify-between transition-all ${
                  isToday ? "border-golden-500 shadow-lg shadow-golden-500/10" : "border-gray-700"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-golden-400">📅 {album.eventDate}</span>
                    <span className="px-2 py-0.5 rounded bg-golden-500/20 text-golden-300 font-bold">
                      {album.category || "General"}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    {album.title}
                    {isToday && (
                      <span className="px-1.5 py-0.2 rounded bg-golden-500 text-dark-950 text-[9px] font-black uppercase">
                        Hoy
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {count} fotos • Creado por: {album.createdBy || "Curiol Studio"}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenUploadPhoto(album.id, "pro_studio")}
                      className="px-2.5 py-1.5 rounded-lg bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs flex items-center gap-1 shadow-sm"
                      title="Subir fotos oficiales a este álbum"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Foto</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditAlbum(album)}
                      className="px-2 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 font-bold text-xs flex items-center gap-1 border border-gray-700"
                      title="Editar título, fecha y categoría"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteAlbum(album.id, album.title)}
                      className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs"
                      title="Eliminar Álbum"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleUploads(album.id, album.isOpenForUploads)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      album.isOpenForUploads
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {album.isOpenForUploads ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{album.isOpenForUploads ? "Abierto" : "Cerrado"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SECCIÓN MODERACIÓN DE FOTOGRAFÍAS TIPO ACORDEÓN (MINIMIZAR / MAXIMIZAR) */}
      <div className="rounded-3xl bg-dark-800 border-2 border-gray-700/80 overflow-hidden shadow-2xl transition-all">
        {/* Cabecera del Acordeón con Botón Interactivo */}
        <div 
          onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
          className="p-5 sm:p-6 bg-dark-850 hover:bg-dark-750 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-750 select-none transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                  Fotografías en Galería ({photos.length})
                </h3>
                <span className="text-[11px] text-golden-400 font-bold hidden sm:inline">
                  • {isGalleryExpanded ? "Toca para minimizar" : "Toca para expandir"}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {communityPhotosCount} fotos colectivas de familias • {proPhotosCount} fotos oficiales Curiol Studio Pro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Acciones Rápidas */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenUploadPhoto();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase flex items-center gap-1 shadow-sm transition-transform hover:scale-105"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Subir Foto</span>
            </button>

            {/* Icono de Flecha Giratoria Acordeón */}
            <div className="w-9 h-9 rounded-xl bg-dark-900 border border-gray-700 text-golden-400 flex items-center justify-center transition-transform duration-300">
              {isGalleryExpanded ? (
                <ChevronUp className="w-5 h-5 text-golden-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-golden-400" />
              )}
            </div>
          </div>
        </div>

        {/* Contenido Desplegable / Acordeón */}
        {isGalleryExpanded && (
          <div className="p-5 sm:p-6 space-y-5 animate-fadeIn">
            {/* Filtros de la Galería Moderada */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-750 pb-4">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-900 border border-gray-700">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    filterType === "all"
                      ? "bg-golden-500 text-dark-950"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Todas ({photos.length})
                </button>
                <button
                  onClick={() => setFilterType("community")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    filterType === "community"
                      ? "bg-amber-500 text-dark-950"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Familias ({communityPhotosCount})
                </button>
                <button
                  onClick={() => setFilterType("pro_studio")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    filterType === "pro_studio"
                      ? "bg-golden-500 text-dark-950"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Curiol Pro ({proPhotosCount})
                </button>
              </div>

              <span className="text-xs text-gray-400">
                Mostrando {filteredPhotos.length} fotos
              </span>
            </div>

            {/* Cuadrícula de Fotos */}
            {filteredPhotos.length === 0 ? (
              <div className="text-center py-12 space-y-2 rounded-2xl bg-dark-900 border border-gray-800">
                <Camera className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-xs text-gray-400">No hay fotografías registradas en este filtro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-dark-900 border border-gray-800 hover:border-golden-500/50 space-y-2 flex flex-col justify-between transition-all shadow-md group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-dark-950 relative">
                      <img 
                        src={p.photoUrl} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-sm text-[9px] font-black text-golden-400 border border-white/20">
                        {p.photoType === "pro_studio" ? "CURIOL PRO" : "PAPÁS"}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-white line-clamp-1 group-hover:text-golden-400 transition-colors">
                        {p.title}
                      </span>
                      <p className="text-[10px] text-gray-400">Por: {p.uploaderName} • {p.eventDate}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-gray-300 pt-1.5 border-t border-gray-800">
                        <span className="text-pink-400 font-bold flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-pink-500" /> {p.likesCount}
                        </span>
                        <button
                          onClick={() => handleDeletePhoto(p.id, p.title)}
                          className="p-1 rounded-md bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-colors"
                          title="Eliminar Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. MODAL PARA EDITAR ÁLBUM */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingAlbum(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white uppercase">
              Editar Álbum
            </h3>
            <p className="text-xs text-gray-400">
              Modifica el título, fecha y categoría asignada para este evento de la academia.
            </p>

            <form onSubmit={handleSaveAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Fecha del Evento *</label>
                <input
                  type="date"
                  required
                  value={editAlbumForm.eventDate}
                  onChange={(e) => setEditAlbumForm({ ...editAlbumForm, eventDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Título del Álbum *</label>
                <input
                  type="text"
                  required
                  value={editAlbumForm.title}
                  onChange={(e) => setEditAlbumForm({ ...editAlbumForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              {/* Selector Dinámico de Categorías */}
              <CategorySelect
                value={editAlbumForm.category}
                onChange={(cat) => setEditAlbumForm({ ...editAlbumForm, category: cat })}
                label="Categoría del Álbum"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAlbum(null)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-gray-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-golden-500 text-dark-900 font-black uppercase shadow-md"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL PARA CREAR UN NUEVO ÁLBUM */}
      {isAddAlbumOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddAlbumOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-white uppercase">
              Crear Álbum Oficial / Evento
            </h3>

            <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Tipo de Álbum *</label>
                <select
                  value={newAlbumForm.albumType}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, albumType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                >
                  <option value="pro_studio">Curiol Studio Oficial (Partidos y Eventos Pro)</option>
                  <option value="community">Colectivo de Familias (Gradas y Momentos)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Fecha del Evento *</label>
                <input
                  type="date"
                  required
                  value={newAlbumForm.eventDate}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, eventDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Título Oficial del Álbum *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Gran Jornada Oficial de Liberia..."
                  value={newAlbumForm.title}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <CategorySelect
                value={newAlbumForm.category}
                onChange={(cat) => setNewAlbumForm({ ...newAlbumForm, category: cat })}
                label="Categoría"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAlbumOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-gray-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-golden-500 text-dark-900 font-black uppercase shadow-md"
                >
                  Crear Álbum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL PARA SUBIR FOTOGRAFÍAS (ADMIN / CURIOL STUDIO / COLECTIVAS) */}
      {isUploadPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-lg bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setIsUploadPhotoOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-gray-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase">
                  {uploadPhotoForm.photoType === "pro_studio" ? "Subir Galería Curiol Studio" : "Subir Fotos Colectivas"}
                </h3>
                <p className="text-xs text-gray-400">
                  {uploadPhotoForm.photoType === "pro_studio" ? "Cobertura Oficial de Partidos HD" : "Aportes de familias y comunidad"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePhotoSubmit} className="space-y-4 text-xs">
              {/* Selector de Archivo (Múltiples) */}
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1 flex items-center justify-between">
                  <span>Fotografías * (Puedes seleccionar todas de una vez)</span>
                  {uploadPhotoForm.previewUrls.length > 0 && (
                    <span className="text-golden-400 font-black">
                      📸 {uploadPhotoForm.previewUrls.length} {uploadPhotoForm.previewUrls.length === 1 ? 'foto lista' : 'fotos listas'}
                    </span>
                  )}
                </label>
                <label className="border-2 border-dashed border-golden-500/40 hover:border-golden-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-dark-950/60 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const fileArray = Array.from(files);
                        const compressPromises = fileArray.map((file) => {
                          return new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              const img = new Image();
                              img.onload = () => {
                                const MAX = 1200;
                                let { width, height } = img;
                                if (width > MAX || height > MAX) {
                                  if (width >= height) {
                                    height = Math.round((height * MAX) / width);
                                    width = MAX;
                                  } else {
                                    width = Math.round((width * MAX) / height);
                                    height = MAX;
                                  }
                                }
                                const canvas = document.createElement("canvas");
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext("2d");
                                if (!ctx) return resolve(base64);
                                ctx.drawImage(img, 0, 0, width, height);
                                let out = canvas.toDataURL("image/webp", 0.85);
                                if (!out.startsWith("data:image/webp")) {
                                  out = canvas.toDataURL("image/jpeg", 0.85);
                                }
                                resolve(out);
                              };
                              img.onerror = () => resolve(base64);
                              img.src = base64;
                            };
                            reader.readAsDataURL(file);
                          });
                        });

                        const results = await Promise.all(compressPromises);
                        setUploadPhotoForm((prev) => ({ ...prev, previewUrls: [...prev.previewUrls, ...results] }));
                      }
                    }}
                    className="hidden"
                  />
                  {uploadPhotoForm.previewUrls.length > 0 ? (
                    <div className="w-full space-y-2">
                      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                        {uploadPhotoForm.previewUrls.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-golden-500/40 bg-dark-900">
                            <img
                              src={url}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] text-golden-300 font-bold">
                              #{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="text-center text-emerald-400 font-bold text-[11px] pt-1">
                        ✓ {uploadPhotoForm.previewUrls.length} {uploadPhotoForm.previewUrls.length === 1 ? 'fotografía cargada' : 'fotografías cargadas'} (Toca para añadir más)
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-golden-400 animate-bounce" />
                      <span className="font-bold text-white text-xs text-center">
                        Selecciona una o varias fotos en alta resolución
                      </span>
                      <span className="text-[10px] text-gray-400">JPG, PNG o WEBP (Carga por lote simultáneo)</span>
                    </>
                  )}
                </label>
              </div>

              {/* Álbum Destino & Tipo de Foto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Álbum Asignado *</label>
                  <select
                    value={uploadPhotoForm.albumId}
                    onChange={(e) => setUploadPhotoForm({ ...uploadPhotoForm, albumId: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  >
                    <option value="">Seleccionar Álbum...</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.eventDate} - {a.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Tipo de Publicación *</label>
                  <select
                    value={uploadPhotoForm.photoType}
                    onChange={(e) => setUploadPhotoForm({ 
                      ...uploadPhotoForm, 
                      photoType: e.target.value as any,
                      uploaderName: e.target.value === "pro_studio" ? "Curiol Studio Oficial" : "Familias & Papás"
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  >
                    <option value="pro_studio">Curiol Studio Pro (Oficial)</option>
                    <option value="community">Comunidad (Papás y Familias)</option>
                  </select>
                </div>
              </div>

              {/* Título & Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Título de la Foto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Jugada de Thiago / Tiro al aro"
                    value={uploadPhotoForm.title}
                    onChange={(e) => setUploadPhotoForm({ ...uploadPhotoForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>

                <CategorySelect
                  value={uploadPhotoForm.category}
                  onChange={(cat) => setUploadPhotoForm({ ...uploadPhotoForm, category: cat })}
                  label="Categoría"
                />
              </div>

              {/* Autor / Fotógrafo */}
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Nombre del Fotógrafo / Autor</label>
                <input
                  type="text"
                  value={uploadPhotoForm.uploaderName}
                  onChange={(e) => setUploadPhotoForm({ ...uploadPhotoForm, uploaderName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              {/* Pie de foto / Observación */}
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Descripción / Pie de Foto</label>
                <textarea
                  rows={2}
                  value={uploadPhotoForm.caption}
                  onChange={(e) => setUploadPhotoForm({ ...uploadPhotoForm, caption: e.target.value })}
                  placeholder="Detalles sobre el momento deportivo..."
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsUploadPhotoOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-dark-800 text-gray-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black uppercase shadow-lg flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publicar en Álbum</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal General de Gestión de Categorías */}
      <CategoryManagerModal
        categories={categories}
        isOpen={isCatManagerOpen}
        onClose={() => setIsCatManagerOpen(false)}
        onCategoriesChange={(updated) => {
          setCategories(updated);
          loadCategories();
        }}
      />
    </div>
  );
}
