"use client";

import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Phone, 
  Eye,
  Filter,
  X,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { Player, PlayerCategory } from "@/types";
import { Store } from "@/lib/store";

interface Props {
  players: Player[];
  onRefresh: () => void;
}

export default function AdminPlayersTab({ players, onRefresh }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    category: "Iniciación / Menores de U8 (U6-U8)" as PlayerCategory,
    jerseyNumber: 0,
    position: "Iniciación",
    medicalNotes: "",
    guardianName: "",
    guardianPhone: "62806989",
    guardianEmail: "",
    monthlyFee: 15000,
    paymentStatus: "al_dia" as any,
    isActive: true,
    photoUrl: "",
    registrationDate: new Date().toISOString().split("T")[0],
  });

  const handleOpenCreate = () => {
    setEditingPlayer(null);
    setFormData({
      fullName: "",
      birthDate: "",
      category: "Iniciación / Menores de U8 (U6-U8)",
      jerseyNumber: 0,
      position: "Iniciación",
      medicalNotes: "",
      guardianName: "",
      guardianPhone: "62806989",
      guardianEmail: "",
      monthlyFee: 15000,
      paymentStatus: "al_dia",
      isActive: true,
      photoUrl: "",
      registrationDate: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      fullName: player.fullName,
      birthDate: player.birthDate,
      category: player.category,
      jerseyNumber: player.jerseyNumber || 0,
      position: player.position || "Formativo",
      medicalNotes: player.medicalNotes || "",
      guardianName: player.guardianName,
      guardianPhone: player.guardianPhone,
      guardianEmail: player.guardianEmail || "",
      monthlyFee: player.monthlyFee,
      paymentStatus: player.paymentStatus,
      isActive: player.isActive,
      photoUrl: player.photoUrl || "",
      registrationDate: player.registrationDate,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      await Store.updatePlayer({
        ...editingPlayer,
        ...formData,
      });
    } else {
      await Store.addPlayer({
        ...formData,
      });
    }
    setIsModalOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar el registro de ${name}?`)) {
      await Store.deletePlayer(id);
      onRefresh();
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Nombre Completo", "Categoría", "Posición", "Dorsal", "Tutor", "Teléfono WhatsApp", "Email", "Cuota Mensual", "Estado"];
    const rows = players.map(p => [
      p.id,
      `"${p.fullName}"`,
      `"${p.category}"`,
      `"${p.position || 'Formativo'}"`,
      p.jerseyNumber || "N/A",
      `"${p.guardianName}"`,
      p.guardianPhone,
      p.guardianEmail || "N/A",
      p.monthlyFee,
      p.isActive ? "Activo" : "Inactivo"
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Padron_Atletas_Golden_Sport_Santa_Cruz_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = players.filter((p) => {
    const fullName = p.fullName.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      p.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.guardianPhone.includes(searchTerm);
    const matchesCat = filterCategory === "Todas" || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Base de Datos de Jugadores ({players.length})
          </h2>
          <p className="text-xs text-gray-400">
            Semillero de Iniciación U8, Mini-Básquet U10, Infantil U14 y Juvenil U18 en Santa Bárbara de Santa Cruz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-emerald-400 font-bold text-xs uppercase border border-emerald-500/30 transition-colors shadow-md"
            title="Exportar a Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Atleta</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por jugador, papá o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-golden-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-golden-400 shrink-0" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full md:w-auto px-3.5 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-golden-500"
          >
            <option value="Todas">Todas las Categorías</option>
            <option value="Iniciación / Menores de U8 (U6-U8)">Iniciación / Menores de U8</option>
            <option value="Mini-Básquet (U8-U10)">Mini-Básquet (U8-U10)</option>
            <option value="Infantil (U12-U14)">Infantil (U12-U14)</option>
            <option value="Juvenil (U16-U18)">Juvenil (U16-U18)</option>
            <option value="Clínicas de Tecnificación & Tiro">Clínicas de Tiro</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-800 rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-dark-900/90 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-700/80">
              <tr>
                <th className="py-3.5 px-4">Jugador / Atleta</th>
                <th className="py-3.5 px-4">Categoría & Posición</th>
                <th className="py-3.5 px-4">Tutor Legal & Celular</th>
                <th className="py-3.5 px-4">Cuota Mensual</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No se encontraron jugadores que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filtered.map((player) => (
                  <tr key={player.id} className="hover:bg-dark-700/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-900 border border-golden-500/40 shrink-0 flex items-center justify-center">
                          {player.photoUrl ? (
                            <img src={player.photoUrl} alt={player.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-golden-400 text-xs">#{player.jerseyNumber || "G"}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {player.fullName}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Nacimiento: {player.birthDate || "No indicada"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-golden-400 block">
                        {player.category}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {player.position || "Formativo"} {player.jerseyNumber ? `• Dorsal #${player.jerseyNumber}` : ""}
                      </span>
                    </td>

                    <td className="py-3 px-4 space-y-0.5">
                      <p className="font-medium text-gray-200">{player.guardianName}</p>
                      <a
                        href={`https://wa.me/506${player.guardianPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        {player.guardianPhone}
                      </a>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-white">
                        ₡{player.monthlyFee.toLocaleString("es-CR")}
                      </span>
                      <p className="text-[10px] text-gray-400">
                        Mensual
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      {player.isActive ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-400">
                          Inactivo
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setViewingPlayer(player)}
                        className="p-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-300"
                        title="Ver Ficha Completa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(player)}
                        className="p-1.5 rounded-lg bg-golden-500/20 hover:bg-golden-500/30 text-golden-400"
                        title="Editar Jugador"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(player.id, player.fullName)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        title="Eliminar Jugador"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit / Create */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-2xl bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-white uppercase">
              {editingPlayer ? `Editar a ${editingPlayer.fullName}` : "Registrar Atleta"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Nombre Completo del Atleta *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Fecha Nacimiento *</label>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Categoría *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as PlayerCategory })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  >
                    <option value="Iniciación / Menores de U8 (U6-U8)">Iniciación / Menores de U8</option>
                    <option value="Mini-Básquet (U8-U10)">Mini-Básquet (U8-U10)</option>
                    <option value="Infantil (U12-U14)">Infantil (U12-U14)</option>
                    <option value="Juvenil (U16-U18)">Juvenil (U16-U18)</option>
                    <option value="Clínicas de Tecnificación & Tiro">Clínicas de Tiro</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Posición</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  >
                    <option value="Iniciación">Iniciación</option>
                    <option value="Formativo">Formativo</option>
                    <option value="Base (PG)">Base (PG)</option>
                    <option value="Escolta (SG)">Escolta (SG)</option>
                    <option value="Alero (SF)">Alero (SF)</option>
                    <option value="Ala-Pívot (PF)">Ala-Pívot (PF)</option>
                    <option value="Pívot (C)">Pívot (C)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Número Dorsal</label>
                  <input
                    type="number"
                    value={formData.jerseyNumber}
                    onChange={(e) => setFormData({ ...formData, jerseyNumber: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Monto Cuota (₡) *</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 space-y-3">
                <span className="text-xs font-bold text-golden-400 uppercase">Tutor Legal</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-300 uppercase mb-1">Nombre del Tutor *</label>
                    <input
                      type="text"
                      required
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-300 uppercase mb-1">Teléfono WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Observaciones Médicas</label>
                <textarea
                  rows={2}
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 font-bold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-golden-500"
                  />
                  <span>Atleta Activo</span>
                </label>

                <div className="flex gap-2">
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
                    Guardar Atleta
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal View Athlete Card */}
      {viewingPlayer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setViewingPlayer(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-dark-800 border-2 border-golden-500 flex items-center justify-center shrink-0">
                {viewingPlayer.photoUrl ? (
                  <img src={viewingPlayer.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-golden-400 text-lg">#{viewingPlayer.jerseyNumber || "G"}</span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-golden-400 uppercase">{viewingPlayer.category}</span>
                <h3 className="text-xl font-black text-white">{viewingPlayer.fullName}</h3>
                <p className="text-xs text-gray-400">{viewingPlayer.position || "Formativo"}</p>
              </div>
            </div>

            <div className="space-y-3 bg-dark-800/80 p-4 rounded-2xl border border-gray-800 text-xs">
              <div className="flex justify-between border-b border-gray-700 pb-1.5">
                <span className="text-gray-400">Tutor:</span>
                <strong className="text-white">{viewingPlayer.guardianName}</strong>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-1.5">
                <span className="text-gray-400">WhatsApp:</span>
                <a href={`https://wa.me/506${viewingPlayer.guardianPhone.replace(/\D/g,"")}`} className="text-emerald-400 font-bold hover:underline">
                  {viewingPlayer.guardianPhone}
                </a>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-1.5">
                <span className="text-gray-400">Mensualidad:</span>
                <strong className="text-golden-400 font-bold">₡{viewingPlayer.monthlyFee.toLocaleString("es-CR")}</strong>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Observaciones Médicas:</span>
                <p className="text-gray-200 italic">{viewingPlayer.medicalNotes || "Sin observaciones."}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/506${viewingPlayer.guardianPhone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(viewingPlayer.guardianName)},%20le%20saludamos%20de%20Golden%20Sport%20Academy%20Santa%20Cruz.`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
            >
              <Phone className="w-4 h-4" />
              WhatsApp Tutor ({viewingPlayer.guardianPhone})
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
