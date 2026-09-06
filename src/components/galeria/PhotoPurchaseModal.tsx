"use client";

import React, { useState } from "react";
import { X, MessageCircle, Sparkles, ShieldCheck, HeartHandshake, Info } from "lucide-react";
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
        : "Fotografía Digital HD Máster sin logos (₡3,500)";

    const message = `📸 *SOLICITUD DE FOTOGRAFÍA OFICIAL - CURIOL STUDIO*\n\n¡Hola Alberto / Curiol Studio!\n\nMe interesa encargar la fotografía oficial de mi hijo(a) bajo la tarifa especial del convenio con Golden Sport Academy:\n\n• *Título de la Foto:* ${photo.title}\n• *Fecha del Evento:* ${photo.eventDate || "Jornada Oficial"}\n• *Categoría:* ${photo.category || "General"}\n• *Formato Elegido:* ${productName}\n• *Precio Convenio:* ₡3,500\n\nPor favor indíquenme el procedimiento de entrega en alta resolución y datos de pago por Sinpe Móvil al 6060-2617. ¡Muchas gracias!`;

    window.open(`https://wa.me/50660602617?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-golden-500 text-dark-950 text-[10px] font-black uppercase">
              <Sparkles className="w-3 h-3" />
              Curiol Studio • Tienda Oficial
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              <HeartHandshake className="w-3 h-3" />
              Convenio Golden Sport Academy
            </span>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {photo.title}
          </h3>
          <p className="text-xs text-gray-400">
            Adquiere esta fotografía profesional con tarifa preferencial y apoya directamente a nuestro equipo.
          </p>
        </div>

        {/* Preview de la foto */}
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-golden-500/40 bg-black">
          <img src={photo.photoUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/85 text-[10px] font-black text-golden-400 border border-golden-500/40">
            📸 CURIOL STUDIO OFICIAL
          </div>
        </div>

        {/* Selección de Producto */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
            Seleccione el formato deseado (Precio Especial de Convenio: ₡3,500):
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Digital HD */}
            <button
              type="button"
              onClick={() => setSelectedProduct("digital")}
              className={`p-3.5 rounded-2xl text-center space-y-1 transition-all ${
                selectedProduct === "digital"
                  ? "bg-golden-500 text-dark-950 border-2 border-golden-300 shadow-lg scale-[1.02]"
                  : "bg-dark-800 text-gray-300 border border-gray-700 hover:border-gray-500"
              }`}
            >
              <span className="text-2xl block">💾</span>
              <p className="text-xs font-black uppercase">Fotografías Digitales</p>
              <p className="text-base font-black">₡3,500</p>
              <span className={`text-[10px] font-bold block ${selectedProduct === "digital" ? "text-dark-900" : "text-gray-400"}`}>
                Máster 300 DPI Sin Logos
              </span>
            </button>

            {/* Retablo o Canvas */}
            <button
              type="button"
              onClick={() => setSelectedProduct("retablo_canvas")}
              className={`p-3.5 rounded-2xl text-center space-y-1 transition-all ${
                selectedProduct === "retablo_canvas"
                  ? "bg-golden-500 text-dark-950 border-2 border-golden-300 shadow-lg scale-[1.02]"
                  : "bg-dark-800 text-gray-300 border border-gray-700 hover:border-gray-500"
              }`}
            >
              <span className="text-2xl block">🖼️</span>
              <p className="text-xs font-black uppercase">Retablos o Canvas</p>
              <p className="text-base font-black">₡3,500</p>
              <span className={`text-[10px] font-bold block ${selectedProduct === "retablo_canvas" ? "text-dark-900" : "text-gray-400"}`}>
                Madera o Lienzo Artístico
              </span>
            </button>
          </div>
        </div>

        {/* Nota Pedagógica Técnica */}
        <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-golden-500/30 space-y-2 text-xs text-gray-300">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">¿Por qué este proceso es diferente?</strong> La imagen de la web está optimizada para internet y lleva marcas de agua/patrocinio. Al ordenar tu copia, Curiol Studio prepara el archivo máster con ajuste de iluminación, nitidez de estudio e <strong className="text-emerald-400">impresión limpia sin logotipos publicitarios</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-gray-800/80 text-[11px] text-golden-300">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tu compra apoya a los fondos deportivos de Golden Sport Academy Santa Cruz.</span>
          </div>
        </div>

        {/* Botón de Pedido WhatsApp a Curiol Studio */}
        <div className="pt-1">
          <button
            onClick={handleBuyWhatsApp}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Encargar a Curiol Studio por WhatsApp (6060-2617)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

