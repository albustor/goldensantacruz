"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileCheck,
  Calendar,
  User,
  Phone,
  ShieldCheck,
  Download,
  Share2,
  RefreshCw,
  Clock,
  Award
} from "lucide-react";
import { Player, SystemSettings } from "@/types";
import { INITIAL_PLAYERS, INITIAL_SETTINGS } from "@/lib/initialData";
import { Store } from "@/lib/store";

interface ReceiptData {
  receiptNumber: string;
  playerId: string;
  playerName: string;
  guardianName: string;
  guardianPhone: string;
  month: string;
  year: number;
  amount: number;
  sinpeReference: string;
  bank: string;
  paymentDate: string;
  registeredAt: string;
  status: string;
}

function ComprobanteContent() {
  const searchParams = useSearchParams();
  const paramPlayerId = searchParams.get("atleta");

  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS.filter((p) => p.isActive));
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(paramPlayerId || "");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("Septiembre");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [manualReference, setManualReference] = useState<string>("");

  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Status & Progress state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const storedPlayers = await Store.getPlayers();
        if (storedPlayers && storedPlayers.length > 0) {
          setPlayers(storedPlayers.filter((p) => p.isActive));
        }
        const stSettings = Store.getSettings();
        if (stSettings) setSettings(stSettings);
      } catch (e) {
        console.error("Error cargando atletas:", e);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (paramPlayerId) {
      setSelectedPlayerId(paramPlayerId);
    }
  }, [paramPlayerId]);

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Por favor selecciona una imagen válida (PNG, JPG o JPEG).");
      return;
    }

    setErrorMsg(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setImagePreview(b64);
      setImageBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) {
      setErrorMsg("Por favor selecciona el nombre del atleta.");
      return;
    }

    if (!imageBase64 && !manualReference) {
      setErrorMsg("Por favor adjunta la foto del comprobante o escribe el número de referencia SINPE.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProcessStep("Enviando comprobante al servidor...");

    try {
      setTimeout(() => setProcessStep("Escaneando comprobante SINPE con Inteligencia Artificial..."), 800);
      setTimeout(() => setProcessStep("Verificando monto y número de referencia..."), 1800);
      setTimeout(() => setProcessStep("Registrando cuota como 'Al Día' en el sistema..."), 2600);
      setTimeout(() => setProcessStep("Notificando confirmación a la Profe Lenny..."), 3200);

      const response = await fetch("/api/pagos/reportar-comprobante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: selectedPlayerId,
          imageBase64: imageBase64,
          manualReference: manualReference,
          month: selectedMonth,
          year: selectedYear,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReceipt(data.receipt);
      } else {
        setErrorMsg(data.error || "Ocurrió un error al procesar el comprobante.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error de conexión al enviar el comprobante.");
    } finally {
      setIsProcessing(false);
      setProcessStep("");
    }
  };

  const filteredPlayers = players.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.guardianPhone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Superior */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-golden-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
          <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded bg-golden-500/10 text-golden-400 border border-golden-500/30">
            Auto-Servicio Oficial
          </span>
        </div>

        {/* Tarjeta de Identidad */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-dark-900 border border-golden-500/30 shadow-xl shadow-golden-500/5">
            <Image
              src="/logo.png"
              alt="Golden Sport Academy"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Reportar Comprobante <span className="text-golden-400">SINPE Móvil</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto">
            Sube la captura de tu transferencia. Nuestro sistema con IA validará los datos de inmediato, actualizará tu estado y te generará tu recibo oficial.
          </p>
        </div>

        {/* SI YA SE GENERÓ EL RECIBO CON ÉXITO */}
        {receipt ? (
          <div className="bg-dark-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                ¡Pago Registrado y Verificado!
              </h2>
              <p className="text-xs text-emerald-400 font-bold">
                Tu cuota ha sido marcada como "Al Día" y se notificó a la Profe Lenny.
              </p>
            </div>

            {/* Comprobante Digital Estilo Voucher Oficial */}
            <div className="bg-dark-950 border border-golden-500/30 rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
                <Award className="w-48 h-48 text-golden-400" />
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Recibo Oficial
                  </span>
                  <p className="text-sm font-black text-golden-400 font-mono">
                    {receipt.receiptNumber}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Al Día
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Atleta</span>
                  <p className="font-bold text-white text-sm">{receipt.playerName}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Tutor</span>
                  <p className="font-medium text-gray-200">{receipt.guardianName}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Periodo</span>
                  <p className="font-bold text-golden-300">{receipt.month} {receipt.year}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Monto Validado</span>
                  <p className="font-black text-white text-sm">₡{receipt.amount.toLocaleString("es-CR")}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Ref. SINPE</span>
                  <p className="font-mono text-emerald-400 font-bold">{receipt.sinpeReference}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Fecha Depósito</span>
                  <p className="text-gray-300">{receipt.paymentDate}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400 text-center space-y-1">
                <p className="font-semibold text-golden-400/90">
                  Golden Sport Academy Santa Cruz • Guanacaste, Costa Rica
                </p>
                <p className="text-[10px] text-gray-400 italic">
                  Patrocinio Tecnológico Oficial por Curiol Studio
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🏀 *RECIBO OFICIAL DE PAGO - GOLDEN SPORT ACADEMY*\n\n` +
                  `• Atleta: ${receipt.playerName}\n` +
                  `• Periodo: ${receipt.month} ${receipt.year}\n` +
                  `• Monto: ₡${receipt.amount.toLocaleString("es-CR")}\n` +
                  `• Comprobante SINPE: #${receipt.sinpeReference}\n` +
                  `• Folio: ${receipt.receiptNumber}\n` +
                  `• Estado: AL DÍA ✅\n\n` +
                  `¡Gracias por apoyar a nuestra juventud dorada!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir Recibo por WhatsApp</span>
              </a>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReceipt(null);
                    setImageFile(null);
                    setImagePreview(null);
                    setImageBase64(null);
                    setManualReference("");
                  }}
                  className="flex-1 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 font-bold text-xs uppercase border border-gray-700 transition-colors"
                >
                  Reportar Otro Pago
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider text-center transition-all shadow-md"
                >
                  Ir al Inicio
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* FORMULARIO DE SUBIDA */
          <form
            onSubmit={handleSubmit}
            className="bg-dark-900 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
          >
            {/* Mensaje de Error */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs font-semibold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Paso 1: Seleccionar Atleta */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-golden-400 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                1. Selecciona a tu Hijo(a) / Atleta:
              </label>

              {/* Barra de Búsqueda Rápida */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre o teléfono del tutor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark-950 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-golden-400/80 mb-2"
                />
              </div>

              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                required
                className="w-full bg-dark-950 border border-gray-800 rounded-xl p-3 text-sm text-white font-medium focus:outline-none focus:border-golden-400"
              >
                <option value="">-- Elige el nombre del atleta --</option>
                {filteredPlayers.map((p) => (
                  <option key={p.id} value={p.id} className="bg-dark-900">
                    {p.fullName} (Tutor: {p.guardianName}) - {p.category}
                  </option>
                ))}
              </select>

              {selectedPlayer && (
                <div className="p-3 rounded-xl bg-dark-950/80 border border-gray-800 text-xs space-y-1 text-gray-300">
                  <p>
                    <span className="text-gray-400">Tutor Legal:</span>{" "}
                    <strong className="text-white">{selectedPlayer.guardianName}</strong> ({selectedPlayer.guardianPhone})
                  </p>
                  <p>
                    <span className="text-gray-400">Categoría:</span> {selectedPlayer.category}
                  </p>
                </div>
              )}
            </div>

            {/* Paso 2: Periodo */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-golden-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                2. Periodo de la Cuota:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-dark-950 border border-gray-800 rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-golden-400"
                >
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m) => (
                    <option key={m} value={m} className="bg-dark-900">
                      Mes: {m}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-dark-950 border border-gray-800 rounded-xl p-3 text-xs text-white font-bold focus:outline-none focus:border-golden-400"
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>
            </div>

            {/* Paso 3: Subida de Comprobante */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-golden-400 flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                3. Captura o Foto del SINPE Móvil:
              </label>

              {!imagePreview ? (
                <label className="border-2 border-dashed border-gray-700 hover:border-golden-500/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-dark-950 group">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-dark-800 group-hover:bg-golden-500/10 text-golden-400 flex items-center justify-center mb-3 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black text-white uppercase tracking-wide group-hover:text-golden-400">
                    Tocar aquí para Subir o Tomar Foto
                  </span>
                  <span className="text-[11px] text-gray-400 mt-1">
                    Cualquier banco: BCR, BNCR, BAC, Popular, Coopes, etc.
                  </span>
                </label>
              ) : (
                <div className="space-y-3 bg-dark-950 p-4 rounded-2xl border border-gray-800">
                  <div className="relative rounded-xl overflow-hidden max-h-64 flex justify-center bg-black">
                    <img
                      src={imagePreview}
                      alt="Comprobante seleccionado"
                      className="max-h-64 object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Foto cargada lista para escanear
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setImageBase64(null);
                      }}
                      className="text-red-400 hover:text-red-300 text-xs font-bold"
                    >
                      Cambiar Foto
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Paso 4: Referencia Opcional */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Número de Referencia SINPE (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ej: 984721 (Si la foto es clara, la IA lo leerá sola)"
                value={manualReference}
                onChange={(e) => setManualReference(e.target.value)}
                className="w-full bg-dark-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-golden-400"
              />
            </div>

            {/* Estado de Procesamiento */}
            {isProcessing && (
              <div className="p-4 rounded-2xl bg-golden-500/10 border border-golden-500/30 text-center space-y-2 animate-pulse">
                <Sparkles className="w-6 h-6 text-golden-400 mx-auto animate-spin" />
                <p className="text-xs font-black text-golden-300 uppercase tracking-wider">
                  {processStep}
                </p>
                <p className="text-[11px] text-gray-400">
                  Por favor espera un momento mientras validamos los datos...
                </p>
              </div>
            )}

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 ${
                isProcessing
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-golden-400 via-golden-500 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-950 shadow-golden-500/20"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>{isProcessing ? "Validando con IA..." : "Verificar y Enviar Comprobante"}</span>
            </button>

            {/* Datos Bancarios de Consulta Rápida */}
            <div className="pt-4 border-t border-gray-800/80 text-[11px] text-gray-400 space-y-1">
              <p className="font-bold text-gray-300">
                📌 Datos Oficiales de Depósito SINPE Móvil:
              </p>
              <p>• Teléfono: <strong className="text-golden-400">{settings.sinpePhone}</strong> ({settings.sinpeOwner})</p>
              <p>• Cuenta IBAN: {settings.ibanAccount} ({settings.bankName})</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ComprobantePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center space-y-4 text-white">
          <Sparkles className="w-8 h-8 text-golden-400 animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Cargando Portal de Comprobantes...
          </p>
        </div>
      }
    >
      <ComprobanteContent />
    </Suspense>
  );
}
