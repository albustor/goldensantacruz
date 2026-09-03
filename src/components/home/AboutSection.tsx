"use client";

import React from "react";
import Link from "next/link";
import { 
  Trophy, 
  MapPin, 
  Sparkles, 
  Users, 
  Camera, 
  Award, 
  ShieldCheck, 
  Target, 
  Heart, 
  Layers, 
  Flame, 
  ArrowRight, 
  Phone, 
  CheckCircle2,
  Navigation
} from "lucide-react";

export default function AboutSection() {
  return (
    <section id="informacion" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pt-8">
      
      {/* 1. CABECERA PRINCIPAL: CONOCE A GOLDEN SPORT ACADEMY SANTA CRUZ */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-golden-500/15 border border-golden-500/40 text-golden-400 text-xs font-black uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Información Institucional & Proyecto Deportivo</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
          Conoce a <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500">Golden Sport Academy Santa Cruz</span>
        </h2>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-dark-900 border border-golden-500/30 text-xs sm:text-sm font-bold text-gray-200 shadow-md">
          <MapPin className="w-4 h-4 text-golden-500 shrink-0" />
          <span>Cancha de Básquetbol de Santa Bárbara de Santa Cruz, Guanacaste</span>
        </div>

        <p className="text-xs sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed font-normal">
          Formación deportiva y desarrollo humano integral en baloncesto para niños y jóvenes desde <strong>menores de U8 hasta juvenil</strong>. Un proyecto liderado por la entrenadora <strong>Yorleny (Lenny) Monge Soto</strong>, con el respaldo fotográfico de <strong>Curiol Studio</strong> y la alianza deportiva con <strong>Golden Sport Academy Liberia</strong>.
        </p>
      </div>

      {/* 2. LOS 3 EJES CLAVE DEL PROYECTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Eje 1: Metodología de Entrenamiento */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border-2 border-golden-500/30 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-golden-500 text-dark-950 inline-block">
              Dirección Técnica
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase">
              Metodología & Procesos de Entrenamiento
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Dirigidos por la entrenadora <strong>Yorleny (Lenny) Monge Soto</strong>, las clases se estructuran por etapas pedagógicas: psicomotricidad en menores de U8, fundamentos tácticos en mini-básquetbol e intensificación técnica y física en juveniles.
            </p>
          </div>
          <div className="pt-3 border-t border-gray-800 text-[11px] text-golden-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disciplina, técnica individual y valores</span>
          </div>
        </div>

        {/* Eje 2: Rol de Curiol Studio */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border-2 border-golden-500/30 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-golden-500 text-dark-950 inline-block">
              Cobertura Visual
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase">
              Curiol Studio en las Clases & Partidos
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong>Curiol Studio</strong> realiza el acompañamiento fotográfico profesional en entrenamientos y fogueos. Captura momentos de acción en alta resolución para el archivo deportivo de los atletas y produce los recuerdos familiares oficiales (imanes para neveras y retablos).
            </p>
          </div>
          <div className="pt-3 border-t border-gray-800 text-[11px] text-golden-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Retratos HD y recuerdos familiares de por vida</span>
          </div>
        </div>

        {/* Eje 3: Respaldo Golden Sport Liberia */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border-2 border-golden-500/30 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-golden-500 text-dark-950 inline-block">
              Alianza Deportiva
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase">
              Respaldo Golden Sport Academy Liberia
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Contamos con el soporte metodológico y la hermandad deportiva de <strong>Golden Sport Academy Liberia</strong>. Esta alianza permite fogueos constantes intercantonales, intercambios de atletas, clínicas conjuntas y proyección provincial en Guanacaste.
            </p>
          </div>
          <div className="pt-3 border-t border-gray-800 text-[11px] text-golden-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sinergia provincial y fogueos competitivos</span>
          </div>
        </div>

      </div>

      {/* 3. SEDE CENTRAL: CANCHA DE BÁSQUETBOL DE SANTA BÁRBARA DE SANTA CRUZ (CON WAZE Y MAPS) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-2 border-golden-500/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-bold uppercase">
            <MapPin className="w-3.5 h-3.5" />
            <span>Sede Oficial de Entrenamiento</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
            Cancha de Básquetbol de Santa Bárbara de Santa Cruz
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
            Nuestra casa deportiva principal donde entrenamos todas las categorías (Menores U8 a Juvenil). Un espacio comunitario rescatado para la niñez y juventud de Santa Cruz, Guanacaste.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href="https://waze.com/ul?q=Santa+Barbara+Santa+Cruz+Guanacaste"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
          >
            <Navigation className="w-4 h-4" />
            <span>Cómo llegar en Waze</span>
          </a>
          <a
            href="https://maps.google.com/?q=Santa+Barbara+Santa+Cruz+Guanacaste"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-golden-400 font-bold text-xs uppercase flex items-center gap-2 border border-golden-500/30 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* 4. FORMACIÓN DEPORTIVA DESDE MENORES DE U8 HASTA JUVENIL (CATEGORÍAS OFICIALES) */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-golden-400 uppercase tracking-widest bg-golden-500/10 px-3 py-1 rounded-full border border-golden-500/20">
            Nuestras Categorías Oficiales
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Formación Deportiva desde <span className="text-golden-500">Menores de U8 hasta Juvenil</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Programas adaptados a cada etapa del desarrollo infantil y juvenil en Santa Bárbara de Santa Cruz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Menores U8 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-golden-500/40 hover:border-golden-500 transition-all space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500 text-dark-900">
                Menores de U8 (4 - 7 años)
              </span>
              <span className="text-2xl">🧸</span>
            </div>
            <h3 className="text-xl font-black text-white">Iniciación & Semillero U8</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Estimulación temprana de la psicomotricidad, familiarización lúdica con el balón, coordinación ojo-mano, equilibrio y primeros botes.
            </p>
            <div className="pt-2 text-xs font-semibold text-golden-400">
              Sábados 8:30 AM & Martes 4:00 PM • Santa Bárbara
            </div>
          </div>

          {/* Card 2: Mini U8-U10 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-gray-800 hover:border-golden-500/50 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500/20 text-golden-400">
                Edades 8 - 10 años
              </span>
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-black text-white">Mini-Básquetbol (U8 - U10)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Fundamentos de bote con ambas manos, pases precisos, mecánicas iniciales de tiro y aprendizaje de juego cooperativo.
            </p>
            <div className="pt-2 text-xs font-semibold text-golden-400">
              Martes y Jueves 4:30 PM • Santa Bárbara
            </div>
          </div>

          {/* Card 3: Infantil U12-U14 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-gray-800 hover:border-golden-500/50 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500/20 text-golden-400">
                Edades 11 - 14 años
              </span>
              <span className="text-2xl">🏀</span>
            </div>
            <h3 className="text-xl font-black text-white">Infantil (U12 - U14)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Perfeccionamiento técnico individual, tiro en suspensión, desmarque sin balón, defensa 1 contra 1 y transición rápida.
            </p>
            <div className="pt-2 text-xs font-semibold text-golden-400">
              Lunes, Miércoles y Viernes 4:30 PM
            </div>
          </div>

          {/* Card 4: Juvenil U16-U18 */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-gray-800 hover:border-golden-500/50 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500/20 text-golden-400">
                Edades 15 - 18 años
              </span>
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-xl font-black text-white">Juvenil (U16 - U18)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Entrenamiento de alta exigencia, acondicionamiento físico, esquemas tácticos de juego y fogueos intercantonales.
            </p>
            <div className="pt-2 text-xs font-semibold text-golden-400">
              Lunes a Viernes 5:30 PM
            </div>
          </div>

          {/* Card 5: Clínicas de Tiro */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border border-golden-500/30 hover:border-golden-500/60 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300">
                Especialización
              </span>
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-black text-white">Clínicas de Tecnificación & Tiro</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Talleres intensivos de biomecánica del tiro, toma de decisiones y clínica de fundamentos avanzados para todos los niveles.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-300">
              Sábados por la tarde (Convocatoria periódica)
            </div>
          </div>

          {/* Card 6: Curiol Studio Fotografía */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-golden-950/50 to-dark-900 border-2 border-golden-500/60 transition-all space-y-3 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-golden-500 text-dark-900 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  Curiol Studio
                </span>
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="text-xl font-black text-white mt-2">Cobertura Fotográfica</h3>
              <p className="text-xs text-gray-300 leading-relaxed mt-1">
                Sesiones oficiales y recuerdos familiares HD, marcos e imanes personalizados producidos por Curiol Studio.
              </p>
            </div>
            <Link
              href="/galeria"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase shadow-md transition-all hover:scale-105"
            >
              Ver Galería & Recuerdos
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
