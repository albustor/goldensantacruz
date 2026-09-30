# Memoria Técnica y Registro de Decisiones de Arquitectura — Memoria.md
# Proyecto: Golden Sport Academy Santa Cruz (Guanacaste, Costa Rica)
*Última Actualización: 2026-09-30 | Auditor Técnico: Jim (Curiol Studio)*

---

## 1. Resumen Ejecutivo y Ficha Técnica del Proyecto

Golden Sport Academy Santa Cruz es una aplicación web y PWA de alto rendimiento desarrollada para la academia formativa de baloncesto en Santa Cruz, Guanacaste. Centraliza la experiencia de atletas, padres de familia, cuerpo técnico y directiva.

- **Identificador CuriolHub**: `Golden Sport Academy`
- **Categoría**: Proyectos / Deportes y Academia Phygital
- **Puerto Local Oficial**: `3010` (`npm run dev -p 3010` o `npm run dev`)
- **Framework Web**: Next.js 14.2.15 (App Router, React 18, TypeScript 5)
- **Motor de Estilos**: Tailwind CSS 3.4 con diseño responsive Mobile-First (iOS WebKit / Android Chromium)
- **Base de Datos & Backend**: Supabase (PostgreSQL 15, Storage, Row Level Security)
- **Librerías Clave**: Framer Motion (animaciones e interactividad), Lucide React (iconografía deportiva y UI), Canvas Confetti (celebraciones en pagos/victorias).

---

## 2. Mapa de Rutas y Módulos de la Aplicación

| Ruta | Propósito | Acceso | Tecnologías / Integraciones |
| :--- | :--- | :--- | :--- |
| `/` | Portal Institucional, filosofía, categorías, horarios, sedes (Waze/Maps), pre-inscripción online | Público | Hero dinámico, enlaces a Waze/Maps, WhatsApp |
| `/calendario` | Convocatorias de partidos, sedes, resultados finales y crónicas deportivas | Público | Filtros por categoría y estado (Próximos/Finalizados) |
| `/galeria` | Álbum fotográfico comunitario por fecha y evento, visor Lightbox, Likes ❤️ | Público / Padres | Subida directa desde móvil, Supabase Storage, moderación |
| `/patrocinadores`| Vitrina comercial de aliados (Nivel Oro, Plata, Bronce) y "Golden Studio" | Público | Enlace comercial a WhatsApp, servicios fotográficos |
| `/en-vivo` | Transmisión multi-cámara en directo, marcador en tiempo real y chat comunitario *(Temporalmente en Pausa)* | Público / Familias | Multi-feed GoPro/DJI, Bunny CDN HLS, PiP, Marcador en Vivo |
| `/admin` | Panel de control integral para cuerpo técnico y directiva | Protegido (PIN Directiva) | Gestión de atletas, cobros, partidos, moderación, streaming y redacción IA |

---

## 3. Esquema de Persistencia y Base de Datos (Supabase)

El esquema relacional oficial reside en [supabase_schema.sql](file:///d:/AntigravityFinal/GoldenSportAcademy/supabase_schema.sql).

### Tablas Principales:
1. **`players`**: Atletas activos, fecha de nacimiento, categoría, dorsal, tutor, contacto, cuota mensual (₡18,000 por defecto) y día de cobro (día 5).
2. **`payment_records`**: Control mensual individualizado (`month`, `month_index`, `year`, `amount`, `status`: `paid`, `pending`, `overdue`, `receipt_url`).
3. **`matches`**: Programación deportiva (`opponent`, `category`, `match_date`, `match_time`, `location`, `location_url`, `home_away`, `score_golden`, `score_opponent`, `status`).
4. **`gallery_albums`** y **`gallery_photos`**: Álbumes y fotografías con metadatos de evento, subidas por padres o staff, con estado `is_approved` para moderación previa.
5. **`sponsors`**: Patrocinadores comerciales ordenados por categoría (`oro`, `plata`, `bronce`) con logos y enlaces.
6. **`inquiries_registrations`**: Formularios de pre-inscripción recibidos desde el portal público.

### Almacenamiento (Supabase Storage):
- Bucket público: `gallery` (fotografías comunitarias y de partidos).
- Buckets operativos auxiliares: `sponsor-logos`, `receipts`.

---

## 4. Registro de Decisiones de Arquitectura (ADR)

### ADR-001: Autenticación Administrativa por PIN de Directiva
- **Contexto**: Los entrenadores y delegados en cancha requieren acceso ágil desde smartphones en entornos deportivos con guantes o premura de tiempo, donde logins con contraseñas complejas o enlaces mágicos por email generan fricción.
- **Decisión**: Implementar autenticación directa por PIN de directiva (`2026`) para el acceso a `/admin`, persistida en sesión segura de navegador.
- **Consecuencia**: Entrada instantánea en campo. Cualquier modificación a permisos de superusuario debe conservar este acceso sin fricción.

### ADR-002: Formato Formal de Cobranzas por WhatsApp
- **Contexto**: La academia depende del cobro puntual de mensualidades a través de SINPE Móvil y transferencias bancarias.
- **Decisión**: El botón de cobranza genera un enlace directo `https://wa.me/{phone}?text=...` con un payload formal predefinido:
  - Nombre del atleta y categoría.
  - Mes y año del cobro.
  - Monto exacto en Colones costarricenses (₡).
  - Número institucional de SINPE Móvil y cuenta IBAN.
- **Regla Inmutable**: Nunca sustituir este formato por mensajes informales o enlaces genéricos sin los datos bancarios.

### ADR-003: Galería Abierta con Moderación Previa
- **Contexto**: Los padres de familia desean compartir fotos tomadas desde las gradas en partidos y giras, pero debe protegerse la imagen institucional contra fotos inapropiadas o desenfocadas.
- **Decisión**: Carga libre desde el móvil en `/galeria` vinculando fecha y título de evento. Las fotos entran con flag de moderación que el administrador aprueba o descarta con un clic desde `/admin`.

### ADR-004: Cascada Multi-Proveedor para Generación de Comunicados IA
- **Contexto**: La academia emite comunicados a padres y crónicas de partidos. No se debe depender de un único proveedor de IA en caso de saturación o límite de cuota.
- **Decisión**: Arquitectura en cascada:
  1. Google Gemini (`gemini-3.6-flash` / `gemini-3.5-flash`).
  2. Fallback a Groq LPU (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`).
  3. Fallback a OpenRouter (Qwen / DeepSeek).

### ADR-005: Puerto Fijo de Desarrollo 3010
- **Contexto**: El ecosistema CuriolHub orquesta múltiples proyectos en paralelo en puertos preasignados para evitar colisiones.
- **Decisión**: Golden Sport Academy corre exclusivamente en el puerto `3010` (`"dev": "next dev -p 3010"`).

### ADR-006: Módulo de Transmisión Multi-Cámara y Pausa de Navegación Pública
- **Contexto**: El sistema cuenta con una infraestructura completa de transmisión deportiva en vivo (GoPro HERO 12 táctica + DJI Osmo Pocket para seguimiento en cancha + marcador digital en tiempo real + chat familiar). A petición de la directiva, el acceso público a las transmisiones se pausa temporalmente hasta la programación del próximo evento oficial.
- **Decisión**:
  1. Desacoplar los enlaces y botones públicos (`Navbar.tsx`, `HeroSection.tsx`, `MatchBanner.tsx`) para no generar tráfico innecesario ni expectativas en momentos sin señal en vivo.
  2. Activar la bandera `IS_LIVE_STREAM_BLOCKED = true` en `src/app/en-vivo/page.tsx`, mostrando una pantalla institucional de *Señal en Mantenimiento* que redirige limpiamente a `/calendario` y `/galeria`.
  3. Mantener el panel administrativo `AdminLiveStreamTab.tsx` 100% operativo en `/admin` bajo la etiqueta `Transmisión (En Pausa)` para pruebas internas y configuración previa por parte del staff técnico.
- **Protocolo de Reactivación**:
  - Cambiar `IS_LIVE_STREAM_BLOCKED = false` en `src/app/en-vivo/page.tsx`.
  - Reintegrar `{ name: "En Vivo", href: "/en-vivo", isLiveLink: true }` en `Navbar.tsx`.
  - Reincorporar los botones de acción en `HeroSection.tsx` y `MatchBanner.tsx`.

---

## 5. Checklist para Retomar el Proyecto en Futuras Sesiones

Al iniciar una nueva sesión de desarrollo o mantenimiento, el agente o desarrollador debe ejecutar la siguiente secuencia de verificación:

- [ ] **1. Verificación de Entorno**: Comprobar que `.env.local` contenga `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] **2. Ejecución Local**: Levantar el servidor con `npm run dev` y confirmar que responde en `http://localhost:3010`.
- [ ] **3. Integridad de Tipos**: Correr `npm run build` para asegurar que no existan errores de compilación TypeScript.
- [ ] **4. Paridad con Supabase**: Si se agregan campos a jugadores o partidos, reflejarlos tanto en [supabase_schema.sql](file:///d:/AntigravityFinal/GoldenSportAcademy/supabase_schema.sql) como en las interfaces TypeScript correspondientes.
- [ ] **5. Respeto al Safety Lock**: Presentar ruta, líneas exactas y justificación técnica antes de cualquier edición en disco.
- [ ] **6. Estado de Transmisiones**: Verificar en `AGENTS.md` y `MEMORIA.md` si el módulo `/en-vivo` permanece en pausa o si se requiere reactivar para una fecha de juego.
