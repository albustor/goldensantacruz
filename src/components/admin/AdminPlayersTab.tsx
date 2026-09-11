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
  FileSpreadsheet,
  CameraOff,
  Camera,
  AlertTriangle,
  MapPin,
  GraduationCap,
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Player, PlayerCategory } from "@/types";
import { Store } from "@/lib/store";
import CategorySelect from "@/components/common/CategorySelect";
import CategoryManagerModal from "@/components/admin/CategoryManagerModal";

interface Props {
  players: Player[];
  onRefresh: () => void;
}

export default function AdminPlayersTab({ players, onRefresh }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [filterPhotoAuth, setFilterPhotoAuth] = useState<"all" | "no_photos" | "authorized">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatManagerOpen, setIsCatManagerOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    age: "",
    category: "Iniciación / Menores de U8 (U6-U8)",
    jerseyNumber: 0,
    position: "Iniciación",
    address: "",
    school: "",
    medicalNotes: "",
    photoAuthorized: true,
    photoAuthNotes: "",
    tshirtSize: "10",
    bloodType: "O+",
    emergencyContactName: "",
    emergencyContactPhone: "",
    idCardNumber: "",
    dominantHand: "Diestro",
    guardianName: "",
    guardianPhone: "62806989",
    guardianEmail: "",
    monthlyFee: 10000,
    paymentStatus: "al_dia" as any,
    isActive: true,
    photoUrl: "",
    registrationDate: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await Store.getCategories();
    setCategories(cats);
  };

  // Atletas con restricción estricta de fotografía
  const noPhotoPlayers = players.filter((p) => p.photoAuthorized === false);

  const handleOpenCreate = () => {
    setEditingPlayer(null);
    setFormData({
      fullName: "",
      birthDate: "",
      age: "",
      category: "Iniciación / Menores de U8 (U6-U8)",
      jerseyNumber: 0,
      position: "Iniciación",
      address: "",
      school: "",
      medicalNotes: "",
      photoAuthorized: true,
      photoAuthNotes: "Autorizado para difusión y redes sociales",
      tshirtSize: "10",
      bloodType: "O+",
      emergencyContactName: "",
      emergencyContactPhone: "",
      idCardNumber: "",
      dominantHand: "Diestro",
      guardianName: "",
      guardianPhone: "62806989",
      guardianEmail: "",
      monthlyFee: 10000,
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
      age: player.age ? String(player.age) : "",
      category: player.category,
      jerseyNumber: player.jerseyNumber || 0,
      position: player.position || "Formativo",
      address: player.address || "",
      school: player.school || "",
      medicalNotes: player.medicalNotes || "",
      photoAuthorized: player.photoAuthorized !== false,
      photoAuthNotes: player.photoAuthNotes || "",
      tshirtSize: player.tshirtSize || "10",
      bloodType: player.bloodType || "O+",
      emergencyContactName: player.emergencyContactName || "",
      emergencyContactPhone: player.emergencyContactPhone || "",
      idCardNumber: player.idCardNumber || "",
      dominantHand: player.dominantHand || "Diestro",
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
    const headers = [
      "ID",
      "Nombre Completo",
      "Fecha Nacimiento",
      "Edad",
      "Categoría",
      "Posición",
      "Dorsal",
      "Centro Educativo",
      "Dirección Residencia",
      "Tutor Legal",
      "Teléfono WhatsApp",
      "Email",
      "Autorización Imagen",
      "Observaciones Médicas",
      "Cuota Mensual",
      "Estado"
    ];
    const rows = players.map(p => [
      p.id,
      `"${p.fullName}"`,
      `"${p.birthDate || ''}"`,
      `"${p.age || ''}"`,
      `"${p.category}"`,
      `"${p.position || 'Formativo'}"`,
      p.jerseyNumber || "N/A",
      `"${p.school || 'N/A'}"`,
      `"${p.address || 'N/A'}"`,
      `"${p.guardianName}"`,
      `"${p.guardianPhone}"`,
      p.guardianEmail || "N/A",
      p.photoAuthorized === false ? "NO AUTORIZADO (PROHIBIDO FOTOS/VIDEOS)" : "SI AUTORIZADO",
      `"${p.medicalNotes || 'Ninguna'}"`,
      p.monthlyFee,
      p.isActive ? "Activo" : "Inactivo"
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Padron_Oficial_Atletas_Golden_Sport_Santa_Cruz_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = players.filter((p) => {
    const fullName = p.fullName.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      p.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.guardianPhone.includes(searchTerm) ||
      (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.school && p.school.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCat = filterCategory === "Todas" || p.category === filterCategory;

    const matchesPhoto =
      filterPhotoAuth === "all" ||
      (filterPhotoAuth === "no_photos" && p.photoAuthorized === false) ||
      (filterPhotoAuth === "authorized" && p.photoAuthorized !== false);

    return matchesSearch && matchesCat && matchesPhoto;
  });

  return (
    <div className="space-y-6">
      
      {/* ⚠️ BANNER EXCLUSIVO DE PROTECCIÓN DE IMAGEN / NO FOTOS */}
      {noPhotoPlayers.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-rose-950/90 to-red-950/80 border-2 border-red-500/70 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>Protección Especial de Imagen: {noPhotoPlayers.length} Atletas sin Autorización Fotográfica</span>
                </h3>
                <p className="text-xs text-rose-200">
                  Por disposición expresa de sus padres/tutores, <strong>NO deben publicarse fotos ni videos</strong> de estos atletas en redes sociales ni medios digitales.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFilterPhotoAuth("no_photos");
                setFilterCategory("Todas");
              }}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 shrink-0"
            >
              <CameraOff className="w-4 h-4" />
              <span>Ver Atletas Protegidos ({noPhotoPlayers.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-red-800/60">
            {noPhotoPlayers.map((np) => (
              <div
                key={np.id}
                className="p-3 rounded-2xl bg-dark-950/80 border border-red-500/40 flex items-center justify-between gap-3 cursor-pointer hover:border-red-400 transition-colors"
                onClick={() => setViewingPlayer(np)}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <strong className="text-xs font-black text-white uppercase">{np.fullName}</strong>
                  </div>
                  <p className="text-[11px] text-rose-300">
                    Tutor: <strong>{np.guardianName}</strong> • Tel: {np.guardianPhone}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Sede/Residencia: {np.address || "Santa Bárbara"} • {np.school}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-300 text-[10px] font-black uppercase border border-red-500/40 shrink-0">
                  🚫 NO FOTOS
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Padrón Oficial de Atletas ({players.length})
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-golden-500 text-dark-900">
              Formulario Oficial 2026
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Registro integral de jugadores, encargados, números de contacto, residencias y centros educativos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCatManagerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-200 font-bold text-xs uppercase border border-gray-700 shadow-md"
            title="Administrar, crear, editar o eliminar categorías"
          >
            <span>Gestionar Categorías</span>
          </button>

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
      <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar atleta, tutor, teléfono, residencia o escuela..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-golden-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Quick Photo Authorization Tabs */}
          <button
            onClick={() => setFilterPhotoAuth("all")}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              filterPhotoAuth === "all"
                ? "bg-golden-500 text-dark-900 font-black"
                : "bg-dark-900 text-gray-400 hover:text-white border border-gray-700"
            }`}
          >
            Todos ({players.length})
          </button>
          <button
            onClick={() => setFilterPhotoAuth("authorized")}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
              filterPhotoAuth === "authorized"
                ? "bg-emerald-600 text-white font-black"
                : "bg-dark-900 text-emerald-400/80 hover:text-emerald-300 border border-emerald-500/30"
            }`}
          >
            📷 Con Consentimiento ({players.filter(p => p.photoAuthorized !== false).length})
          </button>
          <button
            onClick={() => setFilterPhotoAuth("no_photos")}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1 ${
              filterPhotoAuth === "no_photos"
                ? "bg-red-600 text-white font-black"
                : "bg-dark-900 text-red-400/90 hover:text-red-300 border border-red-500/40"
            }`}
          >
            <CameraOff className="w-3.5 h-3.5" />
            <span>🚫 Sin Fotos ({noPhotoPlayers.length})</span>
          </button>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-golden-400 shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:border-golden-500"
            >
              <option value="Todas">Todas las Categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-800 rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-dark-900/90 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-700/80">
              <tr>
                <th className="py-3.5 px-4">Jugador / Atleta</th>
                <th className="py-3.5 px-4">Autorización Imagen</th>
                <th className="py-3.5 px-4">Categoría & Edad</th>
                <th className="py-3.5 px-4">Tutor Legal & Celular</th>
                <th className="py-3.5 px-4">Residencia & Escuela</th>
                <th className="py-3.5 px-4">Cuota</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No se encontraron jugadores que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filtered.map((player) => {
                  const isRestricted = player.photoAuthorized === false;
                  return (
                    <tr 
                      key={player.id} 
                      className={`hover:bg-dark-700/40 transition-colors ${
                        isRestricted ? "bg-red-950/20" : ""
                      }`}
                    >
                      {/* Jugador */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl overflow-hidden bg-dark-900 border shrink-0 flex items-center justify-center ${
                            isRestricted ? "border-red-500/60 bg-red-950/40" : "border-golden-500/40"
                          }`}>
                            {player.photoUrl ? (
                              <img src={player.photoUrl} alt={player.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span className={`font-black text-xs ${isRestricted ? "text-red-400" : "text-golden-400"}`}>
                                #{player.jerseyNumber || "G"}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm flex items-center gap-1.5">
                              <span>{player.fullName}</span>
                              {player.medicalNotes && player.medicalNotes !== "Ninguna" && player.medicalNotes !== "No" && player.medicalNotes !== "NA" && player.medicalNotes !== "Sin pedecimientos." && (
                                <span title={`Médico: ${player.medicalNotes}`} className="text-amber-400">
                                  <HeartPulse className="w-3.5 h-3.5 inline" />
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Nacimiento: {player.birthDate || "No indicada"} {player.age ? `(${player.age})` : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Autorización Imagen */}
                      <td className="py-3 px-4">
                        {isRestricted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-600 text-white border border-red-400 shadow-md">
                            <CameraOff className="w-3 h-3" />
                            <span>NO FOTOS</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Autorizado</span>
                          </span>
                        )}
                      </td>

                      {/* Categoría & Edad */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-golden-400 block">
                          {player.category}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {player.position || "Formativo"} {player.jerseyNumber ? `• Dorsal #${player.jerseyNumber}` : ""}
                        </span>
                      </td>

                      {/* Tutor & Celular */}
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

                      {/* Residencia & Escuela */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-start gap-1 text-[11px] text-gray-300">
                          <MapPin className="w-3 h-3 text-golden-500 shrink-0 mt-0.5" />
                          <span className="truncate" title={player.address || "Santa Bárbara"}>
                            {player.address || "Santa Bárbara"}
                          </span>
                        </div>
                        {player.school && (
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-0.5">
                            <GraduationCap className="w-3 h-3 text-gray-500 shrink-0" />
                            <span className="truncate" title={player.school}>
                              {player.school}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Cuota */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-white">
                          ₡{player.monthlyFee.toLocaleString("es-CR")}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => setViewingPlayer(player)}
                          className="p-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors"
                          title="Ver Ficha Completa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(player)}
                          className="p-1.5 rounded-lg bg-golden-500/20 hover:bg-golden-500/30 text-golden-400 transition-colors"
                          title="Editar Jugador"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(player.id, player.fullName)}
                          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                          title="Eliminar Jugador"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit / Create */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-2xl bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
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
              
              {/* Sección de Autorización de Imagen */}
              <div className={`p-4 rounded-2xl border ${
                !formData.photoAuthorized 
                  ? "bg-red-950/40 border-red-500/60" 
                  : "bg-dark-800/80 border-gray-700"
              } space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase flex items-center gap-1.5 text-xs text-white">
                    {!formData.photoAuthorized ? <CameraOff className="w-4 h-4 text-red-400" /> : <Camera className="w-4 h-4 text-emerald-400" />}
                    <span>Autorización de Uso de Imagen (Fotos/Videos)</span>
                  </span>
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.photoAuthorized}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        photoAuthorized: e.target.checked,
                        photoAuthNotes: e.target.checked 
                          ? "Autorizado para difusión y redes sociales" 
                          : "PROHIBIDO: Sin autorización de imagen para fotos/videos en redes sociales"
                      })}
                      className="w-4 h-4 rounded text-golden-500"
                    />
                    <span className={formData.photoAuthorized ? "text-emerald-400 font-bold" : "text-red-400 font-black uppercase"}>
                      {formData.photoAuthorized ? "Autorizado" : "NO Autorizado (Restringido)"}
                    </span>
                  </label>
                </div>
                {!formData.photoAuthorized && (
                  <p className="text-[11px] text-rose-300">
                    ⚠️ <strong>Restricción activa:</strong> No se permite la toma ni publicación de fotos o videos de este atleta en redes sociales ni material publicitario.
                  </p>
                )}
              </div>

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
                  <label className="block font-bold text-gray-300 uppercase mb-1">Fecha Nacimiento / Edad</label>
                  <input
                    type="text"
                    placeholder="Ej. 24-06-2014 / 12 años"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>
                {/* Selector Dinámico de Categorías */}
                <CategorySelect
                  value={formData.category}
                  onChange={(cat) => setFormData({ ...formData, category: cat })}
                  label="Categoría"
                  required
                />
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

              {/* Residencia & Escuela */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Dirección de Residencia</label>
                  <input
                    type="text"
                    placeholder="Ej. Santa Bárbara, Guaitil, Oriente..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Centro Educativo (Escuela / Colegio)</label>
                  <input
                    type="text"
                    placeholder="Ej. Escuela Guaitil, CEEES..."
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  />
                </div>
              </div>

              {/* Perfil Físico & Uniforme */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  <label className="block font-bold text-gray-300 uppercase mb-1">Talla Uniforme</label>
                  <select
                    value={formData.tshirtSize}
                    onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  >
                    <option value="6">Talla 6</option>
                    <option value="8">Talla 8</option>
                    <option value="10">Talla 10</option>
                    <option value="12">Talla 12</option>
                    <option value="14">Talla 14</option>
                    <option value="16">Talla 16</option>
                    <option value="XS">XS (Adulto)</option>
                    <option value="S">S (Adulto)</option>
                    <option value="M">M (Adulto)</option>
                    <option value="L">L (Adulto)</option>
                    <option value="XL">XL (Adulto)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Tipo de Sangre</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="Desconocido">Desconocido</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">Mano Dominante</label>
                  <select
                    value={formData.dominantHand}
                    onChange={(e) => setFormData({ ...formData, dominantHand: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                  >
                    <option value="Diestro">Diestro</option>
                    <option value="Zurdo">Zurdo</option>
                    <option value="Ambidiestro">Ambidiestro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Monto Cuota Mensual (₡) *</label>
                <input
                  type="number"
                  required
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                />
              </div>

              <div className="pt-2 border-t border-gray-800 space-y-3">
                <span className="text-xs font-bold text-golden-400 uppercase">Tutor Legal / Encargado Principal</span>
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
                    <label className="block font-bold text-gray-300 uppercase mb-1">Teléfono WhatsApp / Cobros *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 88994502"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contacto de Emergencia Alternativo */}
              <div className="pt-2 border-t border-gray-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase">Contacto de Emergencia Alternativo (Opcional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-300 uppercase mb-1">Nombre Contacto Alternativo</label>
                    <input
                      type="text"
                      placeholder="Ej. Abuelo, Tía, Vecino..."
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-300 uppercase mb-1">Teléfono de Emergencia</label>
                    <input
                      type="tel"
                      placeholder="Ej. 85938151"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-dark-800 border border-gray-700 text-white focus:border-golden-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">Información Médica Relevante</label>
                <textarea
                  rows={2}
                  placeholder="Ej. Asma, alergias a medicamentos, ninguna..."
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-md bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setViewingPlayer(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Alerta de no fotos si aplica */}
            {viewingPlayer.photoAuthorized === false && (
              <div className="p-3.5 rounded-2xl bg-red-950/90 border-2 border-red-500 flex items-center gap-2.5 text-xs text-red-200">
                <CameraOff className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
                <div>
                  <strong className="text-white block uppercase">Atleta Sin Autorización de Imagen</strong>
                  <span>No publicar fotografías ni videos en redes sociales.</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl overflow-hidden bg-dark-800 border-2 flex items-center justify-center shrink-0 ${
                viewingPlayer.photoAuthorized === false ? "border-red-500 bg-red-950/40" : "border-golden-500"
              }`}>
                {viewingPlayer.photoUrl ? (
                  <img src={viewingPlayer.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className={`font-black text-lg ${viewingPlayer.photoAuthorized === false ? "text-red-400" : "text-golden-400"}`}>
                    #{viewingPlayer.jerseyNumber || "G"}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-golden-400 uppercase">{viewingPlayer.category}</span>
                <h3 className="text-xl font-black text-white">{viewingPlayer.fullName}</h3>
                <p className="text-xs text-gray-400">
                  {viewingPlayer.position || "Formativo"} {viewingPlayer.age ? `• ${viewingPlayer.age}` : ""}
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-dark-800/80 p-4 rounded-2xl border border-gray-800 text-xs">
              <div className="flex justify-between border-b border-gray-700 pb-1.5">
                <span className="text-gray-400">Tutor Legal:</span>
                <strong className="text-white">{viewingPlayer.guardianName}</strong>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-1.5">
                <span className="text-gray-400">WhatsApp Cobros:</span>
                <a href={`https://wa.me/506${viewingPlayer.guardianPhone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">
                  {viewingPlayer.guardianPhone}
                </a>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-1.5">
                <span className="text-gray-400">Residencia:</span>
                <strong className="text-gray-200 text-right">{viewingPlayer.address || "Santa Bárbara"}</strong>
              </div>
              {viewingPlayer.school && (
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span className="text-gray-400">Centro Educativo:</span>
                  <strong className="text-gray-200 text-right">{viewingPlayer.school}</strong>
                </div>
              )}
              {viewingPlayer.tshirtSize && (
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span className="text-gray-400">Talla Uniforme:</span>
                  <strong className="text-white">Talla {viewingPlayer.tshirtSize}</strong>
                </div>
              )}
              {viewingPlayer.bloodType && (
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span className="text-gray-400">Tipo de Sangre:</span>
                  <strong className="text-rose-400 font-bold">{viewingPlayer.bloodType}</strong>
                </div>
              )}
              {viewingPlayer.emergencyContactName && (
                <div className="flex justify-between border-b border-gray-700 pb-1.5">
                  <span className="text-gray-400">Contacto Emergencia:</span>
                  <span className="text-gray-200">{viewingPlayer.emergencyContactName} ({viewingPlayer.emergencyContactPhone})</span>
                </div>
              )}
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase shadow-lg transition-transform hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              <span>Contactar Tutor ({viewingPlayer.guardianPhone})</span>
            </a>
          </div>
        </div>
      )}

      {/* Modal General de Gestión de Categorías */}
      <CategoryManagerModal
        categories={categories}
        isOpen={isCatManagerOpen}
        onClose={() => setIsCatManagerOpen(false)}
        onCategoriesChange={(updated) => {
          setCategories(updated);
          loadCategories();
        }}
      />
    </div>
  );
}

