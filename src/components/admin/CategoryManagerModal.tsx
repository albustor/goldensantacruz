"use client";

import React, { useState } from "react";
import { X, Plus, Edit3, Trash2, Check, Tag, Sparkles } from "lucide-react";
import { Store } from "@/lib/store";

interface Props {
  categories: string[];
  isOpen: boolean;
  onClose: () => void;
  onCategoriesChange: (updated: string[]) => void;
}

export default function CategoryManagerModal({
  categories,
  isOpen,
  onClose,
  onCategoriesChange,
}: Props) {
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const updated = await Store.addCategory(newCatName.trim());
    onCategoriesChange(updated);
    setNewCatName("");
  };

  const handleStartEdit = (cat: string) => {
    setEditingCat(cat);
    setEditValue(cat);
  };

  const handleSaveEdit = async (oldName: string) => {
    if (!editValue.trim() || editValue.trim() === oldName) {
      setEditingCat(null);
      return;
    }
    const updated = await Store.updateCategory(oldName, editValue.trim());
    onCategoriesChange(updated);
    setEditingCat(null);
  };

  const handleDelete = async (cat: string) => {
    if (confirm(`¿Eliminar la categoría "${cat}"?`)) {
      const updated = await Store.deleteCategory(cat);
      onCategoriesChange(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-dark-900 border-2 border-golden-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-dark-800 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/20 text-golden-400 text-xs font-black uppercase">
            <Tag className="w-3.5 h-3.5" />
            <span>Gestor Oficial de Categorías</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            Administrar Categorías
          </h3>
          <p className="text-xs text-gray-400">
            Crea, edita o elimina las categorías disponibles para jugadores, partidos, álbumes y fotografías.
          </p>
        </div>

        {/* Formulario Agregar Nueva Categoría */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Nueva categoría (ej. U10 Femenino, Clínicas...)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-golden-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Crear</span>
          </button>
        </form>

        {/* Lista de Categorías Existentes */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-gray-300 uppercase block">
            Categorías Activas ({categories.length})
          </span>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div
                key={cat}
                className="p-3 rounded-xl bg-dark-800 border border-gray-800 flex items-center justify-between gap-3 hover:border-gray-700 transition-colors"
              >
                {editingCat === cat ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded-lg bg-dark-900 border border-golden-500 text-white text-xs"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(cat)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      title="Guardar Cambio"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCat(null)}
                      className="p-1.5 rounded-lg bg-dark-700 text-gray-400 hover:text-white text-xs"
                      title="Cancelar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-golden-400"></span>
                      <span className="text-xs font-bold text-white">{cat}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-golden-400 text-xs"
                        title="Editar nombre de categoría"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-white text-xs font-bold uppercase"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
