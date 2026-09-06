"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag, Sparkles, MessageCircle, ShieldCheck, HeartHandshake, Megaphone, Download, FileImage, Printer, Frame } from "lucide-react";

export default function SouvenirStoreBanner() {
  const whatsappCuriol = "https://wa.me/50660602617?text=" + encodeURIComponent(
    "📸 *CONSULTA DE FOTOGRAFÍAS Y SOUVENIRS - CURIOL STUDIO*\n\n¡Hola Alberto / Curiol Studio!\n\nMe gustaría consultar sobre las fotografías oficiales y recuerdos de Golden Sport Academy Santa Cruz (Digitales HD ₡3,500 / Impresas ₡3,500 / Retablos o Canvas a cotizar)."
  );

  const whatsappSponsors = "https://wa.me/50660602617?text=" + encodeURIComponent(
    "📢 *ESPACIO PUBLICITARIO Y PATROCINIO - GOLDEN SPORT ACADEMY*\n\n¡Hola! Me interesa conocer las opciones para que mi empresa / marca aparezca en las galerías oficiales y transmisiones del equipo."
  );

  return (
    <div className="space-y-4">
      {/* Banner Principal de Tienda y Convenio */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-dark-900 via-dark-850 to-golden-950/40 border-2 border-golden-500/40 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-dark-950 border-2 border-golden-500/50 p-1 flex items-center justify-center shrink-0 shadow-lg">
                <Image
                  src="/curiol-studio-transparent.png"
                  alt="Curiol Studio"
                  width={44}
                  height={44}
                  className="object-contain w-full h-full drop-shadow-[0_2px_8px_rgba(234,179,8,0.3)]"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-golden-500 text-dark-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Tienda Oficial • Curiol Studio & Golden Sport Academy</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Convenio de Apoyo al Equipo</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Fotografías Oficiales en Alta Definición & Recuerdos de Colección
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              La fotografía publicada en redes sociales y en este espacio está utilizada para <strong>internet y web (descarga gratuita con logos)</strong>. 
              <strong> Para impresión</strong> se realiza un 
              <span className="text-golden-400 font-semibold"> proceso adicional de ajuste, configuración y tratamiento de color</span>, 
              utilizando el archivo original en <strong>alta resolución (300+ DPI) y calidad de imprenta</strong>. 
              La fotografía se prepara de forma diferente y <strong className="text-emerald-400">se entrega limpia sin marcas ni logos</strong>. Todo lo que es descarga o encargo en HD se solicita a <strong>Curiol Studio</strong>.
            </p>
          </div>

          {/* Tarjetas de Precios y Formatos de Convenio */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 w-full lg:w-auto">
            {/* 1. Descarga Web con Logos */}
            <div className="p-3 rounded-2xl bg-dark-950/80 border border-gray-800 text-center space-y-1 shadow-md flex flex-col justify-between">
              <div>
                <Download className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">Web / Redes</span>
                <span className="text-white font-black text-lg block">GRATIS</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-300 block">Con Logos</span>
                <span className="text-[8px] text-gray-500 block">Descarga directa</span>
              </div>
            </div>

            {/* 2. Digital HD Sin Logos */}
            <div className="p-3 rounded-2xl bg-dark-950/90 border border-golden-500/40 text-center space-y-1 shadow-lg hover:border-golden-400 transition-colors flex flex-col justify-between">
              <div>
                <FileImage className="w-4 h-4 mx-auto text-golden-400 mb-1" />
                <span className="text-[9px] uppercase font-bold text-emerald-400 block tracking-wider">Digital HD</span>
                <span className="text-golden-400 font-black text-lg block">₡3,500</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-white block">Sin Logos</span>
                <span className="text-[8px] text-gray-400 block">Máster 300 DPI</span>
              </div>
            </div>

            {/* 3. Impresa Profesional Sin Logos */}
            <div className="p-3 rounded-2xl bg-dark-950/90 border border-golden-500/40 text-center space-y-1 shadow-lg hover:border-golden-400 transition-colors flex flex-col justify-between">
              <div>
                <Printer className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <span className="text-[9px] uppercase font-bold text-amber-300 block tracking-wider">Impresa</span>
                <span className="text-golden-400 font-black text-lg block">₡3,500</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-white block">Sin Logos</span>
                <span className="text-[8px] text-gray-400 block">Papel fotográfico</span>
              </div>
            </div>

            {/* 4. Retablos o Canvas */}
            <div className="p-3 rounded-2xl bg-dark-950/90 border border-golden-500/40 text-center space-y-1 shadow-lg hover:border-golden-400 transition-colors flex flex-col justify-between">
              <div>
                <Frame className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                <span className="text-[9px] uppercase font-bold text-emerald-300 block tracking-wider">Retablos / Canvas</span>
                <span className="text-golden-400 font-black text-sm block pt-1">Consultar</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-white block">Sin Logos</span>
                <span className="text-[8px] text-gray-400 block">Madera o lienzo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Explicación Pedagógica del Proceso y Convenio */}
        <div className="pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-dark-950/50 border border-gray-800">
            <ShieldCheck className="w-5 h-5 text-golden-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Calidad de Impresión Profesional</strong>
              <span>No se imprime la foto de internet. Cada fotografía se exporta en su archivo RAW/máster con tratamiento de color para acabados perfectos.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-dark-950/50 border border-gray-800">
            <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Convenio de Apoyo a la Academia</strong>
              <span>Un porcentaje de cada fotografía o recuerdo vendido se destina como aporte económico directo para el desarrollo deportivo de Golden Sport Academy.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-dark-950/50 border border-gray-800">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold mb-0.5">Entrega Limpia sin Logos</strong>
              <span>Las fotos de muestra web llevan logos de difusión. Tu compra se entrega limpia, nítida y lista para enmarcar en tu hogar.</span>
            </div>
          </div>
        </div>

        {/* Botón de Contacto Directo WhatsApp */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-gray-400 text-center sm:text-left">
            <span>Atención personalizada y pedidos con <strong>Curiol Studio</strong>:</span>
          </div>
          <a
            href={whatsappCuriol}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar o Encargar por WhatsApp (6060-2617)</span>
          </a>
        </div>
      </div>

      {/* Banner de Invitación a Patrocinadores / Publicidad */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-golden-950/30 border border-golden-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-golden-500/10 border border-golden-500/30 flex items-center justify-center shrink-0 text-golden-400">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
              ¿Desea que su marca o empresa apoye a nuestro equipo?
            </h4>
            <p className="text-[11px] text-gray-400">
              Su publicidad puede estar presente aquí en nuestras galerías oficiales y transmisiones. Apoye el talento deportivo de Santa Cruz.
            </p>
          </div>
        </div>
        <a
          href={whatsappSponsors}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 px-4 py-2 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Anunciar Aquí</span>
        </a>
      </div>
    </div>
  );
}


