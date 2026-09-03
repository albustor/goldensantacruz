"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Award, 
  Sparkles, 
  Camera, 
  Phone, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Star, 
  Target, 
  ArrowRight, 
  Megaphone, 
  Heart,
  Shirt,
  Calendar,
  Info,
  DollarSign,
  FileCheck
} from "lucide-react";
import { Sponsor } from "@/types";
import { Store } from "@/lib/store";

export default function PatrocinadoresPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    async function load() {
      const data = await Store.getSponsors();
      setSponsors(data.filter((s) => s.isActive));
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Header Directo y Claro */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-golden-500/15 border border-golden-500/40 text-golden-400 text-xs font-black uppercase tracking-wider">
          <Megaphone className="w-4 h-4" />
          <span>Espacio Oficial de Pauta Publicitaria • Golden Sport Academy Santa Cruz</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Pauta Publicitaria & <span className="text-golden-500">Exposición de Marca</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Servicio profesional de posicionamiento comercial para empresas locales y regionales en la Cancha de Santa Bárbara, uniformes anuales, Web App y fotos de difusión.
        </p>
      </div>

      {/* 2. Mensaje Institucional de la Entrenadora Lenny Monge */}
      <section className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-2 border-golden-500/40 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-dark-950 border-2 border-golden-500 flex items-center justify-center font-black text-golden-400 text-2xl shrink-0 shadow-lg">
          LM
        </div>
        <div className="space-y-2 text-center md:text-left flex-1">
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-golden-500 text-dark-950">
            Dirección Deportiva
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
            Impulso Comercial para la Academia
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            "En <strong>Golden Sport Academy Santa Cruz</strong> formamos atletas y brindamos desarrollo integral a niños y jóvenes en la cancha de Santa Bárbara. La venta de publicidad es un servicio comercial formal que ofrece alta visibilidad a su negocio y capta recursos para sostener nuestra labor formativa."
          </p>
          <p className="text-xs text-golden-400 font-bold">
            — Yorleny (Lenny) Monge Soto • Entrenadora & Encargada del Proyecto
          </p>
        </div>
      </section>

      {/* 3. PLANES DE PAUTA COMERCIAL (ORO, PLATA, BRONCE) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
            Planes de Pauta Publicitaria
          </h2>
          <p className="text-xs text-gray-400">
            Elija la opción mensual o aproveche la tarifa trimestral con ahorro directo:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan Bronce: ₡50,000 / mes */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-gray-800 flex flex-col justify-between space-y-5 shadow-lg">
            <div className="space-y-3">
              <span className="text-xs font-black px-2.5 py-1 rounded bg-amber-900/30 text-amber-400 uppercase">
                Paquete Bronce
              </span>
              <h3 className="text-xl font-black text-white">Comercio Amigo</h3>
              <div className="space-y-0.5">
                <p className="text-3xl font-black text-golden-400">₡50,000 <span className="text-xs text-gray-400 font-normal">/ mes</span></p>
                <p className="text-xs font-semibold text-emerald-400">₡135,000 / trimestre <span className="text-[10px] text-gray-400 font-normal">(Ahorro de ₡15,000)</span></p>
              </div>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-gray-800">
                <li>• Logo en directorio comercial de la Web App</li>
                <li>• Botón directo a su WhatsApp de ventas</li>
                <li>• Mención mensual en avisos oficiales de la academia</li>
              </ul>
            </div>
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20contratar%20el%20Paquete%20Bronce%20(₡50,000/mes)%20para%20mi%20empresa"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-center font-bold text-xs uppercase text-gray-200 transition-colors border border-gray-700"
            >
              Contratar Bronce
            </a>
          </div>

          {/* Plan Oro (Principal): ₡100,000 / mes */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-golden-500 shadow-2xl shadow-golden-500/25 flex flex-col justify-between space-y-5 relative scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-golden-500 text-dark-950 text-[10px] font-black uppercase">
              Máxima Exposición
            </div>
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black px-2.5 py-1 rounded bg-golden-500/20 text-golden-400 uppercase">
                Paquete Oro Principal
              </span>
              <h3 className="text-xl font-black text-white">Patrocinador Oficial</h3>
              <div className="space-y-0.5">
                <p className="text-3xl font-black text-golden-400">₡100,000 <span className="text-xs text-gray-400 font-normal">/ mes</span></p>
                <p className="text-xs font-semibold text-emerald-400">₡270,000 / trimestre <span className="text-[10px] text-gray-400 font-normal">(Ahorro de ₡30,000)</span></p>
              </div>
              <ul className="space-y-2 text-xs text-gray-200 pt-2 border-t border-gray-700">
                <li>• <strong>Lona publicitaria grande en Cancha de Santa Bárbara</strong></li>
                <li>• <strong>Logo en fotos de difusión pública en Web App y redes</strong></li>
                <li>• <strong>Banner oficial destacado en Home, Partidos y Galería</strong></li>
                <li>• Reserva de logo en la confección anual de uniformes oficiales (julio)</li>
                <li>• Mención de marca en premiaciones y clausuras oficiales</li>
              </ul>
            </div>
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20contratar%20el%20Paquete%20Oro%20(₡100,000/mes)%20para%20mi%20empresa"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-center font-black text-xs uppercase text-dark-950 shadow-lg transition-all"
            >
              Quiero ser Patrocinador Oro
            </a>
          </div>

          {/* Plan Plata: ₡80,000 / mes */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-gray-800 flex flex-col justify-between space-y-5 shadow-lg">
            <div className="space-y-3">
              <span className="text-xs font-black px-2.5 py-1 rounded bg-gray-700 text-gray-200 uppercase">
                Paquete Plata
              </span>
              <h3 className="text-xl font-black text-white">Aliado Estratégico</h3>
              <div className="space-y-0.5">
                <p className="text-3xl font-black text-golden-400">₡80,000 <span className="text-xs text-gray-400 font-normal">/ mes</span></p>
                <p className="text-xs font-semibold text-emerald-400">₡215,000 / trimestre <span className="text-[10px] text-gray-400 font-normal">(Ahorro de ₡25,000)</span></p>
              </div>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-gray-800">
                <li>• Logo en publicaciones seleccionadas de difusión digital</li>
                <li>• Banner secundario en la Web App y redes sociales</li>
                <li>• Opción en la renovación anual de camisetas de práctica</li>
              </ul>
            </div>
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20contratar%20el%20Paquete%20Plata%20(₡80,000/mes)%20para%20mi%20empresa"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-center font-bold text-xs uppercase text-gray-200 transition-colors border border-gray-700"
            >
              Contratar Plata
            </a>
          </div>
        </div>
      </section>

      {/* 4. ACUERDO DE PAUTA PUBLICITARIA & CONDICIONES CLARAS */}
      <section className="rounded-3xl bg-dark-900 border border-gray-800 p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <FileCheck className="w-5 h-5 text-golden-500" />
          <h2 className="text-lg font-black text-white uppercase">
            Condiciones del Acuerdo Publicitario
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-1.5">
            <span className="font-bold text-golden-400 block">1. Pago Mensual & Preaviso de 15 Días</span>
            <p className="text-gray-300 leading-relaxed">
              Pago anticipado (del 1 al 5). Para suspender la pauta, se requiere un preaviso de 15 días antes del siguiente corte.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-1.5">
            <span className="font-bold text-golden-400 block">2. Lonas en Cancha de Santa Bárbara</span>
            <p className="text-gray-300 leading-relaxed">
              En caso de no renovación, la lona física se desmonta en 5 días hábiles y queda a disposición del comercio.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-1.5">
            <span className="font-bold text-golden-400 block">3. Uniformes Oficiales (Ciclo Julio)</span>
            <p className="text-gray-300 leading-relaxed">
              El estampado en el uniforme oficial de juego aplica en la compra anual (julio) para empresas con compromiso de temporada.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-1.5">
            <span className="font-bold text-golden-400 block">4. Fotos de Difusión Pública</span>
            <p className="text-gray-300 leading-relaxed">
              El logotipo se integra en las fotos de difusión comunitaria en web y redes (no incluye fotos privadas de recuerdos familiares).
            </p>
          </div>
        </div>

        {/* Botón de Contacto */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800">
          <span className="text-xs text-gray-400 text-center sm:text-left">
            Coordinación directa con la entrenadora <strong>Yorleny (Lenny) Monge Soto</strong>
          </span>
          <a
            href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20contratar%20pauta%20publicitaria%20con%20Golden%20Sport%20Academy%20Santa%20Cruz"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 text-dark-950 font-black text-xs uppercase flex items-center gap-2 shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>WhatsApp: 6280-6989</span>
          </a>
        </div>
      </section>
    </div>
  );
}
