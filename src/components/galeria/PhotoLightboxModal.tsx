"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Heart,
  Share2,
  ShoppingBag,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
} from "lucide-react";
import { GalleryPhoto } from "@/types";

interface Props {
  photo: GalleryPhoto;
  photos?: GalleryPhoto[];
  onClose: () => void;
  onLike: (e: React.MouseEvent, id: string) => void;
  onOpenBuy: (photo: GalleryPhoto) => void;
  onDelete?: (photo: GalleryPhoto) => void;
  onNavigate?: (photo: GalleryPhoto) => void;
}

export default function PhotoLightboxModal({
  photo,
  photos = [],
  onClose,
  onLike,
  onOpenBuy,
  onDelete,
  onNavigate,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Estados para Zoom y Pan (Pinch-to-zoom)
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Refs para gestos táctiles (Pinch)
  const touchStartDistRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  // Cálculo del índice actual para navegación Siguiente / Anterior
  const photoList = photos.length > 0 ? photos : [photo];
  const currentIndex = photoList.findIndex((p) => p.id === photo.id);
  const hasMultiple = photoList.length > 1;

  // Reset de zoom al cambiar de foto
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handlePrev = useCallback(() => {
    if (!hasMultiple || !onNavigate) return;
    const prevIndex = (currentIndex - 1 + photoList.length) % photoList.length;
    resetZoom();
    onNavigate(photoList[prevIndex]);
  }, [hasMultiple, onNavigate, currentIndex, photoList, resetZoom]);

  const handleNext = useCallback(() => {
    if (!hasMultiple || !onNavigate) return;
    const nextIndex = (currentIndex + 1) % photoList.length;
    resetZoom();
    onNavigate(photoList[nextIndex]);
  }, [hasMultiple, onNavigate, currentIndex, photoList, resetZoom]);

  // Soporte de teclado (Flechas Izq / Der y Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, onClose]);

  // Controles manuales de Zoom
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4));
  const zoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Doble toque / doble clic para alternar zoom rápido
  const handleDoubleTapOrClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  // GESTOS TÁCTILES: Pinch-to-zoom, Pan y Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Dos dedos: inicio de Pinch-to-zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      // Un dedo: swipe o pan
      const touch = e.touches[0];
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

      if (scale > 1) {
        setIsDragging(true);
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
      }

      // Detección de doble toque (< 300ms)
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        handleDoubleTapOrClick();
      }
      lastTapRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      // Pinching activo
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDistRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * factor, 1), 4);
      setScale(newScale);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && scale > 1 && isDragging) {
      // Panning con un dedo cuando la imagen está ampliada
      const touch = e.touches[0];
      const maxPan = (scale - 1) * 250;
      const newX = Math.min(Math.max(touch.clientX - dragStart.x, -maxPan), maxPan);
      const newY = Math.min(Math.max(touch.clientY - dragStart.y, -maxPan), maxPan);
      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      touchStartDistRef.current = null;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);

      // Si no estaba ampliada, verificar si fue un swipe horizontal para pasar de foto
      if (scale === 1 && touchStartPosRef.current && e.changedTouches.length > 0) {
        const deltaX = e.changedTouches[0].clientX - touchStartPosRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartPosRef.current.y;
        if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 60) {
          if (deltaX < 0) {
            handleNext();
          } else {
            handlePrev();
          }
        }
      }
      touchStartPosRef.current = null;
    }
  };

  // MOUSE: Arrastrar imagen ampliada en desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const maxPan = (scale - 1) * 300;
      const newX = Math.min(Math.max(e.clientX - dragStart.x, -maxPan), maxPan);
      const newY = Math.min(Math.max(e.clientY - dragStart.y, -maxPan), maxPan);
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const convertToJpegBlob = (url: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => resolve(blob),
            "image/jpeg",
            0.95
          );
        } catch (e) {
          console.warn("[Lightbox] Error convirtiendo a JPEG:", e);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleSaveToGallery = async (p: GalleryPhoto) => {
    setIsDownloading(true);
    try {
      const cleanTitle = (p.title || "foto_golden_sport")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .toLowerCase();
      const filename = `${cleanTitle}.jpg`;

      // 1. Convertir la foto a Blob JPEG compatible universalmente
      const blob = await convertToJpegBlob(p.photoUrl);

      if (!blob) {
        fallbackDirectDownload(p.photoUrl, filename);
        setIsDownloading(false);
        return;
      }

      // Detección de iOS (iPhone / iPad) y Android
      const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

      // 2. En iOS (iPhone): La ÚNICA forma estándar de guardar directamente en el Carrete / Fotos es Web Share API con File
      if (isIOS && typeof navigator !== "undefined" && navigator.canShare) {
        try {
          const file = new File([blob], filename, { type: "image/jpeg", lastModified: Date.now() });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: p.title || "Golden Sport Academy",
            });
            setIsDownloading(false);
            return;
          }
        } catch (shareErr: any) {
          if (shareErr?.name === "AbortError") {
            setIsDownloading(false);
            return;
          }
        }
      }

      // 3. En Android y Desktop: Descargar como Blob JPEG para que el MediaScanner de Android la registre automáticamente en la Galería / Google Fotos
      const blobUrl = URL.createObjectURL(blob);
      fallbackDirectDownload(blobUrl, filename);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      setIsDownloading(false);
    } catch (err) {
      console.error("Error al guardar foto en galería:", err);
      fallbackDirectDownload(p.photoUrl, "foto_golden_sport.jpg");
      setIsDownloading(false);
    }
  };

  const fallbackDirectDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 250);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-5xl w-full bg-dark-900 border-2 border-golden-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
      >
        {/* Cabecera del Visor con Contador de Fotos */}
        <div className="p-3.5 sm:p-4 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="space-y-0.5 max-w-[70%]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-golden-400">
                {photo.eventDate} • {photo.category}
              </span>
              {hasMultiple && (
                <span className="px-2 py-0.5 rounded-full bg-golden-500/20 text-golden-300 text-[10px] font-black border border-golden-500/40">
                  {currentIndex + 1} de {photoList.length}
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase truncate">
              {photo.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Controles de Zoom en Cabecera */}
            <div className="hidden sm:flex items-center bg-dark-950 border border-gray-800 rounded-xl p-0.5 text-gray-300">
              <button
                onClick={zoomOut}
                disabled={scale <= 1}
                className="p-1.5 rounded-lg hover:bg-dark-800 hover:text-white disabled:opacity-30"
                title="Alejar Zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="px-2 py-1 text-[10px] font-mono font-bold hover:bg-dark-800 hover:text-golden-400"
                title="Restablecer tamaño original"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={zoomIn}
                disabled={scale >= 4}
                className="p-1.5 rounded-lg hover:bg-dark-800 hover:text-white disabled:opacity-30"
                title="Ampliar Zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white transition-colors"
              title="Cerrar visor (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenedor Interactivo de la Fotografía (Zoom, Pan, Pinch y Flechas de Navegación) */}
        <div
          className="relative w-full flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[45vh] max-h-[62vh] cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleTapOrClick}
        >
          {/* Imagen Transformable por Zoom y Pan */}
          <div
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
            className="w-full h-full flex items-center justify-center will-change-transform"
          >
            <img
              src={photo.photoUrl}
              alt={photo.title}
              className="max-h-[62vh] max-w-full w-auto object-contain mx-auto pointer-events-none"
              draggable={false}
            />
          </div>

          {/* BOTONES FLOTANTES DE NAVEGACIÓN (ANTERIOR / SIGUIENTE) */}
          {hasMultiple && (
            <>
              {/* Botón Anterior */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-golden-500 text-white hover:text-dark-950 border border-golden-500/50 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
                title="Fotografía Anterior (Flecha Izquierda ←)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* Botón Siguiente */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/75 hover:bg-golden-500 text-white hover:text-dark-950 border border-golden-500/50 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20"
                title="Siguiente Fotografía (Flecha Derecha →)"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Indicador de ayuda para Zoom en Pantallas Táctiles */}
          <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md text-[10px] font-bold text-gray-300 border border-white/15">
            <Maximize2 className="w-3 h-3 text-golden-400" />
            <span className="hidden sm:inline">Doble clic o pellizca con dos dedos para zoom</span>
            <span className="sm:hidden">Pellizca con dos dedos para zoom</span>
          </div>

          {/* MARCA DE AGUA OFICIAL: CURIOL STUDIO & GOLDEN SPORT ACADEMY */}
          <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 shadow-xl">
            <img
              src="/curiol-studio-transparent.png"
              alt="Curiol Studio"
              className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />
            <span className="text-gray-400 text-xs font-thin">|</span>
            <img
              src="/logo.png"
              alt="Golden Sport Academy Santa Cruz"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain brightness-0 invert opacity-90"
            />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[7px] sm:text-[8px] font-black tracking-widest text-white/95 uppercase">
                GOLDEN SPORT ACADEMY
              </span>
              <span className="text-[6px] sm:text-[7px] font-black tracking-widest text-golden-400 uppercase">
                SANTA CRUZ
              </span>
            </div>
          </div>

          {/* Sello de Autoría en Esquina Inferior Izquierda */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-[11px] font-black text-golden-300 border border-golden-500/50 pointer-events-none">
            📸 {photo.photoType === "pro_studio" ? "CURIOL STUDIO PRO • PARTIDOS OFICIALES" : `FOTO DE FAMILIA • ${photo.uploaderName}`}
          </div>
        </div>

        {/* Pie del Visor */}
        <div className="p-4 sm:p-5 border-t border-gray-800 space-y-3 shrink-0 overflow-y-auto max-h-[35vh]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              {photo.caption && (
                <p className="text-xs sm:text-sm text-gray-200">{photo.caption}</p>
              )}
              <p className="text-[11px] text-gray-400">
                Subida por: <strong className="text-white">{photo.uploaderName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
              {/* Botón Guardar en Fotos / Galería para iPhone y Android */}
              <button
                onClick={() => handleSaveToGallery(photo)}
                disabled={isDownloading}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                title="Guardar directamente en la galería de fotos de tu teléfono (iPhone / Android) o descargar en tu dispositivo"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? "Guardando..." : "Guardar en Fotos / Galería"}</span>
              </button>

              {/* Botón Compartir WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🏀 ¡Mira esta foto de Golden Sport Academy Santa Cruz!\n"${photo.title}"\n${typeof window !== 'undefined' ? window.location.origin : ''}/galeria`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* Solicitar HD Sin Logos a Curiol Studio */}
              {photo.photoType === "pro_studio" && (
                <button
                  onClick={() => onOpenBuy(photo)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/30 to-golden-500/30 text-golden-300 border border-golden-500/50 hover:bg-golden-500/40 font-black text-xs uppercase shadow-md transition-all hover:scale-105"
                  title="Solicitar fotografía en formato original 300 DPI y limpia sin logos a Curiol Studio"
                >
                  <ShoppingBag className="w-4 h-4 text-golden-400" />
                  <span>Solicitar HD Sin Logos (₡2,500)</span>
                </button>
              )}

              {/* Botón Me Gusta */}
              <button
                onClick={(e) => onLike(e, photo.id)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-pink-500/20 text-pink-400 font-bold text-xs border border-pink-500/40 hover:bg-pink-500/30 transition-colors"
              >
                <Heart className="w-4 h-4 fill-pink-500" />
                <span>{photo.likesCount}</span>
              </button>

              {/* Botón Eliminar Foto */}
              {onDelete && (
                <button
                  onClick={() => onDelete(photo)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold border border-red-500/40 transition-colors"
                  title="Eliminar esta foto permanentemente"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="text-[10px] text-golden-300 font-bold uppercase tracking-wider text-center sm:text-right">
            🤝 Convenio establecido entre Curiol Studio y Golden Sport Academy Santa Cruz
          </div>

          {/* Nota de Calidad de Impresión, Convenio y Publicidad */}
          <div className="pt-2.5 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-2.5 text-[11px] text-gray-400">
            <div className="text-center md:text-left leading-relaxed space-y-0.5">
              <p className="text-gray-300">
                💡 <strong>Información importante:</strong> La fotografía publicada en la web es de <strong>descarga gratuita con logos</strong> para redes sociales e internet (no para impresión).
              </p>
              <p className="text-gray-400">
                Para impresión, se prepara en formato original de <strong>alta resolución (300 DPI)</strong> y se solicita a <strong>Curiol Studio</strong> sin logos: <strong className="text-golden-400">Digital HD: ₡2,500</strong> | <strong className="text-golden-400">Impresa: ₡3,500</strong> | <strong className="text-golden-400">Retablos o Canvas: a consultar precio especial</strong>. Todo lo que es descarga o encargo en HD se solicita a <strong>Curiol Studio al 6060-2617</strong>.
              </p>
            </div>
            <a
              href="https://wa.me/50660602617?text=Hola%20Curiol%20Studio,%20deseo%20apoyar%20al%20equipo%20y%20anunciar%20mi%20marca%20en%20las%20galer%C3%ADas%20oficiales."
              target="_blank"
              rel="noreferrer"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-dark-950 border border-golden-500/30 text-golden-400 hover:text-golden-300 hover:border-golden-400 transition-colors font-bold flex items-center gap-1.5 text-center"
            >
              <span>📢 Anuncie su marca y apoye al equipo</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

