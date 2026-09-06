"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag, Sparkles, Star } from "lucide-react";

export default function SouvenirStoreBanner() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-golden-950/50 via-dark-800 to-dark-800 border-2 border-golden-500/40 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
      <div className="space-y-3 text-center lg:text-left">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-dark-950 border-2 border-golden-500/50 p-1 flex items-center justify-center shrink-0 shadow-lg">
            <Image
              src="/curiol-studio-transparent.png"
              alt="Curiol Studio"
              width={44}
              height={44}
              className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(234,179,8,0.3)]"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 w-full lg:w-auto">
        {/* Digital HD */}
        <div className="px-5 py-3.5 rounded-2xl bg-dark-900 border border-golden-500/40 text-center space-y-0.5 shadow-md">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Formato Oficial</span>
          <span className="text-golden-400 font-black text-lg block">₡3,500</span>
          <span className="text-[10px] text-gray-300">Fotografías Digitales HD</span>
        </div>

        {/* Retablos o Canvas */}
        <div className="px-5 py-3.5 rounded-2xl bg-dark-900 border border-golden-500/40 text-center space-y-0.5 shadow-md">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Recuerdo Físico</span>
          <span className="text-golden-400 font-black text-lg block">₡3,500</span>
          <span className="text-[10px] text-gray-300">Retablos o Canvas</span>
        </div>
      </div>
    </div>
  );
}
