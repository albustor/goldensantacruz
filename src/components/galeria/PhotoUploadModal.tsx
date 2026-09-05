"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Camera, Calendar, User, Sparkles, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { GalleryAlbum, PlayerCategory } from "@/types";
import { Store } from "@/lib/store";
import { INITIAL_CATEGORIES } from "@/lib/initialData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetAlbum?: GalleryAlbum | null;
}

export default function PhotoUploadModal({ isOpen, onClose, onSuccess, targetAlbum }: Props) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [eventDate, setEventDate] = useState(targetAlbum?.eventDate || todayStr);
  const [title, setTitle] = useState("");
  const [uploaderName, setUploaderName] = useState("");
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [category, setCategory] = useState<PlayerCategory>(
    (targetAlbum?.category as PlayerCategory) || INITIAL_CATEGORIES[0] || "Mini-Básquet (U8-U10)"
  );
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (targetAlbum) {
      setEventDate(targetAlbum.eventDate);
      if (targetAlbum.category) {
        setCategory(targetAlbum.category as PlayerCategory);
      }
    }
    Store.getCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
        if (!targetAlbum && !cats.includes(category)) {
          setCategory(cats[0]);
        }
      }
    });
  }, [isOpen, targetAlbum]);

  if (!isOpen) return null;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const readPromises = fileArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readPromises).then((results) => {
        setPreviewUrls(results);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (previewUrls.length === 0) {
      alert("Por favor selecciona una o más fotos de tu celular o computadora.");
      return;
    }
    if (!uploaderName) {
      alert("Por favor indica tu nombre (ej. Papá de Mateo).");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Obtener el álbum objetivo o crear el álbum oficial del día
      let albumId = targetAlbum?.id;
      let effectiveEventDate = targetAlbum?.eventDate || eventDate;
      let effectiveCategory = targetAlbum?.category || category;
      let effectiveAlbumTitle = targetAlbum?.title || title.trim() || `Fotos del Encuentro (${effectiveEventDate})`;

      if (!albumId) {
        const album = await Store.getOrCreateDailyAlbum(effectiveEventDate, effectiveAlbumTitle, uploaderName, effectiveCategory);
        albumId = album.id;
      }

      // 2. Guardar todas las fotos asociadas al álbum con permisos inmediatos (isApproved: true)
      for (let i = 0; i < previewUrls.length; i++) {
        const photoUrl = previewUrls[i];
        const photoTitle = previewUrls.length > 1
          ? `${title || effectiveAlbumTitle} #${i + 1}`
          : (title || effectiveAlbumTitle);

        await Store.addGalleryPhoto({
          albumId: albumId,
          eventDate: effectiveEventDate,
          title: photoTitle,
          category: effectiveCategory as PlayerCategory,
          photoUrl: photoUrl,
          caption: caption,
          uploaderName: uploaderName,
          isApproved: true,
          photoType: "community",
          watermarkTag: "Álbum Familiar Santa Bárbara",
        });
      }

      alert(`¡${previewUrls.length} ${previewUrls.length === 1 ? 'fotografía subida' : 'fotografías subidas'} con éxito al álbum "${effectiveAlbumTitle}"!`);
      onSuccess();
    } catch (err) {
      alert("Error al subir las fotografías. Inténtelo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-dark-900 border-2 border-golden-500/50 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                {targetAlbum ? `Subir Fotos: ${targetAlbum.title}` : "Subir Fotos Familiares"}
              </h2>
              <p className="text-[11px] text-gray-400">
                {targetAlbum
                  ? `Álbum oficial de hoy • ${targetAlbum.eventDate} (${targetAlbum.category})`
                  : "Álbum colaborativo de papás y familias (puedes subir varias fotos a la vez)"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aviso de Consolidación o Álbum Activo */}
        <div className="p-3 rounded-xl bg-golden-500/10 border border-golden-500/30 text-[11px] text-golden-300 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
          <span>
            {targetAlbum ? (
              <>
                <strong>Álbum Activo:</strong> Estás publicando fotos directamente en <strong>{targetAlbum.title}</strong>. Las fotos se publicarán de inmediato con visibilidad total.
              </>
            ) : (
              <>
                <strong>Álbum del Día:</strong> Si ya existe un álbum de la fecha, todas tus fotos se agregarán automáticamente a ese mismo álbum para tener los recuerdos unidos.
              </>
            )}
          </span>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Selector de Foto / Cámara */}
          <div>
            <label className="block font-bold text-gray-300 uppercase mb-1.5 flex items-center justify-between">
              <span>Fotografías desde el celular / archivo (Múltiples) *</span>
              {previewUrls.length > 0 && (
                <span className="text-golden-400 font-black">
                  📸 {previewUrls.length} {previewUrls.length === 1 ? 'foto lista' : 'fotos listas'}
                </span>
              )}
            </label>
            <label className="border-2 border-dashed border-golden-500/40 hover:border-golden-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-dark-950/60 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesChange}
                className="hidden"
              />
              {previewUrls.length > 0 ? (
                <div className="w-full space-y-2">
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                    {previewUrls.map((url, idx) => (
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
                    ✓ {previewUrls.length} {previewUrls.length === 1 ? 'fotografía seleccionada' : 'fotografías seleccionadas'} (Toca para cambiar selección)
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-golden-400 animate-bounce" />
                  <span className="font-bold text-white text-xs text-center">
                    Toca aquí para seleccionar una o varias fotos a la vez
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Formatos JPG, PNG, WEBP (Puedes seleccionar todas de una vez)
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Fecha del Partido & Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-golden-500" />
                <span>Fecha del Encuentro *</span>
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlayerCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nombre del Papá / Mamá */}
          <div>
            <label className="block font-bold text-gray-300 uppercase mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-golden-500" />
              <span>Tu Nombre / Familiar *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Carlos Gutiérrez (Papá de Mateo) / Jenny Briceño"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
            />
          </div>

          {/* Título opcional / Nombre del evento */}
          <div>
            <label className="block font-bold text-gray-300 uppercase mb-1">
              Título del Momento / Partido (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Gran Pase de Thiago / Celebración de la Victoria"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
            />
            <p className="text-[10px] text-gray-400 mt-0.5">
              Si este día no tiene álbum, este título quedará como nombre del álbum del día.
            </p>
          </div>

          {/* Botones de Envío */}
          <div className="pt-3 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 font-bold uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black uppercase tracking-wider shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? "Subiendo..." : "Publicar Foto en el Álbum"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
