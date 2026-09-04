"use client";

import React, { useState } from "react";
import { X, Upload, Camera, Calendar, User, Sparkles, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { PlayerCategory } from "@/types";
import { Store } from "@/lib/store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: PlayerCategory[] = [
  "Iniciación / Menores de U8 (U6-U8)",
  "Mini-Básquet (U8-U10)",
  "Infantil (U12-U14)",
  "Juvenil (U16-U18)",
  "Clínicas de Tecnificación & Tiro"
];

export default function PhotoUploadModal({ isOpen, onClose, onSuccess }: Props) {
  const todayStr = new Date().toISOString().split("T")[0];
  const [eventDate, setEventDate] = useState(todayStr);
  const [title, setTitle] = useState("");
  const [uploaderName, setUploaderName] = useState("");
  const [category, setCategory] = useState<PlayerCategory>("Mini-Básquet (U8-U10)");
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      alert("Por favor selecciona una foto de tu celular o computadora.");
      return;
    }
    if (!uploaderName) {
      alert("Por favor indica tu nombre (ej. Papá de Mateo).");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Obtener o crear el álbum oficial del día
      const albumTitle = title.trim() || `Fotos del Encuentro (${eventDate})`;
      const album = await Store.getOrCreateDailyAlbum(eventDate, albumTitle, uploaderName, category);

      // 2. Guardar la foto asociada al álbum del día
      await Store.addGalleryPhoto({
        albumId: album.id,
        eventDate: eventDate,
        title: title || album.title,
        category: category,
        photoUrl: previewUrl,
        caption: caption,
        uploaderName: uploaderName,
        isApproved: true,
        photoType: "community",
        watermarkTag: "Álbum Familiar Santa Bárbara",
      });

      alert("¡Foto subida con éxito al álbum familiar del día!");
      onSuccess();
    } catch (err) {
      alert("Error al subir la fotografía. Inténtelo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-dark-900 border-2 border-golden-500/50 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                Subir Foto Familiar del Partido
              </h2>
              <p className="text-xs text-gray-400">
                Se asociará automáticamente al álbum de fotos de la fecha
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Selector de Foto / Cámara */}
          <div>
            <label className="block font-bold text-gray-300 uppercase mb-1.5">
              Fotografía desde el celular / archivo *
            </label>
            <label className="border-2 border-dashed border-golden-500/40 hover:border-golden-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-dark-950/60 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-golden-500/40">
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-dark-950/80 text-[10px] text-emerald-400 font-bold">
                    ✓ Foto seleccionada (Toca para cambiar)
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-golden-400 animate-bounce" />
                  <span className="font-bold text-white text-xs text-center">
                    Toca aquí para seleccionar una foto o tomarla con la cámara
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Formatos JPG, PNG, WEBP (Hasta 15MB)
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
                {CATEGORIES.map((cat) => (
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
