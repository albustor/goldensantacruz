"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  MapPin, 
  X, 
  Navigation,
  FolderKanban
} from "lucide-react";
import { Match, PlayerCategory } from "@/types";
import { Store } from "@/lib/store";
import CategorySelect from "@/components/common/CategorySelect";
import CategoryManagerModal from "@/components/admin/CategoryManagerModal";

interface Props {
  matches: Match[];
  onRefresh: () => void;
}

export default function AdminMatchesTab({ matches, onRefresh }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const loadCategories = async () => {
    const cats = await Store.getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const [formData, setFormData] = useState({
    opponent: "",
    opponentLogo: "🏀",
    category: "Iniciación / Menores de U8 (U6-U8)" as PlayerCategory,
    matchDate: new Date().toISOString().split("T")[0],
    matchTime: "10:00 AM",
    location: "Santa Bárbara de Santa Cruz",
    locationUrl: "https://maps.google.com/?q=Santa+Barbara+Santa+Cruz+Guanacaste",
    homeAway: "local" as "local" | "visita",
    status: "upcoming" as "upcoming" | "live" | "finished",
    scoreGolden: 0,
    scoreOpponent: 0,
    summary: "",
  });

  const handleOpenCreate = () => {
    setEditingMatch(null);
    setFormData({
      opponent: "",
      opponentLogo: "🏀",
      category: categories[0] || "Iniciación / Menores de U8 (U6-U8)",
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "10:00 AM",
      location: "Santa Bárbara de Santa Cruz",
      locationUrl: "https://maps.google.com/?q=Santa+Barbara+Santa+Cruz+Guanacaste",
      homeAway: "local",
      status: "upcoming",
      scoreGolden: 0,
      scoreOpponent: 0,
      summary: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Match) => {
    setEditingMatch(m);
    setFormData({
      opponent: m.opponent,
      opponentLogo: m.opponentLogo || "🏀",
      category: m.category,
      matchDate: m.matchDate,
      matchTime: m.matchTime,
      location: m.location,
      locationUrl: m.locationUrl || "",
      homeAway: m.homeAway || (m.isHome ? "local" : "visita"),
      status: m.status,
      scoreGolden: m.scoreGolden || 0,
      scoreOpponent: m.scoreOpponent || 0,
      summary: m.summary || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isHome = formData.homeAway === "local";
    if (editingMatch) {
      await Store.updateMatch({
        ...editingMatch,
        ...formData,
        isHome,
      });
    } else {
      await Store.addMatch({
        ...formData,
        isHome,
      });
    }
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string, opponent: string) => {
    if (confirm(`¿Eliminar el partido contra ${opponent}?`)) {
      await Store.deleteMatch(id);
      onRefresh();
    }
  };

  const filteredMatches = selectedCategoryFilter === "all"
    ? matches
    : matches.filter(m => m.category === selectedCategoryFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Gestión de Partidos & Marcadores ({matches.length})
          </h2>
          <p className="text-xs text-gray-400">
            Crear programación de encuentros, asignar sedes con Waze y actualizar resultados de Golden Sport Academy.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-golden-400 border border-golden-500/40 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <FolderKanban className="w-4 h-4" />
            Gestionar Categorías
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Crear Partido
          </button>
        </div>
      </div>

      {/* Filtro por Categoría */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategoryFilter === "all"
              ? "bg-golden-500 text-dark-900 shadow-md"
              : "bg-dark-800 text-gray-400 hover:text-white border border-gray-800"
          }`}
        >
          Todas ({matches.length})
        </button>
        {categories.map((cat) => {
          const count = matches.filter((m) => m.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryFilter === cat
                  ? "bg-golden-500 text-dark-900 shadow-md"
                  : "bg-dark-800 text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-dark-800 border border-gray-800 hover:border-golden-500/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-0.5 rounded bg-golden-500/20 text-golden-400">
                  {m.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.status === "finished"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  {m.status === "finished" ? "Finalizado" : "Próximo"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-base font-black text-white">
                  Golden Sport <span className="text-golden-400">vs</span> {m.opponent}
                </span>
                {m.status === "finished" && (
                  <span className="font-black text-lg text-white bg-dark-900 px-2.5 py-0.5 rounded-lg border border-golden-500/30">
                    {m.scoreGolden} - {m.scoreOpponent}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>📅 {m.matchDate} • ⏰ {m.matchTime} • Sede: {m.location}</p>
                {m.summary && <p className="italic text-gray-300 line-clamp-2">"{m.summary}"</p>}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-700/60 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(m)}
                className="p-2 rounded-lg bg-golden-500/20 hover:bg-golden-500/30 text-golden-400 text-xs font-bold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editar / Marcador
              </button>
              <button
                onClick={() => handleDelete(m.id, m.opponent)}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-lg bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white uppercase">
              {editingMatch ? "Editar Partido / Marcador" : "Programar Partido"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  Equipo Rival *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Nicoya Basketball Club"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CategorySelect
                  value={formData.category}
                  onChange={(cat) => setFormData({ ...formData, category: cat })}
                  label="Categoría *"
                  onManageCategories={() => setIsCategoryModalOpen(true)}
                />

                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Condición
                  </label>
                  <select
                    value={formData.homeAway}
                    onChange={(e) => setFormData({ ...formData, homeAway: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500 text-xs font-semibold"
                  >
                    <option value="local">Local (Santa Bárbara)</option>
                    <option value="visita">De Visita</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.matchDate}
                    onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Hora *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.matchTime}
                    onChange={(e) => setFormData({ ...formData, matchTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  Sede / Cancha *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div className="p-3 bg-dark-800 rounded-xl border border-gray-700 space-y-3">
                <div>
                  <label className="block font-bold text-golden-400 uppercase mb-1">
                    Estado del Partido
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white focus:border-golden-500"
                  >
                    <option value="upcoming">Próximo Partido</option>
                    <option value="finished">Finalizado (Marcador Final)</option>
                  </select>
                </div>

                {formData.status === "finished" && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                        Puntos Golden Sport
                      </label>
                      <input
                        type="number"
                        value={formData.scoreGolden}
                        onChange={(e) => setFormData({ ...formData, scoreGolden: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white text-center font-bold text-base focus:border-golden-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                        Puntos Rival
                      </label>
                      <input
                        type="number"
                        value={formData.scoreOpponent}
                        onChange={(e) => setFormData({ ...formData, scoreOpponent: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white text-center font-bold text-base focus:border-golden-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  Crónica / Resumen
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
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

      {/* Modal de Gestión de Categorías */}
      <CategoryManagerModal
        categories={categories}
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoriesChange={(updated) => {
          setCategories(updated);
          loadCategories();
          onRefresh();
        }}
      />
    </div>
  );
}
