"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  Navigation,
  Clock,
  ArrowLeft,
  BadgeCheck,
  MessageCircle,
  DollarSign,
  Car,
  Info
} from "lucide-react";

export default function InformacionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Botón Volver & Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-900 hover:bg-dark-800 text-golden-400 font-bold text-xs uppercase border border-golden-500/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>

        <div className="text-center space-y-4 max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-golden-500/15 border border-golden-500/40 text-golden-400 text-xs font-black uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Información Institucional & Proyecto Deportivo</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Conoce a <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500">Golden Sport Academy Santa Cruz</span>
          </h1>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-dark-900 border border-golden-500/30 text-xs sm:text-sm font-bold text-gray-200 shadow-md">
            <MapPin className="w-4 h-4 text-golden-500 shrink-0" />
            <span>Ubicación: Santa Bárbara de Santa Cruz, Guanacaste</span>
          </div>

          <p className="text-xs sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Formación deportiva y desarrollo humano integral en baloncesto para niños y jóvenes desde <strong>menores de U8 hasta juvenil</strong> en <strong>Golden Sport Academy Santa Cruz</strong>. Un proyecto liderado por la entrenadora <strong>Yorleny (Lenny) Monge Soto</strong> (certificada por <strong>FECOBA</strong>), con el respaldo fotográfico de <strong>Curiol Studio</strong> en partidos oficiales y la hermandad deportiva con <strong>Golden Sport Academy Liberia</strong>.
          </p>
        </div>
      </div>

      {/* 1. LOS 3 EJES CLAVE DEL PROYECTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Eje 1: Metodología de Entrenamiento con Certificación FECOBA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border-2 border-golden-500/40 space-y-4 shadow-xl flex flex-col justify-between hover:border-golden-400 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40">
              <Flame className="w-6 h-6" />
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-golden-500 text-dark-950 inline-block">
                Dirección Técnica
              </span>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 inline-flex items-center gap-1">
                <BadgeCheck className="w-3 h-3 text-blue-400" />
                <span>Certificada FECOBA</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white uppercase">
              Metodología & Procesos de Entrenamiento
            </h3>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              Dirigidos por la entrenadora <strong>Yorleny (Lenny) Monge Soto</strong>, profesional <strong>certificada por la Federación Costarricense de Baloncesto (FECOBA) para Mini-Baloncesto</strong>. Las clases se estructuran por etapas pedagógicas avaladas: psicomotricidad en menores de U8, fundamentos tácticos en mini-básquetbol e intensificación técnica y física en juveniles.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-800 text-[11px] text-golden-400 font-bold flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-golden-400 shrink-0" />
            <span>Entrenadora Oficial Certificada FECOBA en Mini-Baloncesto</span>
          </div>
        </div>

        {/* Eje 2: Rol de Curiol Studio (Partidos Oficiales) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border-2 border-golden-500/40 space-y-4 shadow-xl flex flex-col justify-between hover:border-golden-400 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40">
              <Camera className="w-6 h-6" />
            </div>
            
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-golden-500 text-dark-950 inline-block">
              Cobertura Visual
            </span>
            
            <h3 className="text-lg sm:text-xl font-black text-white uppercase">
              Curiol Studio en Partidos Oficiales
            </h3>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong>Curiol Studio</strong> realiza el acompañamiento fotográfico profesional en <strong>partidos oficiales y encuentros programados</strong> de Golden Sport Academy Santa Cruz. Captura momentos de acción en alta resolución para el archivo deportivo de los atletas y produce los recuerdos familiares oficiales (imanes para neveras, retablos de madera y cuadros canvas).
            </p>
          </div>
          
          <div className="pt-3 border-t border-gray-800 text-[11px] text-golden-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0" />
            <span>Retratos HD en partidos oficiales y recuerdos familiares</span>
          </div>
        </div>

        {/* Eje 3: Respaldo Golden Sport Academy Liberia */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border-2 border-golden-500/40 space-y-4 shadow-xl flex flex-col justify-between hover:border-golden-400 transition-all">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-golden-500/20 text-golden-400 flex items-center justify-center border border-golden-500/40">
              <Trophy className="w-6 h-6" />
            </div>
            
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-golden-500 text-dark-950 inline-block">
              Alianza Deportiva
            </span>
            
            <h3 className="text-lg sm:text-xl font-black text-white uppercase">
              Respaldo Golden Sport Academy Liberia
            </h3>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              Contamos con el soporte metodológico y la hermandad deportiva de <strong>Golden Sport Academy Liberia</strong>. Esta alianza permite fogueos constantes intercantonales, intercambios de atletas, clínicas conjuntas y proyección provincial en Guanacaste para <strong>Golden Sport Academy Santa Cruz</strong>.
            </p>
          </div>
          
          <div className="pt-3 border-t border-gray-800 text-[11px] text-golden-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0" />
            <span>Sinergia provincial y fogueos competitivos</span>
          </div>
        </div>

      </div>

      {/* 2. CUOTA MENSUAL FORMATIVA & GASTOS DE VIAJE A PARTIDOS */}
      <section className="rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-golden-500/50 p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-black uppercase">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Inversión Deportiva Clara & Transparente</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Mensualidad & <span className="text-golden-500">Compromiso Formativo</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Mantenemos un esquema de cuota accesible y transparente para que todos los niños y jóvenes tengan la oportunidad de entrenar baloncesto formativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta 1: Mensualidad Formativa Fija */}
          <div className="p-6 sm:p-8 rounded-2xl bg-dark-950 border border-golden-500/40 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">
                Cuota Mensual de Academia
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-golden-400">₡10,000</span>
                <span className="text-xs text-gray-400 font-semibold uppercase">/ mes por atleta</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed pt-1">
                La mensualidad cubre el proceso continuo de formación deportiva durante el mes calendario bajo la dirección técnica de la entrenadora <strong>Lenny Monge</strong>.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 pt-3 border-t border-gray-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0" />
                  <span>Todas las sesiones semanales de entrenamiento formativo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0" />
                  <span>Acompañamiento técnico certificado por FECOBA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0" />
                  <span>Uso de implementos deportivos y clínicas internas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0" />
                  <span>Pago mensual del 1 al 5 de cada mes vía Sinpe Móvil</span>
                </li>
              </ul>
            </div>
            <div className="pt-2 text-[11px] text-golden-400/90 font-semibold">
              Sinpe Móvil Oficial: 6280-6989 (Yorleny Monge Soto)
            </div>
          </div>

          {/* Tarjeta 2: Gastos de Transporte en Fogueos y Partidos */}
          <div className="p-6 sm:p-8 rounded-2xl bg-dark-950 border border-gray-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-blue-900/40 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit">
                <Car className="w-3.5 h-3.5" />
                Giras, Fogueos & Partidos
              </span>
              <h3 className="text-xl font-black text-white uppercase">
                Transporte & Salidas a Encuentros
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Para mantener la cuota mensual baja y justa, <strong>los gastos de transporte, buseta o combustible y viáticos para fogueos intercantonales</strong> (como viajes a Liberia u otros cantones) son independientes de la mensualidad.
              </p>
              <div className="p-3.5 rounded-xl bg-dark-900 border border-gray-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-golden-400 font-bold">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Organización por Evento:</span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  Cada salida a fogueo o partido oficial se coordina con anticipación con las familias para definir la logística de viaje compartida o transporte de forma transparente.
                </p>
              </div>
            </div>
            <div className="pt-2 text-[11px] text-gray-400">
              Coordinación y logística informada previamente por el grupo oficial de WhatsApp.
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROGRAMA SOLIDARIO: PADRINOS DEPORTIVOS & BECAS FORMATIVAS */}
      <section id="padrinos" className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-2 border-golden-500/50 p-6 sm:p-10 shadow-2xl space-y-10 scroll-mt-24">
        
        {/* Cabecera del Programa */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-black uppercase tracking-wider border border-golden-500/30">
            <Heart className="w-4 h-4 text-golden-400" />
            <span>Fondo Solidario • Semillero Golden Santa Cruz</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Programa de Padrinos & <span className="text-golden-500">Becas Deportivas</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
            En <strong>Golden Sport Academy Santa Cruz</strong> creemos firmemente que ningún niño o joven con talento y deseo de superación debe quedar fuera de la academia por limitaciones económicas. Unimos corazones solidarios con familias comprometidas bajo un esquema digno, participativo y de alta responsabilidad comunitaria.
          </p>
        </div>

        {/* Las 3 Modalidades de Becas / Apadrinamiento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Modalidad 1: Mensualidad Formativa (100% o 60/40) */}
          <div className="p-6 rounded-3xl bg-dark-950 border-2 border-golden-500/40 flex flex-col justify-between space-y-4 shadow-lg hover:border-golden-400 transition-all">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-golden-500/20 text-golden-400 border border-golden-500/30 inline-block">
                Beca Tipo 1 • Mensualidad
              </span>
              <h3 className="text-lg font-black text-white uppercase">
                Beca Formativa de Entrenamiento
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Cubre el proceso de clases semanales bajo dirección técnica certificada por FECOBA.
              </p>
              <div className="space-y-2 pt-2 border-t border-gray-800 text-xs">
                <div className="p-2.5 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                  <span className="font-bold text-golden-400 block text-[11px]">Opción A: Beca 100% Gratuita</span>
                  <p className="text-[11px] text-gray-300">El padrino aporta los ₡10,000/mes para estudiantes en condición de vulnerabilidad extrema.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
                  <span className="font-bold text-emerald-400 block text-[11px]">Opción B: Beca Co-Participativa 60/40</span>
                  <p className="text-[11px] text-gray-300">El padrino asume el <strong>60% (₡6,000)</strong> y la familia aporta un co-pago de <strong>40% (₡4,000)</strong> para fomentar asistencia constante.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modalidad 2: Padrino de Uniformes Oficiales */}
          <div className="p-6 rounded-3xl bg-dark-950 border-2 border-golden-500/40 flex flex-col justify-between space-y-4 shadow-lg hover:border-golden-400 transition-all">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block">
                Beca Tipo 2 • Indumentaria
              </span>
              <h3 className="text-lg font-black text-white uppercase">
                Padrino de Uniforme & Juego
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Apadrinamiento enfocado en la confección de la indumentaria oficial de competencia del atleta y sus camisetas de práctica.
              </p>
              <ul className="space-y-2 pt-2 border-t border-gray-800 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
                  <span>Uniforme completo de juego (pantaloneta y camiseta numerada oficial)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
                  <span>Garantiza identidad, pertenencia y presencia en torneos federados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
                  <span>Aporte único por temporada deportiva</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Modalidad 3: Padrino de Fogueos & Giras Intercantonales */}
          <div className="p-6 rounded-3xl bg-dark-950 border-2 border-golden-500/40 flex flex-col justify-between space-y-4 shadow-lg hover:border-golden-400 transition-all">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
                Beca Tipo 3 • Viajes & Giras
              </span>
              <h3 className="text-lg font-black text-white uppercase">
                Padrino de Fogueos & Representación
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Fondo especial para solventar el transporte (buseta/gasolina) y viáticos de atletas becados cuando jugamos en otros cantones.
              </p>
              <ul className="space-y-2 pt-2 border-t border-gray-800 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
                  <span>Cobertura de pasaje o cuota de viaje para fogueos (ej. salidas a Liberia)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
                  <span>Permite al atleta foguearse sin preocuparse por los gastos de traslado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-golden-400 shrink-0 mt-0.5" />
                  <span>Apoyo flexible por encuentro o evento programado</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Contrato de Corresponsabilidad Familiar & Comité de Padres */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-950 border-2 border-amber-500/30 space-y-4">
          <div className="flex items-center gap-2 text-golden-400 font-black uppercase text-sm border-b border-gray-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-golden-400" />
            <span>Contrato de Corresponsabilidad Familiar & Trabajo Comunitario</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Para garantizar que el beneficio sea formativo, digno y de mutuo crecimiento, toda familia beneficiaria de una beca asume un <strong>acuerdo formal de compromiso y participación comunitaria</strong> con la escuela y el Comité de Padres:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            <div className="p-3.5 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
              <span className="font-bold text-golden-400 block">1. Apoyo al Comité de Padres</span>
              <p className="text-[11px] text-gray-300">
                Integrarse y colaborar activamente en la organización de actividades pro-fondos, rifas, venta de refrigerios y logística en días de partido.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
              <span className="font-bold text-golden-400 block">2. Trabajo Comunal en la Sede</span>
              <p className="text-[11px] text-gray-300">
                Aporte voluntario de tiempo en la limpieza, acomodo de materiales y mantenimiento del espacio en la zona de entrenamiento cuando sea requerido.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-900 border border-gray-800 space-y-1">
              <span className="font-bold text-golden-400 block">3. Asistencia & Rendimiento</span>
              <p className="text-[11px] text-gray-300">
                Garantizar la puntualidad, asistencia constante a los entrenamientos y buen rendimiento académico escolar del atleta.
              </p>
            </div>
          </div>
        </div>

        {/* Botones de Acción Directa */}
        <div className="p-6 rounded-2xl bg-dark-950 border border-golden-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-black text-white uppercase block">
              ¿Deseas apoyar como Padrino o postular a un estudiante?
            </span>
            <p className="text-[11px] text-gray-400">
              Coordinación confidencial y transparente directamente con la entrenadora <strong>Lenny Monge</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20sumarme%20como%20Padrino%20Golden%20para%20apoyar%20a%20un%20atleta%20con%20una%20beca%20deportiva"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Quiero ser Padrino</span>
            </a>
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20consultar%20sobre%20la%20postulación%20a%20una%20Beca%20Deportiva%20para%20mi%20hijo(a)"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-emerald-400 font-bold text-xs uppercase flex items-center gap-1.5 border border-emerald-800/40 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Postular a Beca</span>
            </a>
          </div>
        </div>

      </section>

      {/* 4. ATENCIÓN PERSONALIZADA & CONSULTAS DE ENTRENAMIENTO */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-2 border-golden-500/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-bold uppercase">
            <MapPin className="w-3.5 h-3.5" />
            <span>Ubicación: Santa Bárbara de Santa Cruz, Guanacaste</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">
            Coordinación Directa de Entrenamientos
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Para consultar la programación de horarios, grupos por edad y la coordinación de las sesiones de entrenamiento de <strong>Golden Sport Academy Santa Cruz</strong>, comunícate directamente con la entrenadora <strong>Lenny Monge</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20consultar%20sobre%20los%20horarios%20y%20entrenamientos%20de%20Golden%20Sport%20Academy%20Santa%20Cruz"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar con la Entrenadora (WhatsApp)</span>
          </a>
        </div>
      </div>

      {/* 4. NUESTRAS CATEGORÍAS OFICIALES */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-black text-golden-400 uppercase tracking-widest bg-golden-500/10 px-3 py-1 rounded-full border border-golden-500/20">
            Nuestras Categorías Oficiales
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Formación Deportiva desde <span className="text-golden-500">Menores de U8 hasta Juvenil</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Programas adaptados a cada etapa del desarrollo infantil y juvenil en Santa Bárbara con <strong>Golden Sport Academy Santa Cruz</strong>.
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
              Sábados & Martes • Santa Bárbara
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
              Fundamentos de bote con ambas manos, pases precisos, mecánicas iniciales de tiro avaladas por <strong>FECOBA</strong> y juego en equipo.
            </p>
            <div className="pt-2 text-xs font-semibold text-golden-400">
              Martes y Jueves • Santa Bárbara
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
              Lunes, Miércoles y Viernes • Santa Bárbara
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
              Lunes a Viernes • Santa Bárbara
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
              Sábados (Convocatoria periódica)
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
              <h3 className="text-xl font-black text-white mt-2">Cobertura en Partidos Oficiales</h3>
              <p className="text-xs text-gray-300 leading-relaxed mt-1">
                Sesiones y recuerdos familiares HD en partidos oficiales, marcos e imanes personalizados producidos por Curiol Studio para Golden Sport Academy Santa Cruz.
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

      {/* 5. LLAMADO A LA ACCIÓN / INSCRIPCIÓN */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-dark-900 via-golden-950/40 to-dark-900 border-2 border-golden-500/40 text-center space-y-6 shadow-2xl">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase">
            ¿Listo para formar parte de Golden Sport Academy Santa Cruz?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Matrículas abiertas para todas las categorías. Entrena con entrenadores certificados por <strong>FECOBA</strong> en Santa Bárbara de Santa Cruz.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/#inscripcion"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-golden-400 via-golden-500 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-golden-500/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Inscribir Atleta Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/calendario"
            className="px-6 py-4 rounded-2xl bg-dark-800 hover:bg-dark-700 text-white font-bold text-sm uppercase border border-gray-700 transition-colors"
          >
            Ver Calendario de Partidos
          </Link>
        </div>
      </div>

    </div>
  );
}
