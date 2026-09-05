"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, Sparkles, Phone, ArrowRight, Camera } from "lucide-react";
import { Sponsor } from "@/types";
import { Store } from "@/lib/store";

interface Props {
  sponsors?: Sponsor[];
}

export default function SponsorsSection({ sponsors: initialSponsors }: Props) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors || []);

  useEffect(() => {
    if (!initialSponsors || initialSponsors.length === 0) {
      Store.getSponsors().then((data) => {
        setSponsors(data.filter((s) => s.isActive));
      });
    }
  }, [initialSponsors]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-b from-dark-800 to-dark-900 border-2 border-golden-500/30 p-8 sm:p-12 space-y-8 shadow-2xl">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-black uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Patrocinador Oficial & Alianzas Comerciales</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Marcas que Impulsan a <span className="text-golden-500">Golden Sport</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Gracias al respaldo de <strong>Curiol Studio</strong> y a la gestión de la entrenadora <strong>Yorleny (Lenny) Monge Soto</strong>, abrimos espacios seguros y formativos para los niños en Santa Bárbara.
          </p>
        </div>

        {/* Sponsor Banner - Curiol Studio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Main Sponsor Card: Curiol Studio */}
          <div className="p-6 rounded-2xl bg-dark-900/90 border-2 border-golden-500/60 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
            <div className="w-40 h-20 rounded-2xl bg-dark-950/80 border-2 border-golden-500/50 flex items-center justify-center p-3 shrink-0 shadow-md">
              <Image
                src="/curiol-studio-transparent.png"
                alt="Curiol Studio"
                width={140}
                height={60}
                className="object-contain max-h-full max-w-full drop-shadow-[0_2px_10px_rgba(234,179,8,0.4)]"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-golden-500 text-dark-900">
                Patrocinador Oficial Oro
              </span>
              <h3 className="text-lg font-black text-white">Curiol Studio</h3>
              <p className="text-xs text-gray-300">
                Cobertura fotográfica profesional de encuentros, clínicas de tiro y tienda oficial de recuerdos (imanes para neveras y retablos).
              </p>
            </div>
          </div>

          {/* Call to Action for Coach Lenny's Commercial Proposal */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-golden-950/40 to-dark-900 border border-golden-500/30 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-golden-400 uppercase">
                Alianza Comercial con Coach Lenny Monge
              </span>
              <h3 className="text-lg font-black text-white">
                ¿Deseas pautar y sumar la marca de tu empresa?
              </h3>
              <p className="text-xs text-gray-300">
                Pauta por partido oficial, lonas en la zona de entrenamiento, difusión digital de Curiol Studio y presencia en uniformes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/patrocinadores"
                className="px-4 py-2 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase flex items-center gap-1.5 shadow-md"
              >
                <span>Ver Modalidades de Pauta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://wa.me/50662806989?text=Hola%20Coach%20Lenny%20Monge,%20deseo%20información%20sobre%20las%20opciones%20de%20patrocinio%20y%20pauta%20para%20Golden%20Sport%20Academy"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-emerald-400 font-bold text-xs uppercase flex items-center gap-1.5 border border-emerald-800/40"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp: 6280-6989
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
