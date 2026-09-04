"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Heart,
  Navigation,
  Sparkles,
  Award,
  Code,
  Globe,
  ExternalLink
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-golden-500/30 text-gray-400 text-xs mt-20">
      {/* Upper Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Institución Oficial */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-dark-900 border border-golden-500/40 p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="Golden Sport Academy Santa Cruz"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-black text-white text-sm uppercase block leading-tight">
                  Golden Sport Academy
                </span>
                <span className="text-xs text-golden-400 font-bold uppercase tracking-wider block leading-none">
                  Santa Cruz • Guanacaste
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Escuela formativa oficial de baloncesto para niños y jóvenes desde menores de U8 hasta juvenil en Santa Bárbara de Santa Cruz. Con el respaldo deportivo de Golden Sport Academy Liberia.
            </p>
          </div>

          {/* Col 2: Ubicación & Entrenamientos */}
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase text-xs tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-golden-500" />
              <span>Ubicación & Sesiones</span>
            </h4>
            <p className="text-gray-200 font-bold">
              Santa Bárbara de Santa Cruz
            </p>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Guanacaste, Costa Rica. La programación de días y horarios se coordina directamente con la dirección técnica.
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20consultar%20sobre%20los%20entrenamientos%20en%20Santa%20Bárbara"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-golden-400 font-bold text-[11px] border border-golden-500/30 inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Consultar con Lenny Monge</span>
              </a>
            </div>
          </div>

          {/* Col 3: Contacto & Matrícula */}
          <div className="space-y-3">
            <h4 className="font-black text-white uppercase text-xs tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-golden-500" />
              <span>Contacto & Matrícula</span>
            </h4>
            <div className="p-3 rounded-xl bg-dark-900 border border-golden-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-golden-400 block">
                Entrenadora Lenny Monge (FECOBA)
              </span>
              <a
                href="https://wa.me/50662806989"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-golden-400 text-sm block tracking-widest font-black transition-colors"
              >
                📱 6280-6989
              </a>
              <span className="text-[10px] text-gray-400 block">
                Sinpe Móvil Oficial & Inscripciones
              </span>
            </div>
          </div>

          {/* Col 4: Curiol Studio & Enlaces Oficiales */}
          <div className="space-y-3">
            <div className="h-9 w-28 bg-white rounded-lg p-1 border border-golden-500/50 flex items-center justify-center shadow-sm">
              <Image
                src="/curiol-studio-logo.png"
                alt="Curiol Studio"
                width={100}
                height={28}
                className="object-contain max-h-full max-w-full"
              />
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Cobertura fotográfica profesional de partidos oficiales, retratos HD y producción de recuerdos familiares para Golden Sport Academy Santa Cruz.
            </p>
            <div className="space-y-1.5 pt-1">
              <a
                href="https://curiol.studio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-golden-400 font-bold hover:text-golden-300 transition-colors"
              >
                <span>Visitar curiol.studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Desarrolladores Curiol Studio */}
      <div className="border-t border-gray-800/80 bg-dark-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} <strong>Golden Sport Academy Santa Cruz</strong>. Sede Santa Bárbara de Santa Cruz, Guanacaste. Todos los derechos reservados.
          </p>

          {/* Sello Oficial con Hipervínculo Directo a https://curiol.studio */}
          <a
            href="https://curiol.studio"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-dark-900 hover:bg-dark-800 border-2 border-golden-500/40 text-gray-200 text-xs font-medium transition-all hover:scale-105 shadow-md shadow-black/80 group cursor-pointer"
            title="Visitar Curiol Studio (https://curiol.studio)"
          >
            <Code className="w-4 h-4 text-golden-400 group-hover:rotate-12 transition-transform" />
            <span>Desarrollado & Creado por</span>
            <strong className="text-golden-400 font-black tracking-wide group-hover:text-golden-300 underline underline-offset-4 decoration-golden-500/50">
              Curiol Studio
            </strong>
            <ExternalLink className="w-3.5 h-3.5 text-golden-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

        </div>
      </div>
    </footer>
  );
}
