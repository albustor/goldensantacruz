"use client";

import React, { useState } from "react";
import { Award, Plus, Edit3, Trash2, X, Star } from "lucide-react";
import { Sponsor } from "@/types";
import { Store } from "@/lib/store";

interface Props {
  sponsors: Sponsor[];
  onRefresh: () => void;
}

export default function AdminSponsorsTab({ sponsors, onRefresh }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    tier: "oro" as "oro" | "plata" | "bronce",
    logoUrl: "",
    tagline: "",
    websiteUrl: "",
    whatsappPhone: "50688885544",
    isActive: true,
    orderIndex: 1,
  });

  const handleOpenCreate = () => {
    setEditingSponsor(null);
    setFormData({
      name: "",
      tier: "oro",
      logoUrl: "",
      tagline: "",
      websiteUrl: "",
      whatsappPhone: "50688885544",
      isActive: true,
      orderIndex: sponsors.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Sponsor) => {
    setEditingSponsor(s);
    setFormData({
      name: s.name,
      tier: s.tier,
      logoUrl: s.logoUrl,
      tagline: s.tagline,
      websiteUrl: s.websiteUrl || "",
      whatsappPhone: s.whatsappPhone || "",
      isActive: s.isActive,
      orderIndex: s.orderIndex,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSponsor) {
      await Store.updateSponsor({
        ...editingSponsor,
        ...formData,
      });
    } else {
      await Store.addSponsor({
        ...formData,
      });
    }
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Eliminar el patrocinador ${name}?`)) {
      await Store.deleteSponsor(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Gestión de Patrocinadores & Sponsors ({sponsors.length})
          </h2>
          <p className="text-xs text-gray-400">
            Administrar marcas aliadas, logos comerciales y categorías de patrocinio.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Añadir Patrocinador
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-dark-800 border border-gray-800 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-golden-500/20 text-golden-400 border border-golden-500/30">
                  Nivel {s.tier}
                </span>
                {s.isActive ? (
                  <span className="text-[10px] text-emerald-400 font-bold">Activo</span>
                ) : (
                  <span className="text-[10px] text-gray-500 font-bold">Inactivo</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-dark-900 border border-gray-700 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img src={s.logoUrl} alt={s.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{s.name}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">{s.tagline}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700/60 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(s)}
                className="p-1.5 rounded-lg bg-golden-500/20 text-golden-400 text-xs font-bold"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(s.id, s.name)}
                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-md bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white uppercase">
              {editingSponsor ? "Editar Patrocinador" : "Nuevo Patrocinador"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Nombre Comercial *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Nivel de Patrocinio *</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                >
                  <option value="oro">Nivel Oro (Principal)</option>
                  <option value="plata">Nivel Plata</option>
                  <option value="bronce">Nivel Bronce</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">URL del Logotipo *</label>
                <input
                  type="text"
                  required
                  placeholder="https://... o /logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Descripción / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Teléfono WhatsApp Comercial</label>
                <input
                  type="text"
                  placeholder="50688885544"
                  value={formData.whatsappPhone}
                  onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-800 text-gray-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-golden-500 text-dark-900 font-black uppercase shadow-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
