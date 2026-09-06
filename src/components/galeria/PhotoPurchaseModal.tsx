"use client";

import React, { useState } from "react";
import { X, MessageCircle, Sparkles, HeartHandshake, Info, Check, Printer, FileImage, Frame } from "lucide-react";
import { GalleryPhoto } from "@/types";

interface Props {
  photo: GalleryPhoto;
  onClose: () => void;
}

export default function PhotoPurchaseModal({ photo, onClose }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<"digital" | "impresa" | "retablo_canvas">("digital");

  const getProductDetails = () => {
    switch (selectedProduct) {
      case "digital":
        return {
          name: "Fotografía Digital HD Máster (Sin Logos)",
          price: "₡3,500",
          desc: "Archivo en máxima resolución nativa (300 DPI) para guardar o imprimir por cuenta propia.",
        };
      case "impresa":
        return {
          name: "Fotografía Impresa Profesional (Sin Logos)",
          price: "₡3,500",
          desc: "Impresión en papel fotográfico de alta gama con calibración de color de estudio.",
        };
      case "retablo_canvas":
        return {
          name: "Retablo en Madera o Cuadro Canvas (Sin Logos)",
          price: "A Consultar / Cotizar",
          desc: "Acabado de lujo en madera o lienzo artístico (precio varía según medidas y formato).",
        };
    }
  };

  const handleBuyWhatsApp = () => {
    const details = getProductDetails();

    const message = `📸 *SOLICITUD DE FOTOGRAFÍA OFICIAL - CURIOL STUDIO*\n\n¡Hola Alberto / Curiol Studio!\n\nMe interesa solicitar la fotografía oficial de mi hijo(a) sin logotipos publicitarios bajo el convenio con Golden Sport Academy:\n\n• *Título de la Foto:* ${photo.title}\n• *Fecha del Evento:* ${photo.eventDate || "Jornada Oficial"}\n• *Categoría:* ${photo.category || "General"}\n• *Formato Solicitado:* ${details.name}\n• *Tarifa:* ${details.price}\n\nPor favor indíquenme el procedimiento de entrega en alta resolución y datos de pago por Sinpe Móvil al 6060-2617. ¡Muchas gracias!`;

    window.open(`https://wa.me/50660602617?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };

  const details = getProductDetails();

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
            Solicita tu fotografía en alta resolución original y sin marcas de agua.
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
            Selecciona el formato que deseas encargar (Sin Logos):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Digital HD */}
            <button
              type="button"
              onClick={() => setSelectedProduct("digital")}
              className={`p-3 rounded-2xl text-center space-y-1 transition-all flex flex-col justify-between ${
                selectedProduct === "digital"
                  ? "bg-golden-500 text-dark-950 border-2 border-golden-300 shadow-lg scale-[1.02]"
                  : "bg-dark-800 text-gray-300 border border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="space-y-1">
                <FileImage className={`w-5 h-5 mx-auto ${selectedProduct === "digital" ? "text-dark-950" : "text-golden-400"}`} />
                <p className="text-[11px] font-black uppercase">Digital HD</p>
                <span className="text-[9px] block leading-tight font-medium opacity-90">
                  Máster 300 DPI
                </span>
              </div>
              <p className="text-sm font-black pt-1">₡3,500</p>
            </button>

            {/* 2. Impresa */}
            <button
              type="button"
              onClick={() => setSelectedProduct("impresa")}
              className={`p-3 rounded-2xl text-center space-y-1 transition-all flex flex-col justify-between ${
                selectedProduct === "impresa"
                  ? "bg-golden-500 text-dark-950 border-2 border-golden-300 shadow-lg scale-[1.02]"
                  : "bg-dark-800 text-gray-300 border border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="space-y-1">
                <Printer className={`w-5 h-5 mx-auto ${selectedProduct === "impresa" ? "text-dark-950" : "text-amber-400"}`} />
                <p className="text-[11px] font-black uppercase">Impresa</p>
                <span className="text-[9px] block leading-tight font-medium opacity-90">
                  Papel Fotográfico
                </span>
              </div>
              <p className="text-sm font-black pt-1">₡3,500</p>
            </button>

            {/* 3. Retablos o Canvas */}
            <button
              type="button"
              onClick={() => setSelectedProduct("retablo_canvas")}
              className={`p-3 rounded-2xl text-center space-y-1 transition-all flex flex-col justify-between ${
                selectedProduct === "retablo_canvas"
                  ? "bg-golden-500 text-dark-950 border-2 border-golden-300 shadow-lg scale-[1.02]"
                  : "bg-dark-800 text-gray-300 border border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="space-y-1">
                <Frame className={`w-5 h-5 mx-auto ${selectedProduct === "retablo_canvas" ? "text-dark-950" : "text-emerald-400"}`} />
                <p className="text-[11px] font-black uppercase">Retablos / Canvas</p>
                <span className="text-[9px] block leading-tight font-medium opacity-90">
                  Madera o Lienzo
                </span>
              </div>
              <p className="text-xs font-black pt-1">Consultar</p>
            </button>
          </div>
        </div>

        {/* Nota Pedagógica Técnica */}
        <div className="p-3.5 rounded-2xl bg-dark-950/90 border border-golden-500/30 space-y-2 text-xs text-gray-300">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Importante sobre la calidad:</strong> La fotografía publicada en la web y redes sociales está configurada para pantallas con logos. <strong>Para impresión o archivo máster</strong>, Curiol Studio prepara el archivo original en alta resolución (300 DPI) con ajuste de color e <strong className="text-emerald-400">impresión limpia sin logos</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-gray-800/80 text-[11px] text-golden-300">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tarifa especial de convenio: un porcentaje apoya a la Academia.</span>
          </div>
        </div>

        {/* Botón de Pedido WhatsApp a Curiol Studio */}
        <div className="pt-1 space-y-2">
          <button
            onClick={handleBuyWhatsApp}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Solicitar a Curiol Studio por WhatsApp (6060-2617)</span>
          </button>

          <p className="text-center text-[10px] sm:text-[11px] text-golden-300 font-bold tracking-wide">
            🤝 Convenio establecido entre Curiol Studio y Golden Sport Academy Santa Cruz
          </p>
        </div>
      </div>
    </div>
  );
}


