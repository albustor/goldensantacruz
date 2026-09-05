"use client";

import React, { useState, useEffect } from "react";
import { X, Upload, Camera, User, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { GalleryAlbum } from "@/types";
import { Store } from "@/lib/store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetAlbum?: GalleryAlbum | null;
}

interface CompressedPhoto {
  webpUrl: string;   // para guardar en el álbum
  jpgUrl: string;    // para descarga del usuario
  originalName: string;
}

/**
 * Comprime una imagen base64 a WebP (para guardar) y JPG (para descargar).
 * Máximo 800px en cualquier dimensión, calidad 0.80.
 */
async function compressPhoto(base64: string, originalName: string): Promise<CompressedPhoto> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const MAX = 800;
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
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      // WebP para almacenamiento (~40% más pequeño que JPG)
      const webpUrl = canvas.toDataURL("image/webp", 0.8);
      // JPG para descarga del usuario (compatibilidad universal)
      const jpgUrl = canvas.toDataURL("image/jpeg", 0.85);

      resolve({ webpUrl, jpgUrl, originalName });
    };
    img.onerror = () =>
      resolve({ webpUrl: base64, jpgUrl: base64, originalName });
    img.src = base64;
  });
}

/** Descarga un base64 como archivo */
function downloadBase64(base64: string, filename: string) {
  const a = document.createElement("a");
  a.href = base64;
  a.download = filename;
  a.click();
}

export default function PhotoUploadModal({ isOpen, onClose, onSuccess, targetAlbum }: Props) {
  const [uploaderName, setUploaderName] = useState("");
  const [rawUrls, setRawUrls] = useState<string[]>([]);
  const [rawNames, setRawNames] = useState<string[]>([]);
  const [compressed, setCompressed] = useState<CompressedPhoto[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successCount, setSuccessCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setUploaderName("");
      setRawUrls([]);
      setRawNames([]);
      setCompressed([]);
      setIsSubmitting(false);
      setIsCompressing(false);
      setUploadProgress(0);
      setErrorMsg("");
      setSuccessCount(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setErrorMsg("");
    setCompressed([]);

    const fileArray = Array.from(files);
    setRawNames(fileArray.map((f) => f.name));

    // Leer base64 originales para previsualización rápida
    const readPromises = fileArray.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    const originals = await Promise.all(readPromises);
    setRawUrls(originals);

    // Comprimir en background
    setIsCompressing(true);
    const results = await Promise.all(
      originals.map((b64, i) => compressPhoto(b64, fileArray[i].name))
    );
    setCompressed(results);
    setIsCompressing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (compressed.length === 0 && rawUrls.length === 0) {
      setErrorMsg("Por favor selecciona al menos una foto.");
      return;
    }
    if (!uploaderName.trim()) {
      setErrorMsg("Por favor ingresa tu nombre.");
      return;
    }
    if (isCompressing) {
      setErrorMsg("Espera un momento, las fotos aún se están preparando...");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    const photos = compressed.length > 0 ? compressed : rawUrls.map((u, i) => ({
      webpUrl: u,
      jpgUrl: u,
      originalName: rawNames[i] || `foto_${i + 1}.jpg`,
    }));

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
      for (const photo of photos) {
        await Store.addGalleryPhoto({
          albumId,
          eventDate: effectiveEventDate,
          title: `Foto de ${uploaderName.trim()}`,
          category: effectiveCategory,
          photoUrl: photo.webpUrl,
          caption: "",
          uploaderName: uploaderName.trim(),
          isApproved: true,
          photoType: "community",
          watermarkTag: "Golden Sport Santa Cruz",
        });
        saved++;
        setUploadProgress(Math.round((saved / photos.length) * 100));
      }

      setSuccessCount(saved);
      onSuccess();
    } catch (err: any) {
      console.error("Error al guardar fotos:", err);
      setErrorMsg(
        "Error al guardar las fotos. Prueba subir menos fotos a la vez (máximo 3-4 por lote)."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasPhotos = rawUrls.length > 0;

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
            className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aviso */}
        <div className="p-3 rounded-xl bg-golden-500/10 border border-golden-500/30 text-[11px] text-golden-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
          <span>
            Las fotos se publican de inmediato. Se comprimen a <strong>WebP 800px</strong> para mejor rendimiento.
            Puedes descardar tu copia en JPG antes de publicar.
          </span>
        </div>

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
            <label className="block font-black text-gray-200 uppercase mb-2 flex items-center justify-between">
              <span>📷 Tus fotos *</span>
              {hasPhotos && (
                <span className={`font-black ${isCompressing ? "text-amber-400 animate-pulse" : "text-emerald-400"}`}>
                  {isCompressing ? "Preparando..." : `${rawUrls.length} ${rawUrls.length === 1 ? "foto lista" : "fotos listas"} ✓`}
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
              {hasPhotos ? (
                <div className="w-full space-y-2">
                  <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
                    {rawUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-golden-500/40 bg-dark-900">
                        <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                        {isCompressing && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-[8px] text-golden-300 font-bold animate-pulse">⚙️</span>
                          </div>
                        )}
                        {!isCompressing && compressed[idx] && (
                          <button
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              ev.preventDefault();
                              const name = rawNames[idx]?.replace(/\.[^.]+$/, "") || `foto_${idx + 1}`;
                              downloadBase64(compressed[idx].jpgUrl, `${name}_golden.jpg`);
                            }}
                            title="Descargar en JPG"
                            className="absolute bottom-1 right-1 bg-golden-500 hover:bg-golden-400 text-dark-950 rounded-lg p-0.5 shadow-md transition-transform hover:scale-110"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                        )}
                        <span className="absolute top-1 left-1 px-1 rounded bg-black/75 text-[7px] text-golden-300 font-black">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-gray-400 font-bold text-[10px] pt-1">
                    Toca para cambiar selección · Botón <Download className="inline w-2.5 h-2.5" /> = descargar JPG
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-golden-400 animate-bounce" />
                  <span className="font-bold text-white text-xs text-center">
                    Toca aquí para elegir una o varias fotos
                  </span>
                  <span className="text-[10px] text-gray-400 text-center">
                    JPG · PNG · WEBP · Puedes seleccionar varias a la vez
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Nombre del Papá / Mamá */}
          <div>
            <label className="block font-black text-gray-200 uppercase mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-golden-500" />
              <span>Tu nombre *</span>
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
                <span>Publicando fotos en el álbum...</span>
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
              disabled={isSubmitting || isCompressing || !hasPhotos}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black uppercase tracking-wider shadow-lg flex items-center gap-2 disabled:opacity-50 text-xs transition-transform hover:scale-105 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>
                {isCompressing
                  ? "Preparando fotos..."
                  : isSubmitting
                  ? `Publicando ${uploadProgress}%...`
                  : "Publicar Fotos"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
