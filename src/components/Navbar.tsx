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

  interface NavLinkItem {
    name: string;
    href: string;
    isLiveLink?: boolean;
    isPaused?: boolean;
  }

  const navLinks: NavLinkItem[] = [
    { name: "Inicio", href: "/" },
    { name: "En Vivo", href: "/en-vivo", isLiveLink: true, isPaused: true },
    { name: "Información", href: "/informacion" },
    { name: "Calendario", href: "/calendario" },
    { name: "Fotografías", href: "/galeria" },
    { name: "Publicidad", href: "/patrocinadores" },
  ];

  const renderLinkContent = (link: NavLinkItem) => {
    if (link.isLiveLink && link.isPaused) {
      return (
        <span className="inline-flex items-center justify-center gap-1.5 uppercase tracking-wider font-bold">
          <span>En Vivo</span>
          <span className="px-1.5 py-0.5 rounded-md bg-dark-800 text-[9px] font-black text-amber-400/90 border border-amber-500/30 uppercase leading-none">
            Pausa
          </span>
        </span>
      );
    }
    if (link.isLiveLink) {
      return (
        <span className="inline-flex items-center justify-center gap-0.5 uppercase tracking-wider font-black">
          <span>EN VIV</span>
          <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 shadow-[0_0_8px_rgba(239,68,68,1)]" />
          </span>
        </span>
      );
    }
    return link.name;
  };

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
          <nav className="hidden md:flex flex-1 items-center justify-center max-w-3xl mx-auto gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-dark-900/70 border border-gray-800/80 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex-1 text-center py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-golden-500 text-dark-950 shadow-md shadow-golden-500/30 font-black scale-102"
                      : link.isPaused
                      ? "text-gray-400 hover:text-golden-300 hover:bg-dark-800/80"
                      : "text-gray-200 hover:text-golden-400 hover:bg-dark-800/80"
                  }`}
                >
                  {renderLinkContent(link)}
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
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-golden-500 text-dark-950"
                    : link.isPaused
                    ? "text-gray-300 hover:bg-dark-800 hover:text-golden-400"
                    : "text-gray-200 hover:bg-dark-800 hover:text-golden-400"
                }`}
              >
                <span>{link.name}</span>
                {link.isPaused ? (
                  <span className="px-2 py-0.5 rounded-md bg-dark-900 text-[10px] font-black text-amber-400 border border-amber-500/30">
                    En Pausa
                  </span>
                ) : link.isLiveLink ? (
                  <span className="relative inline-flex items-center justify-center w-2.5 h-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                  </span>
                ) : null}
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
