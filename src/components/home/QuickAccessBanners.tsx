"use client";

import React from "react";
import Link from "next/link";
import { 
  DollarSign, 
  Heart, 
  Megaphone, 
  ExternalLink, 
  ArrowRight, 
  Sparkles,
  TreePine
} from "lucide-react";

export default function QuickAccessBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Encabezado de Pilares */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/15 text-golden-400 text-xs font-black uppercase border border-golden-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pilares Institucionales • Golden Sport Academy Santa Cruz</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
          Información Clave & <span className="text-golden-500">Acceso Rápido</span>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
          Acceda de forma transparente a nuestras cuotas de entrenamiento, galería fotográfica oficial, opciones de pauta publicitaria y la memoria histórica de la academia.
        </p>
      </div>

      {/* Grid de 4 Banners / Tarjetas Interactivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Mensualidad Formativa */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-emerald-500/40 hover:border-emerald-500 transition-all flex flex-col justify-between space-y-4 shadow-xl group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">
                Inversión Formativa
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-white uppercase group-hover:text-emerald-300 transition-colors">
              Cuota Mensual
            </h3>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-golden-400">₡10,000</span>
              <span className="text-xs text-gray-400">/ mes</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Cubre todas las sesiones formativas del mes bajo la dirección técnica certificada por <strong>FECOBA</strong>.
            </p>
          </div>
          <Link
            href="/informacion"
            className="w-full py-2.5 px-4 rounded-xl bg-dark-950 hover:bg-dark-800 text-emerald-400 font-bold text-xs uppercase flex items-center justify-between border border-emerald-800/40 transition-colors"
          >
            <span>Ver Detalles & Cuotas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Galería Fotográfica & Recuerdos */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-golden-500/50 hover:border-golden-400 transition-all flex flex-col justify-between space-y-4 shadow-xl group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-golden-500/20 text-golden-400 border border-golden-500/30">
                Fotografía Oficial
              </span>
              <div className="w-8 h-8 rounded-xl bg-golden-500/20 text-golden-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-white uppercase group-hover:text-golden-300 transition-colors">
              Galería Deportiva
            </h3>
            <p className="text-xs font-bold text-golden-400">
              Curiol Studio & Familias
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Álbumes oficiales en alta definición, recuerdos de partidos y descargas para toda la comunidad de la academia.
            </p>
          </div>
          <Link
            href="/galeria"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs uppercase flex items-center justify-between shadow-md transition-all"
          >
            <span>Ver Galería</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Pauta Publicitaria por Partidos */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-amber-500/40 hover:border-amber-400 transition-all flex flex-col justify-between space-y-4 shadow-xl group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-900/40 text-amber-400 border border-amber-500/30">
                Comercio Local
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-white uppercase group-hover:text-amber-300 transition-colors">
              Pauta por Partido
            </h3>
            <p className="text-xs font-bold text-amber-400">
              Visibilidad por Encuentro
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Logo en fotos de Curiol Studio, crónica en WhatsApp/redes y lona en la zona de entrenamiento el día del juego.
            </p>
          </div>
          <Link
            href="/patrocinadores"
            className="w-full py-2.5 px-4 rounded-xl bg-dark-950 hover:bg-dark-800 text-amber-400 font-bold text-xs uppercase flex items-center justify-between border border-amber-800/40 transition-colors"
          >
            <span>Ver Opciones de Pauta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 4: Línea de Tiempo Curiol Studio */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-blue-500/40 hover:border-blue-400 transition-all flex flex-col justify-between space-y-4 shadow-xl group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-500/30">
                Memoria Histórica
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <TreePine className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-white uppercase group-hover:text-blue-300 transition-colors">
              Árbol de Guanacaste
            </h3>
            <p className="text-xs font-bold text-blue-400">
              Línea de Tiempo Curiol Studio
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              El archivo fotográfico oficial, hitos deportivos y producciones visuales de Golden Sport Academy Santa Cruz.
            </p>
          </div>
          <a
            href="https://www.curiol.studio/linea-de-tiempo/golden-academy-santa-cruz"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-dark-950 hover:bg-dark-800 text-blue-400 font-bold text-xs uppercase flex items-center justify-between border border-blue-800/40 transition-colors"
          >
            <span>Ver Línea de Tiempo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
