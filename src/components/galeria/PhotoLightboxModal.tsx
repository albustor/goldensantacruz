"use client";

import React from "react";
import Image from "next/image";
import { X, Heart, Share2, ShoppingBag, Download, Trash2 } from "lucide-react";
import { GalleryPhoto } from "@/types";

interface Props {
  photo: GalleryPhoto;
  onClose: () => void;
  onLike: (e: React.MouseEvent, id: string) => void;
  onOpenBuy: (photo: GalleryPhoto) => void;
  onDelete?: (photo: GalleryPhoto) => void;
}

export default function PhotoLightboxModal({ photo, onClose, onLike, onOpenBuy, onDelete }: Props) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadJpg = async (photo: GalleryPhoto) => {
    setIsDownloading(true);
    try {
      const cleanTitle = (photo.title || "foto_golden_sport")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .toLowerCase();
      const filename = `${cleanTitle}.jpg`;

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          fallbackDownload(photo.photoUrl, filename);
          setIsDownloading(false);
          return;
        }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        fallbackDownload(jpgDataUrl, filename);
        setIsDownloading(false);
      };

      img.onerror = () => {
        fallbackDownload(photo.photoUrl, filename);
        setIsDownloading(false);
      };

      img.src = photo.photoUrl;
    } catch (err) {
      console.error("Error al descargar foto en JPG:", err);
      setIsDownloading(false);
    }
  };

  const fallbackDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full bg-dark-900 border-2 border-golden-500/50 rounded-3xl overflow-hidden shadow-2xl space-y-4"
      >
        {/* Cabecera del Visor */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-golden-400">
              {photo.eventDate} • {photo.category}
            </span>
            <h3 className="text-lg font-black text-white uppercase">
              {photo.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenedor de la Fotografía con Marca de Agua en Superior Derecha */}
        <div className="relative w-full max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
          <img
            src={photo.photoUrl}
            alt={photo.title}
            className="max-h-[65vh] w-auto object-contain mx-auto"
          />

          {/* MARCA DE AGUA OFICIAL: CURIOL STUDIO & GOLDEN SPORT ACADEMY */}
          <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 shadow-xl">
            <img
              src="/curiol-studio-transparent.png"
              alt="Curiol Studio"
              className="h-6 w-6 rounded-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />
            <span className="text-gray-400 text-xs font-thin">|</span>
            <img
              src="/logo.png"
              alt="Golden Sport Academy Santa Cruz"
              className="w-5 h-5 object-contain brightness-0 invert opacity-90"
            />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] font-black tracking-widest text-white/95 uppercase">
                GOLDEN SPORT ACADEMY
              </span>
              <span className="text-[7px] font-black tracking-widest text-golden-400 uppercase">
                SANTA CRUZ
              </span>
            </div>
          </div>

          {/* Sello de Autoría en Esquina Inferior Izquierda */}
          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-xs font-black text-golden-300 border border-golden-500/50">
            📸 {photo.photoType === "pro_studio" ? "CURIOL STUDIO PRO • PARTIDOS OFICIALES" : `FOTO DE FAMILIA • ${photo.uploaderName}`}
          </div>
        </div>

        {/* Pie del Visor */}
        <div className="p-5 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            {photo.caption && (
              <p className="text-sm text-gray-200">{photo.caption}</p>
            )}
            <p className="text-xs text-gray-400">
              Subida por: <strong className="text-white">{photo.uploaderName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            {/* Botón Descargar JPG para TODAS las fotos */}
            <button
              onClick={() => handleDownloadJpg(photo)}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
              title="Descargar fotografía en formato JPG"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? "Descargando..." : "Descargar JPG"}</span>
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

            {/* Encargar Recuerdo (si es de Curiol Pro) */}
            {photo.photoType === "pro_studio" && (
              <button
                onClick={() => onOpenBuy(photo)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold text-xs uppercase transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Encargar Recuerdo</span>
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
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold border border-red-500/40 transition-colors"
                title="Eliminar esta foto permanentemente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
