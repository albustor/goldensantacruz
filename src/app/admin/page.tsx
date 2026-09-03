"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Calendar, 
  Camera, 
  Award, 
  Sparkles, 
  Settings, 
  LogOut, 
  Lock, 
  ArrowLeft,
  LayoutDashboard,
  Mic
} from "lucide-react";
import { 
  AcademySettings, 
  GalleryPhoto, 
  Match, 
  PaymentRecord, 
  Player, 
  Sponsor 
} from "@/types";
import { Store } from "@/lib/store";

import AdminDashboardTab from "@/components/admin/AdminDashboardTab";
import AdminPlayersTab from "@/components/admin/AdminPlayersTab";
import AdminPaymentsTab from "@/components/admin/AdminPaymentsTab";
import AdminMatchesTab from "@/components/admin/AdminMatchesTab";
import AdminGalleryTab from "@/components/admin/AdminGalleryTab";
import AdminSponsorsTab from "@/components/admin/AdminSponsorsTab";
import AdminAIAssistantTab from "@/components/admin/AdminAIAssistantTab";
import AdminAudioNotesTab from "@/components/admin/AdminAudioNotesTab";
import AdminSettingsTab from "@/components/admin/AdminSettingsTab";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Data state
  const [players, setPlayers] = useState<Player[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [settings, setSettings] = useState<AcademySettings>(Store.getSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("golden_admin_logged");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    const [plys, pays, mtcs, gals, spns] = await Promise.all([
      Store.getPlayers(),
      Store.getPayments(),
      Store.getMatches(),
      Store.getGalleryPhotos(),
      Store.getSponsors(),
    ]);
    setPlayers(plys);
    setPayments(pays);
    setMatches(mtcs);
    setGalleryPhotos(gals);
    setSponsors(spns);
    setSettings(Store.getSettings());
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "2026" || pinInput.toLowerCase() === "golden2026" || pinInput === "admin" || pinInput === "62806989") {
      setIsAuthenticated(true);
      sessionStorage.setItem("golden_admin_logged", "true");
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("golden_admin_logged");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-dark-800 border-2 border-golden-500/50 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-golden-500/40 p-2 mx-auto flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Golden Sport Academy"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Portal Administrativo
            </h1>
            <p className="text-xs text-gray-400">
              Acceso exclusivo para el cuerpo técnico y directiva (Jenny & Coaches).
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                Código PIN de Acceso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-golden-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Ingrese el PIN (2026)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-golden-500"
                />
              </div>
              {authError && (
                <p className="text-xs text-red-400 font-semibold pt-1">
                  Código PIN incorrecto. Intente con "2026".
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Ingresar al Panel
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Página Principal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navTabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jugadores", label: "Jugadores", icon: Users, badge: players.length },
    { id: "cobranzas", label: "Cobranzas", icon: CreditCard, highlight: true },
    { id: "partidos", label: "Partidos", icon: Calendar, badge: matches.length },
    { id: "galeria", label: "Galería Studio", icon: Camera, badge: galleryPhotos.length },
    { id: "patrocinadores", label: "Patrocinadores", icon: Award },
    { id: "audio", label: "Notas de Voz 🎙️", icon: Mic, highlight: true },
    { id: "ia", label: "Asistente IA", icon: Sparkles },
    { id: "config", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-800 border border-golden-500/40 flex items-center justify-center p-1">
            <Image
              src="/logo.png"
              alt="Golden Sport Academy"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white uppercase tracking-tight">
                Golden Admin Portal
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-golden-500 text-dark-900">
                Santa Bárbara
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Sistema de Cobranzas, Roster U8-U18, Álbum Golden Studio & Notas Directiva
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 text-xs font-semibold border border-gray-700"
          >
            Ver Web Pública
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-800/80">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? "bg-golden-500 text-dark-900 shadow-md shadow-golden-500/20"
                  : tab.highlight
                  ? "bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-800/50"
                  : "bg-dark-800 text-gray-300 hover:text-white hover:bg-dark-700 border border-gray-700/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-dark-900" : ""}`} />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? "bg-dark-900 text-golden-400" : "bg-dark-900 text-gray-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "dashboard" && (
          <AdminDashboardTab
            players={players}
            payments={payments}
            matches={matches}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "jugadores" && (
          <AdminPlayersTab players={players} onRefresh={loadAllData} />
        )}

        {activeTab === "cobranzas" && (
          <AdminPaymentsTab
            payments={payments}
            players={players}
            settings={settings}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "partidos" && (
          <AdminMatchesTab matches={matches} onRefresh={loadAllData} />
        )}

        {activeTab === "galeria" && (
          <AdminGalleryTab photos={galleryPhotos} onRefresh={loadAllData} />
        )}

        {activeTab === "patrocinadores" && (
          <AdminSponsorsTab sponsors={sponsors} onRefresh={loadAllData} />
        )}

        {activeTab === "audio" && <AdminAudioNotesTab />}

        {activeTab === "ia" && <AdminAIAssistantTab />}

        {activeTab === "config" && (
          <AdminSettingsTab settings={settings} onRefresh={loadAllData} />
        )}
      </div>
    </div>
  );
}
