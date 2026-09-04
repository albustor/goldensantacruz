"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Phone, Send } from "lucide-react";
import confetti from "canvas-confetti";
import { PlayerCategory } from "@/types";
import { Store } from "@/lib/store";
import { INITIAL_CATEGORIES } from "@/lib/initialData";

export default function RegistrationSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);

  const [formData, setFormData] = useState({
    studentName: "",
    birthDate: "",
    category: INITIAL_CATEGORIES[0] || "Iniciación / Menores de U8 (U6-U8)",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    medicalNotes: "",
  });

  useEffect(() => {
    Store.getCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
        setFormData(prev => ({
          ...prev,
          category: cats.includes(prev.category) ? prev.category : cats[0]
        }));
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#f59e0b", "#d97706", "#fbbf24", "#ffffff"],
        });
      } catch (err) {}
    }, 600);
  };

  return (
    <section id="inscribirse" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
      <div className="rounded-3xl bg-gradient-to-b from-dark-800 via-dark-800 to-dark-900 border-2 border-golden-500/50 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inscripciones Santa Bárbara</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Pre-Inscripción de Atleta
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
            Desde <strong>menores de U8</strong> hasta <strong>Juvenil U18</strong>. Ingrese los datos y le contactaremos para la primera clase de prueba en Santa Bárbara.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-10 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">
              ¡Pre-Inscripción Registrada!
            </h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto">
              Muchas gracias por confiar en Golden Sport Academy Santa Cruz. Hemos registrado los datos de <strong>{formData.studentName}</strong>.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/50662806989?text=Hola%20Golden%20Sport%20Academy,%20acabo%20de%20realizar%20la%20pre-inscripción%20para%20${encodeURIComponent(formData.studentName)}%20(Categoría:%20${encodeURIComponent(formData.category)})`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Confirmar por WhatsApp al 6280-6989
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    studentName: "",
                    birthDate: "",
                    category: "Iniciación / Menores de U8 (U6-U8)",
                    guardianName: "",
                    guardianPhone: "",
                    guardianEmail: "",
                    medicalNotes: "",
                  });
                }}
                className="px-5 py-3 rounded-xl bg-dark-700 text-gray-300 font-bold text-xs uppercase hover:bg-dark-600"
              >
                Registrar otro Atleta
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Nombre Completo del Atleta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Thiago Pérez Briceño"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-golden-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-golden-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Categoría de Interés *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as PlayerCategory })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-gray-700 text-white focus:outline-none focus:border-golden-500 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Nombre del Padre / Tutor Legal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Jenny Briceño"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-golden-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Teléfono Celular / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 6280-6989"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-golden-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="tucorreo@gmail.com"
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/90 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-golden-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Observaciones Médicas / Alergias (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="¿Alguna condición médica o alergia importante a tomar en cuenta?"
                value={formData.medicalNotes}
                onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900/90 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-golden-500 text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-[11px] text-gray-400">
                🔒 Ubicación: Santa Bárbara de Santa Cruz, Guanacaste.
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-golden-400 to-golden-600 hover:from-golden-300 hover:to-golden-500 text-dark-900 font-black text-sm uppercase tracking-wider shadow-xl shadow-golden-500/25 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Enviando..." : "Enviar Pre-Inscripción"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
