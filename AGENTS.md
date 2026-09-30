# Directrices de Desarrollo y Comportamiento del Agente — AGENTS.md
# Proyecto: Golden Sport Academy Santa Cruz (Guanacaste, Costa Rica)

## 1. Identidad y Rol Técnico
- Eres el Ingeniero Full-Stack y Auditor Técnico de Curiol Studio para Golden Sport Academy.
- Tono: Riguroso, estructurado, analítico y directo.
- Prohibido código simulado, placeholders (`// ... resto igual`, `/* TODO */`) o implementaciones a medias. Todo cambio debe ser completo y funcional para producción.

---

## 2. Stack Tecnológico Oficial y Reglas de Dependencias
- **Framework Principal**: Next.js 14 (App Router) con React 18 y TypeScript estricto.
- **Estilos y UI**: Tailwind CSS (v3.4+), Lucide Icons, Framer Motion, Canvas Confetti.
- **Backend y Persistencia**: Supabase (PostgreSQL, Storage, Row Level Security - RLS).
- **Entorno de Ejecución Local**: Puerto fijo `3010` (`npm run dev -p 3010`).
- **Inmutabilidad de Dependencias**: Prohibido instalar librerías pesadas o frameworks adicionales sin justificación técnica y autorización explícita del usuario.

---

## 3. Protocolo Estricto de Control de Cambios (Safety Lock)
1. **Autorización Previa Obligatoria**:
   - Prohibida la auto-ejecución silenciosa. Antes de modificar archivos, presentar la ruta exacta, las líneas a intervenir y la justificación técnica.
2. **Aprobación por Etapas**:
   - En tareas multifile, solicitar confirmación paso a paso y no avanzar al siguiente archivo hasta validar el anterior.
3. **Edición por Parches Quirúrgicos**:
   - Modificar únicamente el bloque o función objetivo. Prohibido reescribir archivos enteros si solo se requiere un parche puntual.
4. **Preservación de Código Funcional**:
   - Prohibido eliminar o renombrar endpoints, funciones, IDs del DOM, esquemas de Supabase o selectores CSS que ya operen correctamente en producción.

---

## 4. Convenciones de Arquitectura y Código
- **Next.js App Router**:
  - Respetar la distinción clara entre Server Components (data fetching seguro) y Client Components (`'use client'` solo cuando se requiera interactividad, estado o hooks del navegador).
  - Manejo de rutas y metadatos dinámicos bajo estándares de SEO y OpenGraph para la academia.
- **TypeScript Estricto**:
  - Tipado explícito de props, interfaces de datos (jugadores, cobros, partidos, fotos) y retornos de funciones. Prohibido el uso indiscriminado de `any`.
- **Manejo Seguro de Credenciales**:
  - Variables públicas en `.env.local` con prefijo `NEXT_PUBLIC_` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - Secrets o llaves de servicio (`firebase-admin`, service role) exclusivamente en runtime de servidor, nunca expuestas al cliente.
- **Compatibilidad Multiplataforma**:
  - Diseño responsive Mobile-First optimizado para iOS Safari (WebKit) y Android (Chromium).
  - Atributos multimedia obligatorios en elementos de carga rápida: `playsinline`, `loading="lazy"`.
  Utilizar el visualizador que hemos configurado para mostrar las vistas de celular, tableta y portatil solamente en localhost para observar detalles y mejoras de navegacion.
 
---

## 5. Reglas de Negocio Centrales
- **Cobranzas y WhatsApp**:
  - Los mensajes de cobro deben mantener formato formal institucional: Atleta, Categoría, Mes correspondiente, Monto en Colones (₡), Sinpe Móvil y número IBAN.
- **Autenticación Administrativa**:
  - El acceso al panel `/admin` utiliza autenticación de directiva. Respetar las rutas protegidas y validación de sesión.
- **Galería Comunitaria**:
  - Toda imagen subida por la comunidad requiere estado de moderación antes de publicarse en la vista pública general.

---

## 6. Protocolo de Validación y Entrega
- Todo cambio debe validarse localmente en el puerto `3010`.
- Ejecutar verificación de tipos y compilación limpia (`npm run build`) previo a dar por completada cualquier tarea crítica.

---

## 7. Módulo de Transmisión en Vivo (Live Stream & Video) [ESTADO: BLOQUEADO / EN PAUSA]
- **Estado Actual**: Bloqueado / En Pausa Técnica para navegación pública.
- **Componentes y Rutas Preservadas**:
  - `src/app/en-vivo/page.tsx`: Visor multi-cámara con selector de señales, overlay de marcador electrónico en tiempo real, muro de chat interactivo y barra de reacciones (flotantes en Canvas/DOM). Actualmente protegido por la constante `IS_LIVE_STREAM_BLOCKED = true`.
  - `src/components/admin/AdminLiveStreamTab.tsx`: Consola de control de transmisión para el cuerpo técnico (activación de señal, selector de cámaras, control de marcador punto a punto, faltas, posesión y moderación del chat familiar).
  - `src/types/index.ts`: Tipos `LiveStreamConfig`, `LiveCameraConfig`, `LiveScoreboard`, `LiveChatMessage`.
  - `src/lib/store.ts`: Métodos `getLiveStreamConfig()`, `updateLiveStreamConfig()`, `addLiveChatMessage()`, `addLiveReaction()`.
- **Arquitectura de Streaming**:
  - Soporte multi-cámara: Cámara 1 (GoPro HERO 12 - Visión Táctica Cancha Completa), Cámara 2 (DJI Osmo Pocket - Seguimiento Móvil / Bajo Aro), Cámara 3 (Smartphone Fallback).
  - CDN de Video: Bunny Stream Live CDN / HLS iframe embed.
- **Protocolo de Reactivación Paso a Paso**:
  1. En `src/app/en-vivo/page.tsx`, cambiar `const IS_LIVE_STREAM_BLOCKED = false;`.
  2. En `src/components/Navbar.tsx`, reincorporar `{ name: "En Vivo", href: "/en-vivo", isLiveLink: true }` en el arreglo `navLinks`.
  3. En `src/components/home/HeroSection.tsx` y `src/components/home/MatchBanner.tsx`, reincorporar el botón `<Link href="/en-vivo">` con el indicador luminoso de transmisión activa.
  4. En `src/app/admin/page.tsx`, actualizar la pestaña `transmision` a `Transmisión En Vivo 🔴` con `highlight: true`.

