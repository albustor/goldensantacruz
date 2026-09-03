"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Users, 
  Camera, 
  Maximize2,
  ArrowRight
} from "lucide-react";

const TEAM_PHOTOS = [
  { id: 1, src: "/Fotos_Equipo/1.jpg", title: "Atleta Golden Sport", category: "Categoría Formativa" },
  { id: 2, src: "/Fotos_Equipo/2.jpg", title: "Semillero Santa Bárbara", category: "Iniciación & Destreza" },
  { id: 3, src: "/Fotos_Equipo/3.jpg", title: "Garra & Disciplina", category: "Mini-Básquetbol" },
  { id: 4, src: "/Fotos_Equipo/4.jpg", title: "Fundamentos de Baloncesto", category: "Técnica Individual" },
  { id: 5, src: "/Fotos_Equipo/5.jpg", title: "Orgullo Santa Cruz", category: "Desarrollo de Atletas" },
  { id: 6, src: "/Fotos_Equipo/6.jpg", title: "Pasión Deportiva", category: "Semillero Infantil" },
  { id: 7, src: "/Fotos_Equipo/7.jpg", title: "Trabajo en Equipo", category: "Categorías Menores" },
  { id: 8, src: "/Fotos_Equipo/8.jpg", title: "Enfoque & Rendimiento", category: "Formación de Atletas" },
  { id: 9, src: "/Fotos_Equipo/9.jpg", title: "Talento Santacruceño", category: "Baloncesto Guanacaste" },
  { id: 10, src: "/Fotos_Equipo/10.jpg", title: "Fuerza & Velocidad", category: "Destreza en Cancha" },
  { id: 11, src: "/Fotos_Equipo/11.jpg", title: "Unión & Compromiso", category: "Cancha Santa Bárbara" },
  { id: 12, src: "/Fotos_Equipo/12.jpg", title: "Tiro & Precisión", category: "Clínicas Formativas" },
  { id: 13, src: "/Fotos_Equipo/13.jpg", title: "Entrega Total", category: "Semillero Golden" },
  { id: 14, src: "/Fotos_Equipo/14.jpg", title: "Valores & Deporte", category: "Formación Humana" },
  { id: 15, src: "/Fotos_Equipo/15.jpg", title: "Equipo Golden Sport", category: "Santa Cruz Guanacaste" },
  { id: 16, src: "/Fotos_Equipo/16.jpg", title: "Futuro del Básquetbol", category: "Orgullo Santacruceño" },
];

export default function TeamPhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TEAM_PHOTOS.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TEAM_PHOTOS.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 3800);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    }
    if (touchStartX - touchEndX < -50) {
      prevSlide();
    }
  };

  const currentPhoto = TEAM_PHOTOS[currentIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-3xl bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 border-2 border-golden-500/40 p-6 sm:p-10 shadow-2xl space-y-6">
        {/* Cabecera del Carrusel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-golden-500/15 text-golden-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nuestros Atletas • Golden Sport Academy Santa Cruz</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Galería Rotativa de <span className="text-golden-500">Integrantes</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Conoce a los niños y jóvenes que dan vida a nuestro proyecto deportivo en Santa Bárbara.
            </p>
          </div>

          {/* Controles de Reproducción */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-dark-950 hover:bg-dark-700 text-golden-400 border border-golden-500/30 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title={isPlaying ? "Pausar rotación" : "Reanudar rotación"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlaying ? "Pausar" : "Reproducir"}</span>
            </button>

            <Link
              href="/galeria"
              className="px-4 py-2.5 rounded-xl bg-golden-500 hover:bg-golden-400 text-dark-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
            >
              <Camera className="w-4 h-4" />
              <span>Ver Álbum Completo</span>
            </Link>
          </div>
        </div>

        {/* Marco Principal del Visor Rotativo con Transición Suave */}
        <div 
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-dark-950 border-2 border-golden-500/50 shadow-2xl group select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Imagen de Fondo Desenfoque para Atmósfera */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-110 transition-all duration-700"
            style={{ backgroundImage: `url(${currentPhoto.src})` }}
          />

          {/* Imagen Principal Centrada y Nítida */}
          <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
            <img
              key={currentPhoto.id}
              src={currentPhoto.src}
              alt={currentPhoto.title}
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-700 ease-in-out filter contrast-105 brightness-105"
            />
          </div>

          {/* Overlay con Información del Atleta */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-golden-500 text-dark-950 font-black text-[10px] sm:text-xs uppercase">
                {currentPhoto.category}
              </span>
              <h3 className="text-base sm:text-2xl font-black text-white uppercase drop-shadow-md">
                {currentPhoto.title} #{currentPhoto.id}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-300 font-medium">
                Golden Sport Academy Santa Cruz • Sede Santa Bárbara
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-black text-golden-400 bg-dark-900/90 px-3 py-1 rounded-full border border-golden-500/40">
                {currentIndex + 1} / {TEAM_PHOTOS.length}
              </span>
            </div>
          </div>

          {/* Flechas de Navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-950/80 hover:bg-golden-500 hover:text-dark-950 text-white border border-golden-500/40 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xl"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-dark-950/80 hover:bg-golden-500 hover:text-dark-950 text-white border border-golden-500/40 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xl"
            aria-label="Foto siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Tiras de Miniaturas Inferiores para Navegación Rápida */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TEAM_PHOTOS.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                currentIndex === idx
                  ? "border-golden-500 scale-105 shadow-lg shadow-golden-500/30 ring-2 ring-golden-400/50"
                  : "border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-600"
              }`}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 bg-dark-950/80 text-[9px] font-bold text-white px-1 rounded-tl">
                {photo.id}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
