"use client";

import React from "react";
import Image from "next/image";
import { MessageCircle, Download, FileImage, Printer, Frame, TreeDeciduous } from "lucide-react";

interface Props {
  arbolUrl?: string;
}

export default function SouvenirStoreBanner({ arbolUrl = "https://www.curiol.studio/linea-de-tiempo/golden-academy-santa-cruz" }: Props) {
  const whatsappCuriol = "https://wa.me/50660602617?text=" + encodeURIComponent(
    "📸 *CONSULTA DE FOTOGRAFÍAS Y RECUERDOS - CURIOL STUDIO*\n\n¡Hola Alberto / Curiol Studio!\n\nMe gustaría consultar sobre las fotografías oficiales y recuerdos de Golden Sport Academy Santa Cruz (Digitales HD ₡2,500 / Impresas ₡3,500 / Retablos en madera o Canvas)."
  );

  return (
    <div className="mt-8 pt-4 border-t border-gray-800/80 space-y-3">
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-golden-500/30 shadow-xl space-y-3.5">
        
        {/* Cabecera Minimalista */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-dark-950 border border-golden-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
              <Image
                src="/curiol-studio-transparent.png"
                alt="Curiol Studio"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                  Curiol Studio • Fotografía Oficial & Recuerdos
                </h3>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                  Convenio Deportivo
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Fotos HD limpias sin marcas para impresión o cuadros. Cada encargo apoya el desarrollo del equipo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <a
              href={arbolUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
            >
              <TreeDeciduous className="w-3.5 h-3.5" />
              <span>Árbol Guanacaste ↗</span>
            </a>
            <a
              href={whatsappCuriol}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-[11px] uppercase flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Curiol</span>
            </a>
          </div>
        </div>

        {/* 4 Opciones Claras y Minimalistas de Precios */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2.5 rounded-xl bg-dark-950/70 border border-gray-800 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-[9px] uppercase font-bold text-gray-400">
              <Download className="w-3 h-3 text-gray-400" />
              <span>Web / Redes</span>
            </div>
            <div className="text-white font-black text-sm">GRATIS</div>
            <div className="text-[9px] text-gray-400">Con logos</div>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-950/80 border border-golden-500/30 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-[9px] uppercase font-bold text-golden-400">
              <FileImage className="w-3 h-3 text-golden-400" />
              <span>Digital HD</span>
            </div>
            <div className="text-golden-400 font-black text-sm">₡2,500</div>
            <div className="text-[9px] text-gray-300">Limpia • 300 DPI</div>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-950/80 border border-golden-500/30 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-[9px] uppercase font-bold text-amber-400">
              <Printer className="w-3 h-3 text-amber-400" />
              <span>Impresa Pro</span>
            </div>
            <div className="text-golden-400 font-black text-sm">₡3,500</div>
            <div className="text-[9px] text-gray-300">Papel fotográfico</div>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-950/80 border border-emerald-500/30 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-[9px] uppercase font-bold text-emerald-400">
              <Frame className="w-3 h-3 text-emerald-400" />
              <span>Retablos / Canvas</span>
            </div>
            <div className="text-emerald-400 font-black text-sm">A Cotizar</div>
            <div className="text-[9px] text-gray-300">Madera o lienzo</div>
          </div>
        </div>

      </div>
    </div>
  );
}


