"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Shield 
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Información", href: "/informacion" },
    { name: "Calendario", href: "/calendario" },
    { name: "Fotografías", href: "/galeria" },
    { name: "Publicidad", href: "/patrocinadores" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-dark-950/95 backdrop-blur-md border-b border-golden-500/30 shadow-2xl py-2.5"
          : "bg-gradient-to-b from-dark-950/90 via-dark-950/70 to-transparent py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Oficial con Nombre Completo: Golden Sport Academy Santa Cruz */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group shrink-0" 
            title="Golden Sport Academy Santa Cruz"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-dark-900 border-2 border-golden-500 p-1 flex items-center justify-center shadow-lg shadow-golden-500/25 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="Golden Sport Academy Santa Cruz"
                width={52}
                height={52}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs sm:text-sm font-black tracking-tight text-white uppercase group-hover:text-golden-400 transition-colors leading-tight">
                Golden Sport Academy
              </span>
              <span className="text-[10px] font-black tracking-widest text-golden-400 uppercase leading-none">
                Santa Cruz
              </span>
            </div>
          </Link>

          {/* Menú Desktop con Distribución Uniforme */}
          <nav className="hidden md:flex flex-1 items-center justify-center max-w-3xl mx-auto gap-2 p-1.5 rounded-2xl bg-dark-900/70 border border-gray-800/80 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex-1 text-center py-2 px-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-golden-500 text-dark-950 shadow-md shadow-golden-500/30 font-black scale-102"
                      : "text-gray-200 hover:text-golden-400 hover:bg-dark-800/80"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Acceso Admin a la Derecha */}
          <div className="hidden md:flex items-center shrink-0">
            <Link
              href="/admin"
              className={`px-3.5 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-1.5 border transition-all ${
                pathname === "/admin"
                  ? "bg-golden-500 text-dark-950 border-golden-500 font-black shadow-md shadow-golden-500/30"
                  : "bg-dark-800 hover:bg-dark-700 text-golden-400 border-golden-500/30"
              }`}
              title="Portal Administrativo"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-dark-800 text-golden-400 border border-golden-500/30"
              title="Admin"
            >
              <Shield className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-dark-800 text-golden-400 hover:text-white border border-golden-500/30"
              aria-label="Abrir Menú"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-950/98 border-b border-golden-500/40 px-5 pt-4 pb-6 space-y-2 shadow-2xl animate-fadeIn">
          <div className="pb-2 border-b border-gray-800 text-center">
            <span className="text-xs font-black text-golden-400 uppercase tracking-widest block">
              Golden Sport Academy Santa Cruz
            </span>
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-golden-500 text-dark-950"
                    : "text-gray-200 hover:bg-dark-800 hover:text-golden-400"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider bg-dark-800 text-golden-400 border border-golden-500/30"
          >
            Portal Administrativo (Admin)
          </Link>
        </div>
      )}
    </header>
  );
}
