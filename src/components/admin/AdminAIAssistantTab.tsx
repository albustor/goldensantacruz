"use client";

import React, { useState } from "react";
import { Sparkles, Send, Copy, CheckCircle2, Bot, Flame, MessageSquare, Trophy } from "lucide-react";

export default function AdminAIAssistantTab() {
  const [docType, setDocType] = useState<"comunicado" | "partido" | "cobro">("comunicado");
  const [promptDetails, setPromptDetails] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [provider, setProvider] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCopied(false);

    try {
      let systemPrompt = "";
      if (docType === "comunicado") {
        systemPrompt = `Redacta un comunicado oficial y motivador para el grupo de WhatsApp de padres de familia de la academia de básquetbol "Golden Sport Academy Santa Cruz" (Guanacaste, Costa Rica). Tema o detalles: ${promptDetails}. Usa emojis deportivos, tono profesional pero cercano y cordial.`;
      } else if (docType === "partido") {
        systemPrompt = `Redacta una crónica emocionante y nota para redes sociales del partido de Golden Sport Academy Santa Cruz. Detalles: ${promptDetails}. Resalta el esfuerzo del equipo y agradece a los aficionados.`;
      } else {
        systemPrompt = `Redacta un mensaje cortés y formal de recordatorio de cuota mensual para padres de familia de Golden Sport Academy Santa Cruz. Detalles: ${promptDetails}.`;
      }

      const res = await fetch("/api/ia/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: systemPrompt,
          type: docType,
          details: promptDetails,
        }),
      });

      const data = await res.json();
      setGeneratedText(data.text || "");
      setProvider(data.provider || "Motor Golden AI");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(generatedText)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded bg-golden-500/20 text-golden-400 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inteligencia Artificial Multicapa</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
            Redactor Inteligente de Comunicados & Crónicas
          </h2>
          <p className="text-xs text-gray-400">
            Genera textos listos para WhatsApp, notas de prensa y avisos a padres en segundos con IA.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-dark-800 border border-gray-800 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
              Tipo de Redacción
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDocType("comunicado")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  docType === "comunicado"
                    ? "bg-golden-500 text-dark-900 shadow-md"
                    : "bg-dark-900 text-gray-400 border border-gray-700"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Comunicado</span>
              </button>

              <button
                type="button"
                onClick={() => setDocType("partido")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  docType === "partido"
                    ? "bg-golden-500 text-dark-900 shadow-md"
                    : "bg-dark-900 text-gray-400 border border-gray-700"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Crónica Partido</span>
              </button>

              <button
                type="button"
                onClick={() => setDocType("cobro")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  docType === "cobro"
                    ? "bg-golden-500 text-dark-900 shadow-md"
                    : "bg-dark-900 text-gray-400 border border-gray-700"
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Aviso Especial</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
              Detalles o Puntos Clave *
            </label>
            <textarea
              rows={5}
              required
              placeholder="Ej. Este sábado hay partido contra Nicoya en el Gimnasio Municipal a las 10am. Llegar 30 minutos antes con uniforme negro y botella con agua."
              value={promptDetails}
              onChange={(e) => setPromptDetails(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-dark-900 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-golden-500 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-900 font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Redactando con IA..." : "Generar Texto Profesional"}
          </button>
        </form>

        {/* Output */}
        <div className="p-6 rounded-3xl bg-dark-800 border border-gray-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-golden-400" />
                Texto Generado
              </span>
              {provider && (
                <span className="text-[10px] text-golden-400 font-bold bg-golden-500/10 px-2 py-0.5 rounded border border-golden-500/20">
                  {provider}
                </span>
              )}
            </div>

            {generatedText ? (
              <div className="bg-dark-900 p-4 rounded-2xl border border-gray-700 text-xs text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[350px] overflow-y-auto">
                {generatedText}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500 text-xs">
                Ingresa los detalles a la izquierda y presiona "Generar Texto Profesional" para obtener un comunicado listo para WhatsApp.
              </div>
            )}
          </div>

          {generatedText && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 rounded-xl bg-dark-700 hover:bg-dark-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "¡Copiado!" : "Copiar Texto"}</span>
              </button>

              <button
                onClick={handleSendWhatsApp}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Enviar a Grupo WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
