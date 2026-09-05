"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Camera, User, CheckCircle2, AlertTriangle, Download, Trash2, Plus, Sparkles } from "lucide-react";
import { GalleryAlbum } from "@/types";
import { Store } from "@/lib/store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetAlbum?: GalleryAlbum | null;
}

interface ProcessedPhoto {
  webpUrl: string;   // para guardar en el álbum
  jpgUrl: string;    // para descarga del usuario
  originalName: string;
}

/**
 * Comprime una imagen a WebP (para guardar) y JPG (para descargar).
 * Máximo 1000px en cualquier dimensión, calidad 0.78.
 */
async function compressFile(file: File): Promise<ProcessedPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`No se pudo leer ${file.name}`));
    reader.onload = () => {
      const base64 = reader.result as string;
      const img = new window.Image();
      img.onerror = () => {
        resolve({
          webpUrl: base64,
          jpgUrl: base64,
          originalName: file.name,
        });
      };
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
        if (!ctx) {
          return resolve({
            webpUrl: base64,
            jpgUrl: base64,
            originalName: file.name,
          });
        }
        ctx.drawImage(img, 0, 0, width, height);

        // WebP para almacenamiento ultra-eficiente
        let webpUrl = canvas.toDataURL("image/webp", 0.78);
        if (!webpUrl.startsWith("data:image/webp")) {
          webpUrl = canvas.toDataURL("image/jpeg", 0.80);
        }
        // JPG para descarga de alta fidelidad
        const jpgUrl = canvas.toDataURL("image/jpeg", 0.85);

        resolve({
          webpUrl,
          jpgUrl,
          originalName: file.name,
        });
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  });
}

function downloadBase64(base64: string, filename: string) {
  const a = document.createElement("a");
  a.href = base64;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function PhotoUploadModal({ isOpen, onClose, onSuccess, targetAlbum }: Props) {
  const [uploaderName, setUploaderName] = useState("");
  const [photos, setPhotos] = useState<ProcessedPhoto[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setUploaderName("");
      setPhotos([]);
      setIsSubmitting(false);
      setIsProcessing(false);
      setUploadProgress(0);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setErrorMsg("");
    setIsProcessing(true);

    try {
      const fileArray = Array.from(files);
      const processedList: ProcessedPhoto[] = [];

      for (const file of fileArray) {
        const item = await compressFile(file);
        processedList.push(item);
      }

      setPhotos((prev) => [...prev, ...processedList]);
    } catch (err: any) {
      console.error("Error al procesar imágenes:", err);
      setErrorMsg("Ocurrió un error al preparar las fotos. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (photos.length === 0) {
      setErrorMsg("Por favor selecciona al menos una foto.");
      return;
    }
    if (!uploaderName.trim()) {
      setErrorMsg("Por favor ingresa tu nombre.");
      return;
    }
    if (isProcessing) {
      setErrorMsg("Espera un momento, las fotos se están optimizando...");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const effectiveEventDate = targetAlbum?.eventDate || todayStr;
      const effectiveCategory = targetAlbum?.category || "General";
      const albumTitle = targetAlbum?.title || `Fotos del Evento (${effectiveEventDate})`;

      let albumId = targetAlbum?.id;
      if (!albumId) {
        const album = await Store.getOrCreateDailyAlbum(
          effectiveEventDate,
          albumTitle,
          uploaderName.trim(),
          effectiveCategory
        );
        albumId = album.id;
      }

      let saved = 0;
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        await Store.addGalleryPhoto({
          albumId,
          eventDate: effectiveEventDate,
          title: `Foto de ${uploaderName.trim()} #${i + 1}`,
          category: effectiveCategory,
          photoUrl: p.webpUrl,
          caption: "",
          uploaderName: uploaderName.trim(),
          isApproved: true,
          photoType: "community",
          watermarkTag: "Golden Sport Santa Cruz",
        });
        saved++;
        setUploadProgress(Math.round((saved / photos.length) * 100));
      }

      setSuccessMsg(`¡${saved} ${saved === 1 ? 'foto guardada' : 'fotos guardadas'} con éxito!`);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } catch (err: any) {
      console.error("Error al guardar fotos:", err);
      setErrorMsg(
        "No se pudieron guardar las fotos. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasPhotos = photos.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-dark-900 border-2 border-golden-500/50 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                Subir Fotos al Álbum
              </h2>
              <p className="text-[11px] text-golden-400 font-bold">
                {targetAlbum?.title || "Álbum de Papás"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aviso de Almacenamiento Ilimitado */}
        <div className="p-3 rounded-xl bg-golden-500/10 border border-golden-500/30 text-[11px] text-golden-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
          <span>
            Las fotos se optimizan y guardan al instante. Puedes subir todas las fotos que desees.
          </span>
        </div>

        {/* Mensaje de Éxito */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-[11px] text-red-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">

          {/* Selector de Fotos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-black text-gray-200 uppercase flex items-center gap-1.5">
                <span>📷 Tus fotos</span>
              </label>
              {hasPhotos && (
                <span className={`font-black ${isProcessing ? "text-amber-400 animate-pulse" : "text-emerald-400"}`}>
                  {isProcessing ? "Optimizando..." : `${photos.length} ${photos.length === 1 ? "foto lista" : "fotos listas"} ✓`}
                </span>
              )}
            </div>

            {hasPhotos ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 border border-gray-800 rounded-2xl bg-dark-950/60">
                  {photos.map((p, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-golden-500/40 bg-dark-900 group">
                      <img src={p.webpUrl} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {/* Badge número */}
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/75 text-[8px] text-golden-300 font-black">
                        #{idx + 1}
                      </span>

                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        title="Eliminar de la lista"
                        className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-lg p-1 shadow-md transition-transform hover:scale-110"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {/* Botón descargar JPG */}
                      <button
                        type="button"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          const name = p.originalName.replace(/\.[^.]+$/, "") || `foto_${idx + 1}`;
                          downloadBase64(p.jpgUrl, `${name}_golden.jpg`);
                        }}
                        title="Descargar copia JPG"
                        className="absolute bottom-1 right-1 bg-golden-500 hover:bg-golden-400 text-dark-950 rounded-lg p-1 shadow-md transition-transform hover:scale-110"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Botón añadir más fotos */}
                <label className="border border-dashed border-golden-500/50 hover:border-golden-400 rounded-xl py-2 px-3 flex items-center justify-center gap-2 cursor-pointer bg-golden-500/10 text-golden-300 hover:text-golden-200 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesChange}
                    className="hidden"
                    disabled={isProcessing || isSubmitting}
                  />
                  <Plus className="w-4 h-4" />
                  <span className="font-bold text-xs">Agregar más fotos</span>
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-golden-500/40 hover:border-golden-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-dark-950/60 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesChange}
                  className="hidden"
                  disabled={isProcessing || isSubmitting}
                />
                <Upload className="w-8 h-8 text-golden-400 animate-bounce" />
                <span className="font-bold text-white text-xs text-center">
                  Toca aquí para seleccionar fotos
                </span>
                <span className="text-[10px] text-gray-400 text-center">
                  JPG · PNG · WEBP · Puedes elegir 2, 3, 4 o más fotos a la vez
                </span>
              </label>
            )}
          </div>

          {/* Nombre del Papá / Mamá */}
          <div>
            <label className="block font-black text-gray-200 uppercase mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-golden-500" />
              <span>Tu nombre o familia *</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Carlos Gutiérrez (Papá de Mateo)"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-dark-800 border border-gray-700 text-white placeholder-gray-500 focus:border-golden-500 focus:outline-none text-sm"
            />
          </div>

          {/* Barra de progreso */}
          {isSubmitting && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Guardando fotos en el álbum...</span>
                <span className="text-golden-400 font-black">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-dark-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-golden-400 to-golden-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="pt-3 border-t border-gray-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 font-bold uppercase text-xs disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isProcessing || !hasPhotos}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black uppercase tracking-wider shadow-lg flex items-center gap-2 disabled:opacity-50 text-xs transition-transform hover:scale-105 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>
                {isProcessing
                  ? "Optimizando..."
                  : isSubmitting
                  ? `Guardando (${uploadProgress}%)...`
                  : `Publicar ${photos.length} ${photos.length === 1 ? 'Foto' : 'Fotos'}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
