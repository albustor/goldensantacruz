"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, X, Sparkles, Camera } from "lucide-react";

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-72 bg-dark-900 border border-golden-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                WhatsApp Oficial Golden
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-300">
            Teléfono: <strong className="text-emerald-400">6280-6989</strong> (Santa Bárbara, Santa Cruz)
          </p>

          <div className="space-y-2 text-xs">
            <a
              href="https://wa.me/50662806989?text=Hola,%20quisiera%20información%20para%20inscribir%20a%20mi%20hijo(a)%20en%20Golden%20Sport%20Academy%20Santa%20Cruz"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-xl bg-dark-800 hover:bg-golden-500/10 hover:text-golden-300 border border-gray-700/60 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-golden-400 shrink-0" />
              <span>Información de Matrícula</span>
            </a>

            <a
              href="https://wa.me/50662806989?text=Hola,%20deseo%20enviar%20el%20comprobante%20de%20pago%20de%20mensualidad%20de%20mi%20hijo(a)"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-xl bg-dark-800 hover:bg-golden-500/10 hover:text-golden-300 border border-gray-700/60 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Enviar Comprobante Sinpe</span>
            </a>

            <a
              href="https://wa.me/50662806989?text=Hola,%20deseo%20información%20sobre%20patrocinios%20con%20Jenny%20y%20recuerdos%20de%20Curiol%20Studio"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-xl bg-dark-800 hover:bg-golden-500/10 hover:text-golden-300 border border-gray-700/60 transition-colors"
            >
              <Camera className="w-4 h-4 text-golden-400 shrink-0" />
              <span>Patrocinios & Curiol Studio</span>
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Atención por WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-950/60 hover:scale-105 active:scale-95 transition-all group border-2 border-emerald-400/40"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <Phone className="w-5 h-5 text-white" />
        <span className="font-bold text-xs uppercase tracking-wider hidden sm:inline-block">
          WhatsApp: 6280-6989
        </span>
      </button>
    </div>
  );
}
