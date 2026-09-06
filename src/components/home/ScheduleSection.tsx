"use client";

import React from "react";
import Link from "next/link";
import { 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  Dumbbell,
  ShieldCheck,
  Phone,
  Flame
} from "lucide-react";

export default function ScheduleSection() {
  const trainingDays = [
    {
      day: "Martes",
      time: "6:00 PM - 7:30 PM",
      shift: "Tarde / Noche",
      badgeColor: "bg-golden-500/20 text-golden-300 border-golden-500/40",
      focus: "Fundamentos Técnicos & Drible",
      desc: "Desarrollo de habilidades individuales, manejo de balón y postura defensiva."
    },
    {
      day: "Jueves",
      time: "6:00 PM - 7:30 PM",
      shift: "Tarde / Noche",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      focus: "Táctica de Juego & Tiro",
      desc: "Mecánica de lanzamiento, juego en equipo, toma de decisiones y sistemas ofensivos."
    },
    {
      day: "Sábados",
      time: "8:00 AM - 9:30 AM",
      shift: "Mañana",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      focus: "Jornada Formativa & Fogueos Internos",
      desc: "Aplicación práctica en partidos simulados, clínicas de tecnificación y acondicionamiento físico."
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      {/* Tarjeta Ultra-Translúcida con Efecto Vidrio sobre el Fondo */}
      <div className="rounded-3xl bg-dark-950/60 backdrop-blur-md border-2 border-golden-500/40 p-6 sm:p-10 shadow-2xl shadow-black/90 space-y-8">
        
        {/* Cabecera del Horario de Entrenamientos */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-golden-500/25">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500 text-dark-950 text-xs font-black uppercase shadow-md">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Cronograma Semanal Oficial</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dirección Técnica FECOBA</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
              Días & Horarios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-300 via-golden-400 to-amber-500">Entrenamiento</span>
            </h2>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-gray-200 font-medium">
              <span className="flex items-center gap-1 text-golden-400 font-bold">
                <MapPin className="w-4 h-4 text-golden-500" />
                <span>Sede: Santa Bárbara de Santa Cruz, Guanacaste</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-300">
                <span>Entrenadora: <strong>Lenny Monge</strong></span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20consultar%20sobre%20los%20entrenamientos%20de%20Golden%20Sport%20Academy"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Consultar por WhatsApp</span>
            </a>

            <Link
              href="/calendario"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-golden-400 via-golden-500 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-xl shadow-golden-500/30 transition-all hover:scale-105 shrink-0"
            >
              <span>Ver Calendario</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grid de las 3 Sesiones Semanales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trainingDays.map((session, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-dark-950/70 border-2 border-golden-500/40 hover:border-golden-400 transition-all space-y-4 flex flex-col justify-between shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${session.badgeColor}`}>
                    {session.shift}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-golden-500/20 text-golden-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase group-hover:text-golden-300 transition-colors">
                    {session.day}
                  </h3>
                  <div className="flex items-center gap-1.5 text-golden-400 font-bold text-sm pt-1">
                    <Clock className="w-4 h-4 text-golden-400" />
                    <span>{session.time}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-dark-900 border border-gray-800 space-y-1">
                  <strong className="text-xs text-white block uppercase">{session.focus}</strong>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    {session.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1 text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-golden-500 shrink-0" />
                  <span>Santa Bárbara</span>
                </span>
                <span className="text-emerald-400 font-bold text-[10px] uppercase">
                  ● Activo Semanal
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Nota Informativa */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏀</span>
            <span className="text-sm font-black text-golden-300 uppercase tracking-wide">
              ¡Formando atletas con disciplina, pasión y valores!
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Sede Central: Cancha Multiuso de Santa Bárbara de Santa Cruz, Guanacaste
          </div>
        </div>

      </div>
    </section>
  );
}
