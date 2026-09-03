"use client";

import React from "react";
import { 
  Users, 
  CreditCard, 
  Calendar, 
  Camera, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Flame
} from "lucide-react";
import { Match, PaymentRecord, Player, Sponsor } from "@/types";

interface Props {
  players: Player[];
  payments: PaymentRecord[];
  matches: Match[];
  onSelectTab: (tab: string) => void;
}

export default function AdminDashboardTab({ players, payments, matches, onSelectTab }: Props) {
  const activePlayers = players.filter((p) => p.isActive);
  const paidPayments = payments.filter((p) => p.status === "paid");
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const overduePayments = payments.filter((p) => p.status === "overdue");

  const totalCollected = paidPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = overduePayments.reduce((acc, curr) => acc + curr.amount, 0);

  const upcomingMatches = matches.filter((m) => m.status === "upcoming");

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-800 via-dark-800 to-amber-950/40 border-2 border-golden-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded bg-golden-500/20 text-golden-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel de Control Administrativo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
            Golden Sport Academy Santa Cruz
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Resumen en tiempo real de deportistas, estado de cobranzas de mensualidades y agenda de partidos.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onSelectTab("cobranzas")}
            className="px-5 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            Gestionar Cobranzas
          </button>
          <button
            onClick={() => onSelectTab("jugadores")}
            className="px-5 py-3 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-200 font-bold text-xs uppercase tracking-wider border border-gray-600 transition-all"
          >
            + Registrar Jugador
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Atletas */}
        <div
          onClick={() => onSelectTab("jugadores")}
          className="p-5 rounded-2xl bg-dark-800 border border-gray-800 hover:border-golden-500/50 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Jugadores Activos</span>
            <Users className="w-5 h-5 text-golden-400" />
          </div>
          <p className="text-3xl font-black text-white">{activePlayers.length}</p>
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <span className="text-golden-400 font-bold">{players.length}</span> registrados en total
          </p>
        </div>

        {/* Recaudado */}
        <div
          onClick={() => onSelectTab("cobranzas")}
          className="p-5 rounded-2xl bg-dark-800 border border-gray-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Mensualidades Pagadas</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">
            ₡{totalCollected.toLocaleString("es-CR")}
          </p>
          <p className="text-[11px] text-gray-400">
            {paidPayments.length} cuotas al día
          </p>
        </div>

        {/* Pendiente */}
        <div
          onClick={() => onSelectTab("cobranzas")}
          className="p-5 rounded-2xl bg-dark-800 border border-gray-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Por Cobrar / Pendiente</span>
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">
            ₡{totalPending.toLocaleString("es-CR")}
          </p>
          <p className="text-[11px] text-gray-400">
            {pendingPayments.length} avisos listos para WhatsApp
          </p>
        </div>

        {/* Vencido */}
        <div
          onClick={() => onSelectTab("cobranzas")}
          className="p-5 rounded-2xl bg-dark-800 border border-gray-800 hover:border-red-500/50 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Cuotas Vencidas</span>
            <CreditCard className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-black text-red-400">
            ₡{totalOverdue.toLocaleString("es-CR")}
          </p>
          <p className="text-[11px] text-red-300">
            {overduePayments.length} requieren seguimiento urgente
          </p>
        </div>
      </div>

      {/* Quick Sections: Upcoming Matches & Fast Action Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Matches */}
        <div className="p-6 rounded-3xl bg-dark-800/90 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-700/60 pb-3">
            <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-golden-400" />
              Próximos Partidos en Agenda
            </h3>
            <button
              onClick={() => onSelectTab("partidos")}
              className="text-xs font-bold text-golden-400 hover:underline"
            >
              Administrar
            </button>
          </div>

          {upcomingMatches.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">No hay partidos próximos programados.</p>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-dark-900 border border-gray-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-black text-white">
                      vs {m.opponent}
                    </span>
                    <p className="text-[11px] text-gray-400">
                      {m.matchDate} • {m.matchTime} • {m.category}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-golden-500/20 text-golden-400 px-2.5 py-1 rounded-md border border-golden-500/30">
                    {m.homeAway}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick WhatsApp Reminder Queue */}
        <div className="p-6 rounded-3xl bg-dark-800/90 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-700/60 pb-3">
            <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Cobros Pendientes de Envío
            </h3>
            <button
              onClick={() => onSelectTab("cobranzas")}
              className="text-xs font-bold text-golden-400 hover:underline"
            >
              Ver Todos ({pendingPayments.length + overduePayments.length})
            </button>
          </div>

          <div className="space-y-3">
            {[...overduePayments, ...pendingPayments].slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-dark-900 border border-gray-800 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    {p.playerName}
                  </span>
                  <p className="text-[10px] text-gray-400">
                    Tutor: {p.guardianName} ({p.guardianPhone}) • ₡{p.amount.toLocaleString("es-CR")}
                  </p>
                </div>
                <button
                  onClick={() => onSelectTab("cobranzas")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
                >
                  Cobrar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
