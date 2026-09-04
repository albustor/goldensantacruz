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
  FileCheck,
  Trophy,
  Users
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
          Promocione su negocio y apoye al deporte infantil con pauta publicitaria en partidos oficiales, lonas en la zona de entrenamiento, difusión digital de Curiol Studio y presencia en uniformes.
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
            Impulso Comercial & Formativo para la Academia
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            "En <strong>Golden Sport Academy Santa Cruz</strong> formamos atletas y brindamos desarrollo integral a niños y jóvenes. Nuestro modelo de pauta publicitaria está diseñado para brindar gran retorno y visibilidad a su negocio en cada partido oficial y en las actividades formativas, con planes accesibles y coordinados directamente."
          </p>
          <p className="text-xs text-golden-400 font-bold">
            — Yorleny (Lenny) Monge Soto • Entrenadora & Encargada del Proyecto
          </p>
        </div>
      </section>

      {/* 3. MODALIDADES DE PAUTA PUBLICITARIA (ENFOCADA EN PARTIDOS Y APOYO FORMATIVO) */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
            Modalidades de Pauta & Exposición
          </h2>
          <p className="text-xs text-gray-400 max-w-xl mx-auto">
            Opciones dinámicas y accesibles por partido oficial, apoyo formativo mensual o temporada completa:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Modalidad 1: Pauta por Partido Oficial / Fogueo */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-golden-500 shadow-2xl shadow-golden-500/25 flex flex-col justify-between space-y-5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-golden-500 text-dark-950 text-[10px] font-black uppercase">
              Modelo Recomendado
            </div>
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black px-2.5 py-1 rounded bg-golden-500/20 text-golden-400 uppercase flex items-center gap-1.5 w-fit">
                <Trophy className="w-3.5 h-3.5" />
                Por Encuentro Oficial
              </span>
              <h3 className="text-xl font-black text-white">Pauta por Partido / Evento</h3>
              <p className="text-xs text-gray-300">
                Presencia de marca en los días clave de juego, con cobertura fotográfica y difusión digital directa.
              </p>
              <ul className="space-y-2 text-xs text-gray-200 pt-2 border-t border-gray-700">
                <li>• <strong>Logo de su empresa en las fotos de difusión oficial de Curiol Studio</strong></li>
                <li>• <strong>Lona publicitaria colocada en la zona de entrenamiento</strong> durante el día del juego</li>
                <li>• Mención de su marca en la crónica y avisos digitales del partido vía WhatsApp y redes</li>
                <li>• Tarifa accesible por encuentro o paquete de fogueos</li>
              </ul>
            </div>
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20consultar%20sobre%20la%20Pauta%20por%20Partido%20Oficial%20para%20mi%20empresa"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-center font-black text-xs uppercase text-dark-950 shadow-lg transition-all"
            >
              Consultar Pauta por Partido
            </a>
          </div>

          {/* Modalidad 2: Aliado Formativo Mensual */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-gray-800 flex flex-col justify-between space-y-5 shadow-lg">
            <div className="space-y-3">
              <span className="text-xs font-black px-2.5 py-1 rounded bg-amber-900/30 text-amber-400 uppercase flex items-center gap-1.5 w-fit">
                <Heart className="w-3.5 h-3.5" />
                Aporte Formativo
              </span>
              <h3 className="text-xl font-black text-white">Aliado Mensual de la Academia</h3>
              <p className="text-xs text-gray-300">
                Apoyo mensual accesible destinado a implementos deportivos (balones, conos, hidratación y botiquín).
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-gray-800">
                <li>• Logo en el directorio comercial y de patrocinadores del Web App</li>
                <li>• Botón directo a su WhatsApp de ventas en la plataforma</li>
                <li>• Agradecimiento institucional mensual en comunicados oficiales</li>
                <li>• Aporte voluntario y accesible adaptado a su negocio</li>
              </ul>
            </div>
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20apoyar%20como%20Aliado%20Formativo%20Mensual%20a%20Golden%20Sport%20Academy"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-center font-bold text-xs uppercase text-gray-200 transition-colors border border-gray-700"
            >
              Consultar Apoyo Mensual
            </a>
          </div>

          {/* Modalidad 3: Marca en Uniformes & Temporada */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-gray-800 flex flex-col justify-between space-y-5 shadow-lg">
            <div className="space-y-3">
              <span className="text-xs font-black px-2.5 py-1 rounded bg-gray-700 text-gray-200 uppercase flex items-center gap-1.5 w-fit">
                <Shirt className="w-3.5 h-3.5" />
                Presencia de Temporada
              </span>
              <h3 className="text-xl font-black text-white">Uniformes & Torneos</h3>
              <p className="text-xs text-gray-300">
                Estampado de su logotipo en indumentaria oficial y camisetas de entrenamiento para giras y torneos.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-gray-800">
                <li>• Logotipo en la indumentaria oficial de juego de los atletas</li>
                <li>• Presencia en torneos cantonales y provinciales de Guanacaste</li>
                <li>• Banner destacado en la sección oficial de patrocinadores</li>
                <li>• Exposición permanente durante toda la temporada</li>
              </ul>
            </div>
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20información%20sobre%20patrocinio%20en%20Uniformes%20y%20Temporada"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-center font-bold text-xs uppercase text-gray-200 transition-colors border border-gray-700"
            >
              Consultar Uniformes
            </a>
          </div>

        </div>
      </section>

      {/* 4. BANNER SOLIDARIO: PROGRAMA DE PADRINOS & BECAS DEPORTIVAS */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-dark-900 to-amber-950/40 border-2 border-golden-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-golden-500/20 text-golden-400 text-[11px] font-black uppercase">
            <Heart className="w-3.5 h-3.5" />
            <span>Responsabilidad Social & Apadrinamiento</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
            ¿Deseas apoyar con una <span className="text-golden-400">Beca Deportiva a un Niño(a)</span>?
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
            Además de la pauta comercial, contamos con el <strong>Programa Padrino Golden</strong> para becar mensualidades (100% o 60/40), uniformes y giras a jóvenes en condición vulnerable de Santa Cruz, con un contrato de corresponsabilidad y trabajo comunitario de las familias.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/informacion#padrinos"
            className="px-6 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
          >
            <span>Ver Programa de Becas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20apoyar%20como%20Padrino%20con%20una%20Beca%20Deportiva"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-emerald-400 font-bold text-xs uppercase flex items-center gap-1.5 border border-emerald-800/40"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </section>

      {/* 5. CONDICIONES CLARAS & ACUERDO PUBLICITARIO */}
      <section className="rounded-3xl bg-dark-900 border border-gray-800 p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <FileCheck className="w-5 h-5 text-golden-500" />
          <h2 className="text-lg font-black text-white uppercase">
            Condiciones del Servicio Publicitario
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-1.5">
            <span className="font-bold text-golden-400 block">1. Flexibilidad por Evento o Mensualidad</span>
            <p className="text-gray-300 leading-relaxed">
              La pauta por partido se activa específicamente para cada encuentro oficial programado, optimizando la inversión comercial de su negocio.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-1.5">
            <span className="font-bold text-golden-400 block">2. Vallas y Lonas Publicitarias</span>
            <p className="text-gray-300 leading-relaxed">
              Las lonas comerciales se instalan en la zona de entrenamiento para los eventos y partidos acordados, garantizando visibilidad ante los asistentes y familias.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-1.5">
            <span className="font-bold text-golden-400 block">3. Difusión Visual Profesional</span>
            <p className="text-gray-300 leading-relaxed">
              El logotipo de su empresa se integra en los artes digitales de difusión de partidos y publicaciones comunitarias realizadas por Curiol Studio.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 space-y-1.5">
            <span className="font-bold text-golden-400 block">4. Coordinación Directa y Transparente</span>
            <p className="text-gray-300 leading-relaxed">
              Toda propuesta y acuerdo comercial se coordina directamente con la entrenadora Lenny Monge, asegurando una atención personalizada y cercana.
            </p>
          </div>
        </div>

        {/* Botón de Contacto */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800">
          <span className="text-xs text-gray-400 text-center sm:text-left">
            Coordinación y cotización directa con la entrenadora <strong>Yorleny (Lenny) Monge Soto</strong>
          </span>
          <a
            href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20consultar%20opciones%20de%20pauta%20publicitaria%20con%20Golden%20Sport%20Academy%20Santa%20Cruz"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 text-dark-950 font-black text-xs uppercase flex items-center gap-2 shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>Consultar por WhatsApp: 6280-6989</span>
          </a>
        </div>
      </section>
    </div>
  );
}
