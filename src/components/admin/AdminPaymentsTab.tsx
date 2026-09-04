"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  DollarSign, 
  Calendar,
  X,
  FileText,
  FileSpreadsheet,
  Download
} from "lucide-react";
import { SystemSettings, PaymentRecord, Player } from "@/types";
import { Store } from "@/lib/store";
import { generatePaymentWhatsAppMessage } from "@/lib/whatsapp";

interface Props {
  payments: PaymentRecord[];
  players: Player[];
  settings: SystemSettings;
  onRefresh: () => void;
}

export default function AdminPaymentsTab({ payments, players, settings, onRefresh }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<string>("Septiembre");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal registrar pago
  const [payingRecord, setPayingRecord] = useState<PaymentRecord | null>(null);
  const [payMethod, setPayMethod] = useState<string>("Sinpe Móvil");
  const [payNotes, setPayNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Filter payments by selected month/year and search
  const currentMonthPayments = payments.filter(
    (p) => p.month === selectedMonth && p.year === selectedYear
  );

  const filtered = (currentMonthPayments.length > 0 ? currentMonthPayments : payments).filter((p) => {
    const matchSearch =
      p.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.guardianPhone.includes(searchTerm);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // KPI calculations
  const totalDue = filtered.reduce((acc, curr) => acc + curr.amount, 0);
  const paidList = filtered.filter((p) => p.status === "pagado");
  const pendingList = filtered.filter((p) => p.status === "pendiente");
  const overdueList = filtered.filter((p) => p.status === "atrasado");

  const totalPaid = paidList.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = pendingList.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = overdueList.reduce((acc, curr) => acc + curr.amount, 0);

  const collectionRate = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

  const handleGenerateMonthly = async () => {
    setIsGenerating(true);
    for (const player of players.filter(p => p.isActive)) {
      const existing = payments.find(p => p.playerId === player.id && p.month === selectedMonth && p.year === selectedYear);
      if (!existing) {
        await Store.addPayment({
          playerId: player.id,
          playerName: player.fullName,
          guardianName: player.guardianName,
          guardianPhone: player.guardianPhone,
          month: selectedMonth,
          year: selectedYear,
          amount: player.monthlyFee,
          status: "pendiente",
          dueDate: `${selectedYear}-${(months.indexOf(selectedMonth) + 1).toString().padStart(2, '0')}-05`
        });
      }
    }
    setIsGenerating(false);
    onRefresh();
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingRecord) return;
    await Store.updatePaymentStatus(payingRecord.id, "pagado", payNotes || "SINPE-CONFIRMADO");
    setPayingRecord(null);
    setPayNotes("");
    onRefresh();
  };

  const handleExportCSV = () => {
    const headers = ["ID Recibo", "Atleta", "Tutor", "Teléfono WhatsApp", "Mes", "Año", "Monto", "Estado", "Fecha Vencimiento", "Referencia Sinpe"];
    const rows = filtered.map(p => [
      p.id,
      `"${p.playerName}"`,
      `"${p.guardianName}"`,
      p.guardianPhone,
      p.month,
      p.year,
      p.amount,
      p.status,
      p.dueDate,
      `"${p.sinpeReference || 'Pendiente'}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Control_Pagos_${selectedMonth}_${selectedYear}_Golden_Sport.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Gestión de Cobranzas & Mensajería a Padres
          </h2>
          <p className="text-xs text-gray-400">
            Control de mensualidades, generación de recibos y recordatorios automáticos por WhatsApp con Sinpe (6280-6989).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-dark-800 px-3 py-1.5 rounded-xl border border-gray-700">
            <Calendar className="w-4 h-4 text-golden-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-white text-xs font-bold focus:outline-none"
            >
              {months.map((m) => (
                <option key={m} value={m} className="bg-dark-900 text-white">
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-golden-400 text-xs font-bold focus:outline-none"
            >
              <option value={2026} className="bg-dark-900 text-white">2026</option>
              <option value={2027} className="bg-dark-900 text-white">2027</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-emerald-400 font-bold text-xs uppercase border border-emerald-500/30 transition-colors shadow-md"
            title="Exportar a CSV / Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          {/* Generate Button */}
          <button
            onClick={handleGenerateMonthly}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? "Generando..." : `Generar Cuotas de ${selectedMonth}`}
          </button>
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 space-y-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Total Facturado ({selectedMonth})</span>
          <p className="text-2xl font-black text-white">₡{totalDue.toLocaleString("es-CR")}</p>
          <div className="w-full bg-dark-900 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-golden-500 h-full" style={{ width: `${collectionRate}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase">Recaudado / Al Día ({paidList.length})</span>
          <p className="text-2xl font-black text-emerald-400">₡{totalPaid.toLocaleString("es-CR")}</p>
          <p className="text-[10px] text-gray-400">{collectionRate}% de cumplimiento de cobro</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase">Pendientes ({pendingList.length})</span>
          <p className="text-2xl font-black text-amber-400">₡{totalPending.toLocaleString("es-CR")}</p>
          <p className="text-[10px] text-gray-400">Por vencer o en trámite de Sinpe</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 space-y-1">
          <span className="text-[11px] font-bold text-red-400 uppercase">Vencidos ({overdueList.length})</span>
          <p className="text-2xl font-black text-red-400">₡{totalOverdue.toLocaleString("es-CR")}</p>
          <p className="text-[10px] text-red-300">Requieren recordatorio urgente</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por atleta o tutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-golden-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "all" ? "bg-golden-500 text-dark-900" : "bg-dark-900 text-gray-400"
            }`}
          >
            Todos ({filtered.length})
          </button>
          <button
            onClick={() => setStatusFilter("pagado")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "pagado" ? "bg-emerald-600 text-white" : "bg-dark-900 text-gray-400"
            }`}
          >
            Al Día ({paidList.length})
          </button>
          <button
            onClick={() => setStatusFilter("pendiente")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "pendiente" ? "bg-amber-600 text-white" : "bg-dark-900 text-gray-400"
            }`}
          >
            Pendientes ({pendingList.length})
          </button>
          <button
            onClick={() => setStatusFilter("atrasado")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "atrasado" ? "bg-red-600 text-white" : "bg-dark-900 text-gray-400"
            }`}
          >
            Vencidos ({overdueList.length})
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-dark-800 rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-dark-900/90 text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-700/80">
              <tr>
                <th className="py-3.5 px-4">Jugador / Atleta</th>
                <th className="py-3.5 px-4">Tutor Legal & Celular</th>
                <th className="py-3.5 px-4">Mes & Monto</th>
                <th className="py-3.5 px-4">Fecha Límite</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Notificación / Cobro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No hay registros de cuotas generadas para este periodo. Haz clic en "Generar Cuotas".
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isPaid = p.status === "pagado";
                  const isOverdue = p.status === "atrasado";
                  const waMessage = generatePaymentWhatsAppMessage(p, settings);

                  return (
                    <tr key={p.id} className="hover:bg-dark-700/40 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-white text-sm">{p.playerName}</p>
                        {p.sinpeReference && <p className="text-[10px] text-gray-400 italic">Ref: {p.sinpeReference}</p>}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-200">{p.guardianName}</p>
                        <span className="text-[11px] text-gray-400">{p.guardianPhone}</span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-black text-white text-sm">
                          ₡{p.amount.toLocaleString("es-CR")}
                        </p>
                        <span className="text-[10px] text-golden-400 font-semibold">{p.month}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-300">{p.dueDate}</span>
                        {p.paymentDate && (
                          <p className="text-[10px] text-emerald-400">Pagado el: {p.paymentDate}</p>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {isPaid ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Al Día
                          </span>
                        ) : isOverdue ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Vencido
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1">
                            Pendiente
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {!isPaid && (
                          <a
                            href={`https://wa.me/506${p.guardianPhone.replace(/\D/g, "")}?text=${encodeURIComponent(waMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                            title="Enviar aviso estructurado de cobro por WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Cobrar WhatsApp</span>
                          </a>
                        )}

                        {!isPaid ? (
                          <button
                            onClick={() => setPayingRecord(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-bold text-xs shadow-md transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Registrar Pago
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-500 font-semibold italic">
                            Comprobante listo
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL REGISTRAR PAGO */}
      {payingRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setPayingRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase">
                Confirmación de Mensualidad
              </span>
              <h3 className="text-xl font-black text-white uppercase">
                Registrar Pago de {payingRecord.playerName}
              </h3>
              <p className="text-xs text-gray-400">
                Periodo: {payingRecord.month} • Monto: ₡{payingRecord.amount.toLocaleString("es-CR")}
              </p>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Método de Pago *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white text-xs focus:border-golden-500"
                >
                  <option value="Sinpe Móvil">Sinpe Móvil (6280-6989)</option>
                  <option value="Transferencia">Transferencia Bancaria (IBAN)</option>
                  <option value="Efectivo">Efectivo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Número de Comprobante / Referencia Sinpe
                </label>
                <input
                  type="text"
                  placeholder="Ej. SINPE-992810"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white text-xs placeholder-gray-500 focus:border-golden-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingRecord(null)}
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 text-gray-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase shadow-lg"
                >
                  Confirmar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
