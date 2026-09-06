"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  Sparkles, 
  Search, 
  Send, 
  Calendar,
  X,
  FileSpreadsheet,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  HeartHandshake,
  Clock,
  MessageSquare
} from "lucide-react";
import { SystemSettings, PaymentRecord, Player } from "@/types";
import { Store } from "@/lib/store";
import { 
  ReminderLevel, 
  REMINDER_LEVELS, 
  getSuggestedReminderLevel, 
  generatePaymentWhatsAppMessage, 
  generatePaymentEmailContent,
  createWhatsAppPaymentLink,
  createEmailPaymentLink,
  generatePaymentReceiptWhatsApp,
  createPaymentReceiptWhatsAppLink,
  formatWhatsAppNumber
} from "@/lib/whatsapp";

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

  // Modal de notificación escalonada
  const [activeNotifyPayment, setActiveNotifyPayment] = useState<PaymentRecord | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ReminderLevel>("nivel1_preventivo");
  const [copied, setCopied] = useState(false);
  const [isSendingEvolution, setIsSendingEvolution] = useState(false);
  const [evolutionStatus, setEvolutionStatus] = useState<string | null>(null);

  // Modal de barrido automático
  const [isSweepOpen, setIsSweepOpen] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepResult, setSweepResult] = useState<any>(null);
  const [sweepTestPhone, setSweepTestPhone] = useState("60602617");

  // Modal de comprobante / recibo enviado
  const [receiptRecord, setReceiptRecord] = useState<PaymentRecord | null>(null);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Map players for easy lookup (e.g. email)
  const playersMap = new Map(players.map(p => [p.id, p]));

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
        // Fecha de corte oficial: Día 12 de cada mes
        const monthNum = (months.indexOf(selectedMonth) + 1).toString().padStart(2, '0');
        await Store.addPayment({
          playerId: player.id,
          playerName: player.fullName,
          guardianName: player.guardianName,
          guardianPhone: player.guardianPhone,
          month: selectedMonth,
          year: selectedYear,
          amount: player.monthlyFee || settings.monthlyFeeDefault || 10000,
          status: "pendiente",
          dueDate: `${selectedYear}-${monthNum}-12`
        });
      }
    }
    setIsGenerating(false);
    onRefresh();
  };

  const handleConfirmPayment = async (e?: React.FormEvent, sendWhatsAppReceipt = false) => {
    if (e) e.preventDefault();
    if (!payingRecord) return;
    
    const finalRef = payNotes.trim() || `SINPE-${Math.floor(100000 + Math.random() * 900000)}`;
    await Store.updatePaymentStatus(payingRecord.id, "pagado", finalRef);

    if (sendWhatsAppReceipt) {
      const updatedRecord = { ...payingRecord, sinpeReference: finalRef, status: "pagado" as const };
      const waLink = createPaymentReceiptWhatsAppLink(updatedRecord, settings, finalRef);
      window.open(waLink, "_blank");
    }

    setPayingRecord(null);
    setPayNotes("");
    onRefresh();
  };

  const handleOpenNotifyModal = (payment: PaymentRecord) => {
    const suggested = getSuggestedReminderLevel(payment);
    setSelectedLevel(suggested);
    setActiveNotifyPayment(payment);
    setCopied(false);
    setEvolutionStatus(null);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendDirectEvolution = async () => {
    if (!activeNotifyPayment) return;
    setIsSendingEvolution(true);
    setEvolutionStatus(null);
    try {
      const res = await fetch("/api/notificaciones/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reminder",
          phone: activeNotifyPayment.guardianPhone,
          level: selectedLevel,
          payment: activeNotifyPayment,
          settings: settings,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvolutionStatus("success");
      } else {
        setEvolutionStatus(`error: ${data.error || "No se pudo enviar"}`);
      }
    } catch (err: any) {
      setEvolutionStatus(`error: ${err.message}`);
    } finally {
      setIsSendingEvolution(false);
    }
  };

  const handleRunSweep = async (isDryRun: boolean) => {
    setIsSweeping(true);
    setSweepResult(null);
    try {
      const url = `/api/cron/cobranzas-automaticas?dryRun=${isDryRun}&testPhone=${encodeURIComponent(sweepTestPhone)}`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      setSweepResult(data);
      if (!isDryRun) {
        onRefresh();
      }
    } catch (err: any) {
      setSweepResult({ error: err.message });
    } finally {
      setIsSweeping(false);
    }
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
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Control de Cobranzas & Mensajería Escalonada
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-golden-500 text-dark-900">
              Corte: Día 12
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Recordatorios empáticos (Niveles 1 a 4) y recibos digitales por WhatsApp y Correo.
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

          {/* Evolution API Automated Sweep Trigger */}
          <button
            onClick={() => {
              setIsSweepOpen(true);
              setSweepResult(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 font-bold text-xs uppercase border border-emerald-500/50 transition-all shadow-md"
            title="Ejecutar barrido de cobranza automática vía Evolution API"
          >
            <Send className="w-4 h-4 text-emerald-400" />
            <span>⚡ Barrido Automático</span>
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

      {/* Protocolo Visual de Notificaciones Escalonadas */}
      <div className="p-4 rounded-3xl bg-dark-800/80 border border-golden-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-golden-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Protocolo de Notificaciones Escalonadas y Empáticas (Corte: Día 12)
          </span>
          <span className="text-[11px] text-gray-400">Sinpe Oficial: <strong>{settings.sinpePhone}</strong></span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {REMINDER_LEVELS.map((lvl) => (
            <div key={lvl.id} className="p-3 rounded-2xl bg-dark-900/70 border border-gray-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${lvl.badgeColor}`}>
                  {lvl.title.split(":")[0]}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold">{lvl.timing}</span>
              </div>
              <p className="text-[11px] text-gray-300 font-medium pt-1">{lvl.description}</p>
            </div>
          ))}
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
          <p className="text-[10px] text-gray-400">Fecha de corte: 12 de {selectedMonth}</p>
        </div>

        <div className="p-4 rounded-2xl bg-dark-800 border border-gray-800 space-y-1">
          <span className="text-[11px] font-bold text-red-400 uppercase">Atrasados ({overdueList.length})</span>
          <p className="text-2xl font-black text-red-400">₡{totalOverdue.toLocaleString("es-CR")}</p>
          <p className="text-[10px] text-red-300">Coordinación personalizada</p>
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
                <th className="py-3.5 px-4">Tutor Legal & Contacto</th>
                <th className="py-3.5 px-4">Mes & Monto</th>
                <th className="py-3.5 px-4">Fecha Corte</th>
                <th className="py-3.5 px-4">Estado & Nivel Sugerido</th>
                <th className="py-3.5 px-4 text-right">Gestión de Cobranza & Recibos</th>
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
                  const suggestedLevel = getSuggestedReminderLevel(p);
                  const levelInfo = REMINDER_LEVELS.find(l => l.id === suggestedLevel);
                  const playerObj = playersMap.get(p.playerId);
                  const guardianEmail = playerObj?.guardianEmail;

                  return (
                    <tr key={p.id} className="hover:bg-dark-700/40 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-white text-sm">{p.playerName}</p>
                        {p.sinpeReference && <p className="text-[10px] text-emerald-400 font-mono">Ref: {p.sinpeReference}</p>}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-200">{p.guardianName}</p>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400">
                          <span>📱 {p.guardianPhone}</span>
                          {guardianEmail && <span className="text-gray-500">• ✉️ {guardianEmail}</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-black text-white text-sm">
                          ₡{p.amount.toLocaleString("es-CR")}
                        </p>
                        <span className="text-[10px] text-golden-400 font-semibold">{p.month} {p.year}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-300">{p.dueDate || `12 de ${p.month}`}</span>
                        {p.paymentDate && (
                          <p className="text-[10px] text-emerald-400">Pagado el: {p.paymentDate}</p>
                        )}
                      </td>

                      <td className="py-3 px-4 space-y-1">
                        <div>
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
                        </div>
                        {!isPaid && levelInfo && (
                          <div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${levelInfo.badgeColor}`}>
                              {levelInfo.shortLabel}
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        {!isPaid ? (
                          <>
                            <button
                              onClick={() => handleOpenNotifyModal(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-golden-300 font-bold text-xs border border-golden-500/40 shadow-md transition-all"
                              title="Seleccionar nivel de recordatorio y canal (WhatsApp / Correo)"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-golden-400" />
                              <span>Recordatorio</span>
                            </button>

                            <a
                              href={createWhatsAppPaymentLink(p, settings, suggestedLevel)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                              title="Enviar por WhatsApp directo con mensaje sugerido"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            <button
                              onClick={() => setPayingRecord(p)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs shadow-md transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Registrar Pago
                            </button>
                          </>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            <a
                              href={createPaymentReceiptWhatsAppLink(p, settings, p.sinpeReference)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-400 text-xs font-bold border border-emerald-500/40 transition-all"
                              title="Reenviar comprobante oficial por WhatsApp"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Reenviar Recibo WA</span>
                            </a>
                            <span className="text-[11px] text-gray-400 italic">
                              Pagado
                            </span>
                          </div>
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

      {/* MODAL DE NOTIFICACIÓN ESCALONADA (NIVELES 1 A 4, WHATSAPP & EMAIL) */}
      {activeNotifyPayment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveNotifyPayment(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-black text-golden-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Gestión de Recordatorio Escalonado
              </span>
              <h3 className="text-xl font-black text-white uppercase">
                Notificar a {activeNotifyPayment.guardianName} ({activeNotifyPayment.playerName})
              </h3>
              <p className="text-xs text-gray-400">
                Periodo: {activeNotifyPayment.month} {activeNotifyPayment.year} • Monto: ₡{activeNotifyPayment.amount.toLocaleString("es-CR")} • Fecha de corte: 12 de {activeNotifyPayment.month}
              </p>
            </div>

            {/* Selector de Nivel de Recordatorio */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 uppercase">
                Seleccione el Nivel del Mensaje (Empatía Escalonada):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REMINDER_LEVELS.map((lvl) => {
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? "bg-golden-500/10 border-golden-500 text-white ring-1 ring-golden-500"
                          : "bg-dark-800 border-gray-700/70 text-gray-400 hover:bg-dark-700/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${lvl.badgeColor}`}>
                          {lvl.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300">{lvl.description}</p>
                      <span className="text-[10px] text-golden-400 font-bold block mt-1">{lvl.timing}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vista Previa del Mensaje WhatsApp */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Vista Previa del Mensaje para WhatsApp:</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleCopyMessage(generatePaymentWhatsAppMessage(activeNotifyPayment, settings, selectedLevel))}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-300 hover:text-white px-2.5 py-1 rounded-lg bg-dark-800 border border-gray-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-dark-950 border border-gray-800 text-xs text-gray-200 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                {generatePaymentWhatsAppMessage(activeNotifyPayment, settings, selectedLevel)}
              </div>
            </div>

            {/* Estado de envío Evolution API */}
            {evolutionStatus && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                evolutionStatus === "success" 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" 
                  : "bg-red-500/20 text-red-300 border border-red-500/40"
              }`}>
                {evolutionStatus === "success" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>✓ Mensaje enviado exitosamente a WhatsApp por Evolution API</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{evolutionStatus}</span>
                  </>
                )}
              </div>
            )}

            {/* Acciones de Envío */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendDirectEvolution}
                disabled={isSendingEvolution}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSendingEvolution ? "Enviando por Evolution API..." : "⚡ Enviar Directo a WhatsApp (Evolution API)"}</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={createWhatsAppPaymentLink(activeNotifyPayment, settings, selectedLevel)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-200 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 border border-gray-700 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Abrir en WhatsApp Web</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>

                <a
                  href={createEmailPaymentLink(
                    activeNotifyPayment,
                    settings,
                    playersMap.get(activeNotifyPayment.playerId)?.guardianEmail,
                    selectedLevel
                  )}
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-200 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 border border-gray-700 transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Enviar por Correo</span>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE BARRIDO AUTOMÁTICO DE COBRANZAS (EVOLUTION API) */}
      {isSweepOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-dark-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsSweepOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-gray-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase">
                  Barrido Automatizado de Cobranzas
                </h3>
                <p className="text-xs text-gray-400">
                  Envío programado de mensajes según la política de fechas y estado
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-dark-950 border border-gray-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Política de Fecha Hoy:</span>
                <span className="font-bold text-emerald-400 uppercase">
                  {new Date().getDate() <= 12 ? "Nivel 1 (Preventivo)" : new Date().getDate() <= 15 ? "Nivel 2 (Seguimiento)" : new Date().getDate() <= 18 ? "Nivel 3 (Formativo)" : "Nivel 4 (Opciones / Cierre)"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Pendientes Evaluados:</span>
                <span className="font-bold text-white">
                  {payments.filter(p => p.status === "pendiente" || p.status === "atrasado").length} atletas
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Servidor Evolution API:</span>
                <span className="font-bold text-emerald-400">🟢 Cloud DigitalOcean Conectado</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 uppercase">
                Teléfono de Prueba (Opcional):
              </label>
              <input
                type="text"
                value={sweepTestPhone}
                onChange={(e) => setSweepTestPhone(e.target.value)}
                placeholder="Ej. 60602617"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white text-xs focus:border-emerald-500"
              />
              <p className="text-[11px] text-gray-400">
                Si colocas tu número, todos los mensajes de prueba te llegarán a ti sin enviar a los padres reales.
              </p>
            </div>

            {sweepResult && (
              <div className="p-4 rounded-2xl bg-dark-950 border border-emerald-500/40 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-400">Resultado del Barrido:</span>
                  <span className="text-white">
                    {sweepResult.dryRun ? "SIMULACIÓN" : "ENVÍO REAL"}
                  </span>
                </div>
                <p className="text-gray-300">
                  Enviados: <strong>{sweepResult.dispatchedCount}</strong> • Simulados: <strong>{sweepResult.simulatedCount}</strong> • Errores: <strong>{sweepResult.errorCount}</strong>
                </p>
                {sweepResult.details && sweepResult.details.length > 0 && (
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pt-2 border-t border-gray-800">
                    {sweepResult.details.map((d: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] p-1.5 rounded bg-dark-900">
                        <span className="font-bold text-white">{d.playerName}</span>
                        <span className={`font-black ${d.status === 'enviado' ? 'text-emerald-400' : d.status === 'simulado' ? 'text-blue-400' : 'text-red-400'}`}>
                          {d.status.toUpperCase()} ({d.level})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleRunSweep(true)}
                disabled={isSweeping}
                className="flex-1 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-blue-400 font-bold text-xs uppercase border border-blue-500/40"
              >
                {isSweeping ? "Procesando..." : "🧪 Simulación (Dry Run)"}
              </button>
              <button
                type="button"
                onClick={() => handleRunSweep(false)}
                disabled={isSweeping}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg"
              >
                {isSweeping ? "Enviando..." : "🚀 Ejecutar Barrido Real"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR PAGO CON ENVÍO INMEDIATO DE COMPROBANTE */}
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
              <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Receipt className="w-4 h-4" />
                Registro Oficial de Pago
              </span>
              <h3 className="text-xl font-black text-white uppercase">
                {payingRecord.playerName}
              </h3>
              <p className="text-xs text-gray-400">
                Periodo: {payingRecord.month} {payingRecord.year} • Monto: ₡{payingRecord.amount.toLocaleString("es-CR")}
              </p>
            </div>

            <form onSubmit={(e) => handleConfirmPayment(e, false)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Método de Pago *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white text-xs focus:border-golden-500"
                >
                  <option value="Sinpe Móvil">Sinpe Móvil ({settings.sinpePhone})</option>
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

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleConfirmPayment(undefined, true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Confirmar y Enviar Recibo WhatsApp</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPayingRecord(null)}
                    className="flex-1 py-2.5 rounded-xl bg-dark-800 text-gray-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase shadow-lg"
                  >
                    Solo Guardar Pago
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

