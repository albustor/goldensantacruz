"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag, Sparkles, Star } from "lucide-react";

export default function SouvenirStoreBanner() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-golden-950/50 via-dark-800 to-dark-800 border-2 border-golden-500/40 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
      <div className="space-y-3 text-center lg:text-left">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <div className="h-10 w-32 relative flex items-center justify-center">
            <Image
              src="/curiol-studio-transparent.png"
              alt="Curiol Studio"
              width={120}
              height={32}
              className="object-contain max-h-full max-w-full drop-shadow-[0_2px_8px_rgba(234,179,8,0.3)]"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-golden-500 text-dark-900 text-[10px] font-black uppercase shadow-md">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Tienda Oficial de Recuerdos</span>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
          Fotografías Profesionales & Recuerdos Familiares
        </h2>
        <p className="text-xs text-gray-300 max-w-xl">
          Imágenes oficiales de alta calidad para <strong>imanes de nevera</strong>, <strong>retablos en madera</strong>, <strong>cuadros canvas de alta gama</strong> o archivo digital HD con tarifa especial de convenio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 w-full lg:w-auto">
        {/* Digital HD Convenio */}
        <div className="px-4 py-3 rounded-2xl bg-dark-900 border border-golden-500/40 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Convenio Golden</span>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-golden-400 font-black text-base">₡2,500</span>
            <span className="text-gray-500 line-through text-xs">₡4,000</span>
          </div>
          <span className="text-[10px] text-gray-300">Archivo Digital HD</span>
        </div>

        {/* Imán Nevera */}
        <div className="px-4 py-3 rounded-2xl bg-dark-900 border border-golden-500/40 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-golden-400 block">Souvenir Favorito</span>
          <span className="text-golden-400 font-black text-base block">₡3,500</span>
          <span className="text-[10px] text-gray-300">Imán para Nevera</span>
        </div>

        {/* Retablos o Canvas */}
        <div className="px-4 py-3 rounded-2xl bg-dark-900 border border-golden-500/40 text-center space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Madera & Canvas</span>
          <span className="text-golden-400 font-black text-base block">Consultar</span>
          <span className="text-[10px] text-gray-300">Retablos o Canvas</span>
        </div>
      </div>
    </div>
  );
}
