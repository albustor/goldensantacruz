"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Calendar, MapPin, Navigation, ArrowRight } from "lucide-react";
import { Match } from "@/types";

interface Props {
  match: Match | null;
}

export default function MatchBanner({ match }: Props) {
  if (!match) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-dark-800 via-dark-800/95 to-amber-950/40 border-2 border-golden-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-black uppercase">
              <Trophy className="w-3.5 h-3.5" />
              <span>Próximo Encuentro Oficial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Golden Sport <span className="text-golden-400">vs</span> {match.opponent}
            </h2>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-gray-300 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-golden-300">
                <Calendar className="w-4 h-4 text-golden-400" />
                {match.matchDate} • {match.matchTime}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-golden-400" />
                {match.location}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-dark-700 font-semibold text-gray-200 border border-gray-600">
                {match.category}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/en-vivo"
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-dark-900 hover:bg-dark-800 border-2 border-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/80 transition-all hover:scale-105"
            >
              <span>EN VIV</span>
              <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-[0_0_8px_rgba(239,68,68,1)]" />
              </span>
            </Link>
            {match.locationUrl && (
              <a
                href={match.locationUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-700 hover:bg-dark-600 text-white font-bold text-xs uppercase tracking-wider border border-gray-600 transition-all"
              >
                <Navigation className="w-4 h-4 text-golden-400" />
                <span>Waze</span>
              </a>
            )}
            <Link
              href="/calendario"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              <span>Calendario</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
