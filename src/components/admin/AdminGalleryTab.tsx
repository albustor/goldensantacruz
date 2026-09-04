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

interface Props {
  photos: GalleryPhoto[];
  onRefresh: () => void;
}

export default function AdminGalleryTab({ photos, onRefresh }: Props) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [newTitleInput, setNewTitleInput] = useState("");
  const [isAddAlbumOpen, setIsAddAlbumOpen] = useState(false);
  const [newAlbumForm, setNewAlbumForm] = useState({
    title: "",
    eventDate: new Date().toISOString().split("T")[0],
    category: "Iniciación / Menores de U8 (U6-U8)" as PlayerCategory,
    description: "",
  });

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    const data = await Store.getAlbums();
    setAlbums(data);
  };

  const handleOpenEditAlbum = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setNewTitleInput(album.title);
  };

  const handleSaveAlbumTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum || !newTitleInput) return;

    await Store.updateAlbumTitle(editingAlbum.id, newTitleInput);
    setEditingAlbum(null);
    loadAlbums();
    onRefresh();
  };

  const handleToggleUploads = async (albumId: string, currentStatus: boolean) => {
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

          <button
            onClick={() => setIsAddAlbumOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Álbum</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => {
            const count = photos.filter((p) => p.albumId === album.id || p.title === album.title).length;

            return (
              <div
                key={album.id}
                className="p-4 rounded-2xl bg-dark-900 border border-gray-700 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-golden-400">{album.eventDate}</span>
                    <span className="text-gray-400">{count} fotos</span>
                  </div>
                  <h4 className="text-sm font-black text-white">{album.title}</h4>
                  <p className="text-[10px] text-gray-400">Creado por: {album.createdBy || "Papá Golden"}</p>
                </div>

                <div className="pt-2 border-t border-gray-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEditAlbum(album)}
                    className="px-2.5 py-1.5 rounded-lg bg-golden-500/20 hover:bg-golden-500/30 text-golden-300 font-bold text-xs flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Nombre</span>
                  </button>

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

      {/* 2. MODAL PARA EDITAR EL NOMBRE DEL ÁLBUM */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setEditingAlbum(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-white uppercase">
              Editar Nombre del Álbum ({editingAlbum.eventDate})
            </h3>
            <p className="text-xs text-gray-400">
              Al modificar este nombre, se actualizará en la galería de los papás y en todas las fotos asociadas a la fecha.
            </p>

            <form onSubmit={handleSaveAlbumTitle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Nombre Oficial del Álbum</label>
                <input
                  type="text"
                  required
                  value={newTitleInput}
                  onChange={(e) => setNewTitleInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

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
                  Guardar Nombre
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

            <form onSubmit={handleCreateAlbum} className="space-y-3 text-xs">
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
                  placeholder="Ej. Torneo Fogueo Santa Bárbara vs Nicoya"
                  value={newAlbumForm.title}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Categoría</label>
                <select
                  value={newAlbumForm.category}
                  onChange={(e) => setNewAlbumForm({ ...newAlbumForm, category: e.target.value as PlayerCategory })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                >
                  <option value="Iniciación / Menores de U8 (U6-U8)">Iniciación / Menores de U8</option>
                  <option value="Mini-Básquet (U8-U10)">Mini-Básquet (U8-U10)</option>
                  <option value="Infantil (U12-U14)">Infantil (U12-U14)</option>
                  <option value="Juvenil (U16-U18)">Juvenil (U16-U18)</option>
                  <option value="Clínicas de Tecnificación & Tiro">Clínicas de Tiro</option>
                </select>
              </div>

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

      {/* 4. MODERACIÓN DE FOTOGRAFÍAS */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Camera className="w-5 h-5 text-golden-400" />
          <span>Fotografías en Galería ({photos.length})</span>
        </h3>

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
