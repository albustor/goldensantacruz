"use client";

import React, { useState } from "react";
import { X, Phone, ShoppingBag, Sparkles } from "lucide-react";
import { GalleryPhoto } from "@/types";

interface Props {
  photo: GalleryPhoto;
  onClose: () => void;
}

export default function PhotoPurchaseModal({ photo, onClose }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<"digital" | "retablo_canvas">("digital");

  const handleBuyWhatsApp = () => {
    const productName =
      selectedProduct === "retablo_canvas"
        ? "Retablo de Madera o Cuadro Canvas Artístico (₡3,500)"
        : "Fotografía Digital HD (₡3,500)";

    const message = `📸 *SOLICITUD DE FOTOGRAFÍA - CURIOL STUDIO SANTA CRUZ*\n\n¡Hola Lenny / Curiol Studio!\n\nMe interesa encargar la fotografía oficial de mi hijo(a):\n\n• *Título:* ${photo.title}\n• *Fecha:* ${photo.eventDate}\n• *Categoría:* ${photo.category}\n• *Producto Elegido:* ${productName}\n\nPor favor indíquenme el procedimiento de entrega y datos de pago por Sinpe Móvil al 6280-6989. ¡Muchas gracias!`;

    window.open(`https://wa.me/50662806989?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-golden-500/20 text-golden-400 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curiol Studio • Tienda de Recuerdos</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase">
            {photo.title}
          </h3>
          <p className="text-xs text-gray-400">
            Selecciona el formato en el que deseas adquirir esta fotografía oficial:
          </p>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden border border-golden-500/40 bg-black">
          <img src={photo.photoUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-black text-golden-400 border border-golden-500/40">
            📸 CURIOL STUDIO
          </div>
        </div>

        {/* Product selection */}
        <div className="grid grid-cols-2 gap-3">
          {/* Digital HD */}
          <button
            type="button"
            onClick={() => setSelectedProduct("digital")}
            className={`p-4 rounded-2xl text-center space-y-1.5 transition-all ${
              selectedProduct === "digital"
                ? "bg-golden-500 text-dark-900 border-2 border-golden-400 shadow-lg scale-105"
                : "bg-dark-800 text-gray-300 border border-gray-700 hover:border-gray-500"
            }`}
          >
            <span className="text-2xl">💾</span>
            <p className="text-xs font-black uppercase">Fotografías Digitales</p>
            <p className="text-base font-black">₡3,500</p>
            <span className="text-[10px] text-dark-800 font-bold block">Archivo Original HD</span>
          </button>

          {/* Retablo o Canvas */}
          <button
            type="button"
            onClick={() => setSelectedProduct("retablo_canvas")}
            className={`p-4 rounded-2xl text-center space-y-1.5 transition-all ${
              selectedProduct === "retablo_canvas"
                ? "bg-golden-500 text-dark-900 border-2 border-golden-400 shadow-lg scale-105"
                : "bg-dark-800 text-gray-300 border border-gray-700 hover:border-gray-500"
            }`}
          >
            <span className="text-2xl">🖼️</span>
            <p className="text-xs font-black uppercase">Retablos o Canvas</p>
            <p className="text-base font-black">₡3,500</p>
            <span className="text-[10px] text-dark-800 font-bold block">Madera o Lienzo Artístico</span>
          </button>
        </div>

        <div className="pt-2">
          <button
            onClick={handleBuyWhatsApp}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Encargar a Curiol Studio por WhatsApp (6280-6989)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
