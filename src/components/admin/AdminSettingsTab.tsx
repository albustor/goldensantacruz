"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Database, Phone, MapPin, TreeDeciduous, Lock, ExternalLink } from "lucide-react";
import { SystemSettings } from "@/types";
import { Store } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

interface Props {
  settings: SystemSettings;
  onRefresh: () => void;
}

export default function AdminSettingsTab({ settings, onRefresh }: Props) {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Store.updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onRefresh();
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          Configuración General de la Academia
        </h2>
        <p className="text-xs text-gray-400">
          Modificar teléfonos de Sinpe Móvil (<strong>62806989</strong>), cuentas bancarias, cuotas y enlace al Árbol de Guanacaste.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className={`w-5 h-5 ${isSupabaseConfigured ? "text-emerald-400" : "text-golden-400"}`} />
          <div>
            <p className="text-xs font-bold text-white">
              {isSupabaseConfigured ? "Conexión Supabase Activa" : "Modo Local / Demo Resiliente"}
            </p>
            <p className="text-[11px] text-gray-400">
              {isSupabaseConfigured
                ? "Sincronizando en tiempo real con Supabase PostgreSQL & Storage."
                : "Operando con persistencia local. Para activar la nube, configure NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en su archivo .env.local"}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
          isSupabaseConfigured ? "bg-emerald-500/20 text-emerald-400" : "bg-golden-500/20 text-golden-400"
        }`}>
          {isSupabaseConfigured ? "Cloud" : "Local"}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-dark-800 border border-gray-800 space-y-6">
        
        {/* Sección Árbol de Guanacaste */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-gray-700 pb-2 flex items-center gap-1.5">
            <TreeDeciduous className="w-4 h-4 text-emerald-400" />
            <span>Vinculación Oficial: Árbol de Guanacaste (Curiol Studio)</span>
          </h3>

          <div className="space-y-2 text-xs">
            <label className="block font-bold text-gray-300 uppercase">
              URL Oficial de la Línea de Tiempo en Curiol Studio
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={formData.arbolGuanacasteUrl}
                onChange={(e) => setFormData({ ...formData, arbolGuanacasteUrl: e.target.value })}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-dark-900 border border-emerald-500/50 text-emerald-300 font-mono text-xs focus:border-emerald-400"
              />
              <a
                href={formData.arbolGuanacasteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
              >
                <span>Probar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Información Financiera */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-golden-400 uppercase tracking-wider border-b border-gray-700 pb-2">
            Información de Sinpe Móvil & Cuentas Oficiales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                Teléfono Sinpe Móvil Oficial *
              </label>
              <input
                type="text"
                required
                value={formData.sinpePhone}
                onChange={(e) => setFormData({ ...formData, sinpePhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-emerald-400 font-bold focus:border-golden-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                Titular de la Cuenta Sinpe *
              </label>
              <input
                type="text"
                required
                value={formData.sinpeOwner}
                onChange={(e) => setFormData({ ...formData, sinpeOwner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white focus:border-golden-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                Cuenta IBAN Oficial
              </label>
              <input
                type="text"
                value={formData.ibanAccount}
                onChange={(e) => setFormData({ ...formData, ibanAccount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white font-mono text-xs focus:border-golden-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                Banco Emisor
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white focus:border-golden-500"
              />
            </div>
          </div>
        </div>

        {/* Seguridad & Cuotas */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-golden-400 uppercase tracking-wider border-b border-gray-700 pb-2">
            Seguridad & Cuotas Predeterminadas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                Cuota Mensual Estándar (₡)
              </label>
              <input
                type="number"
                value={formData.monthlyFeeDefault}
                onChange={(e) => setFormData({ ...formData, monthlyFeeDefault: parseInt(e.target.value) || 15000 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-white focus:border-golden-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 uppercase mb-1">
                PIN de Acceso al Panel Admin
              </label>
              <input
                type="password"
                value={formData.adminPin}
                onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-gray-700 text-golden-400 font-bold focus:border-golden-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          {saved ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ¡Ajustes guardados correctamente!
            </span>
          ) : (
            <span></span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
