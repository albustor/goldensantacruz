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
  ExternalLink
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
      createdBy: "Administración / Curiol Studio",
      isOpenForUploads: true,
    });

    setIsAddAlbumOpen(false);
    setNewAlbumForm({
      title: "",
      eventDate: new Date().toISOString().split("T")[0],
      category: "Iniciación / Menores de U8 (U6-U8)",
      description: "",
    });
    loadAlbums();
    onRefresh();
  };

  const handleOpenUploadPhoto = (albumId?: string) => {
    const targetAlbum = albums.find(a => a.id === albumId) || albums[0];
    setUploadPhotoForm({
      albumId: targetAlbum ? targetAlbum.id : "",
      title: targetAlbum ? `Fotografía Oficial • ${targetAlbum.title}` : "",
      category: targetAlbum?.category || categories[0] || "Iniciación / Menores de U8 (U6-U8)",
      uploaderName: "Curiol Studio Oficial",
      photoType: "pro_studio",
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
        category: uploadPhotoForm.category,
        photoUrl: url,
        caption: uploadPhotoForm.caption,
        uploaderName: uploadPhotoForm.uploaderName || "Curiol Studio",
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

  return (
    <div className="space-y-8">
      
      {/* BANNER DE VINCULACIÓN AL ÁRBOL DE GUANACASTE */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-dark-800 to-dark-800 border-2 border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
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

      {/* 1. SECCIÓN DE GESTIÓN Y EDICIÓN DE ÁLBUMES ACTIVOS */}
      <div className="p-6 rounded-3xl bg-dark-800 border-2 border-golden-500/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-700 pb-3">
          <div>
            <span className="text-xs font-bold text-golden-400 uppercase">Control de Álbumes del Día</span>
            <h3 className="text-xl font-black text-white uppercase">
              Álbumes Colectivos & Partidos Oficiales ({albums.length})
            </h3>
            <p className="text-xs text-gray-400">
              Edita el nombre fijado por los papás, habilita/deshabilita subidas o añade nuevos eventos de Curiol Studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCatManagerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-200 font-bold text-xs uppercase border border-gray-600 shadow-md shrink-0"
              title="Administrar, crear, editar o eliminar categorías"
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
              onClick={() => handleOpenUploadPhoto()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider shadow-md shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Fotografías</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => {
            const count = photos.filter((p) => p.albumId === album.id || p.eventDate === album.eventDate).length;

            return (
              <div
                key={album.id}
                className="p-4 rounded-2xl bg-dark-900 border border-gray-700 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-golden-400">{album.eventDate}</span>
                    <span className="px-2 py-0.5 rounded bg-golden-500/20 text-golden-300 font-bold">
                      {album.category || "General"}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">{album.title}</h4>
                  <p className="text-[10px] text-gray-400">
                    {count} fotos • Creado por: {album.createdBy || "Papá Golden"}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenUploadPhoto(album.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs flex items-center gap-1 shadow-sm"
                      title="Subir fotos directamente a este álbum"
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

      {/* 2. MODAL PARA EDITAR ÁLBUM COMPLETO (TÍTULO, FECHA Y CATEGORÍA) */}
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

      {/* 3. MODAL PARA CREAR UN NUEVO ÁLBUM */}
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
                  placeholder="Ej. Presentación de uniforme, Clásico Guanacasteco..."
                  value={newAlbumForm.title}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              {/* Selector Dinámico de Categorías con opción de crear/editar/eliminar */}
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

      {/* 4. MODAL PARA SUBIR FOTOGRAFÍAS (ADMIN / CURIOL STUDIO) */}
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
                  Subir Fotografía al Álbum
                </h3>
                <p className="text-xs text-gray-400">
                  Panel oficial de Curiol Studio & Administración
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
                                const MAX = 1000;
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
                                let out = canvas.toDataURL("image/webp", 0.80);
                                if (!out.startsWith("data:image/webp")) {
                                  out = canvas.toDataURL("image/jpeg", 0.82);
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
                        ✓ {uploadPhotoForm.previewUrls.length} {uploadPhotoForm.previewUrls.length === 1 ? 'fotografía cargada' : 'fotografías cargadas'} (Toca para cambiar)
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-golden-400 animate-bounce" />
                      <span className="font-bold text-white text-xs">
                        Selecciona una o varias fotos desde tu equipo
                      </span>
                      <span className="text-[10px] text-gray-400">JPG, PNG o WEBP (Sube todo el lote de una vez)</span>
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
                    onChange={(e) => setUploadPhotoForm({ ...uploadPhotoForm, photoType: e.target.value as any })}
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

      {/* 5. MODERACIÓN DE FOTOGRAFÍAS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 text-golden-400" />
            <span>Fotografías en Galería ({photos.length})</span>
          </h3>
          <button
            onClick={() => handleOpenUploadPhoto()}
            className="px-3.5 py-1.5 rounded-xl bg-golden-500/20 hover:bg-golden-500/30 text-golden-300 font-bold text-xs uppercase flex items-center gap-1 border border-golden-500/40"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Subir Foto</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-2xl bg-dark-800 border border-gray-800 space-y-2 flex flex-col justify-between"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-dark-900 relative">
                <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-black text-golden-400">
                  {p.photoType === "pro_studio" ? "CURIOL PRO" : "PAPÁS"}
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-white line-clamp-1">{p.title}</span>
                <p className="text-[10px] text-gray-400">Por: {p.uploaderName} • {p.eventDate}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-300 pt-1">
                  <span className="text-pink-400 font-bold flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-pink-500" /> {p.likesCount}
                  </span>
                  <button
                    onClick={() => handleDeletePhoto(p.id, p.title)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Eliminar Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
