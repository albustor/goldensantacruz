"use client";

import React, { useState, useEffect } from "react";
import { Plus, Settings, Check, X, Tag } from "lucide-react";
import { Store } from "@/lib/store";
import CategoryManagerModal from "@/components/admin/CategoryManagerModal";

interface Props {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  onManageCategories?: () => void;
  onCategoriesChanged?: (updated: string[]) => void;
}

export default function CategorySelect({
  value,
  onChange,
  label = "Categoría",
  required = false,
  className = "",
  onManageCategories,
  onCategoriesChanged,
}: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isInlineAdding, setIsInlineAdding] = useState(false);
  const [newInlineCat, setNewInlineCat] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await Store.getCategories();
    setCategories(cats);
    if (!value && cats.length > 0) {
      onChange(cats[0]);
    }
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInlineCat.trim()) return;
    const updated = await Store.addCategory(newInlineCat.trim());
    setCategories(updated);
    onChange(newInlineCat.trim());
    setNewInlineCat("");
    setIsInlineAdding(false);
    onCategoriesChanged?.(updated);
  };

  const handleCategoriesChange = (updated: string[]) => {
    setCategories(updated);
    if (!updated.includes(value) && updated.length > 0) {
      onChange(updated[0]);
    }
    onCategoriesChanged?.(updated);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block font-bold text-gray-300 uppercase text-xs">
          {label} {required && "*"}
        </label>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setIsInlineAdding(!isInlineAdding)}
            className="text-golden-400 hover:text-golden-300 font-bold inline-flex items-center gap-0.5"
            title="Añadir una nueva categoría rápidamente"
          >
            <Plus className="w-3 h-3" />
            <span>Nueva</span>
          </button>
          <span className="text-gray-600">|</span>
          <button
            type="button"
            onClick={() => {
              if (onManageCategories) {
                onManageCategories();
              } else {
                setIsManagerOpen(true);
              }
            }}
            className="text-gray-400 hover:text-white inline-flex items-center gap-0.5"
            title="Gestionar, renombrar o eliminar categorías"
          >
            <Settings className="w-3 h-3" />
            <span>Editar/Borrar</span>
          </button>
        </div>
      </div>

      {isInlineAdding ? (
        <div className="flex gap-1.5 animate-fadeIn">
          <input
            type="text"
            placeholder="Nombre de la nueva categoría..."
            value={newInlineCat}
            onChange={(e) => setNewInlineCat(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-dark-900 border border-golden-500 text-white text-xs focus:outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={handleQuickAdd}
            className="px-3 py-2 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-900 font-black text-xs uppercase"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsInlineAdding(false)}
            className="px-2.5 py-2 rounded-xl bg-dark-800 text-gray-400 hover:text-white text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-3 py-2.5 rounded-xl bg-dark-800 border border-gray-700 text-white text-xs focus:border-golden-500 focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-dark-900 text-white">
              {cat}
            </option>
          ))}
        </select>
      )}

      {/* Modal de Gestión Completa de Categorías */}
      <CategoryManagerModal
        categories={categories}
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        onCategoriesChange={handleCategoriesChange}
      />
    </div>
  );
}
